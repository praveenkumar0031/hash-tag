const msg = require("../model/message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    
    
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      
    });

    
    socket.on("send_message", async (data) => {
      try {
        
        const { roomId, content } = data;
        const senderId = socket.userId;

        
        const newMessage = {
          ...data,
          senderId: senderId, 
          createdAt: new Date().toISOString()
        };

        
        io.to(roomId).emit("new-message", newMessage);
        
        
      } catch (err) {
        console.error("Error in send_message socket:", err);
      }
    });

  });
};