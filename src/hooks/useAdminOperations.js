// Enhanced Admin Operations Hook for Semester Hub
// This hook provides improved admin functions using the new RLS policies

import { useState, useCallback } from 'react';
import { supabase } from '../supabase';

export const useAdminOperations = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Clear error state
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Enhanced admin creation with better error handling
    const createAdmin = useCallback(async (adminData) => {
        setLoading(true);
        setError(null);

        try {
            console.log('Creating admin with data:', adminData);

            // Step 1: Validate input
            if (!adminData.email || !adminData.name || !adminData.password) {
                throw new Error('Name, email, and password are required');
            }

            // Step 2: Check if user already exists
            const { data: existingUser, error: checkError } = await supabase
                .from('users')
                .select('id, email')
                .eq('email', adminData.email)
                .maybeSingle();

            if (checkError && checkError.code !== 'PGRST116') {
                throw new Error(`Error checking existing user: ${checkError.message}`);
            }

            if (existingUser) {
                throw new Error('A user with this email already exists');
            }

            // Step 3: Create Supabase Auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: adminData.email,
                password: adminData.password,
                options: {
                    data: {
                        name: adminData.name,
                        role: adminData.role || 'admin'
                    },
                    emailRedirectTo: window.location.origin
                }
            });

            if (authError) {
                throw new Error(`Auth creation failed: ${authError.message}`);
            }

            if (!authData.user) {
                throw new Error('Failed to create auth user');
            }

            console.log('Auth user created:', authData.user.id);

            // Step 4: Try using the RLS function first
            try {
                const { data: functionResult, error: functionError } = await supabase.rpc('create_admin_user', {
                    p_user_id: authData.user.id,
                    p_email: adminData.email,
                    p_name: adminData.name,
                    p_role: adminData.role || 'admin'
                });

                if (functionError) {
                    console.warn('RLS function failed, trying direct insert:', functionError);
                    throw functionError;
                }

                console.log('Admin created via RLS function:', functionResult);
                return {
                    success: true,
                    data: {
                        id: authData.user.id,
                        email: adminData.email,
                        name: adminData.name,
                        role: adminData.role || 'admin',
                        status: 'active'
                    }
                };

            } catch (functionError) {
                // Fallback: Direct insert
                console.log('Attempting direct insert as fallback...');

                const { error: directInsertError } = await supabase
                    .from('users')
                    .insert({
                        id: authData.user.id,
                        email: adminData.email,
                        name: adminData.name,
                        role: adminData.role || 'admin',
                        status: 'active',
                        permissions: adminData.permissions || ['manage_notes', 'manage_users'],
                        auth_provider: 'email',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });

                if (directInsertError) {
                    throw new Error(`Profile creation failed: ${directInsertError.message}`);
                }

                console.log('Admin created via direct insert');
                return {
                    success: true,
                    data: {
                        id: authData.user.id,
                        email: adminData.email,
                        name: adminData.name,
                        role: adminData.role || 'admin',
                        status: 'active'
                    }
                };
            }

        } catch (err) {
            console.error('Admin creation error:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Enhanced user banning with RLS function
    const banUser = useCallback(async (userId, reason) => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.rpc('ban_user', {
                p_user_id: userId,
                p_reason: reason
            });

            if (error) {
                throw new Error(`Ban failed: ${error.message}`);
            }

            return { success: true };
        } catch (err) {
            console.error('Ban user error:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Enhanced user unbanning with RLS function
    const unbanUser = useCallback(async (userId) => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.rpc('unban_user', {
                p_user_id: userId
            });

            if (error) {
                throw new Error(`Unban failed: ${error.message}`);
            }

            return { success: true };
        } catch (err) {
            console.error('Unban user error:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Enhanced user promotion with RLS function
    const promoteToAdmin = useCallback(async (userId, permissions = ['manage_notes', 'manage_users']) => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.rpc('promote_user_to_admin', {
                p_user_id: userId,
                p_permissions: permissions
            });

            if (error) {
                throw new Error(`Promotion failed: ${error.message}`);
            }

            return { success: true };
        } catch (err) {
            console.error('Promote user error:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Enhanced data fetching with better error handling
    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [usersResult, adminsResult, notesResult, actionsResult] = await Promise.allSettled([
                supabase.from('users').select('*').eq('role', 'user').order('created_at', { ascending: false }),
                supabase.from('users').select('*').eq('role', 'admin').order('created_at', { ascending: false }),
                supabase.from('notes').select('*').order('created_at', { ascending: false }),
                supabase.from('admin_actions').select('*').order('created_at', { ascending: false }).limit(100)
            ]);

            const results = {
                users: usersResult.status === 'fulfilled' ? usersResult.value.data || [] : [],
                admins: adminsResult.status === 'fulfilled' ? adminsResult.value.data || [] : [],
                notes: notesResult.status === 'fulfilled' ? notesResult.value.data || [] : [],
                adminActions: actionsResult.status === 'fulfilled' ? actionsResult.value.data || [] : []
            };

            // Log any errors
            [usersResult, adminsResult, notesResult, actionsResult].forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.warn(`Data fetch error ${index}:`, result.reason);
                }
            });

            return { success: true, data: results };
        } catch (err) {
            console.error('Fetch data error:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Approve note
    const approveNote = useCallback(async (noteId) => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase
                .from('notes')
                .update({
                    status: 'approved',
                    approved_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', noteId);

            if (error) {
                throw new Error(`Note approval failed: ${error.message}`);
            }

            return { success: true };
        } catch (err) {
            console.error('Approve note error:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Reject note
    const rejectNote = useCallback(async (noteId, reason = 'Does not meet quality standards') => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase
                .from('notes')
                .update({
                    status: 'rejected',
                    rejection_reason: reason,
                    updated_at: new Date().toISOString()
                })
                .eq('id', noteId);

            if (error) {
                throw new Error(`Note rejection failed: ${error.message}`);
            }

            return { success: true };
        } catch (err) {
            console.error('Reject note error:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete note
    const deleteNote = useCallback(async (noteId) => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id', noteId);

            if (error) {
                throw new Error(`Note deletion failed: ${error.message}`);
            }

            return { success: true };
        } catch (err) {
            console.error('Delete note error:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        clearError,
        createAdmin,
        banUser,
        unbanUser,
        promoteToAdmin,
        fetchAllData,
        approveNote,
        rejectNote,
        deleteNote
    };
};
