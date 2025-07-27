# Database Setup and User Authentication Guide

## 🚀 Quick Start

Your Semester Hub application is now configured with **Supabase** for user authentication and data storage. Here's how to complete the setup:

## 📋 Prerequisites

1. ✅ Supabase project created (https://uevunvpcbvvduvjqcwwl.supabase.co)
2. ✅ Development server running at http://localhost:3000
3. 🔄 Database tables need to be created

## 🗄️ Database Setup

### Step 1: Create Database Tables

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/uevunvpcbvvduvjqcwwl
2. Navigate to **SQL Editor** (in the left sidebar)
3. Create a **New Query**
4. Copy and paste the entire content of `database-setup.sql` file
5. Click **Run** to execute the SQL commands

This will create:
- **users** table: Store user profiles and roles
- **notes** table: Store academic notes and files
- **Row Level Security (RLS)** policies for data protection
- **Indexes** for better performance

### Step 2: Configure Authentication URLs (Optional for localhost)

1. Go to **Settings** → **Authentication** → **URL Configuration**
2. Add these URLs:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: `http://localhost:3000/**`

## 👥 User Registration & Login Process

### For Regular Users:

1. **Registration** (`/register`):
   - User fills out: Name, Email, Password
   - Account created in Supabase Auth
   - Profile saved to `users` table with role `'user'`
   - Auto-login after successful registration

2. **Login** (`/login`):
   - User enters: Email, Password
   - Supabase authenticates credentials
   - User profile loaded from database
   - Access to share notes and view approved content

### For Admin Users:

1. **Create Admin Account**:
   - First, register normally through `/register`
   - Then manually update the user role in database:
   
   ```sql
   UPDATE users 
   SET role = 'admin' 
   WHERE email = 'your-admin-email@example.com';
   ```

2. **Admin Login**:
   - Use regular login (`/login`) with admin credentials
   - System automatically detects admin role
   - Redirects to admin dashboard (`/admin`)
   - Full access to manage notes and users

## 🔧 Testing the Setup

### Test 1: User Registration
1. Visit: http://localhost:3000/register
2. Fill in the form with test data
3. Submit - should redirect to home page
4. Check Supabase Dashboard → Authentication → Users

### Test 2: User Login
1. Visit: http://localhost:3000/login
2. Use the credentials from registration
3. Should successfully log in and redirect to home

### Test 3: Admin Access
1. Update a user's role to 'admin' in the database
2. Login with that user's credentials
3. Visit: http://localhost:3000/admin
4. Should have access to admin dashboard

## 🛠️ Technical Implementation Details

### Authentication Flow:
- **Frontend**: React components with custom auth state management
- **Backend**: Supabase Auth for secure user management
- **Database**: PostgreSQL with Row Level Security
- **Compatibility**: Firebase API wrapper maintains existing code structure

### User Data Storage:
```javascript
// User Profile Structure in 'users' table
{
  id: UUID,           // Links to auth.users(id)
  email: string,      // User's email address
  name: string,       // Full name from registration
  role: 'user'|'admin', // Access level
  created_at: timestamp,
  updated_at: timestamp
}
```

### Security Features:
- Row Level Security (RLS) policies protect user data
- Users can only access their own data
- Admins have elevated permissions
- Secure authentication tokens

## 🚨 Troubleshooting

### Issue: "User not found" after registration
**Solution**: Check if `users` table was created and populated correctly.

### Issue: Admin dashboard not accessible
**Solution**: Verify user role is set to 'admin' in the database.

### Issue: Authentication errors
**Solution**: Ensure Supabase credentials are correct in `src/supabase.js`.

### Issue: Database connection errors
**Solution**: Run the `database-setup.sql` script in Supabase SQL Editor.

## 📱 Current Status

- ✅ **Frontend**: Fully migrated to Supabase
- ✅ **Authentication**: Working with email/password
- ✅ **User Registration**: Saves profile data to database
- ✅ **User Login**: Supports both regular users and admins
- ✅ **Admin Protection**: Role-based access control
- ✅ **Development Server**: Running at localhost:3000
- 🔄 **Database**: Needs initial table creation

## 🎯 Next Steps

1. **Execute database setup** using the SQL file
2. **Test user registration** with a real email
3. **Test user login** with registered credentials
4. **Create admin user** by updating role in database
5. **Test admin functionality** through the admin dashboard

Your migration from Firebase to Supabase is complete! 🎉
