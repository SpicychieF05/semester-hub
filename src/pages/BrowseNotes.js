import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { SupabaseService } from '../services/supabaseService';
import { Search, BookOpen, Download, Eye, Calendar, User } from 'lucide-react';

const BrowseNotes = () => {
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');

    const subjects = [
        'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
        'English', 'History', 'Economics', 'Psychology', 'Engineering'
    ];

    const semesters = [
        'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
        'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'
    ];

    const fetchNotes = useCallback(async () => {
        try {
            setLoading(true);

            // Fetch approved notes from Supabase
            const { data: realNotes, error } = await supabase
                .from('notes')
                .select('*')
                .eq('status', 'approved')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching notes:', error);
                // Fallback to demo data
                setNotes(getDemoNotes());
            } else if (realNotes && realNotes.length > 0) {
                // Use real data from Supabase
                const formattedNotes = realNotes.map(note => ({
                    ...note,
                    author: note.uploader_name,
                    createdAt: { toDate: () => new Date(note.created_at) },
                    downloadCount: note.download_count || 0,
                    views: Math.floor(Math.random() * 1000) + 100, // Random views for demo
                    tags: ['Academic', note.subject],
                    externalLink: note.file_url
                }));
                setNotes(formattedNotes);
            } else {
                // No real data, use demo data
                setNotes(getDemoNotes());
            }
        } catch (error) {
            console.error('Error loading notes:', error);
            setNotes(getDemoNotes());
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotes();

        // Set up real-time subscription for notes updates
        const notesSubscription = SupabaseService.subscribeToNotes((payload) => {
            console.log('Real-time notes update in BrowseNotes:', payload);
            // Refresh notes when there are changes
            fetchNotes();
        });

        // Cleanup subscription on unmount
        return () => {
            if (notesSubscription && notesSubscription.unsubscribe) {
                notesSubscription.unsubscribe();
            }
        };
    }, [fetchNotes]);

    const getDemoNotes = () => [
        {
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
            externalLink: 'https://example.com/dsa-notes'
        },
        {
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
            externalLink: 'https://example.com/calculus-notes'
        },
        {
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
            externalLink: 'https://example.com/thermo-notes'
        },
        {
            id: '4',
            title: 'Database Management Systems',
            subject: 'Computer Science',
            semester: 'Semester 5',
            description: 'SQL queries, normalization, indexing, transactions, and database design principles with practical examples.',
            author: 'Ananya Singh',
            createdAt: { toDate: () => new Date('2024-01-05') },
            downloadCount: 298,
            views: 1450,
            tags: ['DBMS', 'SQL', 'Database'],
            status: 'approved',
            externalLink: 'https://example.com/dbms-notes'
        },
        {
            id: '5',
            title: 'Organic Chemistry Reactions',
            subject: 'Chemistry',
            semester: 'Semester 3',
            description: 'Mechanism studies of addition, substitution, and elimination reactions with stereochemistry considerations.',
            author: 'Vikram Mehta',
            createdAt: { toDate: () => new Date('2024-01-03') },
            downloadCount: 178,
            views: 965,
            tags: ['Organic Chemistry', 'Reactions', 'Mechanisms'],
            status: 'approved',
            externalLink: 'https://example.com/organic-chem-notes'
        },
        {
            id: '6',
            title: 'Machine Learning Fundamentals',
            subject: 'Computer Science',
            semester: 'Semester 6',
            description: 'Introduction to supervised and unsupervised learning, neural networks, and popular ML algorithms.',
            author: 'Kavya Reddy',
            createdAt: { toDate: () => new Date('2024-01-01') },
            downloadCount: 334,
            views: 1678,
            tags: ['Machine Learning', 'AI', 'Neural Networks'],
            status: 'approved',
            externalLink: 'https://example.com/ml-notes'
        },
        {
            id: '7',
            title: 'Linear Algebra Matrix Operations',
            subject: 'Mathematics',
            semester: 'Semester 2',
            description: 'Vector spaces, eigenvalues, eigenvectors, and matrix transformations with geometric interpretations.',
            author: 'Rajesh Kumar',
            createdAt: { toDate: () => new Date('2023-12-28') },
            downloadCount: 167,
            views: 823,
            tags: ['Linear Algebra', 'Matrices', 'Vectors'],
            status: 'approved',
            externalLink: 'https://example.com/linear-algebra-notes'
        },
        {
            id: '8',
            title: 'Operating Systems Concepts',
            subject: 'Computer Science',
            semester: 'Semester 4',
            description: 'Process management, memory management, file systems, and synchronization with practical examples.',
            author: 'Deepika Sharma',
            createdAt: { toDate: () => new Date('2023-12-25') },
            downloadCount: 223,
            views: 1134,
            tags: ['Operating Systems', 'Processes', 'Memory Management'],
            status: 'approved',
            externalLink: 'https://example.com/os-notes'
        }
    ];

    useEffect(() => {
        const filterNotes = () => {
            let filtered = notes;

            if (searchTerm) {
                filtered = filtered.filter(note =>
                    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }

            if (selectedSubject) {
                filtered = filtered.filter(note => note.subject === selectedSubject);
            }

            if (selectedSemester) {
                filtered = filtered.filter(note => note.semester === selectedSemester);
            }

            setFilteredNotes(filtered);
        };

        filterNotes();
    }, [notes, searchTerm, selectedSubject, selectedSemester]);

    const formatDate = (date) => {
        if (!date) return '';
        if (date.toDate) {
            return date.toDate().toLocaleDateString();
        }
        return new Date(date).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
            <div className="container-responsive">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-900 mb-2 sm:mb-4 px-2">
                        Browse Study Notes
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto px-4">
                        Discover high-quality study materials shared by students from various subjects and semesters
                    </p>
                </div>

                {/* Login Notice */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex items-center justify-center space-x-3">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                <Download className="w-4 h-4 text-orange-600" />
                            </div>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-orange-800 font-medium">
                                📚 Login Required for Downloads
                            </p>
                            <p className="text-orange-700 text-sm mt-1">
                                You can browse all notes freely, but <strong>login is required to download</strong> study materials.
                                <Link to="/login" className="text-orange-600 hover:text-orange-800 font-semibold ml-1 underline">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {/* Search */}
                        <div className="relative sm:col-span-2 lg:col-span-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search notes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>

                        {/* Subject Filter */}
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="input-field"
                        >
                            <option value="">All Subjects</option>
                            {subjects.map(subject => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>

                        {/* Semester Filter */}
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            className="input-field"
                        >
                            <option value="">All Semesters</option>
                            {semesters.map(semester => (
                                <option key={semester} value={semester}>{semester}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 px-2 sm:px-0">
                    <h2 className="text-xl sm:text-2xl font-semibold text-secondary-900 mb-2 sm:mb-0">
                        {filteredNotes.length} Notes Available
                    </h2>
                    <div className="text-sm sm:text-base text-secondary-600">
                        Showing all approved notes
                    </div>
                </div>

                {/* Notes Grid */}
                {filteredNotes.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 px-4">
                        <BookOpen size={48} className="sm:w-16 sm:h-16 mx-auto text-secondary-400 mb-4" />
                        <h3 className="text-lg sm:text-xl font-medium text-secondary-900 mb-2">No notes found</h3>
                        <p className="text-sm sm:text-base text-secondary-600">Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-0">
                        {filteredNotes.map(note => (
                            <div key={note.id} className="bg-white rounded-xl shadow-sm border border-secondary-200 hover:shadow-md transition-shadow duration-200">
                                <div className="p-4 sm:p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="inline-block px-2 sm:px-3 py-1 bg-primary-100 text-primary-700 text-xs sm:text-sm font-medium rounded-full">
                                            {note.subject}
                                        </span>
                                        <span className="text-xs sm:text-sm text-secondary-500">{note.semester}</span>
                                    </div>

                                    <h3 className="text-base sm:text-lg font-semibold text-secondary-900 mb-2 line-clamp-2">
                                        {note.title}
                                    </h3>

                                    <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
                                        {note.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {note.tags?.slice(0, 3).map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-secondary-100 text-secondary-600 text-xs rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Stats */}
                                    <div className="flex justify-between items-center text-xs sm:text-sm text-secondary-500 mb-4">
                                        <div className="flex items-center space-x-3 sm:space-x-4">
                                            <div className="flex items-center space-x-1">
                                                <Download size={14} className="sm:w-4 sm:h-4" />
                                                <span>{note.downloadCount}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Eye size={14} className="sm:w-4 sm:h-4" />
                                                <span>{note.views}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Calendar size={14} className="sm:w-4 sm:h-4" />
                                            <span className="hidden sm:inline">{formatDate(note.createdAt)}</span>
                                            <span className="sm:hidden">{formatDate(note.createdAt).split('/').slice(0, 2).join('/')}</span>
                                        </div>
                                    </div>

                                    {/* Author */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                        <div className="flex items-center space-x-2">
                                            <User size={14} className="sm:w-4 sm:h-4 text-secondary-400" />
                                            <span className="text-xs sm:text-sm text-secondary-600 truncate">{note.author}</span>
                                        </div>
                                        <Link
                                            to={`/note/${note.id}`}
                                            className="btn-primary text-xs sm:text-sm py-2 px-3 sm:px-4 w-full sm:w-auto"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseNotes;