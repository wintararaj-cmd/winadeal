
import { create } from 'zustand';

interface SocketState {
    lastEvent: { type: string; data: any } | null;
    setLastEvent: (type: string, data: any) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
    lastEvent: null,
    setLastEvent: (type, data) => set({ lastEvent: { type, data } }),
}));
