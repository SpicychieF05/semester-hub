// Enhanced Supabase service for comprehensive data management
import { supabase } from '../supabase';

export class SupabaseService {
    // Note Management
    static async createNote(noteData) {
        try {
            const { data, error } = await supabase
                .from('notes')
                .insert([{
                    ...noteData,
                    status: 'pending',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;

            // Log the action
            await this.logAdminAction({
                action: 'note_created',
                target_type: 'note',
                target_id: data.id,
                details: `Note "${noteData.title}" created`
            });

            return { data, error: null };
        } catch (error) {
            console.error('Error creating note:', error);
            return { data: null, error };
        }
    }

    static async updateNote(noteId, updates) {
        try {
            const { data, error } = await supabase
                .from('notes')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', noteId)
                .select()
                .single();

            if (error) throw error;

            // Log the action
            await this.logAdminAction({
                action: 'note_updated',
                target_type: 'note',
                target_id: noteId,
                details: `Note updated: ${JSON.stringify(updates)}`
            });

            return { data, error: null };
        } catch (error) {
            console.error('Error updating note:', error);
            return { data: null, error };
        }
    }

    static async deleteNote(noteId) {
        try {
            const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id', noteId);

            if (error) throw error;

            // Log the action
            await this.logAdminAction({
                action: 'note_deleted',
                target_type: 'note',
                target_id: noteId,
                details: 'Note permanently deleted'
            });

            return { error: null };
        } catch (error) {
            console.error('Error deleting note:', error);
            return { error };
        }
    }

    static async approveNote(noteId, adminId) {
        try {
            const { data, error } = await supabase
                .from('notes')
                .update({
                    status: 'approved',
                    approved_at: new Date().toISOString(),
                    approved_by: adminId,
                    updated_at: new Date().toISOString()
                })
                .eq('id', noteId)
                .select()
                .single();

            if (error) throw error;

            // Log the action
            await this.logAdminAction({
                admin_id: adminId,
                action: 'note_approved',
                target_type: 'note',
                target_id: noteId,
                details: 'Note approved for public access'
            });

            return { data, error: null };
        } catch (error) {
            console.error('Error approving note:', error);
            return { data: null, error };
        }
    }

    static async rejectNote(noteId, adminId, reason) {
        try {
            const { data, error } = await supabase
                .from('notes')
                .update({
                    status: 'rejected',
                    rejection_reason: reason,
                    rejected_at: new Date().toISOString(),
                    rejected_by: adminId,
                    updated_at: new Date().toISOString()
                })
                .eq('id', noteId)
                .select()
                .single();

            if (error) throw error;

            // Log the action
            await this.logAdminAction({
                admin_id: adminId,
                action: 'note_rejected',
                target_type: 'note',
                target_id: noteId,
                details: `Note rejected: ${reason}`
            });

            return { data, error: null };
        } catch (error) {
            console.error('Error rejecting note:', error);
            return { data: null, error };
        }
    }

    // User Management
    static async updateUserStatus(userId, status, reason = null) {
        try {
            const updates = {
                status,
                updated_at: new Date().toISOString()
            };

            if (reason) {
                updates.ban_reason = reason;
                updates.banned_at = new Date().toISOString();
            }

            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;

            // Log the action
            await this.logAdminAction({
                action: status === 'banned' ? 'user_banned' : 'user_unbanned',
                target_type: 'user',
                target_id: userId,
                details: reason ? `User ${status}: ${reason}` : `User ${status}`
            });

            return { data, error: null };
        } catch (error) {
            console.error('Error updating user status:', error);
            return { data: null, error };
        }
    }

    static async createUser(userData) {
        try {
            const { data, error } = await supabase
                .from('users')
                .insert([{
                    ...userData,
                    status: 'active',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;

            // Log the action
            await this.logAdminAction({
                action: 'user_created',
                target_type: 'user',
                target_id: data.id,
                details: `User "${userData.name || userData.email}" created`
            });

            return { data, error: null };
        } catch (error) {
            console.error('Error creating user:', error);
            return { data: null, error };
        }
    }

    // Department Management
    static async createDepartment(departmentData) {
        try {
            const { data, error } = await supabase
                .from('departments')
                .insert([{
                    ...departmentData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;

            // Log the action
            await this.logAdminAction({
                action: 'department_created',
                target_type: 'department',
                target_id: data.id,
                details: `Department "${departmentData.name}" created`
            });

            return { data, error: null };
        } catch (error) {
            console.error('Error creating department:', error);
            return { data: null, error };
        }
    }

    static async updateDepartment(departmentId, updates) {
        try {
            const { data, error } = await supabase
                .from('departments')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', departmentId)
                .select()
                .single();

            if (error) throw error;

            // Log the action
            await this.logAdminAction({
                action: 'department_updated',
                target_type: 'department',
                target_id: departmentId,
                details: `Department updated: ${JSON.stringify(updates)}`
            });

            return { data, error: null };
        } catch (error) {
            console.error('Error updating department:', error);
            return { data: null, error };
        }
    }

    static async deleteDepartment(departmentId) {
        try {
            const { error } = await supabase
                .from('departments')
                .delete()
                .eq('id', departmentId);

            if (error) throw error;

            // Log the action
            await this.logAdminAction({
                action: 'department_deleted',
                target_type: 'department',
                target_id: departmentId,
                details: 'Department deleted'
            });

            return { error: null };
        } catch (error) {
            console.error('Error deleting department:', error);
            return { error };
        }
    }

    // Subject Management
    static async createSubject(subjectData) {
        try {
            const { data, error } = await supabase
                .from('subjects')
                .insert([{
                    ...subjectData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;

            // Log the action
            await this.logAdminAction({
                action: 'subject_created',
                target_type: 'subject',
                target_id: data.id,
                details: `Subject "${subjectData.name}" created`
            });

            return { data, error: null };
        } catch (error) {
            console.error('Error creating subject:', error);
            return { data: null, error };
        }
    }

    static async updateSubject(subjectId, updates) {
        try {
            const { data, error } = await supabase
                .from('subjects')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', subjectId)
                .select()
                .single();

            if (error) throw error;

            // Log the action
            await this.logAdminAction({
                action: 'subject_updated',
                target_type: 'subject',
                target_id: subjectId,
                details: `Subject updated: ${JSON.stringify(updates)}`
            });

            return { data, error: null };
        } catch (error) {
            console.error('Error updating subject:', error);
            return { data: null, error };
        }
    }

    static async deleteSubject(subjectId) {
        try {
            const { error } = await supabase
                .from('subjects')
                .delete()
                .eq('id', subjectId);

            if (error) throw error;

            // Log the action
            await this.logAdminAction({
                action: 'subject_deleted',
                target_type: 'subject',
                target_id: subjectId,
                details: 'Subject deleted'
            });

            return { error: null };
        } catch (error) {
            console.error('Error deleting subject:', error);
            return { error };
        }
    }

    // Semester Management
    static async createSemester(semesterData) {
        try {
            const { data, error } = await supabase
                .from('semesters')
                .insert([{
                    ...semesterData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;

            // Log the action
            await this.logAdminAction({
                action: 'semester_created',
                target_type: 'semester',
                target_id: data.id,
                details: `Semester "${semesterData.name}" created`
            });

            return { data, error: null };
        } catch (error) {
            console.error('Error creating semester:', error);
            return { data: null, error };
        }
    }

    static async updateSemester(semesterId, updates) {
        try {
            const { data, error } = await supabase
                .from('semesters')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', semesterId)
                .select()
                .single();

            if (error) throw error;

            // Log the action
            await this.logAdminAction({
                action: 'semester_updated',
                target_type: 'semester',
                target_id: semesterId,
                details: `Semester updated: ${JSON.stringify(updates)}`
            });

            return { data, error: null };
        } catch (error) {
            console.error('Error updating semester:', error);
            return { data: null, error };
        }
    }

    static async deleteSemester(semesterId) {
        try {
            const { error } = await supabase
                .from('semesters')
                .delete()
                .eq('id', semesterId);

            if (error) throw error;

            // Log the action
            await this.logAdminAction({
                action: 'semester_deleted',
                target_type: 'semester',
                target_id: semesterId,
                details: 'Semester deleted'
            });

            return { error: null };
        } catch (error) {
            console.error('Error deleting semester:', error);
            return { error };
        }
    }

    // File Management
    static async uploadFile(file, folder = 'notes-files') {
        try {
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = `${folder}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('notes-files')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('notes-files')
                .getPublicUrl(filePath);

            return {
                url: publicUrl,
                path: filePath,
                fileName: file.name,
                fileSize: file.size,
                error: null
            };
        } catch (error) {
            console.error('Error uploading file:', error);
            return { error };
        }
    }

    static async deleteFile(filePath) {
        try {
            const { error } = await supabase.storage
                .from('notes-files')
                .remove([filePath]);

            if (error) throw error;

            return { error: null };
        } catch (error) {
            console.error('Error deleting file:', error);
            return { error };
        }
    }

    // Analytics and Statistics
    static async getStatistics() {
        try {
            const [
                { count: totalUsers },
                { count: totalNotes },
                { count: pendingNotes },
                { count: approvedNotes },
                { count: totalDepartments },
                { count: totalSubjects }
            ] = await Promise.all([
                supabase.from('users').select('*', { count: 'exact', head: true }),
                supabase.from('notes').select('*', { count: 'exact', head: true }),
                supabase.from('notes').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
                supabase.from('notes').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
                supabase.from('departments').select('*', { count: 'exact', head: true }),
                supabase.from('subjects').select('*', { count: 'exact', head: true })
            ]);

            return {
                totalUsers: totalUsers || 0,
                totalNotes: totalNotes || 0,
                pendingNotes: pendingNotes || 0,
                approvedNotes: approvedNotes || 0,
                totalDepartments: totalDepartments || 0,
                totalSubjects: totalSubjects || 0
            };
        } catch (error) {
            console.error('Error fetching statistics:', error);
            return {
                totalUsers: 0,
                totalNotes: 0,
                pendingNotes: 0,
                approvedNotes: 0,
                totalDepartments: 0,
                totalSubjects: 0
            };
        }
    }

    // Activity Logging
    static async logAdminAction(actionData) {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase
                .from('admin_actions')
                .insert([{
                    admin_id: actionData.admin_id || user?.id,
                    action: actionData.action,
                    target_type: actionData.target_type,
                    target_id: actionData.target_id,
                    details: actionData.details,
                    created_at: new Date().toISOString()
                }]);

            if (error) throw error;
        } catch (error) {
            console.error('Error logging admin action:', error);
        }
    }

    // Data Fetching
    static async getAllData() {
        try {
            const [
                usersResult,
                notesResult,
                departmentsResult,
                subjectsResult,
                semestersResult,
                activityResult
            ] = await Promise.allSettled([
                supabase.from('users').select('*').order('created_at', { ascending: false }),
                supabase.from('notes').select('*').order('created_at', { ascending: false }),
                supabase.from('departments').select('*').order('name'),
                supabase.from('subjects').select('*, departments(name)').order('name'),
                supabase.from('semesters').select('*').order('number'),
                supabase.from('admin_actions').select('*').order('created_at', { ascending: false }).limit(100)
            ]);

            return {
                users: usersResult.status === 'fulfilled' ? usersResult.value.data || [] : [],
                notes: notesResult.status === 'fulfilled' ? notesResult.value.data || [] : [],
                departments: departmentsResult.status === 'fulfilled' ? departmentsResult.value.data || [] : [],
                subjects: subjectsResult.status === 'fulfilled' ? subjectsResult.value.data || [] : [],
                semesters: semestersResult.status === 'fulfilled' ? semestersResult.value.data || [] : [],
                activity: activityResult.status === 'fulfilled' ? activityResult.value.data || [] : []
            };
        } catch (error) {
            console.error('Error fetching all data:', error);
            return {
                users: [],
                notes: [],
                departments: [],
                subjects: [],
                semesters: [],
                activity: []
            };
        }
    }

    // Real-time subscriptions
    static subscribeToNotes(callback) {
        return supabase
            .channel('notes_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, callback)
            .subscribe();
    }

    static subscribeToUsers(callback) {
        return supabase
            .channel('users_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, callback)
            .subscribe();
    }

    static subscribeToActivity(callback) {
        return supabase
            .channel('activity_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_actions' }, callback)
            .subscribe();
    }
}

export default SupabaseService;
