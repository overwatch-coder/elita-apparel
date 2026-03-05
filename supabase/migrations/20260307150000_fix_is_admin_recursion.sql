-- Migration: Fix recursion in is_admin()
-- This migration redefines is_admin() to avoid querying the profiles table directly,
-- thus breaking the infinite recursion loop in RLS policies.

-- 1. Redefine is_admin to be recursion-safe
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- 1. Check JWT metadata first (fastest)
  IF (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' THEN
    RETURN TRUE;
  END IF;

  -- 2. Check auth.users table (safe for SECURITY DEFINER)
  -- This avoids recursion because we query the 'auth' schema, not 'public.profiles'
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND (raw_user_meta_data->>'role') = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Ensure profiles role is synced to metadata for reliability
-- This trigger will update the auth.users metadata whenever the profile role changes.
CREATE OR REPLACE FUNCTION public.sync_profile_role()
RETURNS trigger AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = 
    COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_strip_nulls(jsonb_build_object('role', NEW.role))
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_sync_profile_role ON public.profiles;
CREATE TRIGGER tr_sync_profile_role
AFTER UPDATE OF role OR INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_profile_role();

-- 3. Initial sync for existing admin profiles
-- This ensures all current admins have the metadata set.
DO $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN SELECT id, role FROM public.profiles WHERE role = 'admin' LOOP
    UPDATE auth.users
    SET raw_user_meta_data = 
      COALESCE(raw_user_meta_data, '{}'::jsonb) || 
      jsonb_build_object('role', profile_record.role)
    WHERE id = profile_record.id;
  END LOOP;
END;
$$;

-- 4. Update problematic policies to use recursion-safe is_admin()
-- profiles table
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;
CREATE POLICY "Admins can manage profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- addresses table
DROP POLICY IF EXISTS "Admins can view all addresses" ON public.addresses;
CREATE POLICY "Admins can view all addresses"
  ON public.addresses FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- contact_messages table
DROP POLICY IF EXISTS "Admins can manage contact messages" ON public.contact_messages;
CREATE POLICY "Admins can manage contact messages"
  ON public.contact_messages FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
