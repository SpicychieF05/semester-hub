#!/bin/bash

echo "🚀 Starting Semester Hub deployment preparation..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf build/
rm -rf node_modules/.cache/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ -d "build" ]; then
    echo "✅ Build successful! Files generated in build/ directory"
    echo "📁 Build contents:"
    ls -la build/
    
    echo ""
    echo "🌐 Ready for deployment!"
    echo "📋 Next steps:"
    echo "   1. Push your code to GitHub"
    echo "   2. Connect your GitHub repo to Vercel"
    echo "   3. Deploy automatically"
    echo "   4. Set environment variables in Vercel dashboard:"
    echo "      - REACT_APP_SUPABASE_URL"
    echo "      - REACT_APP_SUPABASE_ANON_KEY"
    echo "      - REACT_APP_SITE_URL"
else
    echo "❌ Build failed! Check the error messages above."
    exit 1
fi
