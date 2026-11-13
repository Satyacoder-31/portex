'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  CreditCard,
  Banknote,
  QrCode,
  Package,
} from 'lucide-react';
import { Listing, DeliveryVehicleType } from '@/types';
import { VEHICLE_OPTIONS } from '@/lib/data/mockData';
import { usePortex } from '@/lib/store/portexStore';

interface RequestDeliveryModalProps {
  listing: Listing;
  offerPrice?: number;
  onClose: () => void;
}

export default function RequestDeliveryModal({ listing, offerPrice, onClose }: RequestDeliveryModalProps) {
  const router = useRouter();
  const { createDeliveryBooking, currentUser, showToast } = usePortex();

  // Automatic shipping vehicle assignment on the basis of weight (or admin-configured vehicle)
  const autoVehicleType: DeliveryVehicleType =
    listing.recommendedVehicle ||
    (listing.weightKg <= 20
      ? 'TWO_WHEELER'
      : listing.weightKg <= 500
      ? 'THREE_WHEELER_AUTO'
      : 'TATA_ACE_MINI_TRUCK');

  const [selectedVehicleType, setSelectedVehicleType] = useState<DeliveryVehicleType>(autoVehicleType);
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE_UPI' | 'CASH_ON_DELIVERY' | 'CARD' | 'NETBANKING' | 'WALLET'>('ONLINE_UPI');
  const [dropAddress, setDropAddress] = useState('E-3/776, Sector-I Aliganj, Lucknow, UP 226024');
  const [contactPhone, setContactPhone] = useState(currentUser.phone);
  const [specialInstructions, setSpecialInstructions] = useState('Handle with care, call on reaching gate.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedVehicle = VEHICLE_OPTIONS.find(v => v.type === selectedVehicleType) || VEHICLE_OPTIONS[2];

  // Calculated distance & fare
  const distanceKm = 8.6;
  const baseFare = selectedVehicle.baseFare;
  const distanceFare = Number((distanceKm * selectedVehicle.perKmRate).toFixed(1));
  const weightSurcharge = listing.weightKg > 50 ? 60 : 0;
  const gstAmount = Number(((baseFare + distanceFare + weightSurcharge) * 0.18).toFixed(1));
  const totalAmount = Number((baseFare + distanceFare + weightSurcharge + gstAmount).toFixed(1));

  const handleConfirm = () => {
    setIsSubmitting(true);

    const pickupOtp = String(Math.floor(1000 + Math.random() * 9000));
    const dropOtp = String(Math.floor(1000 + Math.random() * 9000));

    const booking = createDeliveryBooking({
      listingId: listing.id,
      listingTitle: listing.title,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: contactPhone,
      vehicleType: selectedVehicleType,
      vehicleName: selectedVehicle.name,
      pickup: {
        address: listing.location.address + ', ' + listing.location.city,
        city: listing.location.city,
        contactName: listing.sellerName,
        contactPhone: listing.sellerPhone,
        lat: listing.location.lat,
        lng: listing.location.lng,
        otp: pickupOtp,
      },
      drop: {
        address: dropAddress,
        city: 'Lucknow',
        contactName: currentUser.name,
        contactPhone: contactPhone,
        lat: 26.8854,
        lng: 80.9452,
        otp: dropOtp,
      },
      packageType: `${listing.category.toUpperCase()} - ${listing.title.slice(0, 30)}`,
      packageWeightKg: listing.weightKg,
      dimensions: listing.dimensions,
      specialInstructions,
      distanceKm,
      durationMins: 24,
      pricing: {
        baseFare,
        distanceFare,
        weightSurcharge,
        gstAmount,
        discount: 0,
        totalAmount,
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
    });

    setTimeout(() => {
      onClose();
      router.push(`/tracking/${booking.id}`);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0e0e13] rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden max-h-[90vh] flex flex-col text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-[#121218]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Request Porter Hyperlocal Delivery
              </h3>
              <p className="text-xs text-zinc-400">
                Direct dispatch from seller’s pickup location to your doorstep
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Item Summary Banner */}
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center gap-3">
            <img
              src={listing.images[0]}
              alt={listing.title}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589384267710-7a170981ca78?auto=format&fit=crop&w=400&q=80';
              }}
              className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-zinc-800"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-xs text-zinc-100 truncate">
                {listing.title}
              </h4>
              <div className="text-[11px] text-zinc-400 flex items-center gap-3 mt-1">
                <span>Weight: <strong className="text-zinc-200">{listing.weightKg} kg</strong></span>
                <span>Dim: <strong className="text-zinc-200">{listing.dimensions}</strong></span>
                <span>Price: <strong className="text-amber-400 font-bold">₹{listing.price.toLocaleString('en-IN')}</strong></span>
                {offerPrice && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    Deal: ₹{offerPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pickup and Drop Route Points */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl border border-zinc-800 bg-zinc-950/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>PICKUP LOCATION (Seller: {listing.sellerName})</span>
              </div>
              <p className="text-xs text-zinc-300 pl-4 font-medium">
                {listing.location.address}, {listing.location.city} ({listing.location.pincode})
              </p>
              <div className="text-[11px] text-zinc-400 pl-4">Contact: {listing.sellerPhone}</div>
            </div>

            <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>DROP DESTINATION (Your Delivery Address)</span>
              </div>
              <input
                type="text"
                value={dropAddress}
                onChange={e => setDropAddress(e.target.value)}
                className="w-full text-xs font-medium bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-amber-400"
              />
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <span>Receiver Phone:</span>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200"
                />
              </div>
            </div>
          </div>

          {/* Automatic Shipping Vehicle Assignment */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                Shipping Fleet Assignment
              </label>
              <span className="text-[11px] font-bold text-amber-400">
                Automatic based on weight ({listing.weightKg} kg)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {VEHICLE_OPTIONS.slice(0, 3).map(v => (
                <button
                  key={v.type}
                  type="button"
                  onClick={() => setSelectedVehicleType(v.type)}
                  className={`p-3 rounded-2xl border text-left transition-all relative ${
                    selectedVehicleType === v.type
                      ? 'border-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                      : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                  }`}
                >
                  {v.type === autoVehicleType && (
                    <span className="absolute -top-2 right-2 text-[9px] font-black bg-amber-400 text-black px-2 py-0.5 rounded-full shadow-sm">
                      Auto-Assigned
                    </span>
                  )}
                  <div className="font-bold text-xs text-white">{v.name}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Payload: &le; {v.maxWeightKg} kg</div>
                  <div className="text-xs font-black text-amber-400 mt-1.5">
                    ₹{(v.baseFare + distanceKm * v.perKmRate).toFixed(0)} est.
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Choose Payment Method */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 block">
              Choose Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'ONLINE_UPI', name: 'Instant UPI / QR', sub: 'PhonePe, GPay, Paytm', icon: QrCode },
                { id: 'CASH_ON_DELIVERY', name: 'Cash on Delivery', sub: 'Pay on Doorstep Delivery', icon: Banknote },
                { id: 'CARD', name: 'Debit / Credit Card', sub: 'Visa, Mastercard, RuPay', icon: CreditCard },
                { id: 'NETBANKING', name: 'Net Banking', sub: 'All Indian Banks', icon: ShieldCheck },
                { id: 'WALLET', name: 'Portex Wallet', sub: 'Escrow Protected', icon: Package },
              ].map(pm => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id as any)}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    paymentMethod === pm.id
                      ? 'border-amber-400 bg-amber-500/15 text-amber-300 font-bold ring-1 ring-amber-400'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <pm.icon className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                    <span>{pm.name}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5 truncate">{pm.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Fare Summary Breakdown */}
          <div className="p-4 rounded-2xl bg-zinc-950 text-white space-y-2 border border-amber-500/25">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Estimated Distance</span>
              <span>{distanceKm} km (~24 mins)</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Base Fare & Handling</span>
              <span>₹{baseFare}</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Distance Freight ({distanceKm} km &times; ₹{selectedVehicle.perKmRate}/km)</span>
              <span>₹{distanceFare}</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-400">
              <span>GST (18% under SAC 9965)</span>
              <span>₹{gstAmount}</span>
            </div>
            <div className="pt-2 border-t border-zinc-800 flex justify-between font-black text-sm text-amber-400">
              <span>Total Logistics Fare</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-[#121218] flex items-center justify-between">
          <div className="text-xs text-zinc-400">
            Payment Mode:{' '}
            <strong className="text-amber-400">
              {paymentMethod === 'ONLINE_UPI'
                ? 'Online UPI / QR'
                : paymentMethod === 'CASH_ON_DELIVERY'
                ? 'Cash on Delivery (Pay on Doorstep)'
                : paymentMethod === 'CARD'
                ? 'Credit / Debit Card'
                : paymentMethod === 'NETBANKING'
                ? 'Net Banking'
                : 'Portex Wallet'}
            </strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-black text-xs font-black rounded-xl shadow-lg shadow-amber-500/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>{isSubmitting ? 'Confirming Dispatch...' : 'Confirm & Dispatch Driver'}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
