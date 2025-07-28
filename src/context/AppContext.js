import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '../supabase';
import SupabaseService from '../services/supabaseService';

// Initial state
const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    notes: [],
    users: [],
    departments: [],
    subjects: [],
    semesters: [],
    activityLog: [],
    toasts: [], // Add toasts array
    statistics: {
        totalUsers: 0,
        totalNotes: 0,
        pendingNotes: 0,
        approvedNotes: 0,
        totalDepartments: 0,
        totalSubjects: 0
    },
    error: null
};

// Action types
const ActionTypes = {
    SET_LOADING: 'SET_LOADING',
    SET_USER: 'SET_USER',
    SET_ERROR: 'SET_ERROR',
    SET_NOTES: 'SET_NOTES',
    SET_USERS: 'SET_USERS',
    SET_DEPARTMENTS: 'SET_DEPARTMENTS',
    SET_SUBJECTS: 'SET_SUBJECTS',
    SET_SEMESTERS: 'SET_SEMESTERS',
    SET_ACTIVITY_LOG: 'SET_ACTIVITY_LOG',
    SET_STATISTICS: 'SET_STATISTICS',
    ADD_NOTE: 'ADD_NOTE',
    UPDATE_NOTE: 'UPDATE_NOTE',
    DELETE_NOTE: 'DELETE_NOTE',
    ADD_USER: 'ADD_USER',
    UPDATE_USER: 'UPDATE_USER',
    DELETE_USER: 'DELETE_USER',
    ADD_DEPARTMENT: 'ADD_DEPARTMENT',
    UPDATE_DEPARTMENT: 'UPDATE_DEPARTMENT',
    DELETE_DEPARTMENT: 'DELETE_DEPARTMENT',
    ADD_SUBJECT: 'ADD_SUBJECT',
    UPDATE_SUBJECT: 'UPDATE_SUBJECT',
    DELETE_SUBJECT: 'DELETE_SUBJECT',
    ADD_SEMESTER: 'ADD_SEMESTER',
    UPDATE_SEMESTER: 'UPDATE_SEMESTER',
    DELETE_SEMESTER: 'DELETE_SEMESTER',
    ADD_ACTIVITY: 'ADD_ACTIVITY',
    ADD_TOAST: 'ADD_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST',
    CLEAR_TOASTS: 'CLEAR_TOASTS'
};

