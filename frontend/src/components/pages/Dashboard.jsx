import React, { useEffect, useState } from 'react';
import { getAllRoomsApi, joinRoomApi, getUserApi, deleteRoomApi, updateRoomApi } from '../../api/api';
import { MdOutlineGroups, MdLock, MdPublic, MdAdd, MdDelete, MdEdit, MdLocationOn, MdLocationOff } from 'react-icons/md';
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { FaSlackHash } from "react-icons/fa";
import { BsGlobeCentralSouthAsia } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';

import EmptyState from './EmptyState';
import ConfirmModal from '../modal/ConfirmModal';
import EditModal from '../modal/EditModal';
import PasswordModal from '../modal/PasswordModal';
import Toast from '../modal/Toast';
import LocalRoomSection from '../room/LocalRoomSection';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  const [passModal, setPassModal] = useState({ isOpen: false, roomId: null, roomName: '' });
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
    } catch (err) {
      if (err.response?.status === 401) {
        setToast({ show: true, message: "Session expired. Please login again.", type: 'error' });
        navigate('/login');
      } else console.error(err);
    } finally { setLoading(false); }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteRoomApi(deleteConfig.roomId);
      setToast({ show: true, message: "Room deleted!", type: 'success' });
      setRooms((prev) => prev.filter((r) => r._id !== deleteConfig.roomId));
      setDeleteConfig({ isOpen: false, roomId: null });
    } catch (err) { console.error(err); }
  };

  const handleConfirmEdit = async (id, updatedData) => {
    try {
      const updatedRoomFromServer = await updateRoomApi(id, updatedData);
      setToast({ show: true, message: `Room updated successfully!`, type: 'success' });
      setRooms((prev) => prev.map((r) => (r._id === id ? updatedRoomFromServer : r)));
      setEditConfig({ isOpen: false, room: null });
    } catch (err) {
      setToast({ show: true, message: "Failed to update room.", type: 'error' });
    }
  };

  const handleJoin = (id, isPrivate, ownerId, roomName) => {
    const isOwner = user?._id === ownerId || user?.id === ownerId;
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
      setToast({ show: true, message: err.response?.data || "Error joining room", type: 'error' });
    } finally {
      setPassModal({ isOpen: false, roomId: null, roomName: '' });
    }
  };

  const toggleRoomLocation = (room) => {
    const hasLocation = !!(room.location && room.location.coordinates);
    if (hasLocation) {
      handleConfirmEdit(room._id, { ...room, lng: null, lat: null, resetLocation: true });
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleConfirmEdit(room._id, {
            ...room,
            lng: pos.coords.longitude,
            lat: pos.coords.latitude,
            resetLocation: false
          });
        },
        () => setToast({ show: true, message: "Enable location permissions.", type: 'error' }),
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 md:pb-10">
      {/* GRADIENT DEFINITION */}
      <svg width="0" height="0" className="absolute">
        <linearGradient id="hash-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#4f46e5" offset="0%" />
          <stop stopColor="#ec4899" offset="50%" />
          <stop stopColor="#f59e0b" offset="100%" />
        </linearGradient>
      </svg>

      {/* MODALS */}
      <ConfirmModal
        isOpen={deleteConfig.isOpen}
        title={`Delete ${deleteConfig.roomName}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfig({ ...deleteConfig, isOpen: false })}
      />
      <EditModal
        isOpen={editConfig.isOpen}
        room={editConfig.room}
        onConfirm={handleConfirmEdit}
        onCancel={() => setEditConfig({ isOpen: false, room: null })}
      />
      <PasswordModal
        isOpen={passModal.isOpen}
        roomName={passModal.roomName}
        onCancel={() => setPassModal({ ...passModal, isOpen: false })}
        onConfirm={(password) => executeJoin(passModal.roomId, password)}
      />
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      )}

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 mb-6 md:mb-10">
        <div className="max-w-6xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
              <FaSlackHash style={{ fill: "url(#hash-gradient)" }} size={36} />
              Hashtag
            </h1>
            <p className="hidden md:block text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">Connect Locally</p>
          </div>

          <Link to="/room/create">
            <button className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100">
              <MdAdd size={20} /> Create Room
            </button>
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 space-y-10">
        
        {/* Pass user prop to LocalRoomSection for ownership checks */}
        <LocalRoomSection user={user} />

        {/* GENERAL ROOMS */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <BsGlobeCentralSouthAsia size={22} />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Public Channels</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-indigo-600"></div>
              <p className="text-slate-400 font-medium">Loading rooms...</p>
            </div>
          ) : rooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => {
                const isOwner = user?._id === room.ownerId || user?.id === room.ownerId;
                return (
                  <div key={room._id} className="group bg-white rounded-[2rem] border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                    <div className="flex justify-between items-start mb-5">
                      <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 rounded-2xl transition-colors">
                        <MdOutlineGroups size={24} />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isOwner && (
                          <div className="flex bg-white shadow-sm border border-slate-100 rounded-full p-1">
                            <button onClick={() => toggleRoomLocation(room)} className={`p-1.5 rounded-full transition-colors ${room.location ? 'text-orange-500 bg-orange-50' : 'text-slate-300 hover:bg-slate-50'}`}>
                              {room.location ? <MdLocationOn size={16} /> : <MdLocationOff size={16} />}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setEditConfig({ isOpen: true, room }); }} className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors">
                              <MdEdit size={16} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setDeleteConfig({ isOpen: true, roomId: room._id, roomName: room.name }); }} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                              <MdDelete size={16} />
                            </button>
                          </div>
                        )}
                        
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${room.isprivate ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                          {room.isprivate ? 'Private' : 'Public'}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors truncate">{room.name}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-8 flex-grow leading-relaxed">{room.description || "No description available."}</p>

                    <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">{room.memberId?.length || 0} Members</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Active Now</span>
                      </div>
                      <button
                        onClick={() => handleJoin(room._id, room.isprivate, room.ownerId, room.name)}
                        className="flex items-center gap-2 bg-slate-900 group-hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
                      >
                        {isOwner ? 'Enter' : 'Join'} <HiChatBubbleLeftRight size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </main>

      {/* MOBILE FAB */}
      <Link to="/room/create" className="md:hidden">
        <button className="fixed bottom-8 right-6 z-50 h-16 w-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-300 active:scale-90 transition-transform">
          <MdAdd size={32} />
        </button>
      </Link>
    </div>
  );
};

export default Dashboard;