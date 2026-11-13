'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  TrendingUp,
  DollarSign,
  Truck,
  Users,
  ShieldCheck,
  Building2,
  FileCheck,
  AlertTriangle,
  Settings,
  Save,
  CheckCircle2,
  XCircle,
  Filter,
  BarChart3,
  Layers,
  Search,
  Package,
  KeyRound,
  Radio,
  Tag,
  Clock,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import { DeliveryVehicleType } from '@/types';

export default function AdminPage() {
  const {
    businessProfile,
    updateBusinessProfile,
    listings,
    verifyListing,
    deleteListing,
    deliveries,
    updateDeliveryVehicle,
    updateDeliveryStatus,
    acceptDeliveryJob,
    showToast,
  } = usePortex();

  const [activeTab, setActiveTab] = useState<
    'products' | 'deliveries' | 'analytics' | 'business' | 'drivers' | 'disputes' | 'logs'
  >('products');

  // Product verification filter
  const [productFilter, setProductFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  // Local state for admin vehicle selections on products
  const [productVehicleOverrides, setProductVehicleOverrides] = useState<Record<string, DeliveryVehicleType>>({});

  // Business Profile Form state
  const [profileForm, setProfileForm] = useState(businessProfile);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile(profileForm);
  };

  // Mock KYC Drivers Queue (Single demo entry)
  const [kycQueue, setKycQueue] = useState([
    {
      id: 'drv-kyc-1',
      name: 'Satish Kumar Chaurasia',
      phone: '+91 94151 88401',
      vehicle: 'Tata Ace CNG (UP32 BN 8812)',
      licenseNo: 'UP32 2019001421',
      status: 'PENDING_REVIEW',
      submittedAt: 'Today, 10:30 AM',
    },
  ]);

  const handleApproveDriver = (id: string) => {
    setKycQueue(prev => prev.filter(d => d.id !== id));
    showToast('Driver KYC approved! Account activated for trip dispatches.');
  };

  // Filter listings
  const filteredListings = listings.filter(item => {
    const status = item.verificationStatus || 'APPROVED';
    if (productFilter === 'ALL') return true;
    return status === productFilter;
  });

  const pendingListingsCount = listings.filter(
    l => (l.verificationStatus || 'APPROVED') === 'PENDING'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Enterprise Operations &amp; Admin Panel
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Governing entity: <strong>{businessProfile.legalName}</strong> &bull; GSTIN: {businessProfile.gstin}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
            Escrow Engine Online
          </span>
          <span className="text-[11px] px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
            GST Invoicing Active
          </span>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Pending Verifications</span>
          <div className="text-2xl font-black text-amber-500 mt-1">{pendingListingsCount}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Seller product queue</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Total GMV</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹2.48 Cr</div>
          <span className="text-[10px] text-emerald-500 font-bold mt-1 block">+18.4% this month</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Platform Revenue</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">₹24.2 L</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Commissions &amp; Fees</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Active Deliveries</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{deliveries.length}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Porter Fleet Tracking</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Escrow In-Transit</span>
          <div className="text-2xl font-black text-amber-500 mt-1">₹42.8 L</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Held for buyer safety</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 sm:gap-6 text-xs font-bold overflow-x-auto pb-1">
        {[
          {
            id: 'products',
            label: `Product Verifications ${pendingListingsCount > 0 ? `(${pendingListingsCount} Pending)` : `(${listings.length})`}`,
          },
          { id: 'deliveries', label: `Logistics & Dispatch (${deliveries.length})` },
          { id: 'analytics', label: 'Executive Analytics & GMV' },
          { id: 'business', label: 'Business Profile & GST' },
          { id: 'drivers', label: `Driver KYC Queue (${kycQueue.length})` },
          { id: 'disputes', label: 'Disputes & Escrow' },
          { id: 'logs', label: 'Security & Audit Logs' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 transition-colors whitespace-nowrap relative ${
              activeTab === tab.id
                ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PRODUCT VERIFICATIONS & VEHICLE OVERRIDE */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Seller Product Verification &amp; Shipping Vehicle Assignment
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                New products listed by sellers require Admin approval before becoming live to marketplace buyers. Admins can verify specs and override the automatic weight-based delivery vehicle.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
              {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setProductFilter(f)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    productFilter === f
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f === 'ALL'
                    ? `All (${listings.length})`
                    : f === 'PENDING'
                    ? `Pending (${pendingListingsCount})`
                    : f === 'APPROVED'
                    ? `Approved (${listings.filter(l => (l.verificationStatus || 'APPROVED') === 'APPROVED').length})`
                    : `Rejected (${listings.filter(l => l.verificationStatus === 'REJECTED').length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Listings List */}
          <div className="space-y-4">
            {filteredListings.length > 0 ? (
              filteredListings.map(listing => {
                const currentStatus = listing.verificationStatus || 'APPROVED';
                const selectedVehicle =
                  productVehicleOverrides[listing.id] ||
                  listing.recommendedVehicle ||
                  'TWO_WHEELER';

                return (
                  <div
                    key={listing.id}
                    className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      {/* Product Thumbnail */}
                      <div className="relative w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                        {listing.images && listing.images[0] ? (
                          <Image
                            src={listing.images[0]}
                            alt={listing.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                            {listing.title}
                          </h3>
                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                              currentStatus === 'APPROVED'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : currentStatus === 'PENDING'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {currentStatus === 'APPROVED'
                              ? '✓ Live in Marketplace'
                              : currentStatus === 'PENDING'
                              ? '⏳ Pending Admin Verification'
                              : '✕ Rejected'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-1">
                          {listing.description}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap pt-0.5">
                          <span className="font-bold text-slate-900 dark:text-white">
                            ₹{listing.price.toLocaleString('en-IN')}
                          </span>
                          <span>&bull;</span>
                          <span>Seller: <strong>{listing.sellerName}</strong> ({listing.sellerPhone || '+91 98765 43210'})</span>
                          <span>&bull;</span>
                          <span>City: <strong>{listing.location.city}</strong></span>
                          <span>&bull;</span>
                          <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                            Weight: {listing.packageWeightKg || listing.weightKg || 2.5} kg
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Admin Vehicle Selection & Approval Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 dark:border-slate-800">
                      {/* Vehicle Override Dropdown */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Assigned Shipping Vehicle
                        </label>
                        <select
                          value={selectedVehicle}
                          onChange={e => {
                            const newVeh = e.target.value as DeliveryVehicleType;
                            setProductVehicleOverrides(prev => ({ ...prev, [listing.id]: newVeh }));
                            showToast(`Selected ${newVeh.replace(/_/g, ' ')} for ${listing.title}`);
                          }}
                          className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="TWO_WHEELER">🏍️ 2-Wheeler Express Bike (&le; 20kg)</option>
                          <option value="THREE_WHEELER_AUTO">🛺 3-Wheeler Auto Tempo (20-500kg)</option>
                          <option value="TATA_ACE_MINI_TRUCK">🚚 Tata Ace Mini Truck (&gt; 500kg)</option>
                        </select>
                      </div>

                      {/* Approval Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-auto pt-4 sm:pt-4">
                        {currentStatus !== 'APPROVED' ? (
                          <button
                            type="button"
                            onClick={() => {
                              verifyListing(listing.id, 'APPROVED', selectedVehicle);
                            }}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-transform hover:scale-105"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve &amp; Go Live</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              verifyListing(listing.id, 'APPROVED', selectedVehicle);
                              showToast('Vehicle setting updated for live listing.');
                            }}
                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save Vehicle</span>
                          </button>
                        )}

                        {currentStatus !== 'REJECTED' && (
                          <button
                            type="button"
                            onClick={() => verifyListing(listing.id, 'REJECTED')}
                            className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold"
                          >
                            Reject
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            deleteListing(listing.id);
                            showToast('Listing removed from catalog.');
                          }}
                          className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  No listings found for the selected filter.
                </h4>
                <p className="text-xs text-slate-500">
                  Seller submissions will appear here for verification.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LOGISTICS & FLEET DISPATCH MANAGEMENT */}
      {activeTab === 'deliveries' && (
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Logistics Fleet Dispatch &amp; Live OTP Control
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage automatic vehicle assignment (Bike, Auto, Truck), view live Pickup and Drop OTPs, and monitor broadcast driver dispatch status.
            </p>
          </div>

          <div className="space-y-4">
            {deliveries.map(delivery => (
              <div
                key={delivery.id}
                className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                          {delivery.trackingNumber}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {delivery.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                        {delivery.packageType} &bull; {delivery.packageWeightKg || 2.5} kg &bull; {delivery.distanceKm} km
                      </h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Payment Method</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {delivery.paymentMethod
                        ? delivery.paymentMethod.replace(/_/g, ' ')
                        : 'ONLINE UPI'}
                    </span>
                    <span className="text-xs text-emerald-600 font-extrabold block">
                      ₹{(delivery.fare?.total || delivery.pricing?.totalAmount || 380).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Waypoints & OTP details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Pickup */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">
                      Pickup From (Seller)
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white">{delivery.pickup.contactName}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">{delivery.pickup.address}</p>
                    <p className="text-slate-500 text-[11px]">Phone: {delivery.pickup.contactPhone}</p>
                  </div>

                  {/* Drop */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 block">
                      Deliver To (Buyer)
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white">{delivery.drop.contactName}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">{delivery.drop.address}</p>
                    <p className="text-slate-500 text-[11px]">Phone: {delivery.drop.contactPhone}</p>
                  </div>

                  {/* Security OTPs Box */}
                  <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-purple-700 dark:text-purple-300 block flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5" /> Live Security OTPs
                    </span>

                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <span className="text-slate-600 dark:text-slate-400">Pickup OTP:</span>
                      <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-emerald-500/30">
                        {delivery.pickupOtp || delivery.pickup?.otp || '4921'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Drop OTP:</span>
                      <span className="font-mono font-black text-sm text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-blue-500/30">
                        {delivery.dropOtp || delivery.drop?.otp || '8302'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Admin Override Vehicle & Driver Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Shipping Vehicle:
                    </span>
                    <select
                      value={delivery.vehicleType}
                      onChange={e => {
                        const newVeh = e.target.value as DeliveryVehicleType;
                        updateDeliveryVehicle(delivery.id, newVeh);
                      }}
                      className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    >
                      <option value="TWO_WHEELER">🏍️ 2-Wheeler Express Bike (&le; 20kg)</option>
                      <option value="THREE_WHEELER_AUTO">🛺 3-Wheeler Auto Tempo (20-500kg)</option>
                      <option value="TATA_ACE_MINI_TRUCK">🚚 Tata Ace Mini Truck (&gt; 500kg)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    {delivery.driverId ? (
                      <span className="text-xs text-slate-500">
                        Assigned Driver: <strong>{delivery.driverName}</strong> ({delivery.driverVehiclePlate || delivery.vehicleNumber || 'UP32 EZ 4912'})
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 font-bold flex items-center gap-1 border border-blue-500/20">
                          <Radio className="w-3.5 h-3.5 animate-pulse" />
                          <span>Open Broadcast to Fleet Drivers</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            acceptDeliveryJob(delivery.id, {
                              id: 'drv-imran',
                              name: 'Mohd. Imran Khan',
                              phone: '+91 94150 99999',
                            });
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow"
                        >
                          Assign Driver Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EXECUTIVE ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Revenue Chart Graphic */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Monthly GMV &amp; Logistics Revenue Trend (₹ Lakhs)
                </h3>
                <span className="text-xs text-slate-400">Past 6 Months</span>
              </div>

              {/* Bar Graph Simulation */}
              <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
                {[
                  { month: 'May', gmv: 28, rev: 3.2 },
                  { month: 'Jun', gmv: 34, rev: 4.1 },
                  { month: 'Jul', gmv: 42, rev: 5.3 },
                  { month: 'Aug', gmv: 56, rev: 6.8 },
                  { month: 'Sep', gmv: 74, rev: 8.9 },
                  { month: 'Oct', gmv: 98, rev: 12.2 },
                ].map(item => (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1 h-36">
                      <div
                        style={{ height: `${(item.gmv / 100) * 100}%` }}
                        className="w-1/2 bg-blue-600 rounded-t-lg transition-all"
                        title={`GMV: ₹${item.gmv} Lakh`}
                      />
                      <div
                        style={{ height: `${(item.rev / 15) * 100}%` }}
                        className="w-1/2 bg-emerald-500 rounded-t-lg transition-all"
                        title={`Net Revenue: ₹${item.rev} Lakh`}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">{item.month}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-6 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                  <span className="w-3 h-3 rounded-full bg-blue-600" /> Marketplace GMV
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" /> Porter Delivery Commission
                </span>
              </div>
            </div>

            {/* Hyperlocal City Fleet Distribution */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Geographic Delivery Volume Breakdown
                </h3>
                <span className="text-xs text-slate-400 font-semibold">Active Hubs</span>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { hub: 'Lucknow (Aliganj & Gomti Nagar)', count: '6,420 trips', share: '43%' },
                  { hub: 'Delhi NCR (Gurgaon & Noida)', count: '4,180 trips', share: '28%' },
                  { hub: 'Bangalore (Indiranagar & HSR)', count: '2,490 trips', share: '17%' },
                  { hub: 'Mumbai (Andheri & Bandra)', count: '1,800 trips', share: '12%' },
                ].map(h => (
                  <div key={h.hub} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800 dark:text-slate-200">{h.hub}</span>
                      <span className="text-slate-500">{h.count} ({h.share})</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: h.share }}
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONFIGURABLE BUSINESS PROFILE & GST (MANGO TECH ENTERPRISES) */}
      {activeTab === 'business' && (
        <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Business Profile &amp; Regulatory Settings
              </h3>
              <p className="text-xs text-slate-500">
                Configure legal enterprise information used across GST invoices, consignment notes, and legal disclosures.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Government GST Reg-06 Verified
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Legal Entity Name
                </label>
                <input
                  type="text"
                  value={profileForm.legalName}
                  onChange={e => setProfileForm({ ...profileForm, legalName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Trade Name
                </label>
                <input
                  type="text"
                  value={profileForm.tradeName}
                  onChange={e => setProfileForm({ ...profileForm, tradeName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  GST Registration Number (GSTIN)
                </label>
                <input
                  type="text"
                  value={profileForm.gstin}
                  onChange={e => setProfileForm({ ...profileForm, gstin: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-blue-600 dark:text-blue-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Constitution of Business
                </label>
                <input
                  type="text"
                  value={profileForm.constitution}
                  onChange={e => setProfileForm({ ...profileForm, constitution: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Address of Principal Place of Business
              </label>
              <textarea
                rows={2}
                value={profileForm.principalAddress}
                onChange={e => setProfileForm({ ...profileForm, principalAddress: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Jurisdictional Office
                </label>
                <input
                  type="text"
                  value={profileForm.jurisdiction}
                  onChange={e => setProfileForm({ ...profileForm, jurisdiction: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={profileForm.supportEmail}
                  onChange={e => setProfileForm({ ...profileForm, supportEmail: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Support Phone / Hotline
                </label>
                <input
                  type="text"
                  value={profileForm.supportPhone}
                  onChange={e => setProfileForm({ ...profileForm, supportPhone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Commission & Tax Config */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
                Platform Commission &amp; Tax Rates
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Buyer Platform Fee (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={profileForm.platformFeePercent}
                    onChange={e =>
                      setProfileForm({ ...profileForm, platformFeePercent: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Logistics Fleet Commission (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={profileForm.deliveryCommissionPercent}
                    onChange={e =>
                      setProfileForm({
                        ...profileForm,
                        deliveryCommissionPercent: Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Goods Transport GST Rate (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={profileForm.taxRatePercent}
                    onChange={e =>
                      setProfileForm({ ...profileForm, taxRatePercent: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Save className="w-4 h-4" />
                <span>Save Business &amp; Tax Configuration</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: DRIVER KYC QUEUE (Single Demo Entry) */}
      {activeTab === 'drivers' && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Driver Verification &amp; Commercial Permit Review
            </h3>
            <span className="text-xs text-slate-400">{kycQueue.length} pending approval</span>
          </div>

          {kycQueue.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {kycQueue.map(driver => (
                <div key={driver.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {driver.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {driver.phone} &bull; {driver.vehicle}
                    </p>
                    <p className="text-[11px] font-mono text-purple-600 dark:text-purple-400 mt-1">
                      Driving License: {driver.licenseNo} &bull; Submitted {driver.submittedAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveDriver(driver.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve KYC</span>
                    </button>
                    <button
                      onClick={() => {
                        setKycQueue(prev => prev.filter(d => d.id !== driver.id));
                        showToast('Driver application rejected.');
                      }}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              All driver KYC applications are up to date!
            </div>
          )}
        </div>
      )}

      {/* TAB 6: DISPUTES & ESCROW HOLDS (Single Demo Entry) */}
      {activeTab === 'disputes' && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Escrow Dispute Resolutions &amp; Buyer Claims
          </h3>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">
                Claim #DSP-8910: Condition Mismatch on Dining Table
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-bold text-[10px]">
                Under Review
              </span>
            </div>
            <p className="text-slate-500">
              Buyer reported minor scratch on glass table top during Porter unloading. Escrow payment of ₹24,500 held.
            </p>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => showToast('Dispute resolved: Released ₹22,500 to seller with ₹2,000 damage concession.')}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
              >
                Resolve &amp; Release Escrow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 font-mono text-xs">
          <h3 className="font-bold text-sm font-sans text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            Platform Audit Trail
          </h3>
          <div className="space-y-2 text-slate-600 dark:text-slate-400">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span>[12:17 PM] Dispatched Tata Ace driver drv-301 to Lucknow Gomti Nagar</span>
              <span className="text-slate-400">IP 103.21.58.12</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span>[11:45 AM] Escrow authorization confirmed for Order #ORD-7729 (₹1,54,000)</span>
              <span className="text-slate-400">Razorpay Hook</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span>[10:12 AM] Business profile config updated for MANGO TECH ENTERPRISES</span>
              <span className="text-slate-400">Admin Session</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
