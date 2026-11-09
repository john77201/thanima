import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Bell,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Logo } from './Logo';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

interface HeaderProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onOpenCart,
  onOpenAuth,
}) => {
  const {
    categories,
    products,
    cartCount,
    wishlist,
    currentUser,
    logout,
    notifications,
    markNotificationRead,
    unreadNotificationCount,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const catMenuRef = useRef<HTMLDivElement>(null);

  // Filter live search suggestions
  const searchSuggestions = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.malayalamName.includes(searchQuery) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (catMenuRef.current && !catMenuRef.current.contains(e.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop', `search:${searchQuery.trim()}`);
      setIsSearchFocused(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b border-[#EFE8D8] shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-[#1F4D2B] text-[#FFF8E7] text-[11px] md:text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="hidden sm:inline-block bg-[#F2A900] text-[#1F4D2B] font-bold text-[9px] uppercase px-1.5 py-0.2 rounded-xs">
              Special
            </span>
            <span className="truncate">
              Free delivery on orders above ₹499 · COD Available · 100% Homemade Taste
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-[11px] font-normal">
            <button
              onClick={() => onNavigate('track-order')}
              className="hover:text-[#F2A900] transition-colors cursor-pointer"
            >
              Track Order
            </button>
            <span className="hidden md:inline text-white/40">|</span>
            <button
              onClick={() => onNavigate('deployment')}
              className="hidden md:inline-flex items-center gap-1 text-[#F2A900] hover:underline cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Stack & Deployment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kerala Kasavu Gold Accent Strip */}
      <div className="kasavu-border" />

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#4A2C17] hover:bg-[#F4F1EA] rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="text-left cursor-pointer focus-visible:outline-hidden"
          >
            <Logo variant="full" size="md" />
          </button>

          {/* Desktop Search Bar with Live Suggestions */}
          <div ref={searchRef} className="hidden md:block flex-1 max-w-lg relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search homemade snacks, pickles, flours, spices... (e.g. ഉപ്പേരി)"
                  className="w-full bg-[#F5F2EA] text-[#4A2C17] text-xs placeholder-[#8C7A6B] pl-10 pr-10 py-2.5 rounded-full border border-[#E2DCce] focus:outline-none focus:bg-white focus:border-[#1F4D2B] focus:ring-1 focus:ring-[#1F4D2B] transition-all"
                />
                <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-3" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-[#8C7A6B] hover:text-[#4A2C17]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* Live Autocomplete Dropdown */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#EFE8D8] overflow-hidden z-50 animate-in fade-in-50">
                <div className="p-2 border-b border-gray-100 bg-[#FFFDF7] flex items-center justify-between text-[11px] text-[#8C7A6B]">
                  <span>Suggestions for "{searchQuery}"</span>
                  <button
                    onClick={() => {
                      onNavigate('shop', `search:${searchQuery}`);
                      setIsSearchFocused(false);
                    }}
                    className="text-[#1F4D2B] font-semibold hover:underline"
                  >
                    View all results
                  </button>
                </div>
                {searchSuggestions.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {searchSuggestions.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          onNavigate('product', product.id);
                          setIsSearchFocused(false);
                        }}
                        className="w-full p-2.5 flex items-center gap-3 hover:bg-[#F9F7F1] text-left transition-colors"
                      >
                        <div className="w-9 h-9 rounded-md bg-[#FFF3D6] flex items-center justify-center text-lg shrink-0">
                          {product.categoryIds[0] === 'snacks'
                            ? '🍌'
                            : product.categoryIds[0] === 'pickles'
                            ? '🏺'
                            : product.categoryIds[0] === 'sweets'
                            ? '🍯'
                            : '🌿'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#4A2C17] truncate">
                            {product.name}
                          </p>
                          <p className="text-[10px] font-malayalam text-[#1F4D2B]">
                            {product.malayalamName}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#B5502C] tabular-nums">
                          ₹{product.variants[0]?.price}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-[#8C7A6B]">
                    No homemade food matching "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons: Notifications, Wishlist, Cart, User */}
          <div className="flex items-center gap-1.5 md:gap-3">
            {/* Notification Bell */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 text-[#4A2C17] hover:text-[#1F4D2B] hover:bg-[#F4F1EA] rounded-full transition-colors relative cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#B5502C] text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#EFE8D8] z-50 p-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-[#4A2C17]">Notifications</span>
                    <span className="text-[10px] text-gray-400">Order Updates</span>
                  </div>
                  <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.link) onNavigate('my-orders');
                          }}
                          className={`p-2.5 text-left text-xs rounded-lg transition-colors cursor-pointer ${
                            n.read ? 'opacity-70' : 'bg-[#FFFDF7]'
                          } hover:bg-[#F4F1EA]`}
                        >
                          <p className="font-semibold text-[#1F4D2B]">{n.title}</p>
                          <p className="text-[11px] text-[#4A2C17]/80 mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-gray-400 mt-1 block">{n.timestamp}</span>
                        </div>
                      ))
                    ) : (
                      <p className="py-4 text-center text-xs text-gray-500">No new notifications</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="p-2 text-[#4A2C17] hover:text-[#1F4D2B] hover:bg-[#F4F1EA] rounded-full transition-colors relative cursor-pointer"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#1F4D2B] text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag / Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-[#1F4D2B] hover:bg-[#14381F] text-white px-3.5 py-2 rounded-full transition-all shadow-xs cursor-pointer group"
              aria-label="Open Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#F2A900] group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#B5502C] text-white text-[9px] font-bold px-1 rounded-full border border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
            </button>

            {/* Account / User Menu Dropdown */}
            <div ref={userMenuRef} className="relative">
              {currentUser ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-1.5 pl-2 text-xs font-semibold text-[#4A2C17] hover:bg-[#F4F1EA] rounded-full transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#F2A900]/20 text-[#1F4D2B] font-bold flex items-center justify-center border border-[#F2A900]/40 text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline truncate max-w-[80px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8C7A6B]" />
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1F4D2B] border border-[#1F4D2B]/30 hover:bg-[#1F4D2B] hover:text-white rounded-full transition-all cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {isUserMenuOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#EFE8D8] py-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-gray-100 bg-[#FFFDF7]">
                    <p className="font-bold text-[#4A2C17]">{currentUser.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                    {currentUser.role === 'super_admin' && (
                      <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded-xs">
                        Administrator
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      onNavigate('my-account');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#F4F1EA] text-[#4A2C17] flex items-center justify-between"
                  >
                    <span>My Profile & Addresses</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('my-orders');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#F4F1EA] text-[#4A2C17] flex items-center justify-between"
                  >
                    <span>My Orders & Tracking</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('wishlist');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#F4F1EA] text-[#4A2C17]"
                  >
                    <span>My Wishlist ({wishlist.length})</span>
                  </button>

                  {/* Admin Portal Shortcut */}
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#1F4D2B]/10 text-[#1F4D2B] font-semibold flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F2A900]" />
                    <span>Admin Dashboard</span>
                  </button>

                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-red-50 text-red-600 font-medium"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Navigation Bar: Categories & Quick Links */}
        <nav className="hidden md:flex items-center justify-between pt-2.5 mt-2 border-t border-[#EFE8D8]/70 text-xs font-semibold text-[#4A2C17]">
          {/* Mega-Menu Trigger */}
          <div ref={catMenuRef} className="relative">
            <button
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="flex items-center gap-1.5 py-1 px-2.5 rounded-md hover:bg-[#F4F1EA] text-[#1F4D2B] cursor-pointer"
            >
              <Menu className="w-3.5 h-3.5" />
              <span>All 8 Categories</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Mega Menu Dropdown */}
            {isCategoryMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-[#EFE8D8] p-4 grid grid-cols-2 gap-2 z-50">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onNavigate('category', c.id);
                      setIsCategoryMenuOpen(false);
                    }}
                    className="p-2.5 text-left rounded-xl hover:bg-[#FFF8E7] transition-colors border border-transparent hover:border-[#F2A900]/30 group"
                  >
                    <p className="font-semibold text-xs text-[#4A2C17] group-hover:text-[#1F4D2B]">
                      {c.name}
                    </p>
                    <p className="font-malayalam text-[10px] text-[#1F4D2B] opacity-80">
                      {c.malayalamName}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Category Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('shop')}
              className="hover:text-[#1F4D2B] transition-colors cursor-pointer"
            >
              All Products
            </button>
            <button
              onClick={() => onNavigate('category', 'snacks')}
              className="hover:text-[#1F4D2B] transition-colors cursor-pointer"
            >
              Traditional Snacks
            </button>
            <button
              onClick={() => onNavigate('category', 'pickles')}
              className="hover:text-[#1F4D2B] transition-colors cursor-pointer"
            >
              Homemade Pickles
            </button>
            <button
              onClick={() => onNavigate('category', 'spices')}
              className="hover:text-[#1F4D2B] transition-colors cursor-pointer"
            >
              Spice Powders
            </button>
            <button
              onClick={() => onNavigate('category', 'sweets')}
              className="hover:text-[#1F4D2B] transition-colors cursor-pointer"
            >
              Traditional Sweets
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-[#1F4D2B] transition-colors cursor-pointer"
            >
              Our Story
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-[#1F4D2B] transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>

          {/* Offers button */}
          <button
            onClick={() => onNavigate('shop', 'filter:deals')}
            className="flex items-center gap-1 text-[#B5502C] hover:text-[#8C3A1E] font-bold cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
            <span>Deals & Coupons</span>
          </button>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#EFE8D8] px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search homemade foods..."
                className="w-full bg-[#F5F2EA] text-xs pl-9 pr-4 py-2 rounded-lg border border-[#E2DCce]"
              />
              <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-2.5" />
            </div>
          </form>

          {/* Categories Grid */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Browse Categories
            </p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onNavigate('category', c.id);
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 text-left bg-[#FFFDF7] border border-[#EFE8D8] rounded-lg text-xs"
                >
                  <p className="font-semibold text-[#4A2C17]">{c.name}</p>
                  <p className="font-malayalam text-[10px] text-[#1F4D2B]">{c.malayalamName}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs font-medium">
            <button
              onClick={() => {
                onNavigate('shop');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-left text-[#4A2C17]"
            >
              All Products
            </button>
            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-left text-[#4A2C17]"
            >
              About Thanima
            </button>
            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-left text-[#4A2C17]"
            >
              Contact & WhatsApp
            </button>
            <button
              onClick={() => {
                onNavigate('faq');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-left text-[#4A2C17]"
            >
              Frequently Asked Questions
            </button>
            <button
              onClick={() => {
                onNavigate('track-order');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-left text-[#1F4D2B] font-semibold"
            >
              Track Order
            </button>
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-left text-[#B5502C] font-semibold"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
