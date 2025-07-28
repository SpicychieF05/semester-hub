// React Supabase API Examples for Semester Hub Admin System
// This file demonstrates how to use the enhanced RLS policies and functions

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

// ==============================================
// EXAMPLE 1: Admin Creation with Error Handling
// ==============================================

const AdminCreationExample = () => {
    const [adminData, setAdminData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin',
        permissions: ['manage_notes', 'manage_users']
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const createNewAdmin = async () => {
        setLoading(true);
        setMessage('');

        try {
            // Step 1: Validate data
            if (!adminData.name || !adminData.email || !adminData.password) {
                throw new Error('All fields are required');
            }

            // Step 2: Check if user already exists
            const { data: existingUser, error: checkError } = await supabase
                .from('users')
                .select('id')
                .eq('email', adminData.email)
                .maybeSingle();

            if (checkError && checkError.code !== 'PGRST116') {
                throw new Error('Error checking existing user');
            }

            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            // Step 3: Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: adminData.email,
                password: adminData.password,
                options: {
                    data: {
                        name: adminData.name,
                        role: adminData.role
                    }
                }
            });

            if (authError) throw authError;

            // Step 4: Use RLS function to create admin profile
            const { error: profileError } = await supabase.rpc('create_admin_user', {
                p_user_id: authData.user.id,
                p_email: adminData.email,
                p_name: adminData.name,
                p_role: adminData.role
            });

            if (profileError) {
                // Fallback to direct insert
                const { error: directError } = await supabase
                    .from('users')
                    .insert({
                        id: authData.user.id,
                        email: adminData.email,
                        name: adminData.name,
                        role: adminData.role,
                        status: 'active',
                        permissions: adminData.permissions,
                        auth_provider: 'email'
                    });

                if (directError) throw directError;
            }

            setMessage('Admin created successfully!');
            setAdminData({ name: '', email: '', password: '', role: 'admin', permissions: ['manage_notes', 'manage_users'] });

        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Create New Admin</h3>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Admin Name"
                    value={adminData.name}
                    onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                    className="w-full p-2 border rounded"
                />

                <input
                    type="email"
                    placeholder="Admin Email"
                    value={adminData.email}
                    onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                    className="w-full p-2 border rounded"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={adminData.password}
                    onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                    className="w-full p-2 border rounded"
                />

                <select
                    value={adminData.role}
                    onChange={(e) => setAdminData({ ...adminData, role: e.target.value })}
                    className="w-full p-2 border rounded"
                >
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                </select>

                <button
                    onClick={createNewAdmin}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Admin'}
                </button>

                {message && (
                    <div className={`p-2 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

// ==============================================
// EXAMPLE 2: User Management with RLS Functions
// ==============================================

const UserManagementExample = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch all users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('role', 'user')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            setMessage(`Error fetching users: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Ban user using RLS function
    const banUser = async (userId, reason) => {
        try {
            const { error } = await supabase.rpc('ban_user', {
                p_user_id: userId,
                p_reason: reason
            });

            if (error) throw error;

            setMessage('User banned successfully');
            fetchUsers(); // Refresh the list
        } catch (error) {
            setMessage(`Error banning user: ${error.message}`);
        }
    };

    // Unban user using RLS function
    const unbanUser = async (userId) => {
        try {
            const { error } = await supabase.rpc('unban_user', {
                p_user_id: userId
            });

            if (error) throw error;

            setMessage('User unbanned successfully');
            fetchUsers(); // Refresh the list
        } catch (error) {
            setMessage(`Error unbanning user: ${error.message}`);
        }
    };

    // Promote user to admin
    const promoteToAdmin = async (userId) => {
        try {
            const { error } = await supabase.rpc('promote_user_to_admin', {
                p_user_id: userId,
                p_permissions: ['manage_notes', 'manage_users']
            });

            if (error) throw error;

            setMessage('User promoted to admin successfully');
            fetchUsers(); // Refresh the list
        } catch (error) {
            setMessage(`Error promoting user: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">User Management</h3>

            <button
                onClick={fetchUsers}
                disabled={loading}
                className="mb-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {loading ? 'Loading...' : 'Refresh Users'}
            </button>

            {message && (
                <div className={`mb-4 p-2 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            <div className="space-y-2">
                {users.map(user => (
                    <div key={user.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                            <span className={`inline-block px-2 py-1 text-xs rounded ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {user.status}
                            </span>
                        </div>

                        <div className="space-x-2">
                            {user.status === 'active' ? (
                                <>
                                    <button
                                        onClick={() => banUser(user.id, 'Violation of terms')}
                                        className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Ban
                                    </button>
                                    <button
                                        onClick={() => promoteToAdmin(user.id)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Make Admin
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => unbanUser(user.id)}
                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                                >
                                    Unban
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==============================================
// EXAMPLE 3: Content Management (Notes/Semesters/Subjects)
// ==============================================

const ContentManagementExample = () => {
    const [semesters, setSemesters] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [newSemester, setNewSemester] = useState({ name: '', code: '', description: '' });
    const [newSubject, setNewSubject] = useState({ name: '', code: '', description: '', semester_id: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch semesters
    const fetchSemesters = async () => {
        try {
            const { data, error } = await supabase
                .from('semesters')
                .select('*')
                .eq('is_active', true)
                .order('name');

            if (error) throw error;
            setSemesters(data || []);
        } catch (error) {
            setMessage(`Error fetching semesters: ${error.message}`);
        }
    };

    // Fetch subjects
    const fetchSubjects = async () => {
        try {
            const { data, error } = await supabase
                .from('subjects')
                .select('*, semesters(name)')
                .eq('is_active', true)
                .order('name');

            if (error) throw error;
            setSubjects(data || []);
        } catch (error) {
            setMessage(`Error fetching subjects: ${error.message}`);
        }
    };

    // Add new semester
    const addSemester = async () => {
        if (!newSemester.name || !newSemester.code) {
            setMessage('Name and code are required');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('semesters')
                .insert({
                    name: newSemester.name,
                    code: newSemester.code,
                    description: newSemester.description,
                    is_active: true
                });

            if (error) throw error;

            setMessage('Semester added successfully');
            setNewSemester({ name: '', code: '', description: '' });
            fetchSemesters();
        } catch (error) {
            setMessage(`Error adding semester: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Add new subject
    const addSubject = async () => {
        if (!newSubject.name || !newSubject.code || !newSubject.semester_id) {
            setMessage('Name, code, and semester are required');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('subjects')
                .insert({
                    name: newSubject.name,
                    code: newSubject.code,
                    description: newSubject.description,
                    semester_id: newSubject.semester_id,
                    is_active: true
                });

            if (error) throw error;

            setMessage('Subject added successfully');
            setNewSubject({ name: '', code: '', description: '', semester_id: '' });
            fetchSubjects();
        } catch (error) {
            setMessage(`Error adding subject: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSemesters();
        fetchSubjects();
    }, []);

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Content Management</h3>

            {message && (
                <div className={`mb-4 p-2 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            {/* Add Semester */}
            <div className="mb-6">
                <h4 className="font-medium mb-2">Add New Semester</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                    <input
                        type="text"
                        placeholder="Semester Name"
                        value={newSemester.name}
                        onChange={(e) => setNewSemester({ ...newSemester, name: e.target.value })}
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Code (e.g., SEM1)"
                        value={newSemester.code}
                        onChange={(e) => setNewSemester({ ...newSemester, code: e.target.value })}
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newSemester.description}
                        onChange={(e) => setNewSemester({ ...newSemester, description: e.target.value })}
                        className="p-2 border rounded"
                    />
                </div>
                <button
                    onClick={addSemester}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Add Semester
                </button>
            </div>

            {/* Add Subject */}
            <div className="mb-6">
                <h4 className="font-medium mb-2">Add New Subject</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                    <input
                        type="text"
                        placeholder="Subject Name"
                        value={newSubject.name}
                        onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Code (e.g., CS101)"
                        value={newSubject.code}
                        onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                        className="p-2 border rounded"
                    />
                    <select
                        value={newSubject.semester_id}
                        onChange={(e) => setNewSubject({ ...newSubject, semester_id: e.target.value })}
                        className="p-2 border rounded"
                    >
                        <option value="">Select Semester</option>
                        {semesters.map(semester => (
                            <option key={semester.id} value={semester.id}>
                                {semester.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Description"
                        value={newSubject.description}
                        onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                        className="p-2 border rounded"
                    />
                </div>
                <button
                    onClick={addSubject}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Add Subject
                </button>
            </div>

            {/* Display Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-medium mb-2">Semesters ({semesters.length})</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                        {semesters.map(semester => (
                            <div key={semester.id} className="p-2 bg-gray-50 rounded">
                                <div className="font-medium">{semester.name}</div>
                                <div className="text-sm text-gray-600">{semester.code}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-medium mb-2">Subjects ({subjects.length})</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                        {subjects.map(subject => (
                            <div key={subject.id} className="p-2 bg-gray-50 rounded">
                                <div className="font-medium">{subject.name}</div>
                                <div className="text-sm text-gray-600">
                                    {subject.code} - {subject.semesters?.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==============================================
// EXAMPLE 4: Real-time Data Updates
// ==============================================

const RealTimeExample = () => {
    const [users, setUsers] = useState([]);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        // Initial data fetch
        const fetchInitialData = async () => {
            const [usersResult, notesResult] = await Promise.all([
                supabase.from('users').select('*').order('created_at', { ascending: false }),
                supabase.from('notes').select('*').order('created_at', { ascending: false })
            ]);

            if (usersResult.data) setUsers(usersResult.data);
            if (notesResult.data) setNotes(notesResult.data);
        };

        fetchInitialData();

        // Set up real-time subscriptions
        const usersSubscription = supabase
            .channel('users_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
                console.log('Users change:', payload);
                fetchInitialData(); // Re-fetch data on changes
            })
            .subscribe();

        const notesSubscription = supabase
            .channel('notes_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, (payload) => {
                console.log('Notes change:', payload);
                fetchInitialData(); // Re-fetch data on changes
            })
            .subscribe();

        return () => {
            usersSubscription.unsubscribe();
            notesSubscription.unsubscribe();
        };
    }, []);

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Real-time Data Updates</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-medium mb-2">Users ({users.length})</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                        {users.slice(0, 5).map(user => (
                            <div key={user.id} className="p-2 bg-gray-50 rounded text-sm">
                                <div className="font-medium">{user.name}</div>
                                <div className="text-gray-600">{user.status}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-medium mb-2">Notes ({notes.length})</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                        {notes.slice(0, 5).map(note => (
                            <div key={note.id} className="p-2 bg-gray-50 rounded text-sm">
                                <div className="font-medium">{note.title}</div>
                                <div className="text-gray-600">{note.status}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==============================================
// MAIN COMPONENT COMBINING ALL EXAMPLES
// ==============================================

const AdminExamples = () => {
    const [activeTab, setActiveTab] = useState('admin-creation');

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Semester Hub Admin System Examples</h1>

            {/* Tab Navigation */}
            <div className="mb-6 border-b">
                <nav className="-mb-px flex space-x-8">
                    {[
                        { id: 'admin-creation', label: 'Admin Creation' },
                        { id: 'user-management', label: 'User Management' },
                        { id: 'content-management', label: 'Content Management' },
                        { id: 'real-time', label: 'Real-time Updates' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'admin-creation' && <AdminCreationExample />}
                {activeTab === 'user-management' && <UserManagementExample />}
                {activeTab === 'content-management' && <ContentManagementExample />}
                {activeTab === 'real-time' && <RealTimeExample />}
            </div>
        </div>
    );
};

export default AdminExamples;
