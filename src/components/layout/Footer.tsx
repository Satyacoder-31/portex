'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Lock, Heart, Award, ArrowUpRight } from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';

export default function Footer() {
  const { businessProfile } = usePortex();

  return (
    <footer className="bg-[#060608] text-zinc-400 pt-16 pb-12 border-t border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Prop Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-zinc-800/80">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0e0e12] border border-amber-500/20 hover:border-amber-400/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-zinc-100 text-xs font-bold">100% Verified Sellers</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">Strict KYC & fraud detection</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0e0e12] border border-amber-500/20 hover:border-amber-400/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-zinc-100 text-xs font-bold">Hyperlocal Porter Dispatch</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">2-Wheeler to 14ft heavy trucks</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0e0e12] border border-amber-500/20 hover:border-amber-400/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-zinc-100 text-xs font-bold">Escrow Purchase Safety</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">Funds released upon delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0e0e12] border border-amber-500/20 hover:border-amber-400/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-zinc-100 text-xs font-bold">Digital Proof of Delivery</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">OTP verification & signatures</p>
            </div>
          </div>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          {/* Col 1: Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-black font-black text-lg shadow-md shadow-amber-500/20">
                P
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                PORT<span className="text-amber-400">EX</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              PORTEX is India’s next-generation unified platform bridging secondhand peer-to-peer commerce and on-demand hyperlocal logistics. Buy anything from anywhere in the city, and have a Porter truck or bike bring it straight to your doorstep within hours.
            </p>

            {/* Business Registration Reference Badge */}
            <div className="p-3.5 rounded-2xl bg-[#0d0d10] border border-amber-500/25 text-[11px] space-y-1">
              <div className="text-amber-300 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Operating Entity: {businessProfile.legalName}
              </div>
              <div className="text-zinc-400 font-mono text-[10px]">
                GSTIN: {businessProfile.gstin} &bull; {businessProfile.jurisdiction}
              </div>
              <div className="text-zinc-500 text-[10px] truncate">
                Regd: {businessProfile.principalAddress}
              </div>
            </div>
          </div>

          {/* Col 2: Marketplace */}
          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase tracking-wider text-amber-400">Marketplace</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/marketplace" className="hover:text-amber-300 transition-colors">
                  All Listings
                </Link>
              </li>
              <li>
                <Link href="/marketplace?cat=electronics" className="hover:text-amber-300 transition-colors">
                  Electronics & Mobiles
                </Link>
              </li>
              <li>
                <Link href="/marketplace?cat=furniture" className="hover:text-amber-300 transition-colors">
                  Home & Furniture
                </Link>
              </li>
              <li>
                <Link href="/marketplace?cat=vehicles" className="hover:text-amber-300 transition-colors">
                  Vehicles & Bikes
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-amber-300 transition-colors font-bold text-amber-400">
                  + Post a Free Ad
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Logistics (Porter) */}
          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase tracking-wider text-amber-400">Portex Delivery</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/deliver" className="hover:text-amber-300 transition-colors">
                  Book Mini Truck
                </Link>
              </li>
              <li>
                <Link href="/deliver" className="hover:text-amber-300 transition-colors">
                  2-Wheeler Express
                </Link>
              </li>
              <li>
                <Link href="/deliver" className="hover:text-amber-300 transition-colors">
                  Tata Ace (Chota Hathi)
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-amber-300 transition-colors">
                  Live GPS Tracking
                </Link>
              </li>
              <li>
                <Link href="/driver" className="hover:text-amber-300 transition-colors text-amber-400 font-bold flex items-center gap-1">
                  Driver Partner Hub <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Support */}
          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase tracking-wider text-amber-400">Enterprise & Trust</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/admin" className="hover:text-amber-300 transition-colors flex items-center gap-1 text-amber-400 font-bold">
                  Admin Operations <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-300 transition-colors">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-300 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-amber-300 transition-colors">
                  Escrow & Cancellation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500">
            &copy; {new Date().getFullYear()} PORTEX Platform. All rights reserved. Developed for {businessProfile.legalName}.
          </p>
          <div className="flex items-center gap-4 text-zinc-500 text-xs">
            <span className="text-amber-400/80 font-medium">Obsidian Gold Edition</span>
            <span>&bull;</span>
            <span>Built with Next.js, TypeScript & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
