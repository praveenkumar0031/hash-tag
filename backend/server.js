const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/connection");
const http = require("http");
const { Server } = require("socket.io");
const authSocket = require("./socket/auth-socket");
const msgSocket = require("./socket/msg-socket");

const authrouter = require("./router/userRouter");
const roomrouter = require("./router/roomRouter");

dotenv.config();
connectDb();

const app = express();
const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});
app.set("socketio", io);
authSocket(io);
msgSocket(io);




app.use(express.json());
app.use("/api/talks", authrouter);
app.use("/api/room", roomrouter);


io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("send_message", (data) => {
    io.to(data.roomId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});


const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server + Socket.IO running on port ${PORT}`);
});
