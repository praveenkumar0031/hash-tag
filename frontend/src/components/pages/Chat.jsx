import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import { getMessagesApi, addMessageApi, getRoomByIdApi } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { 
  MdSend, MdArrowBack, MdTag, MdInfoOutline, 
  MdPeopleAlt, MdClose, MdDescription 
} from 'react-icons/md';

const THEMES = {
  rose: { bg: 'bg-[#ff8da1]', text: 'text-white' },
  sky: { bg: 'bg-[#90caf9]', text: 'text-slate-800' },
  lemon: { bg: 'bg-[#fef08a]', text: 'text-slate-800' },
  yellow: { bg: 'bg-[#fbbf24]', text: 'text-slate-800' },
  green: { bg: 'bg-[#4ade80]', text: 'text-slate-800' },
  emerald: { bg: 'bg-[#059669]', text: 'text-white' },
  amber: { bg: 'bg-[#f7e9b0]', text: 'text-slate-800' },
};

const THEME_KEYS = Object.keys(THEMES);

const Chat = () => {
  const { currentUserId, loading: authLoading } = useAuth();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState(() => {
    try {
      const cached = localStorage.getItem(`cache_messages_${roomId}`);
      return cached ? JSON.parse(cached) : [];
    } catch { return []; }
  });
  
  const [roomInfo, setRoomInfo] = useState(() => {
    try {
      const cached = localStorage.getItem(`cache_room_${roomId}`);
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  });

  const [text, setText] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollRef = useRef(null);
  const chatContainerRef = useRef(null);

  const getUserTheme = useCallback((userId) => {
    if (!userId) return THEMES.rose;
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return THEMES[THEME_KEYS[Math.abs(hash) % THEME_KEYS.length]];
  }, []);

  useEffect(() => {
    if (authLoading || !roomId) return;
    
    const initChat = async () => {
      try {
        const [msgData, roomData] = await Promise.all([
          getMessagesApi(roomId),
          getRoomByIdApi(roomId)
        ]);
        
        const actualRoom = roomData?.data || roomData?.room || roomData;
        const actualMessages = msgData?.data || msgData?.messages || msgData;

        setMessages(actualMessages);
        setRoomInfo(actualRoom);
        
        localStorage.setItem(`cache_messages_${roomId}`, JSON.stringify(actualMessages.slice(-50)));
        localStorage.setItem(`cache_room_${roomId}`, JSON.stringify(actualRoom));
        
        socket.emit("join_room", roomId);
      } catch (err) {
        console.error("Sync error:", err);
      }
    };

    initChat();

    const handleNewMessage = (msg) => {
      setMessages(prev => {
        if (prev.some(m => m._id === msg._id)) return prev;
        const isOurMessage = (msg.senderId?._id || msg.senderId) === currentUserId;
        const existsAsTemp = prev.some(m => m.tempId && m.content === msg.content);
        if (isOurMessage && existsAsTemp) return prev;

        const updated = [...prev, msg];
        localStorage.setItem(`cache_messages_${roomId}`, JSON.stringify(updated.slice(-50)));
        return updated;
      });
    };

    socket.on("new-message", handleNewMessage);
    return () => {
      socket.off("new-message", handleNewMessage);
      socket.emit("leave_room", roomId);
    };
  }, [roomId, authLoading, currentUserId]);

  useEffect(() => {
    if (isAtBottom) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAtBottom]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const content = text;
    const tempId = `temp-${Date.now()}-${Math.random()}`; 
    setText('');

    const tempMsg = {
      _id: tempId,
      tempId: true,
      content,
      senderId: { _id: currentUserId, username: "You" },
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempMsg]);

    try {
      const savedMsg = await addMessageApi(roomId, content);
      const finalMsg = savedMsg?.data || savedMsg;
      
      setMessages(prev => {
        const updated = prev.map(m => m._id === tempId ? finalMsg : m);
        localStorage.setItem(`cache_messages_${roomId}`, JSON.stringify(updated.slice(-50)));
        return updated;
      });

      socket.emit("send_message", { ...finalMsg, roomId });
    } catch (err) {
      setMessages(prev => prev.filter(m => m._id !== tempId));
    }
  };

  if (authLoading) return <div className="h-screen bg-[#fffcf9]" />;

  return (
    <div className="flex h-screen bg-[#fffcf9] w-full overflow-hidden font-sans antialiased text-slate-900 justify-center">
      {/* Container capped for large screens */}
      <div className="flex w-full max-w-[1600px] h-full relative">
        
        {/* Main Chat Area */}
        <div className={`flex flex-col flex-1 h-full min-w-0 bg-white md:my-4 md:ml-4 md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative transition-all duration-300 ${showInfo ? 'lg:mr-0' : 'md:mr-4'}`}>
          
          <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-50 bg-white/80 backdrop-blur-md z-20">
            <div className="flex items-center gap-2 md:gap-4">
              <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors md:hidden">
                <MdArrowBack size={24} className="text-slate-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                  <MdTag size={20} />
                </div>
                <div className="min-w-0">
                  <h1 className="font-bold text-sm md:text-base truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                    {roomInfo?.name || "Loading Room..."}
                  </h1>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live</p>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowInfo(!showInfo)} 
              className={`p-2 rounded-full transition-colors ${showInfo ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-400'}`}
            >
              <MdInfoOutline size={24} />
            </button>
          </header>

          <main 
            ref={chatContainerRef}
            onScroll={(e) => {
              const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
              setIsAtBottom(scrollHeight - scrollTop <= clientHeight + 150);
            }}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-1 bg-[#fffcf9]/30"
          >
            {messages.map((msg, idx) => {
              const senderIdObj = msg.senderId?._id || msg.senderId;
              const mine = senderIdObj === currentUserId;
              const theme = getUserTheme(senderIdObj);
              const isFirst = idx === 0 || (messages[idx-1].senderId?._id || messages[idx-1].senderId) !== senderIdObj;

              return (
                <div key={msg._id} className={`flex items-end gap-2 ${mine ? 'justify-end' : 'justify-start'} ${isFirst ? 'mt-6' : 'mt-0.5'}`}>
                  {!mine && (
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black shadow-sm ${theme.bg} ${theme.text} ${!isFirst ? 'opacity-0' : 'opacity-100'}`}>
                      {msg.senderId?.username?.charAt(0).toUpperCase() || "G"}
                    </div>
                  )}
                  <div className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                    {isFirst && !mine && <span className="text-[10px] font-bold text-slate-400 mb-1 ml-1">{msg.senderId?.username || "Guest"}</span>}
                    <div className={`px-4 py-2 shadow-sm border border-black/[0.01] ${theme.bg} ${theme.text} ${mine ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl rounded-tl-none'} ${msg.tempId ? 'opacity-50 scale-95' : ''} transition-all`}>
                      <p className="text-[14px] md:text-[15px] leading-relaxed break-words">{msg.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} className="h-4" />
          </main>

          <footer className="p-3 md:p-4 bg-white border-t border-slate-50">
            <form onSubmit={handleSend} className="flex items-center gap-2 md:gap-3 max-w-4xl mx-auto">
              <input
                type="text"
                placeholder="Write a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 bg-slate-50 border-none focus:ring-2 focus:ring-slate-100 rounded-xl md:rounded-2xl px-4 md:px-5 py-2.5 md:py-3 transition-all outline-none text-sm md:text-base"
              />
              <button type="submit" disabled={!text.trim()} className="bg-slate-900 text-white p-3 md:p-3.5 rounded-xl md:rounded-2xl shadow-lg active:scale-90 disabled:opacity-20 transition-all">
                <MdSend size={20} />
              </button>
            </form>
          </footer>
        </div>

        {/* Improved Side Panel: Mobile Overlay + Large Screen Sidebar */}
        {showInfo && (
          <>
            {/* Mobile Backdrop */}
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setShowInfo(false)}
            />
            
            <aside className="fixed right-0 top-0 bottom-0 z-50 w-[85%] sm:w-80 bg-white p-6 shadow-2xl flex flex-col lg:static lg:z-auto lg:m-4 lg:ml-0 lg:rounded-3xl lg:border lg:border-slate-200 lg:shadow-sm animate-in slide-in-from-right duration-300">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <MdInfoOutline className="text-slate-400" /> Room Details
                </h2>
                <button onClick={() => setShowInfo(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><MdClose size={20}/></button>
              </div>

              <div className="flex flex-col items-center text-center overflow-y-auto flex-1 custom-scrollbar">
                <div className="w-20 h-20 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white mb-4 shadow-2xl shadow-slate-200">
                  <MdPeopleAlt size={36} />
                </div>
                
                <h3 className="text-xl font-black text-slate-800 px-2 leading-tight">
                  {roomInfo?.name || "Anonymous Room"}
                </h3>
                
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Public Community</span>
                </div>

                <hr className="w-full my-6 border-slate-100" />

                {/* Room Description Section */}
                <div className="w-full text-left space-y-4">
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <MdDescription size={14}/> About this room
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-50">
                      {roomInfo?.description || "No description provided for this neighborhood group. Welcome to the community!"}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <p className="text-[11px] text-blue-600 font-medium leading-tight">
                      Messages are live. Please follow community guidelines and be respectful to others.
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-6 w-full">
                  <button 
                    onClick={() => navigate('/dashboard')} 
                    className="w-full py-3.5 bg-red-50 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm shadow-red-100"
                  >
                    Leave Room
                  </button>
                </div>
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;