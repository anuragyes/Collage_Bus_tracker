import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black text-white py-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="flex flex-col items-start">
                    <div className="flex items-center mb-4">

                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Finder!
                        </h1>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                        Finder is a very useful mobile app to track the current whereabouts of the bus and get real-time updates.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                            <i className="fab fa-instagram"></i>
                        </a>
                    </div>
                </div>

                {/* Navigation */}
                <div>
                    <h4 className="text-lg font-semibold mb-4">Navigation</h4>
                    <ul className="space-y-2">
                        <li>
                            <a href="#" className="flex items-center text-gray-400 hover:text-white transition-colors duration-300">
                                <span className="text-yellow-500 mr-2">&gt;</span> Home
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center text-gray-400 hover:text-white transition-colors duration-300">
                                <span className="text-yellow-500 mr-2">&gt;</span> About Us
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center text-gray-400 hover:text-white transition-colors duration-300">
                                <span className="text-yellow-500 mr-2">&gt;</span> msb for Parents
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center text-gray-400 hover:text-white transition-colors duration-300">
                                <span className="text-yellow-500 mr-2">&gt;</span> msb for Schools
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center text-gray-400 hover:text-white transition-colors duration-300">
                                <span className="text-yellow-500 mr-2">&gt;</span> Contact Us
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Sales Contact */}
                <div>
                    <h4 className="text-lg font-semibold mb-4">Sales Contact</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li>
                            <p>Monday-Friday: .......... 8AM-5PM (IST)</p>
                        </li>
                        <li>
                            <p>Phone: ............. +917622888880</p>
                        </li>
                        <li>
                            <p>Email: ............. sales@tnowindia.in</p>
                        </li>
                    </ul>
                </div>

                {/* Customer Support */}
                <div>
                    <h4 className="text-lg font-semibold mb-4">Customer Support</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li>
                            <p>Monday-Friday: .......... 8AM-5PM (IST)</p>
                        </li>
                        <li>
                            <p>Phone: ............. +919301409957</p>
                        </li>
                        <li>
                            <p>Email: ............. anuragpandey2202@gmail.com</p>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Footer bottom section with two yellow icons */}
            <div className="max-w-7xl mx-auto mt-8 flex justify-end">
                <a href="#" className="text-yellow-500 mx-2 hover:text-white">
                    <i className="fas fa-arrow-up"></i>
                </a>
                <a href="#" className="text-yellow-500 mx-2 hover:text-white">
                    <i className="fas fa-envelope"></i>
                </a>
            </div>
        </footer>
    );
};

export default Footer;