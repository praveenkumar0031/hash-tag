import React, { useEffect, useState } from 'react';
import { getAllRoomsApi, joinRoomApi, getUserApi, deleteRoomApi, updateRoomApi, changePrivacyApi } from '../../api/api';
import { MdOutlineGroups, MdLock, MdPublic, MdAdd, MdDelete, MdEdit, MdLocationOn, MdLocationOff } from 'react-icons/md';
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { FaSlackHash } from "react-icons/fa";
import EmptyState from './EmptyState';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmModal from '../modal/ConfirmModal';
import EditModal from '../modal/EditModal';
import PasswordModal from '../modal/PasswordModal'
import Toast from '../modal/Toast';
import LocalRoomSection from '../room/LocalRoomSection';
import { SiGroupme } from "react-icons/si";
import { BsGlobeCentralSouthAsia } from "react-icons/bs";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [useLocation, setUseLocation] = useState(false);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const [position, setPosition] = useState({ latitude: null, longitude: null });

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

  const getLocation = async () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ latitude, longitude });

        console.log({ latitude, longitude })
      },
      (err) => {
        console.error(err);
      }

    );
    useEffect(() => {
      getLocation()
    }, [])
  };
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await getAllRoomsApi();
      setRooms(data);
    } catch (err) {
      if (err.response?.status == 401) {
        setToast({ show: true, message: "Session expired. Please login again.", type: 'error' });
        navigate('/login');
      } else
        console.error(err);
    }
    finally { setLoading(false); }
  };


  const openDeleteModal = (e, room) => {
    e.stopPropagation();
    setDeleteConfig({ isOpen: true, roomId: room._id, roomName: room.name });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteRoomApi(deleteConfig.roomId);
      setToast({ show: true, message: "Room deleted !", type: 'success' });
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
      // 1. Prepare the payload including location logic
      const updatePayload = {
        name: updatedData.name,
        description: updatedData.description,
        isprivate: updatedData.isprivate,
        password: updatedData.password,
        // Location Logic:
        // If updatedData has resetLocation: true, we send that.
        // Otherwise, if new coordinates are provided, we send them.
        lng: updatedData.lng,
        lat: updatedData.lat,
        resetLocation: updatedData.resetLocation
      };
      console.log(updatePayload)

      // 2. Call your existing update API
      const updatedRoomFromServer = await updateRoomApi(id, updatePayload);

      setToast({ show: true, message: `Room updated successfully!`, type: 'success' });

      // 3. Update Local State
      setRooms((prev) =>
        prev.map((r) =>
          r._id === id ? updatedRoomFromServer : r
        )
      );

      setEditConfig({ isOpen: false, room: null });
    } catch (err) {
      console.error("Update failed", err);
      setToast({ show: true, message: "Failed to update room settings.", type: 'error' });
    }
  };

  const handleJoin = (id, isPrivate, ownerId, roomName) => {
    const isOwner = user?._id === ownerId || user?.id === ownerId;

    if (isPrivate && !isOwner) {
      // Instead of prompt, we open our custom modal
      setPassModal({ isOpen: true, roomId: id, roomName });
    } else {
      // If public or owner, join immediately with null password
      executeJoin(id, null);
    }
  };

  // 3. The Execution function (handles the actual API call)
  const executeJoin = async (id, password) => {
    try {
      // Note: Wrapping pass in an object if your API expects { password: '...' }

      await joinRoomApi(id, password);

      navigate(`/room/${id}`);
    } catch (err) {
      if (err.response?.status === 401) {
        setToast({ show: true, message: "Session expired. Please login again.", type: 'error' });
        navigate('/login');
      } else {
        setToast({
          show: true,
          message: `${err.response?.data || "Error joining room"}`,
          type: 'error'
        });
      }
    } finally {
      // Always close the modal after the attempt
      setPassModal({ isOpen: false, roomId: null, roomName: '' });
    }
  };

  const toggleRoomLocation = (room) => {
    // Check if room currently has coordinates (assuming GeoJSON structure: location.coordinates)
    const hasLocation = !!(room.location && room.location.coordinates);

    if (hasLocation) {
      // If it has location, we "Reset" it
      handleConfirmEdit(room._id, {
        ...room,           // Pass current name, description, etc.
        lng: null,         // Explicitly nullify
        lat: null,         // Explicitly nullify
        resetLocation: true
      });
    } else {
      // If it doesn't, we "Set" it to current position
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleConfirmEdit(room._id, {
            ...room,       // Pass current name, description, etc.
            lng: pos.coords.longitude,
            lat: pos.coords.latitude,
            resetLocation: false
          });
        },
        (err) => {
          setToast({
            show: true,
            message: "Please enable location permissions.",
            type: 'error'
          });
        },
        { enableHighAccuracy: true }
      );
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      {/* GLOBAL MODALS & NOTIFICATIONS */}
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

      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="flex gap-4 items-center text-3xl font-bold text-slate-800">
            <div className="flex items-center">
              {/* Define the gradient once */}
              <svg width="0" height="0" className="absolute">
                <linearGradient id="hash-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop stopColor="#4f46e5" offset="0%" />   {/* Indigo */}
                  <stop stopColor="#ec4899" offset="50%" />  {/* Pink */}
                  <stop stopColor="#f59e0b" offset="100%" /> {/* Amber */}
                </linearGradient>
              </svg>

              {/* Apply the gradient ID to the icon fill */}
              <FaSlackHash
                size={40}
                style={{ fill: "url(#hash-gradient)" }}
              />
            </div>
            Hashtag
          </h1>
          <p className="text-slate-500">Join a room and start your story</p>

        </div>

        {/* Only show top Create button if rooms exist */}
        {rooms.length > 0 && (
          <Link to={`/room/create`}>
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg">
              <MdAdd size={20} /> Create Room
            </button>
          </Link>
        )}
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-6xl mx-auto ">
        <LocalRoomSection />
        <h2 style={styles.sectionTitle} className='flex gap-2' ><BsGlobeCentralSouthAsia size={20} />
 General Rooms</h2>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white-600"></div>
          </div>
        ) : rooms.length > 0 ? (
          /* SHOW ROOMS */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
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
                            {/* QUICK LOCATION TOGGLE BUTTON */}

                            <button
                              onClick={() => toggleRoomLocation(room)}
                              className={`p-1.5 rounded-full transition-all ${room.location ? 'text-orange-600 bg-orange-50' : 'text-slate-400 hover:bg-slate-50'}`}
                              title={room.location ? "Remove Location" : "Set to Current Location"}
                            >
                              {room.location ? <MdLocationOn size={18} /> : <MdLocationOff size={18} />}
                            </button>

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
                        {(!isOwner && room.location) && <MdLocationOn size={15} />}

                        {room.isprivate ? (
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                            PRIVATE <MdLock size={12} />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            PUBLIC <MdPublic size={12} />
                          </span>
                        )}


                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 truncate">{room.name}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">{room.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                    <span className="text-xs text-slate-400">{room.memberId?.length || 0} Members </span>
                    <button
                      onClick={() => handleJoin(room._id, room.isprivate, room.ownerId, room.name)}
                      className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Join <HiChatBubbleLeftRight size={18} />
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* SHOW EMPTY STATE */
          <div className="animate-in zoom-in-95 duration-500">
            <EmptyState />
          </div>
        )}
      </div>
    </div>
  );
};

const styles = { sectionTitle: { fontSize: '0.95rem', fontWeight: '600', color: '#334155', margin: 0 }, }

export default Dashboard;