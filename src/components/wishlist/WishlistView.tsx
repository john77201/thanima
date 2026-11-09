import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { Product } from '../../types';

interface WishlistViewProps {
  onSelectProduct: (product: Product) => void;
  onContinueShopping: () => void;
  onOpenAuth: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  onSelectProduct,
  onContinueShopping,
  onOpenAuth,
}) => {
  const { wishlist, products, addToCart, toggleWishlist, currentUser } = useStore();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#4A2C17] flex items-center gap-2">
            <Heart className="w-6 h-6 fill-[#B5502C] text-[#B5502C]" />
            <span>My Wishlist ({wishlistedProducts.length})</span>
          </h2>
          <p className="text-xs text-[#8C7A6B] mt-1">
            Your saved Kerala delicacies. Add them to your bag anytime.
          </p>
        </div>

        {!currentUser && (
          <button
            onClick={onOpenAuth}
            className="text-xs font-semibold text-[#1F4D2B] bg-[#FFF8E7] px-3 py-1.5 rounded-xl border border-[#F2A900]/40 hover:bg-[#FCECC7]"
          >
            Sign In to Sync Across Devices
          </button>
        )}
      </div>

      {wishlistedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistedProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white border border-[#EFE8D8] rounded-3xl p-8 space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-3xl mx-auto">
            <Heart className="w-8 h-8 text-[#B5502C]" />
          </div>
          <h3 className="font-bold text-base text-[#4A2C17]">Your wishlist is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any product to save your favorite snacks, pickles, or flours for later.
          </p>
          <button
            onClick={onContinueShopping}
            className="px-5 py-2.5 bg-[#1F4D2B] text-white text-xs font-bold rounded-xl hover:bg-[#14381F] inline-flex items-center gap-1.5"
          >
            <span>Browse Foods</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
