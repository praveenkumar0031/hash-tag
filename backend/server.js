const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/connection");
const http = require("http");
const { Server } = require("socket.io");
const authSocket = require("./socket/auth-socket");
const msgSocket = require("./socket/msg-socket");
const cors = require("cors");
const authrouter = require("./router/userRouter");
const roomrouter = require("./router/roomRouter");
const msgrouter=require('./router/msgRouter')
dotenv.config();
connectDb();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true
  }
});
app.set("socketio", io);
authSocket(io);
msgSocket(io);

app.use("/api/hashtag", authrouter);
app.use("/api/hashtag/room", roomrouter);
app.use("/api/hashtag/msg", msgrouter);

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
