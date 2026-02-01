import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import { getMessagesApi, addMessageApi, getRoomByIdApi, leaveRoomApi } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { MdSend, MdArrowBack, MdTag, MdInfoOutline } from 'react-icons/md';
import { HiChatBubbleLeftRight } from "react-icons/hi2";
const Chat = () => {
  const { currentUserId, loading: authLoading } = useAuth();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [text, setText] = useState('');
  const [fetching, setFetching] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (authLoading || !roomId) return;

    let isMounted = true;

    const initChat = async () => {
      try {
        const [msgData, roomData] = await Promise.all([
          getMessagesApi(roomId),
          getRoomByIdApi(roomId)
        ]);
        if (isMounted) {
          setMessages(msgData);
          setRoomInfo(roomData);
          setFetching(false);

          //console.log("1. Emitting join_room for:", roomId);
          socket.emit("join_room", roomId);
        }
      } catch (err) {
        console.error("Init Error:", err);
        setFetching(false);
      }
    };

    initChat();


    const handleNewMessage = (incomingMsg) => {
      //console.log("2. RECEIVED MESSAGE VIA SOCKET:", incomingMsg);

      setMessages((prev) => {

        if (prev.find(m => m._id === incomingMsg._id)) return prev;
        const newArray = [...prev, incomingMsg];
        console.log("3. UI STATE UPDATING. New count:", newArray.length);
        return newArray;
      });
    };

    socket.on("new-message", handleNewMessage);


    socket.on("connect", () => {
      //console.log("Socket reconnected. Re-joining room:", roomId);
      socket.emit("join_room", roomId);
    });

    return () => {
      isMounted = false;
      socket.off("new-message", handleNewMessage);
      socket.off("connect");
    };
  }, [roomId, authLoading]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const messageContent = text;
      setText('');

      const savedMsg = await addMessageApi(roomId, messageContent);
      //console.log("4. MESSAGE SAVED TO DB:", savedMsg);


      socket.emit("send_message", { ...savedMsg, roomId });
      //console.log("5. EMITTED send_message to server");

    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  const handleBack = async () => {
    await leaveRoomApi(roomId);
    navigate('/dashboard');
  };
  const getSenderColor = (id) => {
  const colors = [
    'text-blue-600', 'text-emerald-600', 'text-orange-600', 
    'text-pink-600', 'text-purple-600', 'text-amber-600', 'text-cyan-600'
  ];
  // Simple hash to pick a color based on ID
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

  if (authLoading || fetching) return <div className="flex h-screen items-center justify-center">Loading...</div>;
return (
  <div className="flex flex-col h-screen bg-[#f8fafc] w-full overflow-hidden font-sans">
    {/* HEADER: Glassmorphism effect */}
    <header className="flex items-center gap-4 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
      <button 
        onClick={handleBack} 
        className="p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-90"
      >
        <MdArrowBack size={24} className="text-slate-600" />
      </button>
      <div className="flex-1">
        <h1 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
          <div className="bg-indigo-100 p-1.5 rounded-lg">
            <MdTag className="text-indigo-600" />
          </div>
          {roomInfo?.name || "Chat Room"}
        </h1>
        <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1 ml-9">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Online
        </p>
      </div>
    </header>

    {/* MESSAGES AREA: Soft scroll and spacing */}
    <main className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scroll-smooth">
      {messages.map((msg, index) => {
        const senderId = msg.senderId?._id || msg.senderId;
        const senderName = msg.senderId?.username || "Guest";
        const isMine = senderId === currentUserId;

        return (
          <div 
            key={msg._id || index} 
            className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            {/* Sender Name (Only show for others) */}
            {!isMine && (
              <span className="text-[11px] font-semibold text-slate-500 ml-2 mb-1 uppercase tracking-wider">
                {senderName}
              </span>
            )}

            {/* Message Bubble */}
            <div className={`max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-2xl shadow-sm transition-all hover:shadow-md ${
              isMine
                ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-br-none'
                : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
            }`}>
              <p className="text-[15px] leading-relaxed break-words">
                {msg.content}
              </p>

              {/* Timestamp */}
              <div className={`text-[10px] mt-1.5 flex items-center gap-1 opacity-70 ${isMine ? 'justify-end text-indigo-100' : 'justify-start text-slate-400'}`}>
                <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {isMine && <span className="ml-1">✓</span>}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={scrollRef} />
    </main>

    {/* FOOTER: Modern input with floating action */}
    <footer className="p-4 bg-white border-t border-slate-200">
      <form onSubmit={handleSend} className="flex gap-3 max-w-5xl mx-auto">
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-slate-100 focus:bg-white border-2 border-transparent focus:border-indigo-500/20 rounded-2xl px-5 py-3 transition-all outline-none text-slate-700 shadow-inner"
          />
        </div>
        <button 
          type="submit" 
          disabled={!text.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white p-3.5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-indigo-200 disabled:shadow-none"
        >
          <MdSend size={22} />
        </button>
      </form>
    </footer>
  </div>
);
};

export default Chat;