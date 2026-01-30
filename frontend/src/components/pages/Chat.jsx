import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import { getMessagesApi, addMessageApi, getRoomByIdApi, leaveRoomApi } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { MdSend, MdArrowBack, MdTag, MdInfoOutline } from 'react-icons/md';

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

  if (authLoading || fetching) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-slate-50 w-full overflow-hidden">
      <header className="flex items-center gap-4 px-4 py-3 bg-white border-b shadow-sm">
        <button onClick={handleBack} className="p-2"><MdArrowBack size={22} /></button>
        <div className="flex-1">
          <h1 className="font-bold flex items-center gap-1"><MdTag /> {roomInfo?.name}</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* MESSAGES AREA */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scroll-smooth">
          {messages.map((msg, index) => {
            const senderId = msg.senderId?._id || msg.senderId;
            const senderName = msg.senderId?.username || "Guest";
            const isMine = senderId === currentUserId;

            return (
              <div key={msg._id || index} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                {/* Message Bubble */}
                <div className={`max-w-[85%] md:max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm ${isMine
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}>
                  <p className="text-sm leading-relaxed break-words">{msg.content}</p>

                  {/* Metadata Row: Time + Name */}
                  <div className={`text-[9px] mt-1.5 flex items-center gap-2 opacity-70 ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <span className="font-bold uppercase tracking-tighter">
                      • {isMine ? "You" : senderName}
                    </span>
                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                  </div>

                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </main>
      </main>

      <footer className="p-4 bg-white border-t">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-slate-100 rounded-xl px-4 py-2 outline-none"
          />
          <button type="submit" className="bg-indigo-600 text-white p-2 rounded-xl"><MdSend /></button>
        </form>
      </footer>
    </div>
  );
};

export default Chat;