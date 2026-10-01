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
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';

export default function DriverDashboardPage() {
  const {
    isDriverOnline,
    setIsDriverOnline,
    driverEarnings,
    deliveries,
    updateDeliveryStatus,
    verifyDeliveryOtp,
    showToast,
  } = usePortex();

  const [activeTab, setActiveTab] = useState<'trips' | 'earnings' | 'vehicle' | 'kyc'>('trips');
  const [testOtp, setTestOtp] = useState('');

  const activeTrip = deliveries.find(d => d.status !== 'DELIVERED') || deliveries[0];

  const handleCompleteDelivery = () => {
    if (activeTrip) {
      updateDeliveryStatus(activeTrip.id, 'DELIVERED');
      showToast('Trip marked DELIVERED! ₹380 added to today’s driver payout.');
    }
  };

  const handleTestDispatch = () => {
    showToast('Simulating incoming dispatch radar ping...');
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
              <h1 className="text-xl font-black">Mohd. Imran Khan</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tata Ace Gold CNG &bull; UP32 EZ 4912 &bull; Portex Platinum Tier
            </p>
          </div>
        </div>

        {/* Online / Offline Switch */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block uppercase font-bold tracking-wider">
              Duty Status
            </span>
            <span
              className={`text-sm font-extrabold ${
                isDriverOnline ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              {isDriverOnline ? 'ON DUTY (Receiving Orders)' : 'OFFLINE'}
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
            Direct Bank Deposit
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

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-bold">
        {[
          { id: 'trips', label: 'Active & Assigned Jobs' },
          { id: 'earnings', label: 'Earnings & Bank Payouts' },
          { id: 'vehicle', label: 'Vehicle Management' },
          { id: 'kyc', label: 'KYC & License Docs' },
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

      {/* Tab 1: Active Trip & Terminal */}
      {activeTab === 'trips' && (
        <div className="space-y-6">
          {activeTrip && activeTrip.status !== 'DELIVERED' ? (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-500/40 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Active Dispatch Job
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {activeTrip.packageType}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {activeTrip.trackingNumber} &bull; {activeTrip.distanceKm} km
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/tracking/${activeTrip.id}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Open Navigation Map</span>
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
                    1. Pickup From
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white">{activeTrip.pickup.contactName}</p>
                  <p className="text-slate-600 dark:text-slate-400">{activeTrip.pickup.address}</p>
                  <div className="pt-1 text-[11px] text-slate-500">
                    Phone: <strong>{activeTrip.pickup.contactPhone}</strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 block">
                    2. Deliver To
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white">{activeTrip.drop.contactName}</p>
                  <p className="text-slate-600 dark:text-slate-400">{activeTrip.drop.address}</p>
                  <div className="pt-1 text-[11px] text-slate-500">
                    Phone: <strong>{activeTrip.drop.contactPhone}</strong>
                  </div>
                </div>
              </div>

              {/* Driver Action Bar (Pickup / Complete with OTP) */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 block">Trip Milestone Status</span>
                  <div className="text-sm font-bold text-emerald-400 uppercase tracking-wide">
                    {activeTrip.status.replace(/_/g, ' ')}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateDeliveryStatus(activeTrip.id, 'ITEM_PICKED_UP')}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                  >
                    Confirm Pickup Handoff
                  </button>
                  <button
                    onClick={handleCompleteDelivery}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/25 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Delivery &amp; Collect Payment</span>
                  </button>
                </div>
              </div>
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
                Stay on duty to receive incoming trip notifications from marketplace buyers and business consignments.
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
