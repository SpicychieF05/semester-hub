import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabase';
import { useApp } from '../context/AppContext';

// Custom hook for toast notifications
export const useToast = () => {
    const { state, actions } = useApp();

    const showToast = useCallback((message, type = 'info', duration = 5000) => {
        return actions.addToast({ message, type, duration });
    }, [actions]);

    const success = useCallback((message, duration) => showToast(message, 'success', duration), [showToast]);
    const error = useCallback((message, duration) => showToast(message, 'error', duration), [showToast]);
    const warning = useCallback((message, duration) => showToast(message, 'warning', duration), [showToast]);
    const info = useCallback((message, duration) => showToast(message, 'info', duration), [showToast]);

    return {
        toasts: state.toasts,
        showToast,
        removeToast: actions.removeToast,
        clearToasts: actions.clearToasts,
        success,
        error,
        warning,
        info
    };
};

// Custom hook for form management
export const useForm = (initialValues, validationSchema) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setValue = useCallback((name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    const setFieldTouched = useCallback((name, touched = true) => {
        setTouched(prev => ({ ...prev, [name]: touched }));
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setValue(name, type === 'checkbox' ? checked : value);
    }, [setValue]);

    const handleBlur = useCallback((e) => {
        const { name } = e.target;
        setFieldTouched(name);

        // Validate field on blur if validation schema exists
        if (validationSchema && validationSchema[name]) {
            const fieldError = validationSchema[name](values[name], values);
            if (fieldError) {
                setErrors(prev => ({ ...prev, [name]: fieldError }));
            }
        }
    }, [values, validationSchema, setFieldTouched]);

    const validate = useCallback(() => {
        if (!validationSchema) return {};

        const newErrors = {};
        Object.keys(validationSchema).forEach(field => {
            const error = validationSchema[field](values[field], values);
            if (error) {
                newErrors[field] = error;
            }
        });

        setErrors(newErrors);
        return newErrors;
    }, [values, validationSchema]);

    const handleSubmit = useCallback((onSubmit) => {
        return async (e) => {
            e.preventDefault();

            const formErrors = validate();
            if (Object.keys(formErrors).length > 0) {
                setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
                return;
            }

            setIsSubmitting(true);
            try {
                await onSubmit(values);
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setIsSubmitting(false);
            }
        };
    }, [values, validate]);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);

    const isValid = Object.keys(errors).length === 0;
    const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

    return {
        values,
        errors,
        touched,
        isSubmitting,
        isValid,
        isDirty,
        setValue,
        setFieldTouched,
        handleChange,
        handleBlur,
        handleSubmit,
        validate,
        reset
    };
};

// Custom hook for data fetching with loading states
export const useAsyncData = (asyncFunction, deps = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await asyncFunction();
            setData(result);
        } catch (err) {
            setError(err);
            console.error('Async data fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [asyncFunction]);

    useEffect(() => {
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, refetch]);

    return { data, loading, error, refetch };
};

// Custom hook for modal management
export const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen(prev => !prev), []);

    return { isOpen, open, close, toggle };
};

// Custom hook for pagination
export const usePagination = (data, itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    const goToPage = useCallback((page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    }, [totalPages]);

    const nextPage = useCallback(() => {
        goToPage(currentPage + 1);
    }, [currentPage, goToPage]);

    const prevPage = useCallback(() => {
        goToPage(currentPage - 1);
    }, [currentPage, goToPage]);

    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    // Reset to first page when data changes
    useEffect(() => {
        setCurrentPage(1);
    }, [data.length]);

    return {
        currentPage,
        totalPages,
        currentData,
        hasNextPage,
        hasPrevPage,
        goToPage,
        nextPage,
        prevPage
    };
};

// Custom hook for search and filtering
export const useSearch = (data, searchFields = []) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const filteredData = useMemo(() => {
        let result = data;

        // Apply search
        if (searchTerm && searchFields.length > 0) {
            result = result.filter(item =>
                searchFields.some(field => {
                    const value = getNestedValue(item, field);
                    return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
                })
            );
        }

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                result = result.filter(item => {
                    const itemValue = getNestedValue(item, key);
                    return itemValue === value || (Array.isArray(itemValue) && itemValue.includes(value));
                });
            }
        });

        // Apply sorting
        if (sortBy) {
            result = [...result].sort((a, b) => {
                const aVal = getNestedValue(a, sortBy);
                const bVal = getNestedValue(b, sortBy);

                if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data, searchTerm, filters, sortBy, sortOrder, searchFields]);

    const setFilter = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({});
        setSearchTerm('');
    }, []);

    const setSort = useCallback((field, order = 'asc') => {
        setSortBy(field);
        setSortOrder(order);
    }, []);

    return {
        searchTerm,
        setSearchTerm,
        filters,
        setFilter,
        clearFilters,
        sortBy,
        sortOrder,
        setSort,
        filteredData
    };
};

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current && current[key], obj);
};

// Custom hook for authentication state
export const useAuth = () => {
    const { user, isAuthenticated, loading, actions } = useApp();
    const [isAdmin, setIsAdmin] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (user) {
                try {
                    const { data: profile } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    setUserProfile(profile);
                    setIsAdmin(profile?.role === 'admin');
                } catch (error) {
                    console.error('Error checking admin status:', error);
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
                setUserProfile(null);
            }
        };

        checkAdminStatus();
    }, [user]);

    return {
        user,
        userProfile,
        isAuthenticated,
        isAdmin,
        loading,
        signIn: actions.signIn,
        signUp: actions.signUp,
        signOut: actions.signOut
    };
};

// Custom hook for file upload
export const useFileUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const uploadFile = useCallback(async (file, bucket = 'notes-files', folder = '') => {
        try {
            setUploading(true);
            setError(null);
            setProgress(0);

            // Validate file
            if (!file) throw new Error('No file selected');
            if (file.size > 10 * 1024 * 1024) throw new Error('File size must be less than 10MB');

            const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${file.name}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    onUploadProgress: (progress) => {
                        setProgress((progress.loaded / progress.total) * 100);
                    }
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            return {
                url: publicUrl,
                path: fileName,
                fileName: file.name,
                fileSize: file.size
            };
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setUploading(false);
            setProgress(0);
        }
    }, []);

    const deleteFile = useCallback(async (filePath, bucket = 'notes-files') => {
        try {
            const { error } = await supabase.storage
                .from(bucket)
                .remove([filePath]);

            if (error) throw error;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    return {
        uploading,
        progress,
        error,
        uploadFile,
        deleteFile
    };
};

// Custom hook for local storage
export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    const removeValue = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
};

const hooks = {
    useToast,
    useForm,
    useAsyncData,
    useModal,
    usePagination,
    useSearch,
    useAuth,
    useFileUpload,
    useLocalStorage
};

export default hooks;
