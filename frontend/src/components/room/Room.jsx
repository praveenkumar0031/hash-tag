import React from 'react'

const Room = () => {
    
  return (
    <div>Room</div>
  )
}

export default Room


import React, { useEffect, useState } from 'react';
import { getAllRoomsApi, joinRoomApi, getUserApi, deleteRoomApi, updateRoomApi } from '../../api/api';
import { MdOutlineGroups, MdLock, MdPublic, MdAdd, MdDelete, MdEdit, MdLocationOn, MdLocationOff } from 'react-icons/md';
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { FaSlackHash } from "react-icons/fa";
import EmptyState from './EmptyState';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmModal from '../modal/ConfirmModal';
import EditModal from '../modal/EditModal';
import PasswordModal from '../modal/PasswordModal'
import Toast from '../modal/Toast';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

    // Modal States
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
            console.error(err);
        } finally { setLoading(false); }
    };

    // --- QUICK LOCATION TOGGLE ---
    const toggleRoomLocation = (room) => {
        if (room.location) {
            // If it has location, we "Reset" it
            handleConfirmEdit(room._id, { resetLocation: true });
        } else {
            // If it doesn't, we "Set" it to current position
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    handleConfirmEdit(room._id, {
                        lng: pos.coords.longitude,
                        lat: pos.coords.latitude,
                        resetLocation: false
                    });
                },
                (err) => setToast({ show: true, message: "Location access denied", type: 'error' })
            );
        }
    };

    const handleConfirmEdit = async (id, updatedData) => {
        try {
            const updatedRoom = await updateRoomApi(id, updatedData);
            setRooms((prev) => prev.map((r) => r._id === id ? updatedRoom : r));
            setToast({ show: true, message: "Room updated!", type: 'success' });
            setEditConfig({ isOpen: false, room: null });
        } catch (err) {
            setToast({ show: true, message: "Update failed", type: 'error' });
        }
    };

    const handleJoin = (id, isPrivate, ownerId, roomName) => {
        const isOwner = user?._id === ownerId || user?.id === ownerId;
        if (isPrivate && !isOwner) {
            setPassModal({ isOpen: true, roomId: id, roomName });
        } else {
            executeJoin(id, null);
        }
    };

    const executeJoin = async (id, password) => {
        try {
            await joinRoomApi(id, password);
            navigate(`/room/${id}`);
        } catch (err) {
            setToast({ show: true, message: "Join failed", type: 'error' });
        } finally {
            setPassModal({ isOpen: false, roomId: null, roomName: '' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-10">
            <ConfirmModal
                isOpen={deleteConfig.isOpen}
                title={`Delete ${deleteConfig.roomName}?`}
                onConfirm={async () => {
                    await deleteRoomApi(deleteConfig.roomId);
                    setRooms(prev => prev.filter(r => r._id !== deleteConfig.roomId));
                    setDeleteConfig({ isOpen: false });
                }}
                onCancel={() => setDeleteConfig({ isOpen: false })}
            />
            <EditModal
                isOpen={editConfig.isOpen}
                room={editConfig.room}
                onConfirm={handleConfirmEdit}
                onCancel={() => setEditConfig({ isOpen: false })}
            />
            <PasswordModal
                isOpen={passModal.isOpen}
                roomName={passModal.roomName}
                onConfirm={(pass) => executeJoin(passModal.roomId, pass)}
                onCancel={() => setPassModal({ isOpen: false })}
            />

            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

            <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
                <h1 className="flex gap-4 items-center text-3xl font-bold text-slate-800">
                    <FaSlackHash size={40} className="text-indigo-600" /> Hashtag
                </h1>
                <Link to={`/room/create`}>
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 shadow-lg">
                        <MdAdd size={20} /> Create Room
                    </button>
                </Link>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => {
                    const isOwner = user?._id === room.ownerId || user?.id === room.ownerId;
                    return (
                        <div key={room._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                        <MdOutlineGroups size={24} />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {isOwner && (
                                            <div className="flex gap-1 mr-2 border-r pr-2 border-slate-100">
                                                {/* QUICK LOCATION TOGGLE BUTTON */}
                                                <button
                                                    onClick={() => toggleRoomLocation(room)}
                                                    className={`p-1.5 rounded-full transition-all ${room.location ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-50'}`}
                                                    title={room.location ? "Remove Location" : "Set to Current Location"}
                                                >
                                                    {room.location ? <MdLocationOn size={18} /> : <MdLocationOff size={18} />}
                                                </button>
                                                
                                                <button onClick={() => setEditConfig({ isOpen: true, room })} className="p-1.5 text-slate-400 hover:text-indigo-600"><MdEdit size={18} /></button>
                                                <button onClick={() => setDeleteConfig({ isOpen: true, roomId: room._id, roomName: room.name })} className="p-1.5 text-slate-400 hover:text-red-500"><MdDelete size={18} /></button>
                                            </div>
                                        )}

                                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${room.isprivate ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'}`}>
                                            {room.isprivate ? 'PRIVATE' : 'PUBLIC'}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2 truncate">{room.name}</h3>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{room.description}</p>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                                <span className="text-xs text-slate-400">{room.memberId?.length || 0} Members</span>
                                <button onClick={() => handleJoin(room._id, room.isprivate, room.ownerId, room.name)} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                                    Join Room
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Dashboard;