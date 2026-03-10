-- Migration: Consolidate and Robustify Auth Triggers
-- This migration merges handle_new_user and link_guest_data_on_signup into one clear flow.
-- It also adds error handling to ensure failures in linking guest data don't block user signup.

-- 1. Create the unified trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user_setup()
RETURNS trigger AS $$
DECLARE
  new_role TEXT;
  o_rec RECORD;
BEGIN
  -- A. Determine Role
  new_role := COALESCE(new.raw_user_meta_data->>'role', 'customer');
  IF new_role NOT IN ('admin', 'customer') THEN
    new_role := 'customer';
  END IF;

  -- B. Create Profile (Crucial Step)
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new_role
  )
  ON CONFLICT (id) DO NOTHING;

  -- C. Link Guest Data (Optional/Enhancement Step - wrapped in EXCEPTION)
  BEGIN
    IF new.email IS NOT NULL THEN
      -- 1. Link past guest orders (Case-insensitive)
      UPDATE public.orders
      SET user_id = NEW.id
      WHERE LOWER(TRIM(customer_email)) = LOWER(TRIM(NEW.email))
        AND user_id IS NULL;

      -- 2. Link WhatsApp orders (Case-insensitive)
      -- Using a sub-block to handle cases where whatsapp_orders might not exist or lacks guest_email
      BEGIN
        UPDATE public.whatsapp_orders
        SET user_id = NEW.id
        WHERE LOWER(TRIM(guest_email)) = LOWER(TRIM(NEW.email))
          AND user_id IS NULL;
      EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Could not link WhatsApp orders: %', SQLERRM;
      END;

      -- 3. Create default address if orders were linked
      SELECT * INTO o_rec
      FROM public.orders
      WHERE user_id = NEW.id
      ORDER BY created_at DESC
      LIMIT 1;

      IF FOUND THEN
        -- Only insert if doesn't already have default address
        IF NOT EXISTS (SELECT 1 FROM public.addresses WHERE user_id = NEW.id AND is_default = true) THEN
          INSERT INTO public.addresses (
            user_id, full_name, phone, address_line_1, address_line_2,
            city, region, country, is_default
          ) VALUES (
            NEW.id,
            COALESCE(o_rec.customer_name, new.raw_user_meta_data->>'full_name', 'User'),
            COALESCE(o_rec.customer_phone, ''),
            COALESCE(o_rec.shipping_address, 'N/A'),
            NULL,
            COALESCE(o_rec.shipping_city, 'N/A'),
            o_rec.shipping_state,
            COALESCE(o_rec.shipping_country, 'Ghana'),
            true
          );
        END IF;
      END IF;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Log error or just ignore so signup isn't blocked
    RAISE WARNING 'Error in link_guest_data_on_signup: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop old triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_link_data ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_signup_complete ON auth.users;

-- 3. Create the single consolidated trigger
CREATE TRIGGER on_auth_user_signup_complete
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_setup();

-- 4. Ensure sync_profile_role is robust (recursion check)
CREATE OR REPLACE FUNCTION public.sync_profile_role()
RETURNS trigger AS $$
BEGIN
  -- Only update if role actually changed or is new
  -- This helps prevent some unnecessary overhead
  UPDATE auth.users
  SET raw_user_meta_data = 
    COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_strip_nulls(jsonb_build_object('role', NEW.role))
  WHERE id = NEW.id
    AND (raw_user_meta_data->>'role' IS NULL OR raw_user_meta_data->>'role' != NEW.role);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
