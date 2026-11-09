import React from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  Printer,
  RotateCcw,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { formatINR } from '../../utils/pricing';
import { canCancelOrder, ORDER_STATUS_SEQUENCE } from '../../utils/order';
import { useStore } from '../../context/StoreContext';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
  onReorder: (orderId: string) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  onClose,
  onReorder,
}) => {
  const { cancelOrder } = useStore();

  if (!order) return null;

  const currentStepIdx = ORDER_STATUS_SEQUENCE.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';
  const cancellable = canCancelOrder(order.orderStatus);

  const handleCancel = () => {
    if (confirm(`Are you sure you want to cancel Order #${order.id}?`)) {
      cancelOrder(order.id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-tracking-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-[#EFE8D8] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#EFE8D8] bg-[#FFFDF7] flex items-center justify-between no-print">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F4D2B]">
              Order Confirmation & Tracking
            </span>
            <h2 id="order-tracking-title" className="text-base font-bold text-[#4A2C17]">{order.id}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Print Tax Invoice"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt & Timeline */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Success Banner */}
          {!isCancelled ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-emerald-950 text-sm">
                  Order Successfully Placed!
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Thank you, {order.customerName}. Your authentic homemade foods are being prepared.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <h3 className="font-bold text-red-950 text-sm">Order Cancelled</h3>
                <p className="text-xs text-red-700 mt-0.5">
                  This order was cancelled. Payment status: {order.paymentStatus}.
                </p>
              </div>
            </div>
          )}

          {/* Visual Tracking Milestones Timeline */}
          {!isCancelled && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Delivery Tracking Timeline
                </h4>
                {order.estimatedDeliveryDate && (
                  <span className="text-xs text-[#1F4D2B] font-semibold">
                    Expected: {order.estimatedDeliveryDate}
                  </span>
                )}
              </div>

              {/* Progress Milestones */}
              <div className="relative flex items-center justify-between my-6 px-2">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
                <div
                  className="absolute top-1/2 left-0 h-1 bg-[#1F4D2B] -translate-y-1/2 z-0 transition-all duration-500"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, (currentStepIdx / (ORDER_STATUS_SEQUENCE.length - 1)) * 100)
                    )}%`,
                  }}
                />

                {ORDER_STATUS_SEQUENCE.map((status, idx) => {
                  const isDone = currentStepIdx >= idx;
                  const isCurrent = currentStepIdx === idx;
                  return (
                    <div
                      key={status}
                      className="relative z-10 flex flex-col items-center group"
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isDone
                            ? 'bg-[#1F4D2B] text-white ring-4 ring-emerald-100'
                            : 'bg-white border-2 border-slate-300 text-slate-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] mt-1.5 whitespace-nowrap font-medium text-center ${
                          isCurrent
                            ? 'text-[#1F4D2B] font-bold'
                            : isDone
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Courier info if available */}
              {order.courierName && (
                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#1F4D2B]" />
                    <span>Courier Partner: <strong>{order.courierName}</strong></span>
                  </div>
                  {order.trackingId && (
                    <div className="flex items-center gap-1.5 font-mono text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      <span>Waybill: {order.trackingId}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Status History Logs */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Status History Logs
            </h4>
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs bg-white">
              {order.statusHistory.map((hist, i) => (
                <div key={i} className="p-2.5 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-semibold text-slate-900">{hist.status}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{hist.note}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">
                    {hist.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tax Invoice Items Card */}
          <div className="border border-[#EFE8D8] rounded-2xl overflow-hidden bg-white shadow-xs">
            <div className="p-3 bg-[#FFFDF7] border-b border-[#EFE8D8] flex items-center justify-between text-xs">
              <span className="font-bold text-[#4A2C17]">Itemized Summary</span>
              <span className="text-slate-500 text-[11px]">Date: {new Date(order.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="divide-y divide-slate-100 p-3 text-xs space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between pt-2">
                  <div>
                    <p className="font-semibold text-[#4A2C17]">{item.productName}</p>
                    <p className="font-malayalam text-[10px] text-[#1F4D2B]">
                      {item.malayalamName} · {item.variantWeight} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-[#1F4D2B] tabular-nums">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financials */}
            <div className="p-4 bg-slate-50 border-t border-[#EFE8D8] space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 tabular-nums">{formatINR(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount ({order.couponCode})</span>
                  <span className="font-semibold tabular-nums">- {formatINR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-semibold tabular-nums">
                  {order.deliveryCharge === 0 ? 'FREE' : formatINR(order.deliveryCharge)}
                </span>
              </div>
              {order.codFee > 0 && (
                <div className="flex justify-between">
                  <span>COD Handling Fee</span>
                  <span className="font-semibold tabular-nums">{formatINR(order.codFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-[#1F4D2B] pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="tabular-nums">{formatINR(order.total)}</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                <span>
                  Payment: <strong className="uppercase">{order.paymentMethod}</strong> ({order.paymentStatus})
                </span>
                {order.paymentId && <span className="font-mono">Ref: {order.paymentId}</span>}
              </div>
            </div>
          </div>

          {/* Delivery Address & Note */}
          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
            <p className="font-bold text-slate-800 mb-0.5">Shipping Destination:</p>
            <p>
              {order.shippingAddress.fullName} ({order.shippingAddress.phone})
            </p>
            <p>
              {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.district}, {order.shippingAddress.state} -{' '}
              {order.shippingAddress.pincode}
            </p>
            {order.notes && (
              <p className="mt-1 text-[11px] text-slate-500 italic">Notes: {order.notes}</p>
            )}
          </div>
        </div>

        {/* Modal Footer actions */}
        <div className="p-4 border-t border-[#EFE8D8] bg-[#FFFDF7] flex items-center justify-between shrink-0 no-print">
          <div>
            {cancellable && (
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Cancel Order
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onReorder(order.id);
                onClose();
              }}
              className="px-4 py-2 border border-[#1F4D2B] text-[#1F4D2B] hover:bg-[#1F4D2B] hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reorder Items</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#1F4D2B] text-white rounded-xl text-xs font-semibold hover:bg-[#14381F] cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
