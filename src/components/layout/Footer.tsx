'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Lock, Heart, Award, ArrowUpRight } from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';

export default function Footer() {
  const { businessProfile } = usePortex();

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Prop Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800/80">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold">100% Verified Sellers</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Strict KYC & fraud detection</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold">Hyperlocal Porter Dispatch</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">2-Wheeler to 14ft heavy trucks</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold">Escrow Purchase Safety</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Funds released upon delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold">Digital Proof of Delivery</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">OTP verification & signatures</p>
            </div>
          </div>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          {/* Col 1: Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-emerald-500 flex items-center justify-center text-white font-extrabold text-lg">
                P
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                PORT<span className="text-blue-500">EX</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              PORTEX is India’s next-generation unified platform bridging secondhand peer-to-peer commerce and on-demand hyperlocal logistics. Buy anything from anywhere in the city, and have a Porter truck or bike bring it straight to your doorstep within hours.
            </p>

            {/* Business Registration Reference Badge */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1">
              <div className="text-slate-300 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Operating Entity: {businessProfile.legalName}
              </div>
              <div className="text-slate-500 font-mono text-[10px]">
                GSTIN: {businessProfile.gstin} &bull; {businessProfile.jurisdiction}
              </div>
              <div className="text-slate-500 text-[10px] truncate">
                Regd: {businessProfile.principalAddress}
              </div>
            </div>
          </div>

          {/* Col 2: Marketplace */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">Marketplace</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/marketplace" className="hover:text-white transition-colors">
                  All Listings
                </Link>
              </li>
              <li>
                <Link href="/marketplace?cat=electronics" className="hover:text-white transition-colors">
                  Electronics & Mobiles
                </Link>
              </li>
              <li>
                <Link href="/marketplace?cat=furniture" className="hover:text-white transition-colors">
                  Home & Furniture
                </Link>
              </li>
              <li>
                <Link href="/marketplace?cat=vehicles" className="hover:text-white transition-colors">
                  Vehicles & Bikes
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-white transition-colors font-medium text-blue-400">
                  + Post a Free Ad
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Logistics (Porter) */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">Portex Delivery</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/deliver" className="hover:text-white transition-colors">
                  Book Mini Truck
                </Link>
              </li>
              <li>
                <Link href="/deliver" className="hover:text-white transition-colors">
                  2-Wheeler Express
                </Link>
              </li>
              <li>
                <Link href="/deliver" className="hover:text-white transition-colors">
                  Tata Ace (Chota Hathi)
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-white transition-colors">
                  Live GPS Tracking
                </Link>
              </li>
              <li>
                <Link href="/driver" className="hover:text-white transition-colors text-emerald-400 font-medium flex items-center gap-1">
                  Driver Partner Hub <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Support */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">Enterprise & Trust</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1 text-purple-400">
                  Admin Portal <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Escrow & Cancellation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} PORTEX Platform. All rights reserved. Developed for {businessProfile.legalName}.
          </p>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span>Built with Next.js, TypeScript & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
