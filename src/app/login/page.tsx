'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Lock,
  Eye,
  EyeOff,
  Check,
  Banknote,
  Clock,
  ArrowLeft,
  AlertCircle,
  X,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';
import { User, UserIntent, DeliveryVehicleType, UserRole } from '@/types';
import { GoogleLogo } from '@/components/auth/GoogleAccountChooserModal';
import confetti from 'canvas-confetti';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const initialRole = searchParams.get('role') as UserRole | null;

  const { loginUser, showToast } = usePortex();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

  // Sign In State
  const [loginIdentifier, setLoginIdentifier] = useState('krishna.verma@example.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginPhone, setLoginPhone] = useState('+91 98765 43210');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Register Form State
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole || 'BUYER');
  const [fullName, setFullName] = useState('');
  const [regPhone, setRegPhone] = useState('+91 ');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [city, setCity] = useState('Lucknow');
  const [businessName, setBusinessName] = useState('');
  const [gstin, setGstin] = useState('');
  const [sellerStoreName, setSellerStoreName] = useState('');
  const [sellerUpi, setSellerUpi] = useState('');
  const [driverVehicle, setDriverVehicle] = useState<DeliveryVehicleType>('TATA_ACE_MINI_TRUCK');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Sync tab if URL changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'register') setActiveTab('register');
    else if (tabParam === 'login') setActiveTab('login');
  }, [searchParams]);

  // Google 1-Click Login
  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const googleUser: User = {
        id: `usr_google_${Date.now()}`,
        name: 'Google User',
        email: 'user.google@portex.in',
        phone: '+91 98765 43210',
        role: activeTab === 'register' ? selectedRole : 'BUYER',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        city: 'Lucknow',
        isVerified: true,
        rating: 5.0,
        totalDeals: 12,
        userIntent: 'ALL_IN_ONE',
        porterProfile: {
          userType: 'INDIVIDUAL',
          defaultPickupAddress: 'Gomti Nagar Extension, Sector 4, Lucknow, UP',
          pickupPincode: '226010',
          preferredVehicle: 'TATA_ACE_MINI_TRUCK',
          needHelper: true,
        },
        marketplaceProfile: {
          canSell: true,
          canBuy: true,
          sellerType: 'INDIVIDUAL',
          shopOrDisplayName: 'Google Verified Store',
          payoutUpiId: 'google.user@upi',
          sellerPickupAddress: 'Gomti Nagar, Lucknow, UP',
          sellerPickupPincode: '226010',
          buyerDeliveryAddress: 'Gomti Nagar, Lucknow, UP',
          deliveryPincode: '226010',
          preferredPayment: 'UPI',
          kycVerified: true,
        },
      };

      loginUser(googleUser);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      router.push('/dashboard');
    }, 600);
  };

  // Sign In Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const isEmail = loginIdentifier.includes('@');
      const cleanName = isEmail
        ? loginIdentifier.split('@')[0].replace(/[._]/g, ' ')
        : 'Portex Member';

      const user: User = {
        id: `usr_${Date.now()}`,
        name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
        email: isEmail ? loginIdentifier : `${loginIdentifier.replace(/[^0-9]/g, '')}@portex.in`,
        phone: isEmail ? '+91 98765 43210' : loginIdentifier,
        role: 'BUYER',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        city: 'Lucknow',
        isVerified: true,
        rating: 4.9,
        totalDeals: 18,
        userIntent: 'ALL_IN_ONE',
        porterProfile: {
          userType: 'INDIVIDUAL',
          defaultPickupAddress: 'Gomti Nagar Extension, Sector 4, Lucknow',
          pickupPincode: '226010',
          preferredVehicle: 'TATA_ACE_MINI_TRUCK',
          needHelper: true,
        },
        marketplaceProfile: {
          canSell: true,
          canBuy: true,
          sellerType: 'INDIVIDUAL',
          shopOrDisplayName: `${cleanName}'s Store`,
          payoutUpiId: `${cleanName.toLowerCase().replace(/\s+/g, '')}@upi`,
          sellerPickupAddress: 'Gomti Nagar, Lucknow',
          sellerPickupPincode: '226010',
          buyerDeliveryAddress: 'Gomti Nagar, Lucknow',
          deliveryPincode: '226010',
          preferredPayment: 'UPI',
          kycVerified: true,
        },
      };

      loginUser(user);
      confetti({ particleCount: 65, spread: 75, origin: { y: 0.6 } });
      router.push('/dashboard');
    }, 600);
  };

  // Register Handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      showToast('Please agree to the Terms of Service to continue.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      let intent: UserIntent = 'ALL_IN_ONE';
      if (selectedRole === 'ENTERPRISE') intent = 'PORTER_PARCEL';
      else if (selectedRole === 'SELLER') intent = 'MARKETPLACE';

      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: fullName.trim() || 'Portex User',
        phone: regPhone.trim() || '+91 98765 00000',
        email: regEmail.trim() || `${fullName.toLowerCase().replace(/\s+/g, '')}@portex.in`,
        role: selectedRole,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        city,
        isVerified: true,
        rating: 5.0,
        totalDeals: 1,
        userIntent: intent,
        porterProfile: {
          userType: selectedRole === 'ENTERPRISE' ? 'BUSINESS' : 'INDIVIDUAL',
          businessName: businessName || undefined,
          gstin: gstin || undefined,
          defaultPickupAddress: `${city}, Uttar Pradesh`,
          pickupPincode: '226010',
          preferredVehicle: driverVehicle,
          needHelper: true,
        },
        marketplaceProfile: {
          canSell: selectedRole !== 'ENTERPRISE',
          canBuy: true,
          sellerType: selectedRole === 'ENTERPRISE' ? 'VERIFIED_STORE' : 'INDIVIDUAL',
          shopOrDisplayName: sellerStoreName || `${fullName}'s Store`,
          payoutUpiId: sellerUpi || `${fullName.toLowerCase().replace(/\s+/g, '')}@upi`,
          sellerPickupAddress: `${city}, Uttar Pradesh`,
          sellerPickupPincode: '226010',
          buyerDeliveryAddress: `${city}, Uttar Pradesh`,
          deliveryPincode: '226010',
          preferredPayment: 'UPI',
          kycVerified: true,
        },
      };

      loginUser(newUser);
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      router.push('/dashboard');
    }, 700);
  };

  // Forgot password submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      showToast(`Password reset link sent to ${forgotEmail}`);
    }, 400);
  };

  // Password strength checker helper
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    if (pass.length < 6) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (pass.length < 10) return { score: 2, label: 'Good', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };
  const passwordStrength = getPasswordStrength(regPassword);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      {/* Top Back Link */}
      <div className="w-full max-w-5xl mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace & Logistics</span>
        </Link>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Brand Value & Trust Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-700 via-indigo-800 to-blue-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative space-y-6">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white text-blue-700 flex items-center justify-center font-black text-xl shadow-lg">
                P
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                PORT<span className="text-blue-300">EX</span>
              </span>
            </Link>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 font-bold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                Hyperlocal Logistics + P2P Marketplace
              </span>
              <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                One Account for Everything You Buy, Sell & Dispatch.
              </h1>
              <p className="text-xs text-blue-100/90 leading-relaxed pt-1">
                India&apos;s unified commerce portal. Connect seamlessly to Porter mini trucks, express 2-wheelers, or buy and sell verified pre-owned items with 100% escrow protection.
              </p>
            </div>

            {/* Platform Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">15-Minute Fleet Dispatch</h4>
                  <p className="text-[11px] text-blue-100/80">Tata Ace, 2-Wheelers & Pickup trucks ready in Lucknow & UP.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-blue-400/20 text-blue-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Escrow Payment Security</h4>
                  <p className="text-[11px] text-blue-100/80">Buyer funds held safely in escrow and released upon delivery.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-purple-400/20 text-purple-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Instant UPI Payouts for Sellers</h4>
                  <p className="text-[11px] text-blue-100/80">Zero commission fee on peer-to-peer pre-owned sales.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-200">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Verified Enterprise
            </span>
            <span className="font-mono text-[10px] text-blue-300">GST: 09ABRFM9138P1Z3</span>
          </div>
        </div>

        {/* Right Side: Clean Authentication Box */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
          
          {/* Top Tab Toggle: Sign In vs Create Account */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* ========================================================
              TAB 1: SIGN IN FORM
             ======================================================== */}
          {activeTab === 'login' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Welcome back
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter your credentials to access your PORTEX workspace
                </p>
              </div>

              {/* Official Google 1-Click Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <GoogleLogo className="w-5 h-5 flex-shrink-0" />
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 absolute">
                  or sign in with credentials
                </span>
              </div>

              {/* Login Method Segment: Password vs Mobile OTP */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLoginMethod('password')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    loginMethod === 'password'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800'
                      : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Password Login
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('otp')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    loginMethod === 'otp'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800'
                      : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Mobile OTP Login
                </button>
              </div>

              {/* Method A: Password Login Form */}
              {loginMethod === 'password' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email or Mobile Number
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={e => setLoginIdentifier(e.target.value)}
                        placeholder="krishna.verma@example.com or +91 98765 43210"
                        className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setForgotModalOpen(true)}
                        className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="Enter your account password"
                        className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        Remember me for 30 days
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    {loading ? (
                      <span>Verifying credentials...</span>
                    ) : (
                      <>
                        <span>Sign In to PORTEX</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Method B: Phone OTP Login Form */}
              {loginMethod === 'otp' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={loginPhone}
                        onChange={e => setLoginPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-24 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(true);
                          showToast('OTP sent: 4829');
                        }}
                        className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg shadow-sm cursor-pointer"
                      >
                        {otpSent ? 'Resend' : 'Send OTP'}
                      </button>
                    </div>
                  </div>

                  {otpSent && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-500/30 space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Code sent to {loginPhone}
                        </span>
                        <button
                          type="button"
                          onClick={() => setEnteredOtp('4829')}
                          className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 underline cursor-pointer"
                        >
                          Auto-fill: 4829
                        </button>
                      </div>
                      <input
                        type="text"
                        maxLength={4}
                        required
                        value={enteredOtp}
                        onChange={e => setEnteredOtp(e.target.value)}
                        placeholder="Enter 4-digit code"
                        className="w-full px-3 py-2 text-center text-sm font-mono tracking-widest font-black rounded-lg bg-white dark:bg-slate-900 border border-emerald-400 text-slate-900 dark:text-white"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    {loading ? (
                      <span>Verifying OTP code...</span>
                    ) : (
                      <>
                        <span>Verify & Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Don&apos;t have an account yet?{' '}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Create account &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: REGISTER / SIGN UP FORM
             ======================================================== */}
          {activeTab === 'register' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Create your PORTEX account
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select your primary account type and enter your details
                </p>
              </div>

              {/* Role / Account Type Selector (4 Options) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Choose Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('BUYER')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedRole === 'BUYER'
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                      {selectedRole === 'BUYER' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white">Individual</div>
                    <div className="text-[10px] text-slate-500">Shop & book parcel</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('ENTERPRISE')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedRole === 'ENTERPRISE'
                        ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      {selectedRole === 'ENTERPRISE' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white">Business Shipper</div>
                    <div className="text-[10px] text-slate-500">Mini trucks & GST credit</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('SELLER')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedRole === 'SELLER'
                        ? 'border-purple-600 bg-purple-50/60 dark:bg-purple-950/40 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Banknote className="w-4 h-4 text-purple-600" />
                      {selectedRole === 'SELLER' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />}
                    </div>
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white">Marketplace Seller</div>
                    <div className="text-[10px] text-slate-500">UPI payouts & listings</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('DRIVER')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedRole === 'DRIVER'
                        ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Zap className="w-4 h-4 text-amber-500" />
                      {selectedRole === 'DRIVER' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />}
                    </div>
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white">Driver Partner</div>
                    <div className="text-[10px] text-slate-500">Earn with your vehicle</div>
                  </button>
                </div>
              </div>

              {/* 1-Click Google Sign Up */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <GoogleLogo className="w-4 h-4 flex-shrink-0" />
                <span>Fast Sign Up with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 absolute">
                  or fill account info
                </span>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Chandra"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Number (+91) *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={regPhone}
                        onChange={e => setRegPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        placeholder="ramesh@example.com"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      City / Operational Hub *
                    </label>
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Lucknow">Lucknow (Central Hub)</option>
                      <option value="Kanpur">Kanpur</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Varanasi">Varanasi</option>
                      <option value="Bengaluru">Bengaluru</option>
                    </select>
                  </div>
                </div>

                {/* Password & Strength Meter */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {regPassword && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all`}
                          style={{ width: `${(passwordStrength.score / 3) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">
                        {passwordStrength.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Dynamic Role-specific Field */}
                {selectedRole === 'ENTERPRISE' && (
                  <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-500/20 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Company / Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={e => setBusinessName(e.target.value)}
                        placeholder="e.g. Sharma Logistics"
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        GSTIN (Optional, for 18% ITC)
                      </label>
                      <input
                        type="text"
                        value={gstin}
                        onChange={e => setGstin(e.target.value)}
                        placeholder="09AAECS1429B1Z2"
                        className="w-full px-3 py-1.5 text-xs font-mono uppercase rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {selectedRole === 'SELLER' && (
                  <div className="p-3 bg-purple-50/60 dark:bg-purple-950/20 rounded-xl border border-purple-500/20 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Store / Brand Display Name
                      </label>
                      <input
                        type="text"
                        value={sellerStoreName}
                        onChange={e => setSellerStoreName(e.target.value)}
                        placeholder="e.g. Ramesh Electronics"
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Payout UPI ID (Instant Payout)
                      </label>
                      <input
                        type="text"
                        value={sellerUpi}
                        onChange={e => setSellerUpi(e.target.value)}
                        placeholder="ramesh@okhdfcbank"
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {selectedRole === 'DRIVER' && (
                  <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-500/20">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Vehicle You Will Drive
                    </label>
                    <select
                      value={driverVehicle}
                      onChange={e => setDriverVehicle(e.target.value as DeliveryVehicleType)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="TATA_ACE_MINI_TRUCK">Tata Ace Mini Truck (Chota Hathi - 750kg)</option>
                      <option value="TWO_WHEELER">2-Wheeler (Express Bike Delivery)</option>
                      <option value="THREE_WHEELER_AUTO">3-Wheeler Auto (500kg)</option>
                      <option value="PICKUP_8FT">8ft Pickup Truck (1200kg)</option>
                    </select>
                  </div>
                )}

                {/* Terms Agreement */}
                <label className="flex items-start gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={e => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  {loading ? (
                    <span>Creating your account...</span>
                  ) : (
                    <>
                      <span>Create Free Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Already have an account?{' '}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Sign in here &rarr;
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reset Account Password
              </h3>
              <button
                type="button"
                onClick={() => {
                  setForgotModalOpen(false);
                  setForgotSent(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotSent ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-500/30 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  Password Reset Link Sent!
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Please check your inbox at <strong>{forgotEmail}</strong> to reset your password.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(false);
                    setForgotSent(false);
                  }}
                  className="mt-2 px-4 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Enter your registered email address or mobile number and we will send you a link to reset your password.
                </p>
                <input
                  type="text"
                  required
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="Enter email or mobile number"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="text-xs font-bold text-slate-500 animate-pulse">Loading PORTEX Authentication...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
