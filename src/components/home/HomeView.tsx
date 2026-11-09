import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
  Tag,
  Check,
  Copy,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryId, Product } from '../../types';
import { ProductCard } from '../product/ProductCard';

interface HomeViewProps {
  onNavigate: (view: string, param?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSelectProduct,
}) => {
  const { categories, products, banners, availableCoupons, subscribeNewsletter } = useStore();

  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  // Auto banner rotation
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBannerIdx((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const activeBanner = banners[currentBannerIdx] || banners[0];

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    const res = subscribeNewsletter(newsletterEmail);
    setNewsletterMsg(res.message);
    if (res.success) setNewsletterEmail('');
  };

  return (
    <div className="space-y-14 md:space-y-20 pb-16">
      {/* 1. Hero Banner Slider */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div
          className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${activeBanner.bgColor} text-[#FFF8E7] shadow-lg min-h-[360px] md:min-h-[440px] flex items-center transition-all duration-700`}
        >
          {/* Subtle Kerala Kasavu lines & pattern overlay */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#F2A900_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 p-6 md:p-12 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#F2A900]">
              <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
              <span>{activeBanner.badge}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {activeBanner.title}
            </h1>

            <p className="font-malayalam text-lg md:text-xl text-[#F2A900] font-bold">
              {activeBanner.malayalamTitle}
            </p>

            <p className="text-xs md:text-sm text-[#FFF8E7]/85 max-w-lg leading-relaxed">
              {activeBanner.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  if (activeBanner.link.startsWith('category/')) {
                    onNavigate('category', activeBanner.link.replace('category/', ''));
                  } else {
                    onNavigate('shop');
                  }
                }}
                className="px-6 py-3 bg-[#F2A900] hover:bg-[#d49400] text-[#1F4D2B] font-bold text-xs md:text-sm rounded-full shadow-md flex items-center gap-2 transition-transform hover:scale-102 cursor-pointer"
              >
                <span>{activeBanner.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('about')}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs md:text-sm rounded-full border border-white/30 backdrop-blur-xs transition-colors cursor-pointer"
              >
                Our Heritage Story
              </button>
            </div>
          </div>

          {/* Right Cultural Art Element */}
          <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 items-center justify-center">
            <div className="relative w-72 h-72 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xs">
              <div className="text-center p-6 space-y-2">
                <span className="text-6xl block filter drop-shadow-md">🥥</span>
                <span className="font-malayalam text-xl font-bold text-[#F2A900] block">
                  തനിമ നാടൻ രുചി
                </span>
                <p className="text-[11px] text-white/70 max-w-[200px] leading-relaxed">
                  Stone ground flours, cold-pressed oils & sun-cured spices
                </p>
              </div>
            </div>
          </div>

          {/* Slider Prev / Next Controls */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5">
              <button
                onClick={() =>
                  setCurrentBannerIdx((prev) => (prev - 1 + banners.length) % banners.length)
                }
                className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition-colors"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentBannerIdx((prev) => (prev + 1) % banners.length)}
                className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition-colors"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. All 8 Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#1F4D2B] uppercase tracking-wider">
              Traditional Food Categories
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#4A2C17] mt-1">
              Explore Kerala's Heritage Flavours
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-[#1F4D2B] hover:underline flex items-center gap-1"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((c) => {
            const count = products.filter((p) => p.categoryIds.includes(c.id)).length;
            const emoji =
              c.id === 'snacks'
                ? '🍌'
                : c.id === 'pickles'
                ? '🏺'
                : c.id === 'spices'
                ? '🌶️'
                : c.id === 'breakfast'
                ? '🥥'
                : c.id === 'sweets'
                ? '🍯'
                : c.id === 'specialties'
                ? '✨'
                : c.id === 'rice-flours'
                ? '🌾'
                : '🌿';

            return (
              <button
                key={c.id}
                onClick={() => onNavigate('category', c.id)}
                className="group p-4 bg-white hover:bg-[#FFF8E7] rounded-2xl border border-[#EFE8D8] hover:border-[#F2A900]/50 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-[#FFF8E7] group-hover:bg-white flex items-center justify-center text-2xl shadow-2xs mb-2 transition-transform group-hover:scale-110">
                  {emoji}
                </div>
                <h3 className="font-bold text-xs text-[#4A2C17] group-hover:text-[#1F4D2B] line-clamp-1">
                  {c.name}
                </h3>
                <span className="font-malayalam text-[10px] text-[#1F4D2B] font-semibold mt-0.5 line-clamp-1">
                  {c.malayalamName}
                </span>
                <span className="text-[10px] text-[#8C7A6B] mt-1">
                  {count} items
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Promotional Offers & Coupon Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 md:p-8 bg-gradient-to-r from-[#FFF8E7] via-[#FFF3D6] to-[#FFE4A0] rounded-3xl border border-[#F2A900]/40 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B5502C] uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              <span>Limited Festival Coupons</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-[#4A2C17]">
              Flat Discounts on Kerala Goodness
            </h3>
            <p className="text-xs text-[#8C7A6B]">
              Apply coupon at checkout for instant order deductions.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {availableCoupons.map((coupon) => (
              <div
                key={coupon.code}
                className="bg-white border-2 border-dashed border-[#F2A900] px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-2xs"
              >
                <div>
                  <span className="font-mono font-bold text-xs text-[#1F4D2B]">
                    {coupon.code}
                  </span>
                  <p className="text-[10px] text-slate-500">
                    {coupon.type === 'free_shipping'
                      ? 'Free Delivery'
                      : coupon.type === 'flat'
                      ? `₹${coupon.value} Flat OFF`
                      : `${coupon.value}% OFF`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCoupon(coupon.code)}
                  className="p-1.5 bg-[#FFF8E7] hover:bg-[#FCECC7] rounded-lg text-xs font-semibold text-[#1F4D2B] transition-colors"
                  title="Copy coupon"
                >
                  {copiedCoupon === coupon.code ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Delicacies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#B5502C] uppercase tracking-wider">
              Handpicked Specials
            </span>
            <h2 className="text-2xl font-bold text-[#4A2C17] mt-0.5">
              Featured Kerala Delicacies
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-[#1F4D2B] hover:underline flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 5. "Why Thanima" Trust Section */}
      <section className="bg-[#FFFDF7] py-14 border-y border-[#EFE8D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D2B]">
              The Thanima Difference
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#4A2C17] mt-1">
              Pure. Homemade. Kerala.
            </h2>
            <p className="text-xs text-[#8C7A6B] mt-2">
              Unlike industrial snack brands, Thanima foods are prepared in small home batches with genuine grandmother recipes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-[#EFE8D8] shadow-xs text-center space-y-2">
              <span className="text-3xl block mb-2">🥥</span>
              <h3 className="font-bold text-sm text-[#4A2C17]">Cold-Pressed Coconut Oil</h3>
              <p className="text-xs text-[#8C7A6B] leading-relaxed">
                We never use palm oil or adulterated fats. Fried exclusively in pure wood-pressed coconut oil.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-[#EFE8D8] shadow-xs text-center space-y-2">
              <span className="text-3xl block mb-2">🌿</span>
              <h3 className="font-bold text-sm text-[#4A2C17]">Zero Preservatives</h3>
              <p className="text-xs text-[#8C7A6B] leading-relaxed">
                Zero synthetic colors, MSG, or artificial chemicals. Natural vinegar and sea salt preservation.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-[#EFE8D8] shadow-xs text-center space-y-2">
              <span className="text-3xl block mb-2">👩‍🍳</span>
              <h3 className="font-bold text-sm text-[#4A2C17]">Homemaker Collectives</h3>
              <p className="text-xs text-[#8C7A6B] leading-relaxed">
                Empowering Kudumbashree women and village mothers across Kottayam, Kozhikode, and Wayanad.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-[#EFE8D8] shadow-xs text-center space-y-2">
              <span className="text-3xl block mb-2">📦</span>
              <h3 className="font-bold text-sm text-[#4A2C17]">Vacuum-Sealed Freshness</h3>
              <p className="text-xs text-[#8C7A6B] leading-relaxed">
                Multi-layer moisture barrier packaging guarantees that snacks stay as crisp as just fried.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#1F4D2B] uppercase tracking-wider">
              Customer Favorites
            </span>
            <h2 className="text-2xl font-bold text-[#4A2C17] mt-0.5">
              Most Loved Delicacies
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-[#1F4D2B] hover:underline flex items-center gap-1"
          >
            <span>See All Best Sellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 7. Testimonials Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D2B]">
            From Kerala Food Lovers
          </span>
          <h2 className="text-2xl font-bold text-[#4A2C17] mt-1">
            Words of Love & Nostalgia
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-[#EFE8D8] rounded-3xl shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-[#F2A900]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              "Living in Bangalore, finding genuinely authentic upperi that smells of pure coconut oil was impossible until I ordered from Thanima. It took me straight back to my childhood Onam vacations in Palakkad!"
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1F4D2B] text-[#F2A900] font-bold text-xs flex items-center justify-center">
                A
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">Anjali Menon</p>
                <span className="text-[10px] text-slate-400">Software Engineer, Bangalore</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-[#EFE8D8] rounded-3xl shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-[#F2A900]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              "The Kannimanga and Chemmeen pickles are royal league! The tender mangoes have that exact bharani brine taste with no artificial tartness. Packing was super secure with zero oil leakage."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1F4D2B] text-[#F2A900] font-bold text-xs flex items-center justify-center">
                R
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">Rohan Varghese</p>
                <span className="text-[10px] text-slate-400">Product Designer, Mumbai</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-[#EFE8D8] rounded-3xl shadow-xs space-y-3">
            <div className="flex items-center gap-1 text-[#F2A900]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              "The Ghee Unniyappams stayed soft even after 3 days. Reheating them for 10 seconds made them taste fresh out of the appe pan. Also love the recyclable paper box packaging."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1F4D2B] text-[#F2A900] font-bold text-xs flex items-center justify-center">
                D
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">Deepa Nair</p>
                <span className="text-[10px] text-slate-400">Educator, Kochi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Newsletter Signup Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 md:p-12 bg-[#1F4D2B] text-white rounded-3xl text-center space-y-4 relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <span className="font-malayalam text-[#F2A900] text-lg font-bold block">
              തനിമ രുചിക്കൂട്ട് വാർത്തകൾ
            </span>
            <h3 className="text-2xl md:text-3xl font-bold">
              Join the Thanima Family
            </h3>
            <p className="text-xs text-white/80 leading-relaxed">
              Receive secret festive recipes, harvest season announcements for wild honey and Varikka jackfruit, plus members-only discounts.
            </p>

            <form onSubmit={handleNewsletter} className="flex max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 text-xs px-4 py-3 bg-white/10 text-white placeholder-white/50 rounded-l-2xl border border-white/20 focus:outline-none focus:bg-white/20"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#F2A900] hover:bg-[#d89600] text-[#1F4D2B] font-bold text-xs rounded-r-2xl transition-colors cursor-pointer"
              >
                Subscribe
              </button>
            </form>

            {newsletterMsg && (
              <p className="text-xs text-[#F2A900] pt-1">{newsletterMsg}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
