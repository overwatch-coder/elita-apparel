-- Migration: Robust RLS Fix for Marketing Tables
-- This migration introduces a centralized is_admin() check and applies it to all relevant tables.
-- It resolves "permission denied for table users" for guests and "new row violates RLS" for admins.

-- 1. Create a secure is_admin helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- 1. Check JWT metadata (fastest)
  IF (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' THEN
    RETURN TRUE;
  END IF;

  -- 2. Fallback to profiles table
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RETURN TRUE;
  END IF;

  -- 3. Fallback to admin_users table (some parts of the app use this)
  IF EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  ) THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Apply robust policies to marketing_popups
DROP POLICY IF EXISTS "Admins can manage all popups" ON public.marketing_popups;
CREATE POLICY "Admins can manage all popups" 
    ON public.marketing_popups FOR ALL 
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 3. Apply robust policies to subscribers
DROP POLICY IF EXISTS "Admins can manage all subscribers" ON public.subscribers;
CREATE POLICY "Admins can manage all subscribers" 
    ON public.subscribers FOR ALL 
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4. Apply robust policies to campaigns
DROP POLICY IF EXISTS "Admins can manage campaigns" ON public.campaigns;
CREATE POLICY "Admins can manage campaigns" 
    ON public.campaigns FOR ALL 
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 5. Apply robust policies to automations
DROP POLICY IF EXISTS "Admins can manage automations" ON public.automations;
CREATE POLICY "Admins can manage automations" 
    ON public.automations FOR ALL 
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 6. Apply robust policies to automation_emails
DROP POLICY IF EXISTS "Admins can manage automation emails" ON public.automation_emails;
CREATE POLICY "Admins can manage automation emails" 
    ON public.automation_emails FOR ALL 
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 7. Apply robust policies to automation_logs
DROP POLICY IF EXISTS "Admins can manage automation logs" ON public.automation_logs;
CREATE POLICY "Admins can manage automation logs"
    ON public.automation_logs FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 8. Apply robust policies to whatsapp_orders
DROP POLICY IF EXISTS "Admins can view all whatsapp orders" ON public.whatsapp_orders;
CREATE POLICY "Admins can view all whatsapp orders" 
    ON public.whatsapp_orders FOR SELECT 
    TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update whatsapp orders" ON public.whatsapp_orders;
CREATE POLICY "Admins can update whatsapp orders" 
    ON public.whatsapp_orders FOR UPDATE 
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
