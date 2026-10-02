'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  Package,
  ShieldCheck,
  ShoppingBag,
  Zap,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  Banknote,
  DollarSign,
  Award,
  Phone,
  Power,
  Sparkles,
  Layers,
  ChevronRight,
  Eye,
  MessageSquare,
  Building2,
  FileText,
  AlertCircle,
  Navigation,
  FileCheck,
  Flame,
  Download,
  ExternalLink,
  Shield,
  Star,
  Wrench,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import { UserRole } from '@/types';
import confetti from 'canvas-confetti';

/**
 * 1. PERSISTENT PERSONA SWITCHER BAR
 * Gives users an instant 1-click way to see how the platform transforms
 * for each role (Buyer, Enterprise Shipper, Marketplace Seller, Fleet Driver).
 */
export function PersonaSwitcherBar() {
  const { userRole, setUserRole, currentUser, googleAccounts, switchGoogleAccount, showToast } = usePortex();

  const personas: {
    role: UserRole;
    label: string;
    description: string;
    icon: any;
    color: string;
    sampleAccountId: string;
  }[] = [
    {
      role: 'BUYER',
      label: 'Buyer & Courier',
      description: 'Shop items & book city parcel',
      icon: ShoppingBag,
      color: 'from-blue-600 to-indigo-600',
      sampleAccountId: 'usr_google_krishna',
    },
    {
      role: 'ENTERPRISE',
      label: 'Logistics Shipper',
      description: 'Fleet freight & 18% GST invoices',
      icon: Truck,
      color: 'from-emerald-600 to-teal-600',
      sampleAccountId: 'usr_google_amit',
    },
    {
      role: 'SELLER',
      label: 'Marketplace Seller',
      description: 'Manage store, offers & UPI payouts',
      icon: Layers,
      color: 'from-indigo-600 to-purple-600',
      sampleAccountId: 'usr_google_priya',
    },
    {
      role: 'DRIVER',
      label: 'Driver Partner',
      description: 'Live radar, trips & daily earnings',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      sampleAccountId: 'usr_google_rajesh',
    },
  ];

  const handleSwitchPersona = (role: UserRole, accountId: string) => {
    setUserRole(role);
    // Also switch to the corresponding demo account if available
    const matched = googleAccounts.find(a => a.id === accountId || a.role === role);
    if (matched) {
      switchGoogleAccount(matched.id);
    } else {
      showToast(`Switched active view to ${role} Mode`);
    }
  };

  return (
    <div className="mb-6 p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
            />
            <span className="w-3 h-3 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 border-2 border-white dark:border-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 dark:text-white">
                {currentUser.name}
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                Active: {userRole} MODE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              The entire platform UI strictly adapts to your active role. Click any persona to switch:
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {personas.map(p => {
          const isActive = userRole === p.role;
          const Icon = p.icon;
          return (
            <button
              key={p.role}
              type="button"
              onClick={() => handleSwitchPersona(p.role, p.sampleAccountId)}
              className={`p-2.5 sm:p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                isActive
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 border-slate-950 dark:border-white shadow-md scale-[1.02]'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isActive && (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-emerald-500 text-white">
                    LIVE
                  </span>
                )}
              </div>
              <h4 className="text-xs font-black truncate">{p.label}</h4>
              <p
                className={`text-[10px] line-clamp-1 mt-0.5 ${
                  isActive ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {p.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 2. DRIVER PARTNER HOMEPAGE VIEW (100% PURE PORTER LOGISTICS)
 * Absolutely zero OLX or second-hand marketplace clutter.
 * Features: Duty status toggle, live radar pings, turn-by-turn routes,
 * daily earnings, completed trip logs, vehicle specs & Lucknow high surge zones.
 */
export function DriverHomeView() {
  const { isDriverOnline, setIsDriverOnline, driverEarnings, showToast } = usePortex();
  const [hasAcceptedSample, setHasAcceptedSample] = useState(false);
  const [completedTrips, setCompletedTrips] = useState([
    {
      id: 'PRTX-8491',
      pickup: 'Warehouse 4, Transport Nagar',
      drop: 'Hazratganj Main Market',
      vehicle: 'Tata Ace Gold',
      cargo: 'Carton Electronics (450 kg)',
      time: '10:45 AM',
      distance: '12.4 km',
      fare: 380,
      paymentMethod: 'CASH_COLLECTED',
      rating: 5.0,
    },
    {
      id: 'PRTX-8488',
      pickup: 'Alambagh Wholesale Depot',
      drop: 'Gomti Nagar Extension, Sec 4',
      vehicle: 'Tata Ace Gold',
      cargo: 'Furniture & Sofa Load',
      time: '01:15 PM',
      distance: '18.2 km',
      fare: 540,
      paymentMethod: 'ONLINE_ESCROW',
      rating: 5.0,
    },
    {
      id: 'PRTX-8472',
      pickup: 'Charbagh Railway Cargo Terminal',
      drop: 'Indira Nagar Sector 14',
      vehicle: 'Tata Ace Gold',
      cargo: 'Machinery Spares & Belts',
      time: '03:30 PM',
      distance: '9.8 km',
      fare: 420,
      paymentMethod: 'ONLINE_ESCROW',
      rating: 4.9,
    },
    {
      id: 'PRTX-8450',
      pickup: 'Talkatora Industrial Area',
      drop: 'Vikas Nagar Central Road',
      vehicle: 'Tata Ace Gold',
      cargo: 'Plastic Raw Material Crates',
      time: '05:10 PM',
      distance: '14.1 km',
      fare: 500,
      paymentMethod: 'ONLINE_ESCROW',
      rating: 5.0,
    },
  ]);

  const handleAcceptJob = () => {
    setHasAcceptedSample(true);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    showToast('Trip Accepted! GPS Navigation route to Transport Nagar is loaded.');
  };

  const handleCompleteCurrentTrip = () => {
    setHasAcceptedSample(false);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
    showToast('Trip Marked DELIVERED! ₹480 credited to your Pilot Wallet.');
    // Add to completed list
    setCompletedTrips(prev => [
      {
        id: 'PRTX-8499',
        pickup: 'Warehouse 4, Transport Nagar',
        drop: 'Gomti Nagar Extension, Sec 4',
        vehicle: 'Tata Ace Gold',
        cargo: 'Electronics Carton Boxes',
        time: 'Just now',
        distance: '8.2 km',
        fare: 480,
        paymentMethod: 'ONLINE_ESCROW',
        rating: 5.0,
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6 mb-10">
      {/* Top Cockpit Header */}
      <div className="p-6 bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg">
                RK
              </div>
              {isDriverOnline && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black">Rajesh Kumar (Pilot Cockpit)</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Tata Ace Gold &bull; 4.98 ⭐
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Porter Platinum Partner
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Lucknow Transport Hub &bull; Vehicle: <span className="font-mono text-amber-300 font-bold">UP 32 EN 4920</span> &bull; 1 Helper Attached
              </p>
            </div>
          </div>

          {/* Duty Status Toggle */}
          <div className="flex items-center gap-4 bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Duty Status
              </span>
              <span
                className={`text-xs font-black ${isDriverOnline ? 'text-emerald-400' : 'text-slate-400'}`}
              >
                {isDriverOnline ? 'ONLINE (Receiving Trips)' : 'OFFLINE (Paused)'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsDriverOnline(!isDriverOnline);
                showToast(isDriverOnline ? 'You went OFFLINE' : 'You are now ONLINE! Ready for trips.');
              }}
              className={`py-2 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                isDriverOnline
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{isDriverOnline ? 'GO OFFLINE' : 'GO ONLINE'}</span>
            </button>
          </div>
        </div>

        {/* Driver KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Today's Earnings</span>
            <div className="text-lg font-black text-emerald-400 mt-0.5">₹{driverEarnings.today || 1840}.00</div>
            <span className="text-[10px] text-slate-500 font-semibold">+₹380 pending payout</span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Trips Completed</span>
            <div className="text-lg font-black text-white mt-0.5">{completedTrips.length} Trips</div>
            <span className="text-[10px] text-emerald-400 font-semibold">100% On-Time</span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Fuel Incentive</span>
            <div className="text-lg font-black text-amber-400 mt-0.5">₹250.00</div>
            <span className="text-[10px] text-slate-500 font-semibold">Unlocked for &gt;50km</span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Acceptance Rate</span>
            <div className="text-lg font-black text-blue-400 mt-0.5">98.4%</div>
            <span className="text-[10px] text-emerald-400 font-semibold">Top Tier Partner</span>
          </div>
        </div>
      </div>

      {/* Main Driver Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 8 Cols: Live Trip Radar, Active Trip & Completed Trips History */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section: Live Radar Pings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Live Trip Radar (Nearby Dispatch Bookings)
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-semibold">Auto-refreshing &bull; 5s ago</span>
            </div>

            {!hasAcceptedSample ? (
              /* Incoming Job Offer Card */
              <div className="p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent dark:bg-slate-900 rounded-3xl border-2 border-amber-500/40 shadow-xl space-y-4 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          Tata Ace (Chota Hathi) Booking
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                          ₹480 FARE
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">Shipper: Amit Sharma (Electronics Carton Boxes)</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 block">
                      8.2 KM &bull; ~22 Mins
                    </span>
                    <span className="text-[10px] text-slate-500">1 Helper Included (+₹100)</span>
                  </div>
                </div>

                {/* Route Path */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="font-bold text-slate-900 dark:text-white">Pickup:</span>
                    <span className="text-slate-600 dark:text-slate-300 truncate">
                      Warehouse 4, Transport Nagar, Kanpur Road, Lucknow
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500 flex-shrink-0" />
                    <span className="font-bold text-slate-900 dark:text-white">Drop:</span>
                    <span className="text-slate-600 dark:text-slate-300 truncate">
                      Gomti Nagar Extension, Sector 4, Lucknow (2nd Floor Lift)
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAcceptJob}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ACCEPT TRIP (₹480 FARE)</span>
                  </button>
                  <Link
                    href="/driver"
                    className="px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors"
                  >
                    Cockpit Map &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              /* Active Trip In Progress Card */
              <div className="p-5 bg-emerald-50 dark:bg-emerald-950/20 rounded-3xl border-2 border-emerald-500/50 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h3 className="font-black text-sm text-emerald-950 dark:text-emerald-300">
                        Active Trip: PRTX-8499 (Amit Sharma)
                      </h3>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                        En Route to Pickup &bull; Warehouse 4, Transport Nagar
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-500/30">
                    ₹480 EARNINGS
                  </span>
                </div>

                {/* Progress Visualizer */}
                <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <Navigation className="w-4 h-4 animate-spin" /> Arriving in 6 mins
                    </span>
                    <span>Distance: 2.1 km to dock</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[45%]" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Link
                    href="/driver"
                    className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Open Turn-by-Turn GPS Map</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleCompleteCurrentTrip}
                    className="py-2.5 px-4 bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/30 cursor-pointer"
                  >
                    Verify OTP &amp; Complete Trip
                  </button>

                  <a
                    href="tel:+919876543210"
                    className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Shipper</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Section: Today's Completed Trip Logs (Pure Porter Delivery History) */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Today's Completed Trips ({completedTrips.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Fare receipts, on-time delivery ratings &amp; cash/escrow settlement
                </p>
              </div>
              <Link
                href="/dashboard?tab=trips"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                All Trips &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {completedTrips.map(trip => (
                <div
                  key={trip.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {trip.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        COMPLETED
                      </span>
                      <span className="text-[10px] text-slate-400">&bull; {trip.time}</span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold">{trip.pickup}</span>
                      <span className="text-slate-400">&rarr;</span>
                      <span className="font-semibold">{trip.drop}</span>
                    </div>

                    <div className="text-[10px] text-slate-500">
                      {trip.cargo} &bull; {trip.distance} &bull; ⭐ {trip.rating}
                    </div>
                  </div>

                  <div className="text-left sm:text-right flex-shrink-0">
                    <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      ₹{trip.fare}.00
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      {trip.paymentMethod === 'CASH_COLLECTED' ? '💵 Cash Received' : '🛡️ Escrow Settled'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Lucknow High-Surge Logistics Heatmap Zones */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Lucknow Logistics Surge Zones (Higher Payouts)
                </h3>
              </div>
              <span className="text-xs text-orange-600 dark:text-orange-400 font-bold">
                Live Heatmap
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/40 rounded-2xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Transport Nagar Central Hub
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-orange-500 text-white">
                    +₹50 / TRIP
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Peak outward warehouse dispatches. High demand for Tata Ace &amp; Pickup trucks.
                </p>
              </div>

              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Talkatora Industrial Estate
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-white">
                    +₹40 / TRIP
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Machinery spares &amp; factory carton movements. Quick turnaround loading.
                </p>
              </div>

              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Amausi Airport Cargo Depot
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                    +₹30 / TRIP
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Air courier transshipment. Light package transfers to city center.
                </p>
              </div>

              <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 rounded-2xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Chinhat Wholesale Mandi
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-600 text-white">
                    +₹25 / TRIP
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">
                  FMCG bulk crate delivery into residential colonies.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Vehicle Details, Compliance & Pilot Utilities */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card: Vehicle Specs & Regulatory Documents */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Fleet Vehicle &amp; RC Specs
                </h3>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                VERIFIED
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Vehicle Model:</span>
                <span className="font-bold text-slate-900 dark:text-white">Tata Ace Gold (CNG)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Registration No:</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">UP 32 EN 4920</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Commercial RC:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active (Goods Carrier)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Commercial Insurance:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Valid till Nov 2027</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">PUC / Fitness:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Valid till Aug 2027</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Helper Attached:</span>
                <span className="font-bold text-slate-900 dark:text-white">1 Helper (Ramesh)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Max Payload:</span>
                <span className="font-bold text-slate-900 dark:text-white">750 kg (Chota Hathi)</span>
              </div>
            </div>

            <Link
              href="/dashboard?tab=vehicle"
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <span>Manage Vehicle &amp; KYC</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card: Quick Pilot Tools */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Pilot Quick Operations
            </h3>

            <Link
              href="/driver"
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Full Cockpit GPS Map
                  </span>
                  <span className="text-[10px] text-slate-400">Radar &amp; turn-by-turn routing</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/dashboard?tab=earnings"
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Withdraw Wallet Payout
                  </span>
                  <span className="text-[10px] text-emerald-500">₹{driverEarnings.today} available for instant UPI</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/chat"
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Driver SOS &amp; Support 24x7
                  </span>
                  <span className="text-[10px] text-slate-400">Direct line to logistics dispatcher</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

/**
 * 3. ENTERPRISE LOGISTICS SHIPPERS HOMEPAGE VIEW (100% COMMERCIAL B2B)
 * Absolutely zero consumer second-hand ads or OLX items.
 * Dedicated to: Commercial Fleet Hiring, 18% GST Input Tax Credit (ITC),
 * active consignment tracking & warehouse loading dock management.
 */
export function EnterpriseHomeView() {
  const { showToast } = usePortex();
  const [downloadingInv, setDownloadingInv] = useState<string | null>(null);

  const handleDownloadInvoice = (invNum: string) => {
    setDownloadingInv(invNum);
    setTimeout(() => {
      setDownloadingInv(null);
      showToast(`Tax Invoice ${invNum} downloaded! Valid for GSTR-2B ITC.`);
    }, 800);
  };

  return (
    <div className="space-y-6 mb-10">
      {/* Enterprise Operations Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black">Sharma Electronics &amp; Logistics Hub</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  GST Verified B2B Shipper
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  GSTR-2B Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                GSTIN: <span className="font-mono text-emerald-400 font-bold">09AAECS1429B1Z2</span> &bull; Transport Nagar Central Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/deliver"
              className="py-3 px-5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Truck className="w-4 h-4" />
              <span>+ Dispatch New Fleet</span>
            </Link>

            <Link
              href="/dashboard?tab=invoices"
              className="py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/15 transition-colors"
            >
              GST Tax Invoices
            </Link>
          </div>
        </div>

        {/* Enterprise Operations KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-300 uppercase block">Active Commercial Trips</span>
            <div className="text-lg font-black text-emerald-400 mt-0.5">2 Trucks on Route</div>
            <span className="text-[10px] text-slate-400 font-semibold">1 Tata Ace, 1 Eicher</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-300 uppercase block">Freight Moved (This Mo.)</span>
            <div className="text-lg font-black text-white mt-0.5">18.4 Tons</div>
            <span className="text-[10px] text-emerald-400 font-semibold">+14% vs Last Month</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-300 uppercase block">18% GST ITC Saved</span>
            <div className="text-lg font-black text-amber-400 mt-0.5">₹14,250.00</div>
            <span className="text-[10px] text-slate-400 font-semibold">100% Tax Deductible</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-300 uppercase block">Dedicated Loading Helpers</span>
            <div className="text-lg font-black text-teal-400 mt-0.5">3 Assigned</div>
            <span className="text-[10px] text-emerald-400 font-semibold">Ground Floor &amp; Docks</span>
          </div>
        </div>
      </div>

      {/* Fleet Fast-Track Dispatch Station */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              Instant Commercial Fleet Dispatcher
            </h2>
            <p className="text-xs text-slate-500">
              One-click commercial hiring with pre-filled loading dock &amp; GST tax invoice
            </p>
          </div>
          <Link
            href="/deliver"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Custom Fleet Setup &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Link
            href="/deliver?vehicle=TATA_ACE_MINI_TRUCK"
            className="p-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20 hover:border-emerald-600 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-900 dark:text-white">Tata Ace (750 kg)</span>
              <span className="text-xs font-black text-emerald-600">₹220 base</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">Cartons, electronics, medium pallet cargo.</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
              Book for Warehouse &rarr;
            </span>
          </Link>

          <Link
            href="/deliver?vehicle=PICKUP_8FT"
            className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-600 bg-white dark:bg-slate-900 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-900 dark:text-white">8ft Pickup (1.2 Tons)</span>
              <span className="text-xs font-black text-emerald-600">₹320 base</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">Industrial machinery, bulk commercial wood, heavy coils.</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
              Book for Warehouse &rarr;
            </span>
          </Link>

          <Link
            href="/deliver?vehicle=EICHER_14FT"
            className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-600 bg-white dark:bg-slate-900 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-900 dark:text-white">14ft Eicher (3.5 Tons)</span>
              <span className="text-xs font-black text-emerald-600">₹650 base</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">Full container freight, wholesale shifting across UP.</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
              Book for Warehouse &rarr;
            </span>
          </Link>

          <Link
            href="/deliver?vehicle=PICKUP_8FT"
            className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-600 bg-white dark:bg-slate-900 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-900 dark:text-white">Bolero Maxi (2 Tons)</span>
              <span className="text-xs font-black text-emerald-600">₹480 base</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">Heavy appliances, commercial crates, pallet shifting.</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
              Book for Warehouse &rarr;
            </span>
          </Link>
        </div>
      </div>

      {/* Active Commercial Consignments Live Tracking Table */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              Live Commercial Consignments (Freight In-Transit)
            </h2>
            <p className="text-xs text-slate-500">
              Real-time driver location, vehicle registration and loading bay status
            </p>
          </div>
          <Link
            href="/tracking"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Full Fleet Map &rarr;
          </Link>
        </div>

        <div className="space-y-3">
          {/* Item 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  Consignment #PRTX-ENT-901
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                  IN-TRANSIT
                </span>
                <span className="text-[10px] text-slate-400 font-mono">E-Way Bill: 891240182</span>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                45x Smart TV Cartons (520 kg) &bull; Tata Ace (UP 32 EN 4920)
              </div>
              <div className="text-[11px] text-slate-500">
                Route: Warehouse 4 (Transport Nagar) &rarr; Alambagh Retail Hub &bull; Pilot: Rajesh Kumar
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                ETA 14 Mins
              </span>
              <Link
                href="/tracking"
                className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Track Live
              </Link>
            </div>
          </div>

          {/* Item 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  Consignment #PRTX-ENT-884
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600">
                  LOADING AT DOCK B
                </span>
                <span className="text-[10px] text-slate-400 font-mono">E-Way Bill: 891240177</span>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                12x Refrigerator Units (1.8 Tons) &bull; 14ft Eicher (UP 32 EZ 4912)
              </div>
              <div className="text-[11px] text-slate-500">
                Route: Transport Nagar Central &rarr; Gomti Nagar Extension Distribution &bull; Pilot: Mohd. Imran
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-xl border border-blue-500/30">
                2 Helpers Loading
              </span>
              <Link
                href="/tracking"
                className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Track Live
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 18% GST B2B Tax Invoices & ITC Credit Breakdown */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              B2B GST Tax Invoices &amp; 18% Input Tax Credit
            </h2>
            <p className="text-xs text-slate-500">
              Download GST tax invoices with HSN Code 9965 (Freight Transport by Road) for monthly GSTR-2B filing
            </p>
          </div>
          <Link
            href="/dashboard?tab=invoices"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            All Tax Invoices &rarr;
          </Link>
        </div>

        <div className="space-y-3">
          {[
            {
              invoiceNo: 'INV-PRTX-2026-0891',
              date: '28 Sep 2026',
              hsn: '9965',
              baseAmount: 3400,
              gstAmount: 612,
              total: 4012,
              fleet: 'Tata Ace &bull; 8 Dispatches',
            },
            {
              invoiceNo: 'INV-PRTX-2026-0854',
              date: '21 Sep 2026',
              hsn: '9965',
              baseAmount: 8200,
              gstAmount: 1476,
              total: 9676,
              fleet: '14ft Eicher &bull; Heavy Container',
            },
            {
              invoiceNo: 'INV-PRTX-2026-0812',
              date: '14 Sep 2026',
              hsn: '9965',
              baseAmount: 5100,
              gstAmount: 918,
              total: 6018,
              fleet: '8ft Pickup &bull; Industrial Raw Stock',
            },
          ].map(inv => (
            <div
              key={inv.invoiceNo}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {inv.invoiceNo}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-600">
                    HSN {inv.hsn}
                  </span>
                  <span className="text-[10px] text-slate-400">&bull; {inv.date}</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-1" dangerouslySetInnerHTML={{ __html: inv.fleet }} />
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                  18% GST (CGST ₹{inv.gstAmount / 2} + SGST ₹{inv.gstAmount / 2}): ITC Eligible
                </div>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                <div className="text-left sm:text-right">
                  <div className="text-sm font-black text-slate-900 dark:text-white">₹{inv.total}</div>
                  <span className="text-[10px] text-slate-400">₹{inv.baseAmount} + ₹{inv.gstAmount} tax</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadInvoice(inv.invoiceNo)}
                  disabled={downloadingInv === inv.invoiceNo}
                  className="py-2 px-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{downloadingInv === inv.invoiceNo ? 'Generating...' : 'PDF Invoice'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 4. MARKETPLACE SELLER HOMEPAGE VIEW (100% SELLER STUDIO & DISPATCH)
 * For store merchants & individual sellers:
 * Store metrics, buyer price negotiations, UPI escrow payouts,
 * and 1-click Porter courier dispatch to ship sold goods to buyers.
 */
export function SellerHomeView() {
  const { listings, currentUser, showToast } = usePortex();
  const [hasAcceptedOffer1, setHasAcceptedOffer1] = useState(false);
  const [hasAcceptedOffer2, setHasAcceptedOffer2] = useState(false);

  const myListings = listings.filter(l => l.sellerId === currentUser.id || l.sellerName === currentUser.name);

  return (
    <div className="space-y-6 mb-10">
      {/* Seller Studio Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white rounded-3xl border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black text-2xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black">Patel Curated Home &amp; Vintage Studio</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Verified Merchant Store
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  4.88 ⭐ (42 Deals)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                UPI Escrow Linked: <span className="font-mono text-emerald-400 font-bold">priyapatel@okaxis</span> &bull; 0% Platform Commission
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sell"
              className="py-3 px-5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Post New Product</span>
            </Link>

            <Link
              href="/dashboard?tab=listings"
              className="py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/15 transition-colors"
            >
              My Inventory ({myListings.length || 3})
            </Link>
          </div>
        </div>

        {/* Merchant Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-300 uppercase block">Active Catalog</span>
            <div className="text-lg font-black text-white mt-0.5">{myListings.length || 3} Listed</div>
            <span className="text-[10px] text-emerald-400 font-semibold">All Active on Map</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-300 uppercase block">Ad Impressions</span>
            <div className="text-lg font-black text-blue-400 mt-0.5">412 Views</div>
            <span className="text-[10px] text-slate-400 font-semibold">High Search Demand</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-300 uppercase block">Escrow Balance</span>
            <div className="text-lg font-black text-emerald-400 mt-0.5">₹24,500.00</div>
            <span className="text-[10px] text-slate-400 font-semibold">Auto-credited on delivery</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-300 uppercase block">Buyer Negotiations</span>
            <div className="text-lg font-black text-amber-400 mt-0.5">2 Pending</div>
            <span className="text-[10px] text-amber-300 font-semibold">Needs response</span>
          </div>
        </div>
      </div>

      {/* Buyer Negotiations & Ready to Dispatch Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Pending Buyer Offers */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Buyer Price Offers Awaiting Approval
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
              Action Required
            </span>
          </div>

          {/* Offer 1 */}
          {!hasAcceptedOffer1 ? (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    Sony Bravia 55&quot; 4K Smart TV
                  </h4>
                  <p className="text-[10px] text-slate-500">Asking Price: ₹18,000</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                    Offer: ₹15,500
                  </span>
                  <span className="text-[10px] text-slate-400">By Rahul Verma</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setHasAcceptedOffer1(true);
                    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
                    showToast('Offer Accepted! Buyer Rahul Verma notified to pay via Escrow.');
                  }}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Accept Offer (₹15,500)
                </button>
                <Link
                  href="/chat"
                  className="py-2 px-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold"
                >
                  Chat / Counter
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
              <span>Offer ₹15,500 accepted! Deal reserved for Rahul Verma.</span>
              <Link href="/deliver" className="font-bold underline">Dispatch Courier</Link>
            </div>
          )}

          {/* Offer 2 */}
          {!hasAcceptedOffer2 ? (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    Vintage Teakwood Armchair
                  </h4>
                  <p className="text-[10px] text-slate-500">Asking Price: ₹6,500</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                    Offer: ₹5,800
                  </span>
                  <span className="text-[10px] text-slate-400">By Ananya Roy</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setHasAcceptedOffer2(true);
                    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
                    showToast('Offer Accepted! Buyer Ananya Roy notified to pay via Escrow.');
                  }}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Accept Offer (₹5,800)
                </button>
                <Link
                  href="/chat"
                  className="py-2 px-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold"
                >
                  Chat / Counter
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
              <span>Offer ₹5,800 accepted! Deal reserved for Ananya Roy.</span>
              <Link href="/deliver" className="font-bold underline">Dispatch Courier</Link>
            </div>
          )}
        </div>

        {/* Card 2: 1-Click Porter Delivery for Sold Goods */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Dispatch Sold Goods to Buyers
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
              Doorstep Porter
            </span>
          </div>

          <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/20 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">Solid Teakwood Coffee Table</span>
              <span className="text-emerald-600 font-black">Sold for ₹4,200</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Buyer Address: Royal Palms, Gomti Nagar Extension. Ready for courier pickup!
            </p>

            <Link
              href="/deliver?cargo=Teakwood+Coffee+Table"
              className="mt-2 w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Truck className="w-4 h-4" />
              <span>Call Porter Pickup for Buyer &rarr;</span>
            </Link>
          </div>

          <div className="p-4 bg-blue-50/40 dark:bg-blue-950/20 rounded-2xl border border-blue-500/20 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">Dell XPS 15 (Touch OLED)</span>
              <span className="text-blue-600 font-black">Sold for ₹48,000</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Buyer Address: Sector 14, Indira Nagar. High-value parcel packaging ready.
            </p>

            <Link
              href="/deliver?cargo=Dell+XPS+Laptop"
              className="mt-2 w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
            >
              <Truck className="w-4 h-4" />
              <span>Dispatch 2-Wheeler Express Courier &rarr;</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
