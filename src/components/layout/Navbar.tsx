'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Truck,
  PlusCircle,
  Search,
  MapPin,
  MessageSquare,
  Package,
  ShieldCheck,
  User as UserIcon,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Bell,
  Sparkles,
  Smartphone,
  Check,
  SlidersHorizontal,
  ArrowRight,
  Compass,
  Building2,
  HelpCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import { UserRole } from '@/types';
import { CATEGORIES } from '@/lib/data/mockData';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    userRole,
    setUserRole,
    currentUser,
    deliveries,
    conversations,
    listings,
    theme,
    toggleTheme,
  } = usePortex();

  const [selectedCity, setSelectedCity] = useState('Lucknow');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      alert(
        'To install PORTEX as an App:\n\n• On Chrome/Edge (PC): Click the Install icon (⊕) in the browser URL bar.\n• On Android: Tap Chrome menu (⋮) → "Install app" or "Add to Home screen".\n• On iPhone: Tap Share (⎋) in Safari → "Add to Home Screen".'
      );
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  const activeDeliveriesCount = deliveries.filter(d => d.status !== 'DELIVERED').length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const cities = [
    { name: 'Lucknow', state: 'Uttar Pradesh', hub: 'Central Hub' },
    { name: 'Delhi NCR', state: 'Delhi', hub: 'Express Hub' },
    { name: 'Bangalore', state: 'Karnataka', hub: 'Tech Hub' },
    { name: 'Mumbai', state: 'Maharashtra', hub: 'Metro Hub' },
    { name: 'Hyderabad', state: 'Telangana', hub: 'South Hub' },
  ];

  const roleMeta: Record<UserRole, { title: string; color: string; badge: string; desc: string }> = {
    BUYER: { title: 'Buyer Mode', color: 'bg-blue-600', badge: 'Shopper', desc: 'Browse marketplace & book deliveries' },
    SELLER: { title: 'Seller Mode', color: 'bg-emerald-600', badge: 'Merchant', desc: 'Manage your listings & accept offers' },
    DRIVER: { title: 'Driver Partner', color: 'bg-amber-600', badge: 'Logistics', desc: 'Accept trips, view earnings & GPS route' },
    ADMIN: { title: 'Admin Console', color: 'bg-purple-600', badge: 'Operations', desc: 'Platform GMV, KYC & GST settings' },
    ENTERPRISE: { title: 'Enterprise', color: 'bg-indigo-600', badge: 'Corporate', desc: 'Fleet contracts & recurring invoicing' },
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-all shadow-sm">
        {/* Top Micro Utility Bar (Desktop only) */}
        <div className="hidden lg:flex items-center justify-between text-[11px] py-1 px-4 sm:px-8 bg-slate-900 text-slate-300 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              PORTEX Hyperlocal Logistics Network Live
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-slate-400">Escrow Payment Protection &bull; Instant Porter Mini Truck Dispatch</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleInstallApp}
              className="flex items-center gap-1 text-slate-300 hover:text-white font-medium transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-400" />
              <span>Install Mobile App</span>
            </button>
            <span className="text-slate-700">|</span>
            <Link href="/driver" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              <span>Driver Partner Mode</span>
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="/admin" className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Admin &amp; GST Settings</span>
            </Link>
          </div>
        </div>

        {/* Main Navbar Bar */}
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-1 sm:gap-4">
          {/* Left: Brand Logo & City Picker */}
          <div className="flex items-center gap-1.5 sm:gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-emerald-500 text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                P
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-black text-lg sm:text-2xl tracking-tight text-slate-900 dark:text-white">
                    PORT<span className="text-blue-600 dark:text-blue-400">EX</span>
                  </span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hidden sm:inline">
                    PRO
                  </span>
                </div>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium -mt-1 hidden lg:block tracking-wide">
                  Marketplace + Porter Logistics
                </p>
              </div>
            </Link>

            {/* City Selector Pill */}
            <div className="relative" ref={cityDropdownRef}>
              <button
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200/80 dark:border-slate-700/60"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="truncate max-w-[65px] sm:max-w-[110px]">{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
              </button>

              {showCityDropdown && (
                <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select City Hub
                  </div>
                  {cities.map(c => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setSelectedCity(c.name);
                        setShowCityDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        selectedCity === c.name
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div>{c.name}</div>
                        <span className="text-[10px] text-slate-400 block">{c.state}</span>
                      </div>
                      {selectedCity === c.name && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center: Search Bar (Desktop & Tablet) */}
          <div className="hidden md:flex flex-1 max-w-lg lg:max-w-xl mx-2">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full flex items-center bg-slate-100/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all overflow-hidden"
            >
              <Search className="w-4 h-4 ml-3.5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search MacBook, Royal Enfield, Sofa, Porter Truck..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full py-2.5 px-3 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="mr-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right: Quick Action CTAs & User Menu */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle (Light / Dark Mode Button) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark and light mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Mobile Search Icon Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Deliver Something CTA (Porter mini truck) - Desktop only (in bottom nav on mobile) */}
            <Link
              href="/deliver"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 hover:from-emerald-500/25 hover:to-teal-500/25 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs border border-emerald-500/30 transition-all hover:scale-[1.02] shadow-sm"
            >
              <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Deliver</span>
              <span className="hidden xl:inline">Something</span>
            </Link>

            {/* Post Ad / Sell CTA - Desktop only (in bottom nav on mobile) */}
            <Link
              href="/sell"
              className="hidden md:flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Sell</span>
            </Link>

            {/* Chat Icon with live unread badge - Hidden on mobile (already in bottom nav) */}
            <Link
              href="/chat"
              className="hidden sm:flex relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Chat & Offers"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                  {unreadMessagesCount}
                </span>
              )}
            </Link>

            {/* Active Deliveries tracker icon */}
            <Link
              href="/tracking"
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block"
              title="Active Shipments"
            >
              <Package className="w-5 h-5" />
              {activeDeliveriesCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              )}
            </Link>

            {/* Profile & Role Switcher Menu */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="group flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-300/80 dark:border-slate-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                title={`Account: ${currentUser.name} (${roleMeta[userRole].title})`}
                aria-label="Profile and account menu"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
                    }}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500 ring-offset-1 ring-offset-white dark:ring-offset-slate-900 shadow-sm"
                  />
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${roleMeta[userRole].color} absolute -bottom-0.5 -right-0.5 border-2 border-white dark:border-slate-900`}
                  />
                </div>

                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[85px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                    {roleMeta[userRole].title}
                  </span>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-transform duration-200 hidden sm:block" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {/* User Profile Header */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-2 flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {currentUser.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        {roleMeta[userRole].title}
                      </span>
                    </div>
                  </div>

                  {/* Switch Persona Section */}
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Active Persona
                  </div>
                  <div className="space-y-1 mb-2">
                    {(Object.keys(roleMeta) as UserRole[]).map(role => (
                      <button
                        key={role}
                        onClick={() => {
                          setUserRole(role);
                          setShowProfileDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          userRole === role
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${roleMeta[role].color}`} />
                          <span>{roleMeta[role].title}</span>
                        </div>
                        {userRole === role && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1 pt-1 space-y-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setShowProfileDropdown(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-blue-500" />
                      <span>My Dashboard &amp; Ads</span>
                    </Link>
                    <Link
                      href="/tracking"
                      onClick={() => setShowProfileDropdown(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Truck className="w-4 h-4 text-emerald-500" />
                      <span>Live Shipments ({activeDeliveriesCount})</span>
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setShowProfileDropdown(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Building2 className="w-4 h-4 text-purple-500" />
                      <span>Admin &amp; Business GST</span>
                    </Link>

                    {/* Dark / Light Mode Switcher inside Profile Menu */}
                    <button
                      onClick={() => {
                        toggleTheme();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors border-t border-slate-100 dark:border-slate-800 mt-1 pt-2 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        {theme === 'dark' ? (
                          <Sun className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        )}
                        <span>Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {theme === 'dark' ? '☀️ Switch Light' : '🌙 Switch Dark'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay Bar (Toggles when mobile search clicked) */}
        {mobileSearchOpen && (
          <div className="md:hidden px-4 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search laptops, sofas, trucks..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Slide-Over Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 flex">
          <div className="w-[85%] max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-300 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg">
                  P
                </div>
                <span className="font-black text-xl text-slate-900 dark:text-white">
                  PORT<span className="text-blue-500">EX</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-5 space-y-5 flex-1">
              {/* Prominent User Profile Card on Mobile Drawer */}
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/60 rounded-2xl border border-blue-200/80 dark:border-slate-700 flex items-center gap-3.5 hover:shadow-md transition-all"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
                    }}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500 shadow-md"
                  />
                  <span
                    className={`w-3 h-3 rounded-full ${roleMeta[userRole].color} absolute bottom-0 right-0 border-2 border-white dark:border-slate-900`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                    {roleMeta[userRole].title} Mode
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              {/* Persona Switcher Pill */}
              <div className="p-3.5 bg-slate-100 dark:bg-slate-800 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Mode
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['BUYER', 'SELLER', 'DRIVER', 'ADMIN'] as UserRole[]).map(r => (
                    <button
                      key={r}
                      onClick={() => setUserRole(r)}
                      className={`p-2 rounded-xl text-[11px] font-bold text-center transition-all ${
                        userRole === r
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {roleMeta[r].badge}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Toggle in Mobile Drawer */}
              <div className="p-3.5 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-between border border-slate-200/80 dark:border-slate-700/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
                    {theme === 'dark' ? (
                      <Moon className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <Sun className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {theme === 'dark' ? 'Dark Theme' : 'Light Theme'}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Tap to switch interface theme
                    </span>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  {theme === 'dark' ? '☀️ Switch Light' : '🌙 Switch Dark'}
                </button>
              </div>

              {/* Primary Mobile Action Buttons */}
              <div className="space-y-2">
                <Link
                  href="/deliver"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full p-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-emerald-600/20 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Book Porter Delivery
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/sell"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full p-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-blue-600/20 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" /> Post an Ad / Sell
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1 text-xs font-bold text-slate-700 dark:text-slate-200">
                <Link
                  href="/marketplace"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-3 transition-colors"
                >
                  <Compass className="w-4 h-4 text-blue-500" /> Browse Marketplace
                </Link>

                <Link
                  href="/tracking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-emerald-500" /> My Deliveries
                  </span>
                  {activeDeliveriesCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                      {activeDeliveriesCount} Active
                    </span>
                  )}
                </Link>

                <Link
                  href="/chat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-blue-500" /> Messages &amp; Offers
                  </span>
                  {unreadMessagesCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white">
                      {unreadMessagesCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/driver"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-3 transition-colors text-amber-600 dark:text-amber-400"
                >
                  <Truck className="w-4 h-4" /> Driver Partner Hub
                </Link>

                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-3 transition-colors text-purple-600 dark:text-purple-400"
                >
                  <Building2 className="w-4 h-4" /> Enterprise Admin &amp; GST
                </Link>
              </div>

              {/* Install PWA Prompt inside mobile drawer */}
              <div className="pt-2">
                <button
                  onClick={handleInstallApp}
                  className="w-full p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Install PORTEX App</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
              <p className="font-semibold text-slate-700 dark:text-slate-300">MANGO TECH ENTERPRISES</p>
              <p className="font-mono text-[10px]">GSTIN: 09ABRFM9138P1Z3 &bull; Lucknow</p>
            </div>
          </div>

          {/* Clickable Backdrop to close */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
}
