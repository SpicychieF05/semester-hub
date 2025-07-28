import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    closeOnOverlayClick = true,
    closeOnEscape = true,
    showCloseButton = true,
    className = ''
}) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (closeOnEscape && e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose, closeOnEscape]);

    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'max-w-md';
            case 'lg':
                return 'max-w-4xl';
            case 'xl':
                return 'max-w-6xl';
            case 'full':
                return 'max-w-[95vw] max-h-[95vh]';
            case 'md':
            default:
                return 'max-w-2xl';
        }
    };

    const handleOverlayClick = (e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleOverlayClick}
            />

            {/* Modal */}
            <div className="flex min-h-screen items-center justify-center p-4">
                <div
                    ref={modalRef}
                    tabIndex={-1}
                    className={`
                        relative w-full ${getSizeClasses()}
                        bg-white rounded-lg shadow-xl
                        transform transition-all duration-300
                        animate-modal-appear
                        ${className}
                    `}
                >
                    {/* Header */}
                    {(title || showCloseButton) && (
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            {title && (
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {title}
                                </h3>
                            )}
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label="Close modal"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Confirmation Modal
export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmButtonClass = 'btn-danger',
    isLoading = false
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="space-y-4">
                <p className="text-gray-600">{message}</p>

                <div className="flex space-x-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="btn-secondary disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`${confirmButtonClass} disabled:opacity-50 flex items-center space-x-2`}
                    >
                        {isLoading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        )}
                        <span>{confirmText}</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

// Form Modal
export const FormModal = ({
    isOpen,
    onClose,
    title,
    children,
    onSubmit,
    submitText = 'Save',
    cancelText = 'Cancel',
    isLoading = false,
    isValid = true
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {children}

                <div className="flex space-x-3 justify-end pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="btn-secondary disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || !isValid}
                        className="btn-primary disabled:opacity-50 flex items-center space-x-2"
                    >
                        {isLoading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        )}
                        <span>{submitText}</span>
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default Modal;
