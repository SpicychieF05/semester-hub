import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase';
import {
    ArrowLeft, Download, Calendar, User, Eye, Heart,
    Share2, BookOpen, Tag, FileText, AlertCircle, Lock
} from 'lucide-react';

const NoteDetail = () => {
    const { id } = useParams();
    const [user] = useAuthState(auth);
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                setLoading(true);
                const noteRef = doc(db, 'notes', id);
                const noteSnap = await getDoc(noteRef);

                if (noteSnap.exists()) {
                    const noteData = { id: noteSnap.id, ...noteSnap.data() };
                    setNote(noteData);

                    // Increment view count
                    await updateDoc(noteRef, {
                        views: increment(1)
                    });
                } else {
                    setError('Note not found');
                }
            } catch (error) {
                console.error('Error fetching note:', error);
                // Fallback demo data
                setNote({
                    id: '1',
                    title: 'Data Structures and Algorithms - Complete Guide',
                    subject: 'Computer Science',
                    semester: 'Semester 4',
                    description: 'Comprehensive notes covering all major data structures including arrays, linked lists, stacks, queues, trees, and graphs. Also includes detailed explanations of sorting and searching algorithms with time complexity analysis and implementation examples in multiple programming languages.',
                    author: 'Aditya Verma',
                    authorId: 'user123',
                    createdAt: new Date('2024-01-15'),
                    downloadCount: 245,
                    views: 1520,
                    likes: 89,
                    fileUrl: '#',
                    fileName: 'data-structures-algorithms.pdf',
                    fileSize: 2048000,
                    tags: ['algorithms', 'data structures', 'programming', 'computer science'],
                    status: 'approved'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id]);

    const handleDownload = async () => {
        // Check if user is authenticated
        if (!user) {
            const shouldLogin = window.confirm('You need to login first to download notes. Would you like to go to the login page?');
            if (shouldLogin) {
                window.location.href = '/login';
            }
            return;
        }

        if (note.fileUrl === '#') {
            alert('Demo mode - Download not available');
            return;
        }

        try {
            // Increment download count
            const noteRef = doc(db, 'notes', id);
            await updateDoc(noteRef, {
                downloadCount: increment(1)
            });

            setNote(prev => ({
                ...prev,
                downloadCount: (prev.downloadCount || 0) + 1
            }));

            // Trigger download
            window.open(note.fileUrl, '_blank');
        } catch (error) {
            console.error('Error updating download count:', error);
        }
    };

    const handleLike = async () => {
        try {
            const noteRef = doc(db, 'notes', id);
            const increment_value = liked ? -1 : 1;

            await updateDoc(noteRef, {
                likes: increment(increment_value)
            });

            setNote(prev => ({
                ...prev,
                likes: (prev.likes || 0) + increment_value
            }));

            setLiked(!liked);
        } catch (error) {
            console.error('Error updating like count:', error);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: note.title,
                text: note.description,
                url: window.location.href,
            });
        } else {
            // Fallback to copying URL to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        if (date.toDate) {
            return date.toDate().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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

    if (error || !note) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle size={64} className="mx-auto text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                        {error || 'Note not found'}
                    </h2>
                    <p className="text-secondary-600 mb-6">
                        The note you're looking for doesn't exist or has been removed.
                    </p>
                    <Link
                        to="/browse"
                        className="btn-primary"
                    >
                        Browse Other Notes
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        to="/browse"
                        className="inline-flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Browse</span>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-secondary-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-secondary-900 mb-4">
                                    {note.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600 mb-4">
                                    <div className="flex items-center space-x-1">
                                        <BookOpen size={16} />
                                        <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                                            {note.subject}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Calendar size={16} />
                                        <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full font-medium">
                                            {note.semester}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <User size={16} />
                                        <span>By {note.author}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Calendar size={16} />
                                        <span>{formatDate(note.createdAt)}</span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center space-x-6 text-sm text-secondary-500">
                                    <div className="flex items-center space-x-1">
                                        <Eye size={16} />
                                        <span>{note.views || 0} views</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Download size={16} />
                                        <span>{note.downloadCount || 0} downloads</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Heart size={16} />
                                        <span>{note.likes || 0} likes</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleLike}
                                    className={`btn-secondary flex items-center space-x-2 ${liked ? 'bg-red-100 text-red-700 border-red-200' : ''
                                        }`}
                                >
                                    <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                                    <span>{liked ? 'Liked' : 'Like'}</span>
                                </button>

                                <button
                                    onClick={handleShare}
                                    className="btn-secondary flex items-center space-x-2"
                                >
                                    <Share2 size={16} />
                                    <span>Share</span>
                                </button>

                                <button
                                    onClick={handleDownload}
                                    className={`flex items-center space-x-2 ${user
                                        ? "btn-primary"
                                        : "btn-secondary border-orange-300 text-orange-600 hover:bg-orange-50"
                                        }`}
                                >
                                    {user ? <Download size={16} /> : <Lock size={16} />}
                                    <span>{user ? "Download" : "Login to Download"}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2">
                                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                                    Description
                                </h3>
                                <div className="prose max-w-none text-secondary-700 mb-8">
                                    <p className="leading-relaxed">{note.description}</p>
                                </div>

                                {/* Tags */}
                                {note.tags && note.tags.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center space-x-2">
                                            <Tag size={20} />
                                            <span>Tags</span>
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {note.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="card">
                                    <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center space-x-2">
                                        <FileText size={20} />
                                        <span>File Information</span>
                                    </h3>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-secondary-600">File Name:</span>
                                            <span className="text-secondary-900 font-medium">
                                                {note.fileName}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-secondary-600">File Size:</span>
                                            <span className="text-secondary-900 font-medium">
                                                {formatFileSize(note.fileSize)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-secondary-600">Subject:</span>
                                            <span className="text-secondary-900 font-medium">
                                                {note.subject}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-secondary-600">Semester:</span>
                                            <span className="text-secondary-900 font-medium">
                                                {note.semester}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-secondary-600">Uploaded:</span>
                                            <span className="text-secondary-900 font-medium">
                                                {formatDate(note.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-secondary-200">
                                        <button
                                            onClick={handleDownload}
                                            className={`w-full flex items-center justify-center space-x-2 ${user
                                                ? "btn-primary"
                                                : "btn-secondary border-orange-300 text-orange-600 hover:bg-orange-50"
                                                }`}
                                        >
                                            {user ? <Download size={16} /> : <Lock size={16} />}
                                            <span>{user ? "Download Note" : "Login to Download"}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Notes Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                        Related Notes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* This would be populated with related notes */}
                        <div className="card">
                            <h3 className="font-semibold text-secondary-900 mb-2">
                                Advanced Data Structures
                            </h3>
                            <p className="text-sm text-secondary-600 mb-3">
                                Deep dive into advanced tree structures and graph algorithms...
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-secondary-500">Computer Science</span>
                                <Link to="/note/2" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                    View →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteDetail;
