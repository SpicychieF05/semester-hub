import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Upload, Search, Award, Shield } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden min-h-[600px] flex items-center">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                                         radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`
                    }}></div>
                </div>

                {/* Background glow effects */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-3/4 left-1/2 w-32 h-32 bg-pink-400 rounded-full filter blur-2xl animate-pulse delay-500"></div>
                </div>

                <div className="container-responsive py-8 sm:py-12 lg:py-16 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
                                Your Premier Platform for
                                <span className="text-primary-200 block">Academic Excellence</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-primary-100 mb-6 sm:mb-8 leading-relaxed px-4 lg:px-0">
                                Connect with fellow students, share knowledge, and access high-quality academic notes
                                to enhance your learning journey.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-4 lg:px-0">
                                <Link
                                    to="/browse"
                                    className="btn-primary bg-white text-primary-700 hover:bg-primary-50 hover:scale-105 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 text-center shadow-lg hover:shadow-xl"
                                >
                                    Browse Notes
                                </Link>
                                <Link
                                    to="/share"
                                    className="border-2 border-white text-white hover:bg-white hover:text-primary-700 hover:scale-105 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 text-center min-h-[44px] flex items-center justify-center shadow-lg hover:shadow-xl"
                                >
                                    Share Your Notes
                                </Link>
                            </div>
                        </div>
                        <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
                            <div className="relative group">
                                {/* Glow effect wrapper */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

                                {/* Image container with enhanced styling */}
                                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
                                    <img
                                        src="/images/hero-image.gif"
                                        alt="Students learning together"
                                        className="w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg h-auto rounded-xl shadow-2xl transition-all duration-500 hover:scale-105 hover:rotate-1 hover:shadow-3xl"
                                        style={{
                                            filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3))'
                                        }}
                                        onError={(e) => {
                                            e.target.src = "/illustrations/undraw_education_3vwh.svg";
                                        }}
                                        loading="eager"
                                    />

                                    {/* Floating elements */}
                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce delay-300 opacity-80"></div>
                                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-400 rounded-full animate-bounce delay-700 opacity-80"></div>
                                    <div className="absolute top-1/4 -left-3 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-80"></div>
                                    <div className="absolute bottom-1/4 -right-3 w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-1000 opacity-80"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-white">
                <div className="container-responsive">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-900 mb-2 sm:mb-4 px-4">
                            Why Choose Semester Hub?
                        </h2>
                        <p className="text-lg sm:text-xl text-secondary-600 max-w-3xl mx-auto px-4">
                            Empowering students with the tools and resources they need to succeed academically
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
                        <div className="card hover:shadow-lg transition-shadow duration-300">
                            <div className="text-primary-600 mb-4">
                                <BookOpen size={40} className="sm:w-12 sm:h-12" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-3">
                                Quality Notes
                            </h3>
                            <p className="text-sm sm:text-base text-secondary-600">
                                Access carefully curated and reviewed academic notes from top students across various subjects and courses.
                            </p>
                        </div>

                        <div className="card hover:shadow-lg transition-shadow duration-300">
                            <div className="text-primary-600 mb-4">
                                <Users size={40} className="sm:w-12 sm:h-12" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-3">
                                Community Driven
                            </h3>
                            <p className="text-sm sm:text-base text-secondary-600">
                                Join a vibrant community of learners who support each other through knowledge sharing and collaboration.
                            </p>
                        </div>

                        <div className="card hover:shadow-lg transition-shadow duration-300">
                            <div className="text-primary-600 mb-4">
                                <Upload size={40} className="sm:w-12 sm:h-12" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-3">
                                Easy Sharing
                            </h3>
                            <p className="text-sm sm:text-base text-secondary-600">
                                Share your own notes effortlessly and contribute to the academic success of your peers.
                            </p>
                        </div>

                        <div className="card hover:shadow-lg transition-shadow duration-300">
                            <div className="text-primary-600 mb-4">
                                <Search size={40} className="sm:w-12 sm:h-12" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-3">
                                Smart Search
                            </h3>
                            <p className="text-sm sm:text-base text-secondary-600">
                                Find exactly what you need with our advanced search and filtering system across subjects and topics.
                            </p>
                        </div>

                        <div className="card hover:shadow-lg transition-shadow duration-300">
                            <div className="text-primary-600 mb-4">
                                <Award size={40} className="sm:w-12 sm:h-12" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-3">
                                Verified Content
                            </h3>
                            <p className="text-sm sm:text-base text-secondary-600">
                                All notes go through our quality review process to ensure accuracy and educational value.
                            </p>
                        </div>

                        <div className="card hover:shadow-lg transition-shadow duration-300">
                            <div className="text-primary-600 mb-4">
                                <Shield size={40} className="sm:w-12 sm:h-12" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-3">
                                Secure Platform
                            </h3>
                            <p className="text-sm sm:text-base text-secondary-600">
                                Your data and contributions are protected with enterprise-grade security and privacy measures.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-secondary-50">
                <div className="container-responsive">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
                        <div className="px-2">
                            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-600 mb-1 sm:mb-2">10K+</div>
                            <div className="text-sm sm:text-base text-secondary-600 font-medium">Students</div>
                        </div>
                        <div className="px-2">
                            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-600 mb-1 sm:mb-2">5K+</div>
                            <div className="text-sm sm:text-base text-secondary-600 font-medium">Notes Shared</div>
                        </div>
                        <div className="px-2">
                            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-600 mb-1 sm:mb-2">100+</div>
                            <div className="text-sm sm:text-base text-secondary-600 font-medium">Subjects</div>
                        </div>
                        <div className="px-2">
                            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-600 mb-1 sm:mb-2">95%</div>
                            <div className="text-sm sm:text-base text-secondary-600 font-medium">Success Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                        Ready to Enhance Your Academic Journey?
                    </h2>
                    <p className="text-lg sm:text-xl text-primary-100 mb-6 sm:mb-8 px-4 sm:px-0">
                        Join thousands of students who are already benefiting from our platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
                        <Link
                            to="/register"
                            className="btn-primary bg-white text-primary-700 hover:bg-primary-50 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-colors duration-200"
                        >
                            Get Started Today
                        </Link>
                        <Link
                            to="/browse"
                            className="border-2 border-white text-white hover:bg-white hover:text-primary-700 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center justify-center"
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
