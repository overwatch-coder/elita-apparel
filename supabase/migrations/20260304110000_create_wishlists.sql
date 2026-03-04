-- Wishlists table
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- RLS
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Users can read their own wishlist
CREATE POLICY "Users can read own wishlist"
  ON public.wishlists FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert to their own wishlist
CREATE POLICY "Users can insert own wishlist"
  ON public.wishlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete from their own wishlist
CREATE POLICY "Users can delete own wishlist"
  ON public.wishlists FOR DELETE
  USING (auth.uid() = user_id);
