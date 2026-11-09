import React, { useState } from 'react';
import {
  X,
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Banknote,
  Plus,
} from 'lucide-react';
import { Address, Order, PaymentMethod, Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { getProductImageUrl } from '../../data/productImages';
import {
  calculateCartSubtotal,
  calculateCouponDiscount,
  calculateDeliveryFee,
  calculateOrderTotal,
  formatINR,
  STANDARD_COD_FEE,
} from '../../utils/pricing';
import { isKeralaPincode, isValidIndianPhone, isValidPincode } from '../../utils/validation';
import { RazorpayModal, PaymentSuccessData } from '../common/RazorpayModal';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
  directBuyItem?: { product: Product; variantId: string; quantity: number } | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
  directBuyItem,
}) => {
  const {
    cart,
    products,
    currentUser,
    activeCoupon,
    placeOrder,
    addAddress,
  } = useStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');

  // Address states
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    currentUser?.addresses.find((a) => a.isDefault)?.id ||
      currentUser?.addresses[0]?.id ||
      'new'
  );

  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('Kochi');
  const [district, setDistrict] = useState('Ernakulam');
  const [state, setState] = useState('Kerala');
  const [pincode, setPincode] = useState('682024');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');

  // Order notes
  const [orderNotes, setOrderNotes] = useState('');

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');

  // Razorpay Gateway Modal state
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [pendingOrderNumber, setPendingOrderNumber] = useState('');
  const [paymentError, setPaymentError] = useState('');

  if (!isOpen) return null;

  // Resolve items either from direct buy or standard cart
  const checkoutItems = directBuyItem
    ? [
        {
          productId: directBuyItem.product.id,
          variantId: directBuyItem.variantId,
          quantity: directBuyItem.quantity,
        },
      ]
    : cart;

  const subtotal = calculateCartSubtotal(checkoutItems, products);
  const discount = calculateCouponDiscount(subtotal, activeCoupon);
  const deliveryFee = calculateDeliveryFee(subtotal, activeCoupon);
  const isCod = paymentMethod === 'cod';
  const total = calculateOrderTotal(subtotal, discount, deliveryFee, isCod);

  // Selected or active address resolution
  const activeAddress: Address =
    selectedAddressId !== 'new' &&
    currentUser?.addresses.find((a) => a.id === selectedAddressId)
      ? currentUser.addresses.find((a) => a.id === selectedAddressId)!
      : {
          id: 'temp-addr',
          fullName: customerName,
          phone: customerPhone,
          addressLine1,
          addressLine2,
          city,
          district,
          state,
          pincode,
          type: addressType,
        };

  const handleNextFromAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      alert('Please fill out all contact fields.');
      return;
    }
    if (!isValidIndianPhone(customerPhone)) {
      alert('Please enter a valid 10-digit Indian phone number.');
      return;
    }
    if (selectedAddressId === 'new') {
      if (!addressLine1.trim() || !city.trim() || !pincode.trim()) {
        alert('Please fill in complete address details.');
        return;
      }
      if (!isValidPincode(pincode)) {
        alert('Please enter a valid 6-digit postal code.');
        return;
      }
      // Save address if user is logged in
      if (currentUser) {
        addAddress({
          fullName: customerName,
          phone: customerPhone,
          addressLine1,
          addressLine2,
          city,
          district,
          state,
          pincode,
          type: addressType,
          isDefault: currentUser.addresses.length === 0,
        });
      }
    }
    setCurrentStep(2);
  };

  const handleInitiateOrder = () => {
    const formattedItems = checkoutItems.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const variant =
        product.variants.find((v) => v.id === item.variantId) || product.variants[0];
      return {
        productId: product.id,
        productName: product.name,
        malayalamName: product.malayalamName,
        variantWeight: variant.weight,
        price: variant.price,
        quantity: item.quantity,
        image: product.images[0] || 'banana_chips',
      };
    });

    if (paymentMethod === 'cod') {
      // Direct Cash on Delivery confirmation
      const created = placeOrder({
        userId: currentUser?.id,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: activeAddress,
        items: formattedItems,
        subtotal,
        discount,
        couponCode: activeCoupon?.code,
        deliveryCharge: deliveryFee,
        codFee: STANDARD_COD_FEE,
        total,
        paymentMethod: 'cod',
        paymentStatus: 'COD-Pending',
        orderStatus: 'Confirmed',
        notes: orderNotes,
        courierName: 'Kerala Express Logistics',
        trackingId: `THN-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
        estimatedDeliveryDate: isKeralaPincode(activeAddress.pincode)
          ? 'Within 2 days'
          : '3–5 days',
      });
      onOrderSuccess(created);
      onClose();
    } else {
      // Launch Razorpay-style simulated gateway modal
      setPendingOrderNumber(`THN-TEMP-${Math.floor(1000 + Math.random() * 9000)}`);
      setIsRazorpayOpen(true);
    }
  };

  const handleOnlinePaymentSuccess = (paymentData: PaymentSuccessData) => {
    const formattedItems = checkoutItems.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const variant =
        product.variants.find((v) => v.id === item.variantId) || product.variants[0];
      return {
        productId: product.id,
        productName: product.name,
        malayalamName: product.malayalamName,
        variantWeight: variant.weight,
        price: variant.price,
        quantity: item.quantity,
        image: product.images[0] || 'banana_chips',
      };
    });

    const created = placeOrder({
      userId: currentUser?.id,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress: activeAddress,
      items: formattedItems,
      subtotal,
      discount,
      couponCode: activeCoupon?.code,
      deliveryCharge: deliveryFee,
      codFee: 0,
      total,
      paymentMethod,
      paymentStatus: 'Paid',
      paymentId: paymentData.paymentId,
      orderStatus: 'Confirmed',
      notes: orderNotes,
      courierName: 'India Post Speed / DTDC',
      trackingId: `THN-ONL-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDeliveryDate: isKeralaPincode(activeAddress.pincode)
        ? 'Within 2 days'
        : '3–4 days',
    });

    setIsRazorpayOpen(false);
    onOrderSuccess(created);
    onClose();
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      >
        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-[#EFE8D8] flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="p-4 border-b border-[#EFE8D8] bg-[#FFFDF7] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-malayalam font-bold text-lg text-[#1F4D2B]">തനിമ</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#4A2C17]">
                Secure Checkout
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div
              className={`flex items-center gap-1.5 ${
                currentStep >= 1 ? 'text-[#1F4D2B] font-bold' : 'text-slate-400'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#1F4D2B] text-white text-[10px] flex items-center justify-center font-bold">
                1
              </span>
              <span>Address</span>
            </div>
            <div className="w-8 h-px bg-slate-300" />
            <div
              className={`flex items-center gap-1.5 ${
                currentStep >= 2 ? 'text-[#1F4D2B] font-bold' : 'text-slate-400'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  currentStep >= 2 ? 'bg-[#1F4D2B] text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                2
              </span>
              <span>Delivery</span>
            </div>
            <div className="w-8 h-px bg-slate-300" />
            <div
              className={`flex items-center gap-1.5 ${
                currentStep >= 3 ? 'text-[#1F4D2B] font-bold' : 'text-slate-400'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  currentStep >= 3 ? 'bg-[#1F4D2B] text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                3
              </span>
              <span>Payment</span>
            </div>
            <div className="w-8 h-px bg-slate-300" />
            <div
              className={`flex items-center gap-1.5 ${
                currentStep >= 4 ? 'text-[#1F4D2B] font-bold' : 'text-slate-400'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  currentStep >= 4 ? 'bg-[#1F4D2B] text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                4
              </span>
              <span>Review</span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* STEP 1: Address & Customer Details */}
            {currentStep === 1 && (
              <form onSubmit={handleNextFromAddress} className="space-y-4">
                <h3 id="checkout-modal-title" className="text-sm font-bold text-[#4A2C17] uppercase tracking-wider">
                  Contact & Shipping Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Suresh Kumar"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="suresh@example.com"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone (10 digits)</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="9847123456"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Saved addresses selector */}
                {currentUser && currentUser.addresses.length > 0 && (
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Choose Delivery Address
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      {currentUser.addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            selectedAddressId === addr.id
                              ? 'border-[#1F4D2B] bg-[#FFF8E7]'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-slate-800">
                            <span>{addr.fullName}</span>
                            <span className="text-[10px] text-slate-500 uppercase">{addr.type}</span>
                          </div>
                          <p className="text-slate-600 mt-1 line-clamp-2">
                            {addr.addressLine1}, {addr.city}, {addr.pincode}
                          </p>
                        </div>
                      ))}
                      <div
                        onClick={() => setSelectedAddressId('new')}
                        className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-center gap-1.5 font-medium ${
                          selectedAddressId === 'new'
                            ? 'border-[#1F4D2B] bg-[#FFF8E7] text-[#1F4D2B]'
                            : 'border-dashed border-slate-300 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Deliver to a New Address</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* New address fields */}
                {selectedAddressId === 'new' && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-slate-800">New Address Details</h4>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Street Address / House Name / Landmark
                      </label>
                      <input
                        type="text"
                        required
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="House No, Apartment, Street"
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">City / Town</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">District</label>
                        <input
                          type="text"
                          required
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">State</label>
                        <input
                          type="text"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Pincode</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                          placeholder="682024"
                          className="w-full text-xs px-3 py-2 bg-white font-mono border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1F4D2B] text-white text-xs font-bold rounded-xl hover:bg-[#14381F] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Proceed to Delivery</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Delivery Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#4A2C17] uppercase tracking-wider">
                  Select Delivery Mode
                </h3>

                <div className="p-4 bg-[#FFF8E7] border border-[#F2A900]/40 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1F4D2B] text-[#F2A900] flex items-center justify-center">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#1F4D2B]">
                        {isKeralaPincode(activeAddress.pincode)
                          ? 'Kerala Express Homely Courier (1–2 Days)'
                          : 'All-India Express Courier (3–5 Days)'}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Delivered directly from our Kochi hub to PIN {activeAddress.pincode}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-[#1F4D2B]">
                    {deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Special Delivery Instructions / Gate Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Leave package with neighbor or call before delivery"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 border border-slate-300 text-slate-600 text-xs rounded-xl hover:bg-slate-50 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-2.5 bg-[#1F4D2B] text-white text-xs font-bold rounded-xl hover:bg-[#14381F] flex items-center gap-1.5"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Method Selection */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#4A2C17] uppercase tracking-wider">
                  Choose Payment Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* UPI */}
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 rounded-2xl border text-xs cursor-pointer flex items-center gap-3 transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-[#1F4D2B] bg-[#FFF8E7] shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      UPI
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Instant UPI</h4>
                      <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </div>

                  {/* Cards */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-2xl border text-xs cursor-pointer flex items-center gap-3 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#1F4D2B] bg-[#FFF8E7] shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Credit / Debit Card</h4>
                      <p className="text-[11px] text-slate-500">Visa, Mastercard, RuPay</p>
                    </div>
                  </div>

                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-2xl border text-xs cursor-pointer flex items-center gap-3 transition-all sm:col-span-2 ${
                      paymentMethod === 'cod'
                        ? 'border-[#1F4D2B] bg-[#FFF8E7] shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900">Cash on Delivery (COD)</h4>
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-sm">
                          +₹30 Convenience Fee
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Pay in cash or UPI to the courier upon delivery at your doorstep.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 border border-slate-300 text-slate-600 text-xs rounded-xl hover:bg-slate-50 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-2.5 bg-[#1F4D2B] text-white text-xs font-bold rounded-xl hover:bg-[#14381F] flex items-center gap-1.5"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review & Place Order */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#4A2C17] uppercase tracking-wider">
                  Review & Confirm Order
                </h3>

                {/* Items Summary */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                  {checkoutItems.map((item) => {
                    const product = products.find((p) => p.id === item.productId)!;
                    const variant =
                      product.variants.find((v) => v.id === item.variantId) ||
                      product.variants[0];
                    return (
                      <div
                        key={`${item.productId}-${item.variantId}`}
                        className="p-3 bg-white flex items-center justify-between text-xs gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={getProductImageUrl(product.id, product.images[0], product.categoryIds[0])}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#EFE8D8]"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">{product.name}</p>
                            <span className="text-[11px] text-slate-500">
                              {variant.weight} × {item.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-[#1F4D2B] tabular-nums shrink-0">
                          {formatINR(variant.price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                <div className="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800 tabular-nums">{formatINR(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount ({activeCoupon?.code})</span>
                      <span className="font-semibold tabular-nums">- {formatINR(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Charge</span>
                    <span className="font-semibold tabular-nums">
                      {deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}
                    </span>
                  </div>
                  {isCod && (
                    <div className="flex justify-between text-amber-800">
                      <span>Cash on Delivery Handling Fee</span>
                      <span className="font-semibold tabular-nums">{formatINR(STANDARD_COD_FEE)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-extrabold text-[#1F4D2B] pt-2 border-t border-slate-200">
                    <span>Total Amount Payable</span>
                    <span className="tabular-nums">{formatINR(total)}</span>
                  </div>
                </div>

                {/* Shipping to Summary */}
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                  <p className="font-bold text-slate-800 mb-0.5">Shipping to:</p>
                  <p>
                    {activeAddress.fullName} · {activeAddress.addressLine1}, {activeAddress.city},{' '}
                    {activeAddress.state} - {activeAddress.pincode}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Payment Method:{' '}
                    <strong className="uppercase text-slate-700">{paymentMethod}</strong>
                  </p>
                </div>

                {paymentError && (
                  <p className="text-xs text-red-600 font-medium">{paymentError}</p>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 border border-slate-300 text-slate-600 text-xs rounded-xl hover:bg-slate-50 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleInitiateOrder}
                    className="px-8 py-3 bg-[#1F4D2B] hover:bg-[#14381F] text-white text-sm font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-[#F2A900]" />
                    <span>
                      {paymentMethod === 'cod' ? 'Confirm Order' : `Pay ${formatINR(total)} via Gateway`}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simulated Razorpay Modal */}
      {isRazorpayOpen && (
        <RazorpayModal
          isOpen={isRazorpayOpen}
          onClose={() => setIsRazorpayOpen(false)}
          amount={total}
          customerName={customerName}
          customerEmail={customerEmail}
          customerPhone={customerPhone}
          orderNumber={pendingOrderNumber}
          onSuccess={handleOnlinePaymentSuccess}
          onFailure={(err) => setPaymentError(err)}
        />
      )}
    </>
  );
};
