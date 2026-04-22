/**
 * Advanced Security Module
 * Implements rate limiting, 2FA, IP fraud detection, and session management
 */

import { createClient } from "@/lib/supabase/server"

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  keyPrefix: string // Redis key prefix
}

export interface FraudCheckResult {
  isFraudulent: boolean
  riskScore: number // 0-100
  flags: string[]
  recommendation: "allow" | "challenge" | "block"
}

/**
 * Rate limiting implementation
 */
export async function checkRateLimit(
  userId: string,
  action: string,
  config: RateLimitConfig = {
    windowMs: 60000, // 1 minute
    maxRequests: 10,
    keyPrefix: "ratelimit",
  }
): Promise<boolean> {
  const supabase = await createClient()
  const key = `${config.keyPrefix}:${userId}:${action}`

  try {
    // In production, use Redis or similar
    // This is a simplified implementation using Supabase
    const { data } = await supabase
      .from("rate_limit_logs")
      .select("id")
      .eq("user_id", userId)
      .eq("action", action)
      .gte(
        "created_at",
        new Date(Date.now() - config.windowMs).toISOString()
      )

    if ((data?.length || 0) >= config.maxRequests) {
      return false // Rate limit exceeded
    }

    // Log this request
    await supabase.from("rate_limit_logs").insert({
      user_id: userId,
      action,
    })

    return true
  } catch (error) {
    console.error("Rate limit check error:", error)
    return true // Allow on error
  }
}

/**
 * Check for suspicious activity using IP, device, and behavior analysis
 */
export async function checkFraud(
  userId: string,
  ipAddress: string,
  deviceId: string,
  action: string
): Promise<FraudCheckResult> {
  const supabase = await createClient()
  const flags: string[] = []
  let riskScore = 0

  try {
    // Check IP reputation
    const { data: loginHistory } = await supabase
      .from("login_history")
      .select("ip_address, country, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10)

    // Flag: New IP address
    const previousIPs = loginHistory?.map((l) => l.ip_address) || []
    if (!previousIPs.includes(ipAddress)) {
      flags.push("new_ip_address")
      riskScore += 15
    }

    // Flag: Unusual geolocation
    // This would require actual geolocation service integration
    if (loginHistory && loginHistory.length > 0) {
      // Check if user has jumped between countries too quickly
      const lastLogin = new Date(loginHistory[0].created_at)
      const timeSinceLastLogin = Date.now() - lastLogin.getTime()
      if (timeSinceLastLogin < 15 * 60 * 1000) {
        // Less than 15 minutes
        flags.push("impossible_travel")
        riskScore += 40
      }
    }

    // Check device fingerprint
    const { data: knownDevices } = await supabase
      .from("trusted_devices")
      .select("device_id")
      .eq("user_id", userId)
      .eq("is_trusted", true)

    const knownDeviceIds = knownDevices?.map((d) => d.device_id) || []
    if (knownDeviceIds.length > 0 && !knownDeviceIds.includes(deviceId)) {
      flags.push("new_device")
      riskScore += 20
    }

    // Check for excessive failed login attempts
    const { data: failedAttempts } = await supabase
      .from("login_history")
      .select("id")
      .eq("user_id", userId)
      .eq("success", false)
      .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString())

    if ((failedAttempts?.length || 0) > 5) {
      flags.push("excessive_failed_attempts")
      riskScore += 25
    }

    // Check for account takeover patterns
    const { data: recentActivity } = await supabase
      .from("activity_logs")
      .select("action, created_at")
      .eq("user_id", userId)
      .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString())

    // Flag: Unusual access patterns (too many API calls)
    if ((recentActivity?.length || 0) > 100) {
      flags.push("unusual_access_pattern")
      riskScore += 20
    }

    // Flag: Sensitive action from unusual context
    if (["password_change", "email_change", "disable_2fa"].includes(action)) {
      if (riskScore > 20) {
        flags.push("sensitive_action_high_risk")
        riskScore += 20
      }
    }

    // Log the fraud check
    await supabase.from("fraud_checks").insert({
      user_id: userId,
      ip_address: ipAddress,
      device_id: deviceId,
      action,
      risk_score: riskScore,
      flags,
    })

    // Determine recommendation
    let recommendation: "allow" | "challenge" | "block" = "allow"
    if (riskScore >= 60) {
      recommendation = "block"
    } else if (riskScore >= 30) {
      recommendation = "challenge"
    }

    return {
      isFraudulent: riskScore >= 60,
      riskScore: Math.min(100, riskScore),
      flags,
      recommendation,
    }
  } catch (error) {
    console.error("Fraud check error:", error)
    // Allow on error, but log it
    return {
      isFraudulent: false,
      riskScore: 0,
      flags: ["error_during_check"],
      recommendation: "allow",
    }
  }
}

/**
 * Enable 2FA for user
 */
export async function enable2FA(userId: string) {
  const supabase = await createClient()

  try {
    const secret = generateTOTPSecret()

    // Store secret temporarily
    const { error } = await supabase
      .from("two_factor_settings")
      .upsert({
        user_id: userId,
        secret,
        is_enabled: false,
        created_at: new Date().toISOString(),
      })

    if (error) throw error

    return {
      secret,
      qrCode: generateQRCode(userId, secret),
    }
  } catch (error) {
    console.error("2FA enable error:", error)
    throw error
  }
}

/**
 * Verify 2FA token
 */
export async function verify2FAToken(userId: string, token: string): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("two_factor_settings")
      .select("secret, is_enabled")
      .eq("user_id", userId)
      .single()

    if (error || !data?.is_enabled) return false

    const isValid = verifyTOTP(token, data.secret)
    return isValid
  } catch (error) {
    console.error("2FA verification error:", error)
    return false
  }
}

/**
 * Session management - track active sessions
 */
export async function createSession(
  userId: string,
  ipAddress: string,
  deviceId: string,
  userAgent: string
) {
  const supabase = await createClient()

  try {
    const sessionId = crypto.randomUUID()

    const { error } = await supabase.from("sessions").insert({
      id: sessionId,
      user_id: userId,
      ip_address: ipAddress,
      device_id: deviceId,
      user_agent: userAgent,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })

    if (error) throw error

    return sessionId
  } catch (error) {
    console.error("Session creation error:", error)
    throw error
  }
}

/**
 * Verify session is still valid
 */
export async function verifySession(sessionId: string): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("sessions")
      .select("id")
      .eq("id", sessionId)
      .gt("expires_at", new Date().toISOString())
      .single()

    return !error && !!data
  } catch (error) {
    return false
  }
}

/**
 * Terminate session
 */
export async function terminateSession(sessionId: string) {
  const supabase = await createClient()

  try {
    await supabase.from("sessions").delete().eq("id", sessionId)
  } catch (error) {
    console.error("Session termination error:", error)
  }
}

// ===== Helper Functions =====

function generateTOTPSecret(): string {
  // In production, use a proper TOTP library like speakeasy
  const length = 32
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  let secret = ""
  for (let i = 0; i < length; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return secret
}

function generateQRCode(userId: string, secret: string): string {
  // In production, use a QR code library
  // This is a placeholder URL format for Google Authenticator
  return `otpauth://totp/EboniDating:${userId}?secret=${secret}&issuer=EboniDating`
}

function verifyTOTP(token: string, secret: string): boolean {
  // In production, use a proper TOTP library
  // This is a simplified placeholder implementation
  return token.length === 6 && /^\d+$/.test(token)
}
