import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  Tag,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getProductImageUrl } from '../../data/productImages';
import {
  FREE_DELIVERY_THRESHOLD,
  calculateCartSubtotal,
  calculateCouponDiscount,
  calculateDeliveryFee,
  calculateOrderTotal,
  formatINR,
} from '../../utils/pricing';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const {
    cart,
    products,
    updateCartQuantity,
    removeFromCart,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    availableCoupons,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const subtotal = calculateCartSubtotal(cart, products);
  const discount = calculateCouponDiscount(subtotal, activeCoupon);
  const deliveryFee = calculateDeliveryFee(subtotal, activeCoupon);
  const total = calculateOrderTotal(subtotal, discount, deliveryFee, false);

  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeDeliveryProgress = Math.min(
    100,
    Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100)
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim(), subtotal);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleApplyQuickCoupon = (code: string) => {
    const res = applyCoupon(code, subtotal);
    setCouponFeedback(res);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#EFE8D8] transform transition-transform">
        {/* Header */}
        <div className="p-4 border-b border-[#EFE8D8] bg-[#FFFDF7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1F4D2B]" />
            <h2 id="cart-drawer-title" className="font-bold text-base text-[#4A2C17]">
              Your Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Progress Bar */}
        <div className="bg-[#FFF8E7] p-3 border-b border-[#F2A900]/20 text-xs">
          {amountNeededForFreeDelivery > 0 ? (
            <div>
              <p className="text-[#4A2C17] font-medium flex items-center justify-between">
                <span>
                  Add <strong className="text-[#1F4D2B]">{formatINR(amountNeededForFreeDelivery)}</strong> more for <strong>FREE Delivery</strong>!
                </span>
                <span className="text-[10px] text-[#8C7A6B]">{freeDeliveryProgress}%</span>
              </p>
              <div className="w-full bg-[#EFE8D8] h-2 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-[#1F4D2B] h-full rounded-full transition-all duration-300"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>You have unlocked FREE Doorstep Delivery! 🎉</span>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-[#EFE8D8]">
          {cart.length > 0 ? (
            cart.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;
              const variant =
                product.variants.find((v) => v.id === item.variantId) ||
                product.variants[0];
              const lineTotal = (variant?.price || 0) * item.quantity;

              return (
                <div key={`${item.productId}-${item.variantId}`} className="py-3 flex gap-3">
                  {/* Thumbnail */}
                  <img
                    src={getProductImageUrl(product.id, product.images[0], product.categoryIds[0])}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#EFE8D8] shadow-2xs"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <h4 className="font-semibold text-xs text-[#4A2C17] leading-tight line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="font-malayalam text-[10px] text-[#1F4D2B] truncate">
                          {product.malayalamName}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId, item.variantId)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-700">
                        {variant?.weight}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity - 1
                            )
                          }
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-slate-800 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity + 1
                            )
                          }
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#1F4D2B] tabular-nums">
                        {formatINR(lineTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mx-auto">
                🛍️
              </div>
              <h3 className="font-semibold text-sm text-[#4A2C17]">Your bag is empty</h3>
              <p className="text-xs text-[#8C7A6B] max-w-xs mx-auto">
                Fill it with authentic Kerala banana chips, traditional pickles, or roasted flours!
              </p>
              <button
                onClick={() => {
                  onClose();
                  onContinueShopping();
                }}
                className="mt-2 px-4 py-2 bg-[#1F4D2B] text-white text-xs font-semibold rounded-xl hover:bg-[#14381F]"
              >
                Browse Foods
              </button>
            </div>
          )}
        </div>

        {/* Footer: Coupon + Summary + Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-[#EFE8D8] bg-[#FFFDF7] space-y-3">
            {/* Coupon Code Section */}
            <div>
              {activeCoupon ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-700" />
                    <div>
                      <span className="font-bold text-emerald-900">{activeCoupon.code}</span>
                      <span className="text-[10px] text-emerald-700 ml-1.5">
                        ({activeCoupon.type === 'flat' ? `₹${activeCoupon.value} OFF` : `${activeCoupon.value}% OFF`})
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Enter Coupon Code (e.g. WELCOME10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 text-xs uppercase font-mono px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1F4D2B]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-[#1F4D2B] text-white text-xs font-semibold rounded-xl hover:bg-[#14381F] transition-colors"
                    >
                      Apply
                    </button>
                  </div>

                  {couponFeedback && (
                    <p
                      className={`text-[11px] ${
                        couponFeedback.success ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {couponFeedback.message}
                    </p>
                  )}

                  {/* Quick coupon chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {availableCoupons.slice(0, 2).map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleApplyQuickCoupon(c.code)}
                        className="text-[10px] font-mono font-medium px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-md hover:bg-amber-100"
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount</span>
                  <span className="font-semibold tabular-nums">- {formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-semibold tabular-nums">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    formatINR(deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1F4D2B] pt-2 border-t border-[#EFE8D8]">
                <span>Total Amount</span>
                <span className="tabular-nums text-base">{formatINR(total)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3 bg-[#1F4D2B] hover:bg-[#14381F] text-white rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
