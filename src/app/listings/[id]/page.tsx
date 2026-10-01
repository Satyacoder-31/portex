'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Heart,
  Share2,
  ShieldCheck,
  MapPin,
  Truck,
  MessageSquare,
  Tag,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Eye,
  Info,
  Package,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import MakeOfferModal from '@/components/marketplace/MakeOfferModal';
import RequestDeliveryModal from '@/components/marketplace/RequestDeliveryModal';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params?.id as string;

  const { listings, toggleFavorite, isFavorite, showToast } = usePortex();
  const listing = listings.find(l => l.id === listingId) || listings[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  const favorite = isFavorite(listing.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Listing URL copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 truncate">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/marketplace" className="hover:text-blue-600 transition-colors">Marketplace</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="capitalize">{listing.category}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{listing.title}</span>
        </div>

        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
      </div>

      {/* Main 2-Column Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Photos Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
            <img
              src={listing.images[selectedImage] || listing.images[0]}
              alt={listing.title}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589384267710-7a170981ca78?auto=format&fit=crop&w=1000&q=80';
              }}
              className="w-full h-full object-cover"
            />

            {/* Condition pill */}
            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-400 border border-slate-700">
              {listing.condition.replace(/_/g, ' ')}
            </div>

            {/* Favorite & Share buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:scale-110 transition-all shadow-md"
                title="Share Listing"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleFavorite(listing.id)}
                className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
                  favorite
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:text-rose-500'
                }`}
                title="Save"
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Thumbnails list */}
          {listing.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {listing.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx
                      ? 'border-blue-600 scale-105 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt="thumb"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589384267710-7a170981ca78?auto=format&fit=crop&w=400&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Description Section */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Seller Description &amp; Condition Details
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>

            {/* Technical Specs & Logistics Matrix */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block text-[10px] uppercase">Package Weight</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{listing.weightKg} kg</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block text-[10px] uppercase">Dimensions</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{listing.dimensions}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block text-[10px] uppercase">Posted On</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{listing.createdAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Delivery & Seller (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Price & Primary Action Card */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
            <div>
              <span className="text-xs text-slate-500 font-medium">Asking Price</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  ₹{listing.price.toLocaleString('en-IN')}
                </span>
                {listing.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{listing.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {listing.title}
            </h1>

            {/* Location & Escrow Badge */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>{listing.location.address}, {listing.location.city}</span>
              </div>

              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>100% Escrow Protection: Funds held securely until delivered</span>
              </div>
            </div>

            {/* Dual CTAs: Request Porter Delivery & Make Offer */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setShowDeliveryModal(true)}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Truck className="w-4 h-4" />
                <span>Request Porter Delivery (Direct from Seller)</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setShowOfferModal(true)}
                  className="py-3 px-3 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Make an Offer</span>
                </button>

                <Link
                  href="/chat"
                  className="py-3 px-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-blue-500/20"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat Seller</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Integrated Porter Shipping Rate Preview */}
          <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">Hyperlocal Delivery Estimation</h4>
                  <p className="text-[11px] text-slate-400">Pickup: {listing.location.address}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400">~24 mins ETA</span>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px]">Recommended Vehicle</span>
                <span className="font-bold text-white">
                  {listing.weightKg <= 20 ? '2-Wheeler Express' : 'Tata Ace Mini Truck'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Estimated Shipping</span>
                <span className="font-black text-emerald-400 text-sm">₹280 – ₹390</span>
              </div>
            </div>
          </div>

          {/* Seller Trust Profile Card */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={listing.sellerAvatar}
                alt={listing.sellerName}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {listing.sellerName}
                  </h4>
                  {listing.sellerIsVerified && (
                    <span title="Portex Verified Identity">
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  ⭐ {listing.sellerRating} rating &bull; 99% response rate
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block text-[10px]">Member Since</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">2023</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block text-[10px]">Avg Response</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">&lt; 15 mins</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showOfferModal && (
        <MakeOfferModal listing={listing} onClose={() => setShowOfferModal(false)} />
      )}
      {showDeliveryModal && (
        <RequestDeliveryModal listing={listing} onClose={() => setShowDeliveryModal(false)} />
      )}
    </div>
  );
}
