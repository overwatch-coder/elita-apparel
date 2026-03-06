-- Migration: Fix Reviews RLS to use profiles.role
-- This allows users with the 'admin' role in the profiles table to manage all reviews.

-- Drop the old policy that used the missing admin_users table
DROP POLICY IF EXISTS "Admins can manage reviews" ON public.reviews;

-- Create the new unified admin policy
CREATE POLICY "Admins can manage reviews"
  ON public.reviews FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Also ensure "Anyone can read approved reviews" is clear
-- No changes needed there as it's already set to SELECT + is_approved = true.
