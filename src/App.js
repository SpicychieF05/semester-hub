import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

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

// Import Supabase
import { auth, supabase } from './supabase';

function App() {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLoadingScreen, setShowLoadingScreen] = useState(true);    // Auth state management
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setUser(user);

            if (user) {
                try {
                    await auth.createOrUpdateProfile(user);
                    const { data: profile, error } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (!error) {
                        setUserProfile(profile);
                    }
                } catch (error) {
                    console.error('Error with user profile:', error);
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

    // Show loading spinner
    if (loading) {
        return <LoadingSpinner />;
    }

    return (
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
    );
}

export default App;
