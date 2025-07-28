-- Setup database tables for Semester Hub
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on departments" ON departments;
DROP POLICY IF EXISTS "Allow all operations on subjects" ON subjects;
DROP POLICY IF EXISTS "Allow all operations on semesters" ON semesters;

-- Create policies for departments (allow all operations for now)
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
