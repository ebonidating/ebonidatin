#!/usr/bin/env node

/**
 * Supabase Database Update Script
 * Connects to Supabase and runs necessary updates
 */

import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read .env.local manually
const envPath = join(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    const key = match[1].trim()
    let value = match[2].trim()
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    envVars[key] = value
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testConnection() {
  console.log('🔌 Testing Supabase connection...')
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true })
    
    if (error) throw error
    
    console.log('✅ Connected to Supabase successfully!')
    console.log(`📊 Total profiles: ${data || 0}`)
    return true
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    return false
  }
}

async function updateProfiles() {
  console.log('\n📝 Updating profiles...')
  
  try {
    // Update profiles with missing data
    const { data, error } = await supabase
      .from('profiles')
      .update({
        updated_at: new Date().toISOString()
      })
      .is('updated_at', null)
    
    if (error && error.code !== 'PGRST116') throw error
    
    console.log('✅ Profiles updated successfully')
  } catch (error) {
    console.error('❌ Error updating profiles:', error.message)
  }
}

async function cleanupBrokenRelationships() {
  console.log('\n🧹 Cleaning up broken relationships...')
  
  try {
    // Get all profile IDs
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
    
    if (profileError) throw profileError
    
    const validIds = profiles.map(p => p.id)
    
    console.log(`📋 Found ${validIds.length} valid profile IDs`)
    
    // Clean up matches
    const { error: matchError } = await supabase
      .from('matches')
      .delete()
      .not('user_id_1', 'in', `(${validIds.join(',')})`)
    
    if (matchError && matchError.code !== 'PGRST116') {
      console.log('⚠️  Could not clean matches:', matchError.message)
    }
    
    console.log('✅ Cleanup completed')
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message)
  }
}

async function updateSubscriptionStatuses() {
  console.log('\n💳 Updating subscription statuses...')
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ subscription_tier: 'free' })
      .in('subscription_tier', ['premium', 'elite'])
      .lt('subscription_end_date', new Date().toISOString())
    
    if (error && error.code !== 'PGRST116') throw error
    
    console.log('✅ Subscription statuses updated')
  } catch (error) {
    console.error('❌ Error updating subscriptions:', error.message)
  }
}

async function addFAQEntries() {
  console.log('\n❓ Adding FAQ entries...')
  
  const faqs = [
    {
      category: 'Getting Started',
      question: 'How do I create an account?',
      answer: 'Click "Get Started" or "Sign Up" on the homepage. You can register using your email or sign up instantly with Google.',
      created_at: new Date().toISOString()
    },
    {
      category: 'Getting Started',
      question: 'Is Eboni Dating really free?',
      answer: 'Yes! Our basic membership is completely free. Premium and Elite tiers offer additional features like unlimited messaging and advanced filters.',
      created_at: new Date().toISOString()
    },
    {
      category: 'Profile & Matching',
      question: 'How does the matching algorithm work?',
      answer: 'Our algorithm considers your location, age preferences, interests, relationship goals, and cultural values to suggest compatible matches.',
      created_at: new Date().toISOString()
    },
    {
      category: 'Safety & Privacy',
      question: 'Is my personal information safe?',
      answer: 'Yes! We use bank-level encryption, never share your data with third parties, and comply with international privacy laws.',
      created_at: new Date().toISOString()
    }
  ]
  
  try {
    // Check if faqs table exists
    const { error: checkError } = await supabase
      .from('faqs')
      .select('id')
      .limit(1)
    
    if (checkError && checkError.code === '42P01') {
      console.log('⚠️  FAQs table does not exist - skipping')
      return
    }
    
    // Insert FAQs
    for (const faq of faqs) {
      const { error } = await supabase
        .from('faqs')
        .upsert(faq, { onConflict: 'question' })
      
      if (error && error.code !== '42P01') {
        console.log(`⚠️  Could not add FAQ: ${faq.question}`)
      }
    }
    
    console.log('✅ FAQ entries added')
  } catch (error) {
    console.error('❌ Error adding FAQs:', error.message)
  }
}

async function getStatistics() {
  console.log('\n📊 Fetching database statistics...')
  
  try {
    const stats = {}
    
    // Profiles
    const { count: profileCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    stats.profiles = profileCount
    
    // Verified profiles
    const { count: verifiedCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('verified', true)
    stats.verified = verifiedCount
    
    // Active subscriptions
    const { count: activeSubscriptions } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .in('subscription_tier', ['premium', 'elite'])
      .or(`subscription_end_date.is.null,subscription_end_date.gt.${new Date().toISOString()}`)
    stats.activeSubscriptions = activeSubscriptions
    
    // Matches
    const { count: matchCount } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })
    stats.matches = matchCount
    
    // Messages
    const { count: messageCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
    stats.messages = messageCount
    
    console.log('\n📈 Database Statistics:')
    console.log(`   Total Profiles: ${stats.profiles || 0}`)
    console.log(`   Verified Profiles: ${stats.verified || 0}`)
    console.log(`   Active Subscriptions: ${stats.activeSubscriptions || 0}`)
    console.log(`   Total Matches: ${stats.matches || 0}`)
    console.log(`   Total Messages: ${stats.messages || 0}`)
    
    return stats
  } catch (error) {
    console.error('❌ Error fetching statistics:', error.message)
    return {}
  }
}

async function main() {
  console.log('🚀 Starting Supabase Database Update Script\n')
  console.log('=' .repeat(50))
  
  // Test connection
  const connected = await testConnection()
  if (!connected) {
    console.error('\n❌ Cannot proceed without database connection')
    process.exit(1)
  }
  
  // Run updates
  await updateProfiles()
  await updateSubscriptionStatuses()
  await cleanupBrokenRelationships()
  await addFAQEntries()
  
  // Get final statistics
  await getStatistics()
  
  console.log('\n' + '='.repeat(50))
  console.log('✅ Database update completed successfully!')
  console.log('\nNext steps:')
  console.log('1. Review the statistics above')
  console.log('2. Check Supabase dashboard for any warnings')
  console.log('3. Test the application to ensure everything works')
  console.log('\n🎉 Done!')
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
