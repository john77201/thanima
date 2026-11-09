import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { login, registerUser } = useStore();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [resetTokenInfo, setResetTokenInfo] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0 to 4
  };

  const passwordScore = getPasswordStrength(password);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email) {
      setErrorMsg('Please enter your email.');
      return;
    }
    const ok = login(email);
    if (ok) {
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name || !email || !phone || !password) {
      setErrorMsg('Please fill in all registration fields.');
      return;
    }
    registerUser(name, email, phone);
    if (onSuccess) onSuccess();
    onClose();
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const fakeToken = Math.random().toString(36).substring(2, 12);
    setResetTokenInfo(
      `Password reset token generated: ${fakeToken}. In production with SMTP configured, a link will be sent to ${email}. Dev reset link: https://thanima.in/reset-password?token=${fakeToken}`
    );
  };

  const handleQuickDemoCustomer = () => {
    login('gopan.nair@example.com');
    if (onSuccess) onSuccess();
    onClose();
  };

  const handleQuickDemoAdmin = () => {
    login('admin@thanima.in', 'super_admin');
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#EFE8D8]">
        {/* Top Header */}
        <div className="bg-[#1F4D2B] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-malayalam font-bold text-xl text-[#F2A900]">തനിമ</span>
            <div className="leading-tight">
              <h3 id="auth-modal-title" className="font-bold text-sm tracking-wide">
                {tab === 'login'
                  ? 'Sign In to Thanima'
                  : tab === 'register'
                  ? 'Create Your Account'
                  : 'Reset Password'}
              </h3>
              <p className="text-[10px] text-white/70">Pure. Homemade. Kerala.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#EFE8D8] bg-[#FFFDF7] text-xs font-semibold">
          <button
            onClick={() => {
              setTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center transition-colors ${
              tab === 'login'
                ? 'border-b-2 border-[#1F4D2B] text-[#1F4D2B]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setTab('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center transition-colors ${
              tab === 'register'
                ? 'border-b-2 border-[#1F4D2B] text-[#1F4D2B]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Logins Strip */}
          <div className="p-3 bg-[#FFF8E7] border border-[#F2A900]/30 rounded-2xl">
            <span className="text-[10px] font-bold text-[#4A2C17] uppercase tracking-wider block mb-1.5">
              🚀 Fast Testing Accounts:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleQuickDemoCustomer}
                className="flex-1 py-1 px-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-[#1F4D2B] shadow-2xs"
              >
                Demo Customer
              </button>
              <button
                type="button"
                onClick={handleQuickDemoAdmin}
                className="flex-1 py-1 px-2 bg-[#1F4D2B] hover:bg-[#14381F] text-white rounded-lg text-[11px] font-semibold shadow-2xs"
              >
                Admin (Admin@123)
              </button>
            </div>
          </div>

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. gopan.nair@example.com"
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1F4D2B]"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-[11px] text-[#1F4D2B] font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1F4D2B]"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1F4D2B] hover:bg-[#14381F] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Sign In
              </button>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Saritha Nambiar"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="saritha@example.com"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9847123456"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex gap-1 h-1.5">
                      <div
                        className={`flex-1 rounded-full ${
                          passwordScore >= 1 ? 'bg-red-500' : 'bg-slate-200'
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-full ${
                          passwordScore >= 2 ? 'bg-amber-500' : 'bg-slate-200'
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-full ${
                          passwordScore >= 3 ? 'bg-blue-500' : 'bg-slate-200'
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-full ${
                          passwordScore >= 4 ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Strength:{' '}
                      {passwordScore <= 1
                        ? 'Weak'
                        : passwordScore <= 2
                        ? 'Fair'
                        : passwordScore <= 3
                        ? 'Good'
                        : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1F4D2B] hover:bg-[#14381F] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Create Account
              </button>
            </form>
          )}

          {/* Forgot Password Form */}
          {tab === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-3.5">
              <p className="text-xs text-slate-600">
                Enter your registered email address and we will generate a secure reset link.
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              {resetTokenInfo && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl space-y-1">
                  <div className="flex items-center gap-1 font-bold">
                    <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                    <span>Dev Mode Reset Link:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed break-all font-mono">{resetTokenInfo}</p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs rounded-xl"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#1F4D2B] text-white rounded-xl text-xs font-bold hover:bg-[#14381F]"
                >
                  Generate Reset Token
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
