import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/order.service';
import type { Order as ApiOrder } from '../services/order.service';
import { useSocketStore } from '../store/socketStore';

interface Order extends Omit<ApiOrder, 'status' | 'deliveryAddress' | 'items'> {
    status: string;
    deliveryAddress: string;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
}

export default function Orders() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'completed'>('all');
    const [loading, setLoading] = useState(true);

    const lastEvent = useSocketStore((state) => state.lastEvent);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/orders');
            return;
        }
        fetchOrders();
    }, [isAuthenticated]);

    // Listen for socket updates
    useEffect(() => {
        if (lastEvent?.type === 'order_update') {
            fetchOrders();
        }
    }, [lastEvent]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await orderService.getMyOrders();
            const fetchedOrders = (res.orders || []).map((order: any) => ({
                ...order,
                items: order.orderItems.map((item: any) => ({
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                shop: {
                    name: order.shop.name
                },
                // Flatten address to string if needed or keep object. 
                // The UI below uses {order.deliveryAddress}. If it's an object it will crash.
                // Let's format it.
                deliveryAddress: order.deliveryAddress ?
                    `${order.deliveryAddress.addressLine1}, ${order.deliveryAddress.city}` : 'N/A'
            }));

            setOrders(fetchedOrders);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PLACED':
            case 'PENDING':
                return <Clock className="w-5 h-5 text-yellow-600" />;
            case 'ACCEPTED':
            case 'CONFIRMED':
                return <CheckCircle className="w-5 h-5 text-blue-600" />;
            case 'READY':
            case 'PREPARING':
                return <Package className="w-5 h-5 text-purple-600" />;
            case 'ASSIGNED':
            case 'PICKED_UP':
            case 'OUT_FOR_DELIVERY':
                return <Truck className="w-5 h-5 text-indigo-600" />;
            case 'DELIVERED':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'CANCELLED':
            case 'REJECTED':
                return <XCircle className="w-5 h-5 text-red-600" />;
            default:
                return <Clock className="w-5 h-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PLACED':
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'ACCEPTED':
            case 'CONFIRMED':
                return 'bg-blue-100 text-blue-800';
            case 'READY':
            case 'PREPARING':
                return 'bg-purple-100 text-purple-800';
            case 'ASSIGNED':
            case 'PICKED_UP':
            case 'OUT_FOR_DELIVERY':
                return 'bg-indigo-100 text-indigo-800';
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const filteredOrders = orders.filter(order => {
        if (selectedTab === 'active') {
            return ['PLACED', 'PENDING', 'ACCEPTED', 'CONFIRMED', 'READY', 'PREPARING', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(order.status);
        }
        if (selectedTab === 'completed') {
            return ['DELIVERED', 'CANCELLED', 'REJECTED'].includes(order.status);
        }
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                {/* Tabs */}
                <div className="flex space-x-2 mb-6">
                    {['all', 'active', 'completed'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setSelectedTab(tab as any)}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${selectedTab === tab
                                ? 'bg-sky-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                        <button
                            onClick={() => navigate('/shops')}
                            className="bg-sky-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-700 transition-colors"
                        >
                            Browse Shops
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="font-bold text-gray-900">{order.orderNumber}</h3>
                                                <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    <span>{order.status.replace('_', ' ')}</span>
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                                        </div>
                                        <div className="mt-3 md:mt-0 text-right">
                                            <p className="text-sm text-gray-600">Total Amount</p>
                                            <p className="text-2xl font-bold text-gray-900">₹{order.total}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Body */}
                                <div className="px-6 py-4">
                                    <div className="flex items-start space-x-4 mb-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-3xl">🍕</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 mb-2">{order.shop.name}</h4>
                                            <div className="space-y-1">
                                                {order.items.map((item, idx) => (
                                                    <p key={idx} className="text-sm text-gray-600">
                                                        {item.name} x {item.quantity}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span>{order.deliveryAddress}</span>
                                    </div>
                                </div>

                                {/* Order Footer */}
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                                    <button
                                        onClick={() => navigate(`/shops/${order.shop.name.toLowerCase().replace(' ', '-')}`)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-colors"
                                    >
                                        Reorder
                                    </button>
                                    {order.status === 'OUT_FOR_DELIVERY' && (
                                        <button className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                                            Track Order
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
