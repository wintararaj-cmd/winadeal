import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, MapPin, Heart } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useFavoritesStore } from '../store/favoritesStore';

export default function Navbar() {
    const { isAuthenticated, user, clearAuth } = useAuthStore();
    const { getTotalItems } = useCartStore();
    const { favoriteShops, favoriteProducts } = useFavoritesStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const totalFavorites = favoriteShops.length + favoriteProducts.length;

    const handleLogout = () => {
        clearAuth();
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xl px-3 py-1 rounded-lg">
                            WinADeal
                        </div>
                    </Link>

                    {/* Location */}
                    <div className="hidden md:flex items-center space-x-2 text-gray-700">
                        <MapPin className="w-5 h-5 text-sky-600" />
                        <div>
                            <p className="text-xs text-gray-500">Deliver to</p>
                            <p className="text-sm font-medium">Mumbai, 400001</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search for shops, products..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-6">
                        {/* Favorites */}
                        <Link
                            to="/favorites"
                            className="relative flex items-center space-x-1 text-gray-700 hover:text-red-500 transition-colors"
                        >
                            <Heart className="w-6 h-6" />
                            {totalFavorites > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {totalFavorites}
                                </span>
                            )}
                            <span className="hidden md:inline">Favorites</span>
                        </Link>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative flex items-center space-x-1 text-gray-700 hover:text-sky-600 transition-colors"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-sky-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {getTotalItems()}
                                </span>
                            )}
                            <span className="hidden md:inline">Cart</span>
                        </Link>

                        {/* User */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-sky-600 transition-colors focus:outline-none"
                                >
                                    <User className="w-6 h-6" />
                                    <span className="hidden md:inline">{user?.name}</span>
                                </button>
                                {isDropdownOpen && (
                                    <>
                                        {/* Backdrop to close on click outside */}
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsDropdownOpen(false)}
                                        ></div>
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-100">
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-sky-600"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                My Profile
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-sky-600"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                My Orders
                                            </Link>
                                            <Link
                                                to="/favorites"
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-sky-600"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                My Favorites
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    handleLogout();
                                                }}
                                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center space-x-1 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
                            >
                                <User className="w-5 h-5" />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden px-4 pb-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                </div>
            </div>
        </nav>
    );
}
