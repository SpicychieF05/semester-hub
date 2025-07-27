import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Commented out - no storage needed
import { db, auth } from '../firebase'; // Removed storage import
import { useAuthState } from 'react-firebase-hooks/auth';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

const ShareNotes = () => {
    const [user] = useAuthState(auth);
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        semester: '',
        description: '',
        tags: '',
        externalLink: ''
    });
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const subjects = [
        'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
        'English', 'History', 'Economics', 'Psychology', 'Engineering'
    ];

    const semesters = [
        'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
        'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('You must be logged in to share notes');
            return;
        }

        // Validate required fields
        if (!formData.title.trim() || !formData.subject.trim() || !formData.description.trim()) {
            setError('Please fill in all required fields');
            return;
        }

        setUploading(true);
        setError('');

        try {
            // Create note document in Firestore (text-based, no file upload)
            const noteData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                // For text-based notes, we store the content directly
                content: formData.description,
                noteType: file ? 'file' : 'text', // Track if it's text or file-based
                fileName: file ? file.name : null,
                fileSize: file ? file.size : null,
                // Instead of file upload, we can store external links or text content
                externalLink: formData.externalLink || null,
                author: user.displayName || user.email,
                authorId: user.uid,
                createdAt: serverTimestamp(),
                status: 'pending', // Will be reviewed by admin
                downloadCount: 0,
                likes: 0,
                views: 0
            };

            await addDoc(collection(db, 'notes'), noteData);

            setSuccess(true);
            setFormData({
                title: '',
                subject: '',
                semester: '',
                description: '',
                tags: '',
                externalLink: ''
            });
            setFile(null);

            // Reset form
            const form = e.target;
            form.reset();

        } catch (error) {
            console.error('Error sharing note:', error);
            setError('Failed to share note. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
                <div className="container-responsive max-w-2xl">
                    <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center mx-4 sm:mx-0">
                        <CheckCircle size={48} className="sm:w-16 sm:h-16 mx-auto text-green-500 mb-4" />
                        <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 mb-4">
                            Note Submitted Successfully!
                        </h2>
                        <p className="text-sm sm:text-base text-secondary-600 mb-6">
                            Your note has been submitted for review. Once approved by our admin team,
                            it will be available for other students to access.
                        </p>
                        <button
                            onClick={() => setSuccess(false)}
                            className="btn-primary w-full sm:w-auto"
                        >
                            Share Another Note
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
            <div className="container-responsive max-w-2xl">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8 px-4 sm:px-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-2 sm:mb-4">
                        Share Your Notes
                    </h1>
                    <p className="text-base sm:text-lg text-secondary-600">
                        Help fellow students by sharing your knowledge and academic resources
                    </p>
                </div>

                {/* Upload Form */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8 mx-4 sm:mx-0">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex items-start space-x-2">
                            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm sm:text-base text-red-700">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-2">
                                Note Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g., Data Structures and Algorithms - Complete Guide"
                                className="input-field"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Subject */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 mb-2">
                                    Subject *
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className="input-field"
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map(subject => (
                                        <option key={subject} value={subject}>{subject}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Semester */}
                            <div>
                                <label htmlFor="semester" className="block text-sm font-medium text-secondary-700 mb-2">
                                    Semester *
                                </label>
                                <select
                                    id="semester"
                                    name="semester"
                                    required
                                    value={formData.semester}
                                    onChange={handleInputChange}
                                    className="input-field"
                                >
                                    <option value="">Select Semester</option>
                                    {semesters.map(semester => (
                                        <option key={semester} value={semester}>{semester}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                rows={4}
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe what your notes cover, topics included, and any special features..."
                                className="input-field resize-none"
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-secondary-700 mb-2">
                                Tags (Optional)
                            </label>
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                placeholder="e.g., algorithms, data structures, programming (separate with commas)"
                                className="input-field"
                            />
                            <p className="text-sm text-secondary-500 mt-1">
                                Add tags to help others find your notes more easily
                            </p>
                        </div>

                        {/* External Link (Alternative to File Upload) */}
                        <div>
                            <label htmlFor="externalLink" className="block text-sm font-medium text-secondary-700 mb-2">
                                External Link (Optional)
                            </label>
                            <input
                                type="url"
                                id="externalLink"
                                name="externalLink"
                                value={formData.externalLink}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="https://example.com/your-notes"
                            />
                            <p className="mt-1 text-sm text-secondary-500">
                                Link to your notes hosted on Google Drive, OneDrive, or other platforms
                            </p>
                        </div>

                        {/* File Upload (Optional - for future when storage is available) */}
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Upload File (Optional - Currently Disabled)
                            </label>
                            <div className="border-2 border-dashed border-secondary-200 rounded-lg p-6 text-center bg-secondary-50">
                                <Upload size={48} className="mx-auto text-secondary-300 mb-4" />
                                <p className="text-secondary-500 mb-2">
                                    File upload requires Firebase Storage (paid plan)
                                </p>
                                <p className="text-sm text-secondary-400">
                                    Use external links above to share your files for now
                                </p>
                            </div>
                        </div>

                        {/* Guidelines */}
                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                            <h4 className="font-medium text-primary-800 mb-2">Submission Guidelines:</h4>
                            <ul className="text-sm text-primary-700 space-y-1">
                                <li>• Ensure your notes are original or properly attributed</li>
                                <li>• Use clear and legible formatting</li>
                                <li>• Include relevant examples and explanations</li>
                                <li>• All submissions will be reviewed before publication</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {uploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} />
                                        <span>Submit for Review</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShareNotes;
