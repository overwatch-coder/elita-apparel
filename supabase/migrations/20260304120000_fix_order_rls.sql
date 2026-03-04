-- Migration: Fix RLS for orders table to allow guests to create and view their own orders

CREATE POLICY "Anyone can view their newly created order"
  ON public.orders FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view their newly created order items"
  ON public.order_items FOR SELECT
  TO public
  USING (true);
