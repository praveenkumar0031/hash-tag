import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import { getMessagesApi, addMessageApi, getRoomByIdApi } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { 
  MdSend, MdArrowBack, MdTag, MdInfoOutline, 
  MdPeopleAlt, MdPalette, MdClose 
} from 'react-icons/md';

const THEMES = {
  rose: { 
    name: 'Rose', 
    primary: 'bg-[#ff8da1]', 
    text: 'text-[#ff8da1]', 
    border: 'focus:border-[#ff8da1]', 
    shadow: 'shadow-[#ff8da1]/20' 
  },
  coral: { 
    name: 'Coral', 
    primary: 'bg-[#ff6b6b]', 
    text: 'text-[#ff6b6b]', 
    border: 'focus:border-[#ff6b6b]', 
    shadow: 'shadow-[#ff6b6b]/20' 
  },
  amber: { 
    name: 'Amber', 
    primary: 'bg-[#f7e9b0]', 
    text: 'text-[#8a7a3a]', 
    border: 'focus:border-[#f7e9b0]', 
    shadow: 'shadow-[#f7e9b0]/20',
    darkText: true 
  },
  sky: { 
    name: 'Sky', 
    primary: 'bg-[#90caf9]', 
    text: 'text-[#90caf9]', 
    border: 'focus:border-[#90caf9]', 
    shadow: 'shadow-[#90caf9]/20' 
  },
};

const USER_COLORS = ['bg-[#ff8da1]', 'bg-[#ff6b6b]', 'bg-[#90caf9]', 'bg-[#f7e9b0]'];

