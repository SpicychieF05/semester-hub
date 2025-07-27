import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import HomePage from './pages/HomePage';
import BrowseNotes from './pages/BrowseNotes';
import ShareNotes from './pages/ShareNotes';
import AdminLogin from './pages/AdminLogin';
import AdminSetup from './pages/AdminSetup';
import Login from './pages/Login';
import Register from './pages/Register';
import NoteDetail from './pages/NoteDetail';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
    const [user, loading] = useAuthState(auth);
    const [showLoadingScreen, setShowLoadingScreen] = useState(true);

    // Clear admin auth on app initialization to ensure logout by default
    useEffect(() => {
        // Clear admin authentication on every page load/refresh
        localStorage.removeItem('demoAdminAuth');
        localStorage.removeItem('demoAdminEmail');
        localStorage.removeItem('demoAuthProvider');

        // Trigger auth change event to notify components
        window.dispatchEvent(new Event('adminAuthChanged'));
    }, []);

    // Check for mock admin user
    const mockAdminUser = localStorage.getItem('mockAdminUser');
    const currentUser = user || (mockAdminUser ? JSON.parse(mockAdminUser) : null);

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
            </div>
        </Router>
    );
}

export default App;
