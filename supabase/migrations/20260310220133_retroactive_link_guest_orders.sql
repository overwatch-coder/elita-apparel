DO $$ 
DECLARE
  rec RECORD;
  o_rec RECORD;
BEGIN
  -- 1. Link past guest orders matching existing users' emails
  -- We use LOWER() to ensure case-insensitive matching
  UPDATE public.orders o
  SET user_id = u.id
  FROM auth.users u
  WHERE LOWER(o.customer_email) = LOWER(u.email)
    AND o.user_id IS NULL;

  -- 2. Create default addresses for users who have orders but no existing address
  FOR rec IN 
    SELECT DISTINCT u.id 
    FROM auth.users u
    JOIN public.orders o ON o.user_id = u.id
    LEFT JOIN public.addresses a ON a.user_id = u.id
    WHERE a.id IS NULL
  LOOP
    -- Get the most recent order for this user
    SELECT * INTO o_rec
    FROM public.orders
    WHERE user_id = rec.id
    ORDER BY created_at DESC
    LIMIT 1;

    -- Insert the address using details from the most recent order
    INSERT INTO public.addresses (
      user_id, full_name, phone, address_line_1, address_line_2,
      city, region, country, is_default
    ) VALUES (
      rec.id,
      o_rec.customer_name,
      COALESCE(o_rec.customer_phone, ''),
      o_rec.shipping_address,
      NULL,
      o_rec.shipping_city,
      o_rec.shipping_state,
      COALESCE(o_rec.shipping_country, 'Ghana'),
      true
    );
  END LOOP;
END;
$$;
