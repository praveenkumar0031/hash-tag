import { getLocalRooms } from '../../api/api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiChatBubbleLeftRight } from "react-icons/hi2";
const LocalRoomSection = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const queryParams = { lng: 77.07, lat: 11.04, distance: 1 };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await getLocalRooms(queryParams);
        const roomArray = response?.data?.data || response?.data || [];
        setRooms(Array.isArray(roomArray) ? roomArray : []);
      } catch (error) {
        console.error("Local Room Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <section style={styles.sectionContainer}>
      <div style={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <div style={styles.titleWrapper}>
          <div style={styles.pulseDot}></div>
          <h2 style={styles.sectionTitle}>Nearby Rooms</h2>
          <span style={styles.countBadge}>{rooms.length} Active</span>
        </div>
        <div style={{
          ...styles.arrow,
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          ▼
        </div>
      </div>

      {isOpen && (
        <div style={styles.contentArea}>
          {loading ? (
            <div style={styles.statusText}>Locating...</div>
          ) : rooms.length > 0 ? (
            <div style={styles.compactGrid}>
              {rooms.map((room) => (
                <div key={room._id} style={styles.smallCard}>
                  <div style={styles.cardContent}>
                    <h3 style={styles.smallRoomName}>{room.name}</h3>
                    <p style={styles.smallRoomDesc}>{room.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                                      
                                      <button
                                        onClick={() => handleJoin(room._id, room.isprivate, room.ownerId, room.name)}
                                        className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                                      >
                                        Join <HiChatBubbleLeftRight size={18} />
                                      </button>
                                      
                                    </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyText}>No rooms nearby.</div>
          )}
        </div>
      )}
    </section>
  );
};

const styles = {
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
  pulseDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#22c55e',
    borderRadius: '50%',
    boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)',
    animation: 'pulse 2s infinite' // Note: Requires CSS keyframes in your stylesheet
  },
  sectionTitle: { fontSize: '0.95rem', fontWeight: '600', color: '#334155', margin: 0 },
  countBadge: { fontSize: '0.7rem', color: '#10b981', backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: '12px' },
  arrow: { fontSize: '0.7rem', color: '#94a3b8', transition: 'transform 0.3s ease' },
  
  contentArea: {
    padding: '0 16px 16px 16px',
    borderTop: '1px solid #f8fafc'
  },
  compactGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '12px'
  },
  smallCard: {
    flex: '1 1 180px', // Smaller, flexible width
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
  smallRoomName: { fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', margin: 0 },
  smallRoomDesc: { 
    fontSize: '0.7rem', 
    color: '#64748b', 
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden' 
  },
  smallJoinBtn: {
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    padding: '5px 0',
    borderRadius: '5px',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%'
  },
  statusText: { fontSize: '0.75rem', color: '#94a3b8', padding: '10px 0' },
  emptyText: { fontSize: '0.75rem', color: '#94a3b8', padding: '10px 0', textAlign: 'center' }
};

export default LocalRoomSection;