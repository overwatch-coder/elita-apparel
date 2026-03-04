-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Anyone can insert a contact message (public form)
CREATE POLICY "Anyone can submit a contact message"
    ON public.contact_messages
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Only authenticated admins can read/update/delete contact messages
CREATE POLICY "Admins can view contact messages"
    ON public.contact_messages
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can update contact messages"
    ON public.contact_messages
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Admins can delete contact messages"
    ON public.contact_messages
    FOR DELETE
    TO authenticated
    USING (true);

-- Grant access to service role
GRANT ALL ON public.contact_messages TO service_role;
