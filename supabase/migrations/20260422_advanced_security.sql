-- Advanced Security Migration
-- Adds 2FA, rate limiting, fraud detection, and session management

-- Create two_factor_settings table
CREATE TABLE IF NOT EXISTS public.two_factor_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  secret TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT false,
  backup_codes TEXT[] DEFAULT '{}',
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sessions table for session management
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  device_id TEXT NOT NULL,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ NOT NULL,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create login_history table
CREATE TABLE IF NOT EXISTS public.login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  country TEXT,
  success BOOLEAN DEFAULT true,
  failure_reason TEXT,
  device_id TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rate_limit_logs table
CREATE TABLE IF NOT EXISTS public.rate_limit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create fraud_checks table
CREATE TABLE IF NOT EXISTS public.fraud_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  device_id TEXT,
  action TEXT NOT NULL,
  risk_score INTEGER DEFAULT 0,
  flags TEXT[] DEFAULT '{}',
  recommendation TEXT DEFAULT 'allow' CHECK (recommendation IN ('allow', 'challenge', 'block')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trusted_devices table
CREATE TABLE IF NOT EXISTS public.trusted_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT UNIQUE NOT NULL,
  device_name TEXT,
  device_type TEXT,
  is_trusted BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activity_logs table for general activity tracking
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_two_factor_user_id ON public.two_factor_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON public.sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON public.login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_created_at ON public.login_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limit_logs_user_id ON public.rate_limit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_rate_limit_logs_created_at ON public.rate_limit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fraud_checks_user_id ON public.fraud_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_checks_risk_score ON public.fraud_checks(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_trusted_devices_user_id ON public.trusted_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- Enable RLS on all tables
ALTER TABLE public.two_factor_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for two_factor_settings
CREATE POLICY "Users can manage their own 2FA settings" ON public.two_factor_settings
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for sessions
CREATE POLICY "Users can view their own sessions" ON public.sessions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can terminate their own sessions" ON public.sessions
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Service role can manage sessions" ON public.sessions
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for login_history
CREATE POLICY "Users can view their own login history" ON public.login_history
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Service role can insert login history" ON public.login_history
  FOR INSERT TO service_role
  WITH CHECK (true);

-- RLS Policies for rate_limit_logs
CREATE POLICY "Service role can manage rate limit logs" ON public.rate_limit_logs
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for fraud_checks
CREATE POLICY "Service role can manage fraud checks" ON public.fraud_checks
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for trusted_devices
CREATE POLICY "Users can manage their own trusted devices" ON public.trusted_devices
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for activity_logs
CREATE POLICY "Users can view their own activity logs" ON public.activity_logs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Service role can log activities" ON public.activity_logs
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Function to cleanup expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.sessions
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old fraud checks (keep only last 90 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_fraud_checks()
RETURNS void AS $$
BEGIN
  DELETE FROM public.fraud_checks
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old rate limit logs (keep only last 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM public.rate_limit_logs
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.cleanup_expired_sessions() TO service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_old_fraud_checks() TO service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_old_rate_limits() TO service_role;

-- Create a scheduled job to cleanup old data (if pg_cron is available)
-- SELECT cron.schedule('cleanup-sessions', '0 */6 * * *', 'SELECT public.cleanup_expired_sessions()');
-- SELECT cron.schedule('cleanup-fraud', '0 0 * * *', 'SELECT public.cleanup_old_fraud_checks()');
-- SELECT cron.schedule('cleanup-ratelimits', '0 * * * *', 'SELECT public.cleanup_old_rate_limits()');
