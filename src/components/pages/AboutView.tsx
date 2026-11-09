import React from 'react';
import { Heart, Sparkles, ShieldCheck, Users, MapPin, Truck } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Hero Narrative */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D2B] bg-[#FFF8E7] px-3 py-1 rounded-full border border-[#F2A900]/30">
          The Origin Story
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#4A2C17] leading-tight">
          Pure. Homemade. Kerala.
        </h1>
        <p className="font-malayalam text-xl font-bold text-[#1F4D2B]">
          "തനിമ എന്നാൽ കാപട്യമില്ലാത്ത യഥാർത്ഥ നാടൻ രുചി"
        </p>
        <p className="text-sm text-[#8C7A6B] leading-relaxed">
          Thanima was born in a humble kitchen in Edappally, Kochi, out of a simple observation: modern supermarkets sell factory-processed banana chips fried in stale palm oil, pickles doused in chemical preservatives, and flours packed with artificial whiteners. We set out to change that—by bringing the honest authenticity of grandma's kitchen to homes across India.
        </p>
      </div>

      {/* Counters Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-[#1F4D2B] text-white rounded-3xl shadow-sm text-center">
        <div>
          <span className="text-3xl md:text-4xl font-extrabold text-[#F2A900] tabular-nums">28,000+</span>
          <p className="text-xs text-white/80 mt-1">Happy Food Lovers</p>
        </div>
        <div>
          <span className="text-3xl md:text-4xl font-extrabold text-[#F2A900] tabular-nums">80+</span>
          <p className="text-xs text-white/80 mt-1">Authentic Delicacies</p>
        </div>
        <div>
          <span className="text-3xl md:text-4xl font-extrabold text-[#F2A900] tabular-nums">14</span>
          <p className="text-xs text-white/80 mt-1">Kerala Districts Sourced</p>
        </div>
        <div>
          <span className="text-3xl md:text-4xl font-extrabold text-[#F2A900] tabular-nums">120+</span>
          <p className="text-xs text-white/80 mt-1">Homemaker Cooks Empowered</p>
        </div>
      </div>

      {/* "Meet the Makers" Section */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#1F4D2B] uppercase tracking-wider">
            Our Kitchen Heroes
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#4A2C17] mt-1">
            Meet the Masters of Tradition
          </h2>
          <p className="text-xs text-[#8C7A6B] mt-1">
            Behind every pouch of Thanima is an experienced mother or village collective keeping ancestral recipes alive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-[#EFE8D8] rounded-3xl text-center space-y-3 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-[#FFF3D6] text-3xl mx-auto flex items-center justify-center border border-amber-200">
              👵
            </div>
            <h3 className="font-bold text-sm text-[#4A2C17]">Savitri Amma</h3>
            <span className="text-[11px] font-semibold text-[#1F4D2B] block">
              Head of Traditional Snacks, Palakkad
            </span>
            <p className="text-xs text-[#8C7A6B] leading-relaxed">
              With 42 years of frying mastery, Amma oversees the selection of raw Nendran bananas and monitors oil temperature with watchful precision.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#EFE8D8] rounded-3xl text-center space-y-3 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-[#FFE8DF] text-3xl mx-auto flex items-center justify-center border border-rose-200">
              👩‍🍳
            </div>
            <h3 className="font-bold text-sm text-[#4A2C17]">Mariamma Varghese</h3>
            <span className="text-[11px] font-semibold text-[#1F4D2B] block">
              Bharani Pickle Curator, Kottayam
            </span>
            <p className="text-xs text-[#8C7A6B] leading-relaxed">
              Curator of our legendary Kannimanga and Chemmeen pickles, aged slowly in century-old ceramic bharanis with wood-pressed gingelly oil.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#EFE8D8] rounded-3xl text-center space-y-3 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-[#FFF1E6] text-3xl mx-auto flex items-center justify-center border border-orange-200">
              👩‍🌾
            </div>
            <h3 className="font-bold text-sm text-[#4A2C17]">Zainaba Kozhikode</h3>
            <span className="text-[11px] font-semibold text-[#1F4D2B] block">
              Halwa Master, Sweet Street (S.M. Street)
            </span>
            <p className="text-xs text-[#8C7A6B] leading-relaxed">
              Continuing a three-generation legacy of stirring slow-cooked black halwas in heavy bronze urulis with native bananas and pure cow ghee.
            </p>
          </div>
        </div>
      </div>

      {/* Process Timeline: Sourcing -> Preparing -> Packing -> Delivering */}
      <div className="space-y-8 bg-[#FFFDF7] p-8 md:p-12 border border-[#EFE8D8] rounded-3xl">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#1F4D2B] uppercase tracking-wider">
            From Soil to Doorstep
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#4A2C17] mt-1">
            Our 4-Step Fresh Process
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="space-y-2">
            <span className="text-2xl font-bold text-[#F2A900] block">01</span>
            <h4 className="font-bold text-sm text-[#4A2C17]">1. Ethical Sourcing</h4>
            <p className="text-xs text-[#8C7A6B] leading-relaxed">
              Direct from chemical-free farmers in Wayanad, Palakkad paddy fields, and Marayoor jaggery artisans.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-2xl font-bold text-[#F2A900] block">02</span>
            <h4 className="font-bold text-sm text-[#4A2C17]">2. Traditional Cooking</h4>
            <p className="text-xs text-[#8C7A6B] leading-relaxed">
              Prepared in small artisanal batches in certified clean collective home kitchens on low wood fire.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-2xl font-bold text-[#F2A900] block">03</span>
            <h4 className="font-bold text-sm text-[#4A2C17]">3. Multi-Layer Packing</h4>
            <p className="text-xs text-[#8C7A6B] leading-relaxed">
              Hermetically vacuum sealed inside multi-layer food-grade pouches to preserve natural crunch and oils.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-2xl font-bold text-[#F2A900] block">04</span>
            <h4 className="font-bold text-sm text-[#4A2C17]">4. Express Delivery</h4>
            <p className="text-xs text-[#8C7A6B] leading-relaxed">
              Dispatched daily via air and speed couriers to reach your table anywhere in India within 2 to 4 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
