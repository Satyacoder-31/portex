'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Tag, ArrowRight, ShieldCheck } from 'lucide-react';
import { Listing } from '@/types';
import { usePortex } from '@/lib/store/portexStore';

interface MakeOfferModalProps {
  listing: Listing;
  onClose: () => void;
}

export default function MakeOfferModal({ listing, onClose }: MakeOfferModalProps) {
  const router = useRouter();
  const { sendMessage, showToast } = usePortex();
  const [offerAmount, setOfferAmount] = useState(Math.round(listing.price * 0.9));
  const [note, setNote] = useState('Hi, I am interested and can arrange immediate Porter pickup.');

  const discountPercent = Math.round(((listing.price - offerAmount) / listing.price) * 100);

  const quickPicks = [
    { label: '5% Off', val: Math.round(listing.price * 0.95) },
    { label: '10% Off', val: Math.round(listing.price * 0.90) },
    { label: '15% Off', val: Math.round(listing.price * 0.85) },
    { label: '20% Off', val: Math.round(listing.price * 0.80) },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (offerAmount <= 0) return;

    // Send offer into chat conversation
    sendMessage('conv-1', `${note} [Official Offer: ₹${offerAmount.toLocaleString('en-IN')}]`, offerAmount);
    showToast(`Offer of ₹${offerAmount.toLocaleString('en-IN')} sent to ${listing.sellerName}!`);
    onClose();
    router.push('/chat');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Make an Offer
              </h3>
              <p className="text-[11px] text-slate-500">Negotiate safely with escrow guarantee</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Listing details chip */}
          <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
            <img
              src={listing.images[0]}
              alt={listing.title}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589384267710-7a170981ca78?auto=format&fit=crop&w=400&q=80';
              }}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {listing.title}
              </h4>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Listed: ₹{listing.price.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Offer Amount Input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Your Offer Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-base font-bold text-slate-400">₹</span>
              <input
                type="number"
                value={offerAmount}
                onChange={e => setOfferAmount(Number(e.target.value))}
                min={1}
                max={listing.price}
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
              <span>Original: ₹{listing.price.toLocaleString('en-IN')}</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {discountPercent > 0 ? `${discountPercent}% below asking price` : 'Asking price'}
              </span>
            </div>
          </div>

          {/* Quick Offer Chips */}
          <div className="grid grid-cols-4 gap-1.5">
            {quickPicks.map(p => (
              <button
                key={p.label}
                type="button"
                onClick={() => setOfferAmount(p.val)}
                className={`py-1.5 px-2 text-[11px] font-semibold rounded-lg border transition-all ${
                  offerAmount === p.val
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Note to Seller */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Message to Seller
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span>If accepted, you can book Porter logistics directly in the chat window.</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <span>Submit Offer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
