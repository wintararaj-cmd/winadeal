
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Check, Circle, Truck, Package, Clock } from 'lucide-react';
import { orderService } from '../services/order.service';
import { useSocketStore } from '../store/socketStore';

export default function TrackOrder() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const lastEvent = useSocketStore((state) => state.lastEvent);

    useEffect(() => {
        if (id) {
            fetchOrder(id);
            const interval = setInterval(() => fetchOrder(id, true), 15000);
            return () => clearInterval(interval);
        }
    }, [id]);

    useEffect(() => {
        // Refresh on socket update
        if (lastEvent?.type === 'order_update' && lastEvent.payload?.orderId === id) {
            fetchOrder(id!, true);
        }
    }, [lastEvent, id]);

    const fetchOrder = async (orderId: string, isBackground = false) => {
        try {
            if (!isBackground) setLoading(true);
            const response = await orderService.getOrderById(orderId);
            setOrder(response.data || response);
        } catch (error) {
            console.error(error);
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading tracking info...</div>;
    if (!order) return <div className="p-10 text-center">Order not found</div>;

    const steps = [
        { status: 'PLACED', label: 'Order Placed', icon: Clock },
        { status: 'CONFIRMED', label: 'Confirmed', icon: Check },
        { status: 'PREPARING', label: 'Preparing', icon: Package },
        { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
        { status: 'DELIVERED', label: 'Delivered', icon: MapPin },
    ];

    // Map backend status to step index
    const getStepStatus = (currentStatus: string) => {
        if (currentStatus === 'PENDING') return 0;
        if (['ACCEPTED', 'CONFIRMED'].includes(currentStatus)) return 1;
        if (['READY', 'ASSIGNED', 'EN_ROUTE_TO_PICKUP', 'PICKED_UP'].includes(currentStatus)) return 2;
        if (currentStatus === 'OUT_FOR_DELIVERY') return 3;
        if (currentStatus === 'DELIVERED') return 4;
        if (['CANCELLED', 'REJECTED'].includes(currentStatus)) return -1;
        return 0;
    };

    const currentStepIndex = getStepStatus(order.status);
    const isCancelled = ['CANCELLED', 'REJECTED'].includes(order.status);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white shadow-sm p-4 sticky top-0 z-10 flex items-center gap-4">
                <button onClick={() => navigate('/orders')} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-lg font-bold">Track Order #{order.orderNumber}</h1>
            </div>

            <div className="max-w-2xl mx-auto p-4 space-y-6">

                {/* Status Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    {isCancelled ? (
                        <div className="text-center text-red-600">
                            <h2 className="text-xl font-bold">Order Cancelled</h2>
                            <p className="text-gray-500">This order has been cancelled.</p>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Vertical Stepper */}
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                            <div className="space-y-8 relative">
                                {steps.map((step, index) => {
                                    const isCompleted = index <= currentStepIndex;
                                    const isCurrent = index === currentStepIndex;
                                    const Icon = step.icon;

                                    return (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 
                                                ${isCompleted ? 'bg-sky-600 border-sky-600 text-white' : 'bg-white border-gray-300 text-gray-400'}
                                                ${isCurrent ? 'ring-4 ring-sky-100' : ''}
                                            `}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {step.label}
                                                </h3>
                                                {isCurrent && (
                                                    <p className="text-xs text-sky-600 font-medium">In Progress</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Delivery Agent Info (If Assigned) */}
                {order.delivery?.deliveryPartner?.user && (
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Delivery Partner</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-indigo-600 font-bold text-xl">
                                    {order.delivery.deliveryPartner.user.name.charAt(0)}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold">{order.delivery.deliveryPartner.user.name}</h4>
                                <p className="text-sm text-gray-500">Your delivery partner</p>
                            </div>
                            <a href={`tel:${order.delivery.deliveryPartner.user.phone}`} className="p-3 bg-green-100 rounded-full text-green-700 hover:bg-green-200">
                                <Phone className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                )}

                {/* Map Placeholder */}
                {!isCancelled && (
                    <div className="bg-gray-200 rounded-xl h-48 flex items-center justify-center text-gray-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://maps.googleapis.com/maps/api/staticmap?center=20.5937,78.9629&zoom=5&size=600x300&key=')" }}></div>
                        <div className="relative z-10 bg-white/80 p-3 rounded-lg backdrop-blur-sm">
                            <p className="font-medium flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Live tracking coming soon
                            </p>
                        </div>
                    </div>
                )}

                {/* Order Details Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Order Details</h3>
                    <div className="space-y-2">
                        {order.orderItems.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.quantity}x {item.product.name}</span>
                                <span className="font-medium">₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                        <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                            <span>Total</span>
                            <span>₹{order.total}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
