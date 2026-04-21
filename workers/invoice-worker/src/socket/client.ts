import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const url = process.env.SOCKET_URL || 'http://backend:3000';
    socket = io(url, {
      transports: ['websocket'],
      reconnection: true
    });
    console.log(`🔌 Invoice Worker connected to ${url}`);
  }
  return socket;
}

export function sendStatus(invoiceId: number, status: string, pdfUrl?: string) {
  const socket = getSocket();
  socket.emit('status-update', { invoiceId, status, pdfUrl });
}