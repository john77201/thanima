import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ContactView: React.FC = () => {
  const { submitContactMessage } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-spam honeypot
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Honeypot check (bots fill hidden field)
    if (honeypot) return;
    if (!name.trim() || !email.trim() || !message.trim()) return;

    submitContactMessage({
      name,
      email,
      phone,
      subject,
      message,
    });

    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D2B] bg-[#FFF8E7] px-3 py-1 rounded-full border border-[#F2A900]/30">
          We'd Love to Hear From You
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#4A2C17]">
          Contact Thanima Kitchens
        </h1>
        <p className="text-xs text-[#8C7A6B]">
          Have questions about bulk Sadya orders, special dietary requests, or shipping to your location? Reach out to our customer care team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="p-6 bg-white border border-[#EFE8D8] rounded-3xl shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#4A2C17] uppercase tracking-wider">
              Get in Touch
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FFF8E7] text-[#1F4D2B] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">Phone Support</span>
                  <p className="text-slate-600 mt-0.5">+91 98470 00123 / 0484 2901234</p>
                  <span className="text-[10px] text-slate-400">Mon - Sat: 9:00 AM - 7:00 PM IST</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FFF8E7] text-[#1F4D2B] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">Email Us</span>
                  <p className="text-slate-600 mt-0.5">care@thanima.in / orders@thanima.in</p>
                  <span className="text-[10px] text-slate-400">Response within 4 business hours</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">WhatsApp Click-to-Chat</span>
                  <a
                    href="https://wa.me/919847000123"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1F4D2B] font-semibold hover:underline mt-0.5 inline-block"
                  >
                    Chat on +91 98470 00123 →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                <div className="w-8 h-8 rounded-full bg-[#FFF8E7] text-[#1F4D2B] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">Central Kitchen & Packing</span>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    Thanima Homely Foods LLP, Building 4C, Infopark Expressway, Kakkanad, Kochi, Kerala - 682030
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Visual Placeholder */}
          <div className="p-4 bg-white border border-[#EFE8D8] rounded-3xl shadow-xs space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Our Location in Kochi
            </span>
            <div className="w-full h-40 bg-[#E8E2D5] rounded-2xl flex flex-col items-center justify-center text-center p-4 border border-black/5 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1F4D2B_1px,transparent_1px)] [background-size:12px_12px]" />
              <MapPin className="w-8 h-8 text-[#B5502C] mb-1 animate-bounce" />
              <span className="font-bold text-xs text-[#1F4D2B] relative z-10">Kakkanad, Kochi, Kerala</span>
              <span className="text-[10px] text-slate-600 relative z-10">9.9982° N, 76.3575° E</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white border border-[#EFE8D8] rounded-3xl p-6 md:p-8 shadow-xs">
          <h3 className="font-bold text-base text-[#4A2C17] mb-1">Send Us a Direct Message</h3>
          <p className="text-xs text-[#8C7A6B] mb-6">
            Our central coordinator will review your query and reply via email or phone.
          </p>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-emerald-950">Thank you for writing to us!</h4>
              <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                Your message has been safely saved in our database. We will be in touch shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-4 py-2 bg-[#1F4D2B] text-white text-xs font-semibold rounded-xl"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Anti-spam honeypot (hidden from human users) */}
              <input
                type="text"
                name="website_url"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arun George"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1F4D2B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arun@example.com"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1F4D2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9847123456"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1F4D2B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1F4D2B] bg-white"
                  >
                    <option value="Product Inquiry">Product Inquiry</option>
                    <option value="Order Tracking Support">Order Tracking Support</option>
                    <option value="Bulk / Festive Sadya Order">Bulk / Festive Sadya Order</option>
                    <option value="Feedback / Suggestion">Feedback / Suggestion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help make your Kerala food experience extraordinary?"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1F4D2B]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Protected by CSRF & anti-bot honeypot</span>
                </span>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1F4D2B] hover:bg-[#14381F] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
