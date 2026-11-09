import React, { useState } from 'react';
import {
  Package,
  Calendar,
  CreditCard,
  ChevronRight,
  RotateCcw,
  Printer,
  Truck,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { Order } from '../../types';
import { formatINR } from '../../utils/pricing';
import { canCancelOrder } from '../../utils/order';
import { useStore } from '../../context/StoreContext';
import { OrderTrackingModal } from './OrderTrackingModal';

interface MyOrdersViewProps {
  onContinueShopping: () => void;
}

export const MyOrdersView: React.FC<MyOrdersViewProps> = ({ onContinueShopping }) => {
  const { orders, reorder, cancelOrder } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Packed':
      case 'Confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Cancelled':
      case 'Returned':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#4A2C17]">My Orders & History</h2>
          <p className="text-xs text-[#8C7A6B] mt-0.5">
            Track parcels, download invoices, and reorder your favorite delicacies.
          </p>
        </div>
        <button
          onClick={onContinueShopping}
          className="text-xs font-semibold text-[#1F4D2B] hover:underline"
        >
          Continue Shopping →
        </button>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const cancellable = canCancelOrder(order.orderStatus);

            return (
              <div
                key={order.id}
                className="bg-white border border-[#EFE8D8] rounded-3xl p-5 shadow-xs hover:border-[#1F4D2B]/30 transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-[#4A2C17] text-sm font-mono">
                      {order.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Payment: <strong className="uppercase">{order.paymentStatus}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                  </div>
                </div>

                {/* Items preview strip */}
                <div className="divide-y divide-slate-50">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FFF3D6] flex items-center justify-center text-lg shrink-0">
                          🥥
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{item.productName}</p>
                          <p className="font-malayalam text-[10px] text-[#1F4D2B]">
                            {item.malayalamName} · {item.variantWeight} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 tabular-nums">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Bar: Total and Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px]">Total Paid:</span>
                    <span className="text-sm font-bold text-[#1F4D2B] ml-1.5 tabular-nums">
                      {formatINR(order.total)}
                    </span>
                    {order.trackingId && (
                      <span className="ml-3 text-[11px] text-slate-500">
                        Tracking: <strong className="font-mono text-slate-700">{order.trackingId}</strong>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {cancellable && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      onClick={() => reorder(order.id)}
                      className="px-3 py-1.5 border border-[#1F4D2B] text-[#1F4D2B] hover:bg-[#1F4D2B] hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reorder</span>
                    </button>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-1.5 bg-[#1F4D2B] hover:bg-[#14381F] text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Track & Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-white border border-[#EFE8D8] rounded-3xl p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FFF8E7] flex items-center justify-center text-3xl mx-auto">
            📦
          </div>
          <h3 className="font-bold text-base text-[#4A2C17]">No orders yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once you order your favorite Kerala snacks or pickles, track them live right here.
          </p>
          <button
            onClick={onContinueShopping}
            className="px-5 py-2.5 bg-[#1F4D2B] text-white text-xs font-bold rounded-xl hover:bg-[#14381F]"
          >
            Explore Traditional Foods
          </button>
        </div>
      )}

      {/* Tracking & Invoice Modal */}
      {selectedOrder && (
        <OrderTrackingModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onReorder={(id) => reorder(id)}
        />
      )}
    </div>
  );
};
