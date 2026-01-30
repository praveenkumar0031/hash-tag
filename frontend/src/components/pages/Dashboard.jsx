import React, { useEffect, useState } from 'react';
import { getAllRoomsApi, joinRoomApi, getUserApi, deleteRoomApi, updateRoomApi } from '../../api/api';
import { MdOutlineGroups, MdLock, MdPublic, MdAdd, MdDelete, MdEdit } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmModal from '../ConfirmModal';
import EditModal from '../EditModal'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, roomId: null, roomName: '' });
  const [editConfig, setEditConfig] = useState({ isOpen: false, room: null });

  useEffect(() => {
    fetchRooms();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const data = await getUserApi();
      setUser(data);
    } catch (err) { console.error(err); }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await getAllRoomsApi();
      setRooms(data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  // --- DELETE HANDLERS ---
  const openDeleteModal = (e, room) => {
    e.stopPropagation();
    setDeleteConfig({ isOpen: true, roomId: room._id, roomName: room.name });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteRoomApi(deleteConfig.roomId);
      setRooms((prev) => prev.filter((r) => r._id !== deleteConfig.roomId));
      setDeleteConfig({ isOpen: false, roomId: null });
    } catch (err) { console.error(err); }
  };

  // --- EDIT HANDLERS ---
  const openEditModal = (e, room) => {
    e.stopPropagation();
    setEditConfig({ isOpen: true, room });
  };

  const handleConfirmEdit = async (id, updatedData) => {
    try {
      const updatedRoom = await updateRoomApi(id, updatedData);
      setRooms((prev) => prev.map((r) => (r._id === id ? { ...r, ...updatedData } : r)));
      setEditConfig({ isOpen: false, room: null });
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleJoin = async (id, isPrivate) => {
    const pass = isPrivate ? prompt("Enter room password:") : null;
    if (isPrivate && !pass) return;
    try {
      await joinRoomApi(id, pass);
      navigate(`/room/${id}`);
    } catch (err) {
      alert(err.response?.data || "Error joining room");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      {/* GLOBAL MODALS (Placed outside the loop) */}
      <ConfirmModal 
        isOpen={deleteConfig.isOpen}
        title={`Delete ${deleteConfig.roomName}?`}
        message="This action is permanent and will delete all chat history."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfig({ ...deleteConfig, isOpen: false })}
      />
      <EditModal 
        isOpen={editConfig.isOpen}
        room={editConfig.room}
        onConfirm={handleConfirmEdit}
        onCancel={() => setEditConfig({ isOpen: false, room: null })}
      />

      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Explore #Hashtag</h1>
          <p className="text-slate-500">Join a room and start your story</p>
        </div>
        <Link to={`/room/create`}>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg">
            <MdAdd size={20} /> Create Room
          </button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => {
              const isOwner = user?._id === room.ownerId || user?.id === room.ownerId;
              return (
                <div key={room._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                        <MdOutlineGroups size={24} />
                      </div>
                      <div className="flex items-center gap-1">
                        {isOwner && (
                          <div className="flex gap-1 mr-2 border-r pr-2 border-slate-100">
                            <button 
                              onClick={(e) => openEditModal(e, room)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                            >
                              <MdEdit size={18} />
                            </button>
                            <button 
                              onClick={(e) => openDeleteModal(e, room)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                            >
                              <MdDelete size={18} />
                            </button>
                          </div>
                        )}
                        {room.isprivate ? (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">PRIVATE</span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">PUBLIC</span>
                        )}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 truncate">{room.name}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">{room.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                    <span className="text-xs text-slate-400">{room.memberId?.length || 0} Members</span>
                    <button onClick={() => handleJoin(room._id, room.isprivate)} className="text-sm font-bold text-indigo-600 hover:text-indigo-800">
                      Join Chat →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;