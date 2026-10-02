'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Check,
  Trash2,
  Truck,
  ShoppingBag,
  User as UserIcon,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import { User, UserRole } from '@/types';
import confetti from 'canvas-confetti';

export function GoogleLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function GoogleAccountChooserModal() {
  const {
    isGoogleChooserOpen,
    closeGoogleChooser,
    googleAccounts,
    currentUser,
    switchGoogleAccount,
    addAndLoginGoogleAccount,
    removeGoogleAccount,
  } = usePortex();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedLoadingId, setSelectedLoadingId] = useState<string | null>(null);

  // New Google account form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('BUYER');
  const [newCity, setNewCity] = useState('Lucknow');

  if (!isGoogleChooserOpen) return null;

  const handleSelectAccount = (account: User) => {
    setSelectedLoadingId(account.id);
    setTimeout(() => {
      switchGoogleAccount(account.id);
      setSelectedLoadingId(null);
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    }, 450);
  };

  const handleCreateNewGoogleAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setSelectedLoadingId('new');
    const formattedEmail = newEmail.includes('@')
      ? newEmail.trim()
      : `${newEmail.trim().toLowerCase()}@gmail.com`;

    const formattedName = newName.trim() || formattedEmail.split('@')[0];

    setTimeout(() => {
      addAndLoginGoogleAccount({
        name: formattedName,
        email: formattedEmail,
        role: newRole,
        city: newCity,
        userIntent:
          newRole === 'ENTERPRISE'
            ? 'PORTER_PARCEL'
            : newRole === 'SELLER'
            ? 'MARKETPLACE'
            : 'ALL_IN_ONE',
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80`,
      });

      setSelectedLoadingId(null);
      setIsAddingNew(false);
      setNewName('');
      setNewEmail('');
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    }, 500);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ENTERPRISE':
        return {
          label: 'Logistics Enterprise',
          color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          icon: Truck,
        };
      case 'SELLER':
        return {
          label: 'Marketplace Seller',
          color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
          icon: ShoppingBag,
        };
      case 'DRIVER':
        return {
          label: 'Driver Partner',
          color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          icon: Truck,
        };
      case 'BUYER':
      default:
        return {
          label: 'Personal & Buyer',
          color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          icon: UserIcon,
        };
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Google-Style Top Progress Bar while Authenticating */}
        {selectedLoadingId && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-100 dark:bg-slate-800 overflow-hidden z-20">
            <div className="h-full bg-gradient-to-r from-blue-500 via-red-500 via-amber-400 to-emerald-500 animate-pulse w-full" />
          </div>
        )}

        {/* Modal Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
              <GoogleLogo className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                {isAddingNew ? 'Add Google Account' : 'Choose an account'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                to continue to <span className="font-bold text-blue-600 dark:text-blue-400">Portex</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeGoogleChooser}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Google sign-in"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[68vh] overflow-y-auto space-y-3">
          
          {!isAddingNew ? (
            <>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Saved Google Profiles on this Device
              </div>

              {/* List of Google Accounts */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
                {googleAccounts.map(account => {
                  const isCurrent = currentUser?.id === account.id || currentUser?.email === account.email;
                  const roleBadge = getRoleBadge(account.role);
                  const BadgeIcon = roleBadge.icon;
                  const isLoading = selectedLoadingId === account.id;

                  return (
                    <div
                      key={account.id}
                      className="group flex items-center justify-between p-3.5 hover:bg-blue-50/60 dark:hover:bg-slate-800/60 transition-all cursor-pointer bg-white dark:bg-slate-900"
                      onClick={() => handleSelectAccount(account)}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="relative flex-shrink-0">
                          <img
                            src={account.avatar}
                            alt={account.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-xs">
                            <GoogleLogo className="w-3 h-3" />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {account.name}
                            </h4>
                            {isCurrent && (
                              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-500 text-white flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" /> Active
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {account.email}
                          </p>
                          <div className="mt-1 flex items-center gap-1">
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${roleBadge.color}`}
                            >
                              <BadgeIcon className="w-2.5 h-2.5" />
                              {roleBadge.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : isCurrent ? (
                          <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              if (googleAccounts.length > 1) {
                                removeGoogleAccount(account.id);
                              }
                            }}
                            title="Remove account from device"
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action 1: Add another Google Account */}
              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="w-full py-3 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-800/40 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Use another Google account</span>
              </button>
            </>
          ) : (
            /* Inline Form to Add & Switch to a New Google Account */
            <form onSubmit={handleCreateNewGoogleAccount} className="space-y-4">
              <div className="p-3 bg-blue-50/80 dark:bg-slate-800/60 rounded-2xl border border-blue-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <GoogleLogo className="w-4 h-4 flex-shrink-0" />
                <span>Enter your Google account details to sign in and save this profile.</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul.sharma@gmail.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Role / Intent
                </label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="BUYER">Personal Deliveries & Marketplace Buyer</option>
                  <option value="ENTERPRISE">Porter Logistics Shipper (Commercial)</option>
                  <option value="SELLER">Marketplace Verified Seller (Store)</option>
                  <option value="DRIVER">Delivery Partner / Fleet Driver</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={newCity}
                  onChange={e => setNewCity(e.target.value)}
                  placeholder="e.g. Lucknow, Delhi NCR, Kanpur"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Back to List
                </button>
                <button
                  type="submit"
                  disabled={selectedLoadingId === 'new'}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
                >
                  {selectedLoadingId === 'new' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In with Google</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 text-center space-y-1">
          <p>
            To continue, Google shares your name, email, and photo with Portex.
          </p>
          <div className="flex items-center justify-center gap-3 text-[10px] text-blue-600 dark:text-blue-400">
            <span className="cursor-pointer hover:underline">Privacy Policy</span>
            <span>&bull;</span>
            <span className="cursor-pointer hover:underline">Terms of Service</span>
          </div>
        </div>

      </div>
    </div>
  );
}
