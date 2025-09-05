import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Github, Linkedin, Phone, MapPin, User, GraduationCap, X } from 'lucide-react';
import BugReportModal from './BugReportModal';
import TermsOfServiceModal from './TermsOfServiceModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';

const Footer = ({ user }) => {
    const [showContactModal, setShowContactModal] = useState(false);
    const [showBugReportModal, setShowBugReportModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const openContactModal = useCallback(() => setShowContactModal(true), []);
    const closeContactModal = useCallback(() => setShowContactModal(false), []);

    const openTermsModal = useCallback(() => setShowTermsModal(true), []);
    const closeTermsModal = useCallback(() => setShowTermsModal(false), []);

    const openPrivacyModal = useCallback(() => setShowPrivacyModal(true), []);
    const closePrivacyModal = useCallback(() => setShowPrivacyModal(false), []);

    const openBugReportModal = useCallback(() => {
        // Check if user is logged in
        if (!user) {
            alert('Please log in to report bugs. This helps us provide better support and follow up if needed.');
            return;
        }
        setShowBugReportModal(true);
    }, [user]);

    const closeBugReportModal = useCallback(() => {
        setShowBugReportModal(false);
    }, []);

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                if (showContactModal) {
                    closeContactModal();
                }
            }
        };

        if (showContactModal) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [showContactModal, closeContactModal]);
    return (
        <footer className="bg-secondary-900 text-white">
            <div className="container-responsive py-8 sm:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                        <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                            <img
                                src="https://res.cloudinary.com/dlxybta5a/image/upload/v1757098209/Untitled_design-removebg-preview_qvyorn.png"
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
                                <svg
                                    width="18"
                                    height="18"
                                    className="sm:w-5 sm:h-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488" />
                                </svg>
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
                                    Bug Report
                                </span>
                            </li>
                            <li>
                                <span
                                    className="text-secondary-300 hover:text-white transition-colors cursor-pointer"
                                    onClick={openTermsModal}
                                >
                                    Terms of Service
                                </span>
                            </li>
                            <li>
                                <span
                                    className="text-secondary-300 hover:text-white transition-colors cursor-pointer"
                                    onClick={openPrivacyModal}
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
                            <span className="mx-2">|</span>
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
                                        <svg
                                            className="text-white"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.120.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                        </svg>
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
            <BugReportModal
                isOpen={showBugReportModal}
                onClose={closeBugReportModal}
                user={user}
            />

            {/* Terms of Service Modal */}
            <TermsOfServiceModal
                isOpen={showTermsModal}
                onClose={closeTermsModal}
            />

            {/* Privacy Policy Modal */}
            <PrivacyPolicyModal
                isOpen={showPrivacyModal}
                onClose={closePrivacyModal}
            />
        </footer>
    );
};

export default Footer;
