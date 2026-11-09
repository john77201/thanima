import React from 'react';
import { Home, Grid, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenCart,
  onOpenAuth,
}) => {
  const { cartCount, currentUser } = useStore();

  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EFE8D8] py-2 px-6 flex items-center justify-around shadow-lg">
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          currentView === 'home' ? 'text-[#1F4D2B] font-bold' : 'text-[#8C7A6B]'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => onNavigate('shop')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          currentView === 'shop' || currentView === 'category'
            ? 'text-[#1F4D2B] font-bold'
            : 'text-[#8C7A6B]'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span>Shop</span>
      </button>

      <button
        onClick={onOpenCart}
        className="flex flex-col items-center gap-1 text-[10px] font-medium text-[#8C7A6B] relative"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#B5502C] text-white text-[9px] font-bold px-1 rounded-full">
              {cartCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>

      <button
        onClick={() => (currentUser ? onNavigate('my-account') : onOpenAuth())}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          currentView === 'my-account' || currentView === 'my-orders'
            ? 'text-[#1F4D2B] font-bold'
            : 'text-[#8C7A6B]'
        }`}
      >
        <User className="w-5 h-5" />
        <span>{currentUser ? 'Account' : 'Login'}</span>
      </button>
    </nav>
  );
};
