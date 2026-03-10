-- ═══════════════════════════════════════════════════════════════════════════════
-- ELITA APPAREL – Admin User Setup
-- Run this AFTER schema.sql to create admin users table and link auth users.
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── Admin Users Table ──────────────────────────────────────────────────────
-- Links Supabase Auth users to admin roles for the Elita Apparel dashboard.

CREATE TABLE IF NOT EXISTS admin_users (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text NOT NULL DEFAULT 'admin',
  created_at  timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only authenticated admin users can read admin_users
CREATE POLICY "Admin users can view admin table"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

-- ─── Helper Function ────────────────────────────────────────────────────────
-- Check if the current authenticated user is an admin

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  );
$$;

-- ═══════════════════════════════════════════════════════════════════════════════
-- HOW TO CREATE AN ADMIN USER
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add user" → "Create new user"
-- 3. Enter email & password for your admin (e.g. admin@elitaapparel.com)
-- 4. Copy the user's UUID from the dashboard
-- 5. Run the SQL below, replacing <USER_UUID> with the copied UUID:
--
--    INSERT INTO admin_users (user_id, role)
--    VALUES ('<USER_UUID>', 'admin');
--
-- The admin can now log in at /login with those credentials.
-- ═══════════════════════════════════════════════════════════════════════════════
