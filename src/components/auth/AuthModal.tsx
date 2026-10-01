'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Truck,
  ShoppingBag,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Building2,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  User as UserIcon,
  ArrowRight,
  Sparkles,
  Info,
  Check,
  ChevronRight,
  Package,
  Layers,
  Banknote,
  Briefcase,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import { User, UserIntent, DeliveryVehicleType, UserRole } from '@/types';
import { DEMO_USERS } from '@/lib/data/mockData';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultTab?: 'login' | 'register';
  defaultIntent?: UserIntent;
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultTab,
  defaultIntent,
}: AuthModalProps) {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    authInitialIntent,
    loginUser,
    currentUser,
  } = usePortex();

  const showModal = isOpen !== undefined ? isOpen : isAuthModalOpen;
  const handleClose = onClose || closeAuthModal;

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    defaultTab || authModalTab || 'login'
  );
  const [selectedIntent, setSelectedIntent] = useState<UserIntent>(
    defaultIntent || authInitialIntent || 'ALL_IN_ONE'
  );

  // Sync when prop or store changes
  useEffect(() => {
    if (authModalTab) setActiveTab(authModalTab);
  }, [authModalTab]);

  useEffect(() => {
    if (authInitialIntent) setSelectedIntent(authInitialIntent);
  }, [authInitialIntent]);

  // Login Form State
  const [loginPhoneOrEmail, setLoginPhoneOrEmail] = useState('+91 98765 43210');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register Form State - Common
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Lucknow');

  // Register Form State - Porter Parcel Details
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

  // Register Form State - Marketplace Details
  const [sellerDisplayName, setSellerDisplayName] = useState('');
  const [sellerPickupAddress, setSellerPickupAddress] = useState('');
  const [sellerPickupPincode, setSellerPickupPincode] = useState('226010');
  const [payoutUpiId, setPayoutUpiId] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [buyerDeliveryAddress, setBuyerDeliveryAddress] = useState('');
  const [deliveryPincode, setDeliveryPincode] = useState('226010');
  const [preferredPayment, setPreferredPayment] = useState<'UPI' | 'COD' | 'CARD' | 'NETBANKING'>('UPI');
  const [kycVerified, setKycVerified] = useState(true);

  if (!showModal) return null;

  // Handle Quick Demo Login
  const handleQuickLogin = (demoKey: 'PORTER_PARCEL' | 'MARKETPLACE_SELLER' | 'ALL_IN_ONE') => {
    const demoUser = DEMO_USERS[demoKey];
    if (demoUser) {
      loginUser(demoUser);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      handleClose();
    }
  };

  // Handle Custom Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    setTimeout(() => {
      setLoginLoading(false);
      // Construct or match user
      const matchedUser: User = {
        ...currentUser,
        phone: loginPhoneOrEmail.startsWith('+91') ? loginPhoneOrEmail : `+91 ${loginPhoneOrEmail}`,
        email: loginPhoneOrEmail.includes('@') ? loginPhoneOrEmail : currentUser.email,
        name: currentUser.name || 'Verified Portex Member',
      };
      loginUser(matchedUser);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      handleClose();
    }, 600);
  };

  // Handle Custom Registration Submit
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
        bankAccountNumber: bankAccount || undefined,
        bankIfsc: bankIfsc || undefined,
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
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 my-8 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-5 sm:p-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-white text-blue-700 font-black flex items-center justify-center text-base shadow-md">
              P
            </div>
            <span className="font-extrabold tracking-wider text-sm text-blue-200 uppercase">
              PORTEX ACCESS PORTAL
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black">
            {activeTab === 'login' ? 'Sign In to Your Account' : 'Create Your PORTEX Account'}
          </h2>
          <p className="text-xs text-blue-100/90 mt-1 max-w-lg">
            Book on-demand mini trucks &amp; couriers like <strong>Porter</strong>, and buy or sell goods with instant UPI payouts like <strong>OLX</strong>.
          </p>

          {/* Tab Switcher */}
          <div className="mt-4 flex p-1 bg-blue-950/50 rounded-2xl max-w-xs border border-white/10">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-blue-900 shadow-md'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-blue-900 shadow-md'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Register / New User
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">

          {/* Quick 1-Click Demo Profiles (Very handy for immediate verification) */}
          <div className="p-3.5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-slate-800/80 dark:to-slate-800/50 rounded-2xl border border-blue-200/60 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Instant 1-Click Test Personas
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Ready to test</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Persona 1: Porter Parcel Shipper */}
              <button
                type="button"
                onClick={() => handleQuickLogin('PORTER_PARCEL')}
                className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-500/30 hover:border-emerald-500 text-left transition-all hover:scale-[1.02] shadow-sm group cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    Porter Shipper
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1">Amit (Tata Ace, GSTIN)</p>
                <div className="mt-1 text-[9px] font-bold text-emerald-600 flex items-center gap-1">
                  <span>Log in as Shipper</span> &rarr;
                </div>
              </button>

              {/* Persona 2: Marketplace Seller */}
              <button
                type="button"
                onClick={() => handleQuickLogin('MARKETPLACE_SELLER')}
                className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-blue-500/30 hover:border-blue-500 text-left transition-all hover:scale-[1.02] shadow-sm group cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    Marketplace Seller
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1">Priya (UPI Payout, Deals)</p>
                <div className="mt-1 text-[9px] font-bold text-blue-600 flex items-center gap-1">
                  <span>Log in as Seller</span> &rarr;
                </div>
              </button>

              {/* Persona 3: All-in-One Super User */}
              <button
                type="button"
                onClick={() => handleQuickLogin('ALL_IN_ONE')}
                className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-indigo-500/30 hover:border-indigo-500 text-left transition-all hover:scale-[1.02] shadow-sm group cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    All-in-One User
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1">Krishna (Delivery + Trading)</p>
                <div className="mt-1 text-[9px] font-bold text-indigo-600 flex items-center gap-1">
                  <span>Log in as All-in-One</span> &rarr;
                </div>
              </button>
            </div>
          </div>

          {/* TAB 1: LOGIN FLOW */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={loginPhoneOrEmail}
                    onChange={e => setLoginPhoneOrEmail(e.target.value)}
                    placeholder="+91 98765 43210 or yourname@example.com"
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
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Works for Porter parcel shippers, marketplace sellers, and verified buyers.
                </p>
              </div>

              {otpSent && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-500/30 animate-in fade-in duration-200 space-y-2">
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
                    placeholder="Enter 4-digit code (e.g. 4829)"
                    className="w-full px-3 py-2 text-center text-sm font-mono tracking-widest font-bold rounded-xl bg-white dark:bg-slate-900 border border-emerald-400 dark:border-emerald-600 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {loginLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to PORTEX</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Don&apos;t have an account yet? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Create an account with Porter / Seller details &rarr;
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTRATION / ONBOARDING FLOW */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">

              {/* Step A: Choose Your Primary Role / Intent */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Select What You Want To Do On PORTEX:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: Porter Parcel */}
                  <div
                    onClick={() => setSelectedIntent('PORTER_PARCEL')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedIntent === 'PORTER_PARCEL'
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <Truck className="w-4 h-4" />
                      </div>
                      {selectedIntent === 'PORTER_PARCEL' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Porter Parceling
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Send parcels, courier, house shifting &amp; mini trucks.
                    </p>
                  </div>

                  {/* Option 2: Marketplace Buy & Sell */}
                  <div
                    onClick={() => setSelectedIntent('MARKETPLACE')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedIntent === 'MARKETPLACE'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      {selectedIntent === 'MARKETPLACE' && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Buy &amp; Sell Items
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Sell pre-owned goods with UPI payout &amp; buy items.
                    </p>
                  </div>

                  {/* Option 3: All-in-One */}
                  <div
                    onClick={() => setSelectedIntent('ALL_IN_ONE')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedIntent === 'ALL_IN_ONE'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                        <Zap className="w-4 h-4" />
                      </div>
                      {selectedIntent === 'ALL_IN_ONE' && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      All-in-One (Both)
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Full access to Porter delivery fleet &amp; Marketplace.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 1: Basic Identity & Contact Details */}
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700/60 pb-2">
                  <UserIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Step 1: Basic Account &amp; Contact Info
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
                      placeholder="e.g. Ramesh Chandra"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
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
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ramesh@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      City / Operational Hub *
                    </label>
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Lucknow">Lucknow (Central Hub)</option>
                      <option value="Delhi NCR">Delhi NCR (Noida / Gurugram)</option>
                      <option value="Kanpur">Kanpur</option>
                      <option value="Varanasi">Varanasi</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Mumbai">Mumbai</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: PORTER SPECIFIC DETAILS (Shown if Porter or All-In-One selected) */}
              {(selectedIntent === 'PORTER_PARCEL' || selectedIntent === 'ALL_IN_ONE') && (
                <div className="space-y-3 p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/30">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                        Step 2: Porter Logistics &amp; Parcel Dispatch Details
                      </span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                      Necessary for Shippers
                    </span>
                  </div>

                  {/* Shipper Category: Individual vs Business */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPorterUserType('INDIVIDUAL')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition-all ${
                        porterUserType === 'INDIVIDUAL'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Personal / House Parcel
                    </button>
                    <button
                      type="button"
                      onClick={() => setPorterUserType('BUSINESS')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition-all ${
                        porterUserType === 'BUSINESS'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Business / GST Enterprise
                    </button>
                  </div>

                  {/* Business fields if business selected */}
                  {porterUserType === 'BUSINESS' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 animate-in fade-in">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Company / Shop Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Sharma Traders &amp; Supplies"
                          value={businessName}
                          onChange={e => setBusinessName(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                          <span>GSTIN Number</span>
                          <span className="text-[10px] text-emerald-600 font-semibold">18% ITC Claim</span>
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

                  {/* Default Pickup Address */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Default Pickup Address (Where Porter Drivers Collect From) *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="Building/Shop No, Street, Landmark, Sector"
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
                        Floor Details
                      </label>
                      <input
                        type="text"
                        value={pickupFloor}
                        onChange={e => setPickupFloor(e.target.value)}
                        placeholder="Ground / 2nd Floor"
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
                          Lift / Elevator Available
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Frequent Cargo & Vehicle Preference */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Frequent Goods / Parcel Type
                      </label>
                      <select
                        value={frequentCargoType}
                        onChange={e => setFrequentCargoType(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="Carton Boxes & Electronics">Carton Boxes &amp; Electronics</option>
                        <option value="Furniture & House Shifting">Furniture &amp; House Shifting</option>
                        <option value="Commercial B2B Goods">Commercial B2B Inventory / Cargo</option>
                        <option value="Documents & Express Pouches">Documents &amp; Instant Small Parcels</option>
                        <option value="Hardware & Construction Supplies">Hardware &amp; Equipment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Preferred Transport Vehicle
                      </label>
                      <select
                        value={preferredVehicle}
                        onChange={e => setPreferredVehicle(e.target.value as DeliveryVehicleType)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="TWO_WHEELER">2-Wheeler (Fast Bike Parcel)</option>
                        <option value="THREE_WHEELER_AUTO">3-Wheeler Auto (Up to 500kg)</option>
                        <option value="TATA_ACE_MINI_TRUCK">Tata Ace Mini Truck (Chota Hathi - 750kg)</option>
                        <option value="PICKUP_8FT">8ft Pickup Truck (1200kg)</option>
                        <option value="TEMPO_CLOSED">Tempo Closed Container</option>
                      </select>
                    </div>
                  </div>

                  {/* Helpers & Alternate Phone */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={needHelper}
                        onChange={e => setNeedHelper(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Default to Driver + Helper for Loading/Unloading
                      </span>
                    </label>

                    <input
                      type="text"
                      placeholder="Alternate phone (optional)"
                      value={alternatePhone}
                      onChange={e => setAlternatePhone(e.target.value)}
                      className="w-full sm:w-48 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Section 3: MARKETPLACE BUY & SELL DETAILS (Shown if Marketplace or All-in-One selected) */}
              {(selectedIntent === 'MARKETPLACE' || selectedIntent === 'ALL_IN_ONE') && (
                <div className="space-y-3 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-500/30">
                  <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                        Step 3: Marketplace Seller Payout &amp; Buyer Delivery Setup
                      </span>
                    </div>
                    <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full">
                      Zero Brokerage
                    </span>
                  </div>

                  {/* Seller Payout Details (Crucial for receiving money!) */}
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                        <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                        Seller Payout Details (Where Money Is Credited When You Sell)
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">Instant Transfer</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Payout UPI ID (Instant Payout) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. mobile@paytm or name@okaxis"
                          value={payoutUpiId}
                          onChange={e => setPayoutUpiId(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Seller / Store Display Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Verma Verified Tech &amp; Home"
                          value={sellerDisplayName}
                          onChange={e => setSellerDisplayName(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Seller Item Pickup Address & Buyer Delivery Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Seller Pickup Address (For Buyers/Porter)
                      </label>
                      <input
                        type="text"
                        placeholder="Where your sold items will be collected"
                        value={sellerPickupAddress}
                        onChange={e => setSellerPickupAddress(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Buyer Default Delivery Address
                      </label>
                      <input
                        type="text"
                        placeholder="Where items you buy should be delivered"
                        value={buyerDeliveryAddress}
                        onChange={e => setBuyerDeliveryAddress(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Buyer Payment Preference & Verification Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Buyer Payment Preference
                      </label>
                      <select
                        value={preferredPayment}
                        onChange={e => setPreferredPayment(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                        <option value="COD">Cash on Delivery (Doorstep inspection)</option>
                        <option value="CARD">Credit / Debit Card</option>
                        <option value="NETBANKING">Net Banking</option>
                      </select>
                    </div>

                    <div className="flex flex-col justify-end">
                      <label className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={kycVerified}
                          onChange={e => setKycVerified(e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                        />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          Apply for Verified Seller &amp; Shipper Badge
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <Check className="w-4 h-4" />
                <span>Complete Registration &amp; Access PORTEX</span>
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-slate-500">Already registered? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Sign in to existing account &rarr;
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/70 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            100% Verified Senders &amp; Sellers &bull; End-to-End Escrow Protection
          </span>
          <span className="hidden sm:inline font-mono text-[10px]">PORTEX v2.4</span>
        </div>

      </div>
    </div>
  );
}
