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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            PORTEX Marketplace
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified secondhand items with instant Porter on-demand pickup &amp; delivery
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Meesho-style Quick Speak Button */}
          <button
            onClick={() => openVoiceSearch()}
            className="px-4 py-2 bg-[#8b1874] hover:bg-[#72135f] text-white text-xs font-black rounded-xl shadow-md shadow-purple-900/20 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Click to speak (English or Hindi)"
          >
            <Mic className="w-4 h-4 animate-pulse text-amber-300" />
            <span>Speak</span>
          </button>

          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <Link
            href="/sell"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Post Ad</span>
          </Link>
        </div>
      </div>

      {/* Meesho-Style Voice & Smart Search Experience Hub (Screenshot 1 Match) */}
      <div className="bg-gradient-to-br from-purple-50/80 via-white to-fuchsia-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-purple-950/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-purple-200/70 dark:border-purple-900/30 shadow-sm space-y-4">
        {/* Search Bar matching Meesho header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Keyword or Product (e.g. shoe for man 10, saree, MacBook)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  addRecentSearch(searchQuery.trim());
                }
              }}
              className="w-full pl-10 pr-20 py-2.5 sm:py-3 bg-white dark:bg-slate-800/90 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white border border-purple-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-10 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => openVoiceSearch()}
              className="absolute right-3 top-2.5 p-1 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/50 rounded-lg transition-transform hover:scale-110"
              title="Voice Search"
              aria-label="Speak search"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => openVoiceSearch()}
            className="flex-shrink-0 px-6 py-2.5 sm:py-3 bg-[#8b1874] hover:bg-[#72135f] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-purple-900/25 flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Mic className="w-4 h-4 animate-bounce text-amber-300" />
            <span>Speak</span>
          </button>
        </div>

        {/* Two Columns: Recent Searches + Popular Searches (Exact Meesho Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-purple-100 dark:border-slate-800">
          {/* Your Recent Searches */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Your Recent Searches</span>
              </h3>
              {recentSearches.length > 0 && (
                <button
                  onClick={clearRecentSearches}
                  className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {recentSearches.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between group p-1.5 px-2.5 rounded-xl hover:bg-purple-100/60 dark:hover:bg-slate-800/70 transition-colors"
                >
                  <button
                    onClick={() => handleSelectQuery(item)}
                    className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-400 text-left truncate flex-1 font-medium"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{item}</span>
                  </button>
                  <button
                    onClick={() => removeRecentSearch(item)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 transition-opacity"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Searches Chips */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Popular Searches</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SEARCHES.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectQuery(chip)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    searchQuery.toLowerCase() === chip.toLowerCase()
                      ? 'bg-[#8b1874] text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Meesho Shopping Banner Card with Purple Speak Button */}
        <div className="mt-2 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-100 via-fuchsia-50 to-pink-100 dark:from-purple-950/40 dark:via-slate-900 dark:to-fuchsia-950/30 border border-purple-200/80 dark:border-purple-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8b1874] text-white flex items-center justify-center font-black text-lg shadow flex-shrink-0">
              🎤
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                Jhumka Bareilly ka ya Saree Banarasi?
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Speak what you ❤️ in Hindi or English — PORTEX instant voice search will find it!
              </p>
            </div>
          </div>

          <button
            onClick={() => openVoiceSearch()}
            className="px-5 py-2 bg-[#8b1874] hover:bg-[#72135f] text-white font-bold text-xs rounded-xl shadow-md shadow-purple-900/20 flex items-center gap-1.5 flex-shrink-0 transition-transform hover:scale-105 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-amber-300" />
            <span>Speak Now</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Filters Sidebar + Right Listings Results */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {/* Left Filter Sidebar */}
        <aside
          className={`space-y-6 ${
            showMobileFilters ? 'block' : 'hidden md:block'
          } bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 h-fit sticky top-24`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" /> Filters
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedCondition('all');
                setMaxPrice(250000);
                setVerifiedOnly(false);
              }}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Search Keywords */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Keywords
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search titles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => openVoiceSearch()}
                className="absolute right-2 top-2 p-1 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-slate-700 rounded-lg"
                title="Speak keyword"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Category
            </label>
            <div className="space-y-1">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    selectedCategory === c.slug
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-[10px] text-slate-400">{c.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Max Price</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
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
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹5k</span>
              <span>₹1 Lakh</span>
              <span>₹2.5 Lakh</span>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Condition
            </label>
            <select
              value={selectedCondition}
              onChange={e => setSelectedCondition(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Conditions</option>
              <option value="BRAND_NEW">Brand New</option>
              <option value="LIKE_NEW">Like New</option>
              <option value="EXCELLENT">Excellent</option>
              <option value="GOOD">Good</option>
            </select>
          </div>

          {/* Verified Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={e => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
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

      {/* Floating Meesho-style Speak Button at Bottom (matches Screenshot 1) */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => openVoiceSearch()}
          className="px-5 py-3 rounded-full bg-[#8b1874] hover:bg-[#72135f] text-white font-black text-sm shadow-2xl flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95 border-2 border-purple-300/40 group cursor-pointer"
          title="Voice search (Speak in English or Hindi)"
          aria-label="Speak search"
        >
          <div className="relative">
            <Mic className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span>Speak</span>
        </button>
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
