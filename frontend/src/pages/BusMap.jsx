import React, { useState, useEffect } from 'react';
import {useNavigate}  from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import './BusMap.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom bus icon
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3233/3233158.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const socket = io('http://localhost:5000');

// Component to handle live location tracking
function LiveLocationTracker({ busNumber, isTracking, onLocationUpdate }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    if (!isTracking) return;

    let watchId;

    const startTracking = () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
      }

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          
          setCurrentPosition(newPosition);
          map.setView([newPosition.lat, newPosition.lng], 16);

          // Send location to server
          socket.emit("send_location", {
            busId: busNumber,
            latitude: newPosition.lat,
            longitude: newPosition.lng,
            speed: position.coords.speed || 0,
            heading: position.coords.heading || 0,
            timestamp: new Date().toISOString()
          });

          onLocationUpdate(newPosition);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(`Location error: ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    };

    // Ask for location permission
    if (isTracking) {
      navigator.geolocation.getCurrentPosition(
        () => startTracking(),
        (error) => {
          alert(`Please allow location access to start tracking. Error: ${error.message}`);
        }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isTracking, busNumber, map, onLocationUpdate]);

  if (!currentPosition || !isTracking) return null;

  return (
    <Marker position={[currentPosition.lat, currentPosition.lng]} icon={busIcon}>
      <Popup>
        <div>
          <strong>Bus {busNumber}</strong><br />
          Your Current Location<br />
          Accuracy: {currentPosition.accuracy ? `${currentPosition.accuracy.toFixed(1)}m` : 'Unknown'}
        </div>
      </Popup>
    </Marker>
  );
}

const BusMap = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  // Login form state
   const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    phoneNumber: '',
    busNumber: ''
  });

  const [errors, setErrors] = useState({});

  // Socket connection management
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      setConnectionStatus('Connected');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnectionStatus('Disconnected');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!loginData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!loginData.password) {
      newErrors.password = 'Password is required';
    } else if (loginData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!loginData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(loginData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }

    if (!loginData.busNumber) {
      newErrors.busNumber = 'Bus number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:5000/api/driverprofile/riding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        setShowLocationPopup(true);
        console.log('Login successful:', data);
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  // Start location tracking
  const startRiding = () => {
    setShowLocationPopup(false);
    setIsTracking(true);
  };

  // Stop tracking
  const stopRiding = () => {
    setIsTracking(false);
    setCurrentLocation(null);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsTracking(false);
    setLoginData({
      email: '',
      password: '',
      phoneNumber: '',
      busNumber: ''
    });
    
     navigate("/");

  };

  if (!isLoggedIn) {
    return (
      <div className="driver-login-container">
        <div className="login-form">
          <h2>Driver Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="tel"
                name="phoneNumber"
                value={loginData.phoneNumber}
                onChange={handleInputChange}
                className={errors.phoneNumber ? 'error' : ''}
              />
              {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
            </div>

            <div className="form-group">
              <label>Bus Number:</label>
              <input
                type="text"
                name="busNumber"
                value={loginData.busNumber}
                onChange={handleInputChange}
                className={errors.busNumber ? 'error' : ''}
              />
              {errors.busNumber && <span className="error-text">{errors.busNumber}</span>}
            </div>

            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-tracking-container">
      {/* Header */}
      <div className="tracking-header">
        <div className="driver-info">
          <h2>Bus {loginData.busNumber} - Driver Dashboard</h2>
          <div className="status-indicator">
            <span className={`connection-status ${connectionStatus.toLowerCase()}`}>
              {connectionStatus}
            </span>
            <span className={`tracking-status ${isTracking ? 'active' : 'inactive'}`}>
              {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
            </span>
          </div>
        </div>
        
        <div className="header-controls">
          {!isTracking ? (
            <button onClick={() => setShowLocationPopup(true)} className="start-btn">
              Start Riding
            </button>
          ) : (
            <button onClick={stopRiding} className="stop-btn">
              Stop Riding
            </button>
          )}
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="map-container">
        <MapContainer
          center={[28.6139, 77.2090]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          <LiveLocationTracker 
            busNumber={loginData.busNumber}
            isTracking={isTracking}
            onLocationUpdate={setCurrentLocation}
          />
        </MapContainer>
      </div>

      {/* Location information panel */}
      <div className="location-panel">
        <h3>Live Location Information</h3>
        {currentLocation ? (
          <div className="location-info">
            <p><strong>Bus:</strong> {loginData.busNumber}</p>
            <p><strong>Latitude:</strong> {currentLocation.lat.toFixed(6)}</p>
            <p><strong>Longitude:</strong> {currentLocation.lng.toFixed(6)}</p>
            <p><strong>Accuracy:</strong> {currentLocation.accuracy ? `${currentLocation.accuracy.toFixed(1)} meters` : 'Unknown'}</p>
            <p><strong>Status:</strong> <span className="live-status">Live</span></p>
          </div>
        ) : (
          <div className="location-info">
            <p>Location tracking is inactive. Click "Start Riding" to begin.</p>
          </div>
        )}
      </div>

      {/* Location Permission Popup */}
      {showLocationPopup && (
        <div className="popup-overlay">
          <div className="location-popup">
            <h3>Start Location Tracking</h3>
            <p>To start riding, we need access to your device's location.</p>
            <p>Please allow location permissions when prompted.</p>
            <div className="popup-buttons">
              <button onClick={startRiding} className="allow-btn">
                Allow & Start Tracking
              </button>
              <button onClick={() => setShowLocationPopup(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusMap;