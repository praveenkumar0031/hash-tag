const jwt = require("jsonwebtoken");

module.exports = (io) => {
  io.use((socket, next) => {
    try {
      // 1. Check token in auth object (standard) or headers (fallback)
      const token = socket.handshake.auth?.token || socket.handshake.headers?.token;

      if (!token) {
        console.error("Connection Refused: No token provided");
        return next(new Error("Authentication error: Token missing"));
      }

      // 2. Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Attach relevant data to the socket object
      // Use socket.user or socket.userId so it's accessible in msgSocket.js
      socket.userId = decoded.id || decoded._id;
      socket.user = decoded; 

      //console.log(`Socket Authenticated: User ${socket.userId}`);
      next();
    } catch (err) {
      console.error("Connection Refused: Invalid token", err.message);
      // Sending a specific error message helps the frontend show the right alert
      return next(new Error("Authentication error: Invalid session"));
    }
  });
};