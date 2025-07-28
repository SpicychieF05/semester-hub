import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, supabase } from '../supabase';
import {
    Users, BookOpen, CheckCircle, XCircle,
    Trash2, Calendar, Download, AlertTriangle, LogOut,
    Ban, Shield, ShieldOff, UserPlus, X, Eye, EyeOff, RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [pendingNotes, setPendingNotes] = useState([]);
    const [approvedNotes, setApprovedNotes] = useState([]);
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [adminActions, setAdminActions] = useState([]);
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [stats, setStats] = useState({
        totalNotes: 0,
        pendingReview: 0,
        totalUsers: 0,
        totalDownloads: 0
    });
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(null);
    const [showBanModal, setShowBanModal] = useState(false);
    const [showNewAdminModal, setShowNewAdminModal] = useState(false);
    const [banReason, setBanReason] = useState('');
    const [selectedUserToBan, setSelectedUserToBan] = useState(null);
    const [newAdminData, setNewAdminData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin',
        permissions: ['manage_notes', 'manage_users'],
        showPassword: false
    });

    const fetchData = useCallback(async () => {
        try {
            console.log('AdminDashboard: Starting to fetch data...');
            setLoading(true);

            // Fetch real users from Supabase
            const { data: realUsers, error: usersError } = await supabase
                .from('users')
                .select('*')
                .eq('role', 'user')
                .order('created_at', { ascending: false });

            // Fetch real admins from Supabase
            const { data: realAdmins, error: adminsError } = await supabase
                .from('users')
                .select('*')
                .eq('role', 'admin')
                .order('created_at', { ascending: false });

            // Fetch real notes from Supabase
            const { data: realNotes, error: notesError } = await supabase
                .from('notes')
                .select('*')
                .order('created_at', { ascending: false });

            // Fetch admin actions for audit log
            const { data: realAdminActions, error: actionsError } = await supabase
                .from('admin_actions')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100); // Limit to last 100 actions

            if (usersError) console.error('Error fetching users:', usersError);
            if (adminsError) console.error('Error fetching admins:', adminsError);
            if (notesError) console.error('Error fetching notes:', notesError);
            if (actionsError) console.error('Error fetching admin actions:', actionsError);

            // Calculate notes shared by each user
            const userNotesCount = {};
            if (realNotes && realNotes.length > 0) {
                realNotes.forEach(note => {
                    const userId = note.uploader_id || note.user_id;
                    if (userId) {
                        userNotesCount[userId] = (userNotesCount[userId] || 0) + 1;
                    }
                });
            }

            // Process real data if available, otherwise use demo data
            const processedUsers = realUsers && realUsers.length > 0 ? realUsers.map(user => ({
                ...user,
                joinedDate: new Date(user.created_at),
                notesShared: userNotesCount[user.id] || 0,
                status: user.status || (user.banned ? 'banned' : 'active'),
                banned: user.banned || false,
                ban_reason: user.ban_reason,
                banned_at: user.banned_at ? new Date(user.banned_at) : null,
                banned_by: user.banned_by,
                lastActive: user.last_active ? new Date(user.last_active) : new Date(user.created_at),
                auth_provider: user.auth_provider || 'email',
                permissions: user.permissions ? (typeof user.permissions === 'string' ? JSON.parse(user.permissions) : user.permissions) : [],
                totalDownloads: 0 // Can be calculated from download logs if implemented
            })) : [
                // Demo data fallback
                {
                    id: '1',
                    name: 'Amit Kumar',
                    email: 'amit.kumar@student.edu',
                    joinedDate: new Date('2024-01-10'),
                    notesShared: 12,
                    status: 'active',
                    role: 'user',
                    auth_provider: 'email'
                },
                {
                    id: '2',
                    name: 'Sneha Patel',
                    email: 'sneha.patel@student.edu',
                    joinedDate: new Date('2024-01-08'),
                    notesShared: 8,
                    status: 'active',
                    role: 'user',
                    auth_provider: 'google'
                }
            ];

            const processedAdmins = realAdmins && realAdmins.length > 0 ? realAdmins.map(admin => ({
                ...admin,
                joinedDate: new Date(admin.created_at),
                status: admin.status || 'active',
                auth_provider: admin.auth_provider || 'email',
                permissions: admin.permissions ? (typeof admin.permissions === 'string' ? JSON.parse(admin.permissions) : admin.permissions) : ['manage_notes', 'manage_users']
            })) : [
                // Demo data fallback
                {
                    id: 'admin1',
                    name: 'Chirantan Mallick',
                    email: 'codiverse.dev@gmail.com',
                    joinedDate: new Date('2023-12-01'),
                    role: 'admin',
                    status: 'active',
                    permissions: ['all']
                }
            ];

            const processedNotes = realNotes || [];
            const pendingNotes = processedNotes.filter(note => note.status === 'pending');
            const approvedNotes = processedNotes.filter(note => note.status === 'approved');

            setUsers(processedUsers);
            setAdmins(processedAdmins);
            setPendingNotes(pendingNotes);
            setApprovedNotes(approvedNotes);
            setAdminActions(realAdminActions || []);

            // Calculate stats
            const totalDownloads = approvedNotes.reduce((sum, note) => sum + (note.download_count || 0), 0);
            setStats({
                totalNotes: approvedNotes.length,
                pendingReview: pendingNotes.length,
                totalUsers: processedUsers.length,
                totalDownloads
            });

        } catch (error) {
            console.error('Error loading data:', error);
            // Fallback to demo data on error
            setUsers([
                {
                    id: '1',
                    name: 'Demo User',
                    email: 'demo@example.com',
                    joinedDate: new Date(),
                    notesShared: 0,
                    status: 'active',
                    role: 'user',
                    auth_provider: 'email'
                }
            ]);
            setAdmins([
                {
                    id: 'admin1',
                    name: 'Demo Admin',
                    email: 'admin@example.com',
                    joinedDate: new Date(),
                    role: 'admin',
                    status: 'active',
                    permissions: ['manage_notes', 'manage_users']
                }
            ]);
            setStats({
                totalNotes: 0,
                pendingReview: 0,
                totalUsers: 1,
                totalDownloads: 0
            });
        } finally {
            console.log('AdminDashboard: Data fetching completed, setting loading to false');
            setLoading(false);
            setLastRefresh(new Date());
        }
    }, []);

    useEffect(() => {
        const checkAndFetch = async () => {
            try {
                // First check demo admin auth for backwards compatibility
                const isAdminAuthenticated = localStorage.getItem('demoAdminAuth') === 'true';

                if (isAdminAuthenticated) {
                    // Demo admin authentication - proceed directly to fetchData
                    console.log('Demo admin authenticated, loading dashboard');
                    const demoAdminEmail = localStorage.getItem('demoAdminEmail');
                    setCurrentAdmin({
                        name: 'Admin User',
                        email: demoAdminEmail || 'codiverse.dev@gmail.com'
                    });
                    fetchData();
                    return;
                }

                // Check if user is authenticated through Supabase
                const user = await auth.getCurrentUser();
                if (!user) {
                    navigate('/admin-login');
                    return;
                }

                // Check if user has admin role
                const { data: userProfile, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error || !userProfile || userProfile.role !== 'admin') {
                    navigate('/admin-login');
                    return;
                }

                // Set current admin from database
                setCurrentAdmin({
                    name: userProfile.name,
                    email: userProfile.email
                });

                fetchData();
            } catch (error) {
                console.error('Auth check error:', error);
                navigate('/admin-login');
            }
        };

        checkAndFetch();

        // Set up auto-refresh every 30 seconds to catch new users and updates
        const refreshInterval = setInterval(() => {
            // Only refresh if we have an admin authenticated
            const isAdminAuth = localStorage.getItem('demoAdminAuth') === 'true';
            if (isAdminAuth) {
                fetchData();
            }
        }, 30000);

        // Cleanup interval on unmount
        return () => clearInterval(refreshInterval);
    }, [navigate, fetchData]);

    const handleApproveNote = async (noteId) => {
        try {
            // Get current admin info
            const currentAdminEmail = localStorage.getItem('demoAdminEmail') || 'admin@semesterhub.com';
            const { data: adminData } = await supabase
                .from('users')
                .select('id, name')
                .eq('email', currentAdminEmail)
                .single();

            const adminId = adminData?.id;

            // Get note info for logging
            const { data: noteData } = await supabase
                .from('notes')
                .select('title, uploader_name, uploader_email')
                .eq('id', noteId)
                .single();

            // Update note status in Supabase
            const { error } = await supabase
                .from('notes')
                .update({
                    status: 'approved',
                    updated_at: new Date().toISOString()
                })
                .eq('id', noteId);

            if (error) {
                console.error('Error approving note:', error);
                alert('Error approving note');
                return;
            }

            // Log admin action
            if (adminId) {
                await supabase.rpc('log_admin_action', {
                    p_admin_id: adminId,
                    p_action_type: 'approve_note',
                    p_target_type: 'note',
                    p_target_id: noteId,
                    p_target_name: noteData?.title || 'Unknown Note',
                    p_details: {
                        previous_status: 'pending',
                        new_status: 'approved',
                        uploader_name: noteData?.uploader_name,
                        uploader_email: noteData?.uploader_email
                    },
                    p_reason: 'Note approved by admin'
                });
            }

            // Move note from pending to approved in local state
            const note = pendingNotes.find(n => n.id === noteId);
            if (note) {
                setPendingNotes(prev => prev.filter(n => n.id !== noteId));
                setApprovedNotes(prev => [{ ...note, status: 'approved', download_count: 0 }, ...prev]);
                setStats(prev => ({
                    ...prev,
                    totalNotes: prev.totalNotes + 1,
                    pendingReview: prev.pendingReview - 1
                }));
                alert('Note approved successfully!');
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
            // Get current admin info
            const currentAdminEmail = localStorage.getItem('demoAdminEmail') || 'admin@semesterhub.com';
            const { data: adminData } = await supabase
                .from('users')
                .select('id, name')
                .eq('email', currentAdminEmail)
                .single();

            const adminId = adminData?.id;

            // Get note info for logging
            const { data: noteData } = await supabase
                .from('notes')
                .select('title, uploader_name, uploader_email')
                .eq('id', noteId)
                .single();

            // Update note status in Supabase
            const { error } = await supabase
                .from('notes')
                .update({
                    status: 'rejected',
                    updated_at: new Date().toISOString()
                })
                .eq('id', noteId);

            if (error) {
                console.error('Error rejecting note:', error);
                alert('Error rejecting note');
                return;
            }

            // Log admin action
            if (adminId) {
                await supabase.rpc('log_admin_action', {
                    p_admin_id: adminId,
                    p_action_type: 'reject_note',
                    p_target_type: 'note',
                    p_target_id: noteId,
                    p_target_name: noteData?.title || 'Unknown Note',
                    p_details: {
                        previous_status: 'pending',
                        new_status: 'rejected',
                        uploader_name: noteData?.uploader_name,
                        uploader_email: noteData?.uploader_email
                    },
                    p_reason: 'Note rejected by admin'
                });
            }

            // Remove from pending notes
            setPendingNotes(prev => prev.filter(n => n.id !== noteId));
            setStats(prev => ({
                ...prev,
                pendingReview: prev.pendingReview - 1
            }));
            alert('Note rejected successfully!');
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
            // Get current admin info
            const currentAdminEmail = localStorage.getItem('demoAdminEmail') || 'admin@semesterhub.com';
            const { data: adminData } = await supabase
                .from('users')
                .select('id, name')
                .eq('email', currentAdminEmail)
                .single();

            const adminId = adminData?.id;

            // Get note info for logging before deletion
            const { data: noteData } = await supabase
                .from('notes')
                .select('title, uploader_name, uploader_email, status')
                .eq('id', noteId)
                .single();

            // Delete note from Supabase
            const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id', noteId);

            if (error) {
                console.error('Error deleting note:', error);
                alert('Error deleting note');
                return;
            }

            // Log admin action
            if (adminId) {
                await supabase.rpc('log_admin_action', {
                    p_admin_id: adminId,
                    p_action_type: 'delete_note',
                    p_target_type: 'note',
                    p_target_id: noteId,
                    p_target_name: noteData?.title || 'Unknown Note',
                    p_details: {
                        previous_status: noteData?.status,
                        uploader_name: noteData?.uploader_name,
                        uploader_email: noteData?.uploader_email,
                        action: 'permanent_deletion'
                    },
                    p_reason: 'Note deleted by admin'
                });
            }

            // Remove from approved notes
            setApprovedNotes(prev => prev.filter(n => n.id !== noteId));
            setStats(prev => ({
                ...prev,
                totalNotes: prev.totalNotes - 1
            }));
            alert('Note deleted successfully!');
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Error deleting note');
        }
    };

    const handleLogout = async () => {
        try {
            // Sign out from Supabase
            await auth.signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }

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
    const handleBanUser = async (userId, reason = 'No reason provided') => {
        if (!window.confirm('Are you sure you want to ban this user? They will lose access to the platform.')) {
            return;
        }

        try {
            // Get current admin info
            const currentAdminEmail = localStorage.getItem('demoAdminEmail') || 'admin@semesterhub.com';
            const { data: adminData } = await supabase
                .from('users')
                .select('id, name')
                .eq('email', currentAdminEmail)
                .single();

            const adminId = adminData?.id;

            // Get user info for logging
            const { data: userData } = await supabase
                .from('users')
                .select('name, email')
                .eq('id', userId)
                .single();

            // Update user status in Supabase with ban details
            const { error } = await supabase
                .from('users')
                .update({
                    status: 'banned',
                    banned: true,
                    ban_reason: reason,
                    banned_at: new Date().toISOString(),
                    banned_by: adminId,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) {
                console.error('Error banning user:', error);
                alert('Error banning user');
                return;
            }

            // Log admin action
            if (adminId) {
                await supabase.rpc('log_admin_action', {
                    p_admin_id: adminId,
                    p_action_type: 'ban_user',
                    p_target_type: 'user',
                    p_target_id: userId,
                    p_target_name: userData?.name || 'Unknown User',
                    p_details: {
                        previous_status: 'active',
                        new_status: 'banned',
                        user_email: userData?.email
                    },
                    p_reason: reason
                });
            }

            // Update local state
            setUsers(prev => prev.map(user =>
                user.id === userId ? {
                    ...user,
                    status: 'banned',
                    banned: true,
                    ban_reason: reason,
                    banned_at: new Date(),
                    banned_by: adminId
                } : user
            ));

            alert('User has been banned successfully.');

            // Refresh data to ensure consistency
            fetchData();
        } catch (error) {
            console.error('Error banning user:', error);
            alert('Error banning user');
        }
    };

    const handleUnbanUser = async (userId) => {
        try {
            // Get current admin info
            const currentAdminEmail = localStorage.getItem('demoAdminEmail') || 'admin@semesterhub.com';
            const { data: adminData } = await supabase
                .from('users')
                .select('id, name')
                .eq('email', currentAdminEmail)
                .single();

            const adminId = adminData?.id;

            // Get user info for logging
            const { data: userData } = await supabase
                .from('users')
                .select('name, email, ban_reason')
                .eq('id', userId)
                .single();

            // Update user status in Supabase - clear ban details
            const { error } = await supabase
                .from('users')
                .update({
                    status: 'active',
                    banned: false,
                    ban_reason: null,
                    banned_at: null,
                    banned_by: null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) {
                console.error('Error unbanning user:', error);
                alert('Error unbanning user');
                return;
            }

            // Log admin action
            if (adminId) {
                await supabase.rpc('log_admin_action', {
                    p_admin_id: adminId,
                    p_action_type: 'unban_user',
                    p_target_type: 'user',
                    p_target_id: userId,
                    p_target_name: userData?.name || 'Unknown User',
                    p_details: {
                        previous_status: 'banned',
                        new_status: 'active',
                        previous_ban_reason: userData?.ban_reason,
                        user_email: userData?.email
                    },
                    p_reason: 'User unbanned by admin'
                });
            }

            // Update local state
            setUsers(prev => prev.map(user =>
                user.id === userId ? {
                    ...user,
                    status: 'active',
                    banned: false,
                    ban_reason: null,
                    banned_at: null,
                    banned_by: null
                } : user
            ));

            alert('User has been unbanned successfully.');

            // Refresh data to ensure consistency
            fetchData();
        } catch (error) {
            console.error('Error unbanning user:', error);
            alert('Error unbanning user');
        }
    };

    const handlePromoteToAdmin = async (userId) => {
        if (!window.confirm('Are you sure you want to promote this user to admin? They will gain administrative privileges.')) {
            return;
        }

        try {
            // Get current admin info
            const currentAdminEmail = localStorage.getItem('demoAdminEmail') || 'admin@semesterhub.com';
            const { data: adminData } = await supabase
                .from('users')
                .select('id, name')
                .eq('email', currentAdminEmail)
                .single();

            const adminId = adminData?.id;

            // Get user info for logging
            const { data: userData } = await supabase
                .from('users')
                .select('name, email')
                .eq('id', userId)
                .single();

            // Update user role in Supabase
            const { error } = await supabase
                .from('users')
                .update({
                    role: 'admin',
                    permissions: JSON.stringify(['manage_notes', 'manage_users']),
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) {
                console.error('Error promoting user:', error);
                alert('Error promoting user');
                return;
            }

            // Log admin action
            if (adminId) {
                await supabase.rpc('log_admin_action', {
                    p_admin_id: adminId,
                    p_action_type: 'promote_user',
                    p_target_type: 'user',
                    p_target_id: userId,
                    p_target_name: userData?.name || 'Unknown User',
                    p_details: {
                        previous_role: 'user',
                        new_role: 'admin',
                        permissions_granted: ['manage_notes', 'manage_users'],
                        user_email: userData?.email
                    },
                    p_reason: 'User promoted to admin by admin'
                });
            }

            // Update local state
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

                // Refresh data to ensure consistency
                fetchData();
            }
        } catch (error) {
            console.error('Error promoting user:', error);
            alert('Error promoting user');
        }
    };

    const handleDemoteAdmin = async (adminId) => {
        if (!window.confirm('Are you sure you want to demote this admin to regular user? They will lose administrative privileges.')) {
            return;
        }

        try {
            // Get current admin info
            const currentAdminEmail = localStorage.getItem('demoAdminEmail') || 'admin@semesterhub.com';
            const { data: adminData } = await supabase
                .from('users')
                .select('id, name')
                .eq('email', currentAdminEmail)
                .single();

            const currentAdminId = adminData?.id;

            // Get admin info for logging
            const { data: targetAdminData } = await supabase
                .from('users')
                .select('name, email, role, permissions')
                .eq('id', adminId)
                .single();

            // Update user role in Supabase
            const { error } = await supabase
                .from('users')
                .update({
                    role: 'user',
                    permissions: JSON.stringify([]),
                    updated_at: new Date().toISOString()
                })
                .eq('id', adminId);

            if (error) {
                console.error('Error demoting admin:', error);
                alert('Error demoting admin');
                return;
            }

            // Log admin action
            if (currentAdminId) {
                await supabase.rpc('log_admin_action', {
                    p_admin_id: currentAdminId,
                    p_action_type: 'demote_admin',
                    p_target_type: 'admin',
                    p_target_id: adminId,
                    p_target_name: targetAdminData?.name || 'Unknown Admin',
                    p_details: {
                        previous_role: 'admin',
                        new_role: 'user',
                        previous_permissions: targetAdminData?.permissions || [],
                        admin_email: targetAdminData?.email
                    },
                    p_reason: 'Admin demoted to user by admin'
                });
            }

            // Update local state
            const admin = admins.find(a => a.id === adminId);
            if (admin && admin.role !== 'super_admin') {
                // Add to users
                const newUser = {
                    ...admin,
                    role: 'user',
                    notesShared: 0,
                    status: 'active',
                    permissions: []
                };
                setUsers(prev => [...prev, newUser]);

                // Remove from admins
                setAdmins(prev => prev.filter(a => a.id !== adminId));

                alert('Admin has been demoted to user successfully.');

                // Refresh data to ensure consistency
                fetchData();
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

    const handleBanWithReason = async () => {
        if (!banReason.trim()) {
            alert('Please provide a reason for banning this user.');
            return;
        }

        try {
            if (selectedUserToBan) {
                // Get current admin info
                const currentAdminEmail = localStorage.getItem('demoAdminEmail') || 'admin@semesterhub.com';
                const { data: adminData } = await supabase
                    .from('users')
                    .select('id, name')
                    .eq('email', currentAdminEmail)
                    .single();

                const adminId = adminData?.id;

                // Check if it's a user or admin
                const isAdmin = admins.find(admin => admin.id === selectedUserToBan.id);

                if (isAdmin) {
                    if (isAdmin.role === 'super_admin') {
                        alert('Cannot ban super admin.');
                        return;
                    }

                    // Update admin to user with banned status in database
                    const { error } = await supabase
                        .from('users')
                        .update({
                            role: 'user',
                            status: 'banned',
                            banned: true,
                            ban_reason: banReason,
                            banned_at: new Date().toISOString(),
                            banned_by: adminId,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', selectedUserToBan.id);

                    if (error) {
                        console.error('Error banning admin:', error);
                        alert('Error banning admin');
                        return;
                    }

                    // Log admin action
                    if (adminId) {
                        await supabase.rpc('log_admin_action', {
                            p_admin_id: adminId,
                            p_action_type: 'ban_admin',
                            p_target_type: 'admin',
                            p_target_id: selectedUserToBan.id,
                            p_target_name: selectedUserToBan.name,
                            p_details: {
                                previous_role: 'admin',
                                new_role: 'user',
                                previous_status: 'active',
                                new_status: 'banned',
                                admin_email: selectedUserToBan.email
                            },
                            p_reason: banReason
                        });
                    }

                    // Ban admin (move to users with banned status)
                    const bannedUser = {
                        ...isAdmin,
                        role: 'user',
                        status: 'banned',
                        banned: true,
                        banReason: banReason,
                        bannedAt: new Date(),
                        banned_by: adminId,
                        notesShared: 0
                    };
                    setUsers(prev => [...prev, bannedUser]);
                    setAdmins(prev => prev.filter(a => a.id !== selectedUserToBan.id));
                } else {
                    // Ban regular user - use the updated handleBanUser function
                    await handleBanUser(selectedUserToBan.id, banReason);
                    closeBanModal();
                    return;
                }

                alert(`${selectedUserToBan.name} has been banned successfully.`);
                closeBanModal();

                // Refresh data to ensure consistency
                fetchData();
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

    const handleCreateNewAdmin = async () => {
        if (!newAdminData.name.trim() || !newAdminData.email.trim() || !newAdminData.password.trim()) {
            alert('Please fill in all required fields.');
            return;
        }

        // Check if email already exists in database
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('id')
            .eq('email', newAdminData.email)
            .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking existing user:', checkError);
            alert('Error checking if user exists. Please try again.');
            return;
        }

        if (existingUser) {
            alert('An account with this email already exists.');
            return;
        }

        try {
            console.log('Creating new admin account...');

            // Step 1: Create new admin account through Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: newAdminData.email,
                password: newAdminData.password,
                options: {
                    data: {
                        name: newAdminData.name,
                        role: 'admin'
                    },
                    emailRedirectTo: window.location.origin
                }
            });

            if (authError) {
                console.error('Error creating admin auth:', authError);
                alert('Error creating admin account: ' + authError.message);
                return;
            }

            if (!authData.user) {
                alert('Failed to create admin account. Please try again.');
                return;
            }

            console.log('Auth account created, creating profile...');

            // Step 2: Use the RLS function to create admin user safely
            const { data: functionResult, error: functionError } = await supabase.rpc('create_admin_user', {
                p_user_id: authData.user.id,
                p_email: newAdminData.email,
                p_name: newAdminData.name,
                p_role: 'admin'
            });

            if (functionError) {
                console.error('Error creating admin profile via function:', functionError);

                // Fallback: Try direct insert with current user context
                const { error: directInsertError } = await supabase
                    .from('users')
                    .insert({
                        id: authData.user.id,
                        email: newAdminData.email,
                        name: newAdminData.name,
                        role: 'admin',
                        status: 'active',
                        permissions: newAdminData.permissions,
                        auth_provider: 'email'
                    });

                if (directInsertError) {
                    console.error('Error with direct insert:', directInsertError);
                    alert('Error creating admin profile: ' + directInsertError.message);
                    return;
                }
            }

            console.log('Admin profile created successfully');

            // Add to local state
            const newAdmin = {
                id: authData.user.id,
                name: newAdminData.name,
                email: newAdminData.email,
                role: newAdminData.role,
                status: 'active',
                joinedDate: new Date(),
                created_at: new Date().toISOString(),
                permissions: newAdminData.permissions,
                auth_provider: 'email'
            };

            setAdmins(prev => [...prev, newAdmin]);
            alert(`New admin ${newAdminData.name} has been created successfully.`);
            closeNewAdminModal();

            // Refresh data to ensure consistency
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
                            <button
                                onClick={() => setActiveTab('audit')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'audit'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                                    }`}
                            >
                                Audit Log
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
                                                <span>{pendingNotes.length} notes pending review</span>
                                            </div>
                                            <div className="flex items-center space-x-3 text-sm">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span>{stats.totalDownloads} total downloads</span>
                                            </div>
                                            <div className="flex items-center space-x-3 text-sm">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                <span>{users.length} registered users</span>
                                            </div>
                                            <div className="flex items-center space-x-3 text-sm">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                                <span>
                                                    {users.filter(u => u.auth_provider === 'google').length} Google users, {' '}
                                                    {users.filter(u => u.auth_provider === 'email' || !u.auth_provider).length} Email users
                                                </span>
                                            </div>
                                        </div>

                                        {/* Latest Users Section */}
                                        <h4 className="font-medium text-secondary-900 mb-3 mt-6">Latest Users</h4>
                                        <div className="space-y-2">
                                            {users.slice(0, 5).map(user => (
                                                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="text-sm font-medium text-secondary-900">{user.name}</p>
                                                        <p className="text-xs text-secondary-600">{user.email}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-secondary-500">
                                                            {formatDate(user.joinedDate)}
                                                        </p>
                                                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${user.status === 'active'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {user.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            {users.length === 0 && (
                                                <p className="text-sm text-secondary-500 italic">No users registered yet</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-secondary-900 mb-3">Quick Actions</h4>
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => setActiveTab('notes')}
                                                className="w-full text-left px-3 py-2 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                                            >
                                                Review pending notes ({pendingNotes.length})
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('users')}
                                                className="w-full text-left px-3 py-2 text-sm bg-secondary-50 text-secondary-700 rounded-lg hover:bg-secondary-100 transition-colors"
                                            >
                                                Manage users ({users.length})
                                            </button>
                                            <button
                                                onClick={fetchData}
                                                className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                                            >
                                                Refresh dashboard data
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
                                                            : user.status === 'banned'
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {user.status}
                                                        </span>
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar size={16} />
                                                            <span>Joined: {formatDate(user.joinedDate)}</span>
                                                        </div>
                                                        {user.lastActive && (
                                                            <div className="flex items-center space-x-1">
                                                                <span>Last Active: {formatDate(user.lastActive)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-secondary-500">
                                                        Notes Shared: {user.notesShared} • Role: {user.role}
                                                        {user.totalDownloads > 0 && ` • Downloads: ${user.totalDownloads}`}
                                                        {user.auth_provider && (
                                                            <span className="ml-2">
                                                                • Auth:
                                                                <span className={`ml-1 px-2 py-1 rounded-full text-xs ${user.auth_provider === 'google'
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : 'bg-gray-100 text-gray-700'
                                                                    }`}>
                                                                    {user.auth_provider === 'google' ? '🌐 Google' : '📧 Email'}
                                                                </span>
                                                            </span>
                                                        )}
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

                        {/* Audit Log Tab */}
                        {activeTab === 'audit' && (
                            <div>
                                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                                    Admin Activity Audit Log
                                </h3>
                                {adminActions.length === 0 ? (
                                    <div className="text-center py-8">
                                        <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
                                        <p className="text-secondary-600">No admin actions recorded</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {adminActions.map(action => (
                                            <div key={action.id} className="border border-secondary-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${action.action_type.includes('ban') ? 'bg-red-100 text-red-700' :
                                                                action.action_type.includes('approve') ? 'bg-green-100 text-green-700' :
                                                                    action.action_type.includes('reject') || action.action_type.includes('delete') ? 'bg-red-100 text-red-700' :
                                                                        action.action_type.includes('promote') ? 'bg-blue-100 text-blue-700' :
                                                                            action.action_type.includes('demote') ? 'bg-orange-100 text-orange-700' :
                                                                                'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                {action.action_type.replace('_', ' ').toUpperCase()}
                                                            </span>
                                                            <span className="text-sm text-secondary-500">
                                                                {formatDate(action.created_at)}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-lg font-semibold text-secondary-900 mb-1">
                                                            {action.admin_name || 'Unknown Admin'}
                                                        </h4>
                                                        <p className="text-secondary-600 mb-1">
                                                            {action.admin_email}
                                                        </p>
                                                        <p className="text-secondary-700 mb-2">
                                                            <strong>Target:</strong> {action.target_name || 'Unknown'} ({action.target_type})
                                                        </p>
                                                        {action.reason && (
                                                            <p className="text-secondary-700 mb-2">
                                                                <strong>Reason:</strong> {action.reason}
                                                            </p>
                                                        )}
                                                        {action.details && (
                                                            <details className="text-sm text-secondary-600">
                                                                <summary className="cursor-pointer hover:text-secondary-800">
                                                                    View Details
                                                                </summary>
                                                                <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                                                                    {JSON.stringify(action.details, null, 2)}
                                                                </pre>
                                                            </details>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
            </div >
        </div >
    );
};

export default AdminDashboard;
