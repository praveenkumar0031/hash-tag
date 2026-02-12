import React, { useEffect, useState } from 'react';
import { getAllRoomsApi, joinRoomApi, getUserApi, deleteRoomApi, updateRoomApi } from '../../api/api';
import { MdOutlineGroups, MdAdd, MdDelete, MdEdit, MdLocationOn, MdLocationOff } from 'react-icons/md';
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { FaSlackHash } from "react-icons/fa";
import { BsGlobeCentralSouthAsia } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';
import Logout from '../blocks/Logout';

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
      setToast({ show: true, message: "Room deleted successfully!", type: 'success' });
      setRooms((prev) => prev.filter((r) => r._id !== deleteConfig.roomId));
      setDeleteConfig({ isOpen: false, roomId: null });
    } catch (err) { console.error(err); }
  };

  const handleConfirmEdit = async (id, updatedData) => {
    try {
      const updatedRoomFromServer = await updateRoomApi(id, updatedData);
      setToast({ show: true, message: `Room updated!`, type: 'success' });
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
        () => setToast({ show: true, message: "Please enable location permissions.", type: 'error' }),
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 md:pb-10 relative touch-manipulation">
      <svg width="0" height="0" className="absolute">
        <linearGradient id="hash-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#4f46e5" offset="0%" />
          <stop stopColor="#ec4899" offset="50%" />
          <stop stopColor="#f59e0b" offset="100%" />
        </linearGradient>
      </svg>

      <ConfirmModal isOpen={deleteConfig.isOpen} title={`Delete ${deleteConfig.roomName}?`} onConfirm={handleConfirmDelete} onCancel={() => setDeleteConfig({ ...deleteConfig, isOpen: false })} />
      <EditModal isOpen={editConfig.isOpen} room={editConfig.room} onConfirm={handleConfirmEdit} onCancel={() => setEditConfig({ isOpen: false, room: null })} />
      <PasswordModal isOpen={passModal.isOpen} roomName={passModal.roomName} onCancel={() => setPassModal({ ...passModal, isOpen: false })} onConfirm={(password) => executeJoin(passModal.roomId, password)} />
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 mb-6 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col md:flex-row md:items-center gap-1">
              <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                <FaSlackHash style={{ fill: "url(#hash-gradient)" }} size={36} className="shrink-0" />
                <span className="leading-none">Hashtag</span>
              </h1>
              <p className="hidden sm:block md:mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest md:ml-2">
                Connect locally or globally
              </p>
            </div>
            <Logout />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 space-y-12">
        {user && (
          <div className="px-2 pt-4">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
              Hey, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-500 to-amber-500">{user.name || user.username}</span>!
            </h2>
            <p className="text-slate-500 font-medium mt-1">Discover what's happening in your surroundings today.</p>
          </div>
        )}

        <LocalRoomSection user={user} />

        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm">
              <BsGlobeCentralSouthAsia size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Public Channels</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-[5px] border-slate-200 border-t-indigo-600"></div>
            </div>
          ) : rooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
              {rooms.map((room) => {
                const isOwner = user?._id === room.ownerId || user?.id === room.ownerId;
                return (
                  <div 
                    key={room._id} 
                    className={`group bg-white rounded-[2.5rem] border p-7 transition-all duration-500 flex flex-col h-full relative overflow-hidden
                      ${isOwner ? 'border-indigo-200 bg-gradient-to-br from-indigo-50/30 to-transparent' : 'border-slate-200'}
                      hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-100/40 active:scale-[0.98]`}
                  >
                    {/* OWNER BACKGROUND SYMBOL WATERMARK */}
                    {isOwner && (
                      <div className="absolute -bottom-6 -right-6 text-indigo-600 opacity-[0.09] transition-transform duration-700 group-hover:scale-150 group-hover:-rotate-12 pointer-events-none">
                         <FaSlackHash size={200} />
                      </div>
                    )}

                    {/* Owner Badge */}
                    {isOwner && (
                      <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-tighter px-4 py-1 rounded-bl-2xl z-10 shadow-sm">
                        hosted
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-6 z-10">
                      <div className="p-4 bg-slate-50 text-slate-400 rounded-[1.5rem] transition-all 
                        group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:text-white">
                        <MdOutlineGroups size={26} />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isOwner && (
                          <div className="flex bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full p-1.5 shadow-sm">
                            <button onClick={(e) => { e.stopPropagation(); toggleRoomLocation(room); }} className={`p-1.5 rounded-full transition-colors ${room.location ? 'text-orange-500 bg-orange-100' : 'text-slate-400 hover:bg-slate-200'}`}>
                              {room.location ? <MdLocationOn size={18} /> : <MdLocationOff size={18} />}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setEditConfig({ isOpen: true, room }); }} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                              <MdEdit size={18} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setDeleteConfig({ isOpen: true, roomId: room._id, roomName: room.name }); }} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                              <MdDelete size={18} />
                            </button>
                          </div>
                        )}
                        <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border-2 ${room.isprivate ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                          {room.isprivate ? 'Private' : 'Public'}
                        </span>
                      </div>
                    </div>

                    <div className="z-10 flex-grow">
                      <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-pink-600 truncate tracking-tight transition-all">
                        {room.name}
                      </h3>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-10 leading-relaxed font-medium">
                        {room.description || "No description available."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 z-10">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800">{room.memberId?.length || 0} Members</span>
                        <div className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Active</span>
                        </div>
                      </div>
                      
                      {/* GRADIENT BUTTON DEFAULT */}
                      <button
                        onClick={() => handleJoin(room._id, room.isprivate, room.ownerId, room.name)}
                        className="flex items-center gap-2 px-7 py-3.5 rounded-[1.5rem] text-sm font-black text-white transition-all duration-300
                          bg-gradient-to-r from-indigo-600 amber-500  to-red-500
                          shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/60 hover:scale-105 active:scale-95"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        {isOwner ? 'Enter' : 'Join'} <HiChatBubbleLeftRight size={20} />
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

      <Link to="/room/create" className="group">
        <button className="fixed bottom-8 right-6 md:bottom-12 md:right-12 z-50 h-16 w-16 
          rounded-[1.75rem] bg-gradient-to-br from-indigo-600 via-pink-500 to-amber-500 text-white 
          flex flex-col items-center justify-center shadow-2xl 
          transition-all duration-300 hover:scale-110 active:scale-75"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <MdAdd size={38} />
        </button>
      </Link>
    </div>
  );
};

export default Dashboard;