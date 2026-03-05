-- Migration: Merge admin_users into profiles and simplify is_admin()
-- This migration consolidates user roles into the profiles table and removes the redundant admin_users table.

-- 1. Ensure all admin users have a corresponding profile and set their role to 'admin'
-- First, insert profiles for any admin_users that might be missing one
INSERT INTO public.profiles (id, full_name, role)
SELECT user_id, 'Admin User', 'admin'
FROM public.admin_users
ON CONFLICT (id) DO UPDATE
SET role = 'admin'
WHERE profiles.role != 'admin';

-- 2. Update is_admin() to rely solely on JWT metadata and profiles table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- 1. Check JWT metadata (fastest)
  IF (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' THEN
    RETURN TRUE;
  END IF;

  -- 2. Check profiles table
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Drop the redundant admin_users table
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- 4. Update handle_new_user trigger to respect metadata role if provided
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  new_role TEXT;
BEGIN
  new_role := COALESCE(new.raw_user_meta_data->>'role', 'customer');
  
  -- Ensure role is valid
  IF new_role NOT IN ('admin', 'customer') THEN
    new_role := 'customer';
  END IF;

  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
