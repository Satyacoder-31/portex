'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Truck,
  PlusCircle,
  Package,
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Navigation,
  Smartphone,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import { CATEGORIES, VEHICLE_OPTIONS } from '@/lib/data/mockData';
import ListingCard from '@/components/marketplace/ListingCard';

export default function HomePage() {
  const { listings, businessProfile } = usePortex();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Lucknow, UP');

  return (
    <div className="space-y-12 sm:space-y-20 pb-8">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-16 sm:pb-24 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[250px] sm:h-[350px] bg-blue-600/20 blur-[100px] sm:blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[250px] sm:w-[400px] h-[200px] sm:h-[300px] bg-emerald-500/15 blur-[90px] sm:blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 backdrop-blur-md shadow-inner text-[11px] sm:text-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-300">
              India’s 1st Unified Marketplace + Hyperlocal Fleet
            </span>
          </div>

          {/* Hero Headline */}
          <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.15]">
              Buy. Sell. Deliver.{' '}
              <span className="gradient-text-electric block sm:inline mt-1 sm:mt-0">All in One Place.</span>
            </h1>
            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed px-2">
              Browse pre-owned electronics, furniture and bikes. Or book an on-demand Porter truck or 2-wheeler to pick it up and deliver in minutes.
            </p>
          </div>

          {/* Unified Smart Search & Location Bar */}
          <div className="max-w-3xl mx-auto bg-slate-800/90 backdrop-blur-xl p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl border border-slate-700/80 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Location Picker */}
              <div className="flex items-center gap-2 px-3 py-2 sm:py-2.5 bg-slate-900/80 rounded-xl text-xs font-semibold text-slate-300 border border-slate-700/50 justify-between sm:justify-start">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-400 text-[11px]">Hub:</span>
                </div>
                <select
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
                >
                  <option value="Lucknow, UP" className="bg-slate-900 text-white">Lucknow, UP</option>
                  <option value="Delhi NCR" className="bg-slate-900 text-white">Delhi NCR</option>
                  <option value="Bangalore, KA" className="bg-slate-900 text-white">Bangalore, KA</option>
                  <option value="Mumbai, MH" className="bg-slate-900 text-white">Mumbai, MH</option>
                </select>
              </div>

              {/* Input Field */}
              <div className="flex-1 flex items-center px-3 py-1 bg-slate-900/40 sm:bg-transparent rounded-xl border sm:border-0 border-slate-700/40">
                <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="What are you looking for? (MacBook, Royal Enfield, Sofa...)"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full py-2 bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Primary Search CTA */}
              <Link
                href={`/marketplace?q=${encodeURIComponent(searchQuery)}`}
                className="w-full sm:w-auto px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* 3 Primary Action CTAs (Touch friendly on mobile) */}
          <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 pt-2 sm:pt-4 max-w-xl mx-auto sm:max-w-none">
            <Link
              href="/marketplace"
              className="py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/15 backdrop-blur-md transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Package className="w-4 h-4 text-blue-400" />
              <span>Browse Marketplace</span>
            </Link>

            <Link
              href="/sell"
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Sell Something Free</span>
            </Link>

            <Link
              href="/deliver"
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Deliver Something Now</span>
            </Link>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="pt-6 sm:pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto text-center">
            <div className="p-2 sm:p-0">
              <div className="text-xl sm:text-3xl font-black text-white">42,000+</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Verified Listings</div>
            </div>
            <div className="p-2 sm:p-0">
              <div className="text-xl sm:text-3xl font-black text-emerald-400">18 Mins</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Avg Porter Dispatch</div>
            </div>
            <div className="p-2 sm:p-0">
              <div className="text-xl sm:text-3xl font-black text-blue-400">100%</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Escrow Protection</div>
            </div>
            <div className="p-2 sm:p-0">
              <div className="text-xl sm:text-3xl font-black text-amber-400">4.92 ★</div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Fleet Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES (Swipeable Touch Carousel on Mobile) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Popular Categories
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Explore thousands of inspected deals across city neighborhoods
            </p>
          </div>
          <Link
            href="/marketplace"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 flex-shrink-0"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Carousel on mobile, Grid on desktop */}
        <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-8 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 gap-2.5 sm:gap-3 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map(c => (
            <Link
              key={c.id}
              href={`/marketplace?cat=${c.slug}`}
              className="min-w-[105px] sm:min-w-0 p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-lg transition-all text-center flex flex-col items-center group flex-shrink-0 snap-start"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-2">
                <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                {c.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">{c.count}+</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS (Unified OLX + Porter Experience) */}
      <section className="bg-slate-100 dark:bg-slate-900/60 py-12 sm:py-16 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              The Portex Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              How Portex Unifies Marketplace &amp; Logistics
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 px-2">
              Traditional marketplaces stop when you agree on price. PORTEX handles the pickup, vehicle dispatch, digital inspection, and door delivery seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative">
              <span className="inline-block px-2.5 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-full mb-1">
                STEP 01
              </span>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Discover &amp; Negotiate
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Browse nearby items from verified local sellers. Make instant offers with one click or chat directly with real-time response guarantees.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative">
              <span className="inline-block px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-full mb-1">
                STEP 02
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                One-Click Porter Dispatch
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hit “Deliver Something” or “Request Delivery” on any listing. The seller’s pickup address is auto-filled and the optimal vehicle (Tata Ace or Bike) is allocated.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative">
              <span className="inline-block px-2.5 py-0.5 bg-indigo-600 text-white text-[10px] font-black rounded-full mb-1">
                STEP 03
              </span>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Live GPS &amp; Escrow Safety
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Watch your driver on the interactive map with speed telemetry. Inspect the package at drop, provide the OTP, and funds are safely credited to the seller.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED / NEARBY MARKETPLACE LISTINGS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Nearby Verified Listings ({selectedCity.split(',')[0]})
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Inspected products eligible for instant Porter dispatch within 30 minutes
            </p>
          </div>
          <Link
            href="/marketplace"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 flex-shrink-0"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
          {listings.slice(0, 6).map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* 5. ON-DEMAND LOGISTICS FLEET (PORTER TIERS) */}
      <section className="bg-slate-950 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Portex Logistics Fleet
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                Hyperlocal On-Demand Transport
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Need to move a single laptop, an entire sofa, or commercial freight? Book our verified drivers on-demand with transparent per-km rates.
              </p>
            </div>
            <Link
              href="/deliver"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 self-start sm:self-auto"
            >
              <span>Book Porter Fleet</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {VEHICLE_OPTIONS.map(v => (
              <div
                key={v.type}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-black text-white">₹{v.baseFare}</span>
                    <span className="text-[10px] text-slate-400 block">Base + ₹{v.perKmRate}/km</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                    {v.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{v.tagline}</p>
                </div>

                <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Payload: <strong>&le; {v.maxWeightKg} kg</strong></span>
                  <span className="text-emerald-400 font-semibold text-[11px]">{v.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TRUST & REGULATORY GOVERNANCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-2xl space-y-4">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            Commercial Entity Disclosure
          </span>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight">
            Enterprise Governance &amp; GST Compliance
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            PORTEX operates under Goods Transport Agency standards (SAC 9965) managed by <strong>{businessProfile.legalName}</strong> (GSTIN: {businessProfile.gstin}). Every trip includes GST tax invoices, OTP handoffs, and digital proof of delivery.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors"
            >
              Inspect Admin &amp; GST Settings
            </Link>
            <Link
              href="/driver"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-colors"
            >
              Join as Driver Partner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
