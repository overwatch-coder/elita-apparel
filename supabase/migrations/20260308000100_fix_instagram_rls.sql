-- Migration: Fix RLS Permissions for Instagram Feed
-- Corrects "permission denied for table users" by using public.is_admin() helper

-- 1. Fix Instagram Posts Policies
DROP POLICY IF EXISTS "Admins can manage instagram posts" ON public.instagram_posts;

CREATE POLICY "Admins can manage instagram posts"
    ON public.instagram_posts FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 2. Fix Site Settings Policies
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;

CREATE POLICY "Admins can manage site settings"
    ON public.site_settings FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 3. Ensure public access is explicit (idempotent re-creation)
DROP POLICY IF EXISTS "Public can view active instagram posts" ON public.instagram_posts;
CREATE POLICY "Public can view active instagram posts"
    ON public.instagram_posts FOR SELECT
    USING (is_active = true);

DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
    ON public.site_settings FOR SELECT
    USING (true);
