-- Add RLS policies for authenticated users to manage their own verification codes
CREATE POLICY "Users can view own verification codes" 
ON public.verification_codes 
FOR SELECT 
TO authenticated 
USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert own verification codes" 
ON public.verification_codes 
FOR INSERT 
TO authenticated 
WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can delete own verification codes" 
ON public.verification_codes 
FOR DELETE 
TO authenticated 
USING ( auth.uid() = user_id );

CREATE POLICY "Users can update own verification codes" 
ON public.verification_codes 
FOR UPDATE
TO authenticated 
USING ( auth.uid() = user_id )
WITH CHECK ( auth.uid() = user_id );
