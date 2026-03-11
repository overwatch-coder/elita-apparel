-- 1. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL means broadcast to all admins
    type TEXT NOT NULL CHECK (type IN ('order', 'contact', 'review', 'system', 'customer_alert')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Admins can view all notifications (either their own, or broadcasts where user_id is null)
CREATE POLICY "Admins can view all notifications" 
ON public.notifications FOR SELECT 
TO authenticated 
USING (
  public.is_admin() OR user_id IS NULL OR user_id = auth.uid()
);

-- Regular users can only view their own personal notifications
CREATE POLICY "Users can view own notifications" 
ON public.notifications FOR SELECT 
TO authenticated 
USING (
  user_id = auth.uid()
);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update own notifications" 
ON public.notifications FOR UPDATE 
TO authenticated 
USING (
  user_id = auth.uid()
)
WITH CHECK (
  user_id = auth.uid()
);

-- Admins can update any notification
CREATE POLICY "Admins can update all notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (public.is_admin());

-- Deletes
CREATE POLICY "Admins can delete notifications"
ON public.notifications FOR DELETE
TO authenticated
USING (public.is_admin());


-- ────────────────────────────────────────────────────────────────────────────
-- 2. Notification Triggers
-- ────────────────────────────────────────────────────────────────────────────

-- A. Trigger for New Orders
CREATE OR REPLACE FUNCTION public.notify_admin_new_order()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, link)
  VALUES (
    NULL, -- Broadcast to all admins
    'order',
    'New Order Received',
    'Order #' || NEW.id || ' has been placed.',
    '/admin/orders/' || NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_new_order_created
AFTER INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.notify_admin_new_order();


-- B. Trigger for New Contact Messages
CREATE OR REPLACE FUNCTION public.notify_admin_new_contact()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, link)
  VALUES (
    NULL,
    'contact',
    'New Contact Message',
    'Message from ' || NEW.name || ' (' || NEW.email || ')',
    '/admin/contacts' -- Links to the Contact Messages (Inquiries) page
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_new_contact_message
AFTER INSERT ON public.contact_messages
FOR EACH ROW EXECUTE FUNCTION public.notify_admin_new_contact();


-- C. Trigger for New Reviews
CREATE OR REPLACE FUNCTION public.notify_admin_new_review()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, link)
  VALUES (
    NULL,
    'review',
    'New Product Review',
    'A new review ' || NEW.rating || '-star was submitted.',
    '/admin/reviews'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_new_review_submitted
AFTER INSERT ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.notify_admin_new_review();


-- D. Trigger for Order Status Changes (Notifies Customer)
CREATE OR REPLACE FUNCTION public.notify_customer_order_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify if status changed AND there is a user_id attached to the order
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.user_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
      NEW.user_id,
      'order',
      'Order Status Updated',
      'Your order #' || SUBSTRING(NEW.id::TEXT FROM 1 FOR 8) || ' is now ' || NEW.status || '.',
      '/account/orders/' || NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_order_status_update
AFTER UPDATE OF status ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.notify_customer_order_status();


-- E. Trigger for Review Moderation (Notifies Customer)
CREATE OR REPLACE FUNCTION public.notify_customer_review_moderation()
RETURNS TRIGGER AS $$
DECLARE
  v_product_slug TEXT;
BEGIN
  IF OLD.is_approved = false AND NEW.is_approved = true AND NEW.user_id IS NOT NULL THEN
    -- Fetch the product slug to generate the correct URL
    SELECT slug INTO v_product_slug FROM public.products WHERE id = NEW.product_id;
    
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
      NEW.user_id,
      'review',
      'Review Approved',
      'Your recent product review has been published.',
      '/shop/' || v_product_slug
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_review_status_update
AFTER UPDATE OF is_approved ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.notify_customer_review_moderation();

-- ────────────────────────────────────────────────────────────────────────────
-- Enable Realtime for notifications
-- ────────────────────────────────────────────────────────────────────────────
-- (Note: In a pure SQL migration, this specifically modifies publication)
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;
