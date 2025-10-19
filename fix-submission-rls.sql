-- ============================================================================
-- FIX PUBLIC SUBMISSION RLS POLICY - COMPREHENSIVE SOLUTION
-- ============================================================================
-- This script completely fixes the RLS policy issue preventing public users 
-- from submitting draft press releases through the /submit form
-- ============================================================================

-- First, check current policies and their status
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'press_releases'
ORDER BY policyname;

-- ============================================================================
-- STEP 1: CLEAN SLATE - Remove all existing policies
-- ============================================================================

DROP POLICY IF EXISTS "Public can read published press releases" ON press_releases;
DROP POLICY IF EXISTS "Public can submit draft press releases" ON press_releases;
DROP POLICY IF EXISTS "Allow published press releases insertion" ON press_releases;
DROP POLICY IF EXISTS "Allow press releases updates" ON press_releases;
DROP POLICY IF EXISTS "Allow press releases deletion" ON press_releases;
DROP POLICY IF EXISTS "Authenticated users can manage press releases" ON press_releases;
DROP POLICY IF EXISTS "Public can insert press releases" ON press_releases;
DROP POLICY IF EXISTS "Public can update press releases" ON press_releases;
DROP POLICY IF EXISTS "Public can delete press releases" ON press_releases;

-- ============================================================================
-- STEP 2: Verify RLS is enabled
-- ============================================================================

ALTER TABLE press_releases ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 3: Create new, working policies
-- ============================================================================

-- 1. Public read access to published press releases only
CREATE POLICY "public_read_published" ON press_releases
  FOR SELECT 
  USING (status = 'published');

-- 2. Allow public to insert draft press releases (CRITICAL for /submit form)
-- This policy allows anyone to insert a press release with status = 'draft'
CREATE POLICY "public_insert_drafts" ON press_releases
  FOR INSERT 
  WITH CHECK (status = 'draft');

-- 3. Allow public to insert published press releases (for admin functionality)
-- This allows the admin dashboard to publish releases directly
CREATE POLICY "public_insert_published" ON press_releases
  FOR INSERT 
  WITH CHECK (status = 'published');

-- 4. Allow public to update any press release (for admin functionality)
-- This allows the admin dashboard to edit and approve/reject releases
CREATE POLICY "public_update_all" ON press_releases
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- 5. Allow public to delete any press release (for admin functionality)
CREATE POLICY "public_delete_all" ON press_releases
  FOR DELETE 
  USING (true);

-- ============================================================================
-- STEP 4: Verify policies were created correctly
-- ============================================================================

SELECT 
  policyname, 
  cmd, 
  permissive,
  roles, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename = 'press_releases'
ORDER BY policyname;

-- ============================================================================
-- STEP 5: Test the draft insertion (this should work)
-- ============================================================================

-- Test inserting a draft press release (should succeed)
INSERT INTO press_releases (
  slug, 
  title, 
  subtitle, 
  content, 
  category, 
  author, 
  company, 
  contact_email, 
  status
) VALUES (
  'test-rls-draft-' || extract(epoch from now())::text,
  'Test RLS Draft Submission',
  'Testing RLS policies for draft submission',
  '<p>This is a test draft submission to verify RLS policies work correctly for public submissions.</p>',
  'Technology',
  'Test Author',
  'Test Company',
  'test@example.com',
  'draft'
);

-- Verify the test record was inserted
SELECT id, title, status, created_at 
FROM press_releases 
WHERE title = 'Test RLS Draft Submission'
ORDER BY created_at DESC 
LIMIT 1;

-- Clean up test data
DELETE FROM press_releases 
WHERE title = 'Test RLS Draft Submission';

-- ============================================================================
-- STEP 6: Final verification
-- ============================================================================

-- Show final policy configuration
SELECT 
  'Policy Name: ' || policyname as policy_info,
  'Command: ' || cmd as command_info,
  'Condition: ' || COALESCE(qual, 'none') as condition_info,
  'Check: ' || COALESCE(with_check, 'none') as check_info
FROM pg_policies 
WHERE tablename = 'press_releases'
ORDER BY policyname;

-- ============================================================================
-- TROUBLESHOOTING NOTES
-- ============================================================================
-- If the INSERT test above fails, check:
-- 1. RLS is enabled: SELECT relrowsecurity FROM pg_class WHERE relname = 'press_releases';
-- 2. Policies exist: SELECT count(*) FROM pg_policies WHERE tablename = 'press_releases';
-- 3. Supabase service role permissions
-- 4. Environment variables are correctly set
-- ============================================================================
