-- Marketing Popups Table
CREATE TABLE IF NOT EXISTS public.marketing_popups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'early_bird', 'exit_intent', 'timed'
    title VARCHAR(255) NOT NULL,
    content TEXT,
    image_url TEXT,
    cta_label VARCHAR(100),
    cta_url VARCHAR(255),
    discount_code VARCHAR(50) REFERENCES public.discount_codes(code) ON DELETE SET NULL,
    delay_seconds INT DEFAULT 5,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger for updated_at
CREATE TRIGGER handle_updated_at_marketing_popups
    BEFORE UPDATE ON public.marketing_popups
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.marketing_popups ENABLE ROW LEVEL SECURITY;

-- Popups Policies
-- Anyone can view active popups, only admins can manage
CREATE POLICY "Anyone can view active popups" 
    ON public.marketing_popups FOR SELECT 
    USING (is_active = true);

CREATE POLICY "Admins can manage all popups" 
    ON public.marketing_popups FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );
