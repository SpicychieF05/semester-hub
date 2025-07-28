import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import './debug-env'; // Import debug info

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import ToastContainer from './components/ToastContainer';
import HomePage from './pages/HomePage';
import BrowseNotes from './pages/BrowseNotes';
import ShareNotes from './pages/ShareNotes';
import AdminLogin from './pages/AdminLogin';
import AdminSetup from './pages/AdminSetup';
import Login from './pages/Login';
import Register from './pages/Register';
import NoteDetail from './pages/NoteDetail';
import LoadingSpinner from './components/LoadingSpinner';

// Error boundary component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('App Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center p-8">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
                        <p className="text-gray-600 mb-4">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

let auth, supabase;

try {
    // Import Supabase with error handling
    const supabaseModule = require('./supabase');
    auth = supabaseModule.auth;
    supabase = supabaseModule.supabase;
} catch (error) {
    console.error('Failed to initialize Supabase:', error);
    // Create fallback objects to prevent further errors
    auth = { onAuthStateChanged: () => () => { }, createOrUpdateProfile: () => Promise.resolve() };
    supabase = { from: () => ({ select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }) };
}

function App() {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLoadingScreen, setShowLoadingScreen] = useState(true);

    // Auth state management
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setUser(user);

            if (user) {
                // For OAuth users (like Google), create profile if it doesn't exist
                try {
                    await auth.createOrUpdateProfile(user);
                } catch (error) {
                    console.error('Error creating/updating user profile:', error);
                }

                // Fetch user profile from users table
                try {
                    const { data: profile, error } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (error) {
                        console.error('Error fetching user profile:', error);
                        setUserProfile(null);
                    } else {
                        setUserProfile(profile);
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    setUserProfile(null);
                }
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return () => {
            if (unsubscribe && typeof unsubscribe.unsubscribe === 'function') {
                unsubscribe.unsubscribe();
            }
        };
    }, []);

    // Clear admin auth on app initialization to ensure logout by default
    useEffect(() => {
        // Clear admin authentication on every page load/refresh
        localStorage.removeItem('demoAdminAuth');
        localStorage.removeItem('demoAdminEmail');
        localStorage.removeItem('demoAuthProvider');

        // Trigger auth change event to notify components
        window.dispatchEvent(new Event('adminAuthChanged'));
    }, []);

    // Combine user auth data with profile data
    const currentUser = user && userProfile ? { ...user, ...userProfile } : user;

    const handleLoadingComplete = () => {
        setShowLoadingScreen(false);
    };

    // Show custom loading screen FIRST - this should be the very first thing shown
    if (showLoadingScreen) {
        return <LoadingScreen onComplete={handleLoadingComplete} />;
    }

    // Show Firebase loading spinner only after custom loading screen
    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <ErrorBoundary>
            <AppProvider>
                <Router>
                    <div className="min-h-screen bg-gray-50 flex flex-col">
                        <Navbar user={currentUser} />
                        <main className="flex-grow">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/browse" element={<BrowseNotes />} />
                                <Route path="/share" element={currentUser ? <ShareNotes /> : <Login />} />
                                <Route path="/note/:id" element={<NoteDetail />} />
                                <Route path="/admin-access" element={<AdminLogin />} />
                                <Route path="/admin-login" element={<AdminLogin />} />
                                <Route path="/admin" element={<ProtectedAdminRoute />} />
                                <Route path="/admin-setup" element={<AdminSetup />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                            </Routes>
                        </main>
                        <Footer />
                        <ToastContainer />
                    </div>
                </Router>
            </AppProvider>
        </ErrorBoundary>
    );
}

export default App;
