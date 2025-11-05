import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

// GET - Check onboarding status
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get onboarding progress
    const { data: progress, error: progressError } = await supabase
      .from("onboarding_progress")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (progressError) {
      return NextResponse.json({ 
        needsOnboarding: true,
        currentStep: 1,
        profileCompleted: false
      })
    }

    // Check if should show onboarding
    const { data: shouldShow } = await supabase
      .rpc("should_show_onboarding", { user_uuid: user.id })

    return NextResponse.json({
      needsOnboarding: shouldShow,
      progress,
      currentStep: progress?.current_step || 1,
      profileCompleted: progress?.profile_completed || false,
      onboardingCompleted: progress?.onboarding_completed_at !== null
    })

  } catch (error: any) {
    console.error("Onboarding status error:", error)
    return NextResponse.json({ 
      error: "Failed to get onboarding status",
      needsOnboarding: true 
    }, { status: 500 })
  }
}

// POST - Update onboarding step
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { step, data: stepData } = body

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update onboarding step
    const { data: result, error: updateError } = await supabase
      .rpc("update_onboarding_step", {
        user_uuid: user.id,
        step_number: step,
        is_completed: true
      })

    if (updateError) {
      throw updateError
    }

    // Update profile with step data if provided
    if (stepData && Object.keys(stepData).length > 0) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update(stepData)
        .eq("id", user.id)

      if (profileError) {
        console.error("Profile update error:", profileError)
      }
    }

    return NextResponse.json({
      success: true,
      result,
      step,
      nextStep: step + 1
    })

  } catch (error: any) {
    console.error("Onboarding update error:", error)
    return NextResponse.json({ 
      error: "Failed to update onboarding",
      message: error.message 
    }, { status: 500 })
  }
}
