-- Comprehensive RLS Policies for Semester Hub Admin System
-- This script fixes all admin-related RLS issues and creates necessary tables/functions

-- ==========================================
-- 1. CREATE NECESSARY TABLES
-- ==========================================

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'banned', 'suspended')),
    permissions JSONB DEFAULT '[]'::jsonb,
    auth_provider TEXT DEFAULT 'email',
    avatar_url TEXT,
    banned BOOLEAN DEFAULT false,
    ban_reason TEXT,
    banned_at TIMESTAMPTZ,
    banned_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notes table if not exists
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    semester TEXT NOT NULL,
    uploader_id UUID REFERENCES users(id) ON DELETE CASCADE,
    uploader_name TEXT NOT NULL,
    file_url TEXT,
    file_name TEXT,
    file_size BIGINT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    download_count INTEGER DEFAULT 0,
    tags TEXT[],
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_actions table for audit logging
CREATE TABLE IF NOT EXISTS admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID,
    target_name TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create semesters table for structured data
CREATE TABLE IF NOT EXISTS semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subjects table for structured data
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    semester_id UUID REFERENCES semesters(id),
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create courses table for structured data
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. ENABLE RLS ON ALL TABLES
-- ==========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. DROP EXISTING POLICIES
-- ==========================================

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can insert profiles" ON users;
DROP POLICY IF EXISTS "Admins can update all profiles" ON users;
DROP POLICY IF EXISTS "Users can view all profiles" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- ==========================================
-- 4. CREATE COMPREHENSIVE RLS POLICIES
-- ==========================================

-- USERS TABLE POLICIES
-- Allow public read access to user profiles (for displaying authors, etc.)
CREATE POLICY "Anyone can view user profiles" ON users
    FOR SELECT USING (true);

