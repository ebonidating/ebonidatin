-- Enhanced Billing System Migration
-- Adds support for annual billing, family plans, and corporate tier

-- Add new columns to subscriptions table if they don't exist
ALTER TABLE IF EXISTS public.subscriptions
ADD COLUMN IF NOT EXISTS billing_interval TEXT DEFAULT 'monthly' CHECK (billing_interval IN ('monthly', 'annual')),
ADD COLUMN IF NOT EXISTS annual_discount_percentage INTEGER DEFAULT 17,
ADD COLUMN IF NOT EXISTS max_users INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS shared_with_users UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS billing_notes JSONB DEFAULT '{}';

-- Add index for billing interval queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_billing_interval 
ON public.subscriptions(billing_interval);

-- Create family plan members table
CREATE TABLE IF NOT EXISTS public.family_plan_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  added_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'member', 'manager')),
  invite_status TEXT DEFAULT 'active' CHECK (invite_status IN ('pending', 'active', 'declined', 'removed')),
  invitation_token TEXT UNIQUE,
  invitation_expires_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subscription_id, user_id)
);

-- Create corporate plan admin table
CREATE TABLE IF NOT EXISTS public.corporate_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_level TEXT DEFAULT 'member' CHECK (admin_level IN ('super_admin', 'admin', 'moderator')),
  permissions JSONB DEFAULT '{"can_manage_users": true, "can_view_analytics": true, "can_manage_billing": false}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subscription_id, user_id)
);

-- Create billing history table for tracking changes
CREATE TABLE IF NOT EXISTS public.billing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'subscription_created',
    'subscription_upgraded',
    'subscription_downgraded',
    'subscription_renewed',
    'billing_interval_changed',
    'plan_changed',
    'cancellation_scheduled',
    'cancellation_completed',
    'payment_failed',
    'payment_succeeded',
    'discount_applied'
  )),
  old_tier TEXT,
  new_tier TEXT,
  old_interval TEXT,
  new_interval TEXT,
  amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for billing history queries
CREATE INDEX IF NOT EXISTS idx_billing_history_subscription_id 
ON public.billing_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_user_id 
ON public.billing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_created_at 
ON public.billing_history(created_at DESC);

-- Enable RLS on new tables
ALTER TABLE public.family_plan_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for family_plan_members
CREATE POLICY "Users can view their family plan members" ON public.family_plan_members
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR
    subscription_id IN (
      SELECT s.id FROM public.subscriptions s 
      WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "Subscription owner can manage family members" ON public.family_plan_members
  FOR ALL TO authenticated
  USING (
    subscription_id IN (
      SELECT s.id FROM public.subscriptions s 
      WHERE s.user_id = auth.uid()
    )
  )
  WITH CHECK (
    subscription_id IN (
      SELECT s.id FROM public.subscriptions s 
      WHERE s.user_id = auth.uid()
    )
  );

-- RLS Policies for corporate_admins
CREATE POLICY "Corporate admins can view their subscription admins" ON public.corporate_admins
  FOR SELECT TO authenticated
  USING (
    subscription_id IN (
      SELECT s.id FROM public.subscriptions s 
      WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage corporate admins" ON public.corporate_admins
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for billing_history
CREATE POLICY "Users can view their billing history" ON public.billing_history
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR
    subscription_id IN (
      SELECT s.id FROM public.subscriptions s 
      WHERE s.user_id = auth.uid()
    )
  );

-- Function to create billing history entry
CREATE OR REPLACE FUNCTION public.create_billing_history(
  p_subscription_id UUID,
  p_event_type TEXT,
  p_user_id UUID,
  p_old_tier TEXT DEFAULT NULL,
  p_new_tier TEXT DEFAULT NULL,
  p_old_interval TEXT DEFAULT NULL,
  p_new_interval TEXT DEFAULT NULL,
  p_amount DECIMAL DEFAULT NULL,
  p_currency TEXT DEFAULT 'USD',
  p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_history_id UUID;
BEGIN
  INSERT INTO public.billing_history (
    subscription_id,
    event_type,
    user_id,
    old_tier,
    new_tier,
    old_interval,
    new_interval,
    amount,
    currency,
    details
  ) VALUES (
    p_subscription_id,
    p_event_type,
    p_user_id,
    p_old_tier,
    p_new_tier,
    p_old_interval,
    p_new_interval,
    p_amount,
    p_currency,
    p_details
  )
  RETURNING id INTO v_history_id;

  RETURN v_history_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add family plan member
CREATE OR REPLACE FUNCTION public.add_family_plan_member(
  p_subscription_id UUID,
  p_user_id UUID,
  p_added_by UUID,
  p_role TEXT DEFAULT 'member'
)
RETURNS UUID AS $$
DECLARE
  v_member_id UUID;
  v_member_count INTEGER;
  v_max_users INTEGER;
BEGIN
  -- Check max users limit
  SELECT max_users INTO v_max_users FROM public.subscriptions WHERE id = p_subscription_id;
  SELECT COUNT(*) INTO v_member_count FROM public.family_plan_members 
  WHERE subscription_id = p_subscription_id AND invite_status = 'active';

  IF v_member_count >= v_max_users THEN
    RAISE EXCEPTION 'Family plan member limit reached';
  END IF;

  INSERT INTO public.family_plan_members (
    subscription_id,
    user_id,
    added_by,
    role,
    invite_status
  ) VALUES (
    p_subscription_id,
    p_user_id,
    p_added_by,
    p_role,
    'active'
  )
  RETURNING id INTO v_member_id;

  RETURN v_member_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.create_billing_history(UUID, TEXT, UUID, TEXT, TEXT, TEXT, TEXT, DECIMAL, TEXT, JSONB) TO service_role;
GRANT EXECUTE ON FUNCTION public.add_family_plan_member(UUID, UUID, UUID, TEXT) TO service_role;
