import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, supabase } from '../supabase';
import {
    Users, BookOpen, Download, AlertTriangle, LogOut, Settings,
    UserPlus, X, Eye, EyeOff, RefreshCw, Plus, Trash2, Edit3,
    CheckCircle, XCircle, Activity, Calendar, Archive, Monitor
} from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('content');
    const [pendingNotes, setPendingNotes] = useState([]);
    const [approvedNotes, setApprovedNotes] = useState([]);
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [activityLog, setActivityLog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(null);

    // Modal states
    const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
    const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
    const [showAddSemesterModal, setShowAddSemesterModal] = useState(false);
    const [showNewAdminModal, setShowNewAdminModal] = useState(false);

    // Form states
    const [newDepartment, setNewDepartment] = useState({ name: '', code: '', description: '' });
    const [newSubject, setNewSubject] = useState({ name: '', code: '', description: '', department_id: '' });
    const [newSemester, setNewSemester] = useState({ number: '', name: '', is_active: true });
    const [newAdminData, setNewAdminData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin',
        permissions: ['manage_notes', 'manage_users'],
        showPassword: false
    });

    // Stats state
    const [stats, setStats] = useState({
        totalNotes: 0,
        pendingReview: 0,
        totalUsers: 0,
        totalDownloads: 0
    });

    const fetchData = useCallback(async () => {
        try {
            console.log('AdminDashboard: Starting to fetch data...');
            setLoading(true);

            // Fetch all data in parallel
            const [
                usersResult,
                adminsResult,
                notesResult,
                departmentsResult,
                subjectsResult,
                semestersResult,
                activityResult
            ] = await Promise.allSettled([
                // Fetch regular users
                supabase.from('users').select('*').eq('role', 'user').order('created_at', { ascending: false }),

                // Fetch admins
                supabase.from('users').select('*').eq('role', 'admin').order('created_at', { ascending: false }),

                // Fetch notes
                supabase.from('notes').select('*').order('created_at', { ascending: false }),

                // Fetch departments (create table if needed)
                supabase.from('departments').select('*').order('name'),

                // Fetch subjects (create table if needed)
                supabase.from('subjects').select('*').order('name'),

                // Fetch semesters (create table if needed)
                supabase.from('semesters').select('*').order('number'),

                // Fetch activity log
                supabase.from('admin_actions').select('*').order('created_at', { ascending: false }).limit(50)
            ]);

            // Process users
            if (usersResult.status === 'fulfilled' && !usersResult.value.error) {
                const userData = usersResult.value.data || [];
                setUsers(userData);

                // Update stats with user count
                setStats(prev => ({
                    ...prev,
                    totalUsers: userData.length
                }));
            } else {
                console.error('Error fetching users:', usersResult.value?.error);
                setUsers([]);
            }

            // Process admins
            if (adminsResult.status === 'fulfilled' && !adminsResult.value.error) {
                setAdmins(adminsResult.value.data || []);
            } else {
                console.error('Error fetching admins:', adminsResult.value?.error);
                setAdmins([]);
            }

            // Process notes
            if (notesResult.status === 'fulfilled' && !notesResult.value.error) {
                const allNotes = notesResult.value.data || [];
                setPendingNotes(allNotes.filter(note => note.status === 'pending'));
                setApprovedNotes(allNotes.filter(note => note.status === 'approved'));

                // Calculate stats
                const totalNotes = allNotes.length;
                const pendingReview = allNotes.filter(note => note.status === 'pending').length;

                setStats(prev => ({
                    ...prev,
                    totalNotes,
                    pendingReview
                }));
            } else {
                console.error('Error fetching notes:', notesResult.value?.error);
                setPendingNotes([]);
                setApprovedNotes([]);
            }

            // Process departments
            if (departmentsResult.status === 'fulfilled' && !departmentsResult.value.error) {
                setDepartments(departmentsResult.value.data || []);
            } else {
                console.error('Error fetching departments:', departmentsResult.value?.error);
                // Initialize with default departments if table doesn't exist
                setDepartments([
                    { id: 1, name: 'Computer Science & Engineering', code: 'CSE' },
                    { id: 2, name: 'Electrical Engineering', code: 'EE' },
                    { id: 3, name: 'Civil Engineering', code: 'CE' },
                    { id: 4, name: 'Mechanical Engineering', code: 'ME' },
                    { id: 5, name: 'School of Agriculture', code: 'AGR' },
                    { id: 6, name: 'School of Computer Applications', code: 'SCA' }
                ]);
            }

            // Process subjects
            if (subjectsResult.status === 'fulfilled' && !subjectsResult.value.error) {
                setSubjects(subjectsResult.value.data || []);
            } else {
                console.error('Error fetching subjects:', subjectsResult.value?.error);
                setSubjects([]);
            }

            // Process semesters
            if (semestersResult.status === 'fulfilled' && !semestersResult.value.error) {
                setSemesters(semestersResult.value.data || []);
            } else {
                console.error('Error fetching semesters:', semestersResult.value?.error);
                // Initialize with default semesters
                setSemesters([
                    { id: 1, number: 1, name: 'Semester 1', is_active: true },
                    { id: 2, number: 2, name: 'Semester 2', is_active: true },
                    { id: 3, number: 3, name: 'Semester 3', is_active: true },
                    { id: 4, number: 4, name: 'Semester 4', is_active: true },
                    { id: 5, number: 5, name: 'Semester 5', is_active: true },
                    { id: 6, number: 6, name: 'Semester 6', is_active: true },
                    { id: 7, number: 7, name: 'Semester 7', is_active: true },
                    { id: 8, number: 8, name: 'Semester 8', is_active: true }
                ]);
            }

            // Process activity log
            if (activityResult.status === 'fulfilled' && !activityResult.value.error) {
                setActivityLog(activityResult.value.data || []);
            } else {
                console.error('Error fetching activity log:', activityResult.value?.error);
                setActivityLog([]);
            }

            setLastRefresh(new Date());
            console.log('AdminDashboard: Data fetched successfully');

        } catch (error) {
            console.error('AdminDashboard: Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // First check demo admin auth for backwards compatibility
                const demoAdminAuth = localStorage.getItem('demoAdminAuth') === 'true';
                const demoAdminEmail = localStorage.getItem('demoAdminEmail');

                if (demoAdminAuth && demoAdminEmail) {
                    console.log('Demo admin authenticated, setting up demo admin profile');

                    // Create demo admin profile object
                    const demoAdmin = {
                        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
                        email: demoAdminEmail,
                        name: 'Demo Admin User',
                        role: 'admin',
                        status: 'active',
                        permissions: ['manage_notes', 'manage_users', 'manage_content'],
                        auth_provider: 'email'
                    };

                    setCurrentAdmin(demoAdmin);
                    await fetchData();
                    return;
                }

                // If not demo mode, check real Supabase authentication
                const user = await auth.getCurrentUser();

                if (!user) {
                    console.log('No authenticated user found, redirecting to admin login');
                    navigate('/admin-login');
                    return;
                }

                // Get admin profile from database
                const { data: adminProfile, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .eq('role', 'admin')
                    .single();

                if (error || !adminProfile) {
                    console.log('User is not an admin, redirecting to admin login');
                    navigate('/admin-login');
                    return;
                }

                setCurrentAdmin(adminProfile);
                await fetchData();

            } catch (error) {
                console.error('Auth check error:', error);
                navigate('/admin-login');
            }
        };

        checkAuth();

        // Listen for auth changes
        const handleAuthChange = () => {
            checkAuth();
        };

        window.addEventListener('adminAuthChanged', handleAuthChange);

        return () => {
            window.removeEventListener('adminAuthChanged', handleAuthChange);
        };
    }, [navigate, fetchData]);

    // Department CRUD operations
    const handleAddDepartment = async () => {
        if (!newDepartment.name.trim() || !newDepartment.code.trim()) {
            alert('Please fill in department name and code.');
            return;
        }

        try {
            const { error } = await supabase
                .from('departments')
                .insert([newDepartment]);

            if (error) throw error;

            alert('Department added successfully!');
            setShowAddDepartmentModal(false);
            setNewDepartment({ name: '', code: '', description: '' });
            fetchData();
        } catch (error) {
            console.error('Error adding department:', error);
            alert('Error adding department: ' + error.message);
        }
    };

    const handleDeleteDepartment = async (id) => {
        if (!window.confirm('Are you sure you want to delete this department?')) return;

        try {
            const { error } = await supabase
                .from('departments')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert('Department deleted successfully!');
            fetchData();
        } catch (error) {
            console.error('Error deleting department:', error);
            alert('Error deleting department: ' + error.message);
        }
    };

    // Subject CRUD operations
    const handleAddSubject = async () => {
        if (!newSubject.name.trim() || !newSubject.code.trim()) {
            alert('Please fill in subject name and code.');
            return;
        }

        try {
            const { error } = await supabase
                .from('subjects')
                .insert([newSubject]);

            if (error) throw error;

            alert('Subject added successfully!');
            setShowAddSubjectModal(false);
            setNewSubject({ name: '', code: '', description: '', department_id: '' });
            fetchData();
        } catch (error) {
            console.error('Error adding subject:', error);
            alert('Error adding subject: ' + error.message);
        }
    };

    const handleDeleteSubject = async (id) => {
        if (!window.confirm('Are you sure you want to delete this subject?')) return;

        try {
            const { error } = await supabase
                .from('subjects')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert('Subject deleted successfully!');
            fetchData();
        } catch (error) {
            console.error('Error deleting subject:', error);
            alert('Error deleting subject: ' + error.message);
        }
    };

    // Semester CRUD operations
    const handleAddSemester = async () => {
        if (!newSemester.number || !newSemester.name.trim()) {
            alert('Please fill in semester number and name.');
            return;
        }

        try {
            const { error } = await supabase
                .from('semesters')
                .insert([newSemester]);

            if (error) throw error;

            alert('Semester added successfully!');
            setShowAddSemesterModal(false);
            setNewSemester({ number: '', name: '', is_active: true });
            fetchData();
        } catch (error) {
            console.error('Error adding semester:', error);
            alert('Error adding semester: ' + error.message);
        }
    };

    const handleDeleteSemester = async (id) => {
        if (!window.confirm('Are you sure you want to delete this semester?')) return;

        try {
            const { error } = await supabase
                .from('semesters')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert('Semester deleted successfully!');
            fetchData();
        } catch (error) {
            console.error('Error deleting semester:', error);
            alert('Error deleting semester: ' + error.message);
        }
    };

    // Note approval operations
    const handleApproveNote = async (noteId) => {
        try {
            const { error } = await supabase
                .from('notes')
                .update({
                    status: 'approved',
                    approved_at: new Date().toISOString(),
                    approved_by: currentAdmin?.id
                })
                .eq('id', noteId);

            if (error) throw error;

            // Log admin action
            await supabase
                .from('admin_actions')
                .insert([{
                    admin_id: currentAdmin?.id,
                    action: 'approve_note',
                    target_type: 'note',
                    target_id: noteId,
                    details: 'Note approved'
                }]);

            alert('Note approved successfully!');
            fetchData();
        } catch (error) {
            console.error('Error approving note:', error);
            alert('Error approving note: ' + error.message);
        }
    };

    const handleRejectNote = async (noteId) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            const { error } = await supabase
                .from('notes')
                .update({
                    status: 'rejected',
                    rejection_reason: reason
                })
                .eq('id', noteId);

            if (error) throw error;

            // Log admin action
            await supabase
                .from('admin_actions')
                .insert([{
                    admin_id: currentAdmin?.id,
                    action: 'reject_note',
                    target_type: 'note',
                    target_id: noteId,
                    details: `Note rejected: ${reason}`
                }]);

            alert('Note rejected successfully!');
            fetchData();
        } catch (error) {
            console.error('Error rejecting note:', error);
            alert('Error rejecting note: ' + error.message);
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) return;

        try {
            const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id', noteId);

            if (error) throw error;

            // Log admin action
            await supabase
                .from('admin_actions')
                .insert([{
                    admin_id: currentAdmin?.id,
                    action: 'delete_note',
                    target_type: 'note',
                    target_id: noteId,
                    details: 'Note deleted'
                }]);

            alert('Note deleted successfully!');
            fetchData();
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Error deleting note: ' + error.message);
        }
    };

    // User management operations
    const handleBanUser = async (userId) => {
        const reason = prompt('Please provide a reason for banning this user:');
        if (!reason) return;

        try {
            const { error } = await supabase.rpc('ban_user', {
                p_user_id: userId,
                p_reason: reason
            });

            if (error) throw error;

            alert('User banned successfully!');
            fetchData();
        } catch (error) {
            console.error('Error banning user:', error);
            alert('Error banning user: ' + error.message);
        }
    };

    const handleUnbanUser = async (userId) => {
        try {
            const { error } = await supabase.rpc('unban_user', {
                p_user_id: userId
            });

            if (error) throw error;

            alert('User unbanned successfully!');
            fetchData();
        } catch (error) {
            console.error('Error unbanning user:', error);
            alert('Error unbanning user: ' + error.message);
        }
    };

    const handleLogout = async () => {
        try {
            // Clear demo auth
            localStorage.removeItem('demoAdminAuth');
            localStorage.removeItem('demoAdminEmail');
            localStorage.removeItem('demoAuthProvider');

            // Also sign out from Supabase if there's a real session
            await auth.signOut();

            // Trigger auth change event
            window.dispatchEvent(new Event('adminAuthChanged'));

            navigate('/admin-login');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout fails, clear local state and redirect
            navigate('/admin-login');
        }
    };

    const openNewAdminModal = () => {
        setNewAdminData({
            name: '',
            email: '',
            password: '',
            role: 'admin',
            permissions: ['manage_notes', 'manage_users'],
            showPassword: false
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
            permissions: ['manage_notes', 'manage_users'],
            showPassword: false
        });
    };

    const handleCreateNewAdmin = async () => {
        if (!newAdminData.name.trim() || !newAdminData.email.trim() || !newAdminData.password.trim()) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: newAdminData.email,
                password: newAdminData.password,
                options: {
                    data: {
                        name: newAdminData.name,
                        role: 'admin'
                    }
                }
            });

            if (authError) throw authError;

            const newAdmin = {
                id: authData.user.id,
                name: newAdminData.name,
                email: newAdminData.email,
                role: newAdminData.role,
                status: 'active',
                created_at: new Date().toISOString(),
                permissions: newAdminData.permissions
            };

            setAdmins(prev => [...prev, newAdmin]);
            alert(`New admin ${newAdminData.name} has been created successfully.`);
            closeNewAdminModal();
            fetchData();
        } catch (error) {
            console.error('Error creating new admin:', error);
            alert('Error creating new admin: ' + error.message);
        }
    };

    const handlePermissionChange = (permission, isChecked) => {
        setNewAdminData(prev => ({
            ...prev,
            permissions: isChecked
                ? [...prev.permissions, permission]
                : prev.permissions.filter(p => p !== permission)
        }));
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
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                            <span>Refresh</span>
                        </button>
                        {lastRefresh && (
                            <div className="text-xs text-secondary-500">
                                Last updated: {lastRefresh.toLocaleTimeString()}
                            </div>
                        )}
                        {currentAdmin && (
                            <div className="text-right">
                                <p className="text-sm font-medium text-secondary-900">
                                    Welcome, {currentAdmin.name}
                                </p>
                                <p className="text-xs text-secondary-600">
                                    {currentAdmin.email}
                                </p>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
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

                {/* Simple Content Area for Testing */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Admin Operations</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={openNewAdminModal}
                            className="p-4 bg-blue-100 hover:bg-blue-200 rounded-lg text-center transition-colors"
                        >
                            <UserPlus className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                            <p className="font-medium text-blue-800">Create New Admin</p>
                            <p className="text-sm text-blue-600">Add a new admin user</p>
                        </button>

                        <button
                            className="p-4 bg-green-100 hover:bg-green-200 rounded-lg text-center transition-colors"
                        >
                            <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            <p className="font-medium text-green-800">Manage Users</p>
                            <p className="text-sm text-green-600">{users.length} registered users</p>
                        </button>

                        <button
                            className="p-4 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-center transition-colors"
                        >
                            <BookOpen className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                            <p className="font-medium text-yellow-800">Review Notes</p>
                            <p className="text-sm text-yellow-600">{pendingNotes.length} pending approval</p>
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{stats.totalNotes}</p>
                            <p className="text-sm text-gray-600">Total Notes</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600">{stats.pendingReview}</p>
                            <p className="text-sm text-gray-600">Pending Review</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{stats.totalUsers}</p>
                            <p className="text-sm text-gray-600">Active Users</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{admins.length}</p>
                            <p className="text-sm text-gray-600">Admin Users</p>
                        </div>
                    </div>
                </div>

                {/* New Admin Modal */}
                {showNewAdminModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Create New Admin</h3>
                                <button
                                    onClick={closeNewAdminModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="Close modal"
                                >
                                    <X size={24} />
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
                                        Permissions
                                    </label>
                                    <div className="space-y-2">
                                        {['manage_users', 'manage_notes', 'manage_content'].map(permission => (
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
                                    disabled={!newAdminData.name || !newAdminData.email || !newAdminData.password}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                                >
                                    Create Admin
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
