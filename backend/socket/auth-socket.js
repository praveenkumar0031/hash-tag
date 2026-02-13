const jwt = require("jsonwebtoken");

module.exports = (io) => {
  io.use((socket, next) => {
    try {
      
      const token = socket.handshake.auth?.token || socket.handshake.headers?.token;

      if (!token) {
        console.error("Connection Refused: No token provided");
        return next(new Error("Authentication error: Token missing"));
      }

      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      socket.userId = decoded.id || decoded._id;
      socket.user = decoded; 

      
      next();
    } catch (err) {
      console.error("Connection Refused: Invalid token", err.message);
      
      return next(new Error("Authentication error: Invalid session"));
    }
  });
};