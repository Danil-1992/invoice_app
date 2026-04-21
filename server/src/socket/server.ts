// server/src/socket/server.ts
import { Server as SocketServer } from "socket.io";
import http from "http"; // 👈 ДОБАВИТЬ
import cookie from "cookie";
import jwt from "jsonwebtoken";

let io: SocketServer | null = null; // 👈 ДОБАВИТЬ

export function createSocketServer(server: http.Server) {
  io = new SocketServer(server, {
    cors: {
      origin: "http://localhost:3002",
      credentials: true,
    },
  });

  // Аутентификация через refreshToken в cookie
  io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("No cookies"));
    }

    const cookies = cookie.parse(cookieHeader);
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      return next(new Error("No refresh token"));
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as any;
      socket.data.userId = decoded.id;
      console.log(
        `✅ User ${socket.data.userId} authenticated via refreshToken`
      );
      next();
    } catch (err) {
      next(new Error("Invalid refresh token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    console.log(`🔌 User ${userId} connected`);

    socket.join(`user:${userId}`);

    socket.on("join-invoice", (invoiceId: number) => {
      socket.join(`invoice:${invoiceId}`);
      console.log(`📌 User ${userId} joined invoice ${invoiceId}`);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 User ${userId} disconnected`);
    });
  });

  return io;
}

// 👇 ДОБАВИТЬ для использования в других файлах
export function getIo() {
  return io;
}

// 👇 ДОБАВИТЬ удобные функции
export function notifyUser(userId: number, event: string, data: any) {
  io?.to(`user:${userId}`).emit(event, data);
}

export function notifyInvoice(event: string, data: any) {
  io?.to(`user:${data.userId}`).emit(event, data);
}
