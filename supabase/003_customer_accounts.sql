-- ═══════════════════════════════════════════════════════════════════════════════
-- ELITA APPAREL – Database Schema (MVP v2: Customer Accounts)
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── Profiles ───────────────────────────────────────────────────────────────

CREATE TABLE profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   text,
  phone       text,
  role        text DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Trigger to create a profile automatically when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for updated_at
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Addresses ──────────────────────────────────────────────────────────────

CREATE TABLE addresses (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name      text NOT NULL,
  phone          text NOT NULL,
  address_line_1 text NOT NULL,
  address_line_2 text,
  city           text NOT NULL,
  region         text,
  country        text NOT NULL DEFAULT 'Ghana',
  is_default     boolean DEFAULT false,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);

CREATE TRIGGER trg_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to ensure only one default address per user
CREATE OR REPLACE FUNCTION handle_default_address()
RETURNS trigger AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE addresses SET is_default = false
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_default_address
  BEFORE INSERT OR UPDATE OF is_default ON addresses
  FOR EACH ROW
  WHEN (NEW.is_default = true)
  EXECUTE FUNCTION handle_default_address();

-- ─── Orders (Updates) ───────────────────────────────────────────────────────

ALTER TABLE orders ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));
ALTER TABLE orders ADD COLUMN tracking_note text;
ALTER TABLE orders ADD COLUMN estimated_delivery timestamptz;

CREATE INDEX idx_orders_user ON orders(user_id);

-- ─── Contact Messages ───────────────────────────────────────────────────────

CREATE TABLE contact_messages (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name  text NOT NULL,
  email      text NOT NULL,
  phone      text,
  subject    text NOT NULL,
  message    text NOT NULL,
  is_read    boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) FOR NEW TABLES
-- ═══════════════════════════════════════════════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ─── Profiles RLS ───────────────────────────────────────────────────────────

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Admins can view/update all profiles
CREATE POLICY "Admins can manage profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ─── Addresses RLS ──────────────────────────────────────────────────────────

-- Users can manage their own addresses
CREATE POLICY "Users can manage own addresses"
  ON addresses FOR ALL
  TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Admins can view all addresses
CREATE POLICY "Admins can view all addresses"
  ON addresses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ─── Orders RLS (Updates) ───────────────────────────────────────────────────

-- Drop old public insert policy, we should tighten this but keep it workable for guest checkout if needed
-- For now, add user-specific policies:
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Note: Admin policy already exists indicating "Admins can manage orders"

-- ─── Contact Messages RLS ───────────────────────────────────────────────────

-- Anyone can insert a contact message
CREATE POLICY "Public can insert contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Admins can view and manage contact messages
CREATE POLICY "Admins can manage contact messages"
  ON contact_messages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
