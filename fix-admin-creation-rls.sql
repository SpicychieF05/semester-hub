-- Fix RLS policies to allow admins to create new users
-- This script resolves the "new row violates row-level security policy" error

-- First, let's see current policies
-- DROP existing restrictive policy if it exists
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create a new policy that allows both users to insert their own profile AND admins to create new users
CREATE POLICY "Users can insert profiles" ON users
    FOR INSERT WITH CHECK (
        -- Allow users to insert their own profile
        auth.uid() = id 
        OR 
        -- Allow admins to create new users/admins
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Also add a policy for admins to update any user (for role changes, banning, etc.)
CREATE POLICY "Admins can update all profiles" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Grant necessary permissions
GRANT ALL ON users TO authenticated;
GRANT USAGE ON SCHEMA auth TO authenticated;

-- Create a function to help admins create new users
CREATE OR REPLACE FUNCTION create_admin_user(
    p_email TEXT,
    p_name TEXT,
    p_password TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_user_id UUID;
    admin_id UUID;
BEGIN
    -- Check if the caller is an admin
    admin_id := auth.uid();
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = admin_id AND role = 'admin') THEN
        RAISE EXCEPTION 'Only admins can create new admin users';
    END IF;

    -- Generate a new UUID for the user
    new_user_id := gen_random_uuid();
    
    -- Insert the new user profile
    INSERT INTO users (
        id, 
        email, 
        name, 
        role, 
        status, 
        banned, 
        created_at,
        auth_provider
    ) VALUES (
        new_user_id,
        p_email,
        p_name,
        'admin',
        'active',
        false,
        NOW(),
        'manual'
    );
    
    -- Log the admin action
    PERFORM log_admin_action(
        admin_id,
        'create_admin',
        'user',
        new_user_id,
        p_name,
        jsonb_build_object('email', p_email, 'role', 'admin'),
        'Admin user created via dashboard'
    );
    
    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION create_admin_user TO authenticated;

-- Show current policies for verification
SELECT schemaname, tablename, policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'users' 
ORDER BY policyname;
