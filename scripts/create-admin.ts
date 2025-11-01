/**
 * Create Admin User Script
 * Run with: node --loader ts-node/esm scripts/create-admin.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function createAdminUser() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  const email = 'info@ebonidating.com'
  const password = '58259@staR'

  console.log('Creating admin user...')

  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: 'Admin User',
        role: 'admin',
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      throw authError
    }

    console.log('✅ Auth user created:', authData.user?.id)

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user!.id,
        email,
        full_name: 'Admin User',
        role: 'admin',
        subscription_tier: 'vip',
        email_verified: true,
        is_admin: true,
        created_at: new Date().toISOString(),
      })

    if (profileError) {
      console.error('Profile error:', profileError)
      // Continue even if profile creation fails (might already exist)
    } else {
      console.log('✅ Profile created')
    }

    // Update user role in auth metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      authData.user!.id,
      {
        user_metadata: {
          full_name: 'Admin User',
          role: 'admin',
          is_admin: true,
        }
      }
    )

    if (updateError) {
      console.error('Update error:', updateError)
    } else {
      console.log('✅ User metadata updated')
    }

    console.log('\n🎉 Admin user created successfully!')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('User ID:', authData.user?.id)
    console.log('\nYou can now login at /admin/login')

  } catch (error) {
    console.error('❌ Failed to create admin user:', error)
    process.exit(1)
  }
}

createAdminUser()
