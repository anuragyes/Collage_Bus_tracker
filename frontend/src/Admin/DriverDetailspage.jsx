


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import IdentityCard from "../Admin/Card";

// ... (Keep all the previous DocumentViewer, ProfileImageView, StatCard components as they are)
const DocumentViewer = ({ src, alt, type }) => {
    const [hasError, setHasError] = useState(false);
    const [fileType, setFileType] = useState('unknown');
    const [correctedUrl, setCorrectedUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (src) {
            setIsLoading(true);
            let detectedType = 'unknown';
            let finalUrl = src;

            // Enhanced file type detection
            const isPDF = src.toLowerCase().endsWith('.pdf') ||
                src.includes('.pdf') ||
                (src.includes('cloudinary.com') && src.toLowerCase().includes('.pdf'));

            const isImage = src.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/) ||
                src.includes('/image/upload/') && !isPDF;

            if (isPDF) {
                detectedType = 'pdf';
                if (src.includes('cloudinary.com')) {
                    if (src.includes('/image/upload/')) {
                        finalUrl = src.replace('/image/upload/', '/raw/upload/');
                    }
                    const downloadUrl = src.includes('/image/upload/')
                        ? src.replace('/image/upload/', '/raw/upload/')
                        : src;
                    finalUrl = downloadUrl;
                }
            } else if (isImage) {
                detectedType = 'image';
            }

            setFileType(detectedType);
            setCorrectedUrl(finalUrl);
            setHasError(false);
            setIsLoading(false);
        }
    }, [src, type]);

    const handleViewPDF = async (e) => {
        e.preventDefault();
        const methods = [
            () => window.open(correctedUrl, '_blank'),
            () => window.open(`https://docs.google.com/gview?url=${encodeURIComponent(correctedUrl)}&embedded=true`, '_blank'),
            () => window.open(`/pdf-viewer.html?file=${encodeURIComponent(correctedUrl)}`, '_blank'),
        ];

        for (let i = 0; i < methods.length; i++) {
            try {
                methods[i]();
                break;
            } catch (error) {
                if (i === methods.length - 1) {
                    alert('Unable to open PDF. Please try downloading the file instead.');
                }
            }
        }
    };

    const handleDownloadPDF = (e) => {
        e.preventDefault();
        const link = document.createElement('a');
        link.href = correctedUrl;
        link.download = `${type}_${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getDocumentIcon = (docType) => {
        switch (docType) {
            case 'profile_photo':
                return (
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'aadhaar_card':
                return (
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                );
            case 'drivers_license':
                return (
                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
        }
    };

    if (isLoading) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
        );
    }

    if (!src) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 transition-all hover:border-blue-300">
                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-gray-500 text-sm font-medium">No document</span>
                <span className="text-gray-400 text-xs mt-1">Upload {type.replace('_', ' ')}</span>
            </div>
        );
    }

    if (fileType === 'pdf') {
        return (
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl h-48 flex flex-col items-center justify-center border-2 border-dashed border-red-200 p-4 transition-all hover:shadow-md">
                <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-3">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <p className="text-gray-800 font-semibold mb-1 text-center">PDF Document</p>
                <p className="text-gray-600 text-xs text-center mb-4 capitalize">
                    {type.replace('_', ' ')}
                </p>
                <div className="flex gap-2 flex-wrap justify-center">
                    <button
                        onClick={handleViewPDF}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 text-sm font-semibold shadow-sm flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 text-sm font-semibold shadow-sm flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                    </button>
                </div>
            </div>
        );
    }

    if (fileType === 'image') {
        return (
            <div className="relative group rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="h-48 bg-gray-100 relative">
                    <img
                        src={correctedUrl}
                        alt={alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => setHasError(true)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                    <div className="absolute top-3 right-3 bg-white bg-opacity-90 text-gray-700 text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                        IMAGE
                    </div>
                    <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={() => window.open(correctedUrl, '_blank')}
                            className="bg-white text-gray-700 text-xs px-3 py-1 rounded-full font-medium shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            View Full Size
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 transition-all hover:shadow-md">
            {getDocumentIcon(type)}
            <p className="text-gray-800 font-semibold mb-2 mt-3">Document</p>
            <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-105 text-sm font-semibold shadow-sm"
            >
                Open Document
            </a>
        </div>
    );
};

const ProfileImageView = ({ src, alt, size = "large" }) => {
    const [hasError, setHasError] = useState(false);
    
    const sizes = {
        small: "w-16 h-16",
        medium: "w-20 h-20",
        large: "w-24 h-24",
        xlarge: "w-32 h-32"
    };

    const iconSizes = {
        small: "w-6 h-6",
        medium: "w-8 h-8",
        large: "w-10 h-10",
        xlarge: "w-12 h-12"
    };

    if (!src || hasError) {
        return (
            <div className={`${sizes[size]} rounded-2xl bg-gradient-to-br from-gray-200 to-blue-200 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 shadow-inner`}>
                <svg className={`${iconSizes[size]} text-gray-400 mb-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-gray-500 text-xs text-center">No Photo</span>
            </div>
        );
    }

    return (
        <div className="relative">
            <img
                src={src}
                alt={alt}
                className={`${sizes[size]} rounded-2xl object-cover shadow-lg border-4 border-white transition-all hover:shadow-xl hover:scale-105`}
                onError={() => setHasError(true)}
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg border-2 border-white">
                ✓
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color = "blue" }) => {
    const colors = {
        blue: "from-blue-500 to-blue-600",
        green: "from-green-500 to-green-600",
        purple: "from-purple-500 to-purple-600",
        orange: "from-orange-500 to-orange-600"
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${colors[color]} text-white shadow-sm`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-gray-600 font-medium">{label}</p>
                    <p className="text-lg font-bold text-gray-900">{value || "Not set"}</p>
                </div>
            </div>
        </div>
    );
};

const DriverDetailsPage = () => {
    const { driverId } = useParams();
    const navigate = useNavigate();
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchDriver = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`https://collage-bus-tracker-backend.onrender.com/api/driverprofile/admin/drivers/${driverId}`);
                console.log("this is the response of driver details ", res);
                setDriver(res.data.driver);
            } catch (err) {
                console.error('Error fetching driver:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDriver();
    }, [driverId]);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'Not provided';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Calculate age from date of birth
    const calculateAge = (dob) => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Get driver status
    const getDriverStatus = () => {
        if (!driver) return 'Unknown';
        
        if (driver.isDriving) return 'Driving';
        if (driver.isAssigned) return 'Assigned (Not Driving)';
        return 'Available';
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Driving': return 'from-green-500 to-green-600';
            case 'Assigned (Not Driving)': return 'from-blue-500 to-blue-600';
            case 'Available': return 'from-gray-500 to-gray-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
                    <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                </div>
                <div className="text-center">
                    <p className="text-gray-700 font-semibold text-lg mb-2">Loading driver details</p>
                    <p className="text-gray-500 text-sm">Please wait while we fetch the information...</p>
                </div>
            </div>
        </div>
    );

    if (!driver) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center max-w-md mx-4">
                <div className="text-8xl mb-6">😕</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Driver Not Found</h2>
                <p className="text-gray-600 mb-8 text-lg">
                    The driver you're looking for doesn't exist or may have been removed.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={() => navigate('/admin/drivers')}
                        className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                    >
                        View All Drivers
                    </button>
                </div>
            </div>
        </div>
    );

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'personal', label: 'Personal Info', icon: '👤' },
        { id: 'documents', label: 'Documents', icon: '📁' },
        { id: 'identity', label: 'Identity Card', icon: '🪪' },
    ];

    const driverStatus = getDriverStatus();
    const driverAge = calculateAge(driver.dateOfBirth);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-all transform hover:scale-105 font-semibold group"
                    >
                        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Drivers
                    </button>

                    {/* Profile Header Card */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl shadow-2xl overflow-hidden">
                        <div className="p-8 text-white">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                                <div className="flex-shrink-0">
                                    <ProfileImageView
                                        src={driver.photoUrl}
                                        alt={driver.name}
                                        size="xlarge"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3">
                                        <h1 className="text-4xl font-bold">{driver.name}</h1>
                                        <div className={`mt-2 lg:mt-0 px-4 py-2 rounded-full bg-gradient-to-r ${getStatusColor(driverStatus)} text-white text-sm font-semibold shadow-lg`}>
                                            {driverStatus}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-6 text-blue-100">
                                        <span className="flex items-center gap-2 text-lg">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {driver.email}
                                        </span>
                                        <span className="flex items-center gap-2 text-lg">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            {driver.phoneNumber}
                                        </span>
                                        {driverAge && (
                                            <span className="flex items-center gap-2 text-lg">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {driverAge} years
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white border-opacity-30">
                                    <p className="text-gray-600 text-sm font-semibold">Assigned Bus</p>
                                    <p className="text-gray-600 font-bold text-2xl">{driver.busNumber || "Not assigned"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon="🚌"
                        label="Bus Number"
                        value={driver.busNumber || "Not assigned"}
                        color="blue"
                    />
                    <StatCard
                        icon="🆔"
                        label="License Number"
                        value={driver.licenseNumber || "Not provided"}
                        color="green"
                    />
                    <StatCard
                        icon="🩸"
                        label="Blood Group"
                        value={driver.bloodGroup || "Not provided"}
                        color="red"
                    />
                    <StatCard
                        icon="📅"
                        label="Member Since"
                        value={formatDate(driver.createdAt)}
                        color="purple"
                    />
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
                    <div className="flex border-b border-gray-200 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 min-w-max py-4 px-6 text-center font-semibold transition-all ${
                                    activeTab === tab.id
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Driver Status */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Driver Status
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200">
                                            <span className="text-gray-700 font-medium">Current Status</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                driverStatus === 'Driving' 
                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                    : driverStatus === 'Assigned (Not Driving)'
                                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                                            }`}>
                                                {driverStatus}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200">
                                            <span className="text-gray-700 font-medium">Bus Assignment</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                driver.isAssigned 
                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                                            }`}>
                                                {driver.isAssigned ? 'Assigned' : 'Not Assigned'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200">
                                            <span className="text-gray-700 font-medium">Currently Driving</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                driver.isDriving 
                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                                            }`}>
                                                {driver.isDriving ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Information */}
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Quick Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Aadhaar Number</span>
                                            <span className="font-semibold text-gray-900">
                                                {driver.aadhaarNumber ? `XXXX-XXXX-${driver.aadhaarNumber.slice(-4)}` : 'Not provided'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">License Number</span>
                                            <span className="font-semibold text-gray-900">{driver.licenseNumber || 'Not provided'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Blood Group</span>
                                            <span className="font-semibold text-gray-900">{driver.bloodGroup || 'Not provided'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Age</span>
                                            <span className="font-semibold text-gray-900">
                                                {driverAge ? `${driverAge} years` : 'Not provided'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'personal' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Personal Details */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Personal Details
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-gray-600">Full Name</span>
                                            <span className="font-semibold text-gray-900">{driver.name}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-gray-600">Email Address</span>
                                            <span className="font-semibold text-gray-900">{driver.email}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-gray-600">Phone Number</span>
                                            <span className="font-semibold text-gray-900">{driver.phoneNumber}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-gray-600">Date of Birth</span>
                                            <span className="font-semibold text-gray-900">
                                                {formatDate(driver.dateOfBirth)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-gray-600">Age</span>
                                            <span className="font-semibold text-gray-900">
                                                {driverAge ? `${driverAge} years` : 'Not provided'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Official Information */}
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Official Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-gray-600">Aadhaar Number</span>
                                            <span className="font-semibold text-gray-900">
                                                {driver.aadhaarNumber || 'Not provided'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-gray-600">License Number</span>
                                            <span className="font-semibold text-gray-900">
                                                {driver.licenseNumber || 'Not provided'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-gray-600">Blood Group</span>
                                            <span className="font-semibold text-gray-900">
                                                {driver.bloodGroup || 'Not provided'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-gray-600">Registration Date</span>
                                            <span className="font-semibold text-gray-900">
                                                {formatDate(driver.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information */}
                                {driver.address && (
                                    <div className="lg:col-span-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-gray-200">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Address
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-lg border border-gray-200">
                                            {driver.address}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'documents' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Documents & Verification Files
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {driver.photoUrl && (
                                        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all">
                                            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Profile Photo
                                            </p>
                                            <DocumentViewer
                                                src={driver.photoUrl}
                                                alt="Driver Photo"
                                                type="profile_photo"
                                            />
                                        </div>
                                    )}

                                    {driver.aadhaarUrl && (
                                        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all">
                                            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                Aadhaar Card
                                            </p>
                                            <DocumentViewer
                                                src={driver.aadhaarUrl}
                                                alt="Aadhaar Card"
                                                type="aadhaar_card"
                                            />
                                        </div>
                                    )}

                                    {driver.licenseUrl && (
                                        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all">
                                            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                </svg>
                                                Driver's License
                                            </p>
                                            <DocumentViewer
                                                src={driver.licenseUrl}
                                                alt="Driver License"
                                                type="drivers_license"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'identity' && (
                            <div>
                                <IdentityCard driver={driver} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 font-semibold"
                    >
                        Back to List
                    </button>
              
                </div>
            </div>
        </div>
    );
};

export default DriverDetailsPage;
