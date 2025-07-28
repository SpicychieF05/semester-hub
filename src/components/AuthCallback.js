import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Handle the OAuth callback
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('OAuth callback error:', error);
                    navigate('/login?error=oauth_failed');
                    return;
                }

                if (data?.session) {
                    console.log('OAuth successful, user:', data.session.user);
                    // Redirect to dashboard or home page
                    navigate('/');
                } else {
                    console.log('No session found, redirecting to login');
                    navigate('/login');
                }
            } catch (error) {
                console.error('Auth callback error:', error);
                navigate('/login?error=oauth_failed');
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Completing authentication...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
