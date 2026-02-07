import jwt from 'jsonwebtoken';

export function authSocket(socket, next) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(); // allow anonymous connections
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch {
    next();
  }
}
