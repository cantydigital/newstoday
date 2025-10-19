// Test Supabase Connection and Permissions
// Run this with: node test-supabase-connection.js

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Key (first 20 chars):', supabaseKey?.substring(0, 20) + '...')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.log('Make sure .env.local has:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_url')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    // Test 1: Basic connection
    console.log('\n🔍 Test 1: Basic connection...')
    const { data, error } = await supabase.from('press_releases').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }
    
    console.log('✅ Connection successful! Total press releases:', data?.length || 0)
    
    // Test 2: Try to insert a test record
    console.log('\n🔍 Test 2: Testing insert permissions...')
    const testData = {
      title: 'Test Press Release',
      slug: 'test-press-release-' + Date.now(),
      content: 'This is a test press release content.',
      category: 'Technology',
      author: 'Test Author',
      company: 'Test Company',
      contact_email: 'test@example.com',
      status: 'draft'
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('press_releases')
      .insert(testData)
      .select('id')
      .single()
    
    if (insertError) {
      console.error('❌ Insert failed:', insertError.message)
      console.error('Error code:', insertError.code)
      console.error('Error details:', insertError.details)
      return false
    }
    
    console.log('✅ Insert successful! ID:', insertData.id)
    
    // Test 3: Clean up - delete the test record
    console.log('\n🔍 Test 3: Cleaning up test record...')
    const { error: deleteError } = await supabase
      .from('press_releases')
      .delete()
      .eq('id', insertData.id)
    
    if (deleteError) {
      console.error('⚠️ Cleanup failed (but insert worked):', deleteError.message)
    } else {
      console.log('✅ Cleanup successful!')
    }
    
    return true
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message)
    return false
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 All tests passed! Your Supabase setup is working correctly.')
  } else {
    console.log('\n💡 Next steps:')
    console.log('1. Run the emergency-rls-fix.sql in your Supabase SQL Editor')
    console.log('2. Check your RLS policies in Supabase Dashboard > Authentication > Policies')
    console.log('3. Verify your environment variables are correct')
  }
  process.exit(success ? 0 : 1)
})
