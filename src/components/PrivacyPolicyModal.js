import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
    const closeModal = useCallback(() => {
        onClose();
    }, [onClose]);

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                closeModal();
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
    }, [isOpen, closeModal]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-modal-title"
            onClick={closeModal}
        >
            <div
                className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-gray-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h3 id="privacy-modal-title" className="text-lg sm:text-xl font-bold text-black">
                        Privacy Policy
                    </h3>
                    <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-black transition-colors p-1"
                        aria-label="Close privacy policy modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="text-gray-800 space-y-4 text-sm sm:text-base">
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">1. Introduction</h4>
                        <p>Semester Hub ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information.</p>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">2. Information We Collect</h4>

                        <div className="mb-4">
                            <h5 className="font-semibold text-gray-900 mb-2">a. Personal Information</h5>
                            <ul className="list-disc ml-6 space-y-1">
                                <li><strong>Account Information:</strong> When you register, we collect your name, email address, and optionally, profile details.</li>
                                <li><strong>Authentication Data:</strong> Supabase authentication services store your login credentials securely.</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h5 className="font-semibold text-gray-900 mb-2">b. Usage Data</h5>
                            <ul className="list-disc ml-6 space-y-1">
                                <li><strong>Activity Logs:</strong> Information about your interactions (e.g., uploaded, viewed, or downloaded notes) may be stored for audit and moderation purposes.</li>
                                <li><strong>Device and Access Info:</strong> Aggregated information such as browser, IP address, and device type for security, analytics, and troubleshooting.</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h5 className="font-semibold text-gray-900 mb-2">c. Uploaded Content</h5>
                            <p>Notes and files you upload may contain personal identifiers; please ensure you do not share sensitive personal information within shared documents.</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">3. How We Use Your Information</h4>
                        <ul className="list-disc ml-6 space-y-1">
                            <li><strong>To provide and operate the Platform:</strong> Including account management and content synchronization.</li>
                            <li><strong>To improve the service:</strong> Analytics and feedback help us enhance Platform features.</li>
                            <li><strong>For moderation and security:</strong> Reviewing uploaded content and maintaining academic integrity.</li>
                            <li><strong>To communicate with users:</strong> Sending notifications about account or content status.</li>
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">4. Sharing and Disclosure</h4>
                        <ul className="list-disc ml-6 space-y-1">
                            <li><strong>With Platform Administrators:</strong> For moderation and management.</li>
                            <li><strong>With Other Users:</strong> Approved notes are accessible to other registered users.</li>
                            <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect Platform rights and user safety.</li>
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">5. Data Security</h4>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>The Platform uses Supabase's secure backend with Row Level Security (RLS) to control access.</li>
                            <li>Uploaded files reside in Supabase public storage, accessible only as permitted by platform policies.</li>
                            <li>Passwords and authentication details are securely managed through Supabase Auth.</li>
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">6. Data Retention and Deletion</h4>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>User-uploaded notes remain available unless removed by the user or by admin moderation.</li>
                            <li>Account information can be deleted upon request; some data may be retained if required for compliance or moderation actions.</li>
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">7. Cookies and Tracking</h4>
                        <p>Semester Hub may use browser cookies and similar technologies for secure authentication, session management, and analytics. No third-party ad tracking is implemented.</p>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">8. Children's Privacy</h4>
                        <p>Semester Hub is intended for university and higher-education students. The Platform does not knowingly collect data from children under 13.</p>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">9. International Users</h4>
                        <p>Data may be processed and stored in accordance with the hosting provider's location (Vercel, Supabase).</p>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">10. Changes to this Policy</h4>
                        <p>We may update this policy as the Platform evolves. All changes will be posted, and continued use implies acceptance.</p>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">11. Contact</h4>
                        <p>For any privacy concerns or requests (data deletion, corrections), contact the developer as listed in the GitHub repository or platform page.</p>
                    </div>

                    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 text-center">
                            <strong>Last updated: July 30, 2025</strong><br />
                            By Chirantan Mallick
                        </p>
                    </div>
                </div>

                <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                    <button
                        onClick={closeModal}
                        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyModal;
