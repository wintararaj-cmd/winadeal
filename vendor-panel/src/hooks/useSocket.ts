
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useSocketStore } from '../store/socketStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const SOCKET_URL = API_URL.replace('/api/v1', '');

export const useSocket = () => {
    const { accessToken, isAuthenticated } = useAuthStore();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (isAuthenticated && accessToken) {
            // Connect
            socketRef.current = io(SOCKET_URL, {
                auth: { token: accessToken },
            });

            socketRef.current.on('connect', () => {
                console.log('Vendor Socket connected');
            });

            socketRef.current.on('connect_error', (err) => {
                console.error('Vendor Socket connection error:', err);
            });

            // Listen for new orders
            socketRef.current.on('new_order', (data: any) => {
                console.log('New order received:', data);
                toast.success(`🔔 ${data.message || 'New order received!'}`, {
                    duration: 6000,
                    position: 'top-right',
                });

                // Update global store
                useSocketStore.getState().setLastEvent('new_order', data);
            });

            // Listen for order updates (status changes etc)
            socketRef.current.on('order_update', (data: any) => {
                console.log('Order update received:', data);
                // toast(`Order #${data.orderId} status: ${data.status}`);
                useSocketStore.getState().setLastEvent('order_update', data);
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
    }, [isAuthenticated, accessToken]);

    return socketRef.current;
};
