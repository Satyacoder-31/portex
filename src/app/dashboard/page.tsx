'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Truck,
  Heart,
  MapPin,
  Clock,
  ShieldCheck,
  PlusCircle,
  Trash2,
  Eye,
  ArrowRight,
  ExternalLink,
  Settings,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import ListingCard from '@/components/marketplace/ListingCard';

export default function UserDashboardPage() {
  const { currentUser, listings, deleteListing, favorites, deliveries } = usePortex();
  const [activeTab, setActiveTab] = useState<'listings' | 'deliveries' | 'wishlist' | 'addresses'>('listings');

  const myListings = listings.filter(l => l.sellerId === currentUser.id);
  const favoriteListings = listings.filter(l => favorites.includes(l.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Overview Header */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                {currentUser.name}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified User
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser.email} &bull; {currentUser.phone} &bull; {currentUser.city}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/sell"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Post Ad</span>
          </Link>

          <Link
            href="/deliver"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <Truck className="w-4 h-4" />
            <span>Deliver Something</span>
          </Link>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-bold">
        {[
          { id: 'listings', label: `My Listings (${myListings.length})` },
          { id: 'deliveries', label: `Deliveries & Trips (${deliveries.length})` },
          { id: 'wishlist', label: `Saved Wishlist (${favoriteListings.length})` },
          { id: 'addresses', label: 'Saved Addresses (2)' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 transition-colors relative ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: My Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {myListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {myListings.map(item => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative aspect-video">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589384267710-7a170981ca78?auto=format&fit=crop&w=400&q=80';
                      }}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.status}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h4>
                    <div className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> {item.views} views
                      </span>
                      <button
                        onClick={() => deleteListing(item.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded-lg"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                You haven&apos;t posted any items yet
              </h3>
              <p className="text-xs text-slate-500">Sell pre-owned electronics, furniture, or bikes with zero fees.</p>
              <Link
                href="/sell"
                className="inline-flex px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                + Post Your First Item
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Deliveries */}
      {activeTab === 'deliveries' && (
        <div className="space-y-4">
          {deliveries.map(d => (
            <div
              key={d.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {d.packageType}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    {d.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  {d.trackingNumber} &bull; {d.vehicleName} &bull; ₹{d.pricing.totalAmount}
                </p>
                <div className="text-xs text-slate-500 mt-1">
                  Pickup: {d.pickup.address} &rarr; Drop: {d.drop.address}
                </div>
              </div>

              <Link
                href={`/tracking/${d.id}`}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 self-start sm:self-auto transition-colors"
              >
                <span>Live Map &amp; OTP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Saved Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoriteListings.map(item => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      )}

      {/* Tab 4: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-2xl border border-blue-500/40 bg-blue-50/20 dark:bg-blue-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">Home / Primary</span>
              <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">Default</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              E-3/776, Sector-I Aliganj, Lucknow, UP 226024
            </p>
            <p className="text-slate-400">Phone: +91 98765 43210</p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">Gomti Nagar Office</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              TCG 4/4 Vibhuti Khand, Gomti Nagar, Lucknow, UP 226010
            </p>
            <p className="text-slate-400">Phone: +91 98765 43210</p>
          </div>
        </div>
      )}
    </div>
  );
}