const Chat = () => {
  const { currentUserId, loading: authLoading } = useAuth();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [text, setText] = useState('');
  const [fetching, setFetching] = useState(true);
  const [showInfo, setShowInfo] = useState(false); 
  const [isAtBottom, setIsAtBottom] = useState(true);

  // DEBUG FIX: Ensure we always fall back to a valid key if localStorage is empty or corrupted
  const [activeTheme, setActiveTheme] = useState(() => {
    const saved = localStorage.getItem('chat-theme');
    return (saved && THEMES[saved]) ? saved : 'rose';
  });

  const scrollRef = useRef(null);
  const chatContainerRef = useRef(null);

  // DEBUG FIX: Fallback to THEMES.rose if activeTheme somehow becomes invalid
  const currentTheme = THEMES[activeTheme] || THEMES.rose;

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
      setFetching(true);
      try {
        const [msgData, roomData] = await Promise.all([
          getMessagesApi(roomId), 
          getRoomByIdApi(roomId)
        ]);
        if (isMounted) {
          setMessages(msgData);
          setRoomInfo(roomData);
          setFetching(false);
          socket.emit("join_room", roomId);
        }
      } catch (err) { 
        if (isMounted) setFetching(false); 
      }
    };

    initChat();

    const handleNewMessage = (msg) => {
      setMessages(prev => {
        if (prev.some(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("new-message", handleNewMessage);
    return () => {
      isMounted = false;
      socket.off("new-message", handleNewMessage);
      socket.emit("leave_room", roomId);
    };
  }, [roomId, authLoading]);

  useEffect(() => {
    if (isAtBottom) scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAtBottom]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const content = text;
    const tempId = `temp-${Date.now()}`;
    setText('');

    const tempMsg = {
      _id: tempId,
      tempId: true,
      content,
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempMsg]);

    try {
      const savedMsg = await addMessageApi(roomId, content);
      setMessages(prev => prev.map(m => m._id === tempId ? savedMsg : m));
      socket.emit("send_message", { ...savedMsg, roomId });
    } catch (err) {
      setMessages(prev => prev.filter(m => m._id !== tempId));
    }
  };

  // Error happened here: currentTheme was undefined. 
  // Added optional chaining and the fallback above.
  if (authLoading || fetching) return (
    <div className="flex h-screen w-full items-center justify-center bg-[#fffcf9]">
      <div className={`animate-spin w-8 h-8 border-4 border-t-transparent ${currentTheme?.text || 'text-rose-400'} rounded-full`} />
    </div>
  );

  return (
    <div className="flex h-screen bg-[#fffcf9] w-full overflow-hidden font-sans text-slate-900">
      <div className="flex flex-col flex-1 h-full min-w-0 bg-white md:my-4 md:ml-4 md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
        <header className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-50 rounded-xl transition-all md:hidden text-slate-500">
              <MdArrowBack size={22} />
            </button>
            <div className={`w-10 h-10 rounded-xl ${currentTheme.primary} flex items-center justify-center ${currentTheme.darkText ? 'text-slate-800' : 'text-white'}`}>
              <MdTag size={20} />
            </div>
            <h1 className="font-bold text-lg text-slate-800 truncate max-w-[180px]">{roomInfo?.name || "Lobby"}</h1>
          </div>
          <button onClick={() => setShowInfo(true)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 transition-all">
            <MdInfoOutline size={24} />
          </button>
        </header>

        <main 
          ref={chatContainerRef} 
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            setIsAtBottom(scrollHeight - scrollTop <= clientHeight + 100);
          }}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-1 bg-[#fffcf9]/30"
        >
          {messages.map((msg, idx) => {
            const senderId = msg.senderId?._id || msg.senderId;
            const mine = senderId === currentUserId;
            const isFirst = idx === 0 || (messages[idx-1].senderId?._id || messages[idx-1].senderId) !== senderId;
            const bubbleColor = mine ? currentTheme.primary : getUserColor(senderId);

            return (
              <div key={msg._id} className={`flex ${mine ? 'justify-end' : 'justify-start'} ${isFirst ? 'mt-4' : 'mt-0.5'}`}>
                <div className={`max-w-[85%] flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                  {isFirst && !mine && (
                    <span className="text-[11px] font-bold text-slate-400 ml-1 mb-1">
                      {msg.senderId?.username || "Guest"}
                    </span>
                  )}
                  <div className={`px-4 py-2 shadow-sm border border-black/5 ${bubbleColor} ${
                    isFirst ? (mine ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl rounded-tl-none') : 'rounded-2xl'
                  } ${mine && currentTheme.darkText ? 'text-slate-800' : (mine ? 'text-white' : 'text-slate-800')} ${msg.tempId ? 'opacity-50' : 'opacity-100'}`}>
                    <p className="text-[15px] leading-snug break-words">{msg.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </main>

        <footer className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="flex items-center gap-2 max-w-4xl mx-auto">
            <input
              type="text"
              placeholder="Ask your neighborhood anything..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`flex-1 bg-white border-2 border-slate-200 ${currentTheme.border} rounded-xl px-4 py-3 transition-all outline-none text-slate-700`}
            />
            <button type="submit" disabled={!text.trim()} className={`${currentTheme.primary} ${currentTheme.darkText ? 'text-slate-800' : 'text-white'} p-3.5 rounded-xl shadow-md active:scale-95 transition-all`}>
              <MdSend size={20} />
            </button>
          </form>
        </footer>
      </div>

      {/* INFO PANEL */}
      <div className={`fixed inset-0 z-50 transition-opacity lg:relative lg:z-auto ${showInfo ? 'opacity-100' : 'opacity-0 pointer-events-none lg:hidden'}`}>
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm lg:hidden" onClick={() => setShowInfo(false)} />
        <aside className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 transition-transform lg:static lg:w-72 lg:m-4 lg:rounded-3xl lg:border lg:border-slate-200 lg:translate-y-0 ${showInfo ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="font-bold">Room Info</h2>
            <button onClick={() => setShowInfo(false)} className="p-2 bg-slate-100 rounded-full"><MdClose size={20}/></button>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 ${currentTheme.primary} rounded-2xl flex items-center justify-center ${currentTheme.darkText ? 'text-slate-800' : 'text-white'} mb-3`}>
              <MdPeopleAlt size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">{roomInfo?.name}</h2>
          </div>
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><MdPalette/> Switch Theme</h3>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(THEMES).map(([id, theme]) => (
                  <button key={id} onClick={() => setActiveTheme(id)} className={`h-8 rounded-lg ${theme.primary} ${activeTheme === id ? 'ring-2 ring-slate-800 ring-offset-2' : 'opacity-50'}`} />
                ))}
              </div>
            </div>
            <button onClick={() => navigate('/dashboard')} className="w-full p-3 border-2 border-slate-200 text-slate-500 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-500 transition-all">
              Leave Room
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Chat;