-- Create automation_logs table to track automated emails sent to subscribers
CREATE TABLE IF NOT EXISTS public.automation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    automation_id UUID REFERENCES public.automations(id) ON DELETE CASCADE,
    email_id UUID REFERENCES public.automation_emails(id) ON DELETE CASCADE,
    subscriber_email TEXT NOT NULL,
    status TEXT DEFAULT 'sent', -- 'pending', 'sent', 'failed'
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can manage automation logs"
    ON public.automation_logs
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_automation_logs_subscriber ON public.automation_logs(subscriber_email);
CREATE INDEX IF NOT EXISTS idx_automation_logs_automation ON public.automation_logs(automation_id);
