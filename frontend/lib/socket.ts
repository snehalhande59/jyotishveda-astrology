'use client';

import { io, Socket } from 'socket.io-client';
import { getStrapiUrl } from './api';
import { getAuthToken } from './auth';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (typeof window === 'undefined') {
    throw new Error('Socket.IO can only be initialized on the client side.');
  }

  if (!socket || !socket.connected) {
    const strapiUrl = getStrapiUrl();
    const token = getAuthToken();

    socket = io(strapiUrl, {
      path: '/socket.io',
      auth: {
        token: token || undefined,
      },
      extraHeaders: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('⚡ [Socket.IO] Connected to JyotishVeda real-time server:', socket?.id);
    });

    socket.on('connect_error', (err) => {
      console.warn('⚠️ [Socket.IO] Connection notice:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 [Socket.IO] Disconnected:', reason);
    });
  }

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
