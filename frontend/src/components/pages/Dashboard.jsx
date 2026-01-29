import React, { useEffect, useState } from 'react';
import { getAllRoomsApi, joinRoomApi} from '../../api/api'; // Adjust paths as needed
import { MdOutlineGroups, MdLock, MdPublic, MdAdd } from 'react-icons/md';
import { Link } from 'react-router-dom';
const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch all rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await getAllRoomsApi();
      setRooms(data);
    } catch (err) {
      setError('Failed to load chat rooms. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (id, isPrivate) => {
    if (isPrivate) {
      const pass = prompt("Enter room password:");
      if (!pass) return;
      try {
        await joinRoomApi(id, pass);
        alert("Joined successfully!");
        // Navigate to chat here
      } catch (err) {
        alert(err.response?.data || "Error joining room");
      }
    } else {
      // Logic for public room join...
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Explore #Hastag</h1>
          <p className="text-slate-500">Join a room and start your story</p>
        </div>
         <Link to={`room/create`}>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
          <MdAdd size={20} /> 
         
                Create Room
                
        </button>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div 
                key={room._id} 
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                      <MdOutlineGroups size={24} />
                    </div>
                    {room.isprivate ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        <MdLock size={12} /> PRIVATE
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        <MdPublic size={12} /> PUBLIC
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 truncate">{room.name}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                    {room.description || "No description provided for this room."}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                  <span className="text-xs text-slate-400">
                    {room.memberId?.length || 0} Members
                  </span>
                  <Link to={`/room/${room._id}`}>
                  <button 
                    onClick={() => handleJoin(room._id, room.isprivate)}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Join Chat →
                  </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;