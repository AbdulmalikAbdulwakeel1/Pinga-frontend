import { io, type Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:3001";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
}

export function connectSocket(businessId: string) {
  const s = getSocket();
  if (!s.connected) s.connect();
  s.emit("join:business", businessId);
  return s;
}

export function joinConversation(conversationId: string) {
  getSocket().emit("join:conversation", conversationId);
}

export function disconnectSocket() {
  if (socket?.connected) socket.disconnect();
}
