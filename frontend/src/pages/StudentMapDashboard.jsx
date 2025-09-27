import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
// import './StudentLiveTracker.css';
import './StudentMapDashboard.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3233/3233158.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const studentIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const busStopIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/484/484167.png',
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25],
});

const socket = io('http://localhost:5000');

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// Component to track student's location
function StudentLocationTracker({ onLocationUpdate }) {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        };
        
        setPosition(newPosition);
        onLocationUpdate(newPosition);
        
        // Center map on student's position
        map.setView([newPosition.lat, newPosition.lng], 15);
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map, onLocationUpdate]);

  if (!position) return null;

  return (
    <Marker position={[position.lat, position.lng]} icon={studentIcon}>
      <Popup>
        <div>
          <strong>Your Location</strong><br />
          Latitude: {position.lat.toFixed(6)}<br />
          Longitude: {position.lng.toFixed(6)}<br />
          Accuracy: {position.accuracy ? `${position.accuracy.toFixed(1)}m` : 'Unknown'}
        </div>
      </Popup>
    </Marker>
  );
}

// Component to handle bus locations via socket
function BusLocationsTracker({ studentPosition, onBusesUpdate }) {
  useEffect(() => {
    socket.on('busLocation', (data) => {
      onBusesUpdate(prevBuses => ({
        ...prevBuses,
        [data.busId]: {
          ...data,
          lastUpdate: new Date(),
          // Calculate distance from student if student position is available
          distance: studentPosition ? 
            calculateDistance(
              studentPosition.lat, 
              studentPosition.lng, 
              data.latitude, 
              data.longitude
            ) : null
        }
      }));
    });

    socket.on('bus_offline', (busId) => {
      onBusesUpdate(prevBuses => {
        const updated = { ...prevBuses };
        delete updated[busId];
        return updated;
      });
    });

    return () => {
      socket.off('busLocation');
      socket.off('bus_offline');
    };
  }, [studentPosition, onBusesUpdate]);

  return null;
}

const StudentMapDashboard = () => {
  const [studentPosition, setStudentPosition] = useState(null);
  const [buses, setBuses] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBus, setSelectedBus] = useState(null);
  const [showBusList, setShowBusList] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

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

    // Request active buses
    socket.emit('get_active_buses');

    return () => {
      socket.disconnect();
    };
  }, []);

  // Filter and sort buses based on search and distance
  const filteredBuses = Object.entries(buses)
    .filter(([busId, bus]) => 
      busId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bus.busNumber && bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort(([, busA], [, busB]) => {
      if (!studentPosition) return 0;
      const distA = busA.distance || Infinity;
      const distB = busB.distance || Infinity;
      return distA - distB;
    })
    .slice(0, 10); // Show top 10 closest buses

  // Calculate ETA for a bus (mock function - replace with real API)
  const calculateETA = (bus) => {
    if (!bus.distance || !studentPosition) return 'Unknown';
    
    // Mock ETA calculation: 2 minutes per km + 5 minutes base
    const etaMinutes = Math.round(bus.distance * 2 + 5);
    return `${etaMinutes} mins`;
  };

  // Handle bus selection
  const handleBusSelect = (busId, bus) => {
    setSelectedBus(busId);
    // You can add map centering logic here
  };

  return (
    <div className="student-tracker-container">
      {/* Header */}
      <div className="tracker-header">
        <div className="header-left">
          <h1>🚌 College Bus Tracker</h1>
          <div className="status-indicator">
            <span className={`connection-status ${connectionStatus.toLowerCase()}`}>
              {connectionStatus}
            </span>
            <span className="student-status">
              {studentPosition ? 'Location: Active' : 'Location: Inactive'}
            </span>
          </div>
        </div>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by bus number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            onClick={() => setShowBusList(!showBusList)}
            className="toggle-list-btn"
          >
            {showBusList ? 'Hide List' : 'Show Buses'}
          </button>
        </div>
      </div>

      <div className="content-area">
        {/* Bus List Sidebar */}
        {showBusList && (
          <div className="bus-list-sidebar">
            <h3>Nearby Buses ({filteredBuses.length})</h3>
            <div className="bus-list">
              {filteredBuses.length === 0 ? (
                <div className="no-buses">No buses found</div>
              ) : (
                filteredBuses.map(([busId, bus]) => (
                  <div
                    key={busId}
                    className={`bus-item ${selectedBus === busId ? 'selected' : ''}`}
                    onClick={() => handleBusSelect(busId, bus)}
                  >
                    <div className="bus-info">
                      <div className="bus-number">Bus {busId}</div>
                      <div className="bus-distance">
                        {bus.distance ? `${bus.distance.toFixed(1)} km away` : 'Distance unknown'}
                      </div>
                    </div>
                    <div className="bus-eta">
                      ETA: {calculateETA(bus)}
                    </div>
                    <div className="bus-status">
                      <span className="live-dot"></span>
                      Live
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Map Container */}
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
            
            {/* Student Location */}
            <StudentLocationTracker onLocationUpdate={setStudentPosition} />
            
            {/* Bus Locations */}
            <BusLocationsTracker 
              studentPosition={studentPosition} 
              onBusesUpdate={setBuses} 
            />

            {/* Bus Markers */}
            {Object.entries(buses).map(([busId, bus]) => (
              <Marker 
                key={busId} 
                position={[bus.latitude, bus.longitude]} 
                icon={busIcon}
                eventHandlers={{
                  click: () => handleBusSelect(busId, bus),
                }}
              >
                <Popup>
                  <div className="bus-popup">
                    <h4>Bus {busId}</h4>
                    <p><strong>Distance:</strong> {bus.distance ? `${bus.distance.toFixed(2)} km` : 'Calculating...'}</p>
                    <p><strong>ETA:</strong> {calculateETA(bus)}</p>
                    <p><strong>Last Update:</strong> {bus.lastUpdate ? bus.lastUpdate.toLocaleTimeString() : 'Unknown'}</p>
                    <button 
                      onClick={() => handleBusSelect(busId, bus)}
                      className="track-bus-btn"
                    >
                      Track This Bus
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Bus Stop Markers (Example) */}
            {studentPosition && (
              <Marker 
                position={[studentPosition.lat + 0.005, studentPosition.lng + 0.005]} 
                icon={busStopIcon}
              >
                <Popup>
                  <div>
                    <strong>College Bus Stop</strong><br />
                    Main Campus Entrance
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>

      {/* Selected Bus Info Panel */}
      {selectedBus && buses[selectedBus] && (
        <div className="selected-bus-panel">
          <div className="bus-details">
            <h3>Bus {selectedBus}</h3>
            <div className="bus-stats">
              <div className="stat">
                <label>Distance:</label>
                <span>{buses[selectedBus].distance ? `${buses[selectedBus].distance.toFixed(2)} km` : 'Calculating...'}</span>
              </div>
              <div className="stat">
                <label>ETA:</label>
                <span>{calculateETA(buses[selectedBus])}</span>
              </div>
              <div className="stat">
                <label>Last Update:</label>
                <span>{buses[selectedBus].lastUpdate ? buses[selectedBus].lastUpdate.toLocaleTimeString() : 'Unknown'}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setSelectedBus(null)}
            className="close-panel-btn"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentMapDashboard