
import { useEffect, useState } from 'react';
import { deliveryService } from '../services/delivery.service';
import { IndianRupee, TrendingUp, Calendar, Package } from 'lucide-react';

interface Delivery {
    id: string;
    deliveryFee: number;
    createdAt: string;
    order: {
        status: string;
    };
}

export default function Earnings() {
    const [stats, setStats] = useState({
        total: 0,
        today: 0,
        trips: 0,
        todayTrips: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const data: Delivery[] = await deliveryService.getMyDeliveries('history');

                const now = new Date();
                const todayStr = now.toDateString();

                let total = 0;
                let today = 0;
                let todayTrips = 0;

                data.forEach(d => {
                    // Only count delivered orders for earnings
                    if (d.order.status === 'DELIVERED') {
                        total += d.deliveryFee;

                        const date = new Date(d.createdAt);
                        if (date.toDateString() === todayStr) {
                            today += d.deliveryFee;
                            todayTrips++;
                        }
                    }
                });

                setStats({
                    total,
                    today,
                    trips: data.filter(d => d.order.status === 'DELIVERED').length,
                    todayTrips
                });

            } catch (error) {
                console.error('Failed to fetch earnings', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEarnings();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6 max-w-lg mx-auto pb-20">
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                My Earnings
            </h1>

            {/* Today's Stats */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-2 opacity-90">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Today</span>
                </div>
                <div className="flex items-end gap-1 mb-4">
                    <IndianRupee className="w-8 h-8 mb-1" />
                    <span className="text-4xl font-bold">{stats.today.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <span>Completed Trips</span>
                    <span className="font-bold text-lg">{stats.todayTrips}</span>
                </div>
            </div>

            {/* Lifetime Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Total Earnings</span>
                    </div>
                    <div className="flex items-center font-bold text-xl text-emerald-600">
                        <IndianRupee className="w-4 h-4" />
                        <span>{stats.total.toFixed(2)}</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <Package className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Total Trips</span>
                    </div>
                    <div className="font-bold text-xl text-gray-800 dark:text-gray-100">
                        {stats.trips}
                    </div>
                </div>
            </div>

            <div className="text-center text-xs text-gray-400 mt-8">
                <p>Earnings are updated immediately after delivery.</p>
                <p>Payments are settled weekly.</p>
            </div>
        </div>
    );
}
