'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Truck,
  Trash2,
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
  Radio,
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
  const {
    isDriverOnline,
    setIsDriverOnline,
    driverEarnings,
    deliveries,
    driverVehicleType,
    setDriverVehicleType,
    acceptDeliveryJob,
    updateDeliveryStatus,
    verifyPickupOtp,
    verifyDeliveryOtp,
    showToast,
  } = usePortex();

  const [pickupOtpInput, setPickupOtpInput] = useState('');
  const [dropOtpInput, setDropOtpInput] = useState('');

  // Open broadcast jobs waiting for drivers
  const broadcastJobs = deliveries.filter(
    d => (d.status === 'BOOKING_CREATED' || !d.driverId) && d.status !== 'DELIVERED' && d.status !== 'CANCELLED'
  );

  // Check matching jobs for driver's active vehicle
  const matchingJobs = broadcastJobs.filter(d => {
    if (driverVehicleType === 'TWO_WHEELER') return d.vehicleType === 'TWO_WHEELER';
    if (driverVehicleType === 'THREE_WHEELER_AUTO') return d.vehicleType === 'THREE_WHEELER_AUTO' || d.vehicleType === 'ELECTRIC_CARGO';
    return d.vehicleType === 'TATA_ACE_MINI_TRUCK' || d.vehicleType === 'PICKUP_8FT' || d.vehicleType === 'EICHER_14FT';
  });

  // Current active trip assigned to driver
  const activeTrip = deliveries.find(
    d => d.driverId && d.status !== 'DELIVERED' && d.status !== 'CANCELLED'
  );

  const [completedTrips, setCompletedTrips] = useState([
    {
      id: 'PRTX-8491',
      pickup: 'Warehouse 4, Transport Nagar',
      drop: 'Hazratganj Main Market',
      vehicle: '2-Wheeler Hero Cargo',
      cargo: 'Laptop & Electronics Box',
      time: '10:45 AM',
      distance: '6.4 km',
      fare: 180,
      paymentMethod: 'ONLINE_ESCROW',
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
  ]);

  const handleAcceptJob = (jobId: string) => {
    acceptDeliveryJob(jobId);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
  };

  const handleVerifyPickup = () => {
    if (!activeTrip) return;
    if (!pickupOtpInput || pickupOtpInput.length !== 4) {
      showToast('Please enter the 4-digit Pickup OTP provided by the seller.');
      return;
    }
    const success = verifyPickupOtp(activeTrip.id, pickupOtpInput);
    if (success) {
      setPickupOtpInput('');
    }
  };

  const handleVerifyDrop = () => {
    if (!activeTrip) return;
    if (!dropOtpInput || dropOtpInput.length !== 4) {
      showToast('Please enter the 4-digit Delivery OTP provided by the buyer.');
      return;
    }
    const success = verifyDeliveryOtp(activeTrip.id, dropOtpInput, 'delivery');
    if (success) {
      setDropOtpInput('');
    }
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
                Lucknow Transport Hub &bull; Fleet: <span className="font-mono text-amber-300 font-bold">
                  {driverVehicleType === 'TWO_WHEELER'
                    ? 'Hero Nyx Cargo (2-Wheeler)'
                    : driverVehicleType === 'THREE_WHEELER_AUTO'
                    ? 'Bajaj Maxima (3-Wheeler)'
                    : 'Tata Ace Gold CNG (Mini Truck)'}
                </span> &bull; 1 Helper Attached
              </p>
            </div>
          </div>

          {/* Vehicle Switcher & Duty Status Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">My Vehicle:</span>
              {(['TWO_WHEELER', 'THREE_WHEELER_AUTO', 'TATA_ACE_MINI_TRUCK'] as const).map(vType => {
                const isSelected = driverVehicleType === vType;
                const label = vType === 'TWO_WHEELER' ? '🏍️ 2-Wheeler' : vType === 'THREE_WHEELER_AUTO' ? '🛺 3-Wheeler' : '🚚 Tata Ace';
                return (
                  <button
                    key={vType}
                    type="button"
                    onClick={() => setDriverVehicleType(vType)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-black shadow-sm font-black'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 bg-slate-900/90 p-2 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Duty Status
                </span>
                <span
                  className={`text-xs font-black ${isDriverOnline ? 'text-emerald-400' : 'text-slate-400'}`}
                >
                  {isDriverOnline ? 'ONLINE (Ready)' : 'OFFLINE (Paused)'}
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

            {activeTrip ? (
              /* Active Trip In Progress Card */
              <div className="p-5 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 rounded-3xl border-2 border-emerald-500/50 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-white">
                        Active Trip: #{activeTrip.trackingNumber}
                      </h3>
                      <p className="text-[11px] text-emerald-400">
                        {activeTrip.packageType} &bull; {activeTrip.vehicleName}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                    ₹{(activeTrip.pricing?.totalAmount || 350).toLocaleString('en-IN')} FARE
                  </span>
                </div>

                {/* Route Path */}
                <div className="space-y-2 text-xs bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span className="font-bold text-slate-400">Pickup:</span>
                    <span className="text-white truncate font-medium">{activeTrip.pickup.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400 flex-shrink-0" />
                    <span className="font-bold text-slate-400">Drop:</span>
                    <span className="text-white truncate font-medium">{activeTrip.drop.address}</span>
                  </div>
                </div>

                {/* OTP Exchange Action */}
                {activeTrip.status !== 'ITEM_PICKED_UP' && activeTrip.status !== 'IN_TRANSIT' && activeTrip.status !== 'DELIVERED' ? (
                  <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300">
                        Step 1: Pick Up Cargo from Sender
                      </span>
                      <span className="text-[10px] text-slate-400">Sender: {activeTrip.pickup.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="4-digit Pickup OTP"
                        value={pickupOtpInput}
                        onChange={(e) => setPickupOtpInput(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white text-center focus:border-amber-400 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyPickup}
                        className="py-2 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer"
                      >
                        Verify Pickup OTP
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300">
                        Step 2: Deliver Cargo to Buyer
                      </span>
                      <span className="text-[10px] text-slate-400">Buyer: {activeTrip.drop.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="4-digit Delivery OTP"
                        value={dropOtpInput}
                        onChange={(e) => setDropOtpInput(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white text-center focus:border-emerald-400 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyDrop}
                        className="py-2 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer"
                      >
                        Verify Delivery OTP &amp; Complete
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href={`/tracking/${activeTrip.id}`}
                    className="flex-1 py-2.5 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md"
                  >
                    Open Live GPS Tracking &rarr;
                  </Link>
                  <a
                    href={`tel:${activeTrip.pickup.contactPhone}`}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            ) : matchingJobs.length > 0 ? (
              /* Incoming Broadcast Rides Matching Driver's Vehicle */
              <div className="space-y-3">
                {matchingJobs.map(job => (
                  <div
                    key={job.id}
                    className="p-5 bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 rounded-3xl border-2 border-amber-500/50 shadow-2xl space-y-4 animate-in fade-in"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black text-white">
                              {job.packageType}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {job.vehicleType === 'TWO_WHEELER'
                                ? '🏍️ 2-Wheeler'
                                : job.vehicleType === 'THREE_WHEELER_AUTO'
                                ? '🛺 3-Wheeler'
                                : '🚚 Tata Ace'}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">Shipper: {job.customerName} &bull; {job.packageWeightKg} kg</span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-sm font-black text-emerald-400 block">
                          ₹{(job.pricing?.totalAmount || job.fare?.total || 350).toLocaleString('en-IN')} FARE
                        </span>
                        <span className="text-[10px] text-slate-400">{job.distanceKm} km &bull; Doorstep</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                        <span className="text-slate-400">Pickup:</span>
                        <span className="font-semibold text-white truncate">{job.pickup.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                        <span className="text-slate-400">Drop:</span>
                        <span className="font-semibold text-white truncate">{job.drop.address}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAcceptJob(job.id)}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ACCEPT RIDE (₹{(job.pricing?.totalAmount || 350).toLocaleString('en-IN')} FARE)</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* Radar Idle State */
              <div className="p-8 bg-slate-900/60 rounded-3xl border border-slate-800 text-center space-y-3">
                <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-40" />
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Radar Active for {driverVehicleType === 'TWO_WHEELER' ? '2-Wheeler (Express Bike)' : driverVehicleType === 'THREE_WHEELER_AUTO' ? '3-Wheeler Auto' : 'Tata Ace Mini Truck'}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-0.5">
                    Listening for buyer purchases &amp; seller dispatches across Lucknow. New requests will alert here instantly.
                  </p>
                  {broadcastJobs.length > 0 && (
                    <p className="text-[11px] text-amber-400/90 font-medium mt-2">
                      💡 {broadcastJobs.length} ride request(s) open for other vehicle types. Switch vehicle above to view.
                    </p>
                  )}
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
  const router = useRouter();
  const { listings, currentUser, showToast, setUserRole, deleteListing, dispatchProductDelivery } = usePortex();
  const [hasDispatchedId, setHasDispatchedId] = useState<string | null>(null);

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
                <h1 className="text-xl font-black">{currentUser.marketplaceProfile?.shopOrDisplayName || 'Patel Curated Home & Vintage Studio'}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Verified Merchant Store
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  4.88 ⭐ ({currentUser.totalDeals || 42} Deals)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                UPI Escrow Linked: <span className="font-mono text-emerald-400 font-bold">{currentUser.marketplaceProfile?.payoutUpiId || 'priyapatel@okaxis'}</span> &bull; 0% Platform Commission
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sell"
              className="py-3 px-5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Post New Product</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setUserRole('BUYER');
                router.push('/marketplace');
                showToast('Switched to Buyer Marketplace');
              }}
              className="py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/15 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View as Buyer</span>
            </button>
          </div>
        </div>

        {/* Merchant Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-300 uppercase block">Active Products</span>
            <div className="text-lg font-black text-white mt-0.5">{myListings.length} Live</div>
            <span className="text-[10px] text-emerald-400 font-semibold">{myListings.length > 0 ? 'Indexed on Buyer Site' : 'No items yet'}</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-300 uppercase block">Product Views</span>
            <div className="text-lg font-black text-blue-400 mt-0.5">
              {myListings.reduce((acc, l) => acc + (l.views || 0), 0)} Views
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">{myListings.length > 0 ? 'Active Inquiries' : 'No views'}</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-300 uppercase block">Escrow Balance</span>
            <div className="text-lg font-black text-emerald-400 mt-0.5">
              ₹{myListings.length > 0 ? (myListings[0].price * 0.9).toLocaleString('en-IN') : '0.00'}
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">Auto-released on delivery</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-300 uppercase block">Buyer Negotiations</span>
            <div className="text-lg font-black text-amber-400 mt-0.5">{myListings.length > 0 ? '1 Pending' : '0 Pending'}</div>
            <span className="text-[10px] text-amber-300 font-semibold">{myListings.length > 0 ? 'Review offer below' : 'No pending offers'}</span>
          </div>
        </div>
      </div>

      {/* 🛒 ACTIVE STORE INVENTORY (Live on Buyer Site) */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Your Store Catalog (Live for Buyers)
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                {myListings.length} Active Products
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Every product listed below is active and can be browsed, negotiated, or delivered to buyers across Lucknow.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setUserRole('BUYER');
                router.push('/marketplace');
                showToast('Switched to Buyer Marketplace view');
              }}
              className="py-2 px-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview on Buyer Site</span>
            </button>

            <Link
              href="/sell"
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Add Product</span>
            </Link>
          </div>
        </div>

        {myListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myListings.map(item => (
              <div
                key={item.id}
                className="group p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-blue-500/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-2.5">
                  <img
                    src={item.images[0] || 'https://images.unsplash.com/photo-1589384267710-7a170981ca78?auto=format&fit=crop&w=600&q=80'}
                    alt={item.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589384267710-7a170981ca78?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                      LIVE ON BUYER SITE
                    </span>
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-sm text-slate-200 text-[9px] font-semibold px-1.5 py-0.5 rounded">
                    {item.images.length} Photo{item.images.length > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      {item.category} &bull; {item.condition.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.createdAt}</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1">
                    {item.title}
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-black text-blue-600 dark:text-blue-400">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    {item.originalPrice && (
                      <span className="text-[10px] text-slate-400 line-through">
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center gap-2">
                  <Link
                    href={`/listings/${item.id}`}
                    className="flex-1 py-1.5 text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View as Buyer</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      deleteListing(item.id);
                      showToast('Product removed from catalog and buyer site.');
                    }}
                    className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
                    title="Remove from Marketplace"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
            <ShoppingBag className="w-10 h-10 mx-auto text-slate-400" />
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No active products posted yet
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Post your first product with photos, price, and dimensions to start receiving buyer offers.
              </p>
            </div>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Your First Product</span>
            </Link>
          </div>
        )}
      </div>

      {/* Buyer Negotiations & Ready to Dispatch Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Pending Buyer Offers */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Buyer Price Offers Awaiting Approval
              </h3>
            </div>
            {myListings.length > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                1 Offer Pending
              </span>
            )}
          </div>

          {myListings.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-400" />
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No buyer offers yet
              </h4>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                You haven&apos;t added any products to your catalog yet. Once you post your products, buyer negotiations and price offers will appear here.
              </p>
              <Link
                href="/sell"
                className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-black font-extrabold text-xs rounded-xl shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Add Product to Sell</span>
              </Link>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                    {myListings[0].title}
                  </h4>
                  <p className="text-[10px] text-slate-500">Asking Price: ₹{myListings[0].price.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                    Offer: ₹{Math.round(myListings[0].price * 0.9).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400">By Rahul Verma</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
                    showToast(`Offer of ₹${Math.round(myListings[0].price * 0.9).toLocaleString('en-IN')} accepted! Buyer Rahul Verma notified.`);
                  }}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Accept Offer (₹{Math.round(myListings[0].price * 0.9).toLocaleString('en-IN')})
                </button>
                <Link
                  href="/chat"
                  className="py-2 px-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold"
                >
                  Chat / Counter
                </Link>
              </div>
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
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Doorstep Porter
            </span>
          </div>

          {myListings.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
              <Truck className="w-8 h-8 mx-auto text-slate-400" />
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No sold goods awaiting dispatch
              </h4>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Once a buyer completes payment or agrees on price, 1-click Porter delivery dispatch will appear here to assign matching 2-wheelers, 3-wheelers, or mini trucks.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/20 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                    {myListings[0].title}
                  </h4>
                  <span className="text-[10px] text-slate-500">Weight: {myListings[0].weightKg} kg &bull; Buyer: Rahul Verma (Gomti Nagar)</span>
                </div>
                <span className="text-emerald-600 font-black">₹{myListings[0].price.toLocaleString('en-IN')}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/40 border border-emerald-500/20 flex items-center justify-between">
                <span className="text-[11px] text-slate-300">
                  Recommended Fleet: <strong className="text-amber-400 font-bold">
                    {myListings[0].weightKg <= 20
                      ? '🏍️ 2-Wheeler (Express Bike)'
                      : myListings[0].weightKg <= 500
                      ? '🛺 3-Wheeler Auto'
                      : '🚚 Tata Ace Mini Truck'}
                  </strong>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  Auto-Calculated
                </span>
              </div>

              {hasDispatchedId === myListings[0].id ? (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-between">
                  <span>🚀 Dispatched! Broadcast sent to matching drivers.</span>
                  <Link href="/tracking" className="underline text-amber-400 font-black">Live Tracking &rarr;</Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    dispatchProductDelivery({
                      listingId: myListings[0].id,
                      title: myListings[0].title,
                      price: myListings[0].price,
                      weightKg: myListings[0].weightKg,
                      buyerName: 'Rahul Verma',
                      buyerAddress: 'Flat 402, Royal Palms, Gomti Nagar Extension, Lucknow',
                    });
                    setHasDispatchedId(myListings[0].id);
                    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
                    showToast(`🚀 Dispatched "${myListings[0].title.slice(0, 20)}"! Driver notification sent.`);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <Truck className="w-4 h-4" />
                  <span>Call Porter Dispatch for Buyer &rarr;</span>
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
