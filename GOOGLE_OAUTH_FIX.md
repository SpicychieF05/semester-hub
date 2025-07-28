# 🔧 Google OAuth Configuration Fix

## Problem
Getting "404: NOT_FOUND" error when trying to sign in with Google.

## Root Cause
The Google OAuth provider is not properly configured in Supabase, or the redirect URLs don't match.

## Step-by-Step Solution

### 1. Configure Supabase Authentication Settings

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `semester-hub`

2. **Update Site URL**
   - Go to: `Authentication` → `Settings`
   - Set **Site URL** to: `https://your-actual-domain.vercel.app`
   - Click **Save**

3. **Configure Redirect URLs**
   - In the same settings page
   - Add these **Redirect URLs**:
     ```
     https://your-actual-domain.vercel.app/auth/callback
     https://your-actual-domain.vercel.app/
     http://localhost:3000/auth/callback (for development)
     ```

### 2. Enable Google Provider

1. **Go to Providers Section**
   - Navigate to: `Authentication` → `Providers`
   - Find **Google** and click to configure

2. **Enable Google Provider**
   - Toggle **Enable Google provider** to ON
   - You'll need Google OAuth credentials

### 3. Configure Google Cloud Console

1. **Create/Configure Google OAuth App**
   - Go to: https://console.cloud.google.com/
   - Select your project or create new one
   - Go to: `APIs & Services` → `Credentials`

2. **Create OAuth 2.0 Client ID** (if not exists)
   - Click `+ CREATE CREDENTIALS` → `OAuth 2.0 Client IDs`
   - Application type: `Web application`
   - Name: `Semester Hub`

3. **Configure Authorized Origins**
   ```
   https://your-actual-domain.vercel.app
   http://localhost:3000 (for development)
   ```

4. **Configure Authorized Redirect URIs**
   ```
   https://uevunvpcbvvduvjqcwwl.supabase.co/auth/v1/callback
   http://localhost:54321/auth/v1/callback (for local development)
   ```

5. **Copy Credentials**
   - Copy `Client ID` and `Client Secret`

### 4. Add Google Credentials to Supabase

1. **Back to Supabase Providers**
   - Paste **Client ID** from Google Console
   - Paste **Client Secret** from Google Console
   - Click **Save**

### 5. Update Environment Variables

Add to your Vercel environment variables:
```env
REACT_APP_SUPABASE_URL=https://uevunvpcbvvduvjqcwwl.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
REACT_APP_SITE_URL=https://your-actual-domain.vercel.app
```

### 6. Deploy and Test

1. **Commit changes**
   ```bash
   git add .
   git commit -m "fix: google oauth configuration and callback handler"
   git push origin main
   ```

2. **Test the OAuth flow**
   - Go to your deployed site
   - Click "Sign in with Google"
   - Should redirect to Google → back to your site

## Updated Files

✅ **AuthCallback.js** - New OAuth callback handler
✅ **App.js** - Added `/auth/callback` route  
✅ **supabase.js** - Updated redirect URLs and error handling
✅ **DEPLOYMENT.md** - Added OAuth troubleshooting guide

## Common Issues & Solutions

**Issue**: Still getting 404 error
- **Solution**: Double-check all redirect URLs match exactly
- Ensure no trailing slashes mismatch

**Issue**: "Provider not enabled" error
- **Solution**: Make sure Google provider is enabled in Supabase dashboard

**Issue**: "Invalid client" error
- **Solution**: Verify Google Client ID and Secret are correct

**Issue**: Works locally but not in production
- **Solution**: Ensure production URLs are added to both Google Console and Supabase

## Testing Checklist

- [ ] Supabase Site URL matches your domain
- [ ] Google provider enabled in Supabase
- [ ] Google Client ID/Secret added to Supabase
- [ ] Authorized origins configured in Google Console
- [ ] Authorized redirect URIs configured in Google Console
- [ ] Environment variables set in Vercel
- [ ] Code deployed to production
- [ ] OAuth flow tested end-to-end

---

**Replace `your-actual-domain.vercel.app` with your real Vercel domain throughout this guide.**
