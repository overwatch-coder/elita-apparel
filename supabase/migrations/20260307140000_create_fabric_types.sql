-- Migration: Create fabric_types table
-- This migration adds a table for managing fabric types and seeds initial data.

CREATE TABLE IF NOT EXISTS public.fabric_types (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        text NOT NULL UNIQUE,
  slug        text NOT NULL UNIQUE,
  description text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fabric_types ENABLE ROW LEVEL SECURITY;

-- Allow public read access (so store can show fabric info if needed)
CREATE POLICY "Fabric types are viewable by everyone"
  ON public.fabric_types FOR SELECT
  USING (true);

-- Only admins can manage fabric types
CREATE POLICY "Admins can manage fabric types"
  ON public.fabric_types FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Seed initial fabric types
INSERT INTO public.fabric_types (name, slug)
VALUES 
  ('Kente', 'kente'),
  ('Adinkra', 'adinkra'),
  ('Goni', 'goni'),
  ('Cotton', 'cotton'),
  ('Silk', 'silk'),
  ('Linen', 'linen')
ON CONFLICT (name) DO NOTHING;

-- Trigger for updated_at
CREATE TRIGGER trg_fabric_types_updated_at
  BEFORE UPDATE ON public.fabric_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
