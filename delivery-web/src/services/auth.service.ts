import api from './api';

export const authService = {
    login: async (credentials: { phone: string; password: string }) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    register: async (data: any) => {
        // Register user first
        // Then register as delivery partner?
        // Let's assume the /auth/register creates user and /delivery/register creates partner
        // But better is if we have a unified flow or sequential.

        // For now, simpler flow: Register User -> Login -> Register Partner Details
        const response = await api.post('/auth/register', { ...data, role: 'DELIVERY' });
        return response.data;
    },

    registerPartner: async (data: any) => {
        const response = await api.post('/delivery/register', data);
        return response.data;
    }
};
