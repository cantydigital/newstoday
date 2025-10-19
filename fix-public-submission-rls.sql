-- ============================================================================
-- FIX PUBLIC SUBMISSION RLS POLICY
-- ============================================================================
-- This script fixes the RLS policy issue preventing public users from 
-- submitting draft press releases through the /submit form
-- ============================================================================

-- First, let's check current policies
SELECT policyname, cmd, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'press_releases';

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can read published press releases" ON press_releases;
DROP POLICY IF EXISTS "Public can submit draft press releases" ON press_releases;
DROP POLICY IF EXISTS "Allow published press releases insertion" ON press_releases;
DROP POLICY IF EXISTS "Allow press releases updates" ON press_releases;
DROP POLICY IF EXISTS "Allow press releases deletion" ON press_releases;

-- Recreate policies with correct permissions

-- 1. Public read access to published press releases
CREATE POLICY "Public can read published press releases" ON press_releases
  FOR SELECT USING (status = 'published');

-- 2. Allow public to submit draft press releases (CRITICAL for /submit form)
CREATE POLICY "Public can submit draft press releases" ON press_releases
  FOR INSERT WITH CHECK (status = 'draft');

-- 3. Allow public to insert published press releases (for admin dashboard)
CREATE POLICY "Allow published press releases insertion" ON press_releases
  FOR INSERT WITH CHECK (status = 'published');

-- 4. Allow public to update press releases (for admin dashboard)
CREATE POLICY "Allow press releases updates" ON press_releases
  FOR UPDATE USING (true);

-- 5. Allow public to delete press releases (for admin dashboard)
CREATE POLICY "Allow press releases deletion" ON press_releases
  FOR DELETE USING (true);

-- Verify policies were created correctly
SELECT policyname, cmd, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'press_releases'
ORDER BY policyname;

-- Test the draft insertion policy
-- This should work without authentication
INSERT INTO press_releases (
  slug, title, subtitle, content, category, author, company, 
  contact_email, status
) VALUES (
  'test-draft-submission',
  'Test Draft Submission',
  'Testing public draft submission',
  '<p>This is a test draft submission to verify RLS policies work correctly.</p>',
  'Technology',
  'Test Author',
  'Test Company',
  'test@example.com',
  'draft'
);

-- Clean up test data
DELETE FROM press_releases WHERE slug = 'test-draft-submission';

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- If the INSERT above succeeded, the RLS policy is working correctly.
-- If it failed, there may be other RLS or permission issues.
