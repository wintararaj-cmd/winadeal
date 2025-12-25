import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Wallet, Banknote, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { addressService, orderService } from '../services/order.service';
import toast from 'react-hot-toast';

interface Address {
    id: string;
    label: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}

export default function Checkout() {
    const navigate = useNavigate();
    const { items, getTotalPrice, clearCart, getShopId } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD' | 'WALLET'>('COD');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/checkout');
            return;
        }
        if (items.length === 0) {
            navigate('/cart');
            return;
        }
        fetchAddresses();
    }, [isAuthenticated, items]);

    const fetchAddresses = async () => {
        try {
            const res = await addressService.getMyAddresses();
            // Assuming API returns array directly or inside data field. 
            // address.controller.ts uses successResponse(res, addresses), so it's likely response.data (array) or response.data.data
            // The service says: return response.data;
            // successResponse wraps in { success: true, data: ... }
            // So res is { success: true, data: [...] }
            // So we need res.data

            const fetchedAddresses = Array.isArray(res) ? res : (res.data || []);
            setAddresses(fetchedAddresses);

            const defaultAddr = fetchedAddresses.find((a: Address) => a.isDefault);
            if (defaultAddr) {
                setSelectedAddress(defaultAddr.id);
            } else if (fetchedAddresses.length > 0) {
                setSelectedAddress(fetchedAddresses[0].id);
            }
        } catch (error) {
            console.error(error);
            // toast.error('Failed to load addresses'); 
            // Optional: fallback to empty or demo if needed, but better to fail securely.
        }
    };

    const deliveryFee = 30; // ideally fetch from shop or config
    const tax = getTotalPrice() * 0.05;
    const total = getTotalPrice() + deliveryFee + tax;

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error('Please select a delivery address');
            return;
        }

        const shopId = getShopId();
        if (!shopId) {
            toast.error('Invalid cart state');
            return;
        }

        try {
            setLoading(true);

            // 1. Create the Order on Backend first
            const orderRes = await orderService.createOrder({
                shopId,
                deliveryAddressId: selectedAddress,
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                })),
                paymentMethod,
                specialInstructions
            });

            const orderId = orderRes.id || orderRes.data.id; // handle wrapper

            // 2. If Payment is ONLINE, initiate Razorpay
            if (paymentMethod === 'ONLINE') {
                const paymentOrder = await orderService.createPaymentOrder(orderId);
                const { id: razorpayOrderId, key, amount, currency, name, description, prefill } = paymentOrder.data || paymentOrder;

                const options = {
                    key,
                    amount,
                    currency,
                    name,
                    description,
                    order_id: razorpayOrderId,
                    prefill,
                    handler: async function (response: any) {
                        try {
                            setLoading(true);
                            await orderService.verifyPayment({
                                ...response,
                                orderId // Send WinADeal Order ID to verify against
                            });
                            toast.success('Payment successful! Order placed.');
                            clearCart();
                            navigate('/orders');
                        } catch (err) {
                            console.error(err);
                            toast.error('Payment verification failed');
                            // Navigate to orders anyway? Or stay on Checkout?
                            // Usually go to orders, status will remain PENDING_PAYMENT or CANCELLED
                            navigate('/orders');
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setLoading(false);
                            toast('Payment cancelled');
                            navigate('/orders'); // Order is created but unpaid
                        }
                    }
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.open();
                setLoading(false); // Modal is open, loading off? Or keep on? Better keep false so UI is interactive underneath if needed, but usually blocked. 
                // Razorpay handles its own UI. 
            } else {
                // COD or Wallet
                toast.success('Order placed successfully!');
                clearCart();
                navigate('/orders');
            }

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to place order');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center text-gray-600 hover:text-sky-600 mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Cart
                </button>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <MapPin className="w-6 h-6 mr-2 text-sky-600" />
                                Delivery Address
                            </h2>

                            <div className="space-y-3">
                                {addresses.length === 0 ? (
                                    <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                        <MapPin className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-gray-500 text-sm mb-4">No saved addresses found</p>
                                        <button
                                            onClick={() => navigate('/profile')} // Navigate to profile to add address
                                            className="px-4 py-2 bg-white border border-sky-600 text-sky-600 rounded-lg text-sm hover:bg-sky-50 transition-colors"
                                        >
                                            Add New Address
                                        </button>
                                    </div>
                                ) : (
                                    addresses.map((address) => (
                                        <div
                                            key={address.id}
                                            onClick={() => setSelectedAddress(address.id)}
                                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedAddress === address.id
                                                ? 'border-sky-600 bg-sky-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="font-semibold text-gray-900">{address.label}</span>
                                                        {address.isDefault && (
                                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-600 text-sm">
                                                        {address.addressLine1}
                                                        {address.addressLine2 && `, ${address.addressLine2}`}
                                                    </p>
                                                    <p className="text-gray-600 text-sm">
                                                        {address.city}, {address.state} - {address.pincode}
                                                    </p>
                                                </div>
                                                {selectedAddress === address.id && (
                                                    <CheckCircle className="w-6 h-6 text-sky-600 flex-shrink-0" />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <CreditCard className="w-6 h-6 mr-2 text-sky-600" />
                                Payment Method
                            </h2>

                            <div className="space-y-3">
                                <div
                                    onClick={() => setPaymentMethod('COD')}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'COD'
                                        ? 'border-sky-600 bg-sky-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Banknote className="w-6 h-6 text-gray-600" />
                                            <div>
                                                <p className="font-semibold text-gray-900">Cash on Delivery</p>
                                                <p className="text-sm text-gray-600">Pay when you receive</p>
                                            </div>
                                        </div>
                                        {paymentMethod === 'COD' && (
                                            <CheckCircle className="w-6 h-6 text-sky-600" />
                                        )}
                                    </div>
                                </div>

                                <div
                                    onClick={() => setPaymentMethod('ONLINE')}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'ONLINE'
                                        ? 'border-sky-600 bg-sky-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <CreditCard className="w-6 h-6 text-gray-600" />
                                            <div>
                                                <p className="font-semibold text-gray-900">Online Payment</p>
                                                <p className="text-sm text-gray-600">UPI, Cards, Net Banking</p>
                                            </div>
                                        </div>
                                        {paymentMethod === 'ONLINE' && (
                                            <CheckCircle className="w-6 h-6 text-sky-600" />
                                        )}
                                    </div>
                                </div>

                                <div
                                    onClick={() => setPaymentMethod('WALLET')}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'WALLET'
                                        ? 'border-sky-600 bg-sky-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Wallet className="w-6 h-6 text-gray-600" />
                                            <div>
                                                <p className="font-semibold text-gray-900">Wallet</p>
                                                <p className="text-sm text-gray-600">Pay from wallet balance</p>
                                            </div>
                                        </div>
                                        {paymentMethod === 'WALLET' && (
                                            <CheckCircle className="w-6 h-6 text-sky-600" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Special Instructions */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Special Instructions</h2>
                            <textarea
                                value={specialInstructions}
                                onChange={(e) => setSpecialInstructions(e.target.value)}
                                placeholder="Any special requests? (e.g., ring the doorbell, contactless delivery)"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Items ({items.length})</span>
                                    <span>₹{getTotalPrice().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span>₹{deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (5%)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading || !selectedAddress}
                                className="w-full bg-sky-600 text-white py-3 rounded-lg font-semibold hover:bg-sky-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Placing Order...' : 'Place Order'}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                By placing this order, you agree to our terms and conditions
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
