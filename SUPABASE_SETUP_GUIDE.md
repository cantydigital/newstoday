# Complete Supabase Setup Guide for News Today

This guide provides everything you need for a fresh Supabase installation for the News Today press release platform.

## 🚀 Quick Start

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Choose your organization
4. Enter project details:
   - **Name**: `news-today`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click **"Create new project"**
6. Wait for project to be ready (2-3 minutes)

### 2. Get Your Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Update Environment Variables
Create/update your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Admin Authentication (keep your existing values)
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-admin-password
```

### 4. Run the Database Setup
1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Click **"New Query"**
4. Copy and paste the entire contents of `COMPLETE_SUPABASE_SETUP.sql`
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. Wait for completion (should see "Success" message)

### 5. Configure Storage Policies (REQUIRED)
The SQL script cannot create storage policies due to permission restrictions. You must set these up manually:

1. Go to **Storage** → **Policies** in your Supabase dashboard
2. Create these 4 policies for the `images` bucket:

#### Policy 1: Public read access for images
- **Policy Name**: `Public read access for images`
- **Allowed Operation**: `SELECT`
- **Target Roles**: `public`
- **USING Expression**: `bucket_id = 'images'`

#### Policy 2: Public upload to images
- **Policy Name**: `Public upload to images`
- **Allowed Operation**: `INSERT`
- **Target Roles**: `public`
- **WITH CHECK Expression**: `bucket_id = 'images'`

#### Policy 3: Public delete from images
- **Policy Name**: `Public delete from images`
- **Allowed Operation**: `DELETE`
- **Target Roles**: `public`
- **USING Expression**: `bucket_id = 'images'`

#### Policy 4: Public update images
- **Policy Name**: `Public update images`
- **Allowed Operation**: `UPDATE`
- **Target Roles**: `public`
- **USING Expression**: `bucket_id = 'images'`

### 6. Verify Setup
Run these verification queries in the SQL Editor:

```sql
-- Check tables exist
SELECT COUNT(*) FROM press_releases;
SELECT COUNT(*) FROM contact_submissions;

-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'images';

-- Test sample data (if you uncommented the sample inserts)
SELECT title, status, created_at FROM press_releases ORDER BY created_at DESC;
```

## 📋 What Gets Created

### Database Tables

#### `press_releases`
- Complete press release management
- Slug-based URLs for SEO
- Draft/published/rejected workflow
- Image upload support
- Featured press releases
- Full-text search capabilities

#### `contact_submissions`
- Contact form submissions
- Admin management interface
- Status tracking (new/read/responded)
- Admin notes functionality

### Storage Setup
- **Bucket**: `images` (public, 5MB limit)
- **Supported formats**: JPG, PNG, GIF, WebP
- **Organization**: Files stored in `press-releases/` folder
- **Permissions**: Public read/write for easy uploads

### Security Policies
- **Public access**: Read published press releases
- **Public submissions**: Anyone can submit drafts
- **Admin access**: Full CRUD operations (currently public for simplicity)
- **Storage access**: Public upload/download for images

### Performance Optimizations
- **Indexes**: Optimized for common queries
- **Slug index**: Unique constraint for SEO URLs
- **Status indexes**: Fast filtering by publication status
- **Date indexes**: Efficient sorting by publication/creation date

## 🔧 Configuration Options

### Sample Data
To include sample press releases for testing, uncomment the INSERT statements in the SQL file before running it.

### Clean Installation
To completely wipe existing data, uncomment the DROP statements at the beginning of the SQL file.

### Production Security
For production use, consider:
1. Implementing proper user authentication
2. Restricting admin operations to authenticated users
3. Adding rate limiting for public submissions
4. Setting up monitoring and alerts

## 🧪 Testing Your Setup

### 1. Test Press Release Submission
1. Go to `http://localhost:3000/submit`
2. Fill out the form and submit
3. Check if it appears in admin dashboard

### 2. Test Admin Dashboard
1. Go to `http://localhost:3000/admin/login`
2. Login with your admin credentials
3. Verify you can see and manage press releases

### 3. Test Image Upload
1. Try uploading an image in any press release form
2. Verify the image appears and can be removed
3. Check the Supabase Storage dashboard

### 4. Test Public Pages
1. Visit the homepage and `/releases` page
2. Verify published press releases appear
3. Test the "Read Full Release" links

## 🔍 Database Schema

### Press Releases Table
```sql
press_releases (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,           -- SEO-friendly URL
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,               -- HTML content
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  company TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  published_at TIMESTAMPTZ,            -- When published
  created_at TIMESTAMPTZ NOT NULL,     -- When created
  status TEXT NOT NULL,                -- draft/published/rejected
  featured BOOLEAN DEFAULT FALSE,
  image_url TEXT,                      -- Supabase Storage URL
  rejection_reason TEXT
)
```

### Contact Submissions Table
```sql
contact_submissions (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL,                -- new/read/responded
  admin_notes TEXT
)
```

## 🚨 Troubleshooting

### Common Issues

#### "relation does not exist" Error
- **Cause**: SQL script didn't run completely
- **Fix**: Re-run the entire SQL script

#### "new row violates row-level security policy"
- **Cause**: RLS policies not set correctly
- **Fix**: Re-run the policy creation part of the script

#### Image Upload Fails
- **Cause**: Storage bucket or policies not configured
- **Fix**: Check storage policies in Supabase dashboard

#### Environment Variables Not Working
- **Cause**: `.env.local` not configured correctly
- **Fix**: Verify file exists and has correct values

### Verification Steps

1. **Check Tables**: Ensure both tables exist with correct schema
2. **Check Policies**: Verify RLS policies are created
3. **Check Storage**: Confirm images bucket exists and is public
4. **Check Environment**: Verify all env vars are set correctly

### Getting Help

- **Supabase Docs**: https://supabase.com/docs
- **Community**: https://github.com/supabase/supabase/discussions
- **Status Page**: https://status.supabase.com

## 🎯 Next Steps

After successful setup:

1. **Test all functionality** thoroughly
2. **Deploy to production** when ready
3. **Set up monitoring** for your Supabase project
4. **Configure backups** for important data
5. **Review security policies** for production use

Your News Today application is now ready to run with a fresh Supabase backend!
