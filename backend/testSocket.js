const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit("join_room", "room1");

  socket.emit("send_message", {
    roomId: "room1",
    senderId: "test",
    content: "Hello from node 👋"
  });
});

socket.on("receive_message", (msg) => {
  console.log("Received:", msg);
});
