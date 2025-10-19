# Firestore Setup Instructions

## Issue Resolution

The 400 Bad Request error you encountered is typically caused by missing composite indexes in Firestore. Here's how to resolve it:

## Required Firestore Indexes

You need to create the following composite indexes in your Firebase Console:

### 1. For Published Press Releases with Order
- **Collection ID**: `pressReleases`
- **Fields**:
  - `status` (Ascending)
  - `publishedAt` (Descending)

### 2. For Draft Press Releases with Order
- **Collection ID**: `pressReleases`
- **Fields**:
  - `status` (Ascending)
  - `createdAt` (Descending)

## How to Create Indexes

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`newstoday-b0f35`)
3. Navigate to **Firestore Database** → **Indexes**
4. Click **Create Index**
5. Add the fields as specified above

## Alternative Solution

The code has been updated with fallback queries that work without composite indexes:
- If the ordered query fails, it falls back to a simple query
- Results are sorted in memory instead of in the database
- This provides better error handling and reliability

## Testing

After creating the indexes (or using the fallback), the following should work:
- Homepage press release display
- Featured press releases section
- Admin dashboard draft management
- All press releases view

## Error Handling

The updated code includes:
- Try-catch blocks for all queries
- Fallback queries without orderBy
- In-memory sorting when database sorting fails
- Detailed error logging for debugging
