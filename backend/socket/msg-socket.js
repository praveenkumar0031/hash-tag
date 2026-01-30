const msg = require("../model/message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    
    
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      //console.log(`User ${socket.userId} joined room: ${roomId}`);
    });

    
    socket.on("send_message", async (data) => {
      try {
        
        const { roomId, content } = data;
        const senderId = socket.userId;

        // Since your Chat.jsx already calls an API to save the message,
        // you can either use the 'data' directly or create it here.
        // If you create it here, make sure 'roomId' and 'content' are defined:
        const newMessage = {
          ...data,
          senderId: senderId, // Ensuring the senderId from authSocket is attached
          createdAt: new Date().toISOString()
        };

        // Emit to everyone in the room (including sender)
        io.to(roomId).emit("new-message", newMessage);
        
        //console.log(`Message broadcasted to room ${roomId}`);
      } catch (err) {
        console.error("Error in send_message socket:", err);
      }
    });

  });
};