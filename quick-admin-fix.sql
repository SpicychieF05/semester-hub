-- Quick fix to add demo admin user to existing database
-- Run this in Supabase SQL Editor if you haven't run the comprehensive-admin-rls.sql file yet

-- Insert demo admin user
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

-- Verify the admin user was created
SELECT * FROM users WHERE email = 'codiverse.dev@gmail.com';
