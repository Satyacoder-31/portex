'use client';

import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';

export default function PrivacyPage() {
  const { businessProfile } = usePortex();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <Lock className="w-8 h-8 text-emerald-600" />
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Privacy Policy &amp; Data Protection
          </h1>
          <p className="text-xs text-slate-500">How PORTEX safeguards user geolocation, payments, and messaging data</p>
        </div>
      </div>

      <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-4">
        <p>
          At PORTEX, managed by <strong>{businessProfile.legalName}</strong>, your digital privacy is paramount. This policy clarifies what information we collect when you browse listings or dispatch logistics vehicles.
        </p>

        <h3 className="font-bold text-slate-900 dark:text-white text-sm">1. Geolocation &amp; Telemetry Data</h3>
        <p>
          We capture real-time driver coordinates strictly during active trip fulfillment to power customer tracking, ETA calculation, and safety geofencing.
        </p>

        <h3 className="font-bold text-slate-900 dark:text-white text-sm">2. Phone Number Masking</h3>
        <p>
          Calls and texts initiated between customers, sellers, and delivery partners are routed through virtual masking relays to ensure direct phone numbers remain protected.
        </p>

        <h3 className="font-bold text-slate-900 dark:text-white text-sm">3. Financial &amp; KYC Data Security</h3>
        <p>
          All government ID numbers (Aadhaar, PAN, Driving Licenses) are encrypted with 256-bit AES encryption at rest. Payment card numbers are processed through certified PCI-DSS Level 1 payment gateways.
        </p>
      </div>
    </div>
  );
}
