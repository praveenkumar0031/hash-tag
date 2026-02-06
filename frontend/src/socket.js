import { io } from "socket.io-client";


const socketUrl = import.meta.env.VITE_SOCKET_URL;

export const socket = io(socketUrl, {
  autoConnect: true,
  auth: {
    token: localStorage.getItem("token") 
  },
  withCredentials: true
});



socket.on("connect", () => {
  //console.log("Connected:", socket.id);
});

socket.on("disconnect", () => {
  //console.log("Disconnected from server");
});