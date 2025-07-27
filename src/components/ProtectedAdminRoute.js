import React, { useState, useEffect } from 'react';
import { auth, supabase } from '../supabase';
import AdminDashboard from '../pages/AdminDashboard';
import AdminLogin from '../pages/AdminLogin';

const ProtectedAdminRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            console.log('ProtectedAdminRoute: Checking authentication...');
            try {
                // First check demo admin auth for backwards compatibility
                const demoAdminAuth = localStorage.getItem('demoAdminAuth') === 'true';
                console.log('ProtectedAdminRoute: Demo admin auth status:', demoAdminAuth);

                if (demoAdminAuth) {
                    console.log('Demo admin authenticated in ProtectedAdminRoute');
                    setIsAuthenticated(true);
                    setIsLoading(false);
                    return;
                }

                // Check if user is authenticated through Supabase
                const currentUser = await auth.getCurrentUser();

                if (!currentUser) {
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    return;
                }

                // Check if user has admin role in database
                const { data: userProfile, error } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', currentUser.id)
                    .single();

                if (error) {
                    console.error('Error checking admin role:', error);
                    setIsAuthenticated(false);
                } else {
                    setIsAuthenticated(userProfile?.role === 'admin');
                }
            } catch (error) {
                console.error('Auth check error:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();

        // Listen for auth state changes
        const unsubscribe = auth.onAuthStateChanged(() => {
            checkAuth();
        });

        // Listen for storage changes (demo mode compatibility)
        const handleStorageChange = () => {
            checkAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('adminAuthChanged', handleStorageChange);

        return () => {
            if (unsubscribe && typeof unsubscribe.unsubscribe === 'function') {
                unsubscribe.unsubscribe();
            }
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('adminAuthChanged', handleStorageChange);
        };
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
};

export default ProtectedAdminRoute;
