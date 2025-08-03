import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, supabase } from '../supabase';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Create user account in Supabase Auth
            const { user } = await auth.createUserWithEmailAndPassword(
                formData.email,
                formData.password
            );

            // Show success message with instructions
            alert('Registration successful! Please check your email for a confirmation link before signing in.');

            // Save user profile data to users table
            if (user) {
                const { error: profileError } = await supabase
                    .from('users')
                    .insert([
                        {
                            id: user.id,
                            email: user.email,
                            name: formData.name,
                            role: 'user', // Default role for new users
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }
                    ]);

                if (profileError) {
                    console.error('Profile creation error:', profileError);
                    // Don't fail the registration if profile creation fails
                    // User can still use the app, just might not have full profile
                }
            }

            // Navigate to home page after successful registration
            navigate('/');
        } catch (error) {
            console.error('Registration error:', error);
            setError(getErrorMessage(error.code || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setLoading(true);
        setError('');

        try {
            await auth.signUpWithGoogle();
            // OAuth redirect will handle navigation
        } catch (error) {
            console.error('Google sign up error:', error);

            // Check if it's a provider not enabled error
            if (error.message?.includes('provider is not enabled') || error.error_code === 'validation_failed') {
                setError('Google Sign-Up is not configured yet. Please use email/password or contact support.');
            } else {
                setError('Failed to sign up with Google. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'An account with this email already exists.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters long.';
            default:
                return 'An error occurred during registration. Please try again.';
        }
    };

    const getPasswordStrength = (password) => {
        if (password.length === 0) return { strength: 0, text: '', color: '' };
        if (password.length < 6) return { strength: 1, text: 'Weak', color: 'text-red-500' };
        if (password.length < 10) return { strength: 2, text: 'Medium', color: 'text-yellow-500' };
        return { strength: 3, text: 'Strong', color: 'text-green-500' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-primary flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-secondary-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-secondary-600">
                        Or{' '}
                        <Link
                            to="/login"
                            className="font-medium text-primary-600 hover:text-primary-500"
                        >
                            sign in to your existing account
                        </Link>
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-dark-secondary py-8 px-4 shadow-sm rounded-lg sm:px-10 border border-gray-200 dark:border-border-subtle transition-colors duration-300">
                    {/* Info banner */}
                    <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 flex items-start space-x-2">
                        <AlertCircle size={20} className="text-blue-500 dark:text-blue-400 mt-0.5" />
                        <div className="text-blue-700 dark:text-blue-300 text-sm">
                            <p className="font-medium mb-1">Email Confirmation Required</p>
                            <p>After registration, you'll receive a confirmation email. Please click the link in the email before trying to sign in.</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 flex items-center space-x-2">
                            <AlertCircle size={20} className="text-red-500 dark:text-red-400" />
                            <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-secondary-700">
                                Full Name
                            </label>
                            <div className="mt-1 relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={20} />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="pl-10 appearance-none block w-full px-3 py-2 border border-secondary-300 rounded-md placeholder-secondary-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-secondary-700">
                                Email address
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
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-secondary-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={20} />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="pl-10 pr-10 appearance-none block w-full px-3 py-2 border border-secondary-300 rounded-md placeholder-secondary-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {formData.password && (
                                <div className="mt-1 flex items-center space-x-2">
                                    <div className="flex-1 bg-secondary-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.strength === 1 ? 'bg-red-500 w-1/3' :
                                                passwordStrength.strength === 2 ? 'bg-yellow-500 w-2/3' :
                                                    passwordStrength.strength === 3 ? 'bg-green-500 w-full' : 'w-0'
                                                }`}
                                        />
                                    </div>
                                    <span className={`text-xs ${passwordStrength.color}`}>
                                        {passwordStrength.text}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700">
                                Confirm Password
                            </label>
                            <div className="mt-1 relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={20} />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="pl-10 pr-10 appearance-none block w-full px-3 py-2 border border-secondary-300 rounded-md placeholder-secondary-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                <div className="mt-1 flex items-center space-x-1 text-green-600">
                                    <CheckCircle size={16} />
                                    <span className="text-xs">Passwords match</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-secondary-900">
                                I agree to the{' '}
                                <button
                                    type="button"
                                    className="text-primary-600 hover:text-primary-500 bg-transparent border-none cursor-pointer"
                                    onClick={() => alert('Terms of Service coming soon!')}
                                >
                                    Terms of Service
                                </button>{' '}
                                and{' '}
                                <button
                                    type="button"
                                    className="text-primary-600 hover:text-primary-500 bg-transparent border-none cursor-pointer"
                                    onClick={() => alert('Privacy Policy coming soon!')}
                                >
                                    Privacy Policy
                                </button>
                            </label>
                        </div>                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    'Create Account'
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
                                    onClick={handleGoogleSignUp}
                                    disabled={loading}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-secondary-300 rounded-md shadow-sm bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    <span className="ml-2">Sign up with Google</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
