'use client';

import React from 'react';
import { ShieldCheck, FileText } from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';

export default function TermsPage() {
  const { businessProfile } = usePortex();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <FileText className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Terms of Service &amp; User Agreement
          </h1>
          <p className="text-xs text-slate-500">Last updated: October 2026 &bull; Compliant with Indian IT Act 2000</p>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-4">
        <section className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">1. Governing Commercial Entity</h3>
          <p>
            The platform PORTEX (&ldquo;Application&rdquo;, &ldquo;Platform&rdquo;) is operated by <strong>{businessProfile.legalName}</strong> (Trade Name: {businessProfile.tradeName}), registered under GSTIN <strong>{businessProfile.gstin}</strong> with principal place of business at {businessProfile.principalAddress}.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">2. Unified Marketplace &amp; Logistics Model</h3>
          <p>
            PORTEX facilitates peer-to-peer sale of second-hand goods combined with on-demand logistics dispatch under Goods Transport Agency (GTA) regulations (SAC 9965).
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">3. Escrow Buyer Protection</h3>
          <p>
            Payments made via online channels are retained in secure escrow until physical delivery inspection is satisfied and verified via the one-time delivery OTP handoff.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">4. Commercial Driver Partner Conduct</h3>
          <p>
            All registered drivers undergo KYC screening, commercial driving permit verification, and vehicle fitness validation prior to trip dispatch.
          </p>
        </section>
      </div>
    </div>
  );
}
