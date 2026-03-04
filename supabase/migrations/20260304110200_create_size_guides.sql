-- Size Guides table
CREATE TABLE IF NOT EXISTS public.size_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content_html TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add size_guide_id FK to products
ALTER TABLE public.products
  ADD COLUMN size_guide_id UUID REFERENCES public.size_guides(id) ON DELETE SET NULL;

-- RLS
ALTER TABLE public.size_guides ENABLE ROW LEVEL SECURITY;

-- Public can read all size guides
CREATE POLICY "Anyone can read size guides"
  ON public.size_guides FOR SELECT
  USING (true);

-- Admins can manage size guides
CREATE POLICY "Admins can manage size guides"
  ON public.size_guides FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
    )
  );
