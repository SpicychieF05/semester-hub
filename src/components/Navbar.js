import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../supabase';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <nav className="bg-white dark:bg-dark-secondary shadow-lg sticky top-0 z-50 transition-colors duration-600 ease-theme border-b border-gray-200 dark:border-border-subtle backdrop-blur-md">
            <div className="container-responsive">
                <div className="flex justify-between h-14 sm:h-16">
                    {/* Logo and brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
                            <img
                                src="https://res.cloudinary.com/dlxybta5a/image/upload/v1757098209/Untitled_design-removebg-preview_qvyorn.png"
                                alt="Semester Hub"
                                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-primary-200"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <span className="text-lg sm:text-xl font-bold text-primary-700 dark:text-text-primary">
                                Semester Hub
                            </span>
                        </Link>
                    </div>

                    {/* Navigation and User Menu */}
                    <div className="flex items-center space-x-4 sm:space-x-6">
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-6">
                            <Link
                                to="/"
                                className="text-secondary-600 dark:text-text-secondary hover:text-primary-600 dark:hover:text-link-hover px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                to="/browse"
                                className="text-secondary-600 dark:text-text-secondary hover:text-primary-600 dark:hover:text-link-hover px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                <span className="text-secondary-600 dark:text-text-neon-white">Browse Notes</span>
                            </Link>
                            {user && (
                                <Link
                                    to="/share"
                                    className="text-secondary-600 dark:text-text-secondary hover:text-primary-600 dark:hover:text-link-hover px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Share Notes
                                </Link>
                            )}
                            <Link
                                to="/admin"
                                className="text-secondary-600 dark:text-text-secondary hover:text-primary-600 dark:hover:text-link-hover px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Admin
                            </Link>
                        </div>

                        {/* User Menu */}
                        <div className="hidden md:flex items-center space-x-4">
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center space-x-2 text-secondary-600 dark:text-text-secondary hover:text-primary-600 dark:hover:text-link-hover px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        <User size={20} />
                                        <span>{user.displayName || user.email}</span>
                                    </button>

                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-elevated rounded-md shadow-lg border border-gray-200 dark:border-border-primary py-1 z-50 backdrop-blur-sm">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 dark:text-text-secondary hover:bg-secondary-100 dark:hover:bg-dark-surface w-full text-left transition-colors"
                                            >
                                                <LogOut size={16} />
                                                <span>Sign out</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to="/login"
                                        className="text-secondary-600 dark:text-text-secondary hover:text-primary-600 dark:hover:text-link-hover px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn-primary"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}

                            {/* Theme Toggle */}
                            <div className="flex items-center">
                                <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
                            </div>
                        </div>                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-secondary-600 dark:text-text-secondary hover:text-primary-600 dark:hover:text-link-hover focus:outline-none focus:text-primary-600 dark:focus:text-link-focus p-2 transition-colors"
                            >
                                {isOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-dark-secondary border-t border-secondary-200 dark:border-border-subtle backdrop-blur-md">
                            <Link
                                to="/"
                                className="text-secondary-600 dark:text-text-secondary hover:text-primary-600 dark:hover:text-link-hover flex items-center px-3 py-3 rounded-md text-base font-medium min-h-[44px] transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/browse"
                                className="text-secondary-600 dark:text-text-secondary hover:text-primary-600 dark:hover:text-link-hover flex items-center px-3 py-3 rounded-md text-base font-medium min-h-[44px] transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="text-secondary-600 dark:text-text-neon-white">Browse Notes</span>
                            </Link>
                            {user && (
                                <Link
                                    to="/share"
                                    className="text-secondary-600 dark:text-text-secondary hover:text-primary-600 dark:hover:text-link-hover flex items-center px-3 py-3 rounded-md text-base font-medium min-h-[44px] transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Share Notes
                                </Link>
                            )}
                            <Link
                                to="/admin"
                                className="text-secondary-600 dark:text-text-secondary hover:text-primary-600 dark:hover:text-link-hover flex items-center px-3 py-3 rounded-md text-base font-medium min-h-[44px] transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Admin
                            </Link>

                            {user ? (
                                <div className="border-t border-secondary-200 dark:border-border-subtle pt-4">
                                    <div className="flex items-center px-3 py-3 min-h-[44px]">
                                        <User size={20} className="text-secondary-600 dark:text-text-secondary mr-2" />
                                        <span className="text-secondary-700 dark:text-text-primary truncate">{user.displayName || user.email}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center px-3 py-3 text-secondary-600 dark:text-text-secondary hover:text-primary-600 dark:hover:text-link-hover w-full text-left min-h-[44px] transition-colors"
                                    >
                                        <LogOut size={20} className="mr-2" />
                                        Sign out
                                    </button>
                                </div>
                            ) : (
                                <div className="border-t border-secondary-200 dark:border-border-subtle pt-4 space-y-2">
                                    <Link
                                        to="/login"
                                        className="text-secondary-600 dark:text-text-secondary hover:text-primary-600 dark:hover:text-link-hover flex items-center px-3 py-3 rounded-md text-base font-medium min-h-[44px] transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn-primary block text-center mx-3 text-sm"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}

                            {/* Theme Toggle for Mobile */}
                            <div className="border-t border-secondary-200 dark:border-border-subtle pt-4 flex justify-center">
                                <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
