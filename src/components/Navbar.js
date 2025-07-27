import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../supabase';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="container-responsive">
                <div className="flex justify-between h-14 sm:h-16">
                    {/* Logo and brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
                            <img
                                src="/images/sm-logo.png"
                                alt="Semester Hub"
                                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-primary-200"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <span className="text-lg sm:text-xl font-bold text-primary-700">
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
                                className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                to="/browse"
                                className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Browse Notes
                            </Link>
                            {user && (
                                <Link
                                    to="/share"
                                    className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Share Notes
                                </Link>
                            )}
                            <Link
                                to="/admin"
                                className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
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
                                        className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        <User size={20} />
                                        <span>{user.displayName || user.email}</span>
                                    </button>

                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 w-full text-left"
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
                                        className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
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
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-secondary-600 hover:text-primary-600 focus:outline-none focus:text-primary-600 p-2"
                            >
                                {isOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-secondary-200">
                            <Link
                                to="/"
                                className="text-secondary-600 hover:text-primary-600 flex items-center px-3 py-3 rounded-md text-base font-medium min-h-[44px]"
                                onClick={() => setIsOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/browse"
                                className="text-secondary-600 hover:text-primary-600 flex items-center px-3 py-3 rounded-md text-base font-medium min-h-[44px]"
                                onClick={() => setIsOpen(false)}
                            >
                                Browse Notes
                            </Link>
                            {user && (
                                <Link
                                    to="/share"
                                    className="text-secondary-600 hover:text-primary-600 flex items-center px-3 py-3 rounded-md text-base font-medium min-h-[44px]"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Share Notes
                                </Link>
                            )}
                            <Link
                                to="/admin"
                                className="text-secondary-600 hover:text-primary-600 flex items-center px-3 py-3 rounded-md text-base font-medium min-h-[44px]"
                                onClick={() => setIsOpen(false)}
                            >
                                Admin
                            </Link>

                            {user ? (
                                <div className="border-t border-secondary-200 pt-4">
                                    <div className="flex items-center px-3 py-3 min-h-[44px]">
                                        <User size={20} className="text-secondary-600 mr-2" />
                                        <span className="text-secondary-700 truncate">{user.displayName || user.email}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center px-3 py-3 text-secondary-600 hover:text-primary-600 w-full text-left min-h-[44px]"
                                    >
                                        <LogOut size={20} className="mr-2" />
                                        Sign out
                                    </button>
                                </div>
                            ) : (
                                <div className="border-t border-secondary-200 pt-4 space-y-2">
                                    <Link
                                        to="/login"
                                        className="text-secondary-600 hover:text-primary-600 flex items-center px-3 py-3 rounded-md text-base font-medium min-h-[44px]"
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
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
