import api from './api';

export interface RegisterData {
    name: string;
    email?: string;
    phone: string;
    password: string;
    role?: 'CUSTOMER' | 'VENDOR' | 'DELIVERY_PARTNER';
}

export interface LoginData {
    phone?: string;
    email?: string;
    password: string;
}

export interface VerifyOTPData {
    phone: string;
    otp: string;
}

export const authService = {
    register: async (data: RegisterData) => {
        const response = await api.post('/api/v1/auth/register', {
            ...data,
            role: data.role || 'CUSTOMER',
        });
        return response.data;
    },

    login: async (data: LoginData) => {
        const response = await api.post('/api/v1/auth/login', data);
        return response.data;
    },

    verifyOTP: async (data: VerifyOTPData) => {
        const response = await api.post('/api/v1/auth/verify-otp', data);
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/api/v1/auth/logout');
        return response.data;
    },

    refreshToken: async (refreshToken: string) => {
        const response = await api.post('/api/v1/auth/refresh', { refreshToken });
        return response.data;
    },
};
