import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DocumentViewer = ({ src, alt, type }) => {
    const [hasError, setHasError] = useState(false);
    const [fileType, setFileType] = useState('unknown');
    const [correctedUrl, setCorrectedUrl] = useState('');

    useEffect(() => {
        if (src) {
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
                
                // Multiple URL strategies for Cloudinary PDFs
                if (src.includes('cloudinary.com')) {
                    // Strategy 1: Try raw upload
                    if (src.includes('/image/upload/')) {
                        finalUrl = src.replace('/image/upload/', '/raw/upload/');
                    }
                    // Strategy 2: Try with fl_attachment for download
                    const downloadUrl = src.includes('/image/upload/') 
                        ? src.replace('/image/upload/', '/raw/upload/')
                        : src;
                    finalUrl = downloadUrl;
                }
                
            } else if (isImage) {
                detectedType = 'image';
            }

            console.log(`Document ${type}:`, {
                original: src,
                corrected: finalUrl,
                detectedType: detectedType
            });

            setFileType(detectedType);
            setCorrectedUrl(finalUrl);
            setHasError(false);
        }
    }, [src, type]);

    const handleViewPDF = async (e) => {
        e.preventDefault();
        
        // Try multiple methods to open the PDF
        const methods = [
            // Method 1: Direct URL
            () => window.open(correctedUrl, '_blank'),
            
            // Method 2: Google Docs Viewer
            () => window.open(`https://docs.google.com/gview?url=${encodeURIComponent(correctedUrl)}&embedded=true`, '_blank'),
            
            // Method 3: PDF.js viewer
            () => window.open(`/pdf-viewer.html?file=${encodeURIComponent(correctedUrl)}`, '_blank'),
            
            // Method 4: Microsoft Office Online
            () => window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(correctedUrl)}`, '_blank')
        ];

        // Try each method until one works
        for (let i = 0; i < methods.length; i++) {
            try {
                methods[i]();
                break;
            } catch (error) {
                console.log(`Method ${i + 1} failed:`, error);
                if (i === methods.length - 1) {
                    // Last method failed, show error
                    alert('Unable to open PDF. Please try downloading the file instead.');
                }
            }
        }
    };

    const handleDownloadPDF = (e) => {
        e.preventDefault();
        
        // Create a temporary anchor for download
        const link = document.createElement('a');
        link.href = correctedUrl;
        link.download = `${type}_${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const testPDFUrl = async (url) => {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    };

    if (!src) {
        return (
            <div className="bg-gray-100 rounded-lg h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-gray-500 text-sm">No document</span>
            </div>
        );
    }

    // Handle PDF files
    if (fileType === 'pdf') {
        return (
            <div className="bg-gray-50 rounded-lg h-48 flex flex-col items-center justify-center border-2 border-dashed border-red-200 p-4">
                <svg className="w-16 h-16 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-700 font-medium mb-2 text-center">PDF Document</p>
                <p className="text-gray-500 text-xs text-center mb-3">
                    {type.replace('_', ' ')}
                </p>
                <div className="flex gap-2 flex-wrap justify-center">
                    <button
                        onClick={handleViewPDF}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                        View PDF
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                        Download
                    </button>
                </div>
                
                {/* Debug info */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-2 text-xs text-gray-400 text-center">
                        <div>URL: {correctedUrl.length > 30 ? correctedUrl.substring(0, 30) + '...' : correctedUrl}</div>
                        <button 
                            onClick={() => testPDFUrl(correctedUrl).then(ok => 
                                console.log(`PDF URL test: ${ok ? 'SUCCESS' : 'FAILED'}`)
                            )}
                            className="text-blue-400 hover:text-blue-600 mt-1"
                        >
                            Test URL
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // Handle image files
    if (fileType === 'image') {
        return (
            <div className="relative group">
                <img
                    src={correctedUrl}
                    alt={alt}
                    className="w-full h-48 object-cover rounded-lg shadow-sm"
                    onError={() => setHasError(true)}
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    IMAGE
                </div>
            </div>
        );
    }

    // Handle errors or unknown file types
    return (
        <div className="bg-gray-50 rounded-lg h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4">
            <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-700 font-medium mb-1">Document</p>
            <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
            >
                Try Opening
            </a>
        </div>
    );
};

// Profile image with special handling
const ProfileImageView = ({ src, alt }) => {
    const [hasError, setHasError] = useState(false);
    const [fileType, setFileType] = useState('unknown');

    useEffect(() => {
        if (src) {
            const isPDF = src.toLowerCase().includes('.pdf');
            setFileType(isPDF ? 'pdf' : 'image');
        }
    }, [src]);

    const handleImageError = () => {
        console.error('Failed to load profile image:', src);
        setHasError(true);
    };

    if (!src || hasError || fileType === 'pdf') {
        return (
            <div className="w-24 h-24 rounded-2xl bg-gray-200 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-gray-500 text-xs text-center">No Photo</span>
            </div>
        );
    }

    return (
        <img 
            src={src} 
            alt={alt} 
            className="w-24 h-24 rounded-2xl object-cover shadow-md border-2 border-white"
            onError={handleImageError}
        />
    );
};

const DriverDetailsPage = () => {
    const { driverId } = useParams();
    const navigate = useNavigate();
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDriver = async () => {
            try {
                const res = await axios.get(`https://collage-bus-tracker-backend.onrender.com /api/driverprofile/admin/drivers/${driverId}`);
                setDriver(res.data.driver);
                setLoading(false);
                
                // Debug: Check what URLs we're getting
                console.log('Driver documents from API:', {
                    photo: res.data.driver?.photoUrl,
                    aadhaar: res.data.driver?.aadhaarUrl,
                    license: res.data.driver?.licenseUrl
                });
            } catch (err) {
                console.error('Error fetching driver:', err);
                setLoading(false);
            }
        };

        fetchDriver();
    }, [driverId]);

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Loading driver details...</p>
            </div>
        </div>
    );

    if (!driver) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Driver Not Found</h2>
                <p className="text-gray-600 mb-6">The driver you're looking for doesn't exist.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                >
                    Go Back
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Drivers
                    </button>
                    
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="flex-shrink-0">
                                <ProfileImageView 
                                    src={driver.photoUrl} 
                                    alt={driver.name} 
                                />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{driver.name}</h1>
                                <div className="flex flex-wrap gap-4 text-gray-600">
                                    <span className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {driver.email}
                                    </span>
                                    <span className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {driver.phoneNumber}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-600 font-semibold">Bus Number</p>
                                <p className="text-xl font-bold text-blue-700">{driver.busNumber || "Not assigned"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documents Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Documents & Files
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Photo Card */}
                        {driver.photoUrl && (
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                        {/* Aadhaar Card */}
                        {driver.aadhaarUrl && (
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                        {/* License Card */}
                        {driver.licenseUrl && (
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DriverDetailsPage;