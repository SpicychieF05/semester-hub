import { createClient } from '@supabase/supabase-js'

// Real Supabase configuration
const supabaseUrl = 'https://uevunvpcbvvduvjqcwwl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVldnVudnBjYnZ2ZHV2anFjd3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDQ0MjcsImV4cCI6MjA2OTIyMDQyN30.HvcQZb-dw0cp4PvKF5xTQguasNk-2hlgINGWDc7zjr4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions to mimic Firebase Auth API
export const auth = {
    currentUser: null,

    // Sign up with email and password
    createUserWithEmailAndPassword: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/`
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
