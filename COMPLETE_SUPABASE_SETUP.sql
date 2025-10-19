-- ============================================================================
-- COMPLETE SUPABASE SETUP FOR NEWS TODAY
-- ============================================================================
-- This script sets up everything needed for a fresh Supabase installation
-- Run this in your Supabase SQL Editor to create all tables, policies, and storage
-- ============================================================================

-- Clean up existing data (CAUTION: This will delete all existing data!)
-- Uncomment the lines below if you want to start completely fresh
/*
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS press_releases CASCADE;
DROP POLICY IF EXISTS "Public read access for images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload to images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete from images" ON storage.objects;
DROP POLICY IF EXISTS "Public update images" ON storage.objects;
DELETE FROM storage.objects WHERE bucket_id = 'images';
DELETE FROM storage.buckets WHERE id = 'images';
*/

-- ============================================================================
-- 1. CREATE PRESS RELEASES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS press_releases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  company TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  status TEXT CHECK (status IN ('draft', 'published', 'rejected')) DEFAULT 'draft' NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  rejection_reason TEXT
);

-- Create indexes for optimal query performance
CREATE UNIQUE INDEX IF NOT EXISTS press_releases_slug_idx ON press_releases(slug);
CREATE INDEX IF NOT EXISTS idx_press_releases_status ON press_releases(status);
CREATE INDEX IF NOT EXISTS idx_press_releases_published_at ON press_releases(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_press_releases_created_at ON press_releases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_press_releases_featured ON press_releases(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_press_releases_status_published_at ON press_releases(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_press_releases_category ON press_releases(category);
CREATE INDEX IF NOT EXISTS idx_press_releases_company ON press_releases(company);

-- ============================================================================
-- 2. CREATE CONTACT SUBMISSIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  status TEXT CHECK (status IN ('new', 'read', 'responded')) DEFAULT 'new' NOT NULL,
  admin_notes TEXT
);

-- Create indexes for contact submissions
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- ============================================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE press_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
-- Note: storage.objects RLS is managed by Supabase automatically

-- ============================================================================
-- 4. CREATE RLS POLICIES FOR PRESS RELEASES
-- ============================================================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can read published press releases" ON press_releases;
DROP POLICY IF EXISTS "Authenticated users can manage press releases" ON press_releases;
DROP POLICY IF EXISTS "Public can submit draft press releases" ON press_releases;
DROP POLICY IF EXISTS "Allow published press releases insertion" ON press_releases;
DROP POLICY IF EXISTS "Allow press releases updates" ON press_releases;
DROP POLICY IF EXISTS "Allow press releases deletion" ON press_releases;

-- Public read access to published press releases
CREATE POLICY "Public can read published press releases" ON press_releases
  FOR SELECT USING (status = 'published');

-- Allow public to submit draft press releases (for public submission form)
CREATE POLICY "Public can submit draft press releases" ON press_releases
  FOR INSERT WITH CHECK (status = 'draft');

-- Allow public to insert published press releases (for admin dashboard without auth)
-- Note: In production, replace this with proper authentication
CREATE POLICY "Allow published press releases insertion" ON press_releases
  FOR INSERT WITH CHECK (status = 'published');

-- Allow public to update press releases (for admin dashboard without auth)
-- Note: In production, replace this with proper authentication
CREATE POLICY "Allow press releases updates" ON press_releases
  FOR UPDATE USING (true);

-- Allow public to delete press releases (for admin dashboard without auth)
-- Note: In production, replace this with proper authentication
CREATE POLICY "Allow press releases deletion" ON press_releases
  FOR DELETE USING (true);

-- ============================================================================
-- 5. CREATE RLS POLICIES FOR CONTACT SUBMISSIONS
-- ============================================================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can submit contact forms" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can manage contact submissions" ON contact_submissions;

-- Allow public to submit contact forms
CREATE POLICY "Public can submit contact forms" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Allow public to manage contact submissions (for admin dashboard without auth)
-- Note: In production, replace this with proper authentication
CREATE POLICY "Public can manage contact submissions" ON contact_submissions
  FOR ALL USING (true);

-- ============================================================================
-- 6. CREATE STORAGE BUCKET
-- ============================================================================

-- Create the images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images', 
  'images', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

-- ============================================================================
-- IMPORTANT: STORAGE POLICIES SETUP
-- ============================================================================
-- Storage policies cannot be created via SQL due to permission restrictions.
-- After running this script, you MUST configure storage policies manually:
--
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to Storage → Policies
-- 3. Create these 4 policies for the 'images' bucket:
--
-- Policy 1: "Public read access for images"
--   - Operation: SELECT
--   - Target: public
--   - USING expression: bucket_id = 'images'
--
-- Policy 2: "Public upload to images"
--   - Operation: INSERT
--   - Target: public
--   - WITH CHECK expression: bucket_id = 'images'
--
-- Policy 3: "Public delete from images"
--   - Operation: DELETE
--   - Target: public
--   - USING expression: bucket_id = 'images'
--
-- Policy 4: "Public update images"
--   - Operation: UPDATE
--   - Target: public
--   - USING expression: bucket_id = 'images'
--
-- Without these policies, image uploads will fail with RLS errors.

-- ============================================================================
-- 7. CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function to generate slugs from titles (used by application)
CREATE OR REPLACE FUNCTION generate_slug_from_title(title TEXT) 
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(title, '[^\w\s-]', '', 'g'),
        '[\s_-]+', '-', 'g'
      ),
      '^-+|-+$', '', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get next available slug (handles duplicates)
CREATE OR REPLACE FUNCTION get_unique_slug(base_title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  base_slug := generate_slug_from_title(base_title);
  final_slug := base_slug;
  
  -- Check if slug exists and increment counter until unique
  WHILE EXISTS (SELECT 1 FROM press_releases WHERE slug = final_slug) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 8. INSERT SAMPLE DATA (OPTIONAL)
-- ============================================================================

-- Uncomment the lines below to insert sample press releases for testing
/*
INSERT INTO press_releases (
  slug, title, subtitle, content, category, author, company, 
  contact_email, status, featured, published_at
) VALUES 
(
  'sample-tech-announcement',
  'Revolutionary AI Technology Launches in Australia',
  'New artificial intelligence platform promises to transform business operations',
  '<p>Sydney-based tech company announces the launch of their groundbreaking AI platform that will revolutionize how businesses operate in the digital age.</p><p>The platform offers advanced machine learning capabilities, real-time analytics, and seamless integration with existing business systems.</p><p>This represents a significant milestone in Australian technology innovation and positions the country as a leader in AI development.</p>',
  'Technology & Startups',
  'Sarah Johnson',
  'TechCorp Australia',
  'sarah.johnson@techcorp.com.au',
  'published',
  true,
  NOW()
),
(
  'sustainable-energy-initiative',
  'Major Renewable Energy Project Announced',
  'Multi-billion dollar investment to power 500,000 homes with clean energy',
  '<p>A consortium of Australian companies has announced a major renewable energy project that will generate enough clean electricity to power half a million homes.</p><p>The project includes solar farms, wind turbines, and battery storage facilities across multiple states.</p><p>Construction is expected to begin next year and create over 2,000 jobs during the development phase.</p>',
  'Energy & Mining',
  'Michael Chen',
  'GreenPower Solutions',
  'michael.chen@greenpower.com.au',
  'published',
  false,
  NOW() - INTERVAL '1 day'
);
*/

-- ============================================================================
-- 9. VERIFICATION QUERIES
-- ============================================================================

-- Run these queries to verify the setup worked correctly:

-- Check tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('press_releases', 'contact_submissions');

-- Check indexes were created
SELECT indexname 
FROM pg_indexes 
WHERE tablename IN ('press_releases', 'contact_submissions');

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('press_releases', 'contact_submissions');

-- Check storage bucket exists
SELECT * FROM storage.buckets WHERE id = 'images';

-- Check storage policies exist
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%images%';

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================

-- Your Supabase database is now ready for the News Today application.
-- 
-- Next steps:
-- 1. Update your .env.local file with Supabase credentials
-- 2. Test the application functionality
-- 3. Consider implementing proper authentication for production use
-- 4. Monitor performance and adjust indexes as needed
-- 
-- For production deployment, remember to:
-- - Replace permissive policies with proper authentication
-- - Set up proper user roles and permissions
-- - Configure backup and monitoring
-- - Review and tighten security policies
