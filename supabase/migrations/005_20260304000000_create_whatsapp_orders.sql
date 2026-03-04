CREATE TABLE IF NOT EXISTS public.whatsapp_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_name TEXT,
  guest_phone TEXT,
  cart_snapshot JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  order_ref TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'initiated',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.whatsapp_orders ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can insert whatsapp orders"
  ON public.whatsapp_orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own whatsapp orders"
  ON public.whatsapp_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all whatsapp orders"
  ON public.whatsapp_orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can update whatsapp orders"
  ON public.whatsapp_orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );
