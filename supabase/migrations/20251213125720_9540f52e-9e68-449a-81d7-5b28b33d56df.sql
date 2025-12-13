-- Create hotmart_products table for mapping Hotmart products to courses
CREATE TABLE public.hotmart_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotmart_product_id text NOT NULL UNIQUE,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  product_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hotmart_products ENABLE ROW LEVEL SECURITY;

-- Only admins can manage hotmart products mapping
CREATE POLICY "Admins can manage hotmart products"
  ON public.hotmart_products
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_hotmart_products_updated_at
  BEFORE UPDATE ON public.hotmart_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Create hotmart_transactions table to log all webhook events
CREATE TABLE public.hotmart_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotmart_transaction_id text UNIQUE,
  hotmart_product_id text NOT NULL,
  buyer_email text NOT NULL,
  buyer_name text,
  status text NOT NULL,
  event_type text NOT NULL,
  raw_payload jsonb,
  processed boolean DEFAULT false,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hotmart_transactions ENABLE ROW LEVEL SECURITY;

-- Only admins can view transactions
CREATE POLICY "Admins can view hotmart transactions"
  ON public.hotmart_transactions
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));