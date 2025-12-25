import { useState, useEffect } from 'react';
import { Navigation, Package, Phone, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { deliveryService } from '../services/delivery.service';
import { useAuthStore } from '../store/authStore';
import { useSocketStore } from '../store/socketStore';

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);
    const [isOnline, setIsOnline] = useState(false); // Default offline? Fetch from API
    const [activeOrders, setActiveOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const lastEvent = useSocketStore((state) => state.lastEvent);

    useEffect(() => {
        fetchOrders();
    }, []);

    // Listen for socket events to refresh list
    useEffect(() => {
        if (lastEvent?.type === 'new_delivery') {
            fetchOrders();
        }
    }, [lastEvent]);

    const fetchOrders = async () => {
        try {
            const data = await deliveryService.getMyDeliveries('active');
            setActiveOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async () => {
        try {
            const newState = !isOnline;
            await deliveryService.toggleOnline(newState);
            setIsOnline(newState);
            toast.success(newState ? 'You are now Online' : 'You are now Offline');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleUpdateOrder = async (orderId: string, status: string) => {
        try {
            await deliveryService.updateStatus(orderId, status);
            toast.success(`Order marked as ${status}`);
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update order');
        }
    };

    if (loading) return <div className="p-4 text-center">Loading dashboard...</div>;

    return (
        <div className="pb-24">
            {/* Header */}
            <div className="bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Hi, {user?.name}</h2>
                    <p className="text-xs text-gray-500">Let's deliver some happiness!</p>
                </div>
                <button
                    onClick={toggleStatus}
                    className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm transition-colors ${isOnline
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                >
                    {isOnline ? '🟢 Online' : '⚪ Offline'}
                </button>
            </div>

            <div className="p-4 space-y-6">
                {/* Active Orders List */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Active Orders ({activeOrders.length})
                    </h3>

                    {activeOrders.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-xl border border-gray-100 border-dashed">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">No active orders assigned.</p>
                            <p className="text-xs text-gray-400 mt-1">Wait for vendors to assign orders to you.</p>
                        </div>
                    ) : (
                        activeOrders.map((delivery) => (
                            <div key={delivery.id} className="card shadow-md border-indigo-50 mb-4">
                                <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-2">
                                    <div>
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                            #{delivery.order.orderNumber}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(delivery.createdAt).toLocaleTimeString()} </p>
                                    </div>
                                    <span className="badge badge-warning text-sm font-semibold text-amber-600">
                                        {delivery.order.status.replace(/_/g, ' ')}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {/* Pickup */}
                                    <div className="flex gap-3">
                                        <div className="mt-1">
                                            <div className="w-2 h-2 bg-gray-300 rounded-full mb-1"></div>
                                            <div className="w-0.5 h-full bg-gray-200 mx-auto"></div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 uppercase">Pickup</p>
                                            <h4 className="font-semibold text-gray-900">{delivery.order.shop.name}</h4>
                                            <p className="text-sm text-gray-600 line-clamp-2">{delivery.order.shop.address}</p>
                                        </div>
                                        <a href={`tel:${delivery.order.shop.phone}`} className="p-2 bg-gray-100 rounded-full self-center">
                                            <Phone className="w-5 h-5 text-gray-600" />
                                        </a>
                                    </div>

                                    {/* Drop */}
                                    <div className="flex gap-3">
                                        <div className="mt-1">
                                            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 uppercase">Drop</p>
                                            <h4 className="font-semibold text-gray-900">{delivery.order.customer.name}</h4>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {delivery.order.deliveryAddress.addressLine1}, {delivery.order.deliveryAddress.city}
                                            </p>
                                        </div>
                                        <a href={`tel:${delivery.order.customer.phone}`} className="p-2 bg-gray-100 rounded-full self-center">
                                            <Phone className="w-5 h-5 text-gray-600" />
                                        </a>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <h5 className="text-sm font-medium mb-2">Order Items:</h5>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {delivery.order.orderItems.map((item: any, i: number) => (
                                            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                                                {item.quantity}x {item.product.name}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Action Buttons based on Status */}
                                    {delivery.order.status === 'ASSIGNED' && (
                                        <button
                                            onClick={() => handleUpdateOrder(delivery.order.id, 'EN_ROUTE_TO_PICKUP')}
                                            className="btn-primary flex items-center justify-center gap-2"
                                        >
                                            <Navigation className="w-5 h-5" /> Start Pickup
                                        </button>
                                    )}
                                    {delivery.order.status === 'EN_ROUTE_TO_PICKUP' && (
                                        <button
                                            onClick={() => handleUpdateOrder(delivery.order.id, 'PICKED_UP')}
                                            className="btn-primary bg-amber-600 hover:bg-amber-700 flex items-center justify-center gap-2"
                                        >
                                            <Package className="w-5 h-5" /> Confirm Pickup
                                        </button>
                                    )}
                                    {delivery.order.status === 'PICKED_UP' && (
                                        <button
                                            onClick={() => handleUpdateOrder(delivery.order.id, 'OUT_FOR_DELIVERY')}
                                            className="btn-primary bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                                        >
                                            <Navigation className="w-5 h-5" /> Out for Delivery
                                        </button>
                                    )}
                                    {delivery.order.status === 'OUT_FOR_DELIVERY' && (
                                        <button
                                            onClick={() => handleUpdateOrder(delivery.order.id, 'DELIVERED')}
                                            className="btn-primary bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-5 h-5" /> Mark Delivered
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
