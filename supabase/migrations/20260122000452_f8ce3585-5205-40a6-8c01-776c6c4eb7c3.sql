
-- =============================================
-- FASE 1: ESTRUTURA DE BANCO DE DADOS PARA LANÇAMENTO RELÂMPAGO
-- =============================================

-- 1.1 Tabela de Funis
CREATE TABLE public.funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.2 Tabela de Ofertas (vinculadas ao Stripe)
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID REFERENCES public.funnels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  stripe_price_id TEXT,
  stripe_product_id TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0,
  original_price_cents INTEGER,
  is_active BOOLEAN DEFAULT true,
  course_id UUID REFERENCES public.courses(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.3 Tabela de Janelas de Carrinho
CREATE TABLE public.cart_windows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID REFERENCES public.funnels(id) ON DELETE CASCADE,
  name TEXT,
  open_at TIMESTAMPTZ NOT NULL,
  close_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.4 Tabela de Pedidos
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  lead_id UUID REFERENCES public.leads(id),
  offer_id UUID REFERENCES public.offers(id),
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'BRL',
  customer_email TEXT,
  customer_name TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ
);

-- 1.5 Tabela de Entitlements (acessos liberados)
CREATE TABLE public.entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID REFERENCES public.courses(id),
  order_id UUID REFERENCES public.orders(id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  revoke_reason TEXT
);

-- 1.6 Tabela de Templates de Mensagem
CREATE TABLE public.message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID REFERENCES public.funnels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  channel TEXT DEFAULT 'email',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.7 Tabela de Fila de Mensagens
CREATE TABLE public.message_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id),
  user_id UUID,
  template_id UUID REFERENCES public.message_templates(id),
  to_email TEXT NOT NULL,
  to_name TEXT,
  subject TEXT,
  body TEXT,
  channel TEXT DEFAULT 'email',
  scheduled_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.8 Tabela de Páginas do Funil
CREATE TABLE public.funnel_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID REFERENCES public.funnels(id) ON DELETE CASCADE,
  page_type TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT,
  content JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(funnel_id, page_type)
);

-- 1.9 Tabela de Eventos de Lead (tracking)
CREATE TABLE public.lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id),
  funnel_id UUID REFERENCES public.funnels(id),
  event_type TEXT NOT NULL,
  page_type TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.10 Tabela de Auditoria
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  user_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- TRIGGERS PARA updated_at
-- =============================================

CREATE TRIGGER update_funnels_updated_at
  BEFORE UPDATE ON public.funnels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_message_templates_updated_at
  BEFORE UPDATE ON public.message_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_funnel_pages_updated_at
  BEFORE UPDATE ON public.funnel_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Funnels: Admin pode tudo, público pode ver ativos
ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage funnels"
  ON public.funnels FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active funnels"
  ON public.funnels FOR SELECT
  USING (is_active = true);

-- Offers: Admin pode tudo, público pode ver ativas
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage offers"
  ON public.offers FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active offers"
  ON public.offers FOR SELECT
  USING (is_active = true);

-- Cart Windows: Admin pode tudo, público pode ver ativas
ALTER TABLE public.cart_windows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage cart windows"
  ON public.cart_windows FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active cart windows"
  ON public.cart_windows FOR SELECT
  USING (is_active = true);

-- Orders: Admin pode ver todos, usuário só os próprios
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage orders"
  ON public.orders FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Entitlements: Admin pode tudo, usuário só os próprios
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage entitlements"
  ON public.entitlements FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own entitlements"
  ON public.entitlements FOR SELECT
  USING (auth.uid() = user_id);

-- Message Templates: Admin pode tudo
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage message templates"
  ON public.message_templates FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Message Queue: Admin pode tudo
ALTER TABLE public.message_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage message queue"
  ON public.message_queue FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Funnel Pages: Admin pode tudo, público pode ver ativas
ALTER TABLE public.funnel_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage funnel pages"
  ON public.funnel_pages FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active funnel pages"
  ON public.funnel_pages FOR SELECT
  USING (is_active = true);

-- Lead Events: Admin pode ver, inserção pública (via edge function)
ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view lead events"
  ON public.lead_events FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert lead events"
  ON public.lead_events FOR INSERT
  WITH CHECK (true);

-- Audit Log: Apenas admin pode ver
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log"
  ON public.audit_log FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================

CREATE INDEX idx_offers_funnel_id ON public.offers(funnel_id);
CREATE INDEX idx_cart_windows_funnel_id ON public.cart_windows(funnel_id);
CREATE INDEX idx_cart_windows_dates ON public.cart_windows(open_at, close_at);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_lead_id ON public.orders(lead_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_stripe_session ON public.orders(stripe_session_id);
CREATE INDEX idx_entitlements_user_id ON public.entitlements(user_id);
CREATE INDEX idx_entitlements_course_id ON public.entitlements(course_id);
CREATE INDEX idx_message_queue_status ON public.message_queue(status, scheduled_at);
CREATE INDEX idx_lead_events_lead_id ON public.lead_events(lead_id);
CREATE INDEX idx_lead_events_funnel_id ON public.lead_events(funnel_id);
CREATE INDEX idx_lead_events_type ON public.lead_events(event_type);
CREATE INDEX idx_funnel_pages_slug ON public.funnel_pages(slug);
