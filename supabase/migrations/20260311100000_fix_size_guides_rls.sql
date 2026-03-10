-- Migration: Fix Size Guides RLS Policies
-- This migration updates the size_guides table to use the robust is_admin() check.

-- 1. Drop the outdated policy that referenced the old admin_users table
DROP POLICY IF EXISTS "Admins can manage size guides" ON public.size_guides;

-- 2. Create the new policy using the refined is_admin() function
CREATE POLICY "Admins can manage size guides"
  ON public.size_guides FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. Ensure the public read policy is also robust
DROP POLICY IF EXISTS "Anyone can read size guides" ON public.size_guides;
CREATE POLICY "Anyone can read size guides"
  ON public.size_guides FOR SELECT
  USING (true);
