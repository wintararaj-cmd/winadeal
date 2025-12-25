import React from 'react';
import {
    ShoppingBag,
    Store,
    Truck,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Clock,
    CheckCircle,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricCard {
    title: string;
    value: string;
    change: number;
    icon: React.ReactNode;
    color: string;
}

const Dashboard: React.FC = () => {
    const metrics: MetricCard[] = [
        {
            title: 'Total Orders',
            value: '1,250',
            change: 12.5,
            icon: <ShoppingBag className="w-6 h-6" />,
            color: 'bg-blue-500',
        },
        {
            title: 'Active Vendors',
            value: '45',
            change: 8.2,
            icon: <Store className="w-6 h-6" />,
            color: 'bg-green-500',
        },
        {
            title: 'Delivery Partners',
            value: '30',
            change: -2.4,
            icon: <Truck className="w-6 h-6" />,
            color: 'bg-purple-500',
        },
        {
            title: "Today's Revenue",
            value: '₹1,25,000',
            change: 15.3,
            icon: <DollarSign className="w-6 h-6" />,
            color: 'bg-amber-500',
        },
    ];

    const orderData = [
        { name: 'Mon', orders: 45 },
        { name: 'Tue', orders: 52 },
        { name: 'Wed', orders: 48 },
        { name: 'Thu', orders: 61 },
        { name: 'Fri', orders: 55 },
        { name: 'Sat', orders: 67 },
        { name: 'Sun', orders: 58 },
    ];

    const revenueData = [
        { name: 'Mon', revenue: 12000 },
        { name: 'Tue', revenue: 15000 },
        { name: 'Wed', revenue: 13500 },
        { name: 'Thu', revenue: 18000 },
        { name: 'Fri', revenue: 16500 },
        { name: 'Sat', revenue: 22000 },
        { name: 'Sun', revenue: 19000 },
    ];

    const recentOrders = [
        {
            id: 'ORD-001',
            customer: 'John Doe',
            vendor: 'Pizza Palace',
            amount: '₹450',
            status: 'delivered',
            time: '10 mins ago',
        },
        {
            id: 'ORD-002',
            customer: 'Jane Smith',
            vendor: 'Burger King',
            amount: '₹320',
            status: 'preparing',
            time: '25 mins ago',
        },
        {
            id: 'ORD-003',
            customer: 'Mike Johnson',
            vendor: 'Fresh Mart',
            amount: '₹890',
            status: 'out_for_delivery',
            time: '35 mins ago',
        },
        {
            id: 'ORD-004',
            customer: 'Sarah Williams',
            vendor: 'Sushi Bar',
            amount: '₹1,200',
            status: 'delivered',
            time: '1 hour ago',
        },
    ];

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { class: string; text: string }> = {
            delivered: { class: 'badge-success', text: 'Delivered' },
            preparing: { class: 'badge-warning', text: 'Preparing' },
            out_for_delivery: { class: 'badge-info', text: 'Out for Delivery' },
            cancelled: { class: 'badge-danger', text: 'Cancelled' },
        };
        const badge = badges[status] || badges.preparing;
        return <span className={`badge ${badge.class}`}>{badge.text}</span>;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                    <div key={index} className="card hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                                <div className="flex items-center mt-2">
                                    {metric.change >= 0 ? (
                                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                                    )}
                                    <span
                                        className={`text-sm font-medium ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}
                                    >
                                        {Math.abs(metric.change)}%
                                    </span>
                                    <span className="text-sm text-gray-500 ml-1">vs last week</span>
                                </div>
                            </div>
                            <div className={`${metric.color} p-3 rounded-lg text-white`}>{metric.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Orders Chart */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders This Week</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={orderData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="orders"
                                stroke="#4F46E5"
                                strokeWidth={2}
                                dot={{ fill: '#4F46E5', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Chart */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue This Week</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                }}
                            />
                            <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        View All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                    Order ID
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                    Customer
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                    Vendor
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                    Amount
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                    Status
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{order.id}</td>
                                    <td className="py-4 px-4 text-sm text-gray-700">{order.customer}</td>
                                    <td className="py-4 px-4 text-sm text-gray-700">{order.vendor}</td>
                                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{order.amount}</td>
                                    <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
                                    <td className="py-4 px-4 text-sm text-gray-500 flex items-center">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {order.time}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-4">
                        <div className="bg-primary-100 p-3 rounded-lg">
                            <Store className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Pending Verifications</p>
                            <p className="text-2xl font-bold text-gray-900">5</p>
                        </div>
                    </div>
                </div>

                <div className="card hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-4">
                        <div className="bg-amber-100 p-3 rounded-lg">
                            <ShoppingBag className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Active Orders</p>
                            <p className="text-2xl font-bold text-gray-900">23</p>
                        </div>
                    </div>
                </div>

                <div className="card hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Completed Today</p>
                            <p className="text-2xl font-bold text-gray-900">87</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
