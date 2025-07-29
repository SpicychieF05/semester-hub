import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Github, Linkedin, Phone, MapPin, User, GraduationCap, X, Bug, Send } from 'lucide-react';

const Footer = () => {
    const [showContactModal, setShowContactModal] = useState(false);
    const [showBugReportModal, setShowBugReportModal] = useState(false);
    const [bugReportForm, setBugReportForm] = useState({
        page: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

    const openContactModal = useCallback(() => setShowContactModal(true), []);
    const closeContactModal = useCallback(() => setShowContactModal(false), []);

    const openBugReportModal = useCallback(() => {
        setShowBugReportModal(true);
        setSubmitStatus(null);
        setBugReportForm({ page: '', description: '' });
    }, []);

    const closeBugReportModal = useCallback(() => {
        setShowBugReportModal(false);
        setSubmitStatus(null);
        setBugReportForm({ page: '', description: '' });
        setIsSubmitting(false);
    }, []);

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
                    subject: 'Bug Report from Semester Hub'
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
                if (showContactModal) {
                    closeContactModal();
                } else if (showBugReportModal) {
                    closeBugReportModal();
                }
            }
        };

        if (showContactModal || showBugReportModal) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [showContactModal, showBugReportModal, closeContactModal, closeBugReportModal]);
    return (
        <footer className="bg-secondary-900 text-white">
            <div className="container-responsive py-8 sm:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                        <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                            <img
                                src="/images/sm-logo.png"
                                alt="Semester Hub Logo"
                                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-primary-200"
                                loading="lazy"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <span className="text-xl sm:text-2xl font-bold text-white">
                                Semester Hub
                            </span>
                        </div>
                        <p className="text-sm sm:text-base text-secondary-300 mb-4 sm:mb-6 max-w-md">
                            Your premier platform for sharing and accessing academic notes.
                            Empowering students through collaborative learning and knowledge sharing.
                        </p>
                        <div className="flex space-x-3 sm:space-x-4">
                            <a
                                href="https://github.com/spicychief05"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-secondary-400 hover:text-white transition-colors p-2"
                                aria-label="Visit GitHub Profile"
                            >
                                <Github size={18} className="sm:w-5 sm:h-5" />
                            </a>
                            <a
                                href="https://linkedin.com/in/chirantan-mallick"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-secondary-400 hover:text-white transition-colors p-2"
                                aria-label="Visit LinkedIn Profile"
                            >
                                <Linkedin size={18} className="sm:w-5 sm:h-5" />
                            </a>
                            <a
                                href="https://rb.gy/uxjdk"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Contact via WhatsApp"
                                className="text-secondary-400 hover:text-white transition-colors p-2"
                                aria-label="Contact via WhatsApp"
                            >
                                <MessageCircle size={18} className="sm:w-5 sm:h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-secondary-300 hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/browse" className="text-secondary-300 hover:text-white transition-colors">
                                    Browse Notes
                                </Link>
                            </li>
                            <li>
                                <Link to="/share" className="text-secondary-300 hover:text-white transition-colors">
                                    Share Notes
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin" className="text-secondary-300 hover:text-white transition-colors">
                                    Admin Panel
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Support */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact & Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <span
                                    className="text-secondary-300 hover:text-white transition-colors cursor-pointer"
                                    onClick={openContactModal}
                                >
                                    Contact Us
                                </span>
                            </li>
                            <li>
                                <span
                                    className="text-secondary-300 hover:text-white transition-colors cursor-pointer"
                                    onClick={openBugReportModal}
                                >
                                    Help Center
                                </span>
                            </li>
                            <li>
                                <span
                                    className="text-secondary-300 hover:text-white transition-colors cursor-pointer"
                                    onClick={() => alert('Terms of Service coming soon!')}
                                >
                                    Terms of Service
                                </span>
                            </li>
                            <li>
                                <span
                                    className="text-secondary-300 hover:text-white transition-colors cursor-pointer"
                                    onClick={() => alert('Privacy Policy coming soon!')}
                                >
                                    Privacy Policy
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-secondary-700 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 text-secondary-300 mb-4 md:mb-0">
                            <span>© 2025 Semester Hub. All rights reserved.</span>
                            <Heart size={16} className="text-red-500" fill="currentColor" />
                            <span>Created by</span>
                            <span className="font-semibold text-white">Chirantan Mallick</span>
                        </div>
                        <div className="text-secondary-400 text-sm">
                            Built with React 18, Supabase, Tailwind CSS, Lucide Icons & React Router
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Us Modal */}
            {showContactModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="contact-modal-title"
                    onClick={closeContactModal}
                >
                    <div
                        className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h3 id="contact-modal-title" className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Contact Developer</h3>
                            <button
                                onClick={closeContactModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                aria-label="Close contact modal"
                            >
                                <X size={20} className="sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Developer Info */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                                <div className="flex items-center space-x-3 mb-4">
                                    <User className="text-blue-600" size={24} />
                                    <h4 className="text-xl font-semibold text-gray-900">Chirantan Mallick</h4>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-700 mb-2">
                                    <GraduationCap size={18} className="text-purple-600" />
                                    <span>BCA 3rd Year Student</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <MapPin size={18} className="text-green-600" />
                                    <span>Seacom Skills University, Kendrangal, Birbhum</span>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {/* Phone */}
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                                        <Phone className="text-green-600" size={18} />
                                        <span className="font-medium text-gray-900 text-sm sm:text-base">Phone</span>
                                    </div>
                                    <a
                                        href="tel:+918327438929"
                                        className="text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base"
                                    >
                                        +91 8327438929
                                    </a>
                                </div>

                                {/* WhatsApp */}
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                                        <MessageCircle className="text-green-600" size={18} />
                                        <span className="font-medium text-gray-900 text-sm sm:text-base">WhatsApp</span>
                                    </div>
                                    <a
                                        href="https://rb.gy/uxjdk"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base"
                                    >
                                        Chat on WhatsApp
                                    </a>
                                </div>

                                {/* GitHub */}
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                                        <Github className="text-gray-800" size={18} />
                                        <span className="font-medium text-gray-900 text-sm sm:text-base">GitHub</span>
                                    </div>
                                    <a
                                        href="https://github.com/spicychief05"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base"
                                    >
                                        @spicychief05
                                    </a>
                                </div>

                                {/* LinkedIn */}
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                                        <Linkedin className="text-blue-600" size={18} />
                                        <span className="font-medium text-gray-900 text-sm sm:text-base">LinkedIn</span>
                                    </div>
                                    <a
                                        href="https://linkedin.com/in/chirantan-mallick"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 transition-colors text-sm sm:text-base"
                                    >
                                        Chirantan Mallick
                                    </a>
                                </div>
                            </div>

                            {/* Discord Community */}
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
                                <h5 className="text-lg font-semibold text-gray-900 mb-3">Join Our Community</h5>
                                <div className="flex items-center space-x-3">
                                    <div className="bg-indigo-600 p-2 rounded-lg">
                                        <MessageCircle className="text-white" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">Discord Server: Codiverse</div>
                                        <div className="text-sm text-gray-600">Connect with fellow developers and students</div>
                                    </div>
                                    <a
                                        href="https://discord.gg/mc2jRBuV"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Join Server
                                    </a>
                                </div>
                            </div>

                            {/* Quick Message */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-gray-700 text-center">
                                    <span className="font-medium">Have questions or suggestions?</span>
                                    <br />
                                    Feel free to reach out through any of the channels above. I'm always happy to help and connect with fellow students and developers!
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={closeContactModal}
                                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bug Report Modal */}
            {showBugReportModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="bug-report-modal-title"
                    onClick={closeBugReportModal}
                >
                    <div
                        className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h3 id="bug-report-modal-title" className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                                <Bug className="mr-2 text-red-500" size={20} />
                                Report a Bug
                            </h3>
                            <button
                                onClick={closeBugReportModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                aria-label="Close bug report modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {submitStatus === 'success' ? (
                            // Success Message
                            <div className="text-center py-8">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
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
                                            <label htmlFor="page" className="block text-sm font-medium text-gray-700 mb-1">
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        {/* Description Field */}
                                        <div>
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        {/* Error Message */}
                                        {submitStatus === 'error' && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
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
                                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
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
            )}
        </footer>
    );
};

export default Footer;
