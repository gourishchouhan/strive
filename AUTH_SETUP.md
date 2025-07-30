# Authentication Setup Guide

## 🔐 NextAuth.js with Google OAuth Setup

This guide will help you set up Google OAuth authentication for your Strive application.

## 📋 Prerequisites

1. **Google Cloud Console Account**: You need a Google account to create OAuth credentials
2. **MongoDB Database**: Your database should be set up and running

## 🚀 Step-by-Step Setup

### Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (or select existing)
   - Click "Select a project" → "New Project"
   - Name: "Strive App" (or your preferred name)
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" or "Google Identity"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Name: "Strive Web Client"

5. **Configure OAuth Consent Screen**
   - Go to "OAuth consent screen"
   - Choose "External" (for testing)
   - Fill in required fields:
     - App name: "Strive"
     - User support email: your email
     - Developer contact email: your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users: your email addresses

6. **Set Authorized URLs**
   - Authorized JavaScript origins:
     ```
     http://localhost:3001
     https://your-domain.vercel.app
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:3001/api/auth/callback/google
     https://your-domain.vercel.app/api/auth/callback/google
     ```

7. **Copy Your Credentials**
   - Copy the `Client ID` and `Client Secret`

### Step 2: Update Environment Variables

Update your `.env.local` file:

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/strive?retryWrites=true&w=majority

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
NODE_ENV=development

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=af8d9e7c6b5a4f3e2d1c0b9a8e7f6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e

# Google OAuth (Replace with your actual credentials)
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
```

### Step 3: Update Production Environment Variables

For Vercel deployment, add these environment variables in your Vercel dashboard:

```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=af8d9e7c6b5a4f3e2d1c0b9a8e7f6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
```

## 🧪 Testing the Setup

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test the flow**:
   - Visit `http://localhost:3001`
   - Click "Get Started" or "Sign In"
   - You should be redirected to `/auth`
   - Click "Continue with Google"
   - Complete the Google OAuth flow
   - You should be redirected to `/dashboard`

## 🔧 Features Implemented

### ✅ **Authentication System**
- **Landing Page**: Beautiful marketing page for unauthenticated users
- **Authentication Page**: Clean OAuth sign-in page at `/auth`
- **Protected Routes**: Dashboard and app features require authentication
- **User Management**: User data stored in MongoDB with profile info

### ✅ **User Experience**
- **Session Management**: Persistent login with JWT tokens
- **Conditional Layout**: Sidebar only shows for authenticated users
- **User Profile**: Display user info and logout option in sidebar
- **Redirects**: Proper redirections based on authentication state

### ✅ **Database Integration**
- **User Model**: Store user information from Google OAuth
- **User Relationships**: All challenges and tasks linked to specific users
- **Data Isolation**: Users only see their own data

## 🚨 Important Security Notes

1. **Keep secrets secure**: Never commit real OAuth credentials to version control
2. **Use HTTPS in production**: Always use HTTPS for OAuth callbacks in production
3. **Rotate secrets**: Change NEXTAUTH_SECRET for production deployment
4. **Validate domains**: Only add trusted domains to OAuth settings

## 📱 Application Flow

1. **Unauthenticated User** → Landing Page (`/`) → Auth Page (`/auth`) → Google OAuth
2. **Authenticated User** → Dashboard (`/dashboard`) → Full app access
3. **Logout** → Return to Landing Page

## 🔄 Data Migration

If you have existing dummy data, you'll need to:

1. **Clear existing data** (challenges and tasks without userId)
2. **Create fresh data** after signing in with Google
3. **Or run migration script** to assign existing data to users

## 🎯 Next Steps

1. **Set up Google OAuth credentials** using the guide above
2. **Update environment variables** with real credentials
3. **Test the authentication flow** locally
4. **Deploy to production** with proper environment variables

Your Strive application now has a complete authentication system with Google OAuth! 🎉
