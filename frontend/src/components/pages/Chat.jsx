import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import { getMessagesApi, addMessageApi, getRoomByIdApi } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { 
  MdSend, MdArrowBack, MdTag, MdInfoOutline, 
  MdPeopleAlt, MdOutlineKeyboardArrowDown, MdPalette, MdClose 
} from 'react-icons/md';

// Global Themes for the App UI
const THEMES = {
  indigo: { name: 'Indigo', primary: 'bg-indigo-600', text: 'text-indigo-600', border: 'focus:border-indigo-100', shadow: 'shadow-indigo-100' },
  emerald: { name: 'Emerald', primary: 'bg-emerald-600', text: 'text-emerald-600', border: 'focus:border-emerald-100', shadow: 'shadow-emerald-100' },
  rose: { name: 'Rose', primary: 'bg-rose-600', text: 'text-rose-600', border: 'focus:border-rose-100', shadow: 'shadow-rose-100' },
  amber: { name: 'Amber', primary: 'bg-amber-600', text: 'text-amber-600', border: 'focus:border-amber-100', shadow: 'shadow-amber-100' },
};

// Colors for other users' messages
const USER_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500', 
  'bg-orange-500', 'bg-cyan-600', 'bg-fuchsia-500'
];

const Chat = () => {
  const { currentUserId, loading: authLoading } = useAuth();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [text, setText] = useState('');
  const [fetching, setFetching] = useState(true);
  const [showInfo, setShowInfo] = useState(false); // Hidden by default for mobile
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [activeTheme, setActiveTheme] = useState(() => localStorage.getItem('chat-theme') || 'indigo');

  const scrollRef = useRef(null);
  const chatContainerRef = useRef(null);
  const currentTheme = THEMES[activeTheme];

  // Logic to assign a consistent color to a userId
  const getUserColor = (id) => {
    if (!id) return USER_COLORS[0];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
  };

  useEffect(() => {
    localStorage.setItem('chat-theme', activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    if (authLoading || !roomId) return;
    let isMounted = true;
    const initChat = async () => {
      try {
        const [msgData, roomData] = await Promise.all([getMessagesApi(roomId), getRoomByIdApi(roomId)]);
        if (isMounted) {
          setMessages(msgData);
          setRoomInfo(roomData);
          setFetching(false);
          socket.emit("join_room", roomId);
        }
      } catch (err) { setFetching(false); }
    };
    initChat();
    const handleNewMessage = (msg) => setMessages(prev => prev.find(m => m._id === msg._id) ? prev : [...prev, msg]);
    socket.on("new-message", handleNewMessage);
    return () => { isMounted = false; socket.off("new-message", handleNewMessage); };
  }, [roomId, authLoading]);

  useEffect(() => {
    if (isAtBottom) scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAtBottom]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const content = text;
    setText('');
    try {
      const savedMsg = await addMessageApi(roomId, content);
      socket.emit("send_message", { ...savedMsg, roomId });
    } catch (err) { console.error(err); }
  };

  if (authLoading || fetching) return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className={`animate-spin w-8 h-8 border-4 border-t-transparent ${currentTheme.text} rounded-full`} />
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] w-full overflow-hidden font-sans text-slate-900">
      
      {/* MAIN CHAT AREA */}
      <div className="flex flex-col flex-1 h-full min-w-0 bg-white md:my-4 md:ml-4 md:rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">
        
        {/* HEADER */}
        <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-slate-50 bg-white/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-100 rounded-xl transition-all md:hidden text-slate-500">
              <MdArrowBack size={22} />
            </button>
            <div className={`w-10 h-10 rounded-2xl ${currentTheme.primary} flex items-center justify-center text-white shadow-lg ${currentTheme.shadow}`}>
              <MdTag size={20} />
            </div>
            <h1 className="font-bold text-base md:text-lg truncate max-w-[150px]">{roomInfo?.name || "Lobby"}</h1>
          </div>

          <button 
            onClick={() => setShowInfo(true)}
            className="p-2.5 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all"
          >
            <MdInfoOutline size={24} />
          </button>
        </header>

        {/* MESSAGES LIST */}
        <main 
          ref={chatContainerRef} 
          onScroll={() => {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            setIsAtBottom(scrollHeight - scrollTop <= clientHeight + 100);
          }}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-1 bg-[#FCFDFF]"
        >
          {messages.map((msg, idx) => {
            const senderId = msg.senderId?._id || msg.senderId;
            const isMine = senderId === currentUserId;
            const isFirst = idx === 0 || (messages[idx-1].senderId?._id || messages[idx-1].senderId) !== senderId;
            
            // Theme Logic: Mine = Chosen Global Theme | Others = Random Persistent Color
            const bubbleColor = isMine ? currentTheme.primary : getUserColor(senderId);

            return (
              <div key={msg._id || idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'} ${isFirst ? 'mt-6' : 'mt-1'}`}>
                <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  {isFirst && !isMine && (
                    <span className="text-[10px] font-black text-slate-400 ml-3 mb-1 uppercase tracking-tighter">
                      {msg.senderId?.username || "Guest User"}
                    </span>
                  )}
                  <div className={`px-4 py-2.5 transition-all text-white shadow-sm ${bubbleColor} ${
                    isFirst ? (isMine ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl rounded-tl-none') : 'rounded-2xl'
                  }`}>
                    <p className="text-[14px] md:text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </main>

        {/* INPUT */}
        <footer className="p-4 md:p-6 bg-white border-t border-slate-50">
          <form onSubmit={handleSend} className="flex items-center gap-2 max-w-5xl mx-auto">
            <input
              type="text"
              placeholder="Write something..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`flex-1 bg-slate-50 border-2 border-transparent ${currentTheme.border} focus:bg-white rounded-2xl px-5 py-3 transition-all outline-none`}
            />
            <button type="submit" disabled={!text.trim()} className={`${currentTheme.primary} text-white p-3.5 rounded-2xl shadow-lg ${currentTheme.shadow} active:scale-95 transition-all`}>
              <MdSend size={20} />
            </button>
          </form>
        </footer>
      </div>

      {/* MOBILE DRAWER & DESKTOP SIDEBAR */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 lg:relative lg:z-auto ${showInfo ? 'opacity-100' : 'opacity-0 pointer-events-none lg:hidden'}`}>
        {/* Backdrop for Mobile */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={() => setShowInfo(false)} />
        
        <aside className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-8 transition-transform duration-500 transform lg:static lg:flex lg:flex-col lg:w-80 lg:m-4 lg:rounded-[2rem] lg:translate-y-0 ${showInfo ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <h2 className="text-xl font-bold">Room Settings</h2>
            <button onClick={() => setShowInfo(false)} className="p-2 bg-slate-100 rounded-full"><MdClose size={20}/></button>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className={`w-20 h-20 ${currentTheme.primary} bg-opacity-10 rounded-3xl flex items-center justify-center ${currentTheme.text} mb-4 ring-8 ring-slate-50`}>
              <MdPeopleAlt size={40} />
            </div>
            <h2 className="text-xl font-bold hidden lg:block">{roomInfo?.name}</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Active Discussion</p>
          </div>

          <div className="mt-10 space-y-8">
            <div>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><MdPalette/> Interface Theme</h3>
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(THEMES).map(([id, theme]) => (
                  <button
                    key={id}
                    onClick={() => setActiveTheme(id)}
                    className={`h-10 rounded-xl transition-all ${theme.primary} ${activeTheme === id ? 'ring-4 ring-slate-200' : 'opacity-60 scale-90'}`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">About Room</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{roomInfo?.description || "No specific guidelines set."}</p>
            </div>

            <button onClick={() => navigate('/dashboard')} className="w-full p-4 bg-red-50 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-100 transition-colors">
              Leave Chat Room
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Chat;