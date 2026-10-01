'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Truck,
  ShoppingBag,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Building2,
  MapPin,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  User as UserIcon,
  Check,
  Banknote,
  Clock,
  Navigation,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import { User, UserIntent, DeliveryVehicleType, UserRole } from '@/types';
import { DEMO_USERS } from '@/lib/data/mockData';
import confetti from 'canvas-confetti';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser, currentUser } = usePortex();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedIntent, setSelectedIntent] = useState<UserIntent>('ALL_IN_ONE');

  // Sign In state
  const [loginPhoneOrEmail, setLoginPhoneOrEmail] = useState('+91 98765 43210');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // Register Form State - Common
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Lucknow');

  // Porter Logistics Details
  const [porterUserType, setPorterUserType] = useState<'INDIVIDUAL' | 'BUSINESS'>('INDIVIDUAL');
  const [businessName, setBusinessName] = useState('');
  const [gstin, setGstin] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupPincode, setPickupPincode] = useState('226010');
  const [pickupFloor, setPickupFloor] = useState('Ground Floor');
  const [hasLift, setHasLift] = useState(true);
  const [frequentCargoType, setFrequentCargoType] = useState('Carton Boxes & Electronics');
  const [preferredVehicle, setPreferredVehicle] = useState<DeliveryVehicleType>('TATA_ACE_MINI_TRUCK');
  const [needHelper, setNeedHelper] = useState(true);
  const [alternatePhone, setAlternatePhone] = useState('');

  // Marketplace Buy & Sell Details
  const [sellerDisplayName, setSellerDisplayName] = useState('');
  const [sellerPickupAddress, setSellerPickupAddress] = useState('');
  const [sellerPickupPincode, setSellerPickupPincode] = useState('226010');
  const [payoutUpiId, setPayoutUpiId] = useState('');
  const [buyerDeliveryAddress, setBuyerDeliveryAddress] = useState('');
  const [deliveryPincode, setDeliveryPincode] = useState('226010');
  const [preferredPayment, setPreferredPayment] = useState<'UPI' | 'COD' | 'CARD' | 'NETBANKING'>('UPI');
  const [kycVerified, setKycVerified] = useState(true);

  // Quick Persona Login
  const handleQuickLogin = (demoKey: 'PORTER_PARCEL' | 'MARKETPLACE_SELLER' | 'ALL_IN_ONE') => {
    const demoUser = DEMO_USERS[demoKey];
    if (demoUser) {
      loginUser(demoUser);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      router.push(demoKey === 'PORTER_PARCEL' ? '/deliver' : '/marketplace');
    }
  };

  // Sign In Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const matchedUser: User = {
        ...currentUser,
        phone: loginPhoneOrEmail.startsWith('+91') ? loginPhoneOrEmail : `+91 ${loginPhoneOrEmail}`,
        email: loginPhoneOrEmail.includes('@') ? loginPhoneOrEmail : currentUser.email,
        name: currentUser.name || 'Verified Portex User',
      };
      loginUser(matchedUser);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      router.push('/dashboard');
    }, 500);
  };

  // Registration Handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let computedRole: UserRole = 'BUYER';
    if (selectedIntent === 'PORTER_PARCEL') {
      computedRole = porterUserType === 'BUSINESS' ? 'ENTERPRISE' : 'BUYER';
    } else if (selectedIntent === 'MARKETPLACE') {
      computedRole = 'SELLER';
    } else {
      computedRole = 'SELLER';
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: fullName.trim() || 'Portex Member',
      phone: phone.trim() || '+91 98765 00000',
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '')}@portex.in`,
      role: computedRole,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80`,
      city: city || 'Lucknow',
      isVerified: true,
      rating: 5.0,
      totalDeals: 1,
      userIntent: selectedIntent,
      porterProfile: {
        userType: porterUserType,
        businessName: businessName || undefined,
        gstin: gstin || undefined,
        defaultPickupAddress: pickupAddress || `${city}, Uttar Pradesh`,
        pickupPincode,
        pickupFloor,
        hasLift,
        frequentCargoType,
        preferredVehicle,
        needHelper,
        alternatePhone: alternatePhone || undefined,
      },
      marketplaceProfile: {
        canSell: selectedIntent !== 'PORTER_PARCEL',
        canBuy: true,
        sellerType: porterUserType === 'BUSINESS' ? 'VERIFIED_STORE' : 'INDIVIDUAL',
        shopOrDisplayName: sellerDisplayName || `${fullName}'s Store`,
        payoutUpiId: payoutUpiId || `${fullName.toLowerCase().replace(/\s+/g, '')}@upi`,
        sellerPickupAddress: sellerPickupAddress || pickupAddress || `${city}, UP`,
        sellerPickupPincode: sellerPickupPincode || pickupPincode,
        buyerDeliveryAddress: buyerDeliveryAddress || pickupAddress || `${city}, UP`,
        deliveryPincode,
        preferredPayment,
        kycVerified,
      },
    };

    loginUser(newUser);
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Brand Feature Highlights */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Unified Marketplace &amp; Porter Logistics
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              One Login for <span className="text-blue-600">Porter Logistics</span> &amp; <span className="text-emerald-600">Marketplace</span>
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Whether you want to dispatch courier parcels, hire mini trucks for shifting, sell your pre-owned items, or buy verified products with doorstep delivery — PORTEX is built for you.
            </p>
          </div>

          {/* Feature Card 1: Porter Logistics Capabilities */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">
                For Porter Users (Parcel &amp; Logistics)
              </h3>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pl-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Save default pickup locations, floor &amp; elevator status</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Choose preferred fleet: 2-Wheeler, Tata Ace, or 8ft Pickup</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Enter GSTIN for 18% Input Tax Credit &amp; B2B invoices</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Driver + Helper assistance at doorstep</span>
              </li>
            </ul>
          </div>

          {/* Feature Card 2: Marketplace Capabilities */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">
                For Sellers &amp; Buyers (OLX Experience)
              </h3>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pl-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span>Link UPI ID for instant seller payouts upon delivery</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span>Post ads in 30 seconds with automatic Porter delivery tags</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span>Buyer delivery addresses with OTP-secured handover</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span>100% Escrow and zero marketplace brokerage</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-slate-800/80 rounded-xl border border-blue-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Govt Registered &bull; Lucknow Central Hub
            </span>
            <span className="font-mono text-[10px]">GSTIN: 09ABRFM9138P1Z3</span>
          </div>
        </div>

        {/* Right Column: Interactive Login & Register Card */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/90 dark:border-slate-800 overflow-hidden">
          
          {/* Top Banner with Tab Toggle */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-200 block">
                PORTEX AUTHENTICATION
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-0.5">
                {activeTab === 'login' ? 'Welcome Back!' : 'Onboard Your Account'}
              </h2>
            </div>

            <div className="flex p-1 bg-blue-950/60 rounded-2xl border border-white/10 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'login'
                    ? 'bg-white text-blue-900 shadow-md'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'register'
                    ? 'bg-white text-blue-900 shadow-md'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-6">

            {/* Quick 1-Click Demo Profiles */}
            <div className="p-3.5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-slate-800/80 dark:to-slate-800/50 rounded-2xl border border-blue-200/60 dark:border-slate-700/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Instant 1-Click Test Accounts
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">Instant Access</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('PORTER_PARCEL')}
                  className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-500/30 hover:border-emerald-500 text-left transition-all hover:scale-[1.02] shadow-sm group cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-emerald-600">
                      Porter Shipper
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1">Amit (Tata Ace, GSTIN)</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('MARKETPLACE_SELLER')}
                  className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-blue-500/30 hover:border-blue-500 text-left transition-all hover:scale-[1.02] shadow-sm group cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-blue-600">
                      Marketplace Seller
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1">Priya (UPI Payout, Deals)</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('ALL_IN_ONE')}
                  className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-indigo-500/30 hover:border-indigo-500 text-left transition-all hover:scale-[1.02] shadow-sm group cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-indigo-600">
                      All-in-One Super
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1">Krishna (Delivery + Trade)</p>
                </button>
              </div>
            </div>

            {/* TAB 1: LOGIN */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Registered Mobile Number or Email
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={loginPhoneOrEmail}
                      onChange={e => setLoginPhoneOrEmail(e.target.value)}
                      placeholder="+91 98765 43210 or email"
                      className="w-full pl-9 pr-24 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setOtpSent(true)}
                      className="absolute right-1.5 top-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg shadow-sm"
                    >
                      {otpSent ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  </div>
                </div>

                {otpSent && (
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-500/30 animate-in fade-in space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        OTP Sent to {loginPhoneOrEmail}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEnteredOtp('4829')}
                        className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 underline cursor-pointer"
                      >
                        Auto-fill: 4829
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={4}
                      value={enteredOtp}
                      onChange={e => setEnteredOtp(e.target.value)}
                      placeholder="4-digit code (e.g. 4829)"
                      className="w-full px-3 py-2 text-center text-sm font-mono tracking-widest font-bold rounded-xl bg-white dark:bg-slate-900 border border-emerald-400 text-slate-900 dark:text-white"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {loading ? (
                    <span>Verifying session...</span>
                  ) : (
                    <>
                      <span>Sign In &amp; Access Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: REGISTER */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-6">

                {/* Intent Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                    I Want to Use PORTEX Primarily For:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div
                      onClick={() => setSelectedIntent('PORTER_PARCEL')}
                      className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedIntent === 'PORTER_PARCEL'
                          ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        {selectedIntent === 'PORTER_PARCEL' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Porter Parcels
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Deliveries, shifting &amp; courier.
                      </p>
                    </div>

                    <div
                      onClick={() => setSelectedIntent('MARKETPLACE')}
                      className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedIntent === 'MARKETPLACE'
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <ShoppingBag className="w-4 h-4 text-blue-600" />
                        {selectedIntent === 'MARKETPLACE' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Buy &amp; Sell
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Marketplace with UPI payouts.
                      </p>
                    </div>

                    <div
                      onClick={() => setSelectedIntent('ALL_IN_ONE')}
                      className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedIntent === 'ALL_IN_ONE'
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Zap className="w-4 h-4 text-indigo-600" />
                        {selectedIntent === 'ALL_IN_ONE' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        All-in-One
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Full access to both systems.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Common Basic Details */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                    <UserIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      1. General Contact &amp; Identity
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Satya Sharma"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Mobile Number (+91) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="satya@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        City *
                      </label>
                      <select
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="Lucknow">Lucknow (Central Hub)</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Kanpur">Kanpur</option>
                        <option value="Bengaluru">Bengaluru</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Porter Logistics Fields */}
                {(selectedIntent === 'PORTER_PARCEL' || selectedIntent === 'ALL_IN_ONE') && (
                  <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                          2. Porter Logistics Dispatch Configuration
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                        Pickup Fleet Ready
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPorterUserType('INDIVIDUAL')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          porterUserType === 'INDIVIDUAL'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        Personal Shipper
                      </button>
                      <button
                        type="button"
                        onClick={() => setPorterUserType('BUSINESS')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          porterUserType === 'BUSINESS'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        Business / GST Registered
                      </button>
                    </div>

                    {porterUserType === 'BUSINESS' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Business / Firm Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Satya Logistics &amp; Distribution"
                            value={businessName}
                            onChange={e => setBusinessName(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            GSTIN (For 18% Input Tax Credit)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 09AAECS1429B1Z2"
                            value={gstin}
                            onChange={e => setGstin(e.target.value)}
                            className="w-full px-3 py-2 text-xs font-mono uppercase rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Default Pickup Address (Where Porter Vehicles Pick Up) *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          placeholder="Shop/Office No, Street, Landmark, Sector"
                          value={pickupAddress}
                          onChange={e => setPickupAddress(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          value={pickupPincode}
                          onChange={e => setPickupPincode(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Floor
                        </label>
                        <input
                          type="text"
                          value={pickupFloor}
                          onChange={e => setPickupFloor(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="flex flex-col justify-end">
                        <label className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={hasLift}
                            onChange={e => setHasLift(e.target.checked)}
                            className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                          />
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            Lift Available
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Preferred Vehicle
                        </label>
                        <select
                          value={preferredVehicle}
                          onChange={e => setPreferredVehicle(e.target.value as any)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                        >
                          <option value="TWO_WHEELER">2-Wheeler (Express Bike)</option>
                          <option value="THREE_WHEELER_AUTO">3-Wheeler Auto (500kg)</option>
                          <option value="TATA_ACE_MINI_TRUCK">Tata Ace Mini Truck (750kg)</option>
                          <option value="PICKUP_8FT">8ft Pickup Truck (1200kg)</option>
                        </select>
                      </div>

                      <div className="flex flex-col justify-end">
                        <label className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={needHelper}
                            onChange={e => setNeedHelper(e.target.checked)}
                            className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                          />
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            Include Loading/Unloading Helper
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Marketplace Buy & Sell Fields */}
                {(selectedIntent === 'MARKETPLACE' || selectedIntent === 'ALL_IN_ONE') && (
                  <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-500/30 space-y-3">
                    <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                          3. Marketplace Payout UPI &amp; Delivery Addresses
                        </span>
                      </div>
                      <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full">
                        Instant Credited
                      </span>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-900 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                          <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                          Seller Payout Details (Required for Receiving Payments)
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold">Direct to Bank/UPI</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Payout UPI ID (Instant Payout) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. satya@okaxis or 9876543210@paytm"
                            value={payoutUpiId}
                            onChange={e => setPayoutUpiId(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Seller Store / Brand Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Satya Tech &amp; Vintage Furnishings"
                            value={sellerDisplayName}
                            onChange={e => setSellerDisplayName(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Seller Item Pickup Address
                        </label>
                        <input
                          type="text"
                          placeholder="Where buyers/Porter collect your items"
                          value={sellerPickupAddress}
                          onChange={e => setSellerPickupAddress(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Buyer Home Delivery Address
                        </label>
                        <input
                          type="text"
                          placeholder="Where your purchased goods are delivered"
                          value={buyerDeliveryAddress}
                          onChange={e => setBuyerDeliveryAddress(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                      <div className="w-full sm:w-1/2">
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Buyer Payment Preference
                        </label>
                        <select
                          value={preferredPayment}
                          onChange={e => setPreferredPayment(e.target.value as any)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                        >
                          <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                          <option value="COD">Cash on Delivery</option>
                          <option value="CARD">Credit / Debit Card</option>
                        </select>
                      </div>

                      <label className="w-full sm:w-1/2 flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer self-end">
                        <input
                          type="checkbox"
                          checked={kycVerified}
                          onChange={e => setKycVerified(e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                        />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          Apply for Verified Seller Badge
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <Check className="w-4 h-4" />
                  <span>Register &amp; Launch PORTEX Workspace</span>
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
