import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const TermsOfServiceModal = ({ isOpen, onClose }) => {
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
            aria-labelledby="terms-modal-title"
            onClick={closeModal}
        >
            <div
                className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-gray-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h3 id="terms-modal-title" className="text-lg sm:text-xl font-bold text-black">
                        Terms of Service
                    </h3>
                    <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-black transition-colors p-1"
                        aria-label="Close terms of service modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="text-gray-800 space-y-4 text-sm sm:text-base">
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">1. Acceptance of Terms</h4>
                        <p>By accessing or using Semester Hub ("the Platform"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use the Platform.</p>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">2. Description of Service</h4>
                        <p>Semester Hub is an academic note-sharing platform enabling users to upload, browse, and download academic notes by departments and semesters. The service leverages user authentication, real-time data synchronization, and admin moderation for secure and collaborative learning.</p>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">3. Account Registration</h4>
                        <p>You must register for an account to upload or download notes. You are responsible for maintaining the confidentiality of your account information and are liable for all activities under your account.</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>You must provide accurate and complete information during registration.</li>
                            <li>You may not use another person's account without permission.</li>
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">4. User Content & Conduct</h4>
                        <p>You are solely responsible for the content you upload or share on the Platform.</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Do not upload materials that infringe intellectual property rights, contain malware, hate speech, or violate any law.</li>
                            <li>Only upload notes and resources you have rights to share.</li>
                            <li>Admins reserve the right to review, approve, or remove any content at their discretion. Users who repeatedly violate these standards may have their accounts suspended or terminated.</li>
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">5. Admin Rights & Moderation</h4>
                        <p>Semester Hub uses a comprehensive admin moderation system:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Notes are subject to admin review before becoming generally accessible.</li>
                            <li>The admin dashboard enables content management and user statistics.</li>
                            <li>Admins may remove or restrict access to any infringing or inappropriate content.</li>
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">6. Use of Platform</h4>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>You may access, download, and use content for personal academic purposes only.</li>
                            <li>Commercial use or redistribution of materials is prohibited unless expressly permitted.</li>
                            <li>Automated scraping or exploitation of the Platform's resources is not allowed.</li>
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">7. Intellectual Property</h4>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Uploaded content remains the property of the respective owner.</li>
                            <li>By uploading content, you grant Semester Hub a license to distribute and display the material on the Platform.</li>
                            <li>The Platform UI and software code are protected and may not be copied or reused without authorization.</li>
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">8. Service Availability</h4>
                        <p>semesterhub.vercel.app is provided "as is." While efforts are made to ensure uptime and functionality, services may experience outages, updates, or interruptions.</p>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">9. Disclaimer of Warranties</h4>
                        <p>Semester Hub is provided without any warranties or guarantees. Information shared or accessed via the Platform is for educational purposes and may not always be accurate or up to date.</p>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">10. Limitation of Liability</h4>
                        <p>Under no circumstances shall Semester Hub, its developers, or affiliates be liable for any damages arising from the use of the Platform, including but not limited to, loss of data or academic standing.</p>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">11. Changes to Terms</h4>
                        <p>These Terms of Service may be updated periodically. Continued use of the Platform after changes are posted constitutes your acceptance of those changes.</p>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2 text-gray-900">12. Contact</h4>
                        <p>For questions or issues regarding the Terms of Service, please contact the developer (Chirantan Mallick) via the links provided in the platform or GitHub repository.</p>
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

export default TermsOfServiceModal;
