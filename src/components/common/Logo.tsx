import React from 'react';

interface LogoProps {
  variant?: 'full' | 'white' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  const isWhite = variant === 'white';
  const isIcon = variant === 'icon';

  const scaleClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
  }[size];

  if (isIcon) {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${scaleClasses} aspect-square ${className}`}
        aria-label="Thanima Icon"
      >
        <circle cx="50" cy="50" r="48" fill={isWhite ? '#1F4D2B' : '#14381F'} />
        {/* Golden Nilavilakku (Traditional Lamp) flame / Banana leaf motif */}
        <path
          d="M50 15C52 28 65 35 65 52C65 65 58 75 50 78C42 75 35 65 35 52C35 35 48 28 50 15Z"
          fill="url(#goldGradientIcon)"
        />
        <path
          d="M50 24C51 32 60 40 60 52C60 62 55 69 50 71C45 69 40 62 40 52C40 40 49 32 50 24Z"
          fill="#FFF4D0"
          opacity="0.85"
        />
        <circle cx="50" cy="53" r="6" fill="#B5502C" />
        <path
          d="M25 82C35 78 65 78 75 82L70 88C60 86 40 86 30 88L25 82Z"
          fill="url(#goldGradientIcon)"
        />
        <defs>
          <linearGradient id="goldGradientIcon" x1="35" y1="15" x2="65" y2="88" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFE07A" />
            <stop offset="0.5" stopColor="#F2A900" />
            <stop offset="1" stopColor="#C98200" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Emblem SVG: Banana leaf + Nilavilakku motif */}
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${scaleClasses} aspect-square shrink-0`}
        aria-hidden="true"
      >
        <rect
          width="44"
          height="44"
          rx="12"
          fill={isWhite ? 'rgba(255,255,255,0.12)' : '#1F4D2B'}
        />
        {/* Palm / Leaf & golden flame */}
        <path
          d="M22 8C23.5 15 30 19 30 26C30 32.5 26.5 36.5 22 38C17.5 36.5 14 32.5 14 26C14 19 20.5 15 22 8Z"
          fill="url(#goldGrad)"
        />
        <path
          d="M22 13C22.8 17 27 20 27 26C27 30 25 33 22 34C19 33 17 30 17 26C17 20 21.2 17 22 13Z"
          fill="#FFF8E7"
          opacity="0.9"
        />
        <circle cx="22" cy="26" r="3.2" fill="#B5502C" />
        <defs>
          <linearGradient id="goldGrad" x1="14" y1="8" x2="30" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFEA85" />
            <stop offset="0.5" stopColor="#F2A900" />
            <stop offset="1" stopColor="#D48800" />
          </linearGradient>
        </defs>
      </svg>

      {/* Typography: Malayalam wordmark + English title */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-malayalam font-bold tracking-normal ${
            size === 'lg' ? 'text-2xl md:text-3xl' : size === 'sm' ? 'text-lg' : 'text-xl md:text-2xl'
          } ${isWhite ? 'text-[#FFF8E7]' : 'text-[#1F4D2B]'}`}
        >
          തനിമ
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className={`font-semibold tracking-[0.24em] uppercase text-[10px] md:text-[11px] ${
              isWhite ? 'text-[#F2A900]' : 'text-[#8C5E28]'
            }`}
          >
            THANIMA
          </span>
          <span
            className={`hidden sm:inline-block text-[9px] font-normal tracking-wide italic opacity-85 ${
              isWhite ? 'text-[#FFF8E7]/70' : 'text-[#1F4D2B]/80'
            }`}
          >
            · Pure Kerala
          </span>
        </div>
      </div>
    </div>
  );
};
