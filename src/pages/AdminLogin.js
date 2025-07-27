import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react';
import { supabase } from '../supabase';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Handle Google OAuth callback and verify admin status
    useEffect(() => {
        const handleAuthCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const provider = urlParams.get('provider');

            if (provider === 'google') {
                try {
                    setLoading(true);

                    // Get the current user after OAuth redirect
                    const { data: { user }, error: userError } = await supabase.auth.getUser();

                    if (userError || !user) {
                        setError('Authentication failed. Please try again.');
                        return;
                    }

                    // Check if user exists in database and is an admin
                    const { data: userProfile, error: profileError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (profileError) {
                        console.error('Error fetching user profile:', profileError);
                        setError('User profile not found. Please contact administrator.');
                        return;
                    }

                    // Verify admin role
                    if (userProfile.role !== 'admin') {
                        setError('Access denied. This account does not have admin privileges.');
                        // Sign out the non-admin user
                        await supabase.auth.signOut();
                        return;
                    }

                    // Success - user is an admin
                    localStorage.setItem('demoAdminAuth', 'true');
                    localStorage.setItem('demoAdminEmail', user.email);
                    localStorage.setItem('demoAuthProvider', 'google');

                    // Trigger custom event to notify components about auth change
                    window.dispatchEvent(new Event('adminAuthChanged'));

                    // Navigate to admin dashboard
                    navigate('/admin');

                } catch (error) {
                    console.error('Auth callback error:', error);
                    setError('Authentication failed. Please try again.');
                } finally {
                    setLoading(false);
                }
            }
        };

        handleAuthCallback();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');

        try {
            // Check if Google OAuth is configured
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/admin-login?provider=google`
                }
            });

            if (error) {
                console.error('Google OAuth error:', error);
                if (error.message.includes('provider') || error.message.includes('not enabled')) {
                    setError('Google authentication is not configured. Please contact the administrator or use email/password login.');
                } else {
                    setError('Google sign-in failed. Please try again or use email/password login.');
                }
            }
            // Note: The actual authentication and admin verification happens after redirect
        } catch (error) {
            console.error('Google sign-in error:', error);
            setError('Google sign-in failed. Please try again or use email/password login.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // First try real Supabase authentication
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (authError) {
                // If Supabase auth fails, fall back to demo mode for specific admin credentials
                const demoAdminEmail = 'codiverse.dev@gmail.com';
                const demoAdminPassword = '#Codiverse2965';

                if (formData.email === demoAdminEmail && formData.password === demoAdminPassword) {
                    console.log('Demo admin authentication successful');
                    // Store demo auth state in localStorage
                    localStorage.setItem('demoAdminAuth', 'true');
                    localStorage.setItem('demoAdminEmail', formData.email);
                    localStorage.setItem('demoAuthProvider', 'email');

                    // Trigger custom event to notify components about auth change
                    window.dispatchEvent(new Event('adminAuthChanged'));

                    // Navigate to admin page
                    setTimeout(() => {
                        navigate('/admin');
                    }, 100);
                    return;
                } else {
                    setError('Invalid email or password. Please check your credentials.');
                    return;
                }
            }

            // Real authentication successful - now verify admin role
            const user = authData.user;

            // Check if user exists in database and is an admin
            const { data: userProfile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) {
                console.error('Error fetching user profile:', profileError);
                setError('User profile not found. Please contact administrator.');
                // Sign out the user since they can't access admin
                await supabase.auth.signOut();
                return;
            }

            // Verify admin role
            if (userProfile.role !== 'admin') {
                setError('Access denied. This account does not have admin privileges.');
                // Sign out the non-admin user
                await supabase.auth.signOut();
                return;
            }

            // Success - user is authenticated and is an admin
            localStorage.setItem('demoAdminAuth', 'true');
            localStorage.setItem('demoAdminEmail', user.email);
            localStorage.setItem('demoAuthProvider', 'email');

            // Trigger custom event to notify components about auth change
            window.dispatchEvent(new Event('adminAuthChanged'));

            // Navigate to admin dashboard
            navigate('/admin');

        } catch (error) {
            console.error('Admin login error:', error);
            setError('Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
                        <Shield size={32} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-secondary-900">
                        Admin Access
                    </h2>
                    <p className="mt-2 text-sm text-secondary-600">
                        Sign in with admin credentials to access the dashboard
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10 border border-primary-200">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                            <AlertCircle size={20} className="text-red-500" />
                            <span className="text-red-700 text-sm">{error}</span>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-secondary-700">
                                Admin Email
                            </label>
                            <div className="mt-1 relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={20} />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="pl-10 appearance-none block w-full px-3 py-2 border border-secondary-300 rounded-md placeholder-secondary-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Enter admin email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-secondary-700">
                                Admin Password
                            </label>
                            <div className="mt-1 relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={20} />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="pl-10 pr-10 appearance-none block w-full px-3 py-2 border border-secondary-300 rounded-md placeholder-secondary-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Enter admin password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    'Access Admin Dashboard'
                                )}
                            </button>
                        </div>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-secondary-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-secondary-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-secondary-300 rounded-md shadow-sm bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-secondary-400"></div>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            Sign in with Google
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link
                                to="/"
                                className="text-sm text-secondary-600 hover:text-primary-600"
                            >
                                ← Back to Home
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
