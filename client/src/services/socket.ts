// client/src/services/socket.ts
const io = require("socket.io-client");

let socket: any = null;

export function connectSocket() {
  if (!socket) {
    socket = io("http://localhost:3001", {
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
