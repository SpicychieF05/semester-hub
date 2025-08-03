#!/bin/bash
# Vercel Deployment Script
# This script ensures a clean deployment to Vercel

echo "🚀 Starting Vercel deployment process..."

# Clear any potential caches
echo "🧹 Cleaning build cache..."
rm -rf build/
rm -rf node_modules/.cache/
rm -rf .next/

# Install dependencies fresh
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ -d "build" ]; then
    echo "✅ Build successful!"
    echo "📁 Build contents:"
    ls -la build/
    
    echo "🚀 Ready for Vercel deployment!"
    echo "Run: vercel --prod"
else
    echo "❌ Build failed!"
    exit 1
fi
