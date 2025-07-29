import React, { useState, useCallback, useEffect } from 'react';
import { X, Bug, Send, User } from 'lucide-react';

const BugReportModal = ({ isOpen, onClose, user }) => {
    const [bugReportForm, setBugReportForm] = useState({
        page: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

    const closeBugReportModal = useCallback(() => {
        onClose();
        setSubmitStatus(null);
        setBugReportForm({ page: '', description: '' });
        setIsSubmitting(false);
    }, [onClose]);

    // Handle bug report form submission
    const handleBugReportSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Formspree endpoint for bug reports - sends to mallickchirantan@gmail.com
            const response = await fetch('https://formspree.io/f/mdkdzpzw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    page: bugReportForm.page,
                    description: bugReportForm.description,
                    subject: 'Bug Report from Semester Hub',
                    // Include user information
                    user_name: user?.name || user?.email || 'Unknown User',
                    user_email: user?.email || 'No email provided',
                    user_id: user?.id || 'No ID provided',
                    // Add timestamp
                    submitted_at: new Date().toISOString()
                }),
            });

            if (response.ok) {
                setSubmitStatus('success');
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error submitting bug report:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBugReportForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                closeBugReportModal();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, closeBugReportModal]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bug-report-modal-title"
            onClick={closeBugReportModal}
        >
            <div
                className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-gray-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h3 id="bug-report-modal-title" className="text-lg sm:text-xl font-bold text-black flex items-center">
                        <Bug className="mr-2 text-red-600" size={20} />
                        Report a Bug
                    </h3>
                    <button
                        onClick={closeBugReportModal}
                        className="text-gray-500 hover:text-black transition-colors p-1"
                        aria-label="Close bug report modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {submitStatus === 'success' ? (
                    // Success Message
                    <div className="text-center py-8">
                        <div className="bg-green-50 border border-green-300 rounded-lg p-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-green-100 rounded-full p-2">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                            </div>
                            <h4 className="text-lg font-semibold text-green-800 mb-2">Thank you!</h4>
                            <p className="text-green-700">
                                Your bug report has been sent successfully. We'll look into it and get back to you if needed.
                            </p>
                        </div>
                        <button
                            onClick={closeBugReportModal}
                            className="mt-4 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    // Bug Report Form
                    <>
                        <div className="mb-4">
                            <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 mb-4">
                                <div className="flex items-center space-x-2">
                                    <User className="text-blue-600" size={16} />
                                    <span className="text-blue-800 text-sm">
                                        Reporting as: <span className="font-medium">{user?.name || user?.email}</span>
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Help us improve Semester Hub by reporting any bugs or issues you encounter.
                            </p>
                        </div>

                        {/* 
                            Formspree form integration - sends bug reports to mallickchirantan@gmail.com
                            Form ID: mdkdzpzw
                        */}
                        <form onSubmit={handleBugReportSubmit} action="https://formspree.io/f/mdkdzpzw" method="POST">
                            <div className="space-y-4">
                                {/* Page Field */}
                                <div>
                                    <label htmlFor="page" className="block text-sm font-medium text-black mb-1">
                                        On what page did the bug occur? *
                                    </label>
                                    <input
                                        type="text"
                                        id="page"
                                        name="page"
                                        value={bugReportForm.page}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., Home page, Browse Notes, Share Notes..."
                                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg"
                                        disabled={isSubmitting}
                                        style={{
                                            color: '#000000',
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #d1d5db'
                                        }}
                                    />
                                </div>

                                {/* Description Field */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-black mb-1">
                                        Please describe the bug *
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={bugReportForm.description}
                                        onChange={handleInputChange}
                                        required
                                        rows={4}
                                        placeholder="Please describe what happened, what you expected to happen, and any steps to reproduce the issue..."
                                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg resize-vertical"
                                        disabled={isSubmitting}
                                        style={{
                                            color: '#000000',
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #d1d5db'
                                        }}
                                    />
                                </div>

                                {/* Error Message */}
                                {submitStatus === 'error' && (
                                    <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                                        <p className="text-red-700 text-sm">
                                            Oops! Something went wrong. Please try again or contact us directly.
                                        </p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeBugReportModal}
                                        className="px-4 py-2 text-gray-600 hover:text-black transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !bugReportForm.page.trim() || !bugReportForm.description.trim()}
                                        className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={16} className="mr-2" />
                                                Send Report
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default BugReportModal;
