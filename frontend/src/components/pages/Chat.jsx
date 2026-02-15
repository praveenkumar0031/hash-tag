import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import { getMessagesApi, addMessageApi, getRoomByIdApi } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { 
  MdSend, MdArrowBack, MdTag, MdInfoOutline, 
  MdImage, MdLogout 
} from 'react-icons/md';

const Chat = () => {
  const { currentUserId, loading: authLoading } = useAuth();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [text, setText] = useState('');
  const [fetching, setFetching] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollRef = useRef(null);
  const chatContainerRef = useRef(null);

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
      } catch (err) { 
        setFetching(false); 
      }
    };

    initChat();

    const handleNewMessage = (msg) => {
      setMessages(prev => {
        if (prev.find(m => m._id === msg._id || (m.tempId && m.tempId === msg.tempId))) {
          return prev;
        }
        return [...prev, msg];
      });
    };

    socket.on("new-message", handleNewMessage);
    return () => { 
      isMounted = false; 
      socket.off("new-message", handleNewMessage); 
    };
  }, [roomId, authLoading]);

  useEffect(() => {
    if (isAtBottom) scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAtBottom]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const content = text;
    const tempId = Date.now().toString();
    
    const optimisticMsg = {
      _id: tempId,
      tempId: tempId,
      content: content,
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
      sending: true 
    };

    setMessages(prev => [...prev, optimisticMsg]);
    setText('');

    try {
      const savedMsg = await addMessageApi(roomId, content);
      setMessages(prev => prev.map(m => m.tempId === tempId ? savedMsg : m));
      socket.emit("send_message", { ...savedMsg, roomId, tempId });
    } catch (err) {
      setMessages(prev => prev.filter(m => m.tempId !== tempId));
      alert("Message delivery failed.");
    }
  };

  if (authLoading || fetching) return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-[#FF99AC] rounded-full" />
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8F9FA] w-full overflow-hidden font-sans text-slate-900">
      
      <div className="flex flex-col flex-1 h-full min-w-0 bg-white overflow-hidden relative">
        
        {/* HEADER - Using Sky Blue for the LIVE badge */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 shadow-sm z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-1 hover:bg-slate-100 rounded-lg md:hidden text-slate-500">
              <MdArrowBack size={24} />
            </button>
            <div className="w-12 h-12 rounded-lg bg-[#FF99AC] flex items-center justify-center text-white shadow-sm">
              <MdTag size={26} />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-800 leading-tight">Nearby Chat</h1>
              <p className="text-[10px] font-mono text-slate-400">
                📍 {roomInfo?.location?.coordinates ? 
                    `${roomInfo.location.coordinates[1]}, ${roomInfo.location.coordinates[0]}` : 
                    "11.04, 77.07"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* LIVE Badge using the Sky Blue from the screenshot */}
            <div className="hidden sm:flex items-center gap-2 bg-[#A8D3FF] text-[#1E40AF] px-3 py-1.5 rounded-md font-bold text-[11px] tracking-wide">
              <span className="w-2 h-2 bg-[#1E40AF] rounded-full animate-pulse" /> LIVE
            </div>
            
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-red-50 text-red-500 px-3 py-2 rounded-xl font-bold text-xs hover:bg-red-100 transition-colors"
            >
              <MdLogout size={18} />
              <span className="hidden md:inline">Leave</span>
            </button>
          </div>
        </header>

        {/* MESSAGES LIST */}
        <main 
          ref={chatContainerRef} 
          onScroll={() => {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            setIsAtBottom(scrollHeight - scrollTop <= clientHeight + 100);
          }}
          className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 bg-white"
        >
          {messages.map((msg, idx) => {
            const senderId = msg.senderId?._id || msg.senderId;
            const isMine = senderId === currentUserId;
            
            return (
              <div key={msg._id || idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[60%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  
                  {/* Bubble Colors: Mine is Hotspot Pink, Admin/Others is Soft Yellow */}
                  <div className={`relative px-5 py-3 shadow-md transition-all ${
                    isMine 
                      ? 'bg-[#FF99AC] text-black rounded-l-2xl rounded-tr-2xl' 
                      : 'bg-[#F3E8AA] text-black border border-[#E6D991] rounded-r-2xl rounded-tl-2xl'
                  } ${msg.sending ? 'opacity-70' : 'opacity-100'}`}>
                    {!isMine && (
                      <span className="block text-[10px] font-black text-slate-500 uppercase tracking-tight mb-1">
                        {msg.senderId?.username || "ADMIN"}
                      </span>
                    )}
                    <p className="text-[14px] md:text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                      {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}
                    </p>
                    <div className={`text-[9px] mt-1 flex items-center justify-end gap-1 font-bold ${isMine ? 'text-slate-800' : 'text-slate-500'}`}>
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"} 
                      {isMine && (msg.sending ? '...' : '✓')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </main>

        {/* INPUT FOOTER - Border using Sky Blue highlight */}
        <footer className="p-6 bg-white border-t border-slate-50">
          <div className="max-w-5xl mx-auto">
            <form onSubmit={handleSend} className="flex items-center bg-white border-2 border-[#A8D3FF] rounded-lg shadow-sm focus-within:shadow-md transition-all">
              <input
                type="text"
                placeholder="Ask your neighborhood anything..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 px-6 py-4 outline-none text-slate-700 placeholder:text-slate-400 font-medium bg-transparent"
              />
              
              <div className="flex items-center gap-3 px-4 border-l border-slate-100">
                <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                  <MdImage size={24} />
                </button>
                <button 
                  type="submit" 
                  disabled={!text.trim()} 
                  className={`p-1.5 transition-all ${text.trim() ? 'text-[#FF99AC] scale-110' : 'text-slate-300'}`}
                >
                  <MdSend size={24} />
                </button>
              </div>
            </form>
            <p className="text-center text-[11px] text-slate-400 mt-3 font-medium">
              Press Enter to send · Messages visible to nearby users only
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Chat;