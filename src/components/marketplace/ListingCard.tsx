'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MapPin, ShieldCheck, Truck, ArrowRight, Eye, RotateCcw, AlertTriangle } from 'lucide-react';
import { Listing } from '@/types';
import { usePortex } from '@/lib/store/portexStore';
import RequestDeliveryModal from './RequestDeliveryModal';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { toggleFavorite, isFavorite, renewListing, currentUser, showToast, verifyListing } = usePortex();
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const favorite = isFavorite(listing.id);
  const isExpired = listing.status === 'EXPIRED';

  const conditionLabels: Record<string, { text: string; bg: string }> = {
    BRAND_NEW: { text: 'Brand New', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    LIKE_NEW: { text: 'Like New', bg: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30' },
    EXCELLENT: { text: 'Excellent', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    GOOD: { text: 'Good', bg: 'bg-zinc-800 text-amber-200 border-zinc-700' },
    FAIR: { text: 'Fair', bg: 'bg-zinc-900 text-zinc-400 border-zinc-800' },
  };

  const cond = conditionLabels[listing.condition] || conditionLabels.GOOD;

  return (
    <>
      <div className="group relative bg-[#0e0e12] rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-800/90 hover:border-amber-500/50 shadow-lg hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between">
        {/* Top Image & Overlays */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
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
            {listing.verificationStatus === 'PENDING' ? (
              <span className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-black shadow-md flex items-center gap-1 animate-pulse">
                ⏳ Pending Admin Approval
              </span>
            ) : (
              <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border backdrop-blur-md ${cond.bg}`}>
                {cond.text}
              </span>
            )}
            {listing.isFeatured && (
              <span className="text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-sm">
                FEATURED
              </span>
            )}
            {isExpired ? (
              <span className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-md flex items-center gap-1">
                <AlertTriangle className="w-2.5 h-2.5" /> Ad Inactive
              </span>
            ) : listing.expiryDaysRemaining !== undefined ? (
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-black/80 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                Expires in {listing.expiryDaysRemaining}d
              </span>
            ) : null}
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
                : 'bg-black/60 text-zinc-300 hover:text-amber-400 border border-white/10 hover:border-amber-400/40 hover:scale-110'
            }`}
            title="Save to Wishlist"
            aria-label="Save to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${favorite ? 'fill-current' : ''}`} />
          </button>

          {/* Delivery Ready Ribbon with Auto/Admin Vehicle */}
          <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 bg-black/90 backdrop-blur-md text-amber-400 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-500/30 max-w-[calc(100%-12px)]">
            <Truck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 flex-shrink-0" />
            <span className="truncate">
              {listing.recommendedVehicle === 'TWO_WHEELER'
                ? 'Bike'
                : listing.recommendedVehicle === 'THREE_WHEELER_AUTO'
                ? 'Auto'
                : 'Truck'}{' '}
              &bull; {listing.weightKg}kg
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Price & Views */}
            <div className="flex items-baseline justify-between mb-1 sm:mb-1.5 gap-1">
              <div className="flex items-baseline gap-1 sm:gap-2 truncate">
                <span className="text-sm sm:text-lg md:text-xl font-black text-amber-400 truncate">
                  ₹{listing.price.toLocaleString('en-IN')}
                </span>
                {listing.originalPrice && (
                  <span className="text-[10px] sm:text-xs text-zinc-500 line-through hidden xs:inline">
                    ₹{listing.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400/70" /> {listing.views}
              </span>
            </div>

            {/* Title */}
            <Link href={`/listings/${listing.id}`}>
              <h3 className="font-semibold text-zinc-100 text-xs sm:text-sm line-clamp-2 leading-tight sm:leading-snug hover:text-amber-400 transition-colors min-h-[2rem]">
                {listing.title}
              </h3>
            </Link>

            {/* Location & Seller Info */}
            <div className="mt-2 pt-2 sm:mt-3 sm:pt-3 border-t border-zinc-800/80 space-y-1">
              <div className="flex items-center text-[10px] sm:text-xs text-zinc-400 gap-1 truncate">
                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 flex-shrink-0" />
                <span className="truncate">{listing.location.city ? `${listing.location.city}, ${listing.location.address.split(',')[0]}` : listing.location.address}</span>
              </div>

              <div className="flex items-center justify-between text-[10px] sm:text-xs text-zinc-400 gap-1">
                <div className="flex items-center gap-1 truncate">
                  <span className="font-medium text-zinc-300 truncate">{listing.sellerName.split(' ')[0]}</span>
                  {listing.sellerIsVerified && (
                    <span title="Verified Seller">
                      <ShieldCheck className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    </span>
                  )}
                </div>
                <span className="text-[9px] sm:text-[11px] text-zinc-500 flex-shrink-0">{listing.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Quick Dual Action Buttons (Gold & Black) */}
          <div className="mt-2 pt-2 sm:mt-3.5 sm:pt-3 border-t border-zinc-800 grid grid-cols-2 gap-1.5 sm:gap-2">
            {isExpired ? (
              <button
                onClick={() => renewListing(listing.id)}
                className="px-1.5 sm:px-2.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                title="Renew this ad for 30 days"
              >
                <RotateCcw className="w-3 h-3 flex-shrink-0" />
                <span>Renew Ad</span>
              </button>
            ) : listing.verificationStatus === 'PENDING' ? (
              <button
                onClick={() => verifyListing(listing.id, 'APPROVED')}
                className="px-1.5 sm:px-2.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                title="Approve item so it goes live for all buyers"
              >
                <span>⚡ Quick Approve</span>
              </button>
            ) : (
              <button
                onClick={() => setShowDeliveryModal(true)}
                className="px-1.5 sm:px-2.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black flex-shrink-0" />
                <span>Deliver</span>
              </button>
            )}

            <Link
              href={`/listings/${listing.id}`}
              className="px-1.5 sm:px-2.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700/80 hover:border-amber-500/40 text-[10px] sm:text-xs font-bold flex items-center justify-center gap-0.5 sm:gap-1 transition-all"
            >
              <span>Details</span>
              <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 flex-shrink-0" />
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
