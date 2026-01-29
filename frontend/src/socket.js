import { io } from "socket.io-client";

// The URL should match your server's PORT (8000)
const socketUrl = import.meta.env.SOCKET_URL;

export const socket = io(socketUrl, {
  autoConnect: true,   // Connects as soon as the app loads
  withCredentials: true
});

// Optional: Useful for debugging connection issues
socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});