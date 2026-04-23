// client/src/services/socket.ts
const io = require("socket.io-client");

let socket: any = null;

export function connectSocket() {
  if (!socket) {
    const socketUrl = process.env.REACT_APP_API_URL || "http://localhost:3001";
    socket = io(socketUrl, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected");
    });

    socket.on("connect_error", (error: any) => {
      console.error("❌ Socket error:", error);
    });
  }
  return socket;
}
