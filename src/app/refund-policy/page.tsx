'use client';

import React from 'react';
import { ShieldCheck, RotateCcw } from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';

export default function RefundPolicyPage() {
  const { businessProfile } = usePortex();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <RotateCcw className="w-8 h-8 text-amber-500" />
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Escrow, Cancellation &amp; Refund Policy
          </h1>
          <p className="text-xs text-slate-500">Commercial terms governing marketplace orders &amp; Porter delivery bookings</p>
        </div>
      </div>

      <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">1. Delivery Cancellation Window</h3>
        <p>
          Customers may cancel a Porter vehicle dispatch free of penalty up until a driver partner arrives at the designated pickup location. Once a driver has arrived or loaded items, a minimal dry-run compensation fee applies.
        </p>

        <h3 className="font-bold text-slate-900 dark:text-white text-sm">2. Escrow Protection Mechanism</h3>
        <p>
          In marketplace transactions, buyer funds are held in escrow. If the delivered item differs substantially from the seller&rsquo;s listing photos or specifications, the buyer can flag a dispute within 2 hours of arrival before releasing the delivery OTP.
        </p>

        <h3 className="font-bold text-slate-900 dark:text-white text-sm">3. Refund Processing Timelines</h3>
        <p>
          Approved refunds are credited back to the original source (UPI, Debit/Credit Card, or NetBanking) within 24 to 48 banking hours.
        </p>
      </div>
    </div>
  );
}
