# Database Setup Instructions

## Issue
The "Error adding subject: Unknown error occurred" happens because the required database tables (departments, subjects, semesters) might not exist in your Supabase database.

## Solution
Follow these steps to set up the database:

### Step 1: Run SQL Script in Supabase

**Option A: Safe Version (Recommended)**
1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `setup-database-safe.sql` 
4. Click "Run" to execute the script (no warnings should appear)

**Option B: Original Version**
1. If you see a "destructive operation" warning when using the original `setup-database.sql`
2. You can safely click "Run this query" - the warning appears because of policy management
3. The script uses `IF NOT EXISTS` and `ON CONFLICT DO NOTHING` to prevent data loss

### Step 2: Verify Tables
After running the script, you should see:
- departments table with 6 default departments
- subjects table (empty initially)
- semesters table with 8 default semesters

### Step 3: Test Subject Creation
1. Go to Admin Dashboard
2. Navigate to Content Management > Subjects
3. Try adding a new subject
4. Check browser console (F12) for detailed error logs

## Enhanced Error Handling
The AdminDashboard now includes:
- Detailed console logging for debugging
- Automatic table initialization on app load
- Better error messages with specific Supabase error details
- Retry mechanisms for database operations

## Troubleshooting
If you still get errors:
1. Check browser console (F12) for detailed error messages
2. Verify Supabase connection in the browser network tab
3. Check Row Level Security policies in Supabase dashboard
4. Ensure your Supabase API key has proper permissions

## Quick Fix
If the automated setup doesn't work, manually run this in Supabase SQL Editor:
```sql
-- Just create the basic tables
CREATE TABLE departments (id SERIAL PRIMARY KEY, name TEXT, code TEXT UNIQUE, description TEXT);
CREATE TABLE subjects (id SERIAL PRIMARY KEY, name TEXT, code TEXT, description TEXT, department_id INTEGER REFERENCES departments(id));
CREATE TABLE semesters (id SERIAL PRIMARY KEY, number INTEGER UNIQUE, name TEXT, is_active BOOLEAN DEFAULT true);

-- Insert one test department
INSERT INTO departments (name, code, description) VALUES ('Computer Science', 'CS', 'Test Department');
```
