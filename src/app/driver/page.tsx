'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  Power,
  DollarSign,
  TrendingUp,
  Award,
  ShieldCheck,
  MapPin,
  Phone,
  CheckCircle2,
  Navigation,
  FileCheck,
  CreditCard,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Radio,
  KeyRound,
  Package,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import confetti from 'canvas-confetti';

export default function DriverDashboardPage() {
  const {
    isDriverOnline,
    setIsDriverOnline,
    driverEarnings,
    deliveries,
    driverVehicleType,
    setDriverVehicleType,
    incomingJob,
    acceptIncomingJob,
    rejectIncomingJob,
    currentUser,
    updateDeliveryStatus,
    acceptDeliveryJob,
    verifyPickupOtp,
    verifyDeliveryOtp,
    triggerIncomingJobRadar,
    showToast,
  } = usePortex();

  const [activeTab, setActiveTab] = useState<'trips' | 'earnings' | 'vehicle' | 'kyc'>('trips');
  const [pickupOtpInput, setPickupOtpInput] = useState('');
  const [dropOtpInput, setDropOtpInput] = useState('');
  const [filterMyVehicleOnly, setFilterMyVehicleOnly] = useState<boolean>(true);

  // Dynamic driver profile adapting to active vehicle
  const driverProfile = {
    id: currentUser.id || 'drv-imran',
    name: currentUser.name || 'Mohd. Imran Khan',
    phone: currentUser.phone || '+91 94150 99999',
    vehicleNumber:
      driverVehicleType === 'TWO_WHEELER'
        ? 'UP32 EZ 1024'
        : driverVehicleType === 'THREE_WHEELER_AUTO'
        ? 'UP32 AT 8841'
        : 'UP32 EZ 4912',
    vehicleModel:
      driverVehicleType === 'TWO_WHEELER'
        ? '2-Wheeler (Hero Nyx Cargo)'
        : driverVehicleType === 'THREE_WHEELER_AUTO'
        ? '3-Wheeler Auto (Bajaj Maxima)'
        : 'Tata Ace Gold CNG',
    vehicleType: driverVehicleType,
  };

  // Open broadcast jobs waiting for any driver to accept
  const allBroadcastJobs = deliveries.filter(
    d =>
      (d.status === 'BOOKING_CREATED' || !d.driverId) &&
      d.status !== 'DELIVERED' &&
      d.status !== 'CANCELLED'
  );

  // Filter jobs matching the driver's vehicle
  const broadcastJobs = allBroadcastJobs.filter(d => {
    if (!filterMyVehicleOnly) return true;
    if (driverVehicleType === 'TWO_WHEELER') return d.vehicleType === 'TWO_WHEELER';
    if (driverVehicleType === 'THREE_WHEELER_AUTO') {
      return d.vehicleType === 'THREE_WHEELER_AUTO' || d.vehicleType === 'ELECTRIC_CARGO';
    }
    return (
      d.vehicleType === 'TATA_ACE_MINI_TRUCK' ||
      d.vehicleType === 'PICKUP_8FT' ||
      d.vehicleType === 'EICHER_14FT'
    );
  });

  // Active trip assigned to this driver
  const activeTrip =
    deliveries.find(
      d =>
        (d.driverId === driverProfile.id ||
          d.driverName === driverProfile.name ||
          (d.driverId && d.status !== 'BOOKING_CREATED')) &&
        d.status !== 'DELIVERED' &&
        d.status !== 'CANCELLED'
    ) || null;

  const handleAcceptJob = (jobId: string) => {
    acceptDeliveryJob(jobId, {
      id: driverProfile.id,
      name: driverProfile.name,
      phone: driverProfile.phone,
    });
    showToast(`Dispatch Job Accepted! Assigned to you with ${driverProfile.vehicleModel}.`);
  };

  const handleVerifyPickup = () => {
    if (!activeTrip) return;
    if (!pickupOtpInput || pickupOtpInput.length !== 4) {
      showToast('Please enter the 4-digit Pickup OTP provided by the sender.');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Driver Top Status & Duty Toggle */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg">
              IK
            </div>
            <span
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 ${
                isDriverOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">{driverProfile.name}</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Pilot Partner
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Active Vehicle: <strong className="text-amber-400">{driverProfile.vehicleModel}</strong> &bull; Plate: <span className="font-mono text-slate-200 font-bold">{driverProfile.vehicleNumber}</span> &bull; Portex Platinum Tier
            </p>
          </div>
        </div>

        {/* Vehicle Switcher & Online / Offline Switch */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800">
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

          <button
            type="button"
            onClick={triggerIncomingJobRadar}
            className="p-3 sm:px-4 sm:py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition-transform hover:scale-105"
            title="Simulate an incoming dispatch radar job notification"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">Radar Broadcast</span>
            <span className="sm:hidden">Radar</span>
          </button>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block uppercase font-bold tracking-wider">
              Duty Status
            </span>
            <span
              className={`text-sm font-extrabold ${
                isDriverOnline ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              {isDriverOnline ? 'ON DUTY' : 'OFFLINE'}
            </span>
          </div>

          <button
            onClick={() => {
              setIsDriverOnline(!isDriverOnline);
              showToast(isDriverOnline ? 'You are now OFFLINE' : 'You are now ONLINE for dispatches!');
            }}
            className={`p-3.5 rounded-2xl transition-all shadow-lg flex items-center gap-2 font-bold text-xs ${
              isDriverOnline
                ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
            }`}
          >
            <Power className="w-5 h-5" />
            <span className="hidden sm:inline">{isDriverOnline ? 'Go Offline' : 'Go Online'}</span>
          </button>
        </div>
      </div>

      {/* POPUP: Incoming Ride Request Notification Banner (When incomingJob matches driver's vehicle) */}
      {isDriverOnline && incomingJob && (
        <div className="p-6 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-slate-900 rounded-3xl border-2 border-amber-500 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-black flex items-center justify-center font-black">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs uppercase tracking-wider font-mono font-black text-amber-400">
                    🚨 INCOMING RIDE REQUEST FOR YOUR {incomingJob.vehicleType?.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-black font-extrabold">
                    ₹{incomingJob.fareAmount} PAYOUT
                  </span>
                </div>
                <h3 className="text-base font-black text-white mt-1">
                  {incomingJob.packageType}
                </h3>
                <div className="text-xs text-slate-300 flex items-center gap-4 mt-1 flex-wrap">
                  <span>📍 From: <strong className="text-white">{incomingJob.pickupAddress}</strong></span>
                  <span>🎯 To: <strong className="text-white">{incomingJob.dropAddress}</strong></span>
                  <span>📦 {incomingJob.weightKg} kg &bull; {incomingJob.distanceKm} km</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  handleAcceptJob(incomingJob.id);
                  confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
                }}
                className="py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-black font-black text-xs rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ACCEPT RIDE (₹{incomingJob.fareAmount})</span>
              </button>
              <button
                type="button"
                onClick={rejectIncomingJob}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Earnings Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Today’s Earnings
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            ₹{driverEarnings.today.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
            +₹420 incentive earned
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            This Week
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            ₹{driverEarnings.thisWeek.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">34 trips completed</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Monthly Payout
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            ₹{driverEarnings.thisMonth.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1 block">
            Direct Bank Settlement
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Partner Rating
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">
            {driverEarnings.rating} ★
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {driverEarnings.completedTrips} total trips
          </span>
        </div>
      </div>

      {/* SECTION: LIVE BROADCAST DISPATCH RADAR */}
      {isDriverOnline && (
        <div className="p-6 bg-gradient-to-br from-blue-950/60 to-slate-900 rounded-3xl border-2 border-blue-500/40 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-500/30">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500"></span>
              </span>
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <span>Broadcast Dispatch Radar</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30">
                    {broadcastJobs.length} Request{broadcastJobs.length !== 1 ? 's' : ''} for {driverProfile.vehicleModel}
                  </span>
                </h2>
                <p className="text-xs text-blue-200/80">
                  Requests automatically dispatched to matching vehicles across Lucknow. First pilot to accept gets assigned.
                </p>
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setFilterMyVehicleOnly(true)}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterMyVehicleOnly
                    ? 'bg-blue-600 text-white font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                My Vehicle Only ({broadcastJobs.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMyVehicleOnly(false)}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  !filterMyVehicleOnly
                    ? 'bg-blue-600 text-white font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Fleet ({allBroadcastJobs.length})
              </button>
            </div>
          </div>

          {broadcastJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {broadcastJobs.map(job => (
                <div
                  key={job.id}
                  className="p-5 bg-slate-900/90 rounded-2xl border border-blue-500/30 space-y-4 hover:border-blue-400 transition-colors shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-blue-400 font-bold block">
                        {job.trackingNumber}
                      </span>
                      <h3 className="font-extrabold text-sm text-white mt-0.5">
                        {job.packageType}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-semibold">
                          {job.vehicleType === 'TWO_WHEELER'
                            ? '🏍️ 2-Wheeler Bike'
                            : job.vehicleType === 'THREE_WHEELER_AUTO'
                            ? '🛺 3-Wheeler Auto'
                            : '🚚 Tata Ace Mini Truck'}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                          Weight: {job.packageWeightKg || 2.5} kg
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold">
                          {job.distanceKm} km
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Driver Payout</span>
                      <span className="text-lg font-black text-emerald-400">
                        ₹{(job.fare?.total || job.pricing?.totalAmount || 380).toLocaleString('en-IN')}
                      </span>
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
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ACCEPT RIDE (₹{(job.fare?.total || job.pricing?.totalAmount || 380).toLocaleString('en-IN')})</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-dashed border-slate-800 space-y-3">
              <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-40" />
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">
                  Radar Active for {driverProfile.vehicleModel}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-0.5">
                  Listening for deliveries dispatched across Lucknow. When an order matches your vehicle, it will alert here in real time.
                </p>
                {allBroadcastJobs.length > 0 && (
                  <p className="text-xs text-amber-400 font-medium mt-2">
                    💡 There are {allBroadcastJobs.length} ride requests for other vehicles. Tap above vehicle buttons or click &quot;All Fleet&quot; to inspect.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-bold">
        {[
          { id: 'trips', label: 'Active Trip & Delivery Terminal' },
          { id: 'earnings', label: 'Earnings & Bank Payouts' },
          { id: 'vehicle', label: 'Vehicle Management' },
          { id: 'kyc', label: 'KYC & Commercial License' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 transition-colors relative ${
              activeTab === tab.id
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Active Trip Terminal */}
      {activeTab === 'trips' && (
        <div className="space-y-6">
          {activeTrip && activeTrip.status !== 'DELIVERED' ? (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-500/40 shadow-xl space-y-6">
              {/* Trip Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Active Assigned Delivery
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {activeTrip.packageType}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {activeTrip.trackingNumber} &bull; {activeTrip.distanceKm} km &bull;{' '}
                      {activeTrip.vehicleType === 'TWO_WHEELER'
                        ? '2-Wheeler Bike'
                        : activeTrip.vehicleType === 'THREE_WHEELER_AUTO'
                        ? '3-Wheeler Auto'
                        : 'Tata Ace Truck'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/tracking/${activeTrip.id}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Open Live Map</span>
                  </Link>

                  <a
                    href={`tel:${activeTrip.drop.contactPhone}`}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Customer</span>
                  </a>
                </div>
              </div>

              {/* Waypoints */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">
                    1. Sender Pickup Point
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white">{activeTrip.pickup.contactName}</p>
                  <p className="text-slate-600 dark:text-slate-400">{activeTrip.pickup.address}</p>
                  <div className="pt-1 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Phone: <strong>{activeTrip.pickup.contactPhone}</strong></span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                      Pickup OTP: {activeTrip.pickupOtp || activeTrip.pickup?.otp || '4921'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 block">
                    2. Buyer Destination Drop
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white">{activeTrip.drop.contactName}</p>
                  <p className="text-slate-600 dark:text-slate-400">{activeTrip.drop.address}</p>
                  <div className="pt-1 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Phone: <strong>{activeTrip.drop.contactPhone}</strong></span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded">
                      Drop OTP: {activeTrip.dropOtp || activeTrip.drop?.otp || '8302'}
                    </span>
                  </div>
                </div>
              </div>

              {/* STEP 1: PICKUP OTP VERIFICATION (When arriving at sender location) */}
              {(activeTrip.status === 'DRIVER_ASSIGNED' ||
                activeTrip.status === 'DRIVER_ARRIVING_PICKUP' ||
                activeTrip.status === 'BOOKING_CREATED') && (
                <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-500/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                      <KeyRound className="w-5 h-5" />
                      <span>Step 1: Exchange Pickup OTP with Sender</span>
                    </div>
                    <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold bg-amber-100 dark:bg-amber-900/50 px-2.5 py-1 rounded-lg">
                      Sender OTP: {activeTrip.pickupOtp || activeTrip.pickup?.otp || '4921'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Once you arrive at the sender's location, verify the package contents and ask the sender for their 4-digit Pickup OTP to authorize handoff and begin transit.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      maxLength={4}
                      value={pickupOtpInput}
                      onChange={e => setPickupOtpInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 4-digit Pickup OTP"
                      className="w-full sm:w-64 p-3 bg-white dark:bg-slate-900 border-2 border-amber-400 rounded-xl text-center text-lg font-mono font-black tracking-widest text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />

                    <button
                      type="button"
                      onClick={handleVerifyPickup}
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify Pickup OTP &amp; Start Transit</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: IN TRANSIT CONTROLS */}
              {(activeTrip.status === 'ITEM_PICKED_UP' || activeTrip.status === 'IN_TRANSIT') && (
                <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-500/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm">
                      <Truck className="w-5 h-5 animate-pulse" />
                      <span>Step 2: Cargo In Transit to Customer Drop Location</span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400">
                      En Route
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Package picked up successfully. Follow live GPS navigation to the destination. Once you reach the destination, mark arrived to request the delivery OTP from the buyer.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      updateDeliveryStatus(activeTrip.id, 'OUT_FOR_DELIVERY');
                      showToast('Arrived at customer drop destination. Ready for delivery OTP.');
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Arrived at Customer Location (Out for Delivery)</span>
                  </button>
                </div>
              )}

              {/* STEP 3: DELIVERY OTP VERIFICATION & COMPLETION */}
              {activeTrip.status === 'OUT_FOR_DELIVERY' && (
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-500/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                      <KeyRound className="w-5 h-5" />
                      <span>Step 3: Exchange Delivery OTP with Buyer</span>
                    </div>
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-900/50 px-2.5 py-1 rounded-lg">
                      Buyer OTP: {activeTrip.dropOtp || activeTrip.drop?.otp || '8302'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Hand over the package to the buyer and ask for their 4-digit Delivery OTP to mark the trip completed and instantly collect payout into your driver wallet.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      maxLength={4}
                      value={dropOtpInput}
                      onChange={e => setDropOtpInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 4-digit Delivery OTP"
                      className="w-full sm:w-64 p-3 bg-white dark:bg-slate-900 border-2 border-emerald-400 rounded-xl text-center text-lg font-mono font-black tracking-widest text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />

                    <button
                      type="button"
                      onClick={handleVerifyDrop}
                      className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Delivery &amp; Collect Payment</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                All assigned deliveries completed!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Keep Duty Status ON to receive incoming broadcast trip notifications when buyers place orders.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Vehicle Management */}
      {activeTab === 'vehicle' && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Registered Fleet Vehicle</h3>
              <p className="text-xs text-slate-500">Commercial permit approved by RTO Lucknow</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              Active on Portex Fleet
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-400 block text-[10px] uppercase">Make &amp; Model</span>
              <span className="font-bold text-sm text-slate-900 dark:text-white">Tata Ace Gold CNG</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-400 block text-[10px] uppercase">Registration Number</span>
              <span className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400">UP32 EZ 4912</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-400 block text-[10px] uppercase">Cargo Payload Limit</span>
              <span className="font-bold text-sm text-slate-900 dark:text-white">750 kg</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: KYC & License */}
      {activeTab === 'kyc' && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">KYC Verification Status</h3>
              <p className="text-xs text-slate-500">Verified by Mango Tech Enterprises Compliance Desk</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% KYC Approved
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Commercial Driving License</span>
                <p className="text-[11px] text-slate-500">DL No: UP32 20180092144 (Valid till 2032)</p>
              </div>
              <span className="text-emerald-500 font-bold text-xs">Verified</span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Aadhaar Identity Card</span>
                <p className="text-[11px] text-slate-500">UIDAI Verified via OTP</p>
              </div>
              <span className="text-emerald-500 font-bold text-xs">Verified</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Earnings & Bank Payouts */}
      {activeTab === 'earnings' && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Bank Account &amp; Daily Settlement</h3>
              <p className="text-xs text-slate-500">HDFC Bank &bull; A/C ending in 4912 &bull; IFSC: HDFC0001248</p>
            </div>
            <button
              onClick={() => showToast('Instant withdrawal of ₹2,840 initiated to HDFC Bank!')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20"
            >
              Withdraw to Bank Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
