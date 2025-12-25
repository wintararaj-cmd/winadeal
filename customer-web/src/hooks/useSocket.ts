import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useSocketStore } from '../store/socketStore';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

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

            // Listen for global order updates
            socketRef.current.on('order_update', (data: any) => {
                console.log('Order update received:', data);
                // Show notification
                toast(data.message || `Order status updated to ${data.status}`, {
                    icon: '🔔',
                    duration: 5000,
                });
                // Update store
                useSocketStore.getState().setLastEvent('order_update', data);
            });

        } else {
            // Disconnect if logged out
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
