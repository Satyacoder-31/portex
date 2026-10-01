'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Truck,
  MapPin,
  Package,
  Calendar,
  Clock,
  ShieldCheck,
  ArrowRight,
  Info,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import { DeliveryVehicleType } from '@/types';
import { VEHICLE_OPTIONS } from '@/lib/data/mockData';
import VehicleSelector from '@/components/delivery/VehicleSelector';
import LiveMap from '@/components/common/LiveMap';

export default function DeliverPage() {
  const router = useRouter();
  const { currentUser, createDeliveryBooking, openAuthModal } = usePortex();

  // Booking Form State - synced with currentUser.porterProfile if available
  const [pickupAddress, setPickupAddress] = useState(
    currentUser.porterProfile?.defaultPickupAddress || 'Gomti Nagar Extension, Sector 4, Lucknow'
  );
  const [dropAddress, setDropAddress] = useState('E-3/776, Sector-I Aliganj, Lucknow, UP 226024');
  const [packageType, setPackageType] = useState(
    currentUser.porterProfile?.frequentCargoType || 'Furniture & Home Appliances'
  );
  const [weightKg, setWeightKg] = useState<number>(45);
  const [dimensions, setDimensions] = useState('120 x 80 x 60 cm');
  const [selectedVehicleType, setSelectedVehicleType] = useState<DeliveryVehicleType>(
    currentUser.porterProfile?.preferredVehicle || 'TATA_ACE_MINI_TRUCK'
  );
  const [pickupTime, setPickupTime] = useState<'NOW' | 'LATER'>('NOW');
  const [specialInstructions, setSpecialInstructions] = useState('Fragile items. Please bring packing blankets.');
  const [isBooking, setIsBooking] = useState(false);

  // Dynamic distance calculation simulation
  const distanceKm = 11.4;
  const selectedVehicle = VEHICLE_OPTIONS.find(v => v.type === selectedVehicleType) || VEHICLE_OPTIONS[2];

  // Pricing formula
  const baseFare = selectedVehicle.baseFare;
  const distanceFare = Number((distanceKm * selectedVehicle.perKmRate).toFixed(1));
  const weightSurcharge = weightKg > 100 ? 100 : weightKg > 30 ? 50 : 0;
  const gstAmount = Number(((baseFare + distanceFare + weightSurcharge) * 0.18).toFixed(1));
  const totalAmount = Number((baseFare + distanceFare + weightSurcharge + gstAmount).toFixed(1));

  const handleBookDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);

    const booking = createDeliveryBooking({
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      vehicleType: selectedVehicleType,
      vehicleName: selectedVehicle.name,
      pickup: {
        address: pickupAddress,
        city: 'Lucknow',
        contactName: 'Pooja Agarwal',
        contactPhone: '+91 94150 72199',
        lat: 26.8505,
        lng: 81.0065,
        otp: '4921',
      },
      drop: {
        address: dropAddress,
        city: 'Lucknow',
        contactName: currentUser.name,
        contactPhone: currentUser.phone,
        lat: 26.8854,
        lng: 80.9452,
        otp: '8302',
      },
      packageType,
      packageWeightKg: Number(weightKg) || 10,
      dimensions,
      specialInstructions,
      distanceKm,
      durationMins: 28,
      pricing: {
        baseFare,
        distanceFare,
        weightSurcharge,
        gstAmount,
        discount: 0,
        totalAmount,
      },
      paymentMethod: 'ONLINE_UPI',
      paymentStatus: 'PAID',
    });

    setTimeout(() => {
      setIsBooking(false);
      router.push(`/tracking/${booking.id}`);
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Truck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Book On-Demand Hyperlocal Delivery
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Porter logistics fleet: 2-Wheelers, 3-Wheelers, Tata Ace mini trucks, and commercial tempos
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> GPS Tracked
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-blue-500" /> ~15 Min Dispatch
          </span>
        </div>
      </div>

      {/* Main Grid: Form Inputs (Left 7 Cols) + Live Map & Fare Summary (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Shipper Profile Card */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/20 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    Logged In Shipper: {currentUser.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                    {currentUser.porterProfile?.userType === 'BUSINESS' ? 'GST Business' : 'Personal Parcel'}
                  </span>
                  {currentUser.porterProfile?.gstin && (
                    <span className="hidden sm:inline text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                      {currentUser.porterProfile.gstin}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 truncate max-w-md">
                  Saved Pickup: {currentUser.porterProfile?.defaultPickupAddress || pickupAddress}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal('login', 'PORTER_PARCEL')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 underline self-start sm:self-auto cursor-pointer"
            >
              Change Shipper / Log In &rarr;
            </button>
          </div>

          <form onSubmit={handleBookDelivery} className="space-y-6">
            {/* 1. Pickup & Destination Points */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-500" />
                <span>1. Route &amp; Addresses</span>
              </h3>

              {/* Pickup */}
              <div>
                <label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Pickup Address (Sender)
                </label>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={e => setPickupAddress(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Drop */}
              <div>
                <label className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Drop Destination (Receiver)
                </label>
                <input
                  type="text"
                  value={dropAddress}
                  onChange={e => setDropAddress(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Timing */}
              <div className="pt-2 flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Dispatch Time:</span>
                <button
                  type="button"
                  onClick={() => setPickupTime('NOW')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                    pickupTime === 'NOW'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent'
                  }`}
                >
                  ⚡ Immediate Dispatch (~10 mins)
                </button>
                <button
                  type="button"
                  onClick={() => setPickupTime('LATER')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                    pickupTime === 'LATER'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent'
                  }`}
                >
                  Schedule Later
                </button>
              </div>
            </div>

            {/* 2. Package Specifications */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-500" />
                <span>2. Package &amp; Consignment Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Item / Cargo Type
                  </label>
                  <input
                    type="text"
                    value={packageType}
                    onChange={e => setPackageType(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Approx. Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={e => setWeightKg(Number(e.target.value))}
                    min={1}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Driver Instructions &amp; Handling Notes
                </label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Please bring ropes, stairs available, call sender before arriving"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* 3. Vehicle Selector */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-500" />
                <span>3. Select Vehicle Tier</span>
              </h3>

              <VehicleSelector
                selectedType={selectedVehicleType}
                onSelect={setSelectedVehicleType}
                distanceKm={distanceKm}
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isBooking}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <span>{isBooking ? 'Searching Nearest Portex Partner...' : `Confirm Booking & Dispatch Driver (₹${totalAmount})`}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Right Column: Live Route Map & Pricing Breakdown (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* Interactive Map Visual */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Live Route Estimation</span>
              <span>{distanceKm} km &bull; ~28 mins</span>
            </div>
            <LiveMap
              pickupAddress={pickupAddress}
              dropAddress={dropAddress}
              vehicleType={selectedVehicleType}
              statusStage="DRIVER_ASSIGNED"
              heightClass="h-[360px]"
            />
          </div>

          {/* Itemized Fare Card */}
          <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="font-bold text-sm">Fare Breakdown</h4>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                Guaranteed Fixed Fare
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Base Fare &amp; Loading</span>
                <span>₹{baseFare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Distance ({distanceKm} km &times; ₹{selectedVehicle.perKmRate}/km)</span>
                <span>₹{distanceFare.toFixed(2)}</span>
              </div>
              {weightSurcharge > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Heavy Weight Surcharge</span>
                  <span>₹{weightSurcharge.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">GST (18% under SAC 9965)</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
              <div>
                <span className="text-[11px] text-slate-400 block">Total Payable</span>
                <span className="text-xs text-emerald-400">Includes all taxes &amp; tolls</span>
              </div>
              <span className="text-2xl font-black text-emerald-400">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
