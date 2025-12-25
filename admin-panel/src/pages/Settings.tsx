import { useState } from 'react';
import { Save, Bell, DollarSign, MapPin, Percent, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
    const [settings, setSettings] = useState({
        // General Settings
        appName: 'WinADeal',
        supportEmail: 'support@winadeal.com',
        supportPhone: '+91-9876543210',

        // Order Settings
        minOrderValue: 50,
        maxOrderValue: 5000,
        defaultDeliveryRadius: 5,
        avgPrepTime: 30,

        // Commission Settings
        foodCommission: 20,
        groceryCommission: 15,
        otherCommission: 18,

        // Delivery Settings
        baseDeliveryFee: 30,
        perKmCharge: 10,
        freeDeliveryAbove: 500,

        // Notification Settings
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        orderUpdates: true,
        promotionalEmails: false,
    });

    const handleChange = (field: string, value: any) => {
        setSettings({ ...settings, [field]: value });
    };

    const handleSave = () => {
        // API call to save settings
        toast.success('Settings saved successfully!');
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Configure platform settings and preferences</p>
            </div>

            <div className="space-y-6">
                {/* General Settings */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-indigo-600" />
                        General Settings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                App Name
                            </label>
                            <input
                                type="text"
                                value={settings.appName}
                                onChange={(e) => handleChange('appName', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Support Email
                            </label>
                            <input
                                type="email"
                                value={settings.supportEmail}
                                onChange={(e) => handleChange('supportEmail', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Support Phone
                            </label>
                            <input
                                type="tel"
                                value={settings.supportPhone}
                                onChange={(e) => handleChange('supportPhone', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Order Settings */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        Order Settings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Minimum Order Value (₹)
                            </label>
                            <input
                                type="number"
                                value={settings.minOrderValue}
                                onChange={(e) => handleChange('minOrderValue', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Maximum Order Value (₹)
                            </label>
                            <input
                                type="number"
                                value={settings.maxOrderValue}
                                onChange={(e) => handleChange('maxOrderValue', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Default Delivery Radius (km)
                            </label>
                            <input
                                type="number"
                                value={settings.defaultDeliveryRadius}
                                onChange={(e) => handleChange('defaultDeliveryRadius', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Average Prep Time (minutes)
                            </label>
                            <input
                                type="number"
                                value={settings.avgPrepTime}
                                onChange={(e) => handleChange('avgPrepTime', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Commission Settings */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Percent className="w-5 h-5 text-purple-600" />
                        Commission Rates
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Food Commission (%)
                            </label>
                            <input
                                type="number"
                                value={settings.foodCommission}
                                onChange={(e) => handleChange('foodCommission', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Grocery Commission (%)
                            </label>
                            <input
                                type="number"
                                value={settings.groceryCommission}
                                onChange={(e) => handleChange('groceryCommission', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Other Commission (%)
                            </label>
                            <input
                                type="number"
                                value={settings.otherCommission}
                                onChange={(e) => handleChange('otherCommission', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Delivery Settings */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Delivery Settings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Base Delivery Fee (₹)
                            </label>
                            <input
                                type="number"
                                value={settings.baseDeliveryFee}
                                onChange={(e) => handleChange('baseDeliveryFee', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Per KM Charge (₹)
                            </label>
                            <input
                                type="number"
                                value={settings.perKmCharge}
                                onChange={(e) => handleChange('perKmCharge', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Free Delivery Above (₹)
                            </label>
                            <input
                                type="number"
                                value={settings.freeDeliveryAbove}
                                onChange={(e) => handleChange('freeDeliveryAbove', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-orange-600" />
                        Notification Settings
                    </h2>
                    <div className="space-y-4">
                        {[
                            { key: 'emailNotifications', label: 'Email Notifications' },
                            { key: 'smsNotifications', label: 'SMS Notifications' },
                            { key: 'pushNotifications', label: 'Push Notifications' },
                            { key: 'orderUpdates', label: 'Order Status Updates' },
                            { key: 'promotionalEmails', label: 'Promotional Emails' },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">{item.label}</label>
                                <button
                                    onClick={() => handleChange(item.key, !settings[item.key as keyof typeof settings])}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[item.key as keyof typeof settings] ? 'bg-indigo-600' : 'bg-gray-200'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Save className="w-5 h-5" />
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