-- Allow users to insert their own profile after registration
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (
        auth.uid() = id
        OR
        -- Allow admins to create new users
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Allow users to update their own profile, admins can update any profile
CREATE POLICY "Users can update profiles" ON users
    FOR UPDATE USING (
        auth.uid() = id
        OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Only super admins can delete users
CREATE POLICY "Super admins can delete users" ON users
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- NOTES TABLE POLICIES
-- Anyone can view approved notes
CREATE POLICY "Anyone can view approved notes" ON notes
    FOR SELECT USING (status = 'approved' OR uploader_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Authenticated users can insert notes
CREATE POLICY "Authenticated users can insert notes" ON notes
    FOR INSERT WITH CHECK (auth.uid() = uploader_id);

-- Users can update their own notes, admins can update any notes
CREATE POLICY "Users can update notes" ON notes
    FOR UPDATE USING (
        uploader_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Admins can delete any notes, users can delete their own
CREATE POLICY "Users and admins can delete notes" ON notes
    FOR DELETE USING (
        uploader_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- ADMIN_ACTIONS TABLE POLICIES
-- Only admins can view admin actions
CREATE POLICY "Admins can view admin actions" ON admin_actions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Only admins can insert admin actions
CREATE POLICY "Admins can insert admin actions" ON admin_actions
    FOR INSERT WITH CHECK (
        admin_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- SEMESTERS TABLE POLICIES
-- Anyone can view active semesters
CREATE POLICY "Anyone can view semesters" ON semesters
    FOR SELECT USING (is_active = true OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Only admins can manage semesters
CREATE POLICY "Admins can manage semesters" ON semesters
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- SUBJECTS TABLE POLICIES
-- Anyone can view active subjects
CREATE POLICY "Anyone can view subjects" ON subjects
    FOR SELECT USING (is_active = true OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Only admins can manage subjects
CREATE POLICY "Admins can manage subjects" ON subjects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- COURSES TABLE POLICIES
-- Anyone can view active courses
CREATE POLICY "Anyone can view courses" ON courses
    FOR SELECT USING (is_active = true OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Only admins can manage courses
CREATE POLICY "Admins can manage courses" ON courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- ==========================================
-- 5. CREATE UTILITY FUNCTIONS
-- ==========================================

-- Function to safely create admin users
CREATE OR REPLACE FUNCTION create_admin_user(
    p_user_id UUID,
    p_email TEXT,
    p_name TEXT,
    p_role TEXT DEFAULT 'admin'
)
RETURNS UUID AS $$
DECLARE
    admin_id UUID;
    new_user_id UUID;
BEGIN
    -- Check if the caller is an admin
    admin_id := auth.uid();
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = admin_id AND role IN ('admin', 'super_admin')) THEN
        RAISE EXCEPTION 'Only admins can create new admin users';
    END IF;

    -- Use provided user_id or generate new one
    new_user_id := COALESCE(p_user_id, gen_random_uuid());
    
    -- Insert the new user profile with admin role
    INSERT INTO users (
        id, 
        email, 
        name, 
        role, 
        status, 
        banned, 
        created_at,
        updated_at,
        auth_provider,
        permissions
    ) VALUES (
        new_user_id,
        p_email,
        p_name,
        p_role,
        'active',
        false,
        NOW(),
        NOW(),
        'email',
        '["manage_notes", "manage_users"]'::jsonb
    );
    
    -- Log the admin action
    PERFORM log_admin_action(
        admin_id,
        'create_admin',
        'user',
        new_user_id,
        p_name,
        jsonb_build_object('email', p_email, 'role', p_role),
        'Admin user created via dashboard'
    );
    
    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
    p_admin_id UUID,
    p_action_type TEXT,
    p_target_type TEXT,
    p_target_id UUID,
    p_target_name TEXT,
    p_details JSONB DEFAULT '{}'::jsonb,
    p_reason TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    action_id UUID;
BEGIN
    -- Insert admin action log
    INSERT INTO admin_actions (
        admin_id,
        action_type,
        target_type,
        target_id,
        target_name,
        details,
        reason,
        created_at
    ) VALUES (
        p_admin_id,
        p_action_type,
        p_target_type,
        p_target_id,
        p_target_name,
        p_details,
        p_reason,
        NOW()
    ) RETURNING id INTO action_id;
    
    RETURN action_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to promote user to admin
CREATE OR REPLACE FUNCTION promote_user_to_admin(
    p_user_id UUID,
    p_permissions JSONB DEFAULT '["manage_notes", "manage_users"]'::jsonb
)
RETURNS BOOLEAN AS $$
DECLARE
    admin_id UUID;
    user_data RECORD;
BEGIN
    -- Check if the caller is an admin
    admin_id := auth.uid();
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = admin_id AND role IN ('admin', 'super_admin')) THEN
        RAISE EXCEPTION 'Only admins can promote users';
    END IF;

    -- Get user data for logging
    SELECT name, email INTO user_data FROM users WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Update user role to admin
    UPDATE users 
    SET 
        role = 'admin',
        permissions = p_permissions,
        updated_at = NOW()
    WHERE id = p_user_id;
    
    -- Log the admin action
    PERFORM log_admin_action(
        admin_id,
        'promote_to_admin',
        'user',
        p_user_id,
        user_data.name,
        jsonb_build_object('email', user_data.email, 'new_role', 'admin', 'permissions', p_permissions),
        'User promoted to admin via dashboard'
    );
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to ban user
CREATE OR REPLACE FUNCTION ban_user(
    p_user_id UUID,
    p_reason TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    admin_id UUID;
    user_data RECORD;
BEGIN
    -- Check if the caller is an admin
    admin_id := auth.uid();
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = admin_id AND role IN ('admin', 'super_admin')) THEN
        RAISE EXCEPTION 'Only admins can ban users';
    END IF;

    -- Get user data for logging
    SELECT name, email, role INTO user_data FROM users WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Cannot ban super admin
    IF user_data.role = 'super_admin' THEN
        RAISE EXCEPTION 'Cannot ban super admin';
    END IF;
    
    -- Update user status to banned
    UPDATE users 
    SET 
        status = 'banned',
        banned = true,
        ban_reason = p_reason,
        banned_at = NOW(),
        banned_by = admin_id,
        updated_at = NOW()
    WHERE id = p_user_id;
    
    -- Log the admin action
    PERFORM log_admin_action(
        admin_id,
        'ban_user',
        'user',
        p_user_id,
        user_data.name,
        jsonb_build_object('email', user_data.email, 'previous_role', user_data.role, 'ban_reason', p_reason),
        p_reason
    );
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to unban user
CREATE OR REPLACE FUNCTION unban_user(
    p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    admin_id UUID;
    user_data RECORD;
BEGIN
    -- Check if the caller is an admin
    admin_id := auth.uid();
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = admin_id AND role IN ('admin', 'super_admin')) THEN
        RAISE EXCEPTION 'Only admins can unban users';
    END IF;

    -- Get user data for logging
    SELECT name, email, ban_reason INTO user_data FROM users WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Update user status to active
    UPDATE users 
    SET 
        status = 'active',
        banned = false,
        ban_reason = NULL,
        banned_at = NULL,
        banned_by = NULL,
        updated_at = NOW()
    WHERE id = p_user_id;
    
    -- Log the admin action
    PERFORM log_admin_action(
        admin_id,
        'unban_user',
        'user',
        p_user_id,
        user_data.name,
        jsonb_build_object('email', user_data.email, 'previous_ban_reason', user_data.ban_reason),
        'User unbanned via dashboard'
    );
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 6. GRANT PERMISSIONS
-- ==========================================

-- Grant necessary permissions to authenticated users
GRANT ALL ON users TO authenticated;
GRANT ALL ON notes TO authenticated;
GRANT ALL ON admin_actions TO authenticated;
GRANT ALL ON semesters TO authenticated;
GRANT ALL ON subjects TO authenticated;
GRANT ALL ON courses TO authenticated;

-- Grant usage on schema
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION create_admin_user TO authenticated;
GRANT EXECUTE ON FUNCTION log_admin_action TO authenticated;
GRANT EXECUTE ON FUNCTION promote_user_to_admin TO authenticated;
GRANT EXECUTE ON FUNCTION ban_user TO authenticated;
GRANT EXECUTE ON FUNCTION unban_user TO authenticated;

-- ==========================================
-- 7. CREATE INITIAL DATA
-- ==========================================

-- Insert default semesters
INSERT INTO semesters (name, code, description, is_active) VALUES
    ('Semester 1', 'SEM1', 'First semester of academic year', true),
    ('Semester 2', 'SEM2', 'Second semester of academic year', true),
    ('Semester 3', 'SEM3', 'Third semester of academic year', true),
    ('Semester 4', 'SEM4', 'Fourth semester of academic year', true),
    ('Semester 5', 'SEM5', 'Fifth semester of academic year', true),
    ('Semester 6', 'SEM6', 'Sixth semester of academic year', true),
    ('Semester 7', 'SEM7', 'Seventh semester of academic year', true),
    ('Semester 8', 'SEM8', 'Eighth semester of academic year', true)
ON CONFLICT (name) DO NOTHING;

-- Insert default subjects
INSERT INTO subjects (name, code, description, is_active) VALUES
    ('Computer Science', 'CS', 'Computer Science and Programming', true),
    ('Mathematics', 'MATH', 'Mathematics and Applied Mathematics', true),
    ('Physics', 'PHY', 'Physics and Applied Physics', true),
    ('Chemistry', 'CHEM', 'Chemistry and Applied Chemistry', true),
    ('Biology', 'BIO', 'Biology and Life Sciences', true),
    ('English', 'ENG', 'English Language and Literature', true),
    ('History', 'HIST', 'History and Social Studies', true),
    ('Economics', 'ECON', 'Economics and Business Studies', true),
    ('Psychology', 'PSY', 'Psychology and Behavioral Sciences', true),
    ('Engineering', 'ENGG', 'Engineering and Technology', true)
ON CONFLICT (name) DO NOTHING;

-- Insert default demo admin user
-- Note: This user's auth will be handled by AdminLogin.js demo mode
INSERT INTO users (
    id,
    email,
    name,
    role,
    status,
    banned,
    created_at,
    updated_at,
    auth_provider,
    permissions
) VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', -- Fixed UUID for demo admin
    'codiverse.dev@gmail.com',
    'Demo Admin User',
    'admin',
    'active',
    false,
    NOW(),
    NOW(),
    'email',
    '["manage_notes", "manage_users", "manage_content"]'::jsonb
) ON CONFLICT (email) DO UPDATE SET
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions,
    updated_at = NOW();

-- ==========================================
-- 8. CREATE INDEXES FOR PERFORMANCE
-- ==========================================

-- Indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Indexes for notes table
CREATE INDEX IF NOT EXISTS idx_notes_status ON notes(status);
CREATE INDEX IF NOT EXISTS idx_notes_subject ON notes(subject);
CREATE INDEX IF NOT EXISTS idx_notes_semester ON notes(semester);
CREATE INDEX IF NOT EXISTS idx_notes_uploader_id ON notes(uploader_id);

-- Indexes for admin_actions table
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON admin_actions(created_at);

-- ==========================================
-- 9. VERIFICATION QUERIES
-- ==========================================

-- Show current policies for verification
SELECT schemaname, tablename, policyname, cmd, permissive, roles, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('users', 'notes', 'admin_actions', 'semesters', 'subjects', 'courses')
ORDER BY tablename, policyname;

-- Show function permissions
SELECT routine_name, routine_type, specific_name
FROM information_schema.routines
WHERE routine_schema = 'public' 
AND routine_name IN ('create_admin_user', 'log_admin_action', 'promote_user_to_admin', 'ban_user', 'unban_user');

COMMIT;
