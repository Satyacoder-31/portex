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
      <div className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
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

          {/* Condition Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${cond.bg}`}>
              {cond.text}
            </span>
            {listing.isFeatured && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm">
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
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
              favorite
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:scale-110'
            }`}
            title="Save to Wishlist"
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
          </button>

          {/* Delivery Ready Ribbon */}
          <div className="absolute bottom-2 left-2 bg-slate-950/85 backdrop-blur-md text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 border border-slate-700/60">
            <Truck className="w-3 h-3 text-emerald-400" />
            <span>Porter Delivery Ready ({listing.weightKg} kg)</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Price & Views */}
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  ₹{listing.price.toLocaleString('en-IN')}
                </span>
                {listing.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    ₹{listing.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Eye className="w-3 h-3" /> {listing.views}
              </span>
            </div>

            {/* Title */}
            <Link href={`/listings/${listing.id}`}>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {listing.title}
              </h3>
            </Link>

            {/* Location & Seller Info */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-1 truncate">
                <MapPin className="w-3 h-3 text-blue-500 flex-shrink-0" />
                <span className="truncate">{listing.location.address}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{listing.sellerName}</span>
                  {listing.sellerIsVerified && (
                    <span title="Verified Seller">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">{listing.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Quick Dual Action Buttons (Unified OLX + Porter) */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowDeliveryModal(true)}
              className="px-2.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-200 dark:border-emerald-800/60 transition-colors"
            >
              <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Deliver It</span>
            </button>

            <Link
              href={`/listings/${listing.id}`}
              className="px-2.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <span>View Details</span>
              <ArrowRight className="w-3 h-3" />
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
