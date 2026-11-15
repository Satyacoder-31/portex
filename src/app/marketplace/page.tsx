'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Truck,
  ShieldCheck,
  PlusCircle,
  X,
  ChevronDown,
  ArrowUpDown,
  Zap,
  Mic,
  Clock,
  Sparkles,
  Trash2,
  Volume2,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import { CATEGORIES, POPULAR_SEARCHES } from '@/lib/data/mockData';
import ListingCard from '@/components/marketplace/ListingCard';
import Link from 'next/link';

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const {
    listings,
    userRole,
    currentUser,
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    openVoiceSearch,
  } = usePortex();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(250000);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [includeExpired, setIncludeExpired] = useState(true);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'newest'>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showVoiceSearchTray, setShowVoiceSearchTray] = useState(false);

  // Sync search query when url params change (e.g. from voice search or navbar)
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
      if (q) addRecentSearch(q);
    }
  }, [searchParams]);

  const handleSelectQuery = (term: string) => {
    setSearchQuery(term);
    addRecentSearch(term);
  };

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings
      .filter(item => {
        // Query search
        if (
          searchQuery &&
          !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.description.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // Condition filter
        if (selectedCondition !== 'all' && item.condition !== selectedCondition) {
          return false;
        }

        // Price filter
        if (item.price > maxPrice) {
          return false;
        }

        // Verified seller filter
        if (verifiedOnly && !item.sellerIsVerified) {
          return false;
        }

        // Sold or Inactive items must NOT show in the buyers login
        if (item.status === 'SOLD' || item.status === 'EXPIRED') {
          return false;
        }

        // Strict Admin Verification Gate:
        // Unless and until the Admin accepts/approves the item, it must NOT go live or be visible to buyers.
        const isApproved = (item.verificationStatus || 'APPROVED') === 'APPROVED';
        if (!isApproved && userRole !== 'ADMIN') {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        return 0; // featured/newest
      });
  }, [listings, searchQuery, selectedCategory, selectedCondition, maxPrice, verifiedOnly, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Role Alert Banners (Guidance for non-buyer roles) */}
      {userRole === 'DRIVER' && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-black text-amber-900 dark:text-amber-300">
                You are currently in Driver Partner (Pilot) Mode
              </h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-400">
                Driver pilots manage logistical bookings, cargo deliveries and trip earnings, not consumer shopping.
              </p>
            </div>
          </div>
          <Link
            href="/driver"
            className="py-2 px-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-sm self-start sm:self-auto flex-shrink-0 transition-colors"
          >
            Go to Pilot Cockpit &rarr;
          </Link>
        </div>
      )}

      {userRole === 'ENTERPRISE' && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-300">
                You are currently in B2B Enterprise Shipper Mode
              </h4>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Enterprise accounts manage commercial fleet dispatches, warehouse hubs &amp; 18% GST tax invoices.
              </p>
            </div>
          </div>
          <Link
            href="/deliver"
            className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-sm self-start sm:self-auto flex-shrink-0 transition-colors"
          >
            Go to Fleet Dispatcher &rarr;
          </Link>
        </div>
      )}
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            PORT<span className="text-amber-400">EX</span> Marketplace
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Verified secondhand items with instant Porter on-demand pickup &amp; delivery
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 border border-amber-500/30 rounded-xl text-xs font-semibold text-zinc-300"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span>Filters</span>
          </button>

          <Link
            href="/sell"
            className="px-4 py-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-black text-xs font-black rounded-xl shadow-md shadow-amber-500/25 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-black" />
            <span>+ Post Ad</span>
          </Link>
        </div>
      </div>

      {/* Clean Portex Search Bar with Voice Input (Permission Protected) */}
      <div className="p-2 sm:p-3 bg-[#0e0e13] rounded-2xl border border-amber-500/30 shadow-lg flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-amber-400/80" />
          <input
            type="text"
            placeholder="Search verified products, laptops, furniture, vehicles..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-zinc-950 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 border border-zinc-800 focus:outline-none focus:border-amber-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => openVoiceSearch()}
          className="px-3.5 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          title="Search using microphone voice input"
        >
          <Mic className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Voice Search</span>
        </button>
      </div>

      {/* Main Grid: Left Filters Sidebar + Right Listings Results */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {/* Left Filter Sidebar */}
        <aside
          className={`space-y-6 ${
            showMobileFilters ? 'block' : 'hidden md:block'
          } bg-[#0e0e13] p-5 rounded-2xl border border-zinc-800 h-fit sticky top-24`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <span className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" /> Filters
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedCondition('all');
                setMaxPrice(250000);
                setVerifiedOnly(false);
              }}
              className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Search Keywords */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Keywords
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-amber-400/80" />
              <input
                type="text"
                placeholder="Search titles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-2 bg-zinc-950 rounded-xl text-xs text-white border border-zinc-800 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => openVoiceSearch()}
                className="absolute right-2 top-2 p-1 text-amber-400 hover:bg-amber-500/10 rounded-lg"
                title="Speak keyword"
              >
                <Mic className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              Category
            </label>
            <div className="space-y-1">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    selectedCategory === c.slug
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-[10px] text-zinc-500">{c.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-zinc-300 mb-1.5">
              <span>Max Price</span>
              <span className="font-bold text-amber-400 font-mono">
                ₹{maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="250000"
              step="5000"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
              <span>₹5k</span>
              <span>₹1 Lakh</span>
              <span>₹2.5 Lakh</span>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Condition
            </label>
            <select
              value={selectedCondition}
              onChange={e => setSelectedCondition(e.target.value)}
              className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Conditions</option>
              <option value="BRAND_NEW">Brand New</option>
              <option value="LIKE_NEW">Like New</option>
              <option value="EXCELLENT">Excellent</option>
              <option value="GOOD">Good</option>
            </select>
          </div>

          {/* Verified Toggle */}
          <div className="pt-2 border-t border-zinc-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-300">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={e => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Verified Sellers Only
              </span>
            </label>
          </div>
        </aside>

        {/* Right Product Grid */}
        <main className="md:col-span-3 space-y-4">
          {/* Header Results Bar with Sorting */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-400">
              Showing <strong className="text-slate-900 dark:text-white">{filteredListings.length}</strong> items in Lucknow
            </span>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Recently Posted</option>
              </select>
            </div>
          </div>

          {/* Listings Grid: 2 items per line on mobile, 3 on desktop */}
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-5">
              {filteredListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                No matching listings found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range or clearing category filters to see more results.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setMaxPrice(250000);
                  setVerifiedOnly(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading marketplace...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
