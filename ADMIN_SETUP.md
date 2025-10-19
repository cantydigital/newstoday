# Admin Panel Setup Guide

## Overview
The admin panel is now fully configured with Firebase integration for publishing press releases. The system includes secure login authentication and a comprehensive press release management interface.

## Setup Instructions

### 1. Environment Configuration
The `.env.local` file has been created with the following variables:

```bash
# Admin Panel Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
```

**⚠️ IMPORTANT**: Change the `ADMIN_PASSWORD` to a secure password before using the system.

### 2. Firebase Integration
- ✅ Firebase is configured and ready to use
- ✅ Firestore database integration is set up
- ✅ Press releases will be stored in the `pressReleases` collection

### 3. Admin Panel Features

#### Login System (`/admin/login`)
- Secure session-based authentication
- Credentials stored in environment variables
- 24-hour session timeout
- Protected routes with automatic redirects

#### Dashboard (`/admin/dashboard`)
- Protected route (requires login)
- Press release publishing form
- Logout functionality

#### Press Release Form Features
- **Required Fields**: Title, Category, Content, Author, Company, Contact Email
- **Optional Fields**: Subtitle, Contact Phone, Image URL
- **Categories**: Business, Technology, Health & Wellness, Education, Finance, Real Estate, Entertainment, Sports, Environment, Politics, Other
- **Featured Toggle**: Mark releases as featured for homepage prominence
- **Auto-timestamps**: Automatic creation and publication timestamps

## Usage

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Access Admin Panel
1. Navigate to `http://localhost:3000/admin/login`
2. Enter your admin credentials
3. Access the dashboard at `http://localhost:3000/admin/dashboard`

### 3. Publishing Press Releases
1. Fill out the press release form
2. Select appropriate category
3. Toggle "Featured" if needed
4. Click "Publish Press Release"
5. Data is automatically saved to Firebase Firestore

## Security Features
- ✅ Environment variables for sensitive data
- ✅ HTTP-only session cookies
- ✅ Secure cookie settings for production
- ✅ Protected routes with authentication checks
- ✅ `.gitignore` configured to exclude environment files

## Database Structure
Press releases are stored in Firestore with the following structure:
```javascript
{
  title: string,
  subtitle?: string,
  content: string,
  category: string,
  author: string,
  company: string,
  contactEmail: string,
  contactPhone?: string,
  featured?: boolean,
  imageUrl?: string,
  publishedAt: Timestamp,
  createdAt: Timestamp
}
```

## Next Steps
1. Update the admin password in `.env.local`
2. Test the login and publishing functionality
3. Customize categories if needed
4. Set up production environment variables when deploying

## Troubleshooting
- Ensure Firebase project is active and accessible
- Check that all environment variables are set correctly
- Verify that the development server is running on the correct port
- Check browser console for any JavaScript errors
