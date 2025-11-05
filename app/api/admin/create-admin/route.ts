import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify admin credentials
    const { adminEmail, adminPassword } = await request.json()

    if (adminEmail !== "admin@ebonidating.com" || adminPassword !== "58259@staR") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create admin user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: "admin@ebonidating.com",
      password: "58259@staR",
      email_confirm: true,
      user_metadata: {
        full_name: "Eboni Admin",
        user_type: "admin",
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Create admin profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email: "admin@ebonidating.com",
      full_name: "Eboni Admin",
      display_name: "Admin",
      user_type: "admin",
      membership_tier: "admin",
      subscription_tier: "admin",
      email_verified: true,
      is_verified: true,
      is_active: true,
      terms_accepted: true,
      terms_accepted_at: new Date().toISOString(),
    })

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    // Create admin user record
    const { error: adminError } = await supabase.from("admin_users").insert({
      user_id: authData.user.id,
      email: "admin@ebonidating.com",
      role: "super_admin",
    })

    if (adminError) {
      return NextResponse.json({ error: adminError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      email: "admin@ebonidating.com",
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
