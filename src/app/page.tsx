'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  Package,
  ShieldCheck,
  Star,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Briefcase,
  Shirt,
  Guitar,
  Armchair,
  Wrench,
  Car,
  PawPrint,
  Building,
  Award,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import { VEHICLE_OPTIONS } from '@/lib/data/mockData';
import ListingCard from '@/components/marketplace/ListingCard';
import {
  PersonaSwitcherBar,
  DriverHomeView,
  EnterpriseHomeView,
  SellerHomeView,
} from '@/components/home/PersonaRoleViews';

export default function HomePage() {
  const { listings, showToast, userRole } = usePortex();
  const [isVerifiedUnlocked, setIsVerifiedUnlocked] = useState(false);

  // Exact 10 Categories matching the user's reference screenshot (2 rows x 5 items)
  const screenshotCategories = [
    {
      id: 'properties',
      name: 'Properties',
      slug: 'commercial',
      icon: Building,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    },
    {
      id: 'jobs',
      name: 'Jobs',
      slug: 'commercial',
      icon: Briefcase,
      color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    },
    {
      id: 'fashion',
      name: 'Fashion',
      slug: 'fashion',
      icon: Shirt,
      color: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400',
    },
    {
      id: 'books',
      name: 'Books, Sports & H...',
      slug: 'books',
      icon: Guitar,
      color: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400',
    },
    {
      id: 'see-all-top',
      name: 'See all',
      slug: 'all',
      icon: ArrowRight,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
      isAction: true,
    },
    {
      id: 'commercial',
      name: 'Commercial & ...',
      slug: 'commercial',
      icon: Truck,
      color: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400',
    },
    {
      id: 'furniture',
      name: 'Furniture',
      slug: 'furniture',
      icon: Armchair,
      color: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
    },
    {
      id: 'pets',
      name: 'Pets',
      slug: 'books',
      icon: PawPrint,
      color: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
    },
    {
      id: 'services',
      name: 'Services',
      slug: 'commercial',
      icon: Wrench,
      color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      id: 'cars',
      name: 'Cars',
      slug: 'vehicles',
      icon: Car,
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400',
    },
  ];

  const handleGetVerified = () => {
    setIsVerifiedUnlocked(true);
    showToast('🎉 You are now a Verified Portex Member! Verified badge is now active on your profile.');
  };

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-6 sm:space-y-8">
        
        {/* Dynamic Persona Role Bar & Custom Views */}
        <PersonaSwitcherBar />

        {/* 1. DRIVER PARTNER VIEW */}
        {userRole === 'DRIVER' && <DriverHomeView />}

        {/* 2. ENTERPRISE LOGISTICS SHIPPER VIEW */}
        {userRole === 'ENTERPRISE' && <EnterpriseHomeView />}

        {/* 3. MARKETPLACE SELLER VIEW */}
        {userRole === 'SELLER' && <SellerHomeView />}

        {/* ========================================================
            4. CONSUMER / BUYER HERO & MARKETPLACE SECTION
            Only displayed for BUYER role or unauthenticated shoppers
           ======================================================== */}
        {(!userRole || userRole === 'BUYER') && (
          <>
            <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#003884] via-[#004dc7] to-[#1e50ff] text-white p-3 sm:p-5 shadow-lg shadow-blue-900/15">
              {/* Subtle Ambient Glows */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 items-center">
            {/* Left Content (Text, Badge, Price tag & CTA) */}
            <div className="lg:col-span-7 space-y-2 sm:space-y-3">
              {/* Top Banner Header with Stars */}
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide">
                  <Sparkles className="w-3 h-3 text-[#ffce32]" />
                  <span>PREMIUM BUYER CLUB</span>
                </span>
                <div className="flex items-center text-[#ffce32]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>

              {/* Main Headline */}
              <div className="space-y-1">
                <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-[1.15]">
                  India's Top Verified <span className="text-[#23e5db]">Sellers</span> & Instant Delivery
                </h1>
                <p className="text-xs text-blue-100 max-w-lg font-normal leading-relaxed">
                  Browse hand-inspected pre-owned cars, laptops, furniture and bikes with instant Porter mini truck dispatch.
                </p>
              </div>

              {/* Price Pill & Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* Gold Shield Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-sm">
                  <Award className="w-4 h-4 fill-slate-950" />
                  <span>ELITE BUYER</span>
                </div>

                {/* Starts @ 99 Pill Badge */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#ffce32] text-slate-950 font-black text-xs shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-700">Starts</span>
                  <span className="text-sm">@ ₹99</span>
                </div>

                {/* Porter Dispatch Pill */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-teal-500/20 border border-teal-300/40 text-teal-200 text-xs font-semibold">
                  <Truck className="w-3.5 h-3.5 text-teal-300" />
                  <span>18-Min Dispatch</span>
                </div>
              </div>

              {/* Primary Action Button (Be Elite Buyer) */}
              <div className="pt-1 flex flex-wrap items-center gap-2">
                <Link
                  href="/marketplace?verified=true"
                  className="px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#ffce32] to-amber-400 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-yellow-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>Be Elite Buyer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/deliver"
                  className="px-4 py-2.5 sm:py-3 rounded-full bg-white/15 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5"
                >
                  <Truck className="w-4 h-4 text-teal-300" />
                  <span>Book Porter Truck</span>
                </Link>
              </div>
            </div>

            {/* Right Content (Man pointing at Smartphone Mockup with Top 5 Verified Listings) */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end gap-3">
              {/* Smiling Man Illustration / Photo */}
              <div className="hidden sm:block relative w-36 h-48 rounded-2xl overflow-hidden shadow-lg border-2 border-white/20 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                  alt="Happy Verified Member"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] font-bold text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Top Seller
                  </span>
                </div>
              </div>

              {/* Smartphone Mockup */}
              <div className="relative w-full max-w-[240px] sm:max-w-[260px] rounded-3xl bg-slate-950 p-2.5 border-4 border-slate-700/80 shadow-2xl">
                {/* Phone Top Notch */}
                <div className="w-20 h-3.5 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-800 mr-2" />
                  <div className="w-8 h-1 bg-slate-800 rounded-full" />
                </div>

                {/* Top 5 Badge on Phone Screen */}
                <div className="absolute -top-3 -right-3 z-10 w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex flex-col items-center justify-center font-black shadow-lg shadow-amber-500/40 border-2 border-white rotate-6">
                  <span className="text-[9px] uppercase leading-none">TOP</span>
                  <span className="text-sm leading-tight">5★</span>
                </div>

                {/* Inner Screen Feed */}
                <div className="rounded-2xl bg-white text-slate-900 p-2 space-y-1.5 text-xs overflow-hidden">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="font-extrabold text-[10px] text-blue-700">
                      PORTEX Verified &bull; Top 5
                    </span>
                    <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                    </span>
                  </div>

                  {/* Phone Item 1: Royal Enfield */}
                  <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-50 border border-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=120&q=80"
                      alt="Bike"
                      className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-black text-[10px] text-slate-900 truncate">
                        Royal Enfield 350
                      </div>
                      <div className="text-[9px] font-bold text-blue-600">₹1,45,000</div>
                    </div>
                  </div>

                  {/* Phone Item 2: Luxury Apartment */}
                  <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-50 border border-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=120&q=80"
                      alt="Property"
                      className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-black text-[10px] text-slate-900 truncate">
                        2BHK Apartment, Silvassa
                      </div>
                      <div className="text-[9px] font-bold text-blue-600">₹42,00,000</div>
                    </div>
                  </div>

                  {/* Phone Item 3: Honda City */}
                  <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-50 border border-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=120&q=80"
                      alt="Car"
                      className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-black text-[10px] text-slate-900 truncate">
                        Honda City i-VTEC
                      </div>
                      <div className="text-[9px] font-bold text-blue-600">₹8,20,000</div>
                    </div>
                  </div>

                  {/* Phone Bottom CTA */}
                  <div className="pt-0.5 text-center">
                    <span className="inline-block w-full py-1 rounded-lg bg-blue-700 text-white text-[9px] font-bold">
                      View All Verified Sellers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. CATEGORIES GRID (Exact 2-Row Layout from Reference)
           ======================================================== */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Explore Categories
            </h2>
            <Link
              href="/marketplace"
              className="text-xs font-bold text-[#002f34] dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>See all categories</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Clean 5-column grid on desktop and tablet, mobile 5-col */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3.5">
            {screenshotCategories.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.slug === 'all' ? '/marketplace' : `/marketplace?cat=${item.slug}`}
                  className="group flex flex-col items-center p-2 sm:p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-md transition-all text-center"
                >
                  {/* Category Rounded Icon Box */}
                  <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-1.5 transition-transform duration-200 group-hover:scale-110 shadow-xs ${item.color}`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                  </div>

                  {/* Category Name */}
                  <span className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            3. "YOU ARE ELIGIBLE FOR VERIFIED" TRUST BANNER (Exact Replica)
           ======================================================== */}
        <section className="rounded-2xl border border-[#b8e2f2] dark:border-sky-800/60 bg-[#f0f8ff] dark:bg-sky-950/40 p-3.5 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3.5">
              {/* Blue Shield Icon */}
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-700 flex items-center justify-center flex-shrink-0 shadow-sm text-blue-600 dark:text-blue-400">
                <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                  You are eligible for Verified
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Gain instant trust of users and sell 3x faster with escrow security.
                </p>
              </div>
            </div>

            <button
              onClick={handleGetVerified}
              disabled={isVerifiedUnlocked}
              className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer ${
                isVerifiedUnlocked
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-[#002f34] dark:bg-blue-600 hover:bg-[#003d44] text-white shadow-sm hover:scale-[1.02]'
              }`}
            >
              {isVerifiedUnlocked ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Active</span>
                </>
              ) : (
                <span>Get Verified</span>
              )}
            </button>
          </div>
        </section>

        {/* ========================================================
            4. "RECOMMENDED FOR YOU" LISTINGS GRID (OLX Clean White Style)
           ======================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Recommended for you
              </span>
            </div>
            <Link
              href="/marketplace"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all
            </Link>
          </div>

          {/* Grid of Listings: exactly 2 per line on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>

        {/* ========================================================
            5. HYPERLOCAL PORTER MINI TRUCK & 2-WHEELER FLEET DISPATCH
           ======================================================== */}
        <section className="rounded-2xl sm:rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Integrated Porter Fleet
              </span>
              <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                Need Fast Pickup &amp; Door Delivery in Silvassa?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Book our verified 2-wheelers or Tata Ace mini trucks. GPS live tracking and transparent per-km rates.
              </p>
            </div>

            <Link
              href="/deliver"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 self-start sm:self-auto transition-transform hover:scale-105"
            >
              <Truck className="w-4 h-4" />
              <span>Book Porter Delivery</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {VEHICLE_OPTIONS.slice(0, 3).map((v) => (
              <div
                key={v.type}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">{v.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">&le; {v.maxWeightKg} kg &bull; ETA {v.etaMins} mins</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">₹{v.baseFare}</span>
                  <span className="text-[9px] text-slate-400 block">+ ₹{v.perKmRate}/km</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    )}

      </div>
    </div>
  );
}
