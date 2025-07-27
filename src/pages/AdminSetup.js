import React, { useState } from 'react';
import { auth, supabase } from '../supabase';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

const AdminSetup = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const createAdminUser = async () => {
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const adminEmail = 'codiverse.dev@gmail.com';
            const adminPassword = '#Codiverse2965';

            // Create admin user in Supabase Auth
            const { user, error: authError } = await auth.createUserWithEmailAndPassword(
                adminEmail,
                adminPassword
            );

            if (authError) {
                throw authError;
            }

            // Save admin profile to users table
            if (user) {
                const { error: profileError } = await supabase
                    .from('users')
                    .insert([
                        {
                            id: user.id,
                            email: user.email,
                            name: 'Admin User',
                            role: 'admin',
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }
                    ]);

                if (profileError) {
                    console.error('Profile creation error:', profileError);
                }
            }

            setSuccess(true);
            console.log('Admin user created successfully:', adminEmail);
        } catch (error) {
            console.error('Error creating admin user:', error);
            if (error.message?.includes('already registered')) {
                setError('Admin user already exists');
            } else {
                setError('Failed to create admin user: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <Shield size={48} className="mx-auto text-primary-600 mb-4" />
                    <h2 className="text-3xl font-bold text-secondary-900">
                        Admin Setup
                    </h2>
                    <p className="mt-2 text-sm text-secondary-600">
                        Create the default admin account for Semester Hub
                    </p>
                </div>

                <div className="bg-white shadow-sm rounded-lg p-6">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                            <AlertCircle size={20} className="text-red-500" />
                            <span className="text-red-700 text-sm">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                            <CheckCircle size={20} className="text-green-500" />
                            <span className="text-green-700 text-sm">Admin user created successfully!</span>
                        </div>
                    )}

                    <button
                        onClick={createAdminUser}
                        disabled={loading || success}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : success ? (
                            'Admin User Created'
                        ) : (
                            'Create Admin User'
                        )}
                    </button>

                    <p className="mt-4 text-xs text-secondary-500 text-center">
                        This will create the admin account in Firebase Authentication.
                        Run this only once during initial setup.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminSetup;
