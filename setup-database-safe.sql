-- Safe Database Setup for Semester Hub
-- This version avoids DROP statements that trigger Supabase warnings
-- Run this script in your Supabase SQL Editor

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    description TEXT,
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create semesters table
CREATE TABLE IF NOT EXISTS semesters (
    id SERIAL PRIMARY KEY,
    number INTEGER NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_actions table for activity logging
CREATE TABLE IF NOT EXISTS admin_actions (
    id SERIAL PRIMARY KEY,
    admin_id UUID,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id INTEGER,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notes table for note sharing
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    description TEXT,
    file_url TEXT,
    file_name VARCHAR(255),
    file_size BIGINT,
    uploader_id UUID,
    uploader_name VARCHAR(255),
    uploader_email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejected_by UUID,
    rejection_reason TEXT,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    status VARCHAR(20) DEFAULT 'active',
    ban_reason TEXT,
    banned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default departments if they don't exist
INSERT INTO departments (name, code, description) VALUES
    ('Computer Science & Engineering', 'CSE', 'Computer Science and Engineering Department'),
    ('Electrical Engineering', 'EE', 'Electrical Engineering Department'),
    ('Civil Engineering', 'CE', 'Civil Engineering Department'),
    ('Mechanical Engineering', 'ME', 'Mechanical Engineering Department'),
    ('School of Agriculture', 'AGR', 'Agriculture Department'),
    ('School of Computer Applications', 'SCA', 'Computer Applications Department')
ON CONFLICT (code) DO NOTHING;

-- Insert default semesters if they don't exist
INSERT INTO semesters (number, name, is_active) VALUES
    (1, 'Semester 1', true),
    (2, 'Semester 2', true),
    (3, 'Semester 3', true),
    (4, 'Semester 4', true),
    (5, 'Semester 5', true),
    (6, 'Semester 6', true),
    (7, 'Semester 7', true),
    (8, 'Semester 8', true)
ON CONFLICT (number) DO NOTHING;

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;

-- Create policies for departments (allow all operations for now)
-- Note: If policies already exist, this will show an error but won't break anything
CREATE POLICY "Allow all operations on departments" ON departments FOR ALL USING (true);

-- Create policies for subjects (allow all operations for now)
CREATE POLICY "Allow all operations on subjects" ON subjects FOR ALL USING (true);

-- Create policies for semesters (allow all operations for now)
CREATE POLICY "Allow all operations on semesters" ON semesters FOR ALL USING (true);

-- Verify tables were created
SELECT 'Departments table created' as status, count(*) as records FROM departments
UNION ALL
SELECT 'Subjects table created' as status, count(*) as records FROM subjects
UNION ALL
SELECT 'Semesters table created' as status, count(*) as records FROM semesters;
