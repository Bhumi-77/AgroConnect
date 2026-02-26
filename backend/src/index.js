import "dotenv/config";
import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { Server as SocketIOServer } from "socket.io";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

import paymentEsewaRoutes from "./routes/paymentEsewa.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import cropRoutes from "./routes/crop.routes.js";
import orderRoutes from "./routes/order.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import priceRoutes from "./routes/price.routes.js";

import { authSocket } from "./socket/authSocket.js";
import { errorHandler, notFound } from "./middleware/error.js";

export const prisma = new PrismaClient();

const app = express();

// ✅ CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CRITICAL: Serve uploads with NO security restrictions
const uploadsPath = path.join(__dirname, "../uploads");

app.use("/uploads", (req, res, next) => {
  // Remove ALL security headers that might block images
  res.removeHeader("Cross-Origin-Opener-Policy");
  res.removeHeader("Cross-Origin-Embedder-Policy");
  res.removeHeader("Cross-Origin-Resource-Policy");
  
  // Set permissive CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use("/uploads", express.static(uploadsPath, {
  setHeaders: (res, filepath, stat) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.removeHeader("Cross-Origin-Opener-Policy");
    res.removeHeader("Cross-Origin-Embedder-Policy");
  }
}));

// ✅ Configure helmet to NOT block cross-origin resources
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) =>
  res.json({ ok: true, service: "krishi-connect-api" })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/price", priceRoutes);

app.use("/api/payments", paymentEsewaRoutes);

app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: corsOptions,
});

io.use(authSocket);

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ roomId }) => socket.join(roomId));
  socket.on("leaveRoom", ({ roomId }) => socket.leave(roomId));

  socket.on("sendMessage", async ({ roomId, text }) => {
    try {
      const senderId = socket.user?.id;
      if (!senderId) return;

      const msg = await prisma.message.create({
        data: { roomId, senderId, text },
        include: { sender: { select: { id: true, fullName: true, role: true } } },
      });

      io.to(roomId).emit("newMessage", msg);
    } catch (e) {
      console.error("sendMessage error", e);
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`🚀 API running on http://localhost:${PORT}`)
);