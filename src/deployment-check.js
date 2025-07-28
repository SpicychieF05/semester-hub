// Deployment verification script
console.log('=== Semester Hub Deployment Verification ===');
console.log('Timestamp:', new Date().toISOString());
console.log('Environment:', process.env.NODE_ENV);
console.log('App Version: 2.0.0');

// Check environment variables
const envVars = {
    'REACT_APP_SUPABASE_URL': process.env.REACT_APP_SUPABASE_URL,
    'REACT_APP_SUPABASE_ANON_KEY': process.env.REACT_APP_SUPABASE_ANON_KEY,
    'REACT_APP_SITE_URL': process.env.REACT_APP_SITE_URL
};

console.log('Environment Variables Status:');
Object.entries(envVars).forEach(([key, value]) => {
    console.log(`${key}: ${value ? '✅ Set' : '❌ Missing'}`);
    if (key === 'REACT_APP_SUPABASE_URL' && value) {
        console.log(`  URL: ${value.substring(0, 30)}...`);
    }
});

console.log('=== Verification Complete ===');
