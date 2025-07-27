-- Database setup for Semester Hub
-- Run this script in your Supabase SQL Editor

-- Create users table to store user profile information
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notes table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    semester VARCHAR(100) NOT NULL,
    description TEXT,
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    uploader_id UUID REFERENCES users(id) ON DELETE SET NULL,
    uploader_name VARCHAR(255),
    uploader_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile during registration
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can read all user profiles
CREATE POLICY "Admins can read all profiles" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Notes table policies
-- Anyone can read approved notes
CREATE POLICY "Anyone can read approved notes" ON notes
    FOR SELECT USING (status = 'approved');

-- Authenticated users can insert notes
CREATE POLICY "Authenticated users can insert notes" ON notes
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can read their own notes
CREATE POLICY "Users can read own notes" ON notes
    FOR SELECT USING (uploader_id = auth.uid());

-- Users can update their own notes (only if pending)
CREATE POLICY "Users can update own pending notes" ON notes
    FOR UPDATE USING (uploader_id = auth.uid() AND status = 'pending');

-- Admins can read all notes
CREATE POLICY "Admins can read all notes" ON notes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can update all notes
CREATE POLICY "Admins can update all notes" ON notes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can delete notes
CREATE POLICY "Admins can delete notes" ON notes
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_notes_status ON notes(status);
CREATE INDEX IF NOT EXISTS idx_notes_uploader ON notes(uploader_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Insert a default admin user (you should change these credentials)
-- This will only work if you run this after creating an admin account through the auth system
-- Replace 'admin@semesterhub.com' with your actual admin email
INSERT INTO users (id, email, name, role) 
SELECT id, email, 'Admin User', 'admin'
FROM auth.users 
WHERE email = 'admin@semesterhub.com'
ON CONFLICT (id) DO UPDATE SET 
    role = 'admin',
    updated_at = NOW();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON users TO authenticated;
GRANT ALL ON notes TO authenticated;
GRANT SELECT ON users TO anon;
GRANT SELECT ON notes TO anon;
