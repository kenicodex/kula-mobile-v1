import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import type { Message } from '@/types';

const TOKEN_KEY = 'kula_token';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  'https://kula-backend-v1.onrender.com/v1';

// Strip the API path (e.g. `/v1`) — socket.io connects to the host root
// and the gateway exposes a `/chat` namespace.
const SOCKET_HOST = API_BASE_URL.replace(/\/v\d+\/?$/i, '');

export interface ChatSocketEvents {
  new_message: (message: Message) => void;
  messages_read: (payload: { conversationId: string; userId: string }) => void;
}

let socket: Socket | null = null;
let connecting: Promise<Socket> | null = null;

async function buildSocket(): Promise<Socket> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY).catch(() => null);
  const s = io(`${SOCKET_HOST}/chat`, {
    transports: ['websocket'],
    autoConnect: true,
    auth: token ? { token } : undefined,
  });
  return s;
}

/** Get (and lazily create) the singleton chat socket. */
export async function getChatSocket(): Promise<Socket> {
  if (socket && socket.connected) return socket;
  if (connecting) return connecting;
  connecting = buildSocket().then((s) => {
    socket = s;
    connecting = null;
    return s;
  });
  return connecting;
}

/** Force-disconnect on logout so a new token gets picked up next session. */
export function disconnectChatSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

interface SendOk {
  id: string;
  conversationId: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  type: string;
  createdAt: string;
}

/** Emit `send_message` with an ack timeout. Resolves to the persisted message. */
export async function sendMessageOverSocket(
  conversationId: string,
  text: string,
  mediaUrl?: string,
): Promise<Message> {
  const s = await getChatSocket();
  return new Promise<Message>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Socket send timed out'));
    }, 8000);
    s.emit(
      'send_message',
      { conversationId, text, mediaUrl },
      (ack: SendOk | undefined) => {
        clearTimeout(timeout);
        if (!ack) {
          reject(new Error('No ack from server'));
          return;
        }
        resolve(ack as unknown as Message);
      },
    );
  });
}
