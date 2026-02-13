import { getLocalRooms, joinRoomApi } from '../../api/api';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { IoIosArrowDropdownCircle, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdLock, MdMyLocation } from 'react-icons/md';
import { FaSlackHash } from "react-icons/fa"; 
import PasswordModal from '../modal/PasswordModal';
import Toast from '../modal/Toast';

const LocalRoomSection = ({ user }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const [coords, setCoords] = useState({ lng: 77.07, lat: 11.04 });
  const [passModal, setPassModal] = useState({ isOpen: false, roomId: null, roomName: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  const fetchRooms = useCallback(async (locationData) => {
    try {
      setLoading(true);
      const response = await getLocalRooms({ 
        lng: locationData.lng, 
        lat: locationData.lat, 
        distance: 15 
      });
      const roomArray = response?.data?.data || response?.data || [];
      setRooms(Array.isArray(roomArray) ? roomArray : []);
    } catch (error) {
      setToast({ show: true, message: "Failed to fetch nearby rooms", type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setToast({ show: true, message: "Geolocation not supported", type: 'error' });
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setCoords(newCoords);
        fetchRooms(newCoords);
        setToast({ show: true, message: "Location updated!", type: 'success' });
      },
      () => {
        setLoading(false);
        setToast({ show: true, message: "Location access denied", type: 'error' });
      }
    );
  };

  useEffect(() => { fetchRooms(coords); }, [fetchRooms]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const cardWidth = scrollRef.current.firstChild.offsetWidth + 20; 
      const scrollTo = direction === 'left' ? scrollLeft - cardWidth : scrollLeft + cardWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleJoin = (id, isPrivate, ownerId, roomName) => {
    const isOwner = (user?._id || user?.id) === ownerId;
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
      setToast({ show: true, message: "Error joining room", type: 'error' });
    } finally {
      setPassModal({ isOpen: false, roomId: null, roomName: '' });
    }
  };

  return (
    <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden transition-all duration-500">
      <PasswordModal
        isOpen={passModal.isOpen}
        roomName={passModal.roomName}
        onCancel={() => setPassModal({ ...passModal, isOpen: false })}
        onConfirm={(password) => executeJoin(passModal.roomId, password)}
      />
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

      <div className="p-6 flex justify-between items-center bg-white relative z-10">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsOpen(!isOpen)}>
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Nearby <span className="bg-gradient-to-r from-indigo-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">Spaces</span>
            <IoIosArrowDropdownCircle 
              className={`text-slate-300 group-hover:text-indigo-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {isOpen && rooms.length > (window.innerWidth < 768 ? 1 : 3) && (
            <div className="hidden md:flex items-center gap-1 mr-2">
              <button onClick={() => scroll('left')} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all"><IoIosArrowBack size={20}/></button>
              <button onClick={() => scroll('right')} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all"><IoIosArrowForward size={20}/></button>
            </div>
          )}
          
          <button 
            onClick={handleGetLocation}
            className="p-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-90"
            disabled={loading}
          >
            <MdMyLocation size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="px-6 pb-8">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
               <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : rooms.length > 0 ? (
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto gap-5 pb-4 no-scrollbar snap-x snap-mandatory px-1"
              style={{ scrollBehavior: 'smooth' }}
            >
              {rooms.map((room) => {
                const isOwner = (user?._id || user?.id) === room.ownerId;
                return (
                  <div 
                    key={room._id} 
                    className={`snap-center md:snap-start snap-always shrink-0 w-[92%] sm:w-[45%] lg:w-[31.5%] 
                      border rounded-[2rem] p-6 flex flex-col justify-between 
                      relative overflow-hidden transition-all duration-500 group
                      ${isOwner 
                        ? 'bg-gradient-to-br from-indigo-50/40 to-white border-indigo-100 shadow-indigo-50 hover:shadow-indigo-100/60' 
                        : 'bg-slate-50/50 border-slate-100 hover:bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50'
                      }`}
                  >
                    {/* OWNER BACKGROUND WATERMARK */}
                    {isOwner && (
                      <div className="absolute -bottom-4 -right-4 text-indigo-600 opacity-[0.09] transition-transform duration-700 group-hover:scale-150 group-hover:-rotate-12 pointer-events-none">
                         <FaSlackHash size={140} />
                      </div>
                    )}

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${room.isprivate ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                          {room.isprivate ? 'Private' : 'Public'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {room.isprivate && <MdLock size={18} className="text-amber-500" />}
                          {isOwner && (
                            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                               yours
                            </span>
                          )}
                        </div>
                      </div>
                      <h3 className="font-black text-slate-800 text-lg mb-1 truncate tracking-tight">{room.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 font-medium leading-relaxed">
                        {room.description || "No description provided."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-200/50 relative z-10">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Nearby Space</span>
                         <span className="text-xs font-bold text-slate-700">{new Date(room.createdAt).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={() => handleJoin(room._id, room.isprivate, room.ownerId, room.name)}
                        className="bg-gradient-to-br from-indigo-600 via-pink-500 to-amber-500 text-white p-3 rounded-2xl shadow-lg shadow-indigo-200 hover:scale-110 active:scale-95 transition-all"
                      >
                        <HiChatBubbleLeftRight size={22} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold text-sm">Nothing nearby right now.</p>
              <button onClick={handleGetLocation} className="text-indigo-600 text-xs font-black mt-3 uppercase tracking-widest">Update Location</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default LocalRoomSection;