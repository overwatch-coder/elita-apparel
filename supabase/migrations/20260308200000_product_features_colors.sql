-- Add features and color_variants to products table
-- features: ordered list of bullet-point feature strings
-- [{"id": "uuid", "text": "Made from 100% Kente cloth"}]
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS color_variants JSONB DEFAULT '[]'::jsonb;

-- color_variants schema:
-- [{"id": "uuid", "name": "Midnight Blue", "hex": "#1a237e", "image_ids": ["img-id-1", "img-id-2"]}]

-- Add color to order_items so the selected color variant is stored per line item
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS color TEXT DEFAULT NULL;
