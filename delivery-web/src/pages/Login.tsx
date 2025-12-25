import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bike } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';

export default function Login() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [formData, setFormData] = useState({ phone: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authService.login(formData);
            if (res.success) {
                // Check if role is DELIVERY or ADMIN
                if (res.data.user.role !== 'DELIVERY' && res.data.user.role !== 'ADMIN') {
                    toast.error('Access denied. Driver account required.');
                    setLoading(false);
                    return;
                }
                login(res.data.user, res.data.accessToken);
                toast.success('Welcome back, partner!');
                navigate('/');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center p-6 text-white">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-lg">
                        <Bike className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-bold">WinADeal Delivery</h1>
                    <p className="mt-2 text-indigo-200">Partner App</p>
                </div>

                <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-xl animate-slide-up">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="+91 98765 43210"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
