'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Truck,
  Heart,
  MapPin,
  Clock,
  ShieldCheck,
  PlusCircle,
  Trash2,
  Eye,
  ArrowRight,
  ExternalLink,
  Settings,
  ShoppingBag,
  Banknote,
  FileText,
  CheckCircle2,
  Award,
  Zap,
  Download,
  Printer,
  User as UserIcon,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import ListingCard from '@/components/marketplace/ListingCard';
import InvoiceModal from '@/components/common/InvoiceModal';
import { DeliveryBooking, UserRole } from '@/types';
import confetti from 'canvas-confetti';

export default function UserDashboardPage() {
  const {
    currentUser,
    userRole,
    listings,
    deleteListing,
    favorites,
    deliveries,
    openAuthModal,
    driverEarnings,
    isDriverOnline,
    setIsDriverOnline,
    showToast,
  } = usePortex();

  // Selected tab state
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<DeliveryBooking | null>(null);
  const [hasWithdrawn, setHasWithdrawn] = useState(false);
  const [hasAcceptedNegotiation, setHasAcceptedNegotiation] = useState(false);

  // Set default tab on persona change
  useEffect(() => {
    if (userRole === 'DRIVER') {
      setActiveTab('earnings');
    } else if (userRole === 'SELLER') {
      setActiveTab('listings');
    } else if (userRole === 'ENTERPRISE') {
      setActiveTab('invoices');
    } else {
      setActiveTab('deliveries');
    }
  }, [userRole]);

  const myListings = listings.filter(
    l => l.sellerId === currentUser.id || l.sellerName === currentUser.name
  );
  const favoriteListings = listings.filter(l => favorites.includes(l.id));

  // Determine dynamic tabs based on userRole
  const getTabsForRole = (role: UserRole) => {
    switch (role) {
      case 'DRIVER':
        return [
          { id: 'earnings', label: `Pilot Wallet (₹${driverEarnings.today})` },
          { id: 'trips', label: `Assigned Trips (${deliveries.length})` },
          { id: 'vehicle', label: 'Fleet Vehicle & Helper Specs' },
          { id: 'profile', label: 'Driver Credentials & KYC' },
        ];
      case 'SELLER':
        return [
          { id: 'listings', label: `Store Catalog (${myListings.length})` },
          { id: 'offers', label: 'Buyer Price Offers (2)' },
          { id: 'payouts', label: 'Escrow UPI Payouts' },
          { id: 'profile', label: 'Store & Pickup Setup' },
        ];
      case 'ENTERPRISE':
        return [
          { id: 'invoices', label: '18% GST Invoices & ITC' },
          { id: 'deliveries', label: `Commercial Freight (${deliveries.length})` },
          { id: 'docks', label: 'Warehouse Docks & Hubs' },
          { id: 'profile', label: 'Enterprise Shipper Profile' },
        ];
      case 'BUYER':
      default:
        return [
          { id: 'deliveries', label: `My Orders & Deliveries (${deliveries.length})` },
          { id: 'wishlist', label: `Saved Wishlist (${favoriteListings.length})` },
          { id: 'addresses', label: 'Delivery Addresses (2)' },
          { id: 'profile', label: 'Account Profile & Settings' },
        ];
    }
  };

  const dynamicTabs = getTabsForRole(userRole);

  const handleWithdrawEarnings = () => {
    setHasWithdrawn(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    showToast(`₹${driverEarnings.today} withdrawal requested! Transfer initiated to linked UPI.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Role-Adapted Profile Overview Header */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
            />
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 border-2 border-white dark:border-slate-900" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                {currentUser.name}
              </h1>
              
              {userRole === 'DRIVER' && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Fleet Pilot (4.98 ⭐)
                </span>
              )}
              {userRole === 'SELLER' && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5" /> Verified Merchant Store
                </span>
              )}
              {userRole === 'ENTERPRISE' && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> B2B Logistics Enterprise
                </span>
              )}
              {userRole === 'BUYER' && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Portex Member
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser.email} &bull; {currentUser.phone} &bull; {currentUser.city}
            </p>

            {/* Role-specific subtitle badges */}
            {userRole === 'ENTERPRISE' && (
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                GSTIN: 09AAECS1429B1Z2 &bull; Transport Nagar Dock 4
              </span>
            )}
            {userRole === 'SELLER' && currentUser.marketplaceProfile?.payoutUpiId && (
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono">
                💳 Direct UPI Payout: {currentUser.marketplaceProfile.payoutUpiId}
              </span>
            )}
            {userRole === 'DRIVER' && (
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                Tata Ace Gold &bull; UP 32 EN 4920 &bull; Helper Assigned
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons Adapted to Persona */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {userRole === 'DRIVER' && (
            <>
              <Link
                href="/driver"
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4" />
                <span>Open Pilot Cockpit</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsDriverOnline(!isDriverOnline);
                  showToast(isDriverOnline ? 'Duty set to OFFLINE' : 'Duty set to ONLINE');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isDriverOnline
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Duty: {isDriverOnline ? 'ONLINE' : 'OFFLINE'}
              </button>
            </>
          )}

          {userRole === 'SELLER' && (
            <>
              <Link
                href="/sell"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Post New Product</span>
              </Link>
              <Link
                href="/deliver"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1"
              >
                <Truck className="w-4 h-4" />
                <span>Dispatch Sold Item</span>
              </Link>
            </>
          )}

          {userRole === 'ENTERPRISE' && (
            <>
              <Link
                href="/deliver"
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <Truck className="w-4 h-4" />
                <span>+ Book Fleet Dispatch</span>
              </Link>
              <button
                type="button"
                onClick={() => setActiveTab('invoices')}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700"
              >
                Download B2B Invoices
              </button>
            </>
          )}

          {userRole === 'BUYER' && (
            <>
              <Link
                href="/deliver"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <Truck className="w-4 h-4" />
                <span>Send Courier / Mini Truck</span>
              </Link>
              <Link
                href="/marketplace"
                className="px-3.5 py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold"
              >
                Browse Marketplace
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 3. Role-Adapted Tabs Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-bold overflow-x-auto pb-1">
        {dynamicTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 transition-colors relative whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================
          TAB CONTENT: DRIVER SPECIFIC TABS
         ======================================================== */}
      {userRole === 'DRIVER' && activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 rounded-3xl border border-emerald-500/30">
              <span className="text-xs font-bold uppercase text-slate-500">Available Wallet Balance</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                ₹1,840.00
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Ready for instant payout to bank/UPI</p>
              <button
                type="button"
                disabled={hasWithdrawn}
                onClick={handleWithdrawEarnings}
                className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                {hasWithdrawn ? '✓ Withdrawal Requested' : 'Withdraw Payout (Instant UPI)'}
              </button>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase text-slate-500">Weekly Total</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹9,420.00</div>
              <p className="text-[11px] text-slate-500 mt-1">28 completed dispatches &bull; 0 cancellations</p>
              <div className="mt-4 text-xs font-bold text-blue-600 flex items-center gap-1">
                <span>View Weekly Ledger</span> &rarr;
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase text-slate-500">Fuel &amp; Performance Bonus</span>
              <div className="text-2xl font-black text-amber-500 mt-1">₹420.00</div>
              <p className="text-[11px] text-slate-500 mt-1">Unlocked: 50km milestone achieved today</p>
              <div className="mt-4 text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Tier 1 Incentive Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {userRole === 'DRIVER' && activeTab === 'vehicle' && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Assigned Commercial Vehicle &amp; Helper Specs
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Vehicle Fleet Type</span>
              <span className="font-bold text-slate-900 dark:text-white">Tata Ace Gold (Chota Hathi)</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Registration Number</span>
              <span className="font-bold font-mono text-emerald-600">UP 32 EN 4920</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Max Payload</span>
              <span className="font-bold text-slate-900 dark:text-white">750 kg &bull; 7.2 x 4.5 x 4.2 ft bed</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Loading Helper Crew</span>
              <span className="font-bold text-emerald-600">Enabled (Doorstep Loading &amp; Shifting)</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB CONTENT: ENTERPRISE SPECIFIC TABS
         ======================================================== */}
      {userRole === 'ENTERPRISE' && activeTab === 'invoices' && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                B2B GST Tax Invoices &amp; 18% Input Tax Credit
              </h3>
              <p className="text-xs text-slate-500">
                Official GST-compliant tax invoices pre-filled with GSTIN: 09AAECS1429B1Z2
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total ITC Saved</span>
              <span className="text-sm font-black text-emerald-600">₹14,250.00</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {deliveries.map(del => {
              const cgst = Number((del.pricing.gstAmount / 2).toFixed(2));
              const sgst = Number((del.pricing.gstAmount / 2).toFixed(2));
              return (
                <div key={del.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">
                      INV-{del.trackingNumber}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {del.pickup.address.split(',')[0]} &rarr; {del.drop.address.split(',')[0]}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      ₹{del.pricing.totalAmount}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-mono">
                      CGST ₹{cgst} + SGST ₹{sgst} (18% ITC)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceBooking(del)}
                    className="py-1.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-blue-500 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>View / Print PDF</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {userRole === 'ENTERPRISE' && activeTab === 'docks' && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-black text-sm text-slate-900 dark:text-white">
            Saved Warehouse Docks &amp; Pickup Hubs
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-50/20 dark:bg-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">Central Warehouse Hub</span>
                <span className="text-[9px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">Primary Dock</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Warehouse 4, Transport Nagar, Kanpur Road, Lucknow, 226012
              </p>
              <span className="text-[10px] text-slate-500 block">Ground Floor Cargo Bay &bull; Heavy Truck Dock</span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 space-y-2">
              <span className="font-bold text-xs text-slate-900 dark:text-white">Aliganj Distribution Branch</span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                E-3/776, Sector-I Aliganj, Lucknow, UP 226024
              </p>
              <span className="text-[10px] text-slate-500 block">Elevator Access &bull; 2-Wheeler / 3-Wheeler Bay</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB CONTENT: SELLER SPECIFIC TABS
         ======================================================== */}
      {userRole === 'SELLER' && activeTab === 'offers' && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-black text-sm text-slate-900 dark:text-white">
            Buyer Price Negotiations &amp; Offers
          </h3>
          
          {!hasAcceptedNegotiation ? (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  Sony Bravia 55&quot; 4K Ultra HD Smart TV
                </h4>
                <p className="text-[11px] text-slate-500">
                  Listed Price: ₹18,000 &bull; Offer from: <strong>Rahul Verma</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  ₹15,500 Offered
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setHasAcceptedNegotiation(true);
                    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
                    showToast('Offer accepted! Deal marked reserved for Rahul Verma.');
                  }}
                  className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                >
                  Accept Offer
                </button>
                <Link
                  href="/chat"
                  className="py-1.5 px-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold"
                >
                  Counter
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
              <span>Offer accepted! Deal reserved. You can now dispatch it to the buyer.</span>
              <Link href="/deliver" className="font-bold underline">Dispatch via Porter</Link>
            </div>
          )}
        </div>
      )}

      {userRole === 'SELLER' && activeTab === 'payouts' && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Seller Escrow Payouts &amp; Bank Links
              </h3>
              <p className="text-xs text-slate-500">
                100% Escrow Protected: Funds credited automatically upon buyer delivery
              </p>
            </div>
            <span className="text-base font-black text-emerald-600">₹24,500.00 Ready</span>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Banknote className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Primary Payout UPI Destination
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {currentUser.marketplaceProfile?.payoutUpiId || 'priyapatel@okaxis'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white">
              Instant Credit
            </span>
          </div>
        </div>
      )}

      {/* ========================================================
          COMMON / BUYER SPECIFIC TABS
         ======================================================== */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Active Store Catalog ({myListings.length})
            </h3>
            <Link
              href="/sell"
              className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Add Listing</span>
            </Link>
          </div>

          {myListings.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {myListings.map(item => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative aspect-video">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.status}
                    </span>
                  </div>

                  <div className="p-3 space-y-1">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h4>
                    <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="p-3 pt-0 flex gap-2">
                    <button
                      onClick={() => {
                        deleteListing(item.id);
                        showToast('Listing removed from catalog');
                      }}
                      className="flex-1 py-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900 transition-colors"
                    >
                      Delete
                    </button>
                    <Link
                      href={`/listings/${item.id}`}
                      className="flex-1 py-1.5 text-center text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                    >
                      View Live
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
              <p className="text-xs text-slate-500">No active listings yet.</p>
              <Link href="/sell" className="inline-block py-2 px-4 bg-blue-600 text-white text-xs font-bold rounded-xl">
                Post Your First Ad
              </Link>
            </div>
          )}
        </div>
      )}

      {(activeTab === 'deliveries' || activeTab === 'trips') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {userRole === 'DRIVER' ? 'Assigned Driver Trips' : 'My Deliveries & Courier Orders'} ({deliveries.length})
            </h3>
            {userRole !== 'DRIVER' && (
              <Link
                href="/deliver"
                className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>+ Book Trip</span>
              </Link>
            )}
          </div>

          <div className="space-y-3">
            {deliveries.map(del => (
              <div
                key={del.id}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-600">{del.trackingNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                      {del.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    {del.pickup.address.split(',')[0]} &rarr; {del.drop.address.split(',')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Vehicle: {del.vehicleType.replace(/_/g, ' ')} &bull; {del.packageType}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="font-black text-sm text-slate-900 dark:text-white mr-2">
                    ₹{del.pricing.totalAmount}
                  </span>
                  <Link
                    href={`/tracking/${del.trackingNumber}`}
                    className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm"
                  >
                    Track Live &rarr;
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceBooking(del)}
                    className="py-1.5 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
                  >
                    Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Saved Wishlist Items ({favoriteListings.length})
          </h3>
          {favoriteListings.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {favoriteListings.map(item => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
              <p className="text-xs text-slate-500">Your wishlist is empty.</p>
              <Link href="/marketplace" className="inline-block py-2 px-4 bg-blue-600 text-white text-xs font-bold rounded-xl">
                Explore Marketplace
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Saved Delivery &amp; Pickup Addresses
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-50/20 dark:bg-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">Home Address</span>
                <span className="text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded">Default</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Gomti Nagar Extension, Sector 4, Lucknow, UP 226010
              </p>
              <span className="text-[10px] text-slate-400">2nd Floor &bull; Lift Available</span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">Office / Warehouse</span>
              <p className="text-slate-600 dark:text-slate-300">
                E-3/776, Sector-I Aliganj, Lucknow, UP 226024
              </p>
              <span className="text-[10px] text-slate-400">Ground Floor &bull; Cargo Dock</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Profile &amp; Preferences
            </h3>
            <button
              onClick={() => openAuthModal('register')}
              className="py-1 px-3 text-xs font-bold text-blue-600 hover:underline"
            >
              Edit All Details &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-0.5">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Full Name</span>
              <span className="font-bold text-slate-900 dark:text-white">{currentUser.name}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-0.5">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Email</span>
              <span className="font-bold text-slate-900 dark:text-white">{currentUser.email}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-0.5">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Phone</span>
              <span className="font-bold text-slate-900 dark:text-white">{currentUser.phone}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-0.5">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">City</span>
              <span className="font-bold text-slate-900 dark:text-white">{currentUser.city}</span>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal Preview if requested */}
      {selectedInvoiceBooking && (
        <InvoiceModal
          booking={selectedInvoiceBooking}
          onClose={() => setSelectedInvoiceBooking(null)}
        />
      )}

    </div>
  );
}