// Reducer
const appReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.SET_LOADING:
            return { ...state, loading: action.payload };

        case ActionTypes.SET_USER:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: !!action.payload,
                loading: false
            };

        case ActionTypes.SET_ERROR:
            return { ...state, error: action.payload, loading: false };

        case ActionTypes.SET_NOTES:
            return { ...state, notes: action.payload };

        case ActionTypes.SET_USERS:
            return { ...state, users: action.payload };

        case ActionTypes.SET_DEPARTMENTS:
            return { ...state, departments: action.payload };

        case ActionTypes.SET_SUBJECTS:
            return { ...state, subjects: action.payload };

        case ActionTypes.SET_SEMESTERS:
            return { ...state, semesters: action.payload };

        case ActionTypes.SET_ACTIVITY_LOG:
            return { ...state, activityLog: action.payload };

        case ActionTypes.SET_STATISTICS:
            return { ...state, statistics: action.payload };

        case ActionTypes.ADD_NOTE:
            return {
                ...state,
                notes: [action.payload, ...state.notes],
                statistics: {
                    ...state.statistics,
                    totalNotes: state.statistics.totalNotes + 1,
                    pendingNotes: action.payload.status === 'pending'
                        ? state.statistics.pendingNotes + 1
                        : state.statistics.pendingNotes
                }
            };

        case ActionTypes.UPDATE_NOTE:
            return {
                ...state,
                notes: state.notes.map(note =>
                    note.id === action.payload.id ? action.payload : note
                )
            };

        case ActionTypes.DELETE_NOTE:
            return {
                ...state,
                notes: state.notes.filter(note => note.id !== action.payload),
                statistics: {
                    ...state.statistics,
                    totalNotes: state.statistics.totalNotes - 1
                }
            };

        case ActionTypes.ADD_USER:
            return {
                ...state,
                users: [action.payload, ...state.users],
                statistics: {
                    ...state.statistics,
                    totalUsers: state.statistics.totalUsers + 1
                }
            };

        case ActionTypes.UPDATE_USER:
            return {
                ...state,
                users: state.users.map(user =>
                    user.id === action.payload.id ? action.payload : user
                )
            };

        case ActionTypes.DELETE_USER:
            return {
                ...state,
                users: state.users.filter(user => user.id !== action.payload),
                statistics: {
                    ...state.statistics,
                    totalUsers: state.statistics.totalUsers - 1
                }
            };

        case ActionTypes.ADD_DEPARTMENT:
            return {
                ...state,
                departments: [...state.departments, action.payload],
                statistics: {
                    ...state.statistics,
                    totalDepartments: state.statistics.totalDepartments + 1
                }
            };

        case ActionTypes.UPDATE_DEPARTMENT:
            return {
                ...state,
                departments: state.departments.map(dept =>
                    dept.id === action.payload.id ? action.payload : dept
                )
            };

        case ActionTypes.DELETE_DEPARTMENT:
            return {
                ...state,
                departments: state.departments.filter(dept => dept.id !== action.payload),
                statistics: {
                    ...state.statistics,
                    totalDepartments: state.statistics.totalDepartments - 1
                }
            };

        case ActionTypes.ADD_SUBJECT:
            return {
                ...state,
                subjects: [...state.subjects, action.payload],
                statistics: {
                    ...state.statistics,
                    totalSubjects: state.statistics.totalSubjects + 1
                }
            };

        case ActionTypes.UPDATE_SUBJECT:
            return {
                ...state,
                subjects: state.subjects.map(subject =>
                    subject.id === action.payload.id ? action.payload : subject
                )
            };

        case ActionTypes.DELETE_SUBJECT:
            return {
                ...state,
                subjects: state.subjects.filter(subject => subject.id !== action.payload),
                statistics: {
                    ...state.statistics,
                    totalSubjects: state.statistics.totalSubjects - 1
                }
            };

        case ActionTypes.ADD_SEMESTER:
            return {
                ...state,
                semesters: [...state.semesters, action.payload].sort((a, b) => a.number - b.number)
            };

        case ActionTypes.UPDATE_SEMESTER:
            return {
                ...state,
                semesters: state.semesters.map(semester =>
                    semester.id === action.payload.id ? action.payload : semester
                )
            };

        case ActionTypes.DELETE_SEMESTER:
            return {
                ...state,
                semesters: state.semesters.filter(semester => semester.id !== action.payload)
            };

        case ActionTypes.ADD_ACTIVITY:
            return {
                ...state,
                activityLog: [action.payload, ...state.activityLog]
            };

        case ActionTypes.ADD_TOAST:
            return {
                ...state,
                toasts: [...state.toasts, action.payload]
            };

        case ActionTypes.REMOVE_TOAST:
            return {
                ...state,
                toasts: state.toasts.filter(toast => toast.id !== action.payload)
            };

        case ActionTypes.CLEAR_TOASTS:
            return {
                ...state,
                toasts: []
            };

        default:
            return state;
    }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Auth management
    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (mounted) {
                    dispatch({ type: ActionTypes.SET_USER, payload: user });
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                if (mounted) {
                    dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
                }
            }
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (mounted) {
                    dispatch({ type: ActionTypes.SET_USER, payload: session?.user || null });
                }
            }
        );

        return () => {
            mounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                dispatch({ type: ActionTypes.SET_LOADING, payload: true });

                const [allData, statistics] = await Promise.all([
                    SupabaseService.getAllData(),
                    SupabaseService.getStatistics()
                ]);

                dispatch({ type: ActionTypes.SET_NOTES, payload: allData.notes });
                dispatch({ type: ActionTypes.SET_USERS, payload: allData.users });
                dispatch({ type: ActionTypes.SET_DEPARTMENTS, payload: allData.departments });
                dispatch({ type: ActionTypes.SET_SUBJECTS, payload: allData.subjects });
                dispatch({ type: ActionTypes.SET_SEMESTERS, payload: allData.semesters });
                dispatch({ type: ActionTypes.SET_ACTIVITY_LOG, payload: allData.activity });
                dispatch({ type: ActionTypes.SET_STATISTICS, payload: statistics });

            } catch (error) {
                console.error('Error loading data:', error);
                dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
            } finally {
                dispatch({ type: ActionTypes.SET_LOADING, payload: false });
            }
        };

        loadData();
    }, []);

    // Real-time subscriptions
    useEffect(() => {
        const subscriptions = [];

        // Subscribe to notes changes
        const notesSubscription = SupabaseService.subscribeToNotes((payload) => {
            console.log('Notes change:', payload);
            switch (payload.eventType) {
                case 'INSERT':
                    dispatch({ type: ActionTypes.ADD_NOTE, payload: payload.new });
                    break;
                case 'UPDATE':
                    dispatch({ type: ActionTypes.UPDATE_NOTE, payload: payload.new });
                    break;
                case 'DELETE':
                    dispatch({ type: ActionTypes.DELETE_NOTE, payload: payload.old.id });
                    break;
                default:
                    break;
            }
        });

        // Subscribe to users changes
        const usersSubscription = SupabaseService.subscribeToUsers((payload) => {
            console.log('Users change:', payload);
            switch (payload.eventType) {
                case 'INSERT':
                    dispatch({ type: ActionTypes.ADD_USER, payload: payload.new });
                    break;
                case 'UPDATE':
                    dispatch({ type: ActionTypes.UPDATE_USER, payload: payload.new });
                    break;
                case 'DELETE':
                    dispatch({ type: ActionTypes.DELETE_USER, payload: payload.old.id });
                    break;
                default:
                    break;
            }
        });

        // Subscribe to activity changes
        const activitySubscription = SupabaseService.subscribeToActivity((payload) => {
            console.log('Activity change:', payload);
            if (payload.eventType === 'INSERT') {
                dispatch({ type: ActionTypes.ADD_ACTIVITY, payload: payload.new });
            }
        });

        subscriptions.push(notesSubscription, usersSubscription, activitySubscription);

        return () => {
            subscriptions.forEach(sub => sub.unsubscribe());
        };
    }, []);

    // Action creators
    const actions = {
        // Authentication
        signIn: async (email, password) => {
            try {
                dispatch({ type: ActionTypes.SET_LOADING, payload: true });
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
                return { data, error: null };
            } catch (error) {
                dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
                return { data: null, error };
            } finally {
                dispatch({ type: ActionTypes.SET_LOADING, payload: false });
            }
        },

        signUp: async (email, password, userData) => {
            try {
                dispatch({ type: ActionTypes.SET_LOADING, payload: true });
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: userData
                    }
                });
                if (error) throw error;
                return { data, error: null };
            } catch (error) {
                dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
                return { data: null, error };
            } finally {
                dispatch({ type: ActionTypes.SET_LOADING, payload: false });
            }
        },

        signOut: async () => {
            try {
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
                dispatch({ type: ActionTypes.SET_USER, payload: null });
            } catch (error) {
                dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
            }
        },

        // Notes
        createNote: async (noteData) => {
            const result = await SupabaseService.createNote(noteData);
            if (result.data) {
                dispatch({ type: ActionTypes.ADD_NOTE, payload: result.data });
            }
            return result;
        },

        updateNote: async (noteId, updates) => {
            const result = await SupabaseService.updateNote(noteId, updates);
            if (result.data) {
                dispatch({ type: ActionTypes.UPDATE_NOTE, payload: result.data });
            }
            return result;
        },

        deleteNote: async (noteId) => {
            const result = await SupabaseService.deleteNote(noteId);
            if (!result.error) {
                dispatch({ type: ActionTypes.DELETE_NOTE, payload: noteId });
            }
            return result;
        },

        approveNote: async (noteId, adminId) => {
            const result = await SupabaseService.approveNote(noteId, adminId);
            if (result.data) {
                dispatch({ type: ActionTypes.UPDATE_NOTE, payload: result.data });
            }
            return result;
        },

        rejectNote: async (noteId, adminId, reason) => {
            const result = await SupabaseService.rejectNote(noteId, adminId, reason);
            if (result.data) {
                dispatch({ type: ActionTypes.UPDATE_NOTE, payload: result.data });
            }
            return result;
        },

        // Users
        updateUserStatus: async (userId, status, reason) => {
            const result = await SupabaseService.updateUserStatus(userId, status, reason);
            if (result.data) {
                dispatch({ type: ActionTypes.UPDATE_USER, payload: result.data });
            }
            return result;
        },

        // Departments
        createDepartment: async (departmentData) => {
            const result = await SupabaseService.createDepartment(departmentData);
            if (result.data) {
                dispatch({ type: ActionTypes.ADD_DEPARTMENT, payload: result.data });
            }
            return result;
        },

        updateDepartment: async (departmentId, updates) => {
            const result = await SupabaseService.updateDepartment(departmentId, updates);
            if (result.data) {
                dispatch({ type: ActionTypes.UPDATE_DEPARTMENT, payload: result.data });
            }
            return result;
        },

        deleteDepartment: async (departmentId) => {
            const result = await SupabaseService.deleteDepartment(departmentId);
            if (!result.error) {
                dispatch({ type: ActionTypes.DELETE_DEPARTMENT, payload: departmentId });
            }
            return result;
        },

        // Subjects
        createSubject: async (subjectData) => {
            const result = await SupabaseService.createSubject(subjectData);
            if (result.data) {
                dispatch({ type: ActionTypes.ADD_SUBJECT, payload: result.data });
            }
            return result;
        },

        updateSubject: async (subjectId, updates) => {
            const result = await SupabaseService.updateSubject(subjectId, updates);
            if (result.data) {
                dispatch({ type: ActionTypes.UPDATE_SUBJECT, payload: result.data });
            }
            return result;
        },

        deleteSubject: async (subjectId) => {
            const result = await SupabaseService.deleteSubject(subjectId);
            if (!result.error) {
                dispatch({ type: ActionTypes.DELETE_SUBJECT, payload: subjectId });
            }
            return result;
        },

        // Semesters
        createSemester: async (semesterData) => {
            const result = await SupabaseService.createSemester(semesterData);
            if (result.data) {
                dispatch({ type: ActionTypes.ADD_SEMESTER, payload: result.data });
            }
            return result;
        },

        updateSemester: async (semesterId, updates) => {
            const result = await SupabaseService.updateSemester(semesterId, updates);
            if (result.data) {
                dispatch({ type: ActionTypes.UPDATE_SEMESTER, payload: result.data });
            }
            return result;
        },

        deleteSemester: async (semesterId) => {
            const result = await SupabaseService.deleteSemester(semesterId);
            if (!result.error) {
                dispatch({ type: ActionTypes.DELETE_SEMESTER, payload: semesterId });
            }
            return result;
        },

        // Utilities
        refreshData: async () => {
            try {
                dispatch({ type: ActionTypes.SET_LOADING, payload: true });

                const [allData, statistics] = await Promise.all([
                    SupabaseService.getAllData(),
                    SupabaseService.getStatistics()
                ]);

                dispatch({ type: ActionTypes.SET_NOTES, payload: allData.notes });
                dispatch({ type: ActionTypes.SET_USERS, payload: allData.users });
                dispatch({ type: ActionTypes.SET_DEPARTMENTS, payload: allData.departments });
                dispatch({ type: ActionTypes.SET_SUBJECTS, payload: allData.subjects });
                dispatch({ type: ActionTypes.SET_SEMESTERS, payload: allData.semesters });
                dispatch({ type: ActionTypes.SET_ACTIVITY_LOG, payload: allData.activity });
                dispatch({ type: ActionTypes.SET_STATISTICS, payload: statistics });

            } catch (error) {
                console.error('Error refreshing data:', error);
                dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
            } finally {
                dispatch({ type: ActionTypes.SET_LOADING, payload: false });
            }
        },

        clearError: () => {
            dispatch({ type: ActionTypes.SET_ERROR, payload: null });
        },

        // Toast actions
        addToast: (toast) => {
            const toastWithId = {
                ...toast,
                id: Date.now() + Math.random(), // Simple unique ID
                duration: toast.duration || 5000
            };
            dispatch({ type: ActionTypes.ADD_TOAST, payload: toastWithId });

            // Auto-remove toast after duration
            if (toastWithId.duration > 0) {
                setTimeout(() => {
                    dispatch({ type: ActionTypes.REMOVE_TOAST, payload: toastWithId.id });
                }, toastWithId.duration);
            }
        },

        removeToast: (id) => {
            dispatch({ type: ActionTypes.REMOVE_TOAST, payload: id });
        },

        clearToasts: () => {
            dispatch({ type: ActionTypes.CLEAR_TOASTS });
        }
    };

    const value = {
        ...state,
        actions
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the context
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

export default AppContext;
