-- Fix RLS Policies for Press Release Submission
-- Run this in your Supabase SQL Editor to fix the submission error

-- Drop existing policies
DROP POLICY IF EXISTS "Public can read published press releases" ON press_releases;
DROP POLICY IF EXISTS "Public can submit draft press releases" ON press_releases;
DROP POLICY IF EXISTS "Allow published press releases insertion" ON press_releases;
DROP POLICY IF EXISTS "Allow press releases updates" ON press_releases;
DROP POLICY IF EXISTS "Allow press releases deletion" ON press_releases;

-- Create more permissive policies for development
-- Note: These are permissive for development. Tighten for production.

-- Allow public to read published press releases
CREATE POLICY "Public can read published press releases" ON press_releases
  FOR SELECT USING (status = 'published');

-- Allow public to insert ANY press release (draft or published)
CREATE POLICY "Public can insert press releases" ON press_releases
  FOR INSERT WITH CHECK (true);

-- Allow public to update press releases (for admin functionality)
CREATE POLICY "Public can update press releases" ON press_releases
  FOR UPDATE USING (true);

-- Allow public to delete press releases (for admin functionality)
CREATE POLICY "Public can delete press releases" ON press_releases
  FOR DELETE USING (true);

-- Verify the policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'press_releases';
