import React, { useState, useEffect } from 'react';
import { Github, Linkedin, ExternalLink, BookOpen } from 'lucide-react';

const LoadingScreen = ({ onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(6);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            onComplete();
        }
    }, [timeLeft, onComplete]);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-2xl mx-auto text-center">
                {/* Logo and Title */}
                <div className="mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <BookOpen className="h-12 w-12 text-blue-400 mr-3" />
                        <h1 className="text-3xl font-bold text-white">Semester Hub</h1>
                    </div>

                    {/* Loading Animation with Timer */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative mb-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-bold text-blue-400">{timeLeft}</span>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Loading in {timeLeft} second{timeLeft !== 1 ? 's' : ''}...
                        </p>
                    </div>
                </div>

                {/* Main Message */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
                    <h2 className="text-xl font-semibold text-yellow-400 mb-4">
                        🚧 Semester Hub – Work in Progress 🚧
                    </h2>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        This web app is currently under active development to make academic note sharing
                        smoother and smarter for students like you.
                    </p>

                    <p className="text-gray-300 mb-4">
                        If you'd like to contribute, explore the code, or suggest improvements, check out the GitHub repository:
                    </p>

                    <a
                        href="https://github.com/SpicychieF05/semester-hub"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 mb-6"
                    >
                        <Github size={18} />
                        <span>🔗 Semester Hub GitHub Repo</span>
                        <ExternalLink size={16} />
                    </a>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-4">
                        Want to collaborate, give feedback, or just say hi?
                    </h3>

                    <div className="space-y-3">
                        <a
                            href="https://github.com/SpicychieF"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                        >
                            <Github size={18} />
                            <span>📬 GitHub: @SpicychieF</span>
                        </a>

                        <a
                            href="https://linkedin.com/in/chirantan-mallick"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                        >
                            <Linkedin size={18} />
                            <span>💼 LinkedIn: Chirantan Mallick</span>
                        </a>

                        <a
                            href="https://linktr.ee/chirantan_mallick"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                        >
                            <ExternalLink size={18} />
                            <span>🌐 Linktree: linktr.ee/chirantan_mallick</span>
                        </a>
                    </div>
                </div>

                {/* Footer Message */}
                <div className="mt-8">
                    <p className="text-gray-400 text-sm">
                        Stay tuned for exciting updates. Let's build the future of student collaboration together! 💡
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                    <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                            className="bg-blue-400 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${((6 - timeLeft) / 6) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-gray-500 text-xs mt-2">
                        {Math.round(((6 - timeLeft) / 6) * 100)}% loaded
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;