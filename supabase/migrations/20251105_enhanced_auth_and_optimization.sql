-- ============================================================================
-- Enhanced Authentication, Email Verification & Database Optimization
-- Created: 2025-11-05
-- Purpose: Improve auth flow, track email verification, optimize performance
-- ============================================================================

-- ============================================================================
-- 1. EMAIL VERIFICATION TRACKING TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS core.email_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    verification_token TEXT,
    verification_sent_at TIMESTAMPTZ,
    verification_attempts INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMPTZ,
    verified_at TIMESTAMPTZ,
    verification_method TEXT CHECK (verification_method IN ('email_link', 'oauth', 'admin')),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for email_verifications
CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON core.email_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON core.email_verifications(email);
CREATE INDEX IF NOT EXISTS idx_email_verifications_verified_at ON core.email_verifications(verified_at);
CREATE INDEX IF NOT EXISTS idx_email_verifications_created_at ON core.email_verifications(created_at);

-- ============================================================================
-- 2. USER AUTHENTICATION LOG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS core.user_auth_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    auth_method TEXT CHECK (auth_method IN ('email_password', 'google_oauth', 'magic_link', 'phone')),
    auth_event TEXT CHECK (auth_event IN ('signup', 'login', 'logout', 'password_reset', 'email_verify')),
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    ip_address INET,
    user_agent TEXT,
    location_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for auth logs
CREATE INDEX IF NOT EXISTS idx_user_auth_logs_user_id ON core.user_auth_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_auth_logs_auth_event ON core.user_auth_logs(auth_event);
CREATE INDEX IF NOT EXISTS idx_user_auth_logs_created_at ON core.user_auth_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_auth_logs_success ON core.user_auth_logs(success);

-- ============================================================================
-- 3. ONBOARDING PROGRESS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS core.onboarding_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    current_step INTEGER DEFAULT 1,
    completed_steps INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    profile_completed BOOLEAN DEFAULT false,
    photos_added BOOLEAN DEFAULT false,
    interests_selected BOOLEAN DEFAULT false,
    preferences_set BOOLEAN DEFAULT false,
    onboarding_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for onboarding progress
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_user_id ON core.onboarding_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_profile_completed ON core.onboarding_progress(profile_completed);

-- ============================================================================
-- 4. UPDATE PROFILES TABLE - ADD MISSING COLUMNS
-- ============================================================================

-- Add OAuth provider tracking
ALTER TABLE core.profiles 
ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'email',
ADD COLUMN IF NOT EXISTS oauth_provider_id TEXT,
ADD COLUMN IF NOT EXISTS email_verification_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS profile_completion_percentage INTEGER DEFAULT 0;

