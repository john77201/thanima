import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { SEED_FAQS } from '../../data/seedData';
import { FAQ } from '../../types';

export const FaqView: React.FC = () => {
  const [faqs] = useState<FAQ[]>(SEED_FAQS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  const categories = ['All', 'Products', 'Orders', 'Payment', 'Delivery', 'Returns'];

  const filteredFaqs =
    selectedCategory === 'All'
      ? faqs
      : faqs.filter((f) => f.category === selectedCategory);

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1F4D2B] bg-[#FFF8E7] px-3 py-1 rounded-full border border-[#F2A900]/30">
          Knowledge Base
        </span>
        <h1 className="text-3xl font-extrabold text-[#4A2C17]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-[#8C7A6B]">
          Clear answers about homemade ingredients, packaging, shipping times, and payments.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-[#1F4D2B] text-white shadow-2xs'
                : 'bg-white border border-[#EFE8D8] text-[#4A2C17] hover:bg-[#FFF8E7]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = expandedFaqId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white border border-[#EFE8D8] rounded-2xl overflow-hidden transition-all shadow-2xs"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-4 md:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FFFDF7]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase font-bold text-[#1F4D2B] bg-[#FFF8E7] px-2 py-0.5 rounded-sm">
                    {faq.category}
                  </span>
                  <span className="font-semibold text-xs md:text-sm text-[#4A2C17]">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#1F4D2B]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still need help callout */}
      <div className="p-6 bg-[#FFF8E7] border border-[#F2A900]/30 rounded-3xl text-center space-y-3">
        <h3 className="font-bold text-sm text-[#4A2C17]">Have a question not listed here?</h3>
        <p className="text-xs text-[#8C7A6B] max-w-sm mx-auto">
          Our friendly customer care team is available on WhatsApp to assist you directly.
        </p>
        <a
          href="https://wa.me/919847000123"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#20ba59]"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
