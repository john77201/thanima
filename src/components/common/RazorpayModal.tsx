import React, { useState } from 'react';
import {
  CreditCard,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  X,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { formatINR } from '../../utils/pricing';
import {
  detectCardBrand,
  isValidCardExpiry,
  isValidLuhn,
  isValidUPI,
} from '../../utils/validation';

export interface PaymentSuccessData {
  paymentId: string;
  method: 'upi' | 'gpay' | 'phonepe' | 'card';
  cardLast4?: string;
  cardBrand?: string;
  upiId?: string;
}

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderNumber: string;
  onSuccess: (data: PaymentSuccessData) => void;
  onFailure: (errorMessage: string) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  amount,
  customerName,
  customerEmail,
  customerPhone,
  orderNumber,
  onSuccess,
  onFailure,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'gpay' | 'phonepe'>('upi');
  const [step, setStep] = useState<'input' | 'otp' | 'processing' | 'failed'>('input');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(customerName || '');

  // UPI fields
  const [upiId, setUpiId] = useState('');

  // OTP field
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const cardBrand = detectCardBrand(cardNumber);

  const handleStartPayment = (forcedFailure = false) => {
    setErrorMessage('');

    if (forcedFailure) {
      setStep('processing');
      setTimeout(() => {
        setStep('failed');
        setErrorMessage('Simulated Bank Gateway Error: Transaction declined by issuing bank (ERR_TEST_FAIL).');
      }, 1200);
      return;
    }

    if (selectedMethod === 'upi') {
      if (!isValidUPI(upiId)) {
        setErrorMessage('Please enter a valid UPI ID (e.g., yourname@oksbi, name@upi)');
        return;
      }
      setStep('otp');
    } else if (selectedMethod === 'card') {
      if (!isValidLuhn(cardNumber)) {
        setErrorMessage('Please enter a valid card number passing Luhn algorithm check (e.g. 4532 0151 1283 0366)');
        return;
      }
      if (!isValidCardExpiry(cardExpiry)) {
        setErrorMessage('Please enter a valid future expiry date (MM/YY)');
        return;
      }
      if (cardCvv.length < 3) {
        setErrorMessage('Please enter a 3 or 4 digit CVV');
        return;
      }
      setStep('otp');
    } else if (selectedMethod === 'gpay' || selectedMethod === 'phonepe') {
      setStep('otp');
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length < 4 && otp !== '123456') {
      setErrorMessage('Please enter any 6-digit OTP (e.g. 123456)');
      return;
    }

    setStep('processing');
    setTimeout(() => {
      const generatedPayId = `pay_sim_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString().slice(-4)}`;
      onSuccess({
        paymentId: generatedPayId,
        method: selectedMethod,
        cardLast4: selectedMethod === 'card' ? cardNumber.replace(/\D/g, '').slice(-4) : undefined,
        cardBrand: selectedMethod === 'card' ? cardBrand : undefined,
        upiId: selectedMethod === 'upi' ? upiId : `${selectedMethod}@simulated`,
      });
      onClose();
    }, 1500);
  };

  const formatCardInput = (val: string) => {
    const raw = val.replace(/\D/g, '').substring(0, 16);
    const parts = raw.match(/[\s\S]{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  const formatExpiryInput = (val: string) => {
    const raw = val.replace(/\D/g, '').substring(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.substring(0, 2)}/${raw.substring(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="razorpay-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Razorpay-style Header */}
        <div className="bg-[#0C2340] text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 font-malayalam font-bold text-lg text-[#F2A900]">
              ത
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="razorpay-title" className="font-semibold text-base tracking-wide">
                  Thanima Homely Foods
                </h3>
                <span className="text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded-xs">
                  Sandbox
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">Order #{orderNumber}</p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Close Payment Gateway"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-right mt-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Amount Payable</span>
              <span className="text-xl font-bold text-[#F2A900] tabular-nums">
                {formatINR(amount, true)}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Contact strip */}
        <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <span className="truncate max-w-[200px]">{customerEmail || customerName}</span>
          <span className="font-mono text-slate-500">{customerPhone}</span>
        </div>

        {/* Gateway Body */}
        <div className="p-5">
          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <RefreshCw className="w-12 h-12 text-[#1F4D2B] animate-spin mb-4" />
              <h4 className="font-semibold text-slate-800 text-base">Processing Secure Payment...</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Connecting to payment simulation gateway. Please do not refresh or hit the back button.
              </p>
            </div>
          )}

          {step === 'failed' && (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg">Payment Failed</h4>
              <p className="text-xs text-red-600 mt-2 max-w-xs px-2">{errorMessage}</p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setStep('input');
                    setErrorMessage('');
                  }}
                  className="px-4 py-2 bg-[#1F4D2B] text-white text-xs font-semibold rounded-lg hover:bg-[#14381F] transition-colors"
                >
                  Retry Payment
                </button>
                <button
                  onClick={() => {
                    onFailure(errorMessage);
                    onClose();
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {step === 'otp' && (
            <div className="py-4">
              <div className="text-center mb-5">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-slate-900">Enter OTP to Authorize</h4>
                <p className="text-xs text-slate-500 mt-1">
                  A test verification code was dispatched for ₹{amount}
                </p>
                <span className="inline-block mt-1 text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-sm font-mono">
                  Demo OTP: 123456 (or any 6 digits)
                </span>
              </div>

              {errorMessage && (
                <div className="mb-4 p-2.5 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="mb-5">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4D2B]"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleVerifyOtp}
                  className="flex-1 py-2.5 bg-[#1F4D2B] text-white text-xs font-bold rounded-lg hover:bg-[#14381F] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Confirm & Pay {formatINR(amount)}
                </button>
                <button
                  onClick={() => setStep('input')}
                  className="px-3 py-2.5 border border-slate-300 text-slate-600 text-xs rounded-lg hover:bg-slate-50"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {step === 'input' && (
            <div>
              {/* Method Tabs */}
              <div className="grid grid-cols-4 gap-1.5 mb-5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`py-2 px-1 text-xs font-medium rounded-lg flex flex-col items-center gap-1 transition-all ${
                    selectedMethod === 'upi'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span>UPI ID</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('gpay')}
                  className={`py-2 px-1 text-xs font-medium rounded-lg flex flex-col items-center gap-1 transition-all ${
                    selectedMethod === 'gpay'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="font-bold text-xs text-blue-600">GPay</span>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('phonepe')}
                  className={`py-2 px-1 text-xs font-medium rounded-lg flex flex-col items-center gap-1 transition-all ${
                    selectedMethod === 'phonepe'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="font-bold text-xs text-purple-600">Pe</span>
                  <span>PhonePe</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`py-2 px-1 text-xs font-medium rounded-lg flex flex-col items-center gap-1 transition-all ${
                    selectedMethod === 'card'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-amber-700" />
                  <span>Cards</span>
                </button>
              </div>

              {errorMessage && (
                <div className="mb-4 p-2.5 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* UPI Tab */}
              {selectedMethod === 'upi' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Enter UPI Virtual Payment Address (VPA)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. mobile@upi, name@oksbi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4D2B]"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Instant payment notification on your UPI app</span>
                  </div>
                </div>
              )}

              {/* Google Pay Tab */}
              {selectedMethod === 'gpay' && (
                <div className="text-center py-4 bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center font-bold text-lg mb-2">
                    G
                  </div>
                  <h5 className="font-semibold text-slate-800 text-sm">Pay using Google Pay</h5>
                  <p className="text-xs text-slate-500 mt-1">
                    Simulates instant redirection to your Google Pay app for {formatINR(amount)}.
                  </p>
                </div>
              )}

              {/* PhonePe Tab */}
              {selectedMethod === 'phonepe' && (
                <div className="text-center py-4 bg-purple-50/50 rounded-xl p-4 border border-purple-100">
                  <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 mx-auto flex items-center justify-center font-bold text-lg mb-2">
                    पे
                  </div>
                  <h5 className="font-semibold text-purple-900 text-sm">Pay using PhonePe</h5>
                  <p className="text-xs text-slate-500 mt-1">
                    Simulates approval on your PhonePe mobile wallet.
                  </p>
                </div>
              )}

              {/* Card Tab */}
              {selectedMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-slate-700">Card Number</label>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">
                        {cardBrand !== 'Unknown' ? cardBrand : 'Visa / MC / RuPay'}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="4532 0151 1283 0366"
                        value={cardNumber}
                        onChange={(e) => formatCardInput(e.target.value)}
                        className="w-full pl-3 pr-10 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4D2B]"
                      />
                      <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => formatExpiryInput(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4D2B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4D2B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Name on Card</label>
                    <input
                      type="text"
                      placeholder="CARDHOLDER NAME"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 text-sm uppercase border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4D2B]"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                <button
                  type="button"
                  onClick={() => handleStartPayment(false)}
                  className="w-full py-3 bg-[#1F4D2B] hover:bg-[#14381F] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Lock className="w-4 h-4 text-[#F2A900]" />
                  <span>Pay {formatINR(amount, true)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Section 7 rule: Simulate Failure test button */}
                <button
                  type="button"
                  onClick={() => handleStartPayment(true)}
                  className="w-full py-1.5 text-[11px] text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg font-medium transition-colors"
                >
                  🧪 Simulate Payment Failure (Test Retry Flow)
                </button>
              </div>

              {/* Security Footer */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted Sandbox</span>
                </div>
                <span>Secured by Razorpay Sim</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
