import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, auth } from '../supabase';
import {
    BookOpen,
    Users,
    Clock,
    Download,
    RefreshCw,
    LogOut,
    Plus,
    Trash2,
    UserPlus,
    X,
    Eye,
    EyeOff
} from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();

    // State for dashboard data
    const [activeTab, setActiveTab] = useState('content');
    const [activeContentTab, setActiveContentTab] = useState('departments');
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

    // Initialize tables with default data
    const initializeTables = async () => {
        try {
            // Check if departments exist, if not create default ones
            const { error: deptError } = await supabase
                .from('departments')
                .select('*')
                .limit(1);

            if (deptError && deptError.code === 'PGRST116') {
                // Table doesn't exist, but we'll handle this gracefully
                console.log('Tables may not exist yet, will use fallback data');
            }
        } catch (error) {
            console.log('Error checking tables:', error);
        }
    };

    const fetchData = useCallback(async () => {
        try {
            console.log('AdminDashboard: Starting to fetch data...');
            setLoading(true);

            // First, ensure tables exist by creating them if they don't
            await initializeTables();

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

                // Fetch departments
                supabase.from('departments').select('*').order('name'),

                // Fetch subjects with department info
                supabase.from('subjects').select('*, departments(name)').order('name'),

                // Fetch semesters
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
                console.error('AdminDashboard: Error checking auth:', error);
                navigate('/admin-login');
            }
        };

        checkAuth();
    }, [navigate, fetchData]);

    // Department CRUD operations
    const handleAddDepartment = async () => {
        if (!newDepartment.name.trim() || !newDepartment.code.trim()) {
            alert('Please fill in department name and code.');
            return;
        }

        try {
            // Prepare department data
            const departmentData = {
                name: newDepartment.name.trim(),
                code: newDepartment.code.trim(),
                description: newDepartment.description.trim()
            };

            const { error } = await supabase
                .from('departments')
                .insert([departmentData]);

            if (error) throw error;

            alert('Department added successfully!');
            setShowAddDepartmentModal(false);
            setNewDepartment({ name: '', code: '', description: '' });
            fetchData();
        } catch (error) {
            console.error('Error adding department:', error);
            alert('Error adding department: ' + (error.message || 'Unknown error occurred'));
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

        // Validate department selection
        if (!newSubject.department_id || newSubject.department_id === '') {
            alert('Please select a department for the subject.');
            return;
        }

        try {
            // Prepare subject data with proper type conversion
            const subjectData = {
                name: newSubject.name.trim(),
                code: newSubject.code.trim(),
                description: newSubject.description.trim(),
                department_id: parseInt(newSubject.department_id)
            };

            const { error } = await supabase
                .from('subjects')
                .insert([subjectData]);

            if (error) throw error;

            alert('Subject added successfully!');
            setShowAddSubjectModal(false);
            setNewSubject({ name: '', code: '', description: '', department_id: '' });
            fetchData();
        } catch (error) {
            console.error('Error adding subject:', error);
            alert('Error adding subject: ' + (error.message || 'Unknown error occurred'));
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
            // Prepare semester data with proper type conversion
            const semesterData = {
                number: parseInt(newSemester.number),
                name: newSemester.name.trim(),
                is_active: newSemester.is_active
            };

            const { error } = await supabase
                .from('semesters')
                .insert([semesterData]);

            if (error) throw error;

            alert('Semester added successfully!');
            setShowAddSemesterModal(false);
            setNewSemester({ number: '', name: '', is_active: true });
            fetchData();
        } catch (error) {
            console.error('Error adding semester:', error);
            alert('Error adding semester: ' + (error.message || 'Unknown error occurred'));
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
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-primary transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-text-primary">Admin Dashboard</h1>
                        <p className="text-gray-600 dark:text-text-secondary mt-2">Manage platform content, users, and notes</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 dark:bg-accent-blue text-white rounded-lg hover:bg-blue-700 dark:hover:bg-accent-blue-hover transition-colors disabled:opacity-50"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                            <span>Refresh</span>
                        </button>
                        {lastRefresh && (
                            <div className="text-xs text-gray-500 dark:text-text-muted">
                                Last updated: {lastRefresh.toLocaleTimeString()}
                            </div>
                        )}
                        {currentAdmin && (
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                    Welcome, {currentAdmin.name}
                                </p>
                                <p className="text-xs text-gray-600">
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
                    <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-sm p-6 border border-gray-200 dark:border-border-subtle transition-colors duration-300">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 dark:bg-accent-blue/20 rounded-lg">
                                <BookOpen className="h-6 w-6 text-blue-600 dark:text-accent-blue" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-text-secondary">Total Notes</h3>
                                <p className="text-2xl font-bold text-gray-900 dark:text-text-primary">{stats.totalNotes}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-sm p-6 border border-gray-200 dark:border-border-subtle transition-colors duration-300">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-text-secondary">Pending Review</h3>
                                <p className="text-2xl font-bold text-gray-900 dark:text-text-primary">{stats.pendingReview}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-sm p-6 border border-gray-200 dark:border-border-subtle transition-colors duration-300">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-text-secondary">Total Users</h3>
                                <p className="text-2xl font-bold text-gray-900 dark:text-text-primary">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-sm p-6 border border-gray-200 dark:border-border-subtle transition-colors duration-300">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                <Download className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-text-secondary">Downloads</h3>
                                <p className="text-2xl font-bold text-gray-900 dark:text-text-primary">{stats.totalDownloads}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mb-8">
                    <div className="border-b border-gray-200 dark:border-border-subtle">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('content')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'content'
                                    ? 'border-blue-500 dark:border-accent-blue text-blue-600 dark:text-accent-blue'
                                    : 'border-transparent text-gray-500 dark:text-text-secondary hover:text-gray-700 dark:hover:text-text-primary hover:border-gray-300 dark:hover:border-border-subtle'
                                    }`}
                            >
                                Content Management
                            </button>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'users'
                                    ? 'border-blue-500 dark:border-accent-blue text-blue-600 dark:text-accent-blue'
                                    : 'border-transparent text-gray-500 dark:text-text-secondary hover:text-gray-700 dark:hover:text-text-primary hover:border-gray-300 dark:hover:border-border-subtle'
                                    }`}
                            >
                                User Management
                            </button>
                            <button
                                onClick={() => setActiveTab('notes')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'notes'
                                    ? 'border-blue-500 dark:border-accent-blue text-blue-600 dark:text-accent-blue'
                                    : 'border-transparent text-gray-500 dark:text-text-secondary hover:text-gray-700 dark:hover:text-text-primary hover:border-gray-300 dark:hover:border-border-subtle'
                                    }`}
                            >
                                Notes Management
                            </button>
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'activity'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Activity Log
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-sm border border-gray-200 dark:border-border-subtle transition-colors duration-300">
                    {/* Content Management Tab */}
                    {activeTab === 'content' && (
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-text-primary mb-6">Content Management</h2>

                            {/* Content Subtabs */}
                            <div className="mb-6">
                                <div className="border-b border-gray-200 dark:border-border-subtle">
                                    <nav className="-mb-px flex space-x-8">
                                        <button
                                            onClick={() => setActiveContentTab('departments')}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeContentTab === 'departments'
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            Departments
                                        </button>
                                        <button
                                            onClick={() => setActiveContentTab('subjects')}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeContentTab === 'subjects'
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            Subjects
                                        </button>
                                        <button
                                            onClick={() => setActiveContentTab('semesters')}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeContentTab === 'semesters'
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            Semesters
                                        </button>
                                    </nav>
                                </div>
                            </div>

                            {/* Departments Management */}
                            {activeContentTab === 'departments' && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Departments</h3>
                                        <button
                                            onClick={() => setShowAddDepartmentModal(true)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                        >
                                            <Plus size={16} />
                                            <span>Add Department</span>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {departments.map(dept => (
                                            <div key={dept.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{dept.name}</h4>
                                                        <p className="text-sm text-gray-500">Code: {dept.code}</p>
                                                        {dept.description && (
                                                            <p className="text-sm text-gray-600 mt-1">{dept.description}</p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteDepartment(dept.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Subjects Management */}
                            {activeContentTab === 'subjects' && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Subjects</h3>
                                        <button
                                            onClick={() => setShowAddSubjectModal(true)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                        >
                                            <Plus size={16} />
                                            <span>Add Subject</span>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {subjects.map(subject => (
                                            <div key={subject.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{subject.name}</h4>
                                                        <p className="text-sm text-gray-500">Code: {subject.code}</p>
                                                        {subject.description && (
                                                            <p className="text-sm text-gray-600 mt-1">{subject.description}</p>
                                                        )}
                                                        {subject.department_name && (
                                                            <p className="text-xs text-blue-600 mt-1">Dept: {subject.department_name}</p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteSubject(subject.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Semesters Management */}
                            {activeContentTab === 'semesters' && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Semesters</h3>
                                        <button
                                            onClick={() => setShowAddSemesterModal(true)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                        >
                                            <Plus size={16} />
                                            <span>Add Semester</span>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {semesters.map(semester => (
                                            <div key={semester.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{semester.name}</h4>
                                                        <p className="text-sm text-gray-500">Semester {semester.number}</p>
                                                        <p className={`text-xs mt-1 ${semester.is_active ? 'text-green-600' : 'text-red-600'
                                                            }`}>
                                                            {semester.is_active ? 'Active' : 'Inactive'}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteSemester(semester.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}                    {/* User Management Tab */}
                    {activeTab === 'users' && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                                <button
                                    onClick={openNewAdminModal}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                >
                                    <UserPlus size={16} />
                                    <span>Add Admin</span>
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {[...users, ...admins].map(user => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {user.status || 'active'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {user.role !== 'admin' && (
                                                        <div className="flex space-x-2">
                                                            {user.status !== 'banned' ? (
                                                                <button
                                                                    onClick={() => handleBanUser(user.id)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    Ban
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleUnbanUser(user.id)}
                                                                    className="text-green-600 hover:text-green-900"
                                                                >
                                                                    Unban
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Notes Management Tab */}
                    {activeTab === 'notes' && (
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Notes Management</h2>

                            <div className="space-y-6">
                                {/* Pending Notes */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Approval ({pendingNotes.length})</h3>
                                    <div className="space-y-4">
                                        {pendingNotes.map(note => (
                                            <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{note.title}</h4>
                                                        <p className="text-sm text-gray-500 mt-1">{note.description}</p>
                                                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                            <span>Subject: {note.subject}</span>
                                                            <span>Semester: {note.semester}</span>
                                                            <span>Uploaded: {new Date(note.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2 ml-4">
                                                        <button
                                                            onClick={() => handleApproveNote(note.id)}
                                                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectNote(note.id)}
                                                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteNote(note.id)}
                                                            className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Approved Notes */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Approved Notes ({approvedNotes.length})</h3>
                                    <div className="space-y-4">
                                        {approvedNotes.slice(0, 10).map(note => (
                                            <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{note.title}</h4>
                                                        <p className="text-sm text-gray-500 mt-1">{note.description}</p>
                                                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                            <span>Subject: {note.subject}</span>
                                                            <span>Semester: {note.semester}</span>
                                                            <span>Downloads: {note.download_count || 0}</span>
                                                            <span>Approved: {new Date(note.approved_at || note.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteNote(note.id)}
                                                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Activity Log Tab */}
                    {activeTab === 'activity' && (
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Activity Log</h2>

                            <div className="space-y-4">
                                {activityLog.map(activity => (
                                    <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-gray-900 capitalize">
                                                    {activity.action?.replace('_', ' ')}
                                                </h4>
                                                <p className="text-sm text-gray-500 mt-1">{activity.details}</p>
                                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                    <span>Target: {activity.target_type}</span>
                                                    <span>Time: {new Date(activity.created_at).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Add Department Modal */}
                {showAddDepartmentModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-dark-secondary rounded-lg p-6 w-full max-w-md border border-gray-200 dark:border-border-subtle transition-colors duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">Add Department</h3>
                                <button
                                    onClick={() => setShowAddDepartmentModal(false)}
                                    className="text-gray-400 dark:text-text-muted hover:text-gray-600 dark:hover:text-accent-blue"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
                                        Department Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newDepartment.name}
                                        onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                                        className="w-full p-3 border border-gray-300 dark:border-border-subtle rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue focus:border-transparent bg-white dark:bg-dark-elevated text-gray-900 dark:text-text-primary placeholder-gray-500 dark:placeholder-text-muted transition-colors duration-300"
                                        placeholder="Enter department name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
                                        Department Code *
                                    </label>
                                    <input
                                        type="text"
                                        value={newDepartment.code}
                                        onChange={(e) => setNewDepartment({ ...newDepartment, code: e.target.value })}
                                        className="w-full p-3 border border-gray-300 dark:border-border-subtle rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue focus:border-transparent bg-white dark:bg-dark-elevated text-gray-900 dark:text-text-primary placeholder-gray-500 dark:placeholder-text-muted transition-colors duration-300"
                                        placeholder="Enter department code"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={newDepartment.description}
                                        onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                                        className="w-full p-3 border border-gray-300 dark:border-border-subtle rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue focus:border-transparent bg-white dark:bg-dark-elevated text-gray-900 dark:text-text-primary placeholder-gray-500 dark:placeholder-text-muted transition-colors duration-300"
                                        placeholder="Enter department description"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowAddDepartmentModal(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-text-secondary bg-gray-100 dark:bg-dark-elevated hover:bg-gray-200 dark:hover:bg-glass-subtle rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddDepartment}
                                    className="px-4 py-2 bg-blue-600 dark:bg-accent-blue hover:bg-blue-700 dark:hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    Add Department
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Subject Modal */}
                {showAddSubjectModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-dark-secondary rounded-lg p-6 w-full max-w-md border border-gray-200 dark:border-border-subtle transition-colors duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">Add Subject</h3>
                                <button
                                    onClick={() => setShowAddSubjectModal(false)}
                                    className="text-gray-400 dark:text-text-muted hover:text-gray-600 dark:hover:text-accent-blue"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
                                        Subject Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newSubject.name}
                                        onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                                        className="w-full p-3 border border-gray-300 dark:border-border-subtle rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue focus:border-transparent bg-white dark:bg-dark-elevated text-gray-900 dark:text-text-primary placeholder-gray-500 dark:placeholder-text-muted transition-colors duration-300"
                                        placeholder="Enter subject name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
                                        Subject Code *
                                    </label>
                                    <input
                                        type="text"
                                        value={newSubject.code}
                                        onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                                        className="w-full p-3 border border-gray-300 dark:border-border-subtle rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue focus:border-transparent bg-white dark:bg-dark-elevated text-gray-900 dark:text-text-primary placeholder-gray-500 dark:placeholder-text-muted transition-colors duration-300"
                                        placeholder="Enter subject code"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
                                        Department
                                    </label>
                                    <select
                                        value={newSubject.department_id}
                                        onChange={(e) => setNewSubject({ ...newSubject, department_id: e.target.value })}
                                        className="w-full p-3 border border-gray-300 dark:border-border-subtle rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue focus:border-transparent bg-white dark:bg-dark-elevated text-gray-900 dark:text-text-primary transition-colors duration-300"
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={newSubject.description}
                                        onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                                        className="w-full p-3 border border-gray-300 dark:border-border-subtle rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue focus:border-transparent bg-white dark:bg-dark-elevated text-gray-900 dark:text-text-primary placeholder-gray-500 dark:placeholder-text-muted transition-colors duration-300"
                                        placeholder="Enter subject description"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowAddSubjectModal(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-text-secondary bg-gray-100 dark:bg-dark-elevated hover:bg-gray-200 dark:hover:bg-glass-subtle rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddSubject}
                                    className="px-4 py-2 bg-blue-600 dark:bg-accent-blue hover:bg-blue-700 dark:hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    Add Subject
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Semester Modal */}
                {showAddSemesterModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-dark-secondary rounded-lg p-6 w-full max-w-md border border-gray-200 dark:border-border-subtle transition-colors duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">Add Semester</h3>
                                <button
                                    onClick={() => setShowAddSemesterModal(false)}
                                    className="text-gray-400 dark:text-text-muted hover:text-gray-600 dark:hover:text-accent-blue"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
                                        Semester Number *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={newSemester.number}
                                        onChange={(e) => setNewSemester({ ...newSemester, number: parseInt(e.target.value) })}
                                        className="w-full p-3 border border-gray-300 dark:border-border-subtle rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue focus:border-transparent bg-white dark:bg-dark-elevated text-gray-900 dark:text-text-primary transition-colors duration-300"
                                        placeholder="Enter semester number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
                                        Semester Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newSemester.name}
                                        onChange={(e) => setNewSemester({ ...newSemester, name: e.target.value })}
                                        className="w-full p-3 border border-gray-300 dark:border-border-subtle rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-accent-blue focus:border-transparent bg-white dark:bg-dark-elevated text-gray-900 dark:text-text-primary placeholder-gray-500 dark:placeholder-text-muted transition-colors duration-300"
                                        placeholder="Enter semester name"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={newSemester.is_active}
                                            onChange={(e) => setNewSemester({ ...newSemester, is_active: e.target.checked })}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-text-secondary">Active Semester</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowAddSemesterModal(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-text-secondary bg-gray-100 dark:bg-dark-elevated hover:bg-gray-200 dark:hover:bg-glass-subtle rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddSemester}
                                    className="px-4 py-2 bg-blue-600 dark:bg-accent-blue hover:bg-blue-700 dark:hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    Add Semester
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* New Admin Modal */}
                {showNewAdminModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-dark-secondary rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-border-subtle transition-colors duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-text-primary">Create New Admin</h3>
                                <button
                                    onClick={closeNewAdminModal}
                                    className="text-gray-400 dark:text-text-muted hover:text-gray-600 dark:hover:text-accent-blue transition-colors"
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
