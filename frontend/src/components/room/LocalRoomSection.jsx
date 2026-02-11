import { getLocalRooms, joinRoomApi } from '../../api/api';
import { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useNavigate } from 'react-router-dom';
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { MdLock, MdVerified, MdMyLocation } from 'react-icons/md'; // Added MdMyLocation
import PasswordModal from '../modal/PasswordModal';
import Toast from '../modal/Toast';

const LocalRoomSection = ({ user }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // State for coordinates
  const [coords, setCoords] = useState({ lng: 77.07, lat: 11.04 }); // Default fallback
  const [passModal, setPassModal] = useState({ isOpen: false, roomId: null, roomName: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  // 1. Logic to fetch rooms based on current coords state
  const fetchRooms = useCallback(async (locationData) => {
    try {
      setLoading(true);
      const queryParams = { 
        lng: locationData.lng, 
        lat: locationData.lat, 
        distance: 10 // Increased distance slightly for better results
      };
      const response = await getLocalRooms(queryParams);
      const roomArray = response?.data?.data || response?.data || [];
      setRooms(Array.isArray(roomArray) ? roomArray : []);
    } catch (error) {
      console.error("Local Room Fetch Error:", error);
      setToast({ show: true, message: "Failed to fetch nearby rooms", type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Logic to get browser location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setToast({ show: true, message: "Geolocation not supported by browser", type: 'error' });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCoords(newCoords);
        fetchRooms(newCoords); // Fetch immediately with new data
        setToast({ show: true, message: "Location updated!", type: 'success' });
      },
      (error) => {
        setLoading(false);
        setToast({ show: true, message: "Location access denied", type: 'error' });
      }
    );
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchRooms(coords);
  }, [fetchRooms]);

  const handleJoin = (id, isPrivate, ownerId, roomName) => {
    const currentUserId = user?._id || user?.id;
    const isOwner = currentUserId === ownerId;

    if (isPrivate && !isOwner) {
      setPassModal({ isOpen: true, roomId: id, roomName });
    } else {
      executeJoin(id, ""); 
    }
  };

  const executeJoin = async (id, password) => {
    try {
      await joinRoomApi(id, password || "");
      navigate(`/room/${id}`);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Error joining room",
        type: 'error'
      });
    } finally {
      setPassModal({ isOpen: false, roomId: null, roomName: '' });
    }
  };

  return (
    <section style={styles.sectionContainer}>
      <PasswordModal
        isOpen={passModal.isOpen}
        roomName={passModal.roomName}
        onCancel={() => setPassModal({ ...passModal, isOpen: false })}
        onConfirm={(password) => executeJoin(passModal.roomId, password)}
      />
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div style={styles.header}>
        <div style={styles.titleWrapper} onClick={() => setIsOpen(!isOpen)}>
          <div style={styles.pulseDot}></div>
          <h2 style={styles.sectionTitle}>Nearby Rooms</h2>
          <span style={styles.countBadge}>{rooms.length} Active</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* LOCATION BUTTON */}
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent toggling the section
              handleGetLocation();
            }}
            disabled={loading}
            style={styles.locationBtn}
            title="Update Location"
          >
            <MdMyLocation size={18} className={loading ? "animate-spin" : ""} />
          </button>

          <div 
            onClick={() => setIsOpen(!isOpen)}
            style={{
              ...styles.arrow,
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          >
            <IoIosArrowDropdownCircle size={30}/>
          </div>
        </div>
      </div>

      {isOpen && (
        <div style={styles.contentArea}>
          {loading ? (
            <div style={styles.statusText}>Updating your location...</div>
          ) : rooms.length > 0 ? (
            <div style={styles.compactGrid}>
              {rooms.map((room) => {
                const isOwner = (user?._id || user?.id) === room.ownerId;
                return (
                  <div key={room._id} style={styles.smallCard}>
                    <div style={styles.cardContent}>
                      <div className="flex justify-between items-start">
                         <h3 style={styles.smallRoomName}>{room.name}</h3>
                         <div className="flex gap-1">
                            {isOwner && <MdVerified size={14} className="text-blue-500" title="You own this" />}
                            {room.isprivate && <MdLock size={14} className="text-amber-500" />}
                         </div>
                      </div>
                      <p style={styles.smallRoomDesc}>{room.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                      <div style={styles.meta}>
                        <small>{new Date(room.createdAt).toLocaleDateString()}</small>
                      </div>
                      <button
                        onClick={() => handleJoin(room._id, room.isprivate, room.ownerId, room.name)}
                        className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        {isOwner ? 'Enter' : 'Join'} <HiChatBubbleLeftRight size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={styles.emptyText}>No rooms nearby. Try updating your location.</div>
          )}
        </div>
      )}
    </section>
  );
};

const styles = {
  // ... existing styles ...
  sectionContainer: {
    margin: '10px 0',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  header: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none'
  },
  titleWrapper: { display: 'flex', alignItems: 'center', gap: '10px' },
  locationBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '6px',
    color: '#6366f1',
    cursor: 'pointer',
    transition: 'all 0.2s',
    hover: { backgroundColor: '#eff6ff' }
  },
  pulseDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#22c55e',
    borderRadius: '50%',
    boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)',
    animation: 'pulse 2s infinite'
  },
  sectionTitle: { fontSize: '0.95rem', fontWeight: '600', color: '#334155', margin: 0 },
  countBadge: { fontSize: '0.7rem', color: '#10b981', backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: '12px' },
  arrow: { fontSize: '0.7rem', color: '#94a3b8', transition: 'transform 0.3s ease' },
  contentArea: { padding: '0 16px 16px 16px', borderTop: '1px solid #f8fafc' },
  compactGrid: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px' },
  smallCard: {
    flex: '1 1 180px',
    maxWidth: '220px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '8px'
  },
  smallRoomName: { fontSize: '0.90rem', fontWeight: '700', color: '#1e293b', margin: 0 },
  smallRoomDesc: { 
    fontSize: '0.7rem', 
    color: '#64748b', 
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden' 
  },
  statusText: { fontSize: '0.75rem', color: '#94a3b8', padding: '10px 0' },
  emptyText: { fontSize: '0.75rem', color: '#94a3b8', padding: '10px 0', textAlign: 'center' },
  meta: { color: '#9ca3af' },
};

export default LocalRoomSection;