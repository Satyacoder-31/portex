'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Truck,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  KeyRound,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Camera,
  PenTool,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import LiveMap from '@/components/common/LiveMap';
import InvoiceModal from '@/components/common/InvoiceModal';

export default function TrackingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const trackingId = params?.id as string;

  const { deliveries, updateDeliveryStatus, verifyDeliveryOtp, completeProofOfDelivery, showToast } = usePortex();

  // Find booking or default to first
  const booking = deliveries.find(d => d.id === trackingId || d.trackingNumber === trackingId) || deliveries[0];

  const [enteredOtp, setEnteredOtp] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPodModal, setShowPodModal] = useState(false);
  const [signatureText, setSignatureText] = useState('Krishna Verma');

  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">No active delivery found</h2>
        <Link href="/deliver" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold">
          Book a Delivery
        </Link>
      </div>
    );
  }

  const handleOtpSubmit = (type: 'pickup' | 'delivery') => {
    if (!enteredOtp) {
      showToast('Please enter the 4-digit OTP');
      return;
    }
    const success = verifyDeliveryOtp(booking.id, enteredOtp, type);
    if (success) {
      setEnteredOtp('');
    }
  };

  const handleSimulateNextStage = () => {
    const stageOrder: any[] = [
      'BOOKING_CREATED',
      'DRIVER_ASSIGNED',
      'DRIVER_ARRIVING_PICKUP',
      'ITEM_PICKED_UP',
      'IN_TRANSIT',
      'NEAR_DESTINATION',
      'DELIVERED',
    ];
    const currentIdx = stageOrder.indexOf(booking.status);
    if (currentIdx < stageOrder.length - 1) {
      updateDeliveryStatus(booking.id, stageOrder[currentIdx + 1]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Link
            href="/tracking"
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
                Trip #{booking.trackingNumber}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {booking.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {booking.packageType} &bull; {booking.vehicleName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateNextStage}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors"
            title="Advance the delivery status simulator"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Next Stage</span>
          </button>

          <button
            onClick={() => setShowInvoiceModal(true)}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Live Map (Left 7 Cols) + Status Timeline & OTP (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Map & Driver Telemetry (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <LiveMap
            pickupAddress={booking.pickup.address}
            dropAddress={booking.drop.address}
            vehicleType={booking.vehicleType}
            driverName={booking.driverName}
            driverPlate={booking.driverVehiclePlate}
            statusStage={booking.status}
            heightClass="h-[280px] sm:h-[460px]"
          />

          {/* Driver Contact & Vehicle Profile Card */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={booking.driverAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80'}
                alt={booking.driverName}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {booking.driverName}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                    ⭐ {booking.driverRating || 4.9}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {booking.driverVehicleModel} &bull; <strong className="text-slate-800 dark:text-slate-200">{booking.driverVehiclePlate}</strong>
                </p>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Portex KYC Verified Driver Partner
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`tel:${booking.driverPhone}`}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Driver</span>
              </a>

              <Link
                href="/chat"
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Status Stepper, OTPs & POD (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* OTP Handoff Verification Card */}
          <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-sm">Security OTPs for Handover</h4>
              </div>
              <span className="text-[10px] text-slate-400">Never share OTP on phone</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Pickup OTP
                </span>
                <span className="text-2xl font-black tracking-widest text-emerald-400 font-mono">
                  {booking.pickup.otp}
                </span>
                <span className="text-[10px] text-slate-400 block">Give to driver at pickup</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Delivery OTP
                </span>
                <span className="text-2xl font-black tracking-widest text-blue-400 font-mono">
                  {booking.drop.otp}
                </span>
                <span className="text-[10px] text-slate-400 block">Give upon safe arrival</span>
              </div>
            </div>

            {/* Test OTP Verification Simulator Box */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <label className="text-xs text-slate-400 block">
                Driver OTP Terminal Simulator:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter 4-digit OTP"
                  value={enteredOtp}
                  onChange={e => setEnteredOtp(e.target.value)}
                  maxLength={4}
                  className="w-32 p-2 bg-slate-800 border border-slate-700 rounded-xl text-center font-mono font-bold text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleOtpSubmit(booking.status === 'ITEM_PICKED_UP' ? 'delivery' : 'pickup')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Verify OTP
                </button>
              </div>
            </div>
          </div>

          {/* Delivery Status Timeline */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Trip Milestone Timeline
            </h4>

            <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {booking.timeline.map((item, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Step Icon */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors ${
                      item.completed
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                        : item.active
                        ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-current" />
                    )}
                  </div>

                  {/* Step Title & Timestamp */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-bold leading-tight ${
                        item.active
                          ? 'text-blue-600 dark:text-blue-400'
                          : item.completed
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400'
                      }`}
                    >
                      {item.title}
                    </p>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Proof of Delivery / Signature Card */}
            {booking.status === 'DELIVERED' && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Digital Proof of Delivery Confirmed</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Signed by: <strong>{booking.podSignature || 'Krishna Verma'}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tax Invoice Modal */}
      {showInvoiceModal && (
        <InvoiceModal booking={booking} onClose={() => setShowInvoiceModal(false)} />
      )}
    </div>
  );
}