-- Add index for auth_provider
CREATE INDEX IF NOT EXISTS idx_profiles_auth_provider ON core.profiles(auth_provider);
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified ON core.profiles(email_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed ON core.profiles(onboarding_completed);

-- ============================================================================
-- 5. IMPROVED AUTH TRIGGER FUNCTIONS
-- ============================================================================

-- Enhanced function to handle new user signup with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_display_name TEXT;
    auth_method TEXT;
BEGIN
    -- Determine display name
    user_display_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        SPLIT_PART(NEW.email, '@', 1)
    );
    
    -- Determine auth provider
    auth_method := CASE 
        WHEN NEW.raw_user_meta_data->>'provider' = 'google' THEN 'google'
        WHEN NEW.raw_user_meta_data->>'provider' = 'facebook' THEN 'facebook'
        ELSE 'email'
    END;

    -- Insert into profiles with comprehensive data
    INSERT INTO core.profiles (
        id,
        email,
        full_name,
        display_name,
        email_verified,
        auth_provider,
        oauth_provider_id,
        profile_photo_url,
        date_of_birth,
        gender,
        phone,
        city,
        country,
        last_login_at,
        login_count,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        user_display_name,
        user_display_name,
        COALESCE((NEW.email_confirmed_at IS NOT NULL), false),
        auth_method,
        NEW.raw_user_meta_data->>'sub',
        NEW.raw_user_meta_data->>'avatar_url',
        (NEW.raw_user_meta_data->>'date_of_birth')::DATE,
        NEW.raw_user_meta_data->>'gender',
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'city',
        NEW.raw_user_meta_data->>'country',
        NOW(),
        1,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;

    -- Create email verification record
    INSERT INTO core.email_verifications (
        user_id,
        email,
        verification_method,
        verified_at,
        created_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        CASE 
            WHEN NEW.email_confirmed_at IS NOT NULL THEN 'oauth'
            ELSE 'email_link'
        END,
        NEW.email_confirmed_at,
        NOW()
    )
    ON CONFLICT DO NOTHING;

    -- Create onboarding progress record
    INSERT INTO core.onboarding_progress (
        user_id,
        current_step,
        created_at
    )
    VALUES (
        NEW.id,
        1,
        NOW()
    )
    ON CONFLICT (user_id) DO NOTHING;

    -- Log the signup event
    INSERT INTO core.user_auth_logs (
        user_id,
        auth_method,
        auth_event,
        success,
        created_at
    )
    VALUES (
        NEW.id,
        CASE 
            WHEN auth_method = 'google' THEN 'google_oauth'
            ELSE 'email_password'
        END,
        'signup',
        true,
        NOW()
    );

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the user creation
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced email verification sync function
CREATE OR REPLACE FUNCTION public.sync_email_verification()
RETURNS TRIGGER AS $$
BEGIN
    -- Update profile email_verified status
    UPDATE core.profiles
    SET 
        email_verified = true,
        updated_at = NOW()
    WHERE id = NEW.id
    AND NEW.email_confirmed_at IS NOT NULL
    AND OLD.email_confirmed_at IS NULL;

    -- Update email verification record
    UPDATE core.email_verifications
    SET 
        verified_at = NEW.email_confirmed_at,
        verification_method = 'email_link',
        updated_at = NOW()
    WHERE user_id = NEW.id
    AND verified_at IS NULL;

    -- Log verification event
    INSERT INTO core.user_auth_logs (
        user_id,
        auth_method,
        auth_event,
        success,
        created_at
    )
    VALUES (
        NEW.id,
        'email_password',
        'email_verify',
        true,
        NOW()
    );

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error in sync_email_verification: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track login attempts
CREATE OR REPLACE FUNCTION public.track_user_login()
RETURNS TRIGGER AS $$
BEGIN
    -- Update profile with login info
    UPDATE core.profiles
    SET 
        last_login_at = NOW(),
        login_count = login_count + 1,
        last_active = NOW(),
        failed_login_attempts = 0,
        updated_at = NOW()
    WHERE id = NEW.id;

    -- Log successful login
    INSERT INTO core.user_auth_logs (
        user_id,
        auth_method,
        auth_event,
        success,
        created_at
    )
    VALUES (
        NEW.id,
        CASE 
            WHEN NEW.raw_user_meta_data->>'provider' = 'google' THEN 'google_oauth'
            ELSE 'email_password'
        END,
        'login',
        true,
        NOW()
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for tracking logins
DROP TRIGGER IF EXISTS on_user_login ON auth.users;
CREATE TRIGGER on_user_login
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    WHEN (NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at)
    EXECUTE FUNCTION public.track_user_login();

-- ============================================================================
-- 6. PROFILE COMPLETION CALCULATION FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.calculate_profile_completion(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    completion_score INTEGER := 0;
    profile_record RECORD;
BEGIN
    SELECT * INTO profile_record FROM core.profiles WHERE id = user_uuid;
    
    IF profile_record IS NULL THEN
        RETURN 0;
    END IF;

    -- Calculate completion (each field worth points)
    IF profile_record.full_name IS NOT NULL AND LENGTH(profile_record.full_name) > 0 THEN
        completion_score := completion_score + 10;
    END IF;
    
    IF profile_record.bio IS NOT NULL AND LENGTH(profile_record.bio) > 20 THEN
        completion_score := completion_score + 15;
    END IF;
    
    IF profile_record.date_of_birth IS NOT NULL THEN
        completion_score := completion_score + 10;
    END IF;
    
    IF profile_record.gender IS NOT NULL THEN
        completion_score := completion_score + 5;
    END IF;
    
    IF profile_record.city IS NOT NULL AND profile_record.country IS NOT NULL THEN
        completion_score := completion_score + 10;
    END IF;
    
    IF profile_record.profile_photo_url IS NOT NULL THEN
        completion_score := completion_score + 20;
    END IF;
    
    IF profile_record.additional_photos IS NOT NULL AND array_length(profile_record.additional_photos, 1) > 0 THEN
        completion_score := completion_score + 15;
    END IF;
    
    IF profile_record.interests IS NOT NULL AND array_length(profile_record.interests, 1) > 2 THEN
        completion_score := completion_score + 10;
    END IF;
    
    IF profile_record.looking_for IS NOT NULL THEN
        completion_score := completion_score + 5;
    END IF;

    -- Update the profile with completion percentage
    UPDATE core.profiles 
    SET profile_completion_percentage = completion_score
    WHERE id = user_uuid;

    RETURN completion_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. ONBOARDING HELPER FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_onboarding_step(
    user_uuid UUID,
    step_number INTEGER,
    is_completed BOOLEAN DEFAULT true
)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    profile_complete BOOLEAN;
BEGIN
    -- Update onboarding progress
    UPDATE core.onboarding_progress
    SET 
        current_step = GREATEST(current_step, step_number),
        completed_steps = array_append(
            COALESCE(completed_steps, ARRAY[]::INTEGER[]), 
            step_number
        ),
        profile_completed = CASE 
            WHEN step_number = 1 THEN true 
            ELSE profile_completed 
        END,
        photos_added = CASE 
            WHEN step_number = 2 THEN true 
            ELSE photos_added 
        END,
        interests_selected = CASE 
            WHEN step_number = 3 THEN true 
            ELSE interests_selected 
        END,
        preferences_set = CASE 
            WHEN step_number = 4 THEN true 
            ELSE preferences_set 
        END,
        onboarding_completed_at = CASE 
            WHEN step_number >= 4 THEN NOW() 
            ELSE onboarding_completed_at 
        END,
        updated_at = NOW()
    WHERE user_id = user_uuid
    RETURNING profile_completed INTO profile_complete;

    -- Update profile onboarding status
    IF step_number >= 4 THEN
        UPDATE core.profiles
        SET onboarding_completed = true
        WHERE id = user_uuid;
    END IF;

    -- Calculate profile completion
    PERFORM public.calculate_profile_completion(user_uuid);

    -- Return result
    SELECT jsonb_build_object(
        'success', true,
        'current_step', step_number,
        'onboarding_completed', (step_number >= 4)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. PERFORMANCE OPTIMIZATION INDEXES
-- ============================================================================

-- Profiles table optimizations
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON core.profiles(last_active DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON core.profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON core.profiles(subscription_tier) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_profiles_location ON core.profiles(city, country) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_profiles_gender_interested ON core.profiles(gender) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_profiles_completion ON core.profiles(profile_completion_percentage DESC) WHERE is_active = true;

-- Composite indexes for matching
CREATE INDEX IF NOT EXISTS idx_profiles_active_location_gender 
    ON core.profiles(is_active, city, gender) 
    WHERE is_active = true AND email_verified = true;

-- Posts table optimizations
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON core.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user_created ON core.posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_likes_count ON core.posts(likes_count DESC) WHERE is_featured = false;

-- Messages optimization
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messaging.messages(sender_id, receiver_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messaging.messages(receiver_id, is_read) WHERE is_read = false;

-- Likes optimization
CREATE INDEX IF NOT EXISTS idx_likes_mutual ON social.likes(liker_id, liked_id, created_at DESC);

-- ============================================================================
-- 9. RLS POLICIES FOR NEW TABLES
-- ============================================================================

-- Enable RLS
ALTER TABLE core.email_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.user_auth_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Email verifications policies
CREATE POLICY "Users can view own email verifications"
    ON core.email_verifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage email verifications"
    ON core.email_verifications FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Auth logs policies
CREATE POLICY "Users can view own auth logs"
    ON core.user_auth_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage auth logs"
    ON core.user_auth_logs FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Onboarding progress policies
CREATE POLICY "Users can view own onboarding progress"
    ON core.onboarding_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding progress"
    ON core.onboarding_progress FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage onboarding"
    ON core.onboarding_progress FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- 10. UTILITY FUNCTIONS
-- ============================================================================

-- Function to get user dashboard stats
CREATE OR REPLACE FUNCTION public.get_user_dashboard_stats(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    stats JSONB;
BEGIN
    SELECT jsonb_build_object(
        'profile_completion', profile_completion_percentage,
        'total_likes', (SELECT COUNT(*) FROM social.likes WHERE liked_id = user_uuid),
        'total_matches', (SELECT COUNT(*) FROM messaging.matches WHERE user_id_1 = user_uuid OR user_id_2 = user_uuid),
        'unread_messages', (SELECT COUNT(*) FROM messaging.messages WHERE receiver_id = user_uuid AND is_read = false),
        'posts_count', (SELECT COUNT(*) FROM core.posts WHERE user_id = user_uuid),
        'followers_count', followers_count,
        'following_count', following_count,
        'last_active', last_active,
        'member_since', created_at,
        'subscription_tier', subscription_tier,
        'onboarding_completed', onboarding_completed
    ) INTO stats
    FROM core.profiles
    WHERE id = user_uuid;

    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user should see onboarding
CREATE OR REPLACE FUNCTION public.should_show_onboarding(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    show_onboarding BOOLEAN;
BEGIN
    SELECT NOT onboarding_completed INTO show_onboarding
    FROM core.profiles
    WHERE id = user_uuid;

    RETURN COALESCE(show_onboarding, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 11. AUTOMATIC TRIGGERS
-- ============================================================================

-- Trigger to automatically update profile completion on profile changes
CREATE OR REPLACE FUNCTION public.auto_update_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.calculate_profile_completion(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_auto_profile_completion ON core.profiles;
CREATE TRIGGER trigger_auto_profile_completion
    AFTER UPDATE ON core.profiles
    FOR EACH ROW
    WHEN (
        OLD.full_name IS DISTINCT FROM NEW.full_name OR
        OLD.bio IS DISTINCT FROM NEW.bio OR
        OLD.profile_photo_url IS DISTINCT FROM NEW.profile_photo_url OR
        OLD.additional_photos IS DISTINCT FROM NEW.additional_photos OR
        OLD.interests IS DISTINCT FROM NEW.interests
    )
    EXECUTE FUNCTION public.auto_update_profile_completion();

-- ============================================================================
-- 12. GRANT PERMISSIONS
-- ============================================================================

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION public.calculate_profile_completion(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.update_onboarding_step(UUID, INTEGER, BOOLEAN) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_user_dashboard_stats(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.should_show_onboarding(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.track_user_login() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.auto_update_profile_completion() TO authenticated, service_role;

-- Grant table access
GRANT SELECT, INSERT, UPDATE ON core.email_verifications TO authenticated, service_role;
GRANT SELECT, INSERT ON core.user_auth_logs TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON core.onboarding_progress TO authenticated, service_role;

-- ============================================================================
-- 13. DATA CLEANUP AND OPTIMIZATION
-- ============================================================================

-- Remove duplicate indexes if any exist
DROP INDEX IF EXISTS idx_profiles_email_old;
DROP INDEX IF EXISTS idx_profiles_user_type_old;

-- Update existing profiles with initial completion scores
DO $$
DECLARE
    profile_rec RECORD;
BEGIN
    FOR profile_rec IN SELECT id FROM core.profiles LOOP
        PERFORM public.calculate_profile_completion(profile_rec.id);
    END LOOP;
END $$;

-- ============================================================================
-- 14. VIEWS FOR EASIER QUERYING
-- ============================================================================

-- View for active verified users
CREATE OR REPLACE VIEW core.active_users AS
SELECT 
    p.*,
    ev.verified_at as email_verified_at,
    ev.verification_method,
    op.onboarding_completed_at,
    op.profile_completed
FROM core.profiles p
LEFT JOIN core.email_verifications ev ON p.id = ev.user_id
LEFT JOIN core.onboarding_progress op ON p.id = op.user_id
WHERE p.is_active = true 
AND p.email_verified = true;

-- View for user stats
CREATE OR REPLACE VIEW core.user_statistics AS
SELECT 
    p.id,
    p.full_name,
    p.email,
    p.created_at,
    p.last_active,
    p.subscription_tier,
    p.profile_completion_percentage,
    p.login_count,
    p.followers_count,
    p.following_count,
    (SELECT COUNT(*) FROM social.likes WHERE liked_id = p.id) as total_likes_received,
    (SELECT COUNT(*) FROM social.likes WHERE liker_id = p.id) as total_likes_given,
    (SELECT COUNT(*) FROM messaging.matches WHERE user_id_1 = p.id OR user_id_2 = p.id) as total_matches,
    (SELECT COUNT(*) FROM core.posts WHERE user_id = p.id) as total_posts,
    (SELECT COUNT(*) FROM messaging.messages WHERE receiver_id = p.id AND is_read = false) as unread_messages
FROM core.profiles p;

-- ============================================================================
-- 15. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE core.email_verifications IS 'Tracks email verification attempts and status for all users';
COMMENT ON TABLE core.user_auth_logs IS 'Logs all authentication events including signups, logins, and verification';
COMMENT ON TABLE core.onboarding_progress IS 'Tracks user onboarding completion progress';

COMMENT ON COLUMN core.profiles.auth_provider IS 'Authentication provider: email, google, facebook, etc';
COMMENT ON COLUMN core.profiles.profile_completion_percentage IS 'Profile completion score from 0-100';
COMMENT ON COLUMN core.profiles.onboarding_completed IS 'Whether user has completed onboarding flow';

COMMENT ON FUNCTION public.calculate_profile_completion(UUID) IS 'Calculates and updates profile completion percentage';
COMMENT ON FUNCTION public.update_onboarding_step(UUID, INTEGER, BOOLEAN) IS 'Updates user onboarding progress';
COMMENT ON FUNCTION public.get_user_dashboard_stats(UUID) IS 'Returns comprehensive dashboard statistics for a user';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Verify tables exist
DO $$
BEGIN
    ASSERT (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'core' AND table_name = 'email_verifications') = 1,
        'email_verifications table not created';
    ASSERT (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'core' AND table_name = 'user_auth_logs') = 1,
        'user_auth_logs table not created';
    ASSERT (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'core' AND table_name = 'onboarding_progress') = 1,
        'onboarding_progress table not created';
    
    RAISE NOTICE '✅ Migration completed successfully!';
    RAISE NOTICE '✅ Email verification tracking enabled';
    RAISE NOTICE '✅ Auth logging system active';
    RAISE NOTICE '✅ Onboarding progress tracking enabled';
    RAISE NOTICE '✅ Performance indexes created';
    RAISE NOTICE '✅ Profile completion calculation active';
END $$;
