-- ═══════════════════════════════════════════════════════════════════════════════
-- ELITA APPAREL – Database Schema
-- Premium African Fashion eCommerce Platform
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE extension IF NOT EXISTS "uuid-ossp";

-- ─── Collections ────────────────────────────────────────────────────────────

CREATE TABLE collections (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  description text,
  cultural_story text,
  image_url   text,
  images_urls text[] DEFAULT '{}',
  is_published boolean DEFAULT true,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_collections_slug ON collections(slug);
CREATE INDEX idx_collections_published ON collections(is_published);

-- ─── Categories ─────────────────────────────────────────────────────────────

CREATE TABLE categories (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  image_url   text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- ─── Products ───────────────────────────────────────────────────────────────

CREATE TABLE products (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                text NOT NULL,
  slug                text NOT NULL UNIQUE,
  description         text,
  cultural_story      text,
  price               numeric(10,2) NOT NULL DEFAULT 0,
  discount_percentage numeric(5,2) DEFAULT 0,
  category_id         uuid REFERENCES categories(id) ON DELETE SET NULL,
  collection_id       uuid REFERENCES collections(id) ON DELETE SET NULL,
  fabric_type         text,
  available_sizes     text[] DEFAULT '{}',
  is_featured         boolean DEFAULT false,
  is_new              boolean DEFAULT true,
  early_bird_eligible boolean DEFAULT false,
  stock_quantity      integer DEFAULT 0,
  is_published        boolean DEFAULT false,
  seo_title           text,
  seo_description     text,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_collection ON products(collection_id);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_new ON products(is_new) WHERE is_new = true;
CREATE INDEX idx_products_published ON products(is_published) WHERE is_published = true;

-- ─── Product Images ─────────────────────────────────────────────────────────

CREATE TABLE product_images (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url  text NOT NULL,
  position   integer DEFAULT 0,
  is_primary boolean DEFAULT false
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- ─── Orders ─────────────────────────────────────────────────────────────────

CREATE TABLE orders (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name     text NOT NULL,
  customer_email    text NOT NULL,
  customer_phone    text,
  shipping_address  text NOT NULL,
  shipping_city     text NOT NULL,
  shipping_state    text,
  shipping_zip      text,
  shipping_country  text NOT NULL DEFAULT 'Ghana',
  total_amount      numeric(10,2) NOT NULL DEFAULT 0,
  discount_code     text,
  discount_amount   numeric(10,2) DEFAULT 0,
  status            text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','paid','shipped','delivered','cancelled')),
  notes             text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(customer_email);

-- ─── Order Items ────────────────────────────────────────────────────────────

CREATE TABLE order_items (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id     uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name text NOT NULL,
  quantity     integer NOT NULL DEFAULT 1,
  size         text NOT NULL,
  price        numeric(10,2) NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ─── Discount Codes ────────────────────────────────────────────────────────

CREATE TABLE discount_codes (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code        text NOT NULL UNIQUE,
  percentage  numeric(5,2) NOT NULL,
  expiry_date timestamptz,
  is_active   boolean DEFAULT true,
  usage_count integer DEFAULT 0,
  max_uses    integer,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_discount_codes_code ON discount_codes(code);

-- ─── Updated_at Trigger ────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- ─── Public Read Policies ───────────────────────────────────────────────────

-- Anyone can read published collections
CREATE POLICY "Public can view published collections"
  ON collections FOR SELECT
  USING (is_published = true);

-- Anyone can read categories
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (true);

-- Anyone can read published products
CREATE POLICY "Public can view published products"
  ON products FOR SELECT
  USING (is_published = true);

-- Anyone can read images of published products
CREATE POLICY "Public can view product images"
  ON product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
      AND products.is_published = true
    )
  );

-- Anyone can read active discount codes
CREATE POLICY "Public can view active discount codes"
  ON discount_codes FOR SELECT
  USING (is_active = true AND (expiry_date IS NULL OR expiry_date > now()));

-- ─── Authenticated (Admin) Write Policies ───────────────────────────────────

-- Admin full access to collections
CREATE POLICY "Admins can manage collections"
  ON collections FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Admin full access to categories
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Admin full access to products
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Admin full access to product images
CREATE POLICY "Admins can manage product images"
  ON product_images FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Admin full access to orders
CREATE POLICY "Admins can manage orders"
  ON orders FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Admin full access to order items
CREATE POLICY "Admins can manage order items"
  ON order_items FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Admin full access to discount codes
CREATE POLICY "Admins can manage discount codes"
  ON discount_codes FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- ─── Public Insert Policy for Orders ────────────────────────────────────────

-- Anyone can create orders (checkout)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Anyone can create order items (checkout)
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- ─── Supabase Storage Bucket ────────────────────────────────────────────────
-- Run this in Supabase Dashboard > Storage:
-- 1. Create a bucket named "product-images" (public)
-- 2. Set policies: public read, authenticated upload/delete
