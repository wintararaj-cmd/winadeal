
import api from './api';

export const orderService = {
    getOrders: async (params?: any) => {
        const response = await api.get('/api/v1/orders', { params });
        return response.data.data;
    },

    getOrderById: async (id: string) => {
        const response = await api.get(`/api/v1/orders/${id}`);
        return response.data.data;
    },

    updateStatus: async (id: string, status: string) => {
        const response = await api.patch(`/api/v1/orders/${id}/status`, { status });
        return response.data.data;
    },
};
