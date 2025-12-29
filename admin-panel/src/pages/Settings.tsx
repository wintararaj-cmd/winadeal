import { useState } from 'react';
import { Save, Settings as SettingsIcon, DollarSign, Truck, ShoppingBag, Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface PlatformSettings {
    commissionRate: number;
    deliveryFee: number;
    minOrderValue: number;
    maxDeliveryRadius: number;
    taxRate: number;
    supportEmail: string;
    supportPhone: string;
    platformName: string;
    currency: string;
}

export default function Settings() {
    const [settings, setSettings] = useState<PlatformSettings>({
        commissionRate: 10,
        deliveryFee: 30,
        minOrderValue: 100,
        maxDeliveryRadius: 10,
        taxRate: 5,
        supportEmail: 'support@winadeal.com',
        supportPhone: '+91 1234567890',
        platformName: 'WinADeal',
        currency: 'INR',
    });

    const [saving, setSaving] = useState(false);

    const handleChange = (field: keyof PlatformSettings, value: string | number) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            // TODO: Call API to save settings
            // await settingsService.updatePlatformSettings(settings);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('Settings saved successfully!');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <SettingsIcon className="w-8 h-8 text-primary-600" />
                    Platform Settings
                </h1>
                <p className="text-gray-600 mt-1">Manage your platform configuration and preferences</p>
            </div>

            {/* General Settings */}
            <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5 text-gray-600" />
                    General Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Platform Name
                        </label>
                        <input
                            type="text"
                            value={settings.platformName}
                            onChange={(e) => handleChange('platformName', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Currency
                        </label>
                        <select
                            value={settings.currency}
                            onChange={(e) => handleChange('currency', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Commission & Fees */}
            <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Commission & Fees
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Default Commission Rate (%)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={settings.commissionRate}
                                onChange={(e) => handleChange('commissionRate', parseFloat(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Platform commission on each order
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tax Rate (%)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={settings.taxRate}
                                onChange={(e) => handleChange('taxRate', parseFloat(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            GST/Tax rate applied to orders
                        </p>
                    </div>
                </div>
            </div>

            {/* Order & Delivery Settings */}
            <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                    Order & Delivery Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Order Value (₹)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={settings.minOrderValue}
                            onChange={(e) => handleChange('minOrderValue', parseFloat(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Minimum amount required to place an order
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Base Delivery Fee (₹)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={settings.deliveryFee}
                            onChange={(e) => handleChange('deliveryFee', parseFloat(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Standard delivery charge
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Delivery Radius (km)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={settings.maxDeliveryRadius}
                                onChange={(e) => handleChange('maxDeliveryRadius', parseFloat(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">km</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Maximum distance for delivery
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-purple-600" />
                    Support Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Support Email
                        </label>
                        <input
                            type="email"
                            value={settings.supportEmail}
                            onChange={(e) => handleChange('supportEmail', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Support Phone
                        </label>
                        <input
                            type="tel"
                            value={settings.supportPhone}
                            onChange={(e) => handleChange('supportPhone', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                    Reset
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                    <Save className="w-5 h-5" />
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </div>
    );
}
