'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ArrowRight, MapPin, Calendar, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';

export default function TrackingIndexPage() {
  const { deliveries } = usePortex();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Deliveries &amp; Shipments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time GPS locations, OTP handoffs, and digital proof of delivery
          </p>
        </div>

        <Link
          href="/deliver"
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Truck className="w-4 h-4" />
          <span>+ Book New Delivery</span>
        </Link>
      </div>

      <div className="space-y-4">
        {deliveries.map(d => (
          <div
            key={d.id}
            className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {d.packageType}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {d.trackingNumber} &bull; {d.vehicleName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold ${
                    d.status === 'DELIVERED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400 animate-pulse'
                  }`}
                >
                  {d.status.replace(/_/g, ' ')}
                </span>
                <Link
                  href={`/tracking/${d.id}`}
                  className="px-3.5 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Track Live</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Pickup</span>
                  <span>{d.pickup.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Destination</span>
                  <span>{d.drop.address}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span>Driver: <strong className="text-slate-800 dark:text-slate-200">{d.driverName}</strong></span>
                <span>Distance: <strong>{d.distanceKm} km</strong></span>
              </div>
              <div className="font-bold text-slate-900 dark:text-white">
                Total: ₹{d.pricing.totalAmount}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
