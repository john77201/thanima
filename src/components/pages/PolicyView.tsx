import React from 'react';

interface PolicyViewProps {
  type: 'privacy' | 'terms' | 'shipping' | 'refund';
}

export const PolicyView: React.FC<PolicyViewProps> = ({ type }) => {
  const titles = {
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    shipping: 'Shipping & Delivery Policy',
    refund: 'Refund & Cancellation Policy',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D2B] bg-[#FFF8E7] px-3 py-1 rounded-full border border-[#F2A900]/30">
          Legal & Compliance
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#4A2C17] mt-2">
          {titles[type]}
        </h1>
        <p className="text-xs text-[#8C7A6B] mt-1">
          Last updated: November 2026 · Thanima Homely Foods LLP
        </p>
      </div>

      <div className="bg-white border border-[#EFE8D8] rounded-3xl p-6 sm:p-8 shadow-xs text-xs text-slate-700 space-y-5 leading-relaxed">
        {type === 'privacy' && (
          <>
            <h3 className="font-bold text-sm text-[#4A2C17]">1. Information We Collect</h3>
            <p>
              Thanima collects customer name, shipping address, contact phone number, and email address solely for order processing, logistics delivery, and transactional notification updates.
            </p>
            <h3 className="font-bold text-sm text-[#4A2C17]">2. Payment Security</h3>
            <p>
              We comply with RBI standards. We never store complete credit/debit card numbers or CVV codes on our servers. All digital transactions are tokenized through accredited SSL-secured payment gateways.
            </p>
            <h3 className="font-bold text-sm text-[#4A2C17]">3. Data Protection</h3>
            <p>
              Your contact details are strictly confidential. We never sell, rent, or lease your personal data to third-party marketing brokers.
            </p>
          </>
        )}

        {type === 'terms' && (
          <>
            <h3 className="font-bold text-sm text-[#4A2C17]">1. Authenticity Commitment</h3>
            <p>
              All products listed on Thanima are handmade by registered cottage kitchens and collective self-help groups in Kerala following authentic culinary practices and food safety hygiene standards.
            </p>
            <h3 className="font-bold text-sm text-[#4A2C17]">2. Order Acceptance</h3>
            <p>
              Orders are subject to batch freshness and seasonal availability (especially for seasonal items like Varikka jackfruit chips or tender kannimanga mangoes).
            </p>
            <h3 className="font-bold text-sm text-[#4A2C17]">3. Pricing & Currency</h3>
            <p>
              All prices are quoted in Indian National Rupees (INR) and are inclusive of applicable GST taxes.
            </p>
          </>
        )}

        {type === 'shipping' && (
          <>
            <h3 className="font-bold text-sm text-[#4A2C17]">1. Serviceable Locations</h3>
            <p>
              Thanima delivers to over 26,000 PIN codes across all states and union territories in India. Express delivery is available within Kerala in 24 to 48 hours.
            </p>
            <h3 className="font-bold text-sm text-[#4A2C17]">2. Shipping Charges</h3>
            <p>
              Orders with total cart value above ₹499 qualify for 100% FREE door-to-door delivery. A flat fee of ₹49 applies on orders below ₹499.
            </p>
            <h3 className="font-bold text-sm text-[#4A2C17]">3. Packaging Integrity</h3>
            <p>
              Every delicacy is sealed in high-barrier nitrogen-flushed or vacuum-sealed food-grade pouches to prevent moisture absorption and oil rancidity during transit.
            </p>
          </>
        )}

        {type === 'refund' && (
          <>
            <h3 className="font-bold text-sm text-[#4A2C17]">1. Cancellation Policy</h3>
            <p>
              You can cancel your order free of cost at any time before it enters the "Packed" or "Shipped" status directly from the "My Orders" dashboard.
            </p>
            <h3 className="font-bold text-sm text-[#4A2C17]">2. Damaged or Quality Issues</h3>
            <p>
              In the unlikely event that your parcel arrives damaged or unsealed, notify us on WhatsApp (+91 98470 00123) within 24 hours of delivery with a photo. We issue an immediate replacement or full refund to the original payment source.
            </p>
            <h3 className="font-bold text-sm text-[#4A2C17]">3. Refund Timelines</h3>
            <p>
              Online payment refunds are reversed back to your source account or UPI ID within 2 to 4 banking working days.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
