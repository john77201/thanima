import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  CheckCircle,
  CreditCard,
  Shield,
  Heart,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Logo } from './Logo';
import { useStore } from '../../context/StoreContext';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { categories, subscribeNewsletter } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    const res = subscribeNewsletter(newsletterEmail);
    setNewsletterStatus(res.message);
    if (res.success) {
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#14381F] text-[#FFF8E7] pt-14 pb-8 border-t-4 border-[#F2A900]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Trust Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-white/10 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-2xl mb-1.5">🥥</span>
            <h4 className="font-semibold text-sm text-[#F2A900]">100% Homemade</h4>
            <p className="text-xs text-[#FFF8E7]/70 mt-0.5">Prepared by traditional homemakers</p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-2xl mb-1.5">🌿</span>
            <h4 className="font-semibold text-sm text-[#F2A900]">Zero Preservatives</h4>
            <p className="text-xs text-[#FFF8E7]/70 mt-0.5">Pure ingredients & wood-pressed oil</p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-2xl mb-1.5">🚀</span>
            <h4 className="font-semibold text-sm text-[#F2A900]">All-India Delivery</h4>
            <p className="text-xs text-[#FFF8E7]/70 mt-0.5">Express sealed packaging</p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-2xl mb-1.5">🛡️</span>
            <h4 className="font-semibold text-sm text-[#F2A900]">Secure Payments & COD</h4>
            <p className="text-xs text-[#FFF8E7]/70 mt-0.5">UPI, Cards, and Cash on Delivery</p>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12">
          {/* Col 1: Brand & Story */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="white" size="lg" />
            <p className="text-xs text-[#FFF8E7]/80 leading-relaxed max-w-sm">
              Thanima (തനിമ) is a tribute to authentic Kerala culinary heritage. We bring the pure, unadulterated flavors of grandma's kitchen—from fresh coconut oil banana chips and fiery kannimanga to slow-cooked Kozhikodan halwa—straight to your home anywhere in India.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-malayalam text-[#F2A900] block mb-1">
                "തനി നാടൻ രുചിക്കൂട്ട്, സ്നേഹത്തോടെ പാകം ചെയ്തത്"
              </span>
              <p className="text-[11px] text-white/60">
                Registered Office: Thanima Foods, Infopark Expressway, Kakkanad, Kochi, Kerala - 682030
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F2A900]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-[#FFF8E7]/80">
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Our Heritage & Makers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track-order')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-[#F2A900] font-semibold hover:underline cursor-pointer"
                >
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F2A900]">
              Food Categories
            </h4>
            <ul className="space-y-2 text-xs text-[#FFF8E7]/80">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => onNavigate('category', c.id)}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter & Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F2A900]">
              Stay Connected
            </h4>
            <p className="text-xs text-[#FFF8E7]/70">
              Subscribe for festive deals, fresh batch alerts, and secret family recipes.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex items-center">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full text-xs px-3 py-2 bg-white/10 text-white placeholder-white/40 rounded-l-lg border border-white/20 focus:outline-none focus:bg-white/20"
                />
                <button
                  type="submit"
                  className="bg-[#F2A900] hover:bg-[#d89600] text-[#1F4D2B] font-bold text-xs px-3 py-2 rounded-r-lg transition-colors cursor-pointer"
                >
                  Join
                </button>
              </div>
              {newsletterStatus && (
                <p className="text-[11px] text-[#F2A900] animate-in fade-in">{newsletterStatus}</p>
              )}
            </form>

            <div className="pt-2 text-xs space-y-1.5 text-[#FFF8E7]/80">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F2A900]" />
                <span>+91 98470 00123 / 0484 2901234</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F2A900]" />
                <span>care@thanima.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Badges & Policies */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#FFF8E7]/70">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className="text-[11px] text-white/50 uppercase tracking-wider">Accepted Payments:</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-white/10 rounded-sm font-semibold text-[10px] text-white">
                UPI
              </span>
              <span className="px-2 py-0.5 bg-white/10 rounded-sm font-semibold text-[10px] text-white">
                Google Pay
              </span>
              <span className="px-2 py-0.5 bg-white/10 rounded-sm font-semibold text-[10px] text-white">
                PhonePe
              </span>
              <span className="px-2 py-0.5 bg-white/10 rounded-sm font-semibold text-[10px] text-white">
                Visa / MC
              </span>
              <span className="px-2 py-0.5 bg-white/10 rounded-sm font-semibold text-[10px] text-white">
                RuPay
              </span>
              <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 rounded-sm font-semibold text-[10px]">
                COD Available
              </span>
            </div>
          </div>

          {/* Legal / Policy Links */}
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => onNavigate('privacy')} className="hover:text-white">
              Privacy Policy
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('terms')} className="hover:text-white">
              Terms & Conditions
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('shipping-policy')} className="hover:text-white">
              Shipping Policy
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('refund-policy')} className="hover:text-white">
              Refund & Cancellation
            </button>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 mt-4 text-center text-xs text-[#FFF8E7]/50">
          <p>© {new Date().getFullYear()} Thanima (തനിമ). All rights reserved. Made with <span className="text-red-400">❤</span> in God's Own Country, Kerala.</p>
        </div>
      </div>

      {/* Floating WhatsApp Chat Button on All Pages */}
      <a
        href="https://wa.me/919847000123?text=Hi%20Thanima!%20I%20would%20like%20to%20inquire%20about%20your%20homemade%20Kerala%20delicacies."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Thanima on WhatsApp"
        className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110 focus:outline-hidden"
      >
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
      </a>
    </footer>
  );
};
