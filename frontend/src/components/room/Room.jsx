import { getLocalRooms } from '../../api/api';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Assuming you use react-router
import LocalRoomSection from './LocalRoomSection';
const Room = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryParams = { lng: 77.07, lat: 11.04, distance: 1 };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await getLocalRooms(queryParams);
        const roomArray = response?.data?.data || response?.data || [];
        setRooms(Array.isArray(roomArray) ? roomArray : []);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div style={styles.dashboardContainer}>
      {/* Header Section */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Room</h1>
          <p style={styles.subtitle}>Explore nearby active sessions</p>
        </div>
        <button style={styles.createBtn}>+ Create New Room</button>
      </header>

      {/* Stats Ribbon (Optional) */}
      <div style={styles.statsRibbon}>
        <span>Total Nearby: <strong>{rooms.length}</strong></span>
        <span>Location: <strong>Coimbatore, IN</strong></span>
      </div>

      {/* Main Content */}
      <main style={styles.main}>
        {loading ? (
          <div style={styles.loader}>Searching for rooms...</div>
        ) : rooms.length > 0 ? (
          <div style={styles.grid}>
            {rooms.map((room) => (
              <div key={room._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.roomName}>{room.name}</h3>
                  <span style={styles.badge}>{room.isprivate ? 'Private' : 'Public'}</span>
                </div>
                <p style={styles.description}>{room.description || "No description provided."}</p>
                
                <div style={styles.cardFooter}>
                  <div style={styles.meta}>
                    <small>Created: {new Date(room.createdAt).toLocaleDateString()}</small>
                  </div>
                  {/* The Join Button Link */}
                  <Link to={`/room/${room._id}`} style={styles.joinBtn}>
                    Join Room
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p>No rooms found in your area.</p>
          </div>
        )}
      </main>
      <LocalRoomSection/>
    </div>
  );
};

// Simple inline styles for a clean Dashboard look
const styles = {
  dashboardContainer: { padding: '20px', backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0, fontSize: '24px', color: '#333' },
  subtitle: { margin: 0, color: '#666', fontSize: '14px' },
  createBtn: { padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  statsRibbon: { backgroundColor: 'white', padding: '10px 20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', gap: '20px', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  roomName: { margin: '0 0 10px 0', fontSize: '18px', color: '#1a1a1a' },
  badge: { fontSize: '10px', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase' },
  description: { color: '#4b5563', fontSize: '14px', marginBottom: '20px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px' },
  joinBtn: { textDecoration: 'none', backgroundColor: '#10b981', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold' },
  meta: { color: '#9ca3af' },
  loader: { textAlign: 'center', marginTop: '50px', color: '#666' },
  emptyState: { textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px' }
};

export default Room;