import React, { useState, useEffect } from 'react';
import AdminDashboard from '../pages/AdminDashboard';
import AdminLogin from '../pages/AdminLogin';

const ProtectedAdminRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const adminAuth = localStorage.getItem('demoAdminAuth') === 'true';
            setIsAuthenticated(adminAuth);
            setIsLoading(false);
        };

        checkAuth();

        // Listen for storage changes
        const handleStorageChange = () => {
            checkAuth();
        };

        window.addEventListener('storage', handleStorageChange);

        // Also listen for a custom event that we can trigger after login
        const handleAuthChange = () => {
            checkAuth();
        };

        window.addEventListener('adminAuthChanged', handleAuthChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('adminAuthChanged', handleAuthChange);
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
