import React, { useEffect, useState } from 'react';
import {
    ShoppingBag,
    Package,
    DollarSign,
    TrendingUp,
    Store,
    Clock,
    CheckCircle,
    AlertTriangle,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../store/authStore';
import { productService } from '../services/product.service';
import { getShopStats } from '../services/shop.service';
import { getCurrentUser } from '../services/auth.service';
import { useSocketStore } from '../store/socketStore';
import toast from 'react-hot-toast';

interface MetricCard {
    title: string;
    value: string;
    change: number;
    icon: React.ReactNode;
    color: string;
}

const Dashboard: React.FC = () => {
    const { user, updateUser } = useAuthStore();
    const shop = user?.shop;
    const [stats, setStats] = useState({
        totalProducts: 0,
        activeProducts: 0,
        outOfStock: 0,
        totalOrders: 0,
        activeOrders: 0,
        deliveredOrders: 0,
        totalRevenue: 0,
        charts: [] as any[], // Add charts array
    });

    // Refresh user data (including shop verification status) on mount
    useEffect(() => {
        const refreshUser = async () => {
            try {
                const userData = await getCurrentUser();
                updateUser(userData);
            } catch (error) {
                console.error("Failed to refresh user data", error);
            }
        };
        refreshUser();
    }, [updateUser]);

    const lastEvent = useSocketStore((state) => state.lastEvent);

    const loadStats = async () => {
        if (shop?.id) {
            try {
                const shopStats = await getShopStats(shop.id);
                const productData = await productService.getShopProducts(shop.id, { limit: 1000 });
                const products = productData.products || [];

                setStats({
                    totalProducts: products.length,
                    activeProducts: products.filter((p: any) => p.isAvailable).length,
                    outOfStock: products.filter((p: any) => (p.stockQuantity || 0) === 0).length,
                    totalOrders: shopStats.totalOrders,
                    activeOrders: shopStats.activeOrders,
                    deliveredOrders: shopStats.deliveredOrders,
                    totalRevenue: shopStats.totalRevenue,
                    charts: shopStats.charts || [],
                });
            } catch (e) {
                console.error("Failed to load dashboard stats", e);
            }
        }
    };

    useEffect(() => {
        loadStats();
    }, [shop]);

    // Handle real-time updates
    useEffect(() => {
        if (lastEvent?.type === 'new_order' || lastEvent?.type === 'order_update') {
            loadStats();
        }
    }, [lastEvent]);

    const metrics: MetricCard[] = [
        {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            change: 0, // Need historical data for change
            icon: <DollarSign className="w-6 h-6" />,
            color: 'bg-green-500',
        },
        {
            title: 'Active Products',
            value: stats.activeProducts.toString(),
            change: 0,
            icon: <Package className="w-6 h-6" />,
            color: 'bg-blue-500',
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders.toString(),
            change: 0,
            icon: <ShoppingBag className="w-6 h-6" />,
            color: 'bg-purple-500',
        },
        {
            title: "Shop Rating",
            value: shop?.rating ? shop.rating.toString() : 'N/A',
            change: 0,
            icon: <Store className="w-6 h-6" />,
            color: 'bg-amber-500',
        },
    ];

    // Use actual data from stats
    const chartData = stats.charts.length > 0 ? stats.charts : [
        { name: 'Mon', orders: 0, revenue: 0 },
        { name: 'Tue', orders: 0, revenue: 0 },
        { name: 'Wed', orders: 0, revenue: 0 },
        { name: 'Thu', orders: 0, revenue: 0 },
        { name: 'Fri', orders: 0, revenue: 0 },
        { name: 'Sat', orders: 0, revenue: 0 },
        { name: 'Sun', orders: 0, revenue: 0 },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-1">
                            Welcome back, <span className="font-semibold">{shop?.name || user?.name}</span>!
                        </p>
                    </div>

                    {/* Shop Open/Close Toggle */}
                    {shop?.isVerified && (
                        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
                            <Store className={`w-5 h-5 ${shop?.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700">Shop Status</span>
                                <span className={`text-xs ${shop?.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                                    {shop?.isActive ? 'Open for Orders' : 'Closed'}
                                </span>
                            </div>
                            <button
                                onClick={async () => {
                                    try {
                                        const { updateShop } = await import('../services/shop.service');
                                        await updateShop(shop.id, { isOpen: !shop.isActive });
                                        const userData = await getCurrentUser();
                                        updateUser(userData);
                                        toast.success(shop.isActive ? 'Shop closed' : 'Shop opened');
                                    } catch (error) {
                                        toast.error('Failed to update shop status');
                                    }
                                }}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${shop?.isActive ? 'bg-green-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${shop?.isActive ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    )}
                </div>

                {!shop?.isVerified && (
                    <div className={`mt-4 border-l-4 p-4 ${shop?.rejectionReason ? 'bg-red-50 border-red-400' : 'bg-yellow-50 border-yellow-400'}`}>
                        <div className="flex">
                            <div className="flex-shrink-0">
                                {shop?.rejectionReason ? (
                                    <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                ) : (
                                    <Clock className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                                )}
                            </div>
                            <div className="ml-3">
                                {shop?.rejectionReason ? (
                                    <div>
                                        <p className="text-sm font-medium text-red-800">
                                            Your shop verification was rejected.
                                        </p>
                                        <p className="mt-1 text-sm text-red-700">
                                            Reason: {shop.rejectionReason}
                                        </p>
                                        <p className="mt-2 text-sm text-red-700">
                                            Please correct the issues and contact support to re-apply.
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-yellow-700">
                                        Your shop is pending verification. Some features may be limited until an admin approves your account.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                    <div key={index} className="card hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                                {/* Change indicator only if relevant */}
                                {metric.change !== 0 && (
                                    <div className="flex items-center mt-2">
                                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                        <span className="text-sm font-medium text-green-600">
                                            {Math.abs(metric.change)}%
                                        </span>
                                        <span className="text-sm text-gray-500 ml-1">vs last week</span>
                                    </div>
                                )}
                            </div>
                            <div className={`${metric.color} p-3 rounded-lg text-white`}>{metric.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders This Week</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ borderRadius: '8px' }} />
                            <Line type="monotone" dataKey="orders" stroke="#4F46E5" strokeWidth={2} dot={{ fill: '#4F46E5', r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue This Week</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ borderRadius: '8px' }} />
                            <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Actions for Vendor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-4">
                        <div className="bg-red-100 p-3 rounded-lg">
                            <Package className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Out of Stock</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.outOfStock}</p>
                        </div>
                    </div>
                </div>

                <div className="card hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Active Products</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
