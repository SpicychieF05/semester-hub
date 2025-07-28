@echo off
echo 🚀 Starting Semester Hub deployment preparation...

:: Clean previous builds
echo 🧹 Cleaning previous builds...
if exist build rmdir /s /q build
if exist node_modules\.cache rmdir /s /q node_modules\.cache

:: Install dependencies
echo 📦 Installing dependencies...
call npm ci

:: Build the project
echo 🔨 Building the project...
call npm run build

:: Check if build was successful
if exist build (
    echo ✅ Build successful! Files generated in build/ directory
    echo 📁 Build contents:
    dir build
    
    echo.
    echo 🌐 Ready for deployment!
    echo 📋 Next steps:
    echo    1. Push your code to GitHub
    echo    2. Connect your GitHub repo to Vercel
    echo    3. Deploy automatically
    echo    4. Set environment variables in Vercel dashboard:
    echo       - REACT_APP_SUPABASE_URL
    echo       - REACT_APP_SUPABASE_ANON_KEY
    echo       - REACT_APP_SITE_URL
) else (
    echo ❌ Build failed! Check the error messages above.
    exit /b 1
)
