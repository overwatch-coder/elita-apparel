-- Create verification_codes table for OTP verification
CREATE TABLE IF NOT EXISTS public.verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('email_change', 'password_change')),
    metadata JSONB DEFAULT '{}'::jsonb,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for faster lookup and expiration checks
CREATE INDEX IF NOT EXISTS idx_verification_codes_user_type ON public.verification_codes(user_id, type);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at ON public.verification_codes(expires_at);

-- Enable RLS
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- Only admins/service role can direct-access. 
-- In practice, we'll use SECURITY DEFINER functions or server actions.
CREATE POLICY "Admins can view all verification codes" 
ON public.verification_codes 
FOR SELECT 
TO authenticated 
USING ( public.is_admin() );

CREATE POLICY "Admins can delete all verification codes" 
ON public.verification_codes 
FOR DELETE 
TO authenticated 
USING ( public.is_admin() );
