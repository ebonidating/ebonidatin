-- Stripe webhook handler and subscription management
-- This migration adds webhook handling for Stripe events

-- Create webhook logs table
CREATE TABLE IF NOT EXISTS public.stripe_webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on event_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_id ON public.stripe_webhook_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_processed ON public.stripe_webhook_logs(processed);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON public.stripe_webhook_logs(created_at DESC);

-- Function to handle subscription created
CREATE OR REPLACE FUNCTION public.handle_subscription_created(
  p_user_id UUID,
  p_stripe_customer_id TEXT,
  p_stripe_subscription_id TEXT,
  p_plan_type TEXT,
  p_current_period_start TIMESTAMPTZ,
  p_current_period_end TIMESTAMPTZ
)
RETURNS VOID AS $$
BEGIN
  -- Upsert subscription
  INSERT INTO public.subscriptions (
    user_id,
    stripe_customer_id,
    stripe_subscription_id,
    plan_type,
    status,
    current_period_start,
    current_period_end,
    cancel_at_period_end
  )
  VALUES (
    p_user_id,
    p_stripe_customer_id,
    p_stripe_subscription_id,
    p_plan_type,
    'active',
    p_current_period_start,
    p_current_period_end,
    false
  )
  ON CONFLICT (user_id) DO UPDATE SET
    stripe_customer_id = EXCLUDED.stripe_customer_id,
    stripe_subscription_id = EXCLUDED.stripe_subscription_id,
    plan_type = EXCLUDED.plan_type,
    status = EXCLUDED.status,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    updated_at = NOW();

  -- Update profile subscription tier
  UPDATE core.profiles
  SET 
    subscription_tier = p_plan_type,
    subscription_expires_at = p_current_period_end,
    membership_tier = CASE
      WHEN p_plan_type = 'elite' THEN 'elite'
      WHEN p_plan_type = 'premium' THEN 'premium'
      ELSE 'starter'
    END,
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle subscription updated
CREATE OR REPLACE FUNCTION public.handle_subscription_updated(
  p_stripe_subscription_id TEXT,
  p_status TEXT,
  p_cancel_at_period_end BOOLEAN,
  p_current_period_start TIMESTAMPTZ,
  p_current_period_end TIMESTAMPTZ
)
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_plan_type TEXT;
BEGIN
  -- Get user_id and plan_type
  SELECT user_id, plan_type INTO v_user_id, v_plan_type
  FROM public.subscriptions
  WHERE stripe_subscription_id = p_stripe_subscription_id;

  IF v_user_id IS NOT NULL THEN
    -- Update subscription
    UPDATE public.subscriptions
    SET 
      status = p_status,
      cancel_at_period_end = p_cancel_at_period_end,
      current_period_start = p_current_period_start,
      current_period_end = p_current_period_end,
      updated_at = NOW()
    WHERE stripe_subscription_id = p_stripe_subscription_id;

    -- Update profile if subscription is canceled or past_due
    IF p_status IN ('canceled', 'past_due') THEN
      UPDATE core.profiles
      SET 
        subscription_tier = 'free',
        membership_tier = 'starter',
        subscription_expires_at = NULL,
        updated_at = NOW()
      WHERE id = v_user_id;
    ELSE
      UPDATE core.profiles
      SET 
        subscription_expires_at = p_current_period_end,
        updated_at = NOW()
      WHERE id = v_user_id;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle subscription deleted
CREATE OR REPLACE FUNCTION public.handle_subscription_deleted(
  p_stripe_subscription_id TEXT
)
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get user_id
  SELECT user_id INTO v_user_id
  FROM public.subscriptions
  WHERE stripe_subscription_id = p_stripe_subscription_id;

  IF v_user_id IS NOT NULL THEN
    -- Update subscription status
    UPDATE public.subscriptions
    SET 
      status = 'canceled',
      updated_at = NOW()
    WHERE stripe_subscription_id = p_stripe_subscription_id;

    -- Downgrade user to free tier
    UPDATE core.profiles
    SET 
      subscription_tier = 'free',
      membership_tier = 'starter',
      subscription_expires_at = NULL,
      updated_at = NOW()
    WHERE id = v_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.handle_subscription_created(UUID, TEXT, TEXT, TEXT, TIMESTAMPTZ, TIMESTAMPTZ) TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_subscription_updated(TEXT, TEXT, BOOLEAN, TIMESTAMPTZ, TIMESTAMPTZ) TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_subscription_deleted(TEXT) TO service_role;

-- Enable RLS on webhook logs
ALTER TABLE public.stripe_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Only service role can access webhook logs
CREATE POLICY "service_role_only_webhook_logs" ON public.stripe_webhook_logs
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
