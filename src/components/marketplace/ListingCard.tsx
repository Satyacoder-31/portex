'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MapPin, ShieldCheck, Truck, ArrowRight, Eye } from 'lucide-react';
import { Listing } from '@/types';
import { usePortex } from '@/lib/store/portexStore';
import RequestDeliveryModal from './RequestDeliveryModal';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { toggleFavorite, isFavorite } = usePortex();
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const favorite = isFavorite(listing.id);

  const conditionLabels: Record<string, { text: string; bg: string }> = {
    BRAND_NEW: { text: 'Brand New', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
    LIKE_NEW: { text: 'Like New', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
    EXCELLENT: { text: 'Excellent', bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
    GOOD: { text: 'Good', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
    FAIR: { text: 'Fair', bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' },
  };

  const cond = conditionLabels[listing.condition] || conditionLabels.GOOD;

  return (
    <>
      <div className="group relative bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
        {/* Top Image & Overlays */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={listing.images[0] || 'https://images.unsplash.com/photo-1589384267710-7a170981ca78?auto=format&fit=crop&w=600&q=80'}
            alt={listing.title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589384267710-7a170981ca78?auto=format&fit=crop&w=600&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Condition & Featured Badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-wrap items-center gap-1 sm:gap-1.5">
            <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border backdrop-blur-md ${cond.bg}`}>
              {cond.text}
            </span>
            {listing.isFeatured && (
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm">
                FEATURED
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={e => {
              e.preventDefault();
              toggleFavorite(listing.id);
            }}
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all ${
              favorite
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:scale-110'
            }`}
            title="Save to Wishlist"
            aria-label="Save to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${favorite ? 'fill-current' : ''}`} />
          </button>

          {/* Delivery Ready Ribbon */}
          <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 bg-slate-950/85 backdrop-blur-md text-emerald-400 text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-md flex items-center gap-1 border border-slate-700/60 max-w-[calc(100%-12px)]">
            <Truck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 flex-shrink-0" />
            <span className="truncate hidden xs:inline">Porter Ready ({listing.weightKg}kg)</span>
            <span className="truncate xs:hidden">{listing.weightKg}kg Porter</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Price & Views */}
            <div className="flex items-baseline justify-between mb-1 sm:mb-1.5 gap-1">
              <div className="flex items-baseline gap-1 sm:gap-2 truncate">
                <span className="text-sm sm:text-lg md:text-xl font-black text-slate-900 dark:text-white truncate">
                  ₹{listing.price.toLocaleString('en-IN')}
                </span>
                {listing.originalPrice && (
                  <span className="text-[10px] sm:text-xs text-slate-400 line-through hidden xs:inline">
                    ₹{listing.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {listing.views}
              </span>
            </div>

            {/* Title */}
            <Link href={`/listings/${listing.id}`}>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm line-clamp-2 leading-tight sm:leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors min-h-[2rem]">
                {listing.title}
              </h3>
            </Link>

            {/* Location & Seller Info */}
            <div className="mt-2 pt-2 sm:mt-3 sm:pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
              <div className="flex items-center text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 gap-1 truncate">
                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-500 flex-shrink-0" />
                <span className="truncate">{listing.location.city ? `${listing.location.city}, ${listing.location.address.split(',')[0]}` : listing.location.address}</span>
              </div>

              <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 gap-1">
                <div className="flex items-center gap-1 truncate">
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{listing.sellerName.split(' ')[0]}</span>
                  {listing.sellerIsVerified && (
                    <span title="Verified Seller">
                      <ShieldCheck className="w-3 h-3 text-blue-500 flex-shrink-0" />
                    </span>
                  )}
                </div>
                <span className="text-[9px] sm:text-[11px] text-slate-400 flex-shrink-0">{listing.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Quick Dual Action Buttons (Unified OLX + Porter) */}
          <div className="mt-2 pt-2 sm:mt-3.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={() => setShowDeliveryModal(true)}
              className="px-1.5 sm:px-2.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 border border-emerald-200 dark:border-emerald-800/60 transition-colors"
            >
              <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Deliver</span>
            </button>

            <Link
              href={`/listings/${listing.id}`}
              className="px-1.5 sm:px-2.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-white text-[10px] sm:text-xs font-bold flex items-center justify-center gap-0.5 sm:gap-1 transition-colors"
            >
              <span>Details</span>
              <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
            </Link>
          </div>
        </div>
      </div>

      {/* Instant Delivery Booking Modal */}
      {showDeliveryModal && (
        <RequestDeliveryModal listing={listing} onClose={() => setShowDeliveryModal(false)} />
      )}
    </>
  );
}
