import React, { useRef } from 'react';

const IdentityCard = ({ driver }) => {
    const cardRef = useRef();

    if (!driver) return null;

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
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

    // Generate card number based on driver data
    const generateCardNumber = () => {
        const prefix = 'DRV';
        const nameInitials = driver.name ? driver.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'XX';
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}${nameInitials}${randomNum}`;
    };

    // Get driver status
    const getDriverStatus = () => {
        if (driver.isDriving) return 'Driving';
        if (driver.isAssigned) return 'Assigned';
        return 'Available';
    };

    // Get status color
    const getStatusColor = () => {
        if (driver.isDriving) return 'bg-green-500';
        if (driver.isAssigned) return 'bg-blue-500';
        return 'bg-gray-500';
    };

    // Get status color for verification
    const getVerificationStatusColor = (isVerified) => {
        return isVerified ? 'text-green-600' : 'text-red-600';
    };

    const getStatusIcon = (isVerified) => {
        return isVerified ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
        ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        );
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const cardElement = cardRef.current.innerHTML;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Identity Card - ${driver.name}</title>
                    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
                    <style>
                        @media print {
                            body { 
                                margin: 0;
                                padding: 20px;
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                min-height: 100vh;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                            .print-card {
                                transform: scale(1.1);
                                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
                            }
                            @page {
                                size: auto;
                                margin: 0;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="flex items-center justify-center min-h-screen p-8">
                        ${cardElement}
                    </div>
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(() => window.close(), 500);
                        }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const driverAge = calculateAge(driver.dateOfBirth);
    const driverStatus = getDriverStatus();
    const statusColor = getStatusColor();

    return (
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Digital Identity Card</h2>
                    <p className="text-gray-900 mt-2 ">Official Driver Identification - School Transport Authority</p>
                </div>
                <button  // 8305929542   prinyka mishra 
                    onClick={handlePrint}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 font-semibold"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Card
                </button>
            </div>

            {/* Main Card */}
            <div ref={cardRef} className="print-card">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-2xl overflow-hidden border-4 border-white">

                    {/* Card Header with Pattern */}
                    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-800 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-2">DRIVER IDENTITY CARD</h1>
                                    <p className="text-blue-100 text-sm pl-4.5">School Transport Authority - Official Identification</p>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-8">
                        <div className="flex gap-8 items-start">
                            {/* Photo Section */}
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <div className="w-32 h-40 bg-gradient-to-br from-blue-200 to-purple-200 rounded-2xl border-4 border-white shadow-lg overflow-hidden">
                                        {driver.photoUrl ? (
                                            <img
                                                src={driver.photoUrl}
                                                alt={driver.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-full h-full flex flex-col items-center justify-center ${driver.photoUrl ? 'hidden' : 'flex'}`}>
                                            <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-blue-600 text-xs mt-2 text-center">No Photo Available</span>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg border-2 border-white">
                                        VERIFIED
                                    </div>
                                </div>
                            </div>

                            {/* Driver Information */}
                            <div className="flex-1 min-w-0">
                                <div className="mb-6">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{driver.name || 'Driver Name'}</h2>
                                    <p className="text-gray-600 font-semibold text-sm bg-gradient-to-r from-blue-100 to-purple-100 inline-block px-4 py-2 rounded-full border border-blue-200">
                                        Professional School Bus Driver
                                    </p>
                                </div>

                                {/* Main Information Grid */}
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">IDENTIFICATION NUMBER</p>
                                            <p className="text-lg font-bold text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                                                {generateCardNumber()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">CONTACT NUMBER</p>
                                            <p className="text-lg font-semibold text-gray-900">{driver.phoneNumber || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">BLOOD GROUP</p>
                                            <p className="text-lg font-semibold text-gray-900 bg-red-50 px-3 py-1 rounded border border-red-200 inline-block">
                                                {driver.bloodGroup || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">EMAIL ADDRESS</p>
                                            <p className="text-lg font-semibold text-gray-900 truncate">{driver.email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">DATE OF BIRTH</p>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {formatDate(driver.dateOfBirth)} {driverAge ? `(${driverAge} years)` : ''}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">ISSUE DATE</p>
                                            <p className="text-lg font-semibold text-gray-900">{formatDate(new Date())}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">AADHAAR NUMBER</p>
                                        <p className="text-md font-semibold text-gray-900 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                                            {driver.aadhaarNumber ? `XXXX-XXXX-${driver.aadhaarNumber.slice(-4)}` : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">LICENSE NUMBER</p>
                                        <p className="text-md font-semibold text-gray-900 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
                                            {driver.licenseNumber || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Address */}
                                {driver.address && (
                                    <div className="mb-6">
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">ADDRESS</p>
                                        <p className="text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                            {driver.address}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Verification Status */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Document Verification Status</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className={`flex items-center gap-3 p-4 rounded-xl ${driver.photoUrl ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                                    <div className={`p-2 rounded-full ${driver.photoUrl ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {getStatusIcon(driver.photoUrl)}
                                    </div>
                                    <div>
                                        <span className={`text-sm font-semibold block ${getVerificationStatusColor(driver.photoUrl)}`}>
                                            Profile Photo
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {driver.photoUrl ? 'Verified' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-3 p-4 rounded-xl ${driver.aadhaarUrl ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                                    <div className={`p-2 rounded-full ${driver.aadhaarUrl ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {getStatusIcon(driver.aadhaarUrl)}
                                    </div>
                                    <div>
                                        <span className={`text-sm font-semibold block ${getVerificationStatusColor(driver.aadhaarUrl)}`}>
                                            Aadhaar Card
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {driver.aadhaarUrl ? 'Verified' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-3 p-4 rounded-xl ${driver.licenseUrl ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                                    <div className={`p-2 rounded-full ${driver.licenseUrl ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {getStatusIcon(driver.licenseUrl)}
                                    </div>
                                    <div>
                                        <span className={`text-sm font-semibold block ${getVerificationStatusColor(driver.licenseUrl)}`}>
                                            Driver License
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {driver.licenseUrl ? 'Verified' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card Footer */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-700 font-semibold block">OFFICIAL IDENTITY DOCUMENT</span>
                                    <span className="text-xs text-gray-500">School Transport Authority</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 font-medium">Valid until</p>
                                <p className="text-sm font-semibold text-gray-700">
                                    {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    This digital identity card is generated automatically and is valid for official use within the school transport system.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                    Card Number: {generateCardNumber()} | Generated on: {new Date().toLocaleDateString('en-IN')}
                </p>
            </div>
        </div>
    );
};

export default IdentityCard;