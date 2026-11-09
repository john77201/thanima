import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, Zap, Check } from 'lucide-react';
import { Product } from '../../types';
import { ProductVisual } from '../common/ProductVisual';
import { formatINR } from '../../utils/pricing';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onBuyNow?: (product: Product, variantId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onBuyNow,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id || ''
  );
  const [justAdded, setJustAdded] = useState(false);

  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0];

  const inWishlist = isInWishlist(product.id);
  const discountPercent =
    activeVariant && activeVariant.mrp > activeVariant.price
      ? Math.round(
          ((activeVariant.mrp - activeVariant.price) / activeVariant.mrp) * 100
        )
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id, activeVariant?.id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBuyNow && activeVariant) {
      onBuyNow(product, activeVariant.id);
    } else {
      addToCart(product.id, activeVariant?.id, 1);
      onSelect(product);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white rounded-2xl border border-[#EFE8D8] hover:border-[#1F4D2B]/30 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top Image area */}
      <div className="relative overflow-hidden">
        <ProductVisual
          productId={product.id}
          name={product.name}
          malayalamName={product.malayalamName}
          category={product.categoryIds[0]}
          isVeg={product.isVeg}
          customImage={product.images[0]}
          aspectRatio="square"
          className="group-hover:scale-102 transition-transform duration-500"
        />

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute top-2.5 left-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#4A2C17] hover:text-[#B5502C] shadow-xs transition-transform active:scale-90"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              inWishlist ? 'fill-[#B5502C] text-[#B5502C]' : 'text-[#8C7A6B]'
            }`}
          />
        </button>

        {/* Discount Badge if on sale */}
        {discountPercent > 0 && (
          <div className="absolute bottom-2.5 left-2.5 z-10 bg-[#B5502C] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-xs">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Card Details Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata: Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#8C7A6B] mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#1F4D2B]">
              {product.subcategory || 'Homemade Kerala'}
            </span>
            <div className="flex items-center gap-1 text-[#4A2C17]">
              <Star className="w-3.5 h-3.5 fill-[#F2A900] text-[#F2A900]" />
              <span className="font-semibold text-xs tabular-nums">{product.rating}</span>
              <span className="text-[10px] text-[#8C7A6B]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name (English) */}
          <h3 className="font-semibold text-sm text-[#4A2C17] group-hover:text-[#1F4D2B] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Malayalam Name */}
          <p className="font-malayalam text-xs text-[#1F4D2B]/85 mt-0.5 line-clamp-1 font-medium">
            {product.malayalamName}
          </p>

          {/* Short description */}
          <p className="text-[11px] text-[#8C7A6B] mt-1.5 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#EFE8D8]/70">
          {/* Weight Variant Selector Pills */}
          {product.variants.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex flex-wrap gap-1 mb-2.5"
            >
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                    selectedVariantId === v.id
                      ? 'bg-[#1F4D2B] text-white font-semibold shadow-2xs'
                      : 'bg-[#F4F1EA] text-[#4A2C17] hover:bg-[#EAE4D6]'
                  }`}
                >
                  {v.weight}
                </button>
              ))}
            </div>
          )}

          {/* Price & Stock status */}
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-[#1F4D2B] tabular-nums">
                {formatINR(activeVariant?.price || 0)}
              </span>
              {activeVariant && activeVariant.mrp > activeVariant.price && (
                <span className="text-xs text-[#8C7A6B] line-through tabular-nums">
                  {formatINR(activeVariant.mrp)}
                </span>
              )}
            </div>

            <span className="text-[10px] font-medium text-emerald-800">
              {activeVariant && activeVariant.stock < 10
                ? `Only ${activeVariant.stock} left`
                : 'In Stock'}
            </span>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#FFF8E7] hover:bg-[#FCECC7] text-[#1F4D2B] border border-[#F2A900]/40'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-2 px-2 bg-[#1F4D2B] hover:bg-[#14381F] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-[#F2A900] fill-[#F2A900]" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
