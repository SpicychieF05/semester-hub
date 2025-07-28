// Environment Variables Debug Info
console.log('=== Environment Variables Debug ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL ? '✓ Set' : '✗ Missing');
console.log('REACT_APP_SUPABASE_ANON_KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing');
console.log('REACT_APP_SITE_URL:', process.env.REACT_APP_SITE_URL || 'Not set (using fallback)');
console.log('================================');

export const debugEnv = () => {
    return {
        hasSupabaseUrl: !!process.env.REACT_APP_SUPABASE_URL,
        hasSupabaseKey: !!process.env.REACT_APP_SUPABASE_ANON_KEY,
        nodeEnv: process.env.NODE_ENV
    };
};
