import React from 'react';
import { getProductImageUrl } from '../../data/productImages';

interface ProductVisualProps {
  productId?: string;
  name: string;
  malayalamName?: string;
  category: string;
  isVeg?: boolean;
  className?: string;
  customImage?: string;
  aspectRatio?: 'square' | 'wide' | 'portrait';
}

const CATEGORY_THEMES: Record<
  string,
  { bg: string; accent: string; icon: string; pattern: string }
> = {
  snacks: {
    bg: 'from-[#FFF3D6] via-[#FFE4A0] to-[#F5D073]',
    accent: '#B5502C',
    icon: '🍌',
    pattern: 'chips',
  },
  pickles: {
    bg: 'from-[#FFE8DF] via-[#FFD0BF] to-[#F7B096]',
    accent: '#B5502C',
    icon: '🏺',
    pattern: 'jar',
  },
  spices: {
    bg: 'from-[#FFF0E0] via-[#FCE0C6] to-[#F5C299]',
    accent: '#9E3C1B',
    icon: '🌶️',
    pattern: 'spice',
  },
  breakfast: {
    bg: 'from-[#F3F7F0] via-[#E2ECE0] to-[#C9DEC4]',
    accent: '#1F4D2B',
    icon: '🥥',
    pattern: 'steamer',
  },
  sweets: {
    bg: 'from-[#FFF1E6] via-[#FFE1CC] to-[#F5C7A6]',
    accent: '#4A2C17',
    icon: '🍯',
    pattern: 'uruli',
  },
  specialties: {
    bg: 'from-[#F5EFE6] via-[#E8DCCB] to-[#D5C2AA]',
    accent: '#1F4D2B',
    icon: '✨',
    pattern: 'chutney',
  },
  'rice-flours': {
    bg: 'from-[#F7F4EE] via-[#EBE5D8] to-[#DDD4C0]',
    accent: '#4A2C17',
    icon: '🌾',
    pattern: 'paddy',
  },
  healthy: {
    bg: 'from-[#F0F7EE] via-[#E0EEDC] to-[#C7E0C2]',
    accent: '#1F4D2B',
    icon: '🌿',
    pattern: 'leaf',
  },
};

export const ProductVisual: React.FC<ProductVisualProps> = ({
  productId,
  name,
  malayalamName,
  category,
  isVeg = true,
  className = '',
  customImage,
  aspectRatio = 'square',
}) => {
  const [imageError, setImageError] = React.useState(false);
  const resolvedImageUrl = getProductImageUrl(productId, customImage, category);

  if (!imageError && resolvedImageUrl) {
    return (
      <div
        className={`relative overflow-hidden bg-[#F4F1EA] ${
          aspectRatio === 'square'
            ? 'aspect-square'
            : aspectRatio === 'wide'
            ? 'aspect-[16/10]'
            : 'aspect-[3/4]'
        } ${className}`}
      >
        <img
          src={resolvedImageUrl}
          alt={name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Veg / Non-Veg badge */}
        <div className="absolute top-2.5 right-2.5 z-10 bg-white/90 backdrop-blur-xs p-1 rounded-sm shadow-xs border border-gray-200">
          <div
            className={`w-3.5 h-3.5 border ${
              isVeg ? 'border-emerald-600' : 'border-amber-700'
            } flex items-center justify-center p-0.5`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isVeg ? 'bg-emerald-600' : 'bg-amber-700'
              }`}
            />
          </div>
        </div>
      </div>
    );
  }

  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES.snacks;

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${theme.bg} flex flex-col items-center justify-between p-4 select-none ${
        aspectRatio === 'square'
          ? 'aspect-square'
          : aspectRatio === 'wide'
          ? 'aspect-[16/10]'
          : 'aspect-[3/4]'
      } ${className}`}
    >
      {/* Decorative Traditional Kerala motif outlines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path d="M0,0 C30,40 70,20 100,0 L100,100 L0,100 Z" fill="#1F4D2B" />
        <circle cx="90" cy="15" r="25" fill="#F2A900" />
        <circle cx="10" cy="85" r="30" fill="#B5502C" />
      </svg>

      {/* Top row: Offset for wishlist button & Veg/Non-Veg mark */}
      <div className="w-full flex items-center justify-between z-10 pl-8">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4A2C17]/70 bg-white/60 backdrop-blur-xs px-2 py-0.5 rounded-xs">
          Homemade
        </span>

        {/* Veg / Non-Veg icon */}
        <div
          className="bg-white/90 backdrop-blur-xs p-1 rounded-sm shadow-xs border border-black/5"
          title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
        >
          <div
            className={`w-3.5 h-3.5 border ${
              isVeg ? 'border-emerald-700' : 'border-amber-800'
            } flex items-center justify-center p-0.5`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isVeg ? 'bg-emerald-700' : 'bg-amber-800'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Centerpiece: Food Emblem with circular plate/banana leaf backdrop */}
      <div className="relative flex flex-col items-center justify-center my-auto z-10 transition-transform duration-300 group-hover:scale-105">
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/70 shadow-sm border border-amber-200/50 flex items-center justify-center backdrop-blur-xs">
          <span className="text-3xl md:text-4xl filter drop-shadow-sm animate-pulse-slow">
            {theme.icon}
          </span>
          {/* Circular Kerala ring accent */}
          <div className="absolute inset-1 rounded-full border border-dashed border-[#F2A900]/40" />
        </div>
        <div className="mt-2 text-center max-w-[180px]">
          <span className="font-malayalam text-xs font-bold text-[#1F4D2B] block leading-tight line-clamp-1">
            {malayalamName || 'തനിമ രുചി'}
          </span>
        </div>
      </div>

      {/* Bottom bar: Authentic guarantee label aligned right */}
      <div className="w-full flex items-center justify-end pt-1 border-t border-black/5 text-[10px] text-[#4A2C17]/80 z-10">
        <span className="font-semibold text-[#1F4D2B] shrink-0 text-[9px] bg-white/70 px-1.5 py-0.5 rounded-xs">
          100% Pure
        </span>
      </div>
    </div>
  );
};
