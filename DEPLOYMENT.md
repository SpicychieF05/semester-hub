# Semester Hub - Vercel Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Files Created/Updated for Deployment:
- ✅ `vercel.json` - Optimized Vercel configuration
- ✅ `.vercelignore` - Files to exclude from deployment
- ✅ `public/_redirects` - SPA routing fallback
- ✅ `deploy-check.sh` - Unix deployment test script
- ✅ `deploy-check.bat` - Windows deployment test script

### 2. Environment Variables Required:
```
REACT_APP_SUPABASE_URL=https://uevunvpcbvvduvjqcwwl.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_SITE_URL=https://your-domain.vercel.app
```

## 🚀 Deployment Steps

### Option 1: New Vercel Project (Recommended)

1. **Delete old Vercel project** (if exists)
   - Go to Vercel Dashboard
   - Select old project → Settings → Advanced → Delete Project

2. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "feat: optimized vercel deployment configuration"
   git push origin main
   ```

3. **Create new Vercel project**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub: `SpicychieF05/semester-hub`
   - Project Name: `semester-hub`
   - Framework: `Create React App` (auto-detected)
   - Keep default settings and click "Deploy"

4. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all three environment variables listed above
   - Redeploy if needed

### Option 2: Existing Project Update

1. **Push updated configuration**
   ```bash
   git add .
   git commit -m "fix: updated vercel configuration"
   git push origin main
   ```

2. **Trigger redeploy**
   - Vercel will auto-deploy on git push
   - Or manually redeploy from Vercel dashboard

## 🔧 Local Testing

Run the deployment check script:

**Windows:**
```bash
./deploy-check.bat
```

**Unix/Linux/Mac:**
```bash
chmod +x deploy-check.sh
./deploy-check.sh
```

## 📁 Key Configuration Files

### `vercel.json`
- Uses `@vercel/static-build` for React apps
- Configures proper caching headers
- Sets up SPA routing with fallback to `/index.html`

### `.vercelignore`
- Excludes unnecessary files from deployment
- Reduces deployment size and time

### Build Output
- Creates optimized production build in `build/` directory
- Includes static assets with proper cache headers
- Minified and optimized for production

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check `npm run build` locally first
   - Ensure all dependencies are installed
   - Check for TypeScript/ESLint errors

2. **Blank Screen:**
   - Verify environment variables are set
   - Check browser console for errors
   - Ensure Supabase connection is working

3. **Routing Issues:**
   - `vercel.json` handles SPA routing
   - All routes should fallback to `/index.html`

4. **Environment Variables:**
   - Must start with `REACT_APP_` for React
   - Set in Vercel dashboard, not in code
   - Redeploy after adding env vars

## ✅ Success Indicators

- ✅ Build completes without errors
- ✅ All routes work (including refresh)
- ✅ Images and assets load properly
- ✅ Supabase connection established
- ✅ No console errors in browser

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/)
- [Supabase Documentation](https://supabase.com/docs)

---

**Note:** This configuration is optimized for React SPA deployment on Vercel with Supabase backend.
