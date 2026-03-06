-- Create the function to link guest orders and addresses
CREATE OR REPLACE FUNCTION public.link_guest_data_on_signup()
RETURNS trigger AS $$
DECLARE
  o_rec RECORD;
BEGIN
  -- 1. Link any past guest orders matching the new user's email
  UPDATE public.orders
  SET user_id = NEW.id
  WHERE customer_email = NEW.email
    AND user_id IS NULL;

  -- 2. Create a default address if orders were found and linked
  -- Get the most recent linked order
  SELECT * INTO o_rec
  FROM public.orders
  WHERE user_id = NEW.id
  ORDER BY created_at DESC
  LIMIT 1;

  IF FOUND THEN
    INSERT INTO public.addresses (
      user_id, full_name, phone, address_line_1, address_line_2,
      city, region, country, is_default
    ) VALUES (
      NEW.id,
      o_rec.customer_name,
      COALESCE(o_rec.customer_phone, ''),
      o_rec.shipping_address,
      NULL,
      o_rec.shipping_city,
      o_rec.shipping_state,
      COALESCE(o_rec.shipping_country, 'Ghana'),
      true
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists to be safe
DROP TRIGGER IF EXISTS on_auth_user_created_link_data ON auth.users;

-- Bind the trigger function on auth.users for any new signups
CREATE TRIGGER on_auth_user_created_link_data
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.link_guest_data_on_signup();
