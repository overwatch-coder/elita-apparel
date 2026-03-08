-- Add payment_proof_url to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;

-- Update payment_method check constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.constraint_column_usage 
        WHERE table_name = 'orders' AND column_name = 'payment_method'
    ) THEN
        ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
        ALTER TABLE public.orders ADD CONSTRAINT orders_payment_method_check 
        CHECK (payment_method IN ('cod', 'card', 'momo', 'manual_momo'));
    END IF;
END $$;

-- Create storage bucket for payment proofs if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for payment-proofs
-- Allow public to read (for admin to view proofs)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'payment-proofs');

-- Allow authenticated users to upload their proofs
CREATE POLICY "Authenticated Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'payment-proofs');

-- Allow anon users to upload (since checkout might be guest)
CREATE POLICY "Anon Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'payment-proofs');
