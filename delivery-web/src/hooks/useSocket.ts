import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useSocketStore } from '../store/socketStore';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

// Extract base URL from API_URL (remove /api/v1)
const SOCKET_URL = API_URL.replace('/api/v1', '');

export const useSocket = () => {
    const { token, isAuthenticated } = useAuthStore();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (isAuthenticated && token) {
            // Connect
            socketRef.current = io(SOCKET_URL, {
                auth: { token },
            });

            socketRef.current.on('connect', () => {
                console.log('Socket connected');
            });

            socketRef.current.on('connect_error', (err) => {
                console.error('Socket connection error:', err);
            });

            // Listen for new assignments (or generic delivery events)
            socketRef.current.on('new_delivery', (data: any) => {
                console.log('New delivery received:', data);
                // Play notification sound?
                toast.success(data.message || '🎉 New delivery assigned!', {
                    duration: 5000,
                });

                // Update global store to trigger UI refreshes
                useSocketStore.getState().setLastEvent('new_delivery', data);
            });

        } else {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [isAuthenticated, token]);

    return socketRef.current;
};
