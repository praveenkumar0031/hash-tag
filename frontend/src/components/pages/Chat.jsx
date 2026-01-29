import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import { getMessagesApi, addMessageApi,getRoomByIdApi } from '../../api/api';

import { MdSend, MdArrowBack, MdTag, MdInfoOutline } from 'react-icons/md';

const Chat = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [text, setText] = useState('');
  const scrollRef = useRef(null);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
  if (!roomId || roomId === "undefined") return;

  // 1. Join Room immediately
  socket.emit("join_room", roomId);
  console.log("Client Emitted join_room for:", roomId);

  // 2. Fetch History & Room Info
  const initChat = async () => {
    try {
      const [msgData, roomData] = await Promise.all([
        getMessagesApi(roomId),
        getRoomByIdApi(roomId)
      ]);
      setMessages(msgData);
      setRoomInfo(roomData);
    } catch (err) {
      console.error("Init Error:", err);
    }
  };
  initChat();

  // 3. Setup Listener ONCE
  const handleNewMessage = (incomingMsg) => {
    console.log("New message received via Socket:", incomingMsg);
    // Use functional update to ensure we have the latest state
    setMessages((prev) => [...prev, incomingMsg]);
  };

  socket.on("new-message", handleNewMessage);

  // Cleanup correctly
  return () => {
    socket.off("new-message", handleNewMessage);
  };
}, [roomId]);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await addMessageApi(roomId, text);
      setText('');
    } catch (err) {
      alert("Send failed");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 w-full max-w-full overflow-hidden">
      {/* HEADER: Dynamic Room Name & Description */}
      <header className="flex items-center gap-4 px-4 py-3 bg-white border-b shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
          <MdArrowBack size={22} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-slate-900 truncate flex items-center gap-1 text-base md:text-lg">
            <MdTag className="text-indigo-500" /> {roomInfo?.name || "Loading..."}
          </h1>
          <p className="text-xs text-slate-500 truncate">{roomInfo?.description || "Joining the conversation..."}</p>
        </div>
        <MdInfoOutline className="text-slate-400 cursor-pointer" size={20} />
      </header>

      {/* MESSAGES AREA */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
        {messages.map((msg, index) => {
          const isMine = msg.senderId?._id === currentUserId || msg.senderId === currentUserId;
          return (
            <div key={msg._id || index} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
              {/* SENDER NAME */}
              {!isMine && (
                <span className="text-[10px] font-bold text-slate-500 ml-2 mb-1 uppercase tracking-wider">
                  {msg.senderId?.username || "Guest"}
                </span>
              )}
              
              <div className={`max-w-[85%] md:max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm ${
                isMine 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <div className={`text-[9px] mt-1 opacity-60 ${isMine ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </main>

      {/* INPUT AREA: Responsive padding */}
      <footer className="p-3 md:p-4 bg-white border-t">
        <form onSubmit={handleSend} className="max-w-5xl mx-auto flex gap-2">
          <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message..."
            className="flex-1 bg-slate-100 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
          <button type="submit" className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 active:scale-90 transition-all shadow-md">
            <MdSend size={20} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Chat;