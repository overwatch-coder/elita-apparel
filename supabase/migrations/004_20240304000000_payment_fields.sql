-- Migration: Add payment fields to orders

-- Add new columns for tracking payment methods, status, and verification
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method text CHECK (payment_method IN ('cod', 'card', 'momo'));
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paystack_reference text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid_at timestamp with time zone;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_verified boolean DEFAULT false;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_payment_collected boolean DEFAULT false;

-- Add comment indicating standard workflow
COMMENT ON COLUMN public.orders.payment_method IS 'The chosen payment method: cod (Cash on Delivery), card (Paystack Card), momo (Paystack Mobile Money)';
COMMENT ON COLUMN public.orders.payment_verified IS 'True if a Paystack webhook confirmed payment or if manually verified';
COMMENT ON COLUMN public.orders.delivery_payment_collected IS 'For COD orders: True when the delivery rider confirms cash was collected';
