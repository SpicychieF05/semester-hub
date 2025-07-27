import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, BookOpen, CheckCircle, XCircle,
    Trash2, Calendar, Download, AlertTriangle, LogOut,
    Ban, Shield, ShieldOff, UserPlus, X, Eye, EyeOff
} from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [pendingNotes, setPendingNotes] = useState([]);
    const [approvedNotes, setApprovedNotes] = useState([]);
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [stats, setStats] = useState({
        totalNotes: 0,
        pendingReview: 0,
        totalUsers: 0,
        totalDownloads: 0
    });
    const [loading, setLoading] = useState(true);
    const [showBanModal, setShowBanModal] = useState(false);
    const [showNewAdminModal, setShowNewAdminModal] = useState(false);
    const [banReason, setBanReason] = useState('');
    const [selectedUserToBan, setSelectedUserToBan] = useState(null);
    const [newAdminData, setNewAdminData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin',
        permissions: ['manage_notes', 'manage_users']
    });

    useEffect(() => {
        // Check if user is authenticated as admin
        const isAdminAuthenticated = localStorage.getItem('demoAdminAuth') === 'true';
        if (!isAdminAuthenticated) {
            navigate('/admin-login');
            return;
        }
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Demo data for portfolio/showcase - simulate pending notes
            const demoePendingNotes = [
                {
                    id: '1',
                    title: 'Advanced Machine Learning',
                    subject: 'Computer Science',
                    semester: 'Semester 6',
                    author: 'Neha Sharma',
                    createdAt: new Date('2024-01-20'),
                    description: 'Comprehensive notes on deep learning and neural networks',
                    fileName: 'advanced-ml.pdf'
                },
                {
                    id: '2',
                    title: 'Quantum Computing Basics',
                    subject: 'Physics',
                    semester: 'Semester 7',
                    author: 'Rahul Singh',
                    createdAt: new Date('2024-01-19'),
                    description: 'Introduction to quantum computing principles and algorithms',
                    fileName: 'quantum-computing.pdf'
                }
            ];

            setPendingNotes(demoePendingNotes);

            // Demo approved notes (same as BrowseNotes for consistency)
            const demoApprovedNotes = [
                {
                    id: '3',
                    title: 'Data Structures and Algorithms',
                    subject: 'Computer Science',
                    semester: 'Semester 3',
                    author: 'Arjun Sharma',
                    createdAt: new Date('2024-01-15'),
                    downloadCount: 245,
                    fileName: 'dsa-notes.pdf'
                },
                {
                    id: '4',
                    title: 'Calculus Integration Techniques',
                    subject: 'Mathematics',
                    semester: 'Semester 2',
                    author: 'Priya Patel',
                    createdAt: new Date('2024-01-10'),
                    downloadCount: 189,
                    fileName: 'calculus-notes.pdf'
                }
            ];

            setApprovedNotes(demoApprovedNotes);

            // Demo users data
            const demoUsers = [
                {
                    id: '1',
                    name: 'Amit Kumar',
                    email: 'amit.kumar@student.edu',
                    joinedDate: new Date('2024-01-10'),
                    notesShared: 12,
                    status: 'active',
                    role: 'user'
                },
                {
                    id: '2',
                    name: 'Sneha Patel',
                    email: 'sneha.patel@student.edu',
                    joinedDate: new Date('2024-01-08'),
                    notesShared: 8,
                    status: 'active',
                    role: 'user'
                },
                {
                    id: '3',
                    name: 'Ravi Sharma',
                    email: 'ravi.sharma@student.edu',
                    joinedDate: new Date('2024-01-05'),
                    notesShared: 3,
                    status: 'banned',
                    role: 'user'
                },
                {
                    id: '4',
                    name: 'Pooja Singh',
                    email: 'pooja.singh@student.edu',
                    joinedDate: new Date('2024-01-12'),
                    notesShared: 15,
                    status: 'active',
                    role: 'user'
                }
            ];

            // Demo admins data
            const demoAdmins = [
                {
                    id: 'admin1',
                    name: 'Chirantan Mallick',
                    email: 'codiverse.dev@gmail.com',
                    joinedDate: new Date('2023-12-01'),
                    role: 'super_admin',
                    status: 'active',
                    permissions: ['all']
                },
                {
                    id: 'admin2',
                    name: 'Rohit Gupta',
                    email: 'rohit.admin@college.edu',
                    joinedDate: new Date('2024-01-15'),
                    role: 'admin',
                    status: 'active',
                    permissions: ['manage_notes', 'manage_users']
                }
            ];

            setUsers(demoUsers);
            setAdmins(demoAdmins);

            // Calculate demo stats
            const totalDownloads = demoApprovedNotes.reduce((sum, note) => sum + (note.downloadCount || 0), 0);
            setStats({
                totalNotes: demoApprovedNotes.length,
                pendingReview: demoePendingNotes.length,
                totalUsers: 1250,
                totalDownloads
            });

        } catch (error) {
            console.error('Error loading demo data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveNote = async (noteId) => {
        try {
            // Demo mode - simulate approval
            console.log('Demo: Approving note', noteId);

            // Move note from pending to approved
            const note = pendingNotes.find(n => n.id === noteId);
            if (note) {
                setPendingNotes(prev => prev.filter(n => n.id !== noteId));
                setApprovedNotes(prev => [{ ...note, status: 'approved', downloadCount: 0 }, ...prev]);
                setStats(prev => ({
                    ...prev,
                    totalNotes: prev.totalNotes + 1,
                    pendingReview: prev.pendingReview - 1
                }));
            }
        } catch (error) {
            console.error('Error approving note:', error);
            alert('Error approving note');
        }
    };

    const handleRejectNote = async (noteId) => {
        if (!window.confirm('Are you sure you want to reject this note? This action cannot be undone.')) {
            return;
        }

        try {
            // Demo mode - simulate rejection
            console.log('Demo: Rejecting note', noteId);
            setPendingNotes(prev => prev.filter(n => n.id !== noteId));
            setStats(prev => ({
                ...prev,
                pendingReview: prev.pendingReview - 1
            }));
        } catch (error) {
            console.error('Error rejecting note:', error);
            alert('Error rejecting note');
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
            return;
        }

        try {
            // Demo mode - simulate deletion
            console.log('Demo: Deleting note', noteId);
            setApprovedNotes(prev => prev.filter(n => n.id !== noteId));
            setStats(prev => ({
                ...prev,
                totalNotes: prev.totalNotes - 1
            }));
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Error deleting note');
        }
    };

    const handleLogout = () => {
        // Clear demo authentication
        localStorage.removeItem('demoAdminAuth');
        localStorage.removeItem('demoAdminEmail');
        localStorage.removeItem('demoAuthProvider');

        // Trigger custom event to notify components about auth change
        window.dispatchEvent(new Event('adminAuthChanged'));

        // Navigate to admin login page
        navigate('/admin-login');
    };

    // User Management Functions
    const handleBanUser = (userId) => {
        if (!window.confirm('Are you sure you want to ban this user? They will lose access to the platform.')) {
            return;
        }

        try {
            console.log('Demo: Banning user', userId);
            setUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, status: 'banned' } : user
            ));
            alert('User has been banned successfully.');
        } catch (error) {
            console.error('Error banning user:', error);
            alert('Error banning user');
        }
    };

    const handleUnbanUser = (userId) => {
        try {
            console.log('Demo: Unbanning user', userId);
            setUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, status: 'active' } : user
            ));
            alert('User has been unbanned successfully.');
        } catch (error) {
            console.error('Error unbanning user:', error);
            alert('Error unbanning user');
        }
    };

    const handlePromoteToAdmin = (userId) => {
        if (!window.confirm('Are you sure you want to promote this user to admin? They will gain administrative privileges.')) {
            return;
        }

        try {
            console.log('Demo: Promoting user to admin', userId);
            const user = users.find(u => u.id === userId);
            if (user) {
                // Add to admins
                const newAdmin = {
                    ...user,
                    role: 'admin',
                    permissions: ['manage_notes', 'manage_users'],
                    joinedDate: user.joinedDate
                };
                setAdmins(prev => [...prev, newAdmin]);

                // Remove from users
                setUsers(prev => prev.filter(u => u.id !== userId));

                alert('User has been promoted to admin successfully.');
            }
        } catch (error) {
            console.error('Error promoting user:', error);
            alert('Error promoting user');
        }
    };

    const handleDemoteAdmin = (adminId) => {
        if (!window.confirm('Are you sure you want to demote this admin to regular user? They will lose administrative privileges.')) {
            return;
        }

        try {
            console.log('Demo: Demoting admin', adminId);
            const admin = admins.find(a => a.id === adminId);
            if (admin && admin.role !== 'super_admin') {
                // Add to users
                const newUser = {
                    ...admin,
                    role: 'user',
                    notesShared: 0,
                    status: 'active'
                };
                setUsers(prev => [...prev, newUser]);

                // Remove from admins
                setAdmins(prev => prev.filter(a => a.id !== adminId));

                alert('Admin has been demoted to user successfully.');
            } else if (admin && admin.role === 'super_admin') {
                alert('Cannot demote super admin.');
            }
        } catch (error) {
            console.error('Error demoting admin:', error);
            alert('Error demoting admin');
        }
    };

    const handleRemoveAdmin = (adminId) => {
        if (!window.confirm('Are you sure you want to remove this admin? This action cannot be undone.')) {
            return;
        }

        try {
            console.log('Demo: Removing admin', adminId);
            const admin = admins.find(a => a.id === adminId);
            if (admin && admin.role !== 'super_admin') {
                setAdmins(prev => prev.filter(a => a.id !== adminId));
                alert('Admin has been removed successfully.');
            } else if (admin && admin.role === 'super_admin') {
                alert('Cannot remove super admin.');
            }
        } catch (error) {
            console.error('Error removing admin:', error);
            alert('Error removing admin');
        }
    };

    // Modal Functions
    const openBanModal = (user) => {
        setSelectedUserToBan(user);
        setBanReason('');
        setShowBanModal(true);
    };

    const closeBanModal = () => {
        setShowBanModal(false);
        setSelectedUserToBan(null);
        setBanReason('');
    };

    const handleBanWithReason = () => {
        if (!banReason.trim()) {
            alert('Please provide a reason for banning this user.');
            return;
        }

        try {
            if (selectedUserToBan) {
                // Check if it's a user or admin
                const isAdmin = admins.find(admin => admin.id === selectedUserToBan.id);

                if (isAdmin) {
                    if (isAdmin.role === 'super_admin') {
                        alert('Cannot ban super admin.');
                        return;
                    }
                    // Ban admin (move to users with banned status)
                    const bannedUser = {
                        ...isAdmin,
                        role: 'user',
                        status: 'banned',
                        banReason: banReason,
                        bannedAt: new Date(),
                        notesShared: 0
                    };
                    setUsers(prev => [...prev, bannedUser]);
                    setAdmins(prev => prev.filter(a => a.id !== selectedUserToBan.id));
                } else {
                    // Ban regular user
                    setUsers(prev => prev.map(user =>
                        user.id === selectedUserToBan.id
                            ? { ...user, status: 'banned', banReason: banReason, bannedAt: new Date() }
                            : user
                    ));
                }

                alert(`${selectedUserToBan.name} has been banned successfully.`);
                closeBanModal();
            }
        } catch (error) {
            console.error('Error banning user:', error);
            alert('Error banning user');
        }
    };

    const openNewAdminModal = () => {
        setNewAdminData({
            name: '',
            email: '',
            password: '',
            role: 'admin',
            permissions: ['manage_notes', 'manage_users']
        });
        setShowNewAdminModal(true);
    };

    const closeNewAdminModal = () => {
        setShowNewAdminModal(false);
        setNewAdminData({
            name: '',
            email: '',
            password: '',
            role: 'admin',
            permissions: ['manage_notes', 'manage_users']
        });
    };

    const handleCreateNewAdmin = () => {
        if (!newAdminData.name.trim() || !newAdminData.email.trim() || !newAdminData.password.trim()) {
            alert('Please fill in all required fields.');
            return;
        }

        // Check if email already exists
        const emailExists = [...users, ...admins].some(person => person.email === newAdminData.email);
        if (emailExists) {
            alert('An account with this email already exists.');
            return;
        }

        try {
            const newAdmin = {
                id: `admin_${Date.now()}`,
                name: newAdminData.name,
                email: newAdminData.email,
                role: newAdminData.role,
                status: 'active',
                joinedDate: new Date(),
                permissions: newAdminData.permissions,
                createdBy: 'Super Admin'
            };

            setAdmins(prev => [...prev, newAdmin]);
            alert(`New admin ${newAdminData.name} has been created successfully.`);
            closeNewAdminModal();
        } catch (error) {
            console.error('Error creating new admin:', error);
            alert('Error creating new admin');
        }
    };

    const handlePermissionChange = (permission) => {
        setNewAdminData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission]
        }));
    };

    const formatDate = (date) => {
        if (!date) return '';
        if (date.toDate) {
            return date.toDate().toLocaleDateString();
        }
        return new Date(date).toLocaleDateString();
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return 'Unknown';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary-900">Admin Dashboard</h1>
                        <p className="text-secondary-600 mt-2">Manage notes, users, and platform content</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-primary-100 rounded-lg">
                                <BookOpen className="h-6 w-6 text-primary-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-secondary-600">Total Notes</p>
                                <p className="text-2xl font-bold text-secondary-900">{stats.totalNotes}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-secondary-600">Pending Review</p>
                                <p className="text-2xl font-bold text-secondary-900">{stats.pendingReview}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-secondary-600">Total Users</p>
                                <p className="text-2xl font-bold text-secondary-900">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Download className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-secondary-600">Total Downloads</p>
                                <p className="text-2xl font-bold text-secondary-900">{stats.totalDownloads}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <div className="border-b border-secondary-200">
                        <nav className="-mb-px flex">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'overview'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                                    }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'pending'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                                    }`}
                            >
                                Pending Review ({stats.pendingReview})
                            </button>
                            <button
                                onClick={() => setActiveTab('approved')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'approved'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                                    }`}
                            >
                                Published Notes
                            </button>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'users'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                                    }`}
                            >
                                Manage Users
                            </button>
                            <button
                                onClick={() => setActiveTab('admins')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'admins'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                                    }`}
                            >
                                Manage Admins
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Pending Notes Tab */}
                        {activeTab === 'pending' && (
                            <div>
                                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                                    Notes Pending Review
                                </h3>
                                {pendingNotes.length === 0 ? (
                                    <div className="text-center py-8">
                                        <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                                        <p className="text-secondary-600">No notes pending review</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingNotes.map(note => (
                                            <div key={note.id} className="border border-secondary-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                                                            {note.title}
                                                        </h4>
                                                        <div className="flex items-center space-x-4 text-sm text-secondary-600 mb-2">
                                                            <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                                                                {note.subject}
                                                            </span>
                                                            <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full">
                                                                {note.semester}
                                                            </span>
                                                            <div className="flex items-center space-x-1">
                                                                <Calendar size={16} />
                                                                <span>{formatDate(note.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-secondary-600 mb-2">{note.description}</p>
                                                        <div className="text-sm text-secondary-500">
                                                            <p>Author: {note.author}</p>
                                                            <p>File: {note.fileName} ({formatFileSize(note.fileSize)})</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2 ml-4">
                                                        <button
                                                            onClick={() => handleApproveNote(note.id)}
                                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors"
                                                        >
                                                            <CheckCircle size={16} />
                                                            <span>Approve</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectNote(note.id)}
                                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors"
                                                        >
                                                            <XCircle size={16} />
                                                            <span>Reject</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Approved Notes Tab */}
                        {activeTab === 'approved' && (
                            <div>
                                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                                    Published Notes
                                </h3>
                                <div className="space-y-4">
                                    {approvedNotes.slice(0, 10).map(note => (
                                        <div key={note.id} className="border border-secondary-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                                                        {note.title}
                                                    </h4>
                                                    <div className="flex items-center space-x-4 text-sm text-secondary-600 mb-2">
                                                        <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                                                            {note.subject}
                                                        </span>
                                                        <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full">
                                                            {note.semester}
                                                        </span>
                                                        <div className="flex items-center space-x-1">
                                                            <Download size={16} />
                                                            <span>{note.downloadCount || 0} downloads</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-secondary-500">
                                                        Author: {note.author} • Published: {formatDate(note.createdAt)}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteNote(note.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div>
                                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                                    Platform Overview
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium text-secondary-900 mb-3">Recent Activity</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-3 text-sm">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span>5 new notes submitted for review</span>
                                            </div>
                                            <div className="flex items-center space-x-3 text-sm">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span>15 notes downloaded today</span>
                                            </div>
                                            <div className="flex items-center space-x-3 text-sm">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                <span>3 new users registered</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-secondary-900 mb-3">Quick Actions</h4>
                                        <div className="space-y-2">
                                            <button className="w-full text-left px-3 py-2 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors">
                                                Review pending notes
                                            </button>
                                            <button className="w-full text-left px-3 py-2 text-sm bg-secondary-50 text-secondary-700 rounded-lg hover:bg-secondary-100 transition-colors">
                                                Export usage analytics
                                            </button>
                                            <button className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                                                Send newsletter to users
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Users Management Tab */}
                        {activeTab === 'users' && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-secondary-900">
                                        User Management
                                    </h3>
                                    <button
                                        onClick={openBanModal}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                                    >
                                        <Ban size={16} />
                                        <span>Ban Member</span>
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {users.map(user => (
                                        <div key={user.id} className="border border-secondary-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                                                        {user.name}
                                                    </h4>
                                                    <div className="flex items-center space-x-4 text-sm text-secondary-600 mb-2">
                                                        <span>{user.email}</span>
                                                        <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {user.status}
                                                        </span>
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar size={16} />
                                                            <span>Joined: {formatDate(user.joinedDate)}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-secondary-500">
                                                        Notes Shared: {user.notesShared} • Role: {user.role}
                                                    </p>
                                                </div>
                                                <div className="flex space-x-2 ml-4">
                                                    {user.status === 'active' ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleBanUser(user.id)}
                                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors"
                                                            >
                                                                <Ban size={16} />
                                                                <span>Ban</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handlePromoteToAdmin(user.id)}
                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors"
                                                            >
                                                                <Shield size={16} />
                                                                <span>Make Admin</span>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUnbanUser(user.id)}
                                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors"
                                                        >
                                                            <CheckCircle size={16} />
                                                            <span>Unban</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Admins Management Tab */}
                        {activeTab === 'admins' && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-secondary-900">
                                        Admin Management
                                    </h3>
                                    <button
                                        onClick={openNewAdminModal}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                                    >
                                        <UserPlus size={16} />
                                        <span>New Admin</span>
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {admins.map(admin => (
                                        <div key={admin.id} className="border border-secondary-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                                                        {admin.name}
                                                        {admin.role === 'super_admin' && (
                                                            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                                                Super Admin
                                                            </span>
                                                        )}
                                                    </h4>
                                                    <div className="flex items-center space-x-4 text-sm text-secondary-600 mb-2">
                                                        <span>{admin.email}</span>
                                                        <span className={`px-2 py-1 rounded-full text-xs ${admin.status === 'active'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {admin.status}
                                                        </span>
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar size={16} />
                                                            <span>Joined: {formatDate(admin.joinedDate)}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-secondary-500">
                                                        Role: {admin.role} • Permissions: {admin.permissions.join(', ')}
                                                    </p>
                                                </div>
                                                {admin.role !== 'super_admin' && (
                                                    <div className="flex space-x-2 ml-4">
                                                        <button
                                                            onClick={() => handleDemoteAdmin(admin.id)}
                                                            className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors"
                                                        >
                                                            <ShieldOff size={16} />
                                                            <span>Demote</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveAdmin(admin.id)}
                                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                            <span>Remove</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Ban Member Modal */}
            {showBanModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Ban Member</h3>
                            <button
                                onClick={closeBanModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                aria-label="Close ban modal"
                            >
                                <X size={20} className="sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-lg font-medium text-gray-800 mb-4">Select User/Admin to Ban:</h4>
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {/* Users List */}
                                <div className="mb-4">
                                    <h5 className="text-md font-medium text-gray-700 mb-2">Users:</h5>
                                    {users.filter(user => user.status === 'active').map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                                <div className="text-xs text-gray-400">Role: {user.role} • Joined: {formatDate(user.joinedDate)}</div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedUserToBan(user)}
                                                className={`px-3 py-1 rounded text-sm transition-colors ${selectedUserToBan?.id === user.id
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                                                    }`}
                                            >
                                                {selectedUserToBan?.id === user.id ? 'Selected' : 'Select'}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Admins List */}
                                <div>
                                    <h5 className="text-md font-medium text-gray-700 mb-2">Admins:</h5>
                                    {admins.filter(admin => admin.status === 'active' && admin.role !== 'super_admin').map(admin => (
                                        <div key={admin.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">
                                                    {admin.name}
                                                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                        Admin
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-500">{admin.email}</div>
                                                <div className="text-xs text-gray-400">Permissions: {admin.permissions.join(', ')}</div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedUserToBan(admin)}
                                                className={`px-3 py-1 rounded text-sm transition-colors ${selectedUserToBan?.id === admin.id
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                                                    }`}
                                            >
                                                {selectedUserToBan?.id === admin.id ? 'Selected' : 'Select'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {selectedUserToBan && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for banning {selectedUserToBan.name}:
                                </label>
                                <textarea
                                    value={banReason}
                                    onChange={(e) => setBanReason(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="4"
                                    placeholder="Please provide a detailed reason for banning this user..."
                                />
                            </div>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeBanModal}
                                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBanWithReason}
                                disabled={!selectedUserToBan || !banReason.trim()}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                            >
                                Ban User
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* New Admin Modal */}
            {showNewAdminModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Create New Admin</h3>
                            <button
                                onClick={closeNewAdminModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                aria-label="Close new admin modal"
                            >
                                <X size={20} className="sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Admin Name *
                                </label>
                                <input
                                    type="text"
                                    value={newAdminData.name}
                                    onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter admin's full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={newAdminData.email}
                                    onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter admin's email address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={newAdminData.showPassword ? 'text' : 'password'}
                                        value={newAdminData.password}
                                        onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                        placeholder="Create a secure password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setNewAdminData({ ...newAdminData, showPassword: !newAdminData.showPassword })}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {newAdminData.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Admin Role *
                                </label>
                                <select
                                    value={newAdminData.role}
                                    onChange={(e) => setNewAdminData({ ...newAdminData, role: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select admin role</option>
                                    <option value="admin">Admin</option>
                                    <option value="moderator">Moderator</option>
                                    <option value="content_manager">Content Manager</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Permissions *
                                </label>
                                <div className="space-y-2">
                                    {['manage_users', 'manage_notes', 'manage_content', 'view_analytics', 'system_settings'].map(permission => (
                                        <label key={permission} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={newAdminData.permissions.includes(permission)}
                                                onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 capitalize">
                                                {permission.replace('_', ' ')}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    value={newAdminData.notes}
                                    onChange={(e) => setNewAdminData({ ...newAdminData, notes: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="Any additional notes about this admin..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={closeNewAdminModal}
                                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateNewAdmin}
                                disabled={!newAdminData.name || !newAdminData.email || !newAdminData.password || !newAdminData.role || newAdminData.permissions.length === 0}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                            >
                                Create Admin
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
