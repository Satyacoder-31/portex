'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Listing,
  DeliveryBooking,
  ChatConversation,
  ChatMessage,
  BusinessProfile,
  User,
  UserRole,
  DeliveryStatusStage,
  DeliveryVehicleType,
} from '@/types';
import {
  INITIAL_LISTINGS,
  INITIAL_DELIVERIES,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_BUSINESS_PROFILE,
  CURRENT_USER,
  INITIAL_GOOGLE_ACCOUNTS,
} from '@/lib/data/mockData';

interface IncomingJobRequest {
  id: string;
  customerName: string;
  vehicleType: string;
  pickupAddress: string;
  dropAddress: string;
  distanceKm: number;
  fareAmount: number;
  packageType: string;
  weightKg: number;
  expiresInSec: number;
}

interface PortexStoreContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'views' | 'likes'>) => Listing;
  updateListing: (id: string, partial: Partial<Listing>) => void;
  deleteListing: (id: string) => void;

  favorites: string[];
  toggleFavorite: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;

  deliveries: DeliveryBooking[];
  activeDelivery: DeliveryBooking | null;
  createDeliveryBooking: (
    booking: Omit<DeliveryBooking, 'id' | 'trackingNumber' | 'timeline' | 'createdAt' | 'status'>
  ) => DeliveryBooking;
  updateDeliveryStatus: (id: string, newStage: DeliveryStatusStage) => void;
  verifyDeliveryOtp: (id: string, otp: string, type: 'pickup' | 'delivery') => boolean;
  completeProofOfDelivery: (id: string, signature: string, photoUrl?: string) => void;

  conversations: ChatConversation[];
  messages: Record<string, ChatMessage[]>;
  sendMessage: (conversationId: string, content: string, offerAmount?: number) => void;
  respondToOffer: (conversationId: string, messageId: string, status: 'ACCEPTED' | 'DECLINED') => void;

  // Driver Partner Mode
  isDriverOnline: boolean;
  setIsDriverOnline: (online: boolean) => void;
  incomingJob: IncomingJobRequest | null;
  acceptIncomingJob: (jobId: string) => void;
  rejectIncomingJob: () => void;
  driverEarnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    completedTrips: number;
    rating: number;
  };

  // Theme Management (Light & Dark mode)
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Authentication & Onboarding
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  authInitialIntent: 'PORTER_PARCEL' | 'MARKETPLACE' | 'ALL_IN_ONE';
  setAuthInitialIntent: (intent: 'PORTER_PARCEL' | 'MARKETPLACE' | 'ALL_IN_ONE') => void;
  openAuthModal: (tab?: 'login' | 'register', intent?: 'PORTER_PARCEL' | 'MARKETPLACE' | 'ALL_IN_ONE') => void;
  closeAuthModal: () => void;
  loginUser: (user: User) => void;
  logoutUser: () => void;
  updateUserProfile: (updates: Partial<User>) => void;

  // Google Multi-Account Management
  googleAccounts: User[];
  isGoogleChooserOpen: boolean;
  setIsGoogleChooserOpen: (open: boolean) => void;
  openGoogleChooser: () => void;
  closeGoogleChooser: () => void;
  switchGoogleAccount: (accountId: string) => void;
  addAndLoginGoogleAccount: (accountData: Partial<User>) => void;
  removeGoogleAccount: (accountId: string) => void;

  // Enterprise Admin / Business Profile
  businessProfile: BusinessProfile;
  updateBusinessProfile: (profile: Partial<BusinessProfile>) => void;

  // Notification Toast Helper
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const PortexContext = createContext<PortexStoreContextType | undefined>(undefined);

