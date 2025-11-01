#!/usr/bin/env node

/**
 * Reset Admin User Password
 * Usage: node scripts/reset-admin.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim()
      process.env[key.trim()] = value.replace(/^["']|["']$/g, '')
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  process.exit(1)
}

async function resetAdmin() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  const email = 'info@ebonidating.com'
  const password = '58259@staR'

  console.log('🔐 Resetting admin user...\n')

  try {
    // List users to find admin
    const { data: userData, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) throw listError

    const adminUser = userData.users.find(u => u.email === email)
    
    if (!adminUser) {
      console.error('❌ Admin user not found!')
      process.exit(1)
    }

    console.log('✅ Found admin user:', adminUser.id)

    // Update password and metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      {
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: 'Admin User',
          role: 'admin',
          is_admin: true,
        }
      }
    )

    if (updateError) throw updateError

    console.log('✅ Password updated!')

    // Ensure profile exists
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: adminUser.id,
        email: email,
        full_name: 'Admin User',
        role: 'admin',
        subscription_tier: 'vip',
        email_verified: true,
        is_admin: true,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      })

    if (profileError) {
      console.warn('⚠️  Profile warning:', profileError.message)
    } else {
      console.log('✅ Profile updated!')
    }

    console.log('\n🎉 SUCCESS! Admin credentials reset!\n')
    console.log('📧 Email:', email)
    console.log('🔑 Password:', password)
    console.log('🆔 User ID:', adminUser.id)
    console.log('\n🌐 Login at: https://ebonidating.com/admin/login')

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

resetAdmin()
