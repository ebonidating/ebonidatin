#!/usr/bin/env node

/**
 * Simple Admin User Creation Script
 * Usage: node scripts/create-admin-simple.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Manually load .env.local
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
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

async function createAdmin() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  const email = 'info@ebonidating.com'
  const password = '58259@staR'

  console.log('🔐 Creating admin user...\n')

  try {
    // Create user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: 'Admin User',
        role: 'admin',
        is_admin: true,
      }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️  User already exists. Updating...')
        
        // Get existing user
        const { data: users } = await supabase.auth.admin.listUsers()
        const existingUser = users?.users.find(u => u.email === email)
        
        if (existingUser) {
          // Update password and metadata
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            {
              password: password,
              user_metadata: {
                full_name: 'Admin User',
                role: 'admin',
                is_admin: true,
              }
            }
          )
          
          if (updateError) {
            console.error('❌ Update error:', updateError)
            process.exit(1)
          }
          
          console.log('✅ Admin user updated!')
          console.log('\n📧 Email:', email)
          console.log('🔑 Password:', password)
          console.log('🆔 User ID:', existingUser.id)
          console.log('\n🌐 Login at: /admin/login')
          process.exit(0)
        }
      }
      throw authError
    }

    console.log('✅ Auth user created!')

    // Create/update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: email,
        full_name: 'Admin User',
        role: 'admin',
        subscription_tier: 'vip',
        email_verified: true,
        is_admin: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      })

    if (profileError) {
      console.warn('⚠️  Profile error:', profileError.message)
    } else {
      console.log('✅ Profile created!')
    }

    console.log('\n🎉 SUCCESS! Admin user created!\n')
    console.log('📧 Email:', email)
    console.log('🔑 Password:', password)
    console.log('🆔 User ID:', authData.user.id)
    console.log('\n🌐 Login at: /admin/login')

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

createAdmin()
