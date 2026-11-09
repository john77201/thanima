import React, { useState } from 'react';
import { Search, Package, AlertCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { OrderTrackingModal } from '../orders/OrderTrackingModal';

export const TrackOrderView: React.FC = () => {
  const { orders, reorder } = useStore();

  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setMatchedOrder(null);

    const cleanOrderNum = orderNumber.trim().toUpperCase();
    const cleanPhone = phone.trim().replace(/\D/g, '');

    const found = orders.find(
      (o) =>
        o.id.toUpperCase() === cleanOrderNum &&
        (cleanPhone ? o.customerPhone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10)) : true)
    );

    if (found) {
      setMatchedOrder(found);
    } else {
      setErrorMsg(
        `No order found matching #${cleanOrderNum}. Please verify your order number format (e.g. THN-20261105-8492) and phone number.`
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D2B] bg-[#FFF8E7] px-3 py-1 rounded-full border border-[#F2A900]/30">
          Live Shipment Status
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#4A2C17]">
          Track Your Thanima Order
        </h1>
        <p className="text-xs text-[#8C7A6B]">
          Enter your order reference number and contact number to view live kitchen and courier milestones.
        </p>
      </div>

      <div className="bg-white border border-[#EFE8D8] rounded-3xl p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleTrackSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Order Number *
            </label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. THN-20261105-8492"
              className="w-full text-xs font-mono uppercase px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1F4D2B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Registered Phone Number (Optional verification)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9847123456"
              className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1F4D2B]"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#1F4D2B] hover:bg-[#14381F] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Find & Track Order</span>
          </button>
        </form>

        {/* Quick sample prompt for user ease */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <span className="text-[11px] text-slate-400 block mb-1.5">Want to try a demo track?</span>
          <button
            type="button"
            onClick={() => {
              setOrderNumber('THN-20261105-8492');
              setPhone('9847123456');
            }}
            className="text-xs font-semibold text-[#1F4D2B] hover:underline"
          >
            Use Sample Order: THN-20261105-8492
          </button>
        </div>
      </div>

      {matchedOrder && (
        <OrderTrackingModal
          order={matchedOrder}
          onClose={() => setMatchedOrder(null)}
          onReorder={(id) => reorder(id)}
        />
      )}
    </div>
  );
};
