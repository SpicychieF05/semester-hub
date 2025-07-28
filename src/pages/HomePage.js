import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Upload, Search, Award, Shield } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] xl:min-h-[800px] flex items-center">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                                         radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`
                    }}></div>
                </div>

                {/* Background glow effects - Responsive sizes */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-blue-400 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-purple-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-3/4 left-1/2 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-pink-400 rounded-full filter blur-2xl animate-pulse delay-500"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                                Your Premier Platform for
                                <span className="text-primary-200 block mt-2">Academic Excellence</span>
                            </h1>
                            <p className="text-lg lg:text-xl text-primary-100 mb-8 leading-relaxed">
                                Connect with fellow students, share knowledge, and access high-quality academic notes
                                to enhance your learning journey.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/browse"
                                    className="bg-white text-primary-700 hover:bg-primary-50 font-semibold py-4 px-8 rounded-lg transition-all duration-300 text-center shadow-lg"
                                >
                                    Browse Notes
                                </Link>
                                <Link
                                    to="/share"
                                    className="border-2 border-white text-white hover:bg-white hover:text-primary-700 font-semibold py-4 px-8 rounded-lg transition-all duration-300 text-center"
                                >
                                    Share Your Notes
                                </Link>
                            </div>
                        </div>
                        <div className="flex justify-center lg:justify-end">
                            <div className="relative group hero-image-container">
                                {/* Glow effect wrapper */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur-lg glow-effect"></div>

                                {/* Image container with enhanced styling */}
                                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
                                    <img
                                        src="/images/hero-image.gif"
                                        alt="Students learning together"
                                        className="hero-image w-full max-w-xs sm:max-w-sm lg:max-w-md h-auto rounded-xl shadow-2xl transition-all duration-500"
                                        loading="eager"
                                    />

                                    {/* Floating elements */}
                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce-custom opacity-80"></div>
                                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-400 rounded-full animate-bounce-custom opacity-80" style={{ animationDelay: '0.7s' }}></div>
                                    <div className="absolute top-1/4 -left-3 w-2 h-2 bg-pink-400 rounded-full animate-pulse-custom opacity-80"></div>
                                    <div className="absolute bottom-1/4 -right-3 w-2 h-2 bg-blue-400 rounded-full animate-pulse-custom opacity-80" style={{ animationDelay: '1s' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 lg:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                            Why Choose Semester Hub?
                        </h2>
                        <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
                            Empowering students with the tools and resources they need to succeed academically
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="text-primary-600 mb-4">
                                <BookOpen size={48} />
                            </div>
                            <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                                Quality Notes
                            </h3>
                            <p className="text-secondary-600">
                                Access carefully curated and reviewed academic notes from top students across various subjects and courses.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="text-primary-600 mb-4">
                                <Users size={48} />
                            </div>
                            <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                                Community Driven
                            </h3>
                            <p className="text-secondary-600">
                                Join a vibrant community of learners who support each other through knowledge sharing and collaboration.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="text-primary-600 mb-4">
                                <Upload size={48} />
                            </div>
                            <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                                Easy Sharing
                            </h3>
                            <p className="text-secondary-600">
                                Share your own notes effortlessly and contribute to the academic success of your peers.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="text-primary-600 mb-4">
                                <Search size={48} />
                            </div>
                            <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                                Smart Search
                            </h3>
                            <p className="text-secondary-600">
                                Find exactly what you need with our advanced search and filtering system across subjects and topics.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="text-primary-600 mb-4">
                                <Award size={48} />
                            </div>
                            <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                                Verified Content
                            </h3>
                            <p className="text-secondary-600">
                                All notes go through our quality review process to ensure accuracy and educational value.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="text-primary-600 mb-4">
                                <Shield size={48} />
                            </div>
                            <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                                Secure Platform
                            </h3>
                            <p className="text-secondary-600">
                                Your data and contributions are protected with enterprise-grade security and privacy measures.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 lg:py-20 bg-secondary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
                            <div className="text-secondary-600 font-medium">Students</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary-600 mb-2">5K+</div>
                            <div className="text-secondary-600 font-medium">Notes Shared</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary-600 mb-2">100+</div>
                            <div className="text-secondary-600 font-medium">Subjects</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
                            <div className="text-secondary-600 font-medium">Success Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Enhance Your Academic Journey?
                    </h2>
                    <p className="text-xl text-primary-100 mb-8">
                        Join thousands of students who are already benefiting from our platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="bg-white text-primary-700 hover:bg-primary-50 font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
                        >
                            Get Started Today
                        </Link>
                        <Link
                            to="/browse"
                            className="border-2 border-white text-white hover:bg-white hover:text-primary-700 font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
                        >
                            Explore Notes
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
