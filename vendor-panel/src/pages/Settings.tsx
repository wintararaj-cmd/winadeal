import { useState, useEffect } from 'react';
import { Save, Store, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { updateShop } from '../services/shop.service'; // Ensure this is exported from shop.service
import { getCurrentUser } from '../services/auth.service';

export default function Settings() {
    const { user } = useAuthStore();
    const shop = user?.shop;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        contactPhone: '', // Currently shop uses user phone usually, but let's see if we have shop phone
        deliveryRadius: 5,
        minOrderAmount: 0,
        openingTime: '',
        closingTime: '',
    });

    useEffect(() => {
        fetchShopDetails();
    }, []); // Only run once on mount

    const fetchShopDetails = async () => {
        try {
            // Refetch full user/shop details to get all fields
            const userData = await getCurrentUser();
            const fullShop = userData.shop;
            if (fullShop) {
                setFormData({
                    name: fullShop.name || '',
                    description: fullShop.description || '',
                    address: fullShop.address || '',
                    contactPhone: fullShop.phone || user?.phone || '',
                    deliveryRadius: fullShop.deliveryRadiusKm || 5,
                    minOrderAmount: fullShop.minOrderAmount || 0,
                    openingTime: fullShop.openingTime || '',
                    closingTime: fullShop.closingTime || '',
                });
            }
        } catch (error) {
            console.error('Failed to fetch shop details');
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSave = async () => {
        if (!shop?.id) return;
        setLoading(true);
        try {
            // Map form data to API expected format
            // Check backend updateShop: it takes partial CreateShopData
            const apiData = {
                name: formData.name,
                description: formData.description,
                address: formData.address,
                deliveryRadiusKm: formData.deliveryRadius, // Map to backend field name
                minOrderAmount: formData.minOrderAmount,
                openingTime: formData.openingTime,
                closingTime: formData.closingTime,
            };

            await updateShop(shop.id, apiData);
            toast.success('Shop settings updated successfully!');
            // Don't refresh - form already has the correct values
        } catch (error) {
            console.error("Update failed", error);
            toast.error('Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    if (!shop) {
        return <div className="p-6">Loading shop details... (or missing shop)</div>;
    }

    return (
        <div className="p-6 animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Shop Settings</h1>
                <p className="text-gray-600 mt-1">Manage your shop details, delivery preferences, and timings</p>
                {shop.isVerified ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                        Verified Shop
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                        Verification Pending
                    </span>
                )}
            </div>

            <div className="space-y-6 max-w-4xl">
                {/* Basic Info */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Store className="w-5 h-5 text-indigo-600" />
                        Basic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Shop Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Operations & Delivery */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-600" />
                        Operations & Delivery
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Opening Time
                            </label>
                            <input
                                type="time"
                                value={formData.openingTime}
                                onChange={(e) => handleChange('openingTime', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Closing Time
                            </label>
                            <input
                                type="time"
                                value={formData.closingTime}
                                onChange={(e) => handleChange('closingTime', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                Delivery Radius (km)
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.deliveryRadius}
                                onChange={(e) => handleChange('deliveryRadius', Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Min Order Amount (₹)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.minOrderAmount}
                                onChange={(e) => handleChange('minOrderAmount', Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <Save className="w-5 h-5" />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
