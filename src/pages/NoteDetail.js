import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { auth, supabase } from '../supabase';
import {
    ArrowLeft, Download, Calendar, User, Eye, AlertCircle, Lock
} from 'lucide-react';

// Demo data function
const getDemoNote = (id) => {
    const demoNotes = {
        '1': {
            id: '1',
            title: 'Data Structures and Algorithms',
            subject: 'Computer Science',
            semester: 'Semester 3',
            description: 'Comprehensive notes covering arrays, linked lists, stacks, queues, trees, and graph algorithms with implementation examples.',
            author: 'Arjun Sharma',
            createdAt: { toDate: () => new Date('2024-01-15') },
            downloadCount: 245,
            views: 1250,
            tags: ['DSA', 'Programming', 'Algorithms'],
            status: 'approved',
            externalLink: 'https://example.com/dsa-notes',
            fileName: 'dsa-notes.pdf',
            fileSize: '2.5 MB'
        },
        '2': {
            id: '2',
            title: 'Calculus Integration Techniques',
            subject: 'Mathematics',
            semester: 'Semester 2',
            description: 'Detailed notes on integration by parts, substitution, partial fractions, and trigonometric integrals with solved examples.',
            author: 'Priya Patel',
            createdAt: { toDate: () => new Date('2024-01-10') },
            downloadCount: 189,
            views: 890,
            tags: ['Calculus', 'Integration', 'Mathematics'],
            status: 'approved',
            externalLink: 'https://example.com/calculus-notes',
            fileName: 'calculus-notes.pdf',
            fileSize: '3.2 MB'
        },
        '3': {
            id: '3',
            title: 'Thermodynamics Laws and Applications',
            subject: 'Physics',
            semester: 'Semester 4',
            description: 'Complete coverage of the four laws of thermodynamics with real-world applications and problem-solving strategies.',
            author: 'Rohan Gupta',
            createdAt: { toDate: () => new Date('2024-01-08') },
            downloadCount: 156,
            views: 720,
            tags: ['Thermodynamics', 'Physics', 'Energy'],
            status: 'approved',
            externalLink: 'https://example.com/thermo-notes',
            fileName: 'thermo-notes.pdf',
            fileSize: '4.1 MB'
        }
    };

    return demoNotes[id] || null;
};

const NoteDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Auth state management
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        return () => {
            if (unsubscribe && typeof unsubscribe.unsubscribe === 'function') {
                unsubscribe.unsubscribe();
            }
        };
    }, []);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                console.log('Fetching note with ID:', id);

                // Fetch note from Supabase
                const { data: noteData, error } = await supabase
                    .from('notes')
                    .select('*')
                    .eq('id', id)
                    .single();

                console.log('Supabase response:', { noteData, error });

                if (error || !noteData) {
                    console.log('Note not found in database, using demo data');
                    // Fallback to demo data
                    const demoNote = getDemoNote(id);
                    if (demoNote) {
                        setNote(demoNote);
                    } else {
                        setError('Note not found');
                        return;
                    }
                } else {
                    setNote(noteData);

                    // Increment view count
                    if (noteData.status === 'approved') {
                        await supabase
                            .from('notes')
                            .update({
                                views: (noteData.views || 0) + 1
                            })
                            .eq('id', id);
                    }
                }
            } catch (error) {
                console.error('Error fetching note:', error);
                // Fallback to demo data
                const demoNote = getDemoNote(id);
                if (demoNote) {
                    setNote(demoNote);
                } else {
                    setError('Error loading note');
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchNote();
        }
    }, [id]);

    const handleDownload = async () => {
        alert('this Website is still in development and its a demo file. sorry for your Inconvenience.');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error || !note) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container-responsive max-w-4xl">
                    <div className="text-center py-12">
                        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                        <h1 className="text-2xl font-bold text-secondary-900 mb-4">
                            {error || 'Note not found'}
                        </h1>
                        <Link
                            to="/browse"
                            className="btn-primary inline-flex items-center space-x-2"
                        >
                            <ArrowLeft size={20} />
                            <span>Back to Browse</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-responsive max-w-4xl">
                {/* Back button */}
                <div className="mb-6">
                    <Link
                        to="/browse"
                        className="inline-flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Browse</span>
                    </Link>
                </div>

                {/* Note content */}
                <div className="bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden">
                    <div className="p-6 sm:p-8">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                                    {note.subject}
                                </span>
                                <span className="px-3 py-1 bg-secondary-100 text-secondary-700 text-sm rounded-full">
                                    {note.semester}
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-4">
                                {note.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600">
                                <div className="flex items-center space-x-1">
                                    <User size={16} />
                                    <span>{note.uploader_name || note.author || 'Anonymous'}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Calendar size={16} />
                                    <span>
                                        {note.created_at
                                            ? new Date(note.created_at).toLocaleDateString()
                                            : note.createdAt
                                                ? note.createdAt.toDate().toLocaleDateString()
                                                : 'Unknown date'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-secondary-900 mb-3">Description</h2>
                            <p className="text-secondary-700 leading-relaxed">
                                {note.description}
                            </p>
                        </div>

                        {/* Stats and Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center space-x-6 text-sm text-secondary-600">
                                <div className="flex items-center space-x-1">
                                    <Download size={16} />
                                    <span>{note.download_count || note.downloadCount || 0} downloads</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Eye size={16} />
                                    <span>{note.views || 0} views</span>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                {user ? (
                                    <button
                                        onClick={handleDownload}
                                        className="btn-primary flex items-center space-x-2"
                                    >
                                        <Download size={20} />
                                        <span>Download</span>
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="btn-secondary flex items-center space-x-2"
                                    >
                                        <Lock size={20} />
                                        <span>Login to Download</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteDetail;