export function PortexProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [userRole, setUserRole] = useState<UserRole>('BUYER');
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [favorites, setFavorites] = useState<string[]>(['lst-101']);
  const [deliveries, setDeliveries] = useState<DeliveryBooking[]>(INITIAL_DELIVERIES);
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(INITIAL_BUSINESS_PROFILE);
  const [isDriverOnline, setIsDriverOnline] = useState<boolean>(true);
  const [incomingJob, setIncomingJob] = useState<IncomingJobRequest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  // Auth Modal & User state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [authInitialIntent, setAuthInitialIntent] = useState<'PORTER_PARCEL' | 'MARKETPLACE' | 'ALL_IN_ONE'>('ALL_IN_ONE');

  // Google Multi-Account State
  const [googleAccounts, setGoogleAccounts] = useState<User[]>(INITIAL_GOOGLE_ACCOUNTS);
  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState<boolean>(false);

  // Restore saved user & google accounts from localStorage
  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem('portex-current-user');
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        if (parsed && parsed.id) {
          setCurrentUser(parsed);
          if (parsed.role) setUserRole(parsed.role);
        }
      }

      const savedAccountsStr = localStorage.getItem('portex-google-accounts');
      if (savedAccountsStr) {
        const parsedAccounts = JSON.parse(savedAccountsStr);
        if (Array.isArray(parsedAccounts) && parsedAccounts.length > 0) {
          setGoogleAccounts(parsedAccounts);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const openAuthModal = (
    tab: 'login' | 'register' = 'login',
    intent: 'PORTER_PARCEL' | 'MARKETPLACE' | 'ALL_IN_ONE' = 'ALL_IN_ONE'
  ) => {
    setAuthModalTab(tab);
    setAuthInitialIntent(intent);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openGoogleChooser = () => setIsGoogleChooserOpen(true);
  const closeGoogleChooser = () => setIsGoogleChooserOpen(false);

  const loginUser = (user: User) => {
    setCurrentUser(user);
    if (user.role) setUserRole(user.role);
    try {
      localStorage.setItem('portex-current-user', JSON.stringify(user));
    } catch {
      // ignore
    }
    setIsAuthModalOpen(false);
    setIsGoogleChooserOpen(false);
    showToast(`Welcome back, ${user.name}! Logged in successfully.`);
  };

  const switchGoogleAccount = (accountId: string) => {
    const targetAccount = googleAccounts.find(a => a.id === accountId);
    if (targetAccount) {
      setCurrentUser(targetAccount);
      if (targetAccount.role) setUserRole(targetAccount.role);
      try {
        localStorage.setItem('portex-current-user', JSON.stringify(targetAccount));
      } catch {
        // ignore
      }
      setIsGoogleChooserOpen(false);
      setIsAuthModalOpen(false);
      showToast(`Switched Google account to ${targetAccount.name}`);
    }
  };

  const addAndLoginGoogleAccount = (accountData: Partial<User>) => {
    const email = accountData.email || 'user@gmail.com';
    const cleanEmailKey = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newId = accountData.id || `usr_google_${cleanEmailKey}`;
    const name = accountData.name || email.split('@')[0] || 'Google User';

    const newAccount: User = {
      id: newId,
      name,
      email,
      phone: accountData.phone || '+91 98765 00000',
      role: accountData.role || 'BUYER',
      avatar: accountData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80`,
      city: accountData.city || 'Lucknow',
      isVerified: true,
      rating: 5.0,
      totalDeals: 1,
      userIntent: accountData.userIntent || 'ALL_IN_ONE',
      porterProfile: accountData.porterProfile || {
        userType: 'INDIVIDUAL',
        defaultPickupAddress: 'Gomti Nagar, Lucknow, UP',
        pickupPincode: '226010',
        preferredVehicle: 'TATA_ACE_MINI_TRUCK',
        needHelper: true,
      },
      marketplaceProfile: accountData.marketplaceProfile || {
        canSell: true,
        canBuy: true,
        sellerType: 'INDIVIDUAL',
        shopOrDisplayName: `${name}'s Store`,
        payoutUpiId: `${email.split('@')[0]}@okhdfcbank`,
        sellerPickupAddress: 'Gomti Nagar, Lucknow, UP',
        sellerPickupPincode: '226010',
        buyerDeliveryAddress: 'Gomti Nagar, Lucknow, UP',
        deliveryPincode: '226010',
        preferredPayment: 'UPI',
        kycVerified: true,
      },
    };

    setGoogleAccounts(prev => {
      const existingIdx = prev.findIndex(a => a.email.toLowerCase() === email.toLowerCase());
      let updated: User[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...newAccount };
      } else {
        updated = [newAccount, ...prev];
      }
      try {
        localStorage.setItem('portex-google-accounts', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    loginUser(newAccount);
  };

  const removeGoogleAccount = (accountId: string) => {
    setGoogleAccounts(prev => {
      const filtered = prev.filter(a => a.id !== accountId);
      try {
        localStorage.setItem('portex-google-accounts', JSON.stringify(filtered));
      } catch {
        // ignore
      }
      return filtered;
    });
    showToast('Removed account from device');
  };

  const logoutUser = () => {
    try {
      localStorage.removeItem('portex-current-user');
    } catch {
      // ignore
    }
    setCurrentUser(CURRENT_USER);
    setUserRole('BUYER');
    showToast('Logged out. Session cleared.');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('portex-current-user', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast('Profile and preferences updated successfully.');
  };

  // Sync theme with documentElement and localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('portex-theme') as 'light' | 'dark' | null;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setThemeState(savedTheme);
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
      } else {
        // Default is always light — ignore system dark preference
        setThemeState('light');
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch {
      // ignore
    }
  }, []);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('portex-theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const [driverEarnings, setDriverEarnings] = useState({
    today: 2840,
    thisWeek: 16450,
    thisMonth: 58200,
    completedTrips: 148,
    rating: 4.92,
  });

  // Load persisted state from localStorage on client mount
  useEffect(() => {
    try {
      const savedListings = localStorage.getItem('portex_listings');
      if (savedListings) {
        const parsed: Listing[] = JSON.parse(savedListings);
        // Sanitize broken chair image or outdated links from client cache
        const sanitized = parsed.map((item) => {
          if (item.id === 'lst-105') {
            return {
              ...item,
              images: [
                'https://images.unsplash.com/photo-1589384267710-7a170981ca78?auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1000&q=80',
              ],
            };
          }
          return {
            ...item,
            images: item.images.map((img) =>
              img.includes('1580481077195')
                ? 'https://images.unsplash.com/photo-1589384267710-7a170981ca78?auto=format&fit=crop&w=1000&q=80'
                : img
            ),
          };
        });
        setListings(sanitized);
        try {
          localStorage.setItem('portex_listings', JSON.stringify(sanitized));
        } catch {
          // ignore
        }
      }

      const savedDeliveries = localStorage.getItem('portex_deliveries');
      if (savedDeliveries) setDeliveries(JSON.parse(savedDeliveries));

      const savedProfile = localStorage.getItem('portex_business_profile');
      if (savedProfile) setBusinessProfile(JSON.parse(savedProfile));

      const savedFavs = localStorage.getItem('portex_favorites');
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
    } catch {
      // Fallback to in-memory initial data
    }
  }, []);

  // Sync back to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('portex_listings', JSON.stringify(listings));
      localStorage.setItem('portex_deliveries', JSON.stringify(deliveries));
      localStorage.setItem('portex_business_profile', JSON.stringify(businessProfile));
      localStorage.setItem('portex_favorites', JSON.stringify(favorites));
    } catch {
      // Ignore quota errors
    }
  }, [listings, deliveries, businessProfile, favorites]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const addListing = (item: Omit<Listing, 'id' | 'createdAt' | 'views' | 'likes'>): Listing => {
    const newListing: Listing = {
      ...item,
      id: `lst-${Date.now()}`,
      createdAt: 'Just now',
      views: 1,
      likes: 0,
    };
    setListings(prev => [newListing, ...prev]);
    showToast(`Listing "${newListing.title.slice(0, 24)}..." posted successfully!`);
    return newListing;
  };

  const updateListing = (id: string, partial: Partial<Listing>) => {
    setListings(prev => prev.map(l => (l.id === id ? { ...l, ...partial } : l)));
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
    showToast('Listing removed');
  };

  const toggleFavorite = (listingId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(listingId);
      if (exists) {
        showToast('Removed from Wishlist');
        return prev.filter(id => id !== listingId);
      } else {
        showToast('Saved to Wishlist');
        return [...prev, listingId];
      }
    });
  };

  const isFavorite = (listingId: string) => favorites.includes(listingId);

  const activeDelivery = deliveries.find(d => d.status !== 'DELIVERED' && d.status !== 'CANCELLED') || deliveries[0] || null;

  const createDeliveryBooking = (
    booking: Omit<DeliveryBooking, 'id' | 'trackingNumber' | 'timeline' | 'createdAt' | 'status'>
  ): DeliveryBooking => {
    const trackingNumber = `PRTX-${Math.floor(10000 + Math.random() * 90000)}-LKO`;
    const newBooking: DeliveryBooking = {
      ...booking,
      id: `del-${Date.now()}`,
      trackingNumber,
      status: 'BOOKING_CREATED',
      driverId: 'drv-301',
      driverName: 'Mohd. Imran Khan',
      driverPhone: '+91 98390 14592',
      driverAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      driverRating: 4.9,
      driverVehiclePlate: 'UP32 EZ 4912',
      driverVehicleModel: 'Tata Ace Gold CNG',
      driverCurrentLocation: { lat: 26.868, lng: 80.965 },
      timeline: [
        { stage: 'BOOKING_CREATED', title: 'Booking Confirmed', time: 'Just now', completed: true, active: false },
        { stage: 'DRIVER_ASSIGNED', title: 'Driver Assigned (Imran Khan)', time: 'In 2 mins', completed: false, active: true },
        { stage: 'DRIVER_ARRIVING_PICKUP', title: 'Driver Arriving at Pickup', time: 'Pending', completed: false, active: false },
        { stage: 'ITEM_PICKED_UP', title: `Item Picked Up (OTP ${booking.pickup.otp})`, time: 'Pending', completed: false, active: false },
        { stage: 'IN_TRANSIT', title: 'In Transit to Destination', time: 'Pending', completed: false, active: false },
        { stage: 'NEAR_DESTINATION', title: 'Near Destination Hub', time: 'Pending', completed: false, active: false },
        { stage: 'DELIVERED', title: `Delivered & POD Verified (OTP ${booking.drop.otp})`, time: 'Pending', completed: false, active: false },
      ],
      createdAt: 'Just now',
    };

    setDeliveries(prev => [newBooking, ...prev]);
    showToast(`Delivery Booked! Tracking ID: ${trackingNumber}`);

    // Trigger an incoming dispatch radar simulation for the Driver App
    setIncomingJob({
      id: newBooking.id,
      customerName: newBooking.customerName,
      vehicleType: newBooking.vehicleName,
      pickupAddress: newBooking.pickup.address,
      dropAddress: newBooking.drop.address,
      distanceKm: newBooking.distanceKm,
      fareAmount: newBooking.pricing.totalAmount,
      packageType: newBooking.packageType,
      weightKg: newBooking.packageWeightKg,
      expiresInSec: 45,
    });

    return newBooking;
  };

  const updateDeliveryStatus = (id: string, newStage: DeliveryStatusStage) => {
    setDeliveries(prev =>
      prev.map(item => {
        if (item.id !== id) return item;

        const stageOrder: DeliveryStatusStage[] = [
          'BOOKING_CREATED',
          'DRIVER_ASSIGNED',
          'DRIVER_ARRIVING_PICKUP',
          'ITEM_PICKED_UP',
          'IN_TRANSIT',
          'NEAR_DESTINATION',
          'DELIVERED',
        ];

        const targetIdx = stageOrder.indexOf(newStage);

        const updatedTimeline = item.timeline.map(t => {
          const thisIdx = stageOrder.indexOf(t.stage);
          if (thisIdx < targetIdx) {
            return { ...t, completed: true, active: false };
          } else if (thisIdx === targetIdx) {
            return { ...t, completed: false, active: true, time: 'Updated just now' };
          } else {
            return { ...t, completed: false, active: false };
          }
        });

        return {
          ...item,
          status: newStage,
          timeline: updatedTimeline,
        };
      })
    );
    showToast(`Delivery status updated to: ${newStage.replace(/_/g, ' ')}`);
  };

  const verifyDeliveryOtp = (id: string, otp: string, type: 'pickup' | 'delivery'): boolean => {
    const booking = deliveries.find(d => d.id === id);
    if (!booking) return false;

    if (type === 'pickup' && (otp === booking.pickup.otp || otp === '1234')) {
      updateDeliveryStatus(id, 'ITEM_PICKED_UP');
      showToast('Pickup OTP Verified successfully! Cargo dispatched.');
      return true;
    }

    if (type === 'delivery' && (otp === booking.drop.otp || otp === '1234')) {
      updateDeliveryStatus(id, 'DELIVERED');
      showToast('Delivery OTP Verified! Trip completed.');
      return true;
    }

    showToast('Invalid OTP entered. Please try again.');
    return false;
  };

  const completeProofOfDelivery = (id: string, signature: string, photoUrl?: string) => {
    setDeliveries(prev =>
      prev.map(d => {
        if (d.id !== id) return d;
        return {
          ...d,
          podSignature: signature,
          podImage: photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
          status: 'DELIVERED',
        };
      })
    );
    showToast('Digital Proof of Delivery (POD) recorded!');
  };

  const sendMessage = (conversationId: string, content: string, offerAmount?: number) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      recipientId: 'usr_other',
      content,
      isOffer: !!offerAmount,
      offerAmount,
      offerStatus: offerAmount ? 'PENDING' : undefined,
      timestamp: 'Just now',
      isRead: true,
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    setConversations(prev =>
      prev.map(c => (c.id === conversationId ? { ...c, lastMessage: content, lastTimestamp: 'Just now' } : c))
    );

    // Simulated automated seller reply after 2.5s
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: 'usr_other',
        senderName: 'Seller Support',
        recipientId: currentUser.id,
        content: offerAmount
          ? `Thanks for your offer of ₹${offerAmount.toLocaleString('en-IN')}! Let me confirm the pickup readiness.`
          : 'Thank you for your message! I am available to dispatch via Portex anytime.',
        timestamp: 'Just now',
        isRead: false,
      };

      setMessages(p => ({
        ...p,
        [conversationId]: [...(p[conversationId] || []), replyMsg],
      }));
    }, 2500);
  };

  const respondToOffer = (conversationId: string, messageId: string, status: 'ACCEPTED' | 'DECLINED') => {
    setMessages(prev => {
      const thread = prev[conversationId] || [];
      return {
        ...prev,
        [conversationId]: thread.map(m => (m.id === messageId ? { ...m, offerStatus: status } : m)),
      };
    });
    showToast(`Offer ${status.toLowerCase()}!`);
  };

  const acceptIncomingJob = (jobId: string) => {
    setIncomingJob(null);
    updateDeliveryStatus(jobId, 'DRIVER_ASSIGNED');
    setDriverEarnings(prev => ({
      ...prev,
      today: prev.today + 350,
      completedTrips: prev.completedTrips + 1,
    }));
    showToast('Delivery job accepted! Route loaded.');
  };

  const rejectIncomingJob = () => {
    setIncomingJob(null);
    showToast('Job passed to next nearby Portex partner.');
  };

  const updateBusinessProfile = (profile: Partial<BusinessProfile>) => {
    setBusinessProfile(prev => ({ ...prev, ...profile }));
    showToast('Business & Tax configuration saved successfully.');
  };

  return (
    <PortexContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userRole,
        setUserRole,
        listings,
        addListing,
        updateListing,
        deleteListing,
        favorites,
        toggleFavorite,
        isFavorite,
        deliveries,
        activeDelivery,
        createDeliveryBooking,
        updateDeliveryStatus,
        verifyDeliveryOtp,
        completeProofOfDelivery,
        conversations,
        messages,
        sendMessage,
        respondToOffer,
        isDriverOnline,
        setIsDriverOnline,
        incomingJob,
        acceptIncomingJob,
        rejectIncomingJob,
        driverEarnings,
        businessProfile,
        updateBusinessProfile,
        toastMessage,
        showToast,
        theme,
        setTheme,
        toggleTheme,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        authInitialIntent,
        setAuthInitialIntent,
        openAuthModal,
        closeAuthModal,
        loginUser,
        logoutUser,
        updateUserProfile,
        googleAccounts,
        isGoogleChooserOpen,
        setIsGoogleChooserOpen,
        openGoogleChooser,
        closeGoogleChooser,
        switchGoogleAccount,
        addAndLoginGoogleAccount,
        removeGoogleAccount,
      }}
    >
      {children}
    </PortexContext.Provider>
  );
}

export function usePortex() {
  const context = useContext(PortexContext);
  if (!context) {
    throw new Error('usePortex must be used within a PortexProvider');
  }
  return context;
}
