const msg = require("../model/message");
module.exports = (io) => {
  io.on("connection", (socket) => {

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
    });

    socket.on("send-message", async (data) => {
       const senderId = socket.userId;

      const message = await msg.create({
        roomId,
        senderId,
        content
      });

      io.to(roomId).emit("new-message", message);
    });

  });
};
