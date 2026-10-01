'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, MapPin, ArrowRight, ShieldCheck, X, BellRing, Navigation } from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';

export default function DriverIncomingModal() {
  const router = useRouter();
  const { incomingJob, acceptIncomingJob, rejectIncomingJob } = usePortex();
  const [countdown, setCountdown] = useState(45);

  useEffect(() => {
    if (!incomingJob) return;

    setCountdown(45);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          rejectIncomingJob();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [incomingJob]);

  if (!incomingJob) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-emerald-500/50 shadow-2xl overflow-hidden p-6 text-white space-y-5">
        {/* Pulsing Radar Ring & Title */}
        <div className="text-center relative">
          <div className="w-20 h-20 mx-auto relative flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            <span className="absolute inset-2 rounded-full bg-emerald-500/30 animate-pulse" />
            <div className="w-14 h-14 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg font-bold">
              <Truck className="w-7 h-7" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
              Incoming Portex Trip Request
            </span>
            <h3 className="text-xl font-black mt-2 tracking-tight">
              {incomingJob.vehicleType}
            </h3>
            <p className="text-xs text-slate-400">
              Auto-expires in <strong className="text-amber-400 font-mono text-sm">{countdown}s</strong>
            </p>
          </div>
        </div>

        {/* Fare & Distance Highlight Banner */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-slate-800/80 rounded-2xl border border-slate-700">
          <div className="text-center border-r border-slate-700 pr-2">
            <span className="text-[11px] text-slate-400 block">Driver Payout</span>
            <span className="text-2xl font-black text-emerald-400">
              ₹{Math.round(incomingJob.fareAmount * 0.82)}
            </span>
          </div>
          <div className="text-center pl-2">
            <span className="text-[11px] text-slate-400 block">Est. Distance</span>
            <span className="text-2xl font-black text-white">
              {incomingJob.distanceKm} km
            </span>
          </div>
        </div>

        {/* Pickup and Drop Details */}
        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Pickup Address</span>
              <p className="text-slate-200 font-medium">{incomingJob.pickupAddress}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 mt-1 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Destination Address</span>
              <p className="text-slate-200 font-medium">{incomingJob.dropAddress}</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-[11px] flex justify-between">
            <span>Cargo: <strong>{incomingJob.packageType}</strong></span>
            <span>Weight: <strong>{incomingJob.weightKg} kg</strong></span>
          </div>
        </div>

        {/* CTAs: Accept or Reject */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={rejectIncomingJob}
            className="py-3 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
          >
            Pass Job
          </button>

          <button
            onClick={() => {
              acceptIncomingJob(incomingJob.id);
              router.push('/driver');
            }}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
          >
            <span>Accept Trip</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
