import { io } from "socket.io-client";

// The URL should match your server's PORT (8000)
const socketUrl = import.meta.env.VITE_SOCKET_URL;
// socket.js (Frontend)
export const socket = io(socketUrl, {
  autoConnect: true,
  auth: {
    token: localStorage.getItem("token") // or however you store your JWT
  },
  withCredentials: true
});


// Optional: Useful for debugging connection issues
socket.on("connect", () => {
  //console.log("Connected:", socket.id);
});

socket.on("disconnect", () => {
  //console.log("Disconnected from server");
});