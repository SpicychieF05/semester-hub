import { createClient } from '@supabase/supabase-js'

// Use environment variables for Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://uevunvpcbvvduvjqcwwl.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVldnVudnBjYnZ2ZHV2anFjd3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDQ0MjcsImV4cCI6MjA2OTIyMDQyN30.HvcQZb-dw0cp4PvKF5xTQguasNk-2hlgINGWDc7zjr4'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Get the site URL - use environment variable if available, otherwise fallback
const getSiteUrl = () => {
    // In production, always use the environment variable or fallback
    if (process.env.NODE_ENV === 'production') {
        return process.env.REACT_APP_SITE_URL || 'https://semesterhub.vercel.app'
    }
    // In development, use localhost
    return process.env.REACT_APP_SITE_URL || window.location.origin
}

// Auth helper functions to mimic Firebase Auth API
export const auth = {
    currentUser: null,

    // Sign up with email and password
    createUserWithEmailAndPassword: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${getSiteUrl()}/`,
                data: {
                    email_confirm: false
                }
            }
        })
        if (error) throw error
        return { user: data.user }
    },

    // Sign in with email and password
    signInWithEmailAndPassword: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) throw error
        return { user: data.user }
    },

    // Sign out
    signOut: async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    },

    // Get current user
    getCurrentUser: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        return user
    },

    // Auth state change listener
    onAuthStateChanged: (callback) => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                callback(session?.user || null)
            }
        )
        return subscription
    },

    // Resend confirmation email
    resendConfirmation: async (email) => {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
                emailRedirectTo: `${getSiteUrl()}/`
            }
        })
        if (error) throw error
        return { success: true }
    },

    // Sign in with Google
    signInWithGoogle: async () => {
        const siteUrl = getSiteUrl()
        console.log('Google Sign-In: Using site URL:', siteUrl)

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${siteUrl}/auth/callback`,
                queryParams: {
                    prompt: 'select_account'
                }
            }
        })
        if (error) {
            console.error('Google OAuth error:', error)
            throw error
        }
        return data
    },

    // Sign up with Google (same as sign in for OAuth)
    signUpWithGoogle: async () => {
        const siteUrl = getSiteUrl()
        console.log('Google Sign-Up: Using site URL:', siteUrl)

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${siteUrl}/auth/callback`,
                queryParams: {
                    prompt: 'select_account'
                }
            }
        })
        if (error) {
            console.error('Google OAuth error:', error)
            throw error
        }
        return data
    },

    // Create or update user profile (for OAuth users)
    createOrUpdateProfile: async (user) => {
        try {
            // Check if user profile already exists
            const { data: existingUser, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                // PGRST116 is "Row not found" error, which is expected for new users
                throw fetchError;
            }

            if (!existingUser) {
                // Create new user profile
                const { error: insertError } = await supabase
                    .from('users')
                    .insert([
                        {
                            id: user.id,
                            email: user.email,
                            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
                            role: 'user',
                            auth_provider: user.app_metadata?.provider || 'email',
                            avatar_url: user.user_metadata?.avatar_url || null,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }
                    ]);

                if (insertError) {
                    throw insertError;
                }
            } else {
                // Update existing user profile with latest info
                const { error: updateError } = await supabase
                    .from('users')
                    .update({
                        name: user.user_metadata?.full_name || user.user_metadata?.name || existingUser.name,
                        avatar_url: user.user_metadata?.avatar_url || existingUser.avatar_url,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', user.id);

                if (updateError) {
                    throw updateError;
                }
            }

            return true;
        } catch (error) {
            console.error('Error creating/updating user profile:', error);
            throw error;
        }
    }
}

// Firestore helper functions to mimic Firebase Firestore API
export const db = {
    // Collection reference
    collection: (collectionName) => ({
        // Add document
        add: async (data) => {
            const { data: result, error } = await supabase
                .from(collectionName)
                .insert([{ ...data, created_at: new Date().toISOString() }])
                .select()
                .single()

            if (error) throw error
            return { id: result.id }
        },

        // Get all documents
        get: async () => {
            const { data, error } = await supabase
                .from(collectionName)
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            return {
                docs: data.map(doc => ({
                    id: doc.id,
                    data: () => doc,
                    exists: () => true
                }))
            }
        },

        // Where queries
        where: (field, operator, value) => ({
            get: async () => {
                let query = supabase.from(collectionName).select('*')

                if (operator === '==') {
                    query = query.eq(field, value)
                } else if (operator === '!=') {
                    query = query.neq(field, value)
                } else if (operator === '>') {
                    query = query.gt(field, value)
                } else if (operator === '<') {
                    query = query.lt(field, value)
                } else if (operator === '>=') {
                    query = query.gte(field, value)
                } else if (operator === '<=') {
                    query = query.lte(field, value)
                }

                const { data, error } = await query
                if (error) throw error

                return {
                    docs: data.map(doc => ({
                        id: doc.id,
                        data: () => doc,
                        exists: () => true
                    }))
                }
            }
        })
    }),

    // Document reference
    doc: (collectionName, docId) => ({
        // Get document
        get: async () => {
            const { data, error } = await supabase
                .from(collectionName)
                .select('*')
                .eq('id', docId)
                .single()

            if (error && error.code !== 'PGRST116') throw error

            return {
                id: docId,
                exists: () => !!data,
                data: () => data
            }
        },

        // Update document
        update: async (updateData) => {
            const { error } = await supabase
                .from(collectionName)
                .update(updateData)
                .eq('id', docId)

            if (error) throw error
        },

        // Delete document
        delete: async () => {
            const { error } = await supabase
                .from(collectionName)
                .delete()
                .eq('id', docId)

            if (error) throw error
        }
    })
}

// Firestore helper functions
export const getDocs = async (query) => {
    return await query.get()
}

export const getDoc = async (docRef) => {
    return await docRef.get()
}

export const addDoc = async (collectionRef, data) => {
    return await collectionRef.add(data)
}

export const updateDoc = async (docRef, data) => {
    return await docRef.update(data)
}

export const deleteDoc = async (docRef) => {
    return await docRef.delete()
}

export const doc = (collectionName, docId) => {
    return db.doc(collectionName, docId)
}

export const collection = (collectionName) => {
    return db.collection(collectionName)
}

// Helper function to increment values (like Firebase FieldValue.increment)
export const increment = (value) => {
    return { increment: value }
}

// For demo purposes - you can remove this when you have real Supabase setup
console.log('🔄 Supabase configured in demo mode. Replace with your actual credentials.')
