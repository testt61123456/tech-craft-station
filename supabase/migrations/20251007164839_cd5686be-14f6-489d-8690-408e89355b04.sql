-- Enable realtime for customer tables
ALTER TABLE public.customers REPLICA IDENTITY FULL;
ALTER TABLE public.customer_devices REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_devices;