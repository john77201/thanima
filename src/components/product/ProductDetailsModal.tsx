import React, { useState } from 'react';
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Clock,
  Sparkles,
  Share2,
  Check,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { ProductVisual } from '../common/ProductVisual';
import { formatINR } from '../../utils/pricing';
import { isKeralaPincode, isValidPincode } from '../../utils/validation';
import { useStore } from '../../context/StoreContext';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product, variantId: string, quantity: number) => void;
  onSelectRelated: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onBuyNow,
  onSelectRelated,
}) => {
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    reviews,
    addReview,
    currentUser,
  } = useStore();

  if (!product) return null;

  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Pincode checker state
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<{
    checked: boolean;
    available: boolean;
    message: string;
  } | null>(null);

  // Review submission state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState(currentUser?.name || '');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Share state
  const [copiedLink, setCopiedLink] = useState(false);

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

  // Filter reviews for this product
  const productReviews = reviews.filter(
    (r) => r.productId === product.id && r.status === 'approved'
  );

  // Related products from same category
  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.categoryIds.some((c) => product.categoryIds.includes(c))
    )
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product.id, activeVariant?.id, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPincode(pincode)) {
      setPincodeStatus({
        checked: true,
        available: false,
        message: 'Please enter a valid 6-digit Indian PIN code.',
      });
      return;
    }

    if (isKeralaPincode(pincode)) {
      setPincodeStatus({
        checked: true,
        available: true,
        message: 'Express Delivery Available: Delivered within 24–48 hours across Kerala. COD available.',
      });
    } else {
      setPincodeStatus({
        checked: true,
        available: true,
        message: 'All-India Express Courier Available: Delivered in 3–5 working days with fresh vacuum seal.',
      });
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addReview(product.id, reviewRating, reviewComment, reviewAuthor);
    setReviewComment('');
    setShowReviewForm(false);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const handleCopyShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-[#EFE8D8] max-h-[92vh] flex flex-col">
        {/* Top Header close */}
        <div className="p-4 border-b border-[#EFE8D8] bg-[#FFFDF7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1F4D2B]">
              {product.subcategory || 'Kerala Homely Delicacy'}
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-slate-500 font-mono">SKU: {activeVariant?.sku}</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* Main 2-column Product presentation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Column: Visual Showcase */}
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-[#EFE8D8] shadow-sm relative group">
                <ProductVisual
                  productId={product.id}
                  name={product.name}
                  malayalamName={product.malayalamName}
                  category={product.categoryIds[0]}
                  isVeg={product.isVeg}
                  customImage={product.images[0]}
                  aspectRatio="square"
                />

                {discountPercent > 0 && (
                  <span className="absolute bottom-4 left-4 bg-[#B5502C] text-white text-xs font-bold px-2.5 py-1 rounded-sm shadow-md">
                    SAVE {discountPercent}%
                  </span>
                )}
              </div>

              {/* Trust Badges under Image */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-[#4A2C17]/80">
                <div className="p-2.5 bg-[#FFF8E7] rounded-xl border border-[#F2A900]/20 flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#1F4D2B]" />
                  <span className="font-semibold">No Chemicals</span>
                </div>
                <div className="p-2.5 bg-[#FFF8E7] rounded-xl border border-[#F2A900]/20 flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-[#1F4D2B]" />
                  <span className="font-semibold">Express Pack</span>
                </div>
                <div className="p-2.5 bg-[#FFF8E7] rounded-xl border border-[#F2A900]/20 flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-[#1F4D2B]" />
                  <span className="font-semibold">Fresh Taste</span>
                </div>
              </div>
            </div>

            {/* Right Column: Product Info & Purchase Module */}
            <div className="space-y-5">
              <div>
                <h1 id="product-details-title" className="text-xl md:text-2xl font-bold text-[#4A2C17] leading-snug">
                  {product.name}
                </h1>
                <p className="font-malayalam text-base font-semibold text-[#1F4D2B] mt-1">
                  {product.malayalamName}
                </p>

                {/* Rating & Review summary */}
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <div className="flex items-center gap-1 bg-[#FFF3D6] px-2 py-0.5 rounded-sm">
                    <Star className="w-3.5 h-3.5 fill-[#F2A900] text-[#F2A900]" />
                    <span className="font-bold text-[#4A2C17] tabular-nums">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-[#8C7A6B]">
                    {product.reviewCount} customer ratings · {product.salesCount}+ units sold
                  </span>
                </div>
              </div>

              {/* Price & MRP Display */}
              <div className="p-4 bg-[#FFFDF7] border border-[#EFE8D8] rounded-2xl flex items-baseline justify-between">
                <div>
                  <span className="text-2xl md:text-3xl font-extrabold text-[#1F4D2B] tabular-nums">
                    {formatINR(activeVariant?.price || 0)}
                  </span>
                  {activeVariant && activeVariant.mrp > activeVariant.price && (
                    <span className="ml-2.5 text-sm text-[#8C7A6B] line-through tabular-nums">
                      {formatINR(activeVariant.mrp)}
                    </span>
                  )}
                  <span className="block text-[11px] text-[#8C7A6B] mt-0.5">
                    Inclusive of all taxes · Free delivery above ₹499
                  </span>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-full">
                    {activeVariant?.stock && activeVariant.stock > 0
                      ? `${activeVariant.stock} in stock`
                      : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Variants Selector */}
              <div>
                <label className="block text-xs font-bold text-[#4A2C17] uppercase tracking-wider mb-2">
                  Select Pack Size: <span className="text-[#1F4D2B]">{activeVariant?.weight}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                        selectedVariantId === v.id
                          ? 'border-[#1F4D2B] bg-[#1F4D2B] text-white shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span>{v.weight}</span>
                      <span className="opacity-80">· {formatINR(v.price)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-[#4A2C17] uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-slate-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs transition-colors ${
                    inWishlist
                      ? 'border-[#B5502C] bg-red-50 text-[#B5502C]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                  <span>{inWishlist ? 'Wishlisted' : 'Save'}</span>
                </button>
              </div>

              {/* Action Buttons: Add to Cart and Buy Now */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`py-3 px-4 rounded-xl font-semibold text-xs md:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                    justAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#FFF8E7] hover:bg-[#FBE9B8] text-[#1F4D2B] border border-[#F2A900]/60'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (activeVariant) {
                      onBuyNow(product, activeVariant.id, quantity);
                    }
                  }}
                  className="py-3 px-4 bg-[#1F4D2B] hover:bg-[#14381F] text-white rounded-xl font-semibold text-xs md:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-[#F2A900] fill-[#F2A900]" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Delivery Pincode Checker */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-2">
                  <Truck className="w-4 h-4 text-[#1F4D2B]" />
                  <span>Check Delivery & Cash on Delivery</span>
                </div>
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit Pincode (e.g. 682001)"
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#1F4D2B]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#1F4D2B] text-white font-medium rounded-lg text-xs hover:bg-[#14381F]"
                  >
                    Check
                  </button>
                </form>

                {pincodeStatus && (
                  <p
                    className={`mt-2 text-[11px] leading-tight ${
                      pincodeStatus.available ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {pincodeStatus.message}
                  </p>
                )}
              </div>

              {/* Share */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span>Share this delicacy with family:</span>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/?text=Check%20out%20this%20authentic%20Kerala%20${encodeURIComponent(
                      product.name
                    )}%20from%20Thanima%20Homely%20Foods!`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-medium hover:bg-emerald-100 text-[11px]"
                  >
                    WhatsApp
                  </a>
                  <button
                    onClick={handleCopyShare}
                    className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 text-[11px] flex items-center gap-1"
                  >
                    {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Product Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#EFE8D8]">
            <div className="p-4 bg-[#FFFDF7] border border-[#EFE8D8] rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F4D2B] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
                <span>Ingredients</span>
              </h4>
              <ul className="space-y-1 text-xs text-[#4A2C17]/80">
                {product.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#1F4D2B]" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#FFFDF7] border border-[#EFE8D8] rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F4D2B] mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#F2A900]" />
                <span>Shelf Life & Storage</span>
              </h4>
              <p className="text-xs text-[#4A2C17]/80 mb-2">
                <strong className="text-[#4A2C17]">Natural Shelf Life:</strong> {product.shelfLife}
              </p>
              <p className="text-xs text-[#4A2C17]/80 leading-relaxed">
                <strong className="text-[#4A2C17]">Storage:</strong> {product.storageInstructions}
              </p>
            </div>

            <div className="p-4 bg-[#FFFDF7] border border-[#EFE8D8] rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F4D2B] mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F2A900]" />
                <span>Preparation Craft</span>
              </h4>
              <p className="text-xs text-[#4A2C17]/80 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Ratings & Customer Reviews Section */}
          <div className="pt-6 border-t border-[#EFE8D8]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#4A2C17]">Customer Reviews & Ratings</h3>
                <p className="text-xs text-[#8C7A6B]">
                  Verified reviews from customers who purchased this food.
                </p>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3 py-1.5 bg-[#FFF8E7] hover:bg-[#FCECC7] border border-[#F2A900]/40 text-[#1F4D2B] font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Write a Review</span>
              </button>
            </div>

            {reviewSubmitted && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 mb-4 border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Thank you! Your verified review has been posted.</span>
              </div>
            )}

            {/* Submit Review Form */}
            {showReviewForm && (
              <form
                onSubmit={handleReviewSubmit}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 mb-6"
              >
                <h4 className="font-semibold text-xs text-slate-800">Share your experience</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="e.g. Radhika Pillai"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewRating(s)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              s <= reviewRating
                                ? 'fill-[#F2A900] text-[#F2A900]'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Review</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe taste, crispness, aroma, packaging..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#1F4D2B] text-white rounded-lg text-xs font-semibold"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {productReviews.length > 0 ? (
                productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 bg-white border border-[#EFE8D8] rounded-xl text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#4A2C17]">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-medium px-1.5 py-0.2 rounded-xs flex items-center gap-1">
                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= rev.rating
                              ? 'fill-[#F2A900] text-[#F2A900]'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-slate-700 leading-relaxed text-xs">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-xs text-slate-400">
                  Be the first to review this authentic delicacy!
                </p>
              )}
            </div>
          </div>

          {/* Related Products strip */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-[#EFE8D8]">
              <h4 className="text-sm font-bold text-[#4A2C17] mb-3">
                You might also relish from this category
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectRelated(p)}
                    className="p-3 bg-[#FFFDF7] border border-[#EFE8D8] hover:border-[#1F4D2B] rounded-xl flex items-center gap-3 cursor-pointer transition-all"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#FFF3D6] flex items-center justify-center text-xl shrink-0">
                      {p.categoryIds[0] === 'snacks'
                        ? '🍌'
                        : p.categoryIds[0] === 'pickles'
                        ? '🏺'
                        : '🍯'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-xs text-[#4A2C17] truncate">{p.name}</p>
                      <p className="text-[10px] font-malayalam text-[#1F4D2B] truncate">
                        {p.malayalamName}
                      </p>
                      <span className="text-xs font-bold text-[#B5502C] tabular-nums">
                        {formatINR(p.variants[0]?.price || 0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
