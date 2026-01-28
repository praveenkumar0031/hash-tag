const jwt = require("jsonwebtoken");

module.exports = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      socket.userId = decoded.id;

      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });
};
