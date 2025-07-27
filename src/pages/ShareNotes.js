import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

const ShareNotes = () => {
    const [user, setUser] = useState(null);
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

    // Auth state management
    useEffect(() => {
        // Get initial auth state
        const getInitialAuthState = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        getInitialAuthState();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);
    const [error, setError] = useState('');

    const subjects = [
        'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
        'English', 'History', 'Economics', 'Psychology', 'Engineering'
    ];

    const semesters = [
        'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
        'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'
    ];

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Check file size (limit to 10MB)
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB');
                return;
            }

            // Check file type (allow PDFs, images, docs)
            const allowedTypes = [
                'application/pdf',
                'image/jpeg',
                'image/png',
                'image/gif',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain'
            ];

            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Please select a valid file type (PDF, DOC, DOCX, TXT, or image)');
                return;
            }

            setFile(selectedFile);
            setError('');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const uploadFileToSupabase = async (file, noteId) => {
        try {
            const fileExtension = file.name.split('.').pop();
            const fileName = `${noteId}-${Date.now()}.${fileExtension}`;
            const filePath = `notes/${fileName}`;

            // Upload file to Supabase Storage
            const { error } = await supabase.storage
                .from('notes-files')
                .upload(filePath, file);

            if (error) {
                throw error;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('notes-files')
                .getPublicUrl(filePath);

            return {
                url: publicUrl,
                path: filePath,
                fileName: file.name,
                fileSize: file.size
            };
        } catch (error) {
            console.error('File upload error:', error);
            throw new Error('Failed to upload file. Please try again.');
        }
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

        // Validate that either file or external link is provided
        if (!file && !formData.externalLink.trim()) {
            setError('Please either upload a file or provide an external link to your notes');
            return;
        }

        setUploading(true);
        setError('');

        try {
            // Get current user from Supabase
            const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();

            if (userError || !currentUser) {
                setError('You must be logged in to share notes');
                setUploading(false);
                return;
            }

            // Get user profile from Supabase
            const { data: userProfile } = await supabase
                .from('users')
                .select('name, email')
                .eq('id', currentUser.id)
                .single();

            let fileUrl = formData.externalLink || '#';
            let fileName = 'External Link';
            let fileSize = null;

            // Upload file if provided
            if (file) {
                try {
                    // First create the note record to get an ID
                    const tempNoteData = {
                        title: formData.title,
                        subject: formData.subject,
                        semester: formData.semester,
                        description: formData.description,
                        file_url: '#', // Temporary placeholder
                        file_name: file.name,
                        file_size: file.size,
                        uploader_id: currentUser.id,
                        uploader_name: userProfile?.name || currentUser.email,
                        uploader_email: userProfile?.email || currentUser.email,
                        status: 'pending',
                        download_count: 0,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    };

                    const { data: noteRecord, error: noteError } = await supabase
                        .from('notes')
                        .insert([tempNoteData])
                        .select()
                        .single();

                    if (noteError) throw noteError;

                    // Upload file to Supabase Storage
                    const uploadResult = await uploadFileToSupabase(file, noteRecord.id);

                    // Update note with actual file URL
                    const { error: updateError } = await supabase
                        .from('notes')
                        .update({
                            file_url: uploadResult.url,
                            file_name: uploadResult.fileName,
                            file_size: uploadResult.fileSize
                        })
                        .eq('id', noteRecord.id);

                    if (updateError) throw updateError;

                    fileUrl = uploadResult.url;
                    fileName = uploadResult.fileName;
                    fileSize = uploadResult.fileSize;
                } catch (uploadError) {
                    console.error('File upload failed:', uploadError);
                    // Fall back to external link if file upload fails
                    if (!formData.externalLink) {
                        throw new Error('File upload failed and no external link provided');
                    }
                }
            } else {
                // Create note document in Supabase (external link only)
                const noteData = {
                    title: formData.title,
                    subject: formData.subject,
                    semester: formData.semester,
                    description: formData.description,
                    file_url: fileUrl,
                    file_name: fileName,
                    file_size: fileSize,
                    uploader_id: currentUser.id,
                    uploader_name: userProfile?.name || currentUser.email,
                    uploader_email: userProfile?.email || currentUser.email,
                    status: 'pending',
                    download_count: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                const { error } = await supabase
                    .from('notes')
                    .insert([noteData]);

                if (error) {
                    throw error;
                }
            }

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
                            Your note has been submitted successfully and is now pending review. Once approved by our admin team,
                            it will be available for other students to access. {file ? 'Your uploaded file has been securely stored.' : ''}
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

                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Upload File (Optional)
                            </label>
                            <div className="border-2 border-dashed border-secondary-200 rounded-lg p-6 text-center bg-secondary-50">
                                {!file ? (
                                    <>
                                        <Upload size={48} className="mx-auto text-secondary-400 mb-4" />
                                        <div className="space-y-2">
                                            <label htmlFor="file-upload" className="cursor-pointer">
                                                <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                                    Choose File
                                                </span>
                                                <input
                                                    id="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={handleFileChange}
                                                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                                                />
                                            </label>
                                            <p className="text-sm text-secondary-500">
                                                Or provide an external link above
                                            </p>
                                        </div>
                                        <p className="text-xs text-secondary-400 mt-2">
                                            Supports: PDF, DOC, DOCX, TXT, Images (Max: 10MB)
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                                        <p className="text-secondary-700 font-medium">{file.name}</p>
                                        <p className="text-sm text-secondary-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setFile(null)}
                                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                                        >
                                            Remove file
                                        </button>
                                    </>
                                )}
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
