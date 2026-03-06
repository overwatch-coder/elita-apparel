-- Migration: Broaden order status check constraint
-- This ensures that "processing" and other valid statuses don't violate DB constraints.

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'));

-- Ensure any existing data is valid (it should be, but just in case)
-- No changes needed here as we are broadening the check.
