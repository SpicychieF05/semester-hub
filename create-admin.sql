-- Admin User Creation Script
-- Run this AFTER creating a regular user account through the registration form

-- Replace 'your-admin-email@example.com' with the actual email of the user you want to make admin
UPDATE users 
SET role = 'admin',
    updated_at = NOW()
WHERE email = 'your-admin-email@example.com';

-- Verify the admin user was updated
SELECT id, email, name, role, created_at, updated_at 
FROM users 
WHERE role = 'admin';

-- Optional: Create a dedicated admin user (only if you want a separate admin account)
-- Note: You'll need to register this email through the app first, then run this script

-- Example for creating multiple admin accounts:
/*
UPDATE users 
SET role = 'admin',
    updated_at = NOW()
WHERE email IN (
    'admin1@semesterhub.com',
    'admin2@semesterhub.com',
    'superadmin@semesterhub.com'
);
*/
