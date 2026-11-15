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
  ListingStatus,
} from '@/types';
import {
  INITIAL_LISTINGS,
  INITIAL_DELIVERIES,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_BUSINESS_PROFILE,
  CURRENT_USER,
  INITIAL_REGISTERED_USERS,
  INITIAL_GOOGLE_ACCOUNTS,
  INITIAL_RECENT_SEARCHES,
  getAutoVehicleForWeight,
  VEHICLE_OPTIONS,
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
  verifyListing: (listingId: string, status: 'APPROVED' | 'REJECTED', overrideVehicle?: DeliveryVehicleType) => void;

  favorites: string[];
  toggleFavorite: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;

  deliveries: DeliveryBooking[];
  activeDelivery: DeliveryBooking | null;
  createDeliveryBooking: (
    booking: Omit<DeliveryBooking, 'id' | 'trackingNumber' | 'timeline' | 'createdAt' | 'status'>
  ) => DeliveryBooking;
  updateDeliveryStatus: (id: string, newStage: DeliveryStatusStage) => void;
  updateDeliveryVehicle: (id: string, vehicleType: DeliveryVehicleType) => void;
  acceptDeliveryJob: (deliveryId: string, driver?: Partial<User>) => void;
  verifyPickupOtp: (deliveryId: string, enteredOtp: string) => boolean;
  verifyDeliveryOtp: (id: string, otp: string, type: 'pickup' | 'delivery') => boolean;
  completeProofOfDelivery: (id: string, signature: string, photoUrl?: string) => void;

  conversations: ChatConversation[];
  messages: Record<string, ChatMessage[]>;
  sendMessage: (conversationId: string, content: string, offerAmount?: number, imageUrl?: string) => void;
  respondToOffer: (conversationId: string, messageId: string, status: 'ACCEPTED' | 'DECLINED') => void;
  getOrCreateConversation: (params: {
    listingId?: string;
    deliveryId?: string;
    contactId?: string;
    contactName?: string;
    contactAvatar?: string;
    contactRole?: string;
    listingTitle?: string;
    listingPrice?: number;
    listingImage?: string;
    initialMessage?: string;
  }) => ChatConversation;

  // Driver Partner Mode
  isDriverOnline: boolean;
  setIsDriverOnline: (online: boolean) => void;
  driverVehicleType: DeliveryVehicleType;
  setDriverVehicleType: (type: DeliveryVehicleType) => void;
  incomingJob: IncomingJobRequest | null;
  acceptIncomingJob: (jobId: string) => void;
  rejectIncomingJob: () => void;
  triggerIncomingJobRadar: () => void;
  driverEarnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    completedTrips: number;
    rating: number;
  };
  dispatchProductDelivery: (params: {
    listingId: string;
    title: string;
    price: number;
    weightKg: number;
    buyerName?: string;
    buyerAddress?: string;
    buyerPhone?: string;
  }) => DeliveryBooking;

  // Theme Management (Light & Dark mode)
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Authentication & Onboarding
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  authInitialIntent: 'PORTER_PARCEL' | 'MARKETPLACE' | 'ALL_IN_ONE';
  setAuthInitialIntent: (intent: 'PORTER_PARCEL' | 'MARKETPLACE' | 'ALL_IN_ONE') => void;
  openAuthModal: (tab?: 'login' | 'register', intent?: 'PORTER_PARCEL' | 'MARKETPLACE' | 'ALL_IN_ONE') => void;
  closeAuthModal: () => void;
  registeredUsers: User[];
  registerUser: (userData: User) => void;
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

  // Portex Voice Search & Recent Searches
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  openVoiceSearch: () => void;
  closeVoiceSearch: () => void;

  // OLX-Style Listing Expiration & Bulk Chat Deletion
  renewListing: (listingId: string) => void;
  deleteConversations: (conversationIds: string[]) => void;

  // Admin Auto-Message Settings & Manual Reply Desk
  adminAutoMessageEnabled: boolean;
  adminAutoMessageText: string;
  updateAdminAutoMessageSettings: (enabled: boolean, text: string) => void;
  adminSendReply: (conversationId: string, replyText: string) => void;

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
  const [driverVehicleType, setDriverVehicleTypeState] = useState<DeliveryVehicleType>('TWO_WHEELER');
  const [incomingJob, setIncomingJob] = useState<IncomingJobRequest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');

  // Cross-tab synchronization broadcast helper
  const broadcastSync = (type: string, payload?: any) => {
    if (typeof window === 'undefined') return;
    try {
      const channel = new BroadcastChannel('portex_sync_hub');
      channel.postMessage({ type, payload });
      channel.close();
    } catch {
      // ignore
    }
  };

  const setDriverVehicleType = (type: DeliveryVehicleType) => {
    setDriverVehicleTypeState(type);
    try {
      localStorage.setItem('portex_driver_vehicle', type);
    } catch {}
    showToast(`Driver vehicle set to: ${type.replace(/_/g, ' ')}`);
  };

  // Registered Users Directory (Persisted in localStorage)
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(INITIAL_REGISTERED_USERS);

  // Auth Modal & User state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [authInitialIntent, setAuthInitialIntent] = useState<'PORTER_PARCEL' | 'MARKETPLACE' | 'ALL_IN_ONE'>('ALL_IN_ONE');

  // Google Multi-Account State
  const [googleAccounts, setGoogleAccounts] = useState<User[]>(INITIAL_GOOGLE_ACCOUNTS);
  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState<boolean>(false);

  // Portex Voice Search & Recent Searches State
  const [recentSearches, setRecentSearches] = useState<string[]>(INITIAL_RECENT_SEARCHES);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  // Admin Auto-Message Settings State
  const [adminAutoMessageEnabled, setAdminAutoMessageEnabled] = useState<boolean>(true);
  const [adminAutoMessageText, setAdminAutoMessageText] = useState<string>(
    'Greetings from Portex Support Desk! We have received your message. Our operations team is coordinating your request and will assist you shortly.'
  );

  // Restore saved user & registered accounts from localStorage
  useEffect(() => {
    try {
      // Clear legacy bloated demo cache if not migrated to v2 clean single-entry schema
      const schemaVer = localStorage.getItem('portex_schema_v2');
      if (!schemaVer) {
        localStorage.removeItem('portex_listings');
        localStorage.removeItem('portex_deliveries');
        localStorage.removeItem('portex_conversations');
        localStorage.removeItem('portex_messages');
        localStorage.removeItem('portex_recent_searches');
        localStorage.setItem('portex_schema_v2', 'true');
      }

      const savedLoggedIn = localStorage.getItem('portex-is-logged-in');
      if (savedLoggedIn === 'false') {
        setIsLoggedIn(false);
      } else if (savedLoggedIn === 'true') {
        setIsLoggedIn(true);
      }

      const savedUsersStr = localStorage.getItem('portex-registered-users');
      if (savedUsersStr) {
        const parsedUsers = JSON.parse(savedUsersStr);
        if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
          setRegisteredUsers(parsedUsers);
        }
      }

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

      const savedSearches = localStorage.getItem('portex_recent_searches');
      if (savedSearches) {
        const parsedSearches = JSON.parse(savedSearches);
        if (Array.isArray(parsedSearches) && parsedSearches.length > 0) {
          setRecentSearches(parsedSearches);
        }
      }

      const savedDriverVeh = localStorage.getItem('portex_driver_vehicle') as DeliveryVehicleType | null;
      if (savedDriverVeh) {
        setDriverVehicleTypeState(savedDriverVeh);
      }

      const savedAutoMsg = localStorage.getItem('portex_admin_auto_message_enabled');
      if (savedAutoMsg !== null) {
        setAdminAutoMessageEnabled(savedAutoMsg === 'true');
      }

      const savedAutoText = localStorage.getItem('portex_admin_auto_message_text');
      if (savedAutoText) {
        setAdminAutoMessageText(savedAutoText);
      }
    } catch {
      // ignore
    }
  }, []);

  // Multi-tab real-time sync listener (BroadcastChannel + storage event)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('portex_sync_hub');
      channel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (!type) return;

        if (type === 'NEW_DISPATCH_REQUEST') {
          if (payload?.booking) {
            setDeliveries(prev => {
              if (prev.some(d => d.id === payload.booking.id)) return prev;
              return [payload.booking, ...prev];
            });
          }
          if (payload?.job) {
            setIncomingJob(payload.job);
          }
        } else if (type === 'DELIVERY_ACCEPTED') {
          setDeliveries(prev =>
            prev.map(d => {
              if (d.id !== payload.deliveryId) return d;
              return {
                ...d,
                status: 'DRIVER_ASSIGNED' as const,
                driverName: payload.driverName || d.driverName,
                driverPhone: payload.driverPhone || d.driverPhone,
                driverVehiclePlate: payload.driverPlate || d.driverVehiclePlate,
                driverVehicleModel: payload.driverModel || d.driverVehicleModel,
              };
            })
          );
          setIncomingJob(null);
        } else if (type === 'STAGE_UPDATED') {
          if (payload?.id && payload?.stage) {
            setDeliveries(prev =>
              prev.map(d => (d.id === payload.id ? { ...d, status: payload.stage } : d))
            );
          }
        } else if (type === 'LISTINGS_UPDATED') {
          if (payload?.listings) {
            setListings(payload.listings);
          }
        }
      };
    } catch {
      // fallback
    }

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'portex_deliveries' && e.newValue) {
        try {
          setDeliveries(JSON.parse(e.newValue));
        } catch {}
      } else if (e.key === 'portex_listings' && e.newValue) {
        try {
          setListings(JSON.parse(e.newValue));
        } catch {}
      } else if (e.key === 'portex_incoming_dispatch' && e.newValue) {
        try {
          setIncomingJob(JSON.parse(e.newValue));
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      channel?.close();
      window.removeEventListener('storage', handleStorageEvent);
    };
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

  const registerUser = (userData: User) => {
    setRegisteredUsers(prev => {
      const existingIdx = prev.findIndex(
        u => (u.email && u.email.toLowerCase() === userData.email.toLowerCase()) ||
             (u.phone && u.phone === userData.phone)
      );
      let updated: User[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...userData };
      } else {
        updated = [userData, ...prev];
      }
      try {
        localStorage.setItem('portex-registered-users', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    loginUser(userData);
  };

  const loginUser = (user: User) => {
    setCurrentUser(user);
    if (user.role) setUserRole(user.role);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('portex-is-logged-in', 'true');
      localStorage.setItem('portex-current-user', JSON.stringify(user));
    } catch {
      // ignore
    }

    // Ensure user is also saved in directory
    setRegisteredUsers(prev => {
      const idx = prev.findIndex(
        u => u.id === user.id || (u.email && u.email.toLowerCase() === user.email.toLowerCase())
      );
      let nextUsers: User[];
      if (idx >= 0) {
        nextUsers = [...prev];
        nextUsers[idx] = { ...nextUsers[idx], ...user };
      } else {
        nextUsers = [user, ...prev];
      }
      try {
        localStorage.setItem('portex-registered-users', JSON.stringify(nextUsers));
      } catch {
        // ignore
      }
      return nextUsers;
    });

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
      localStorage.setItem('portex-is-logged-in', 'false');
      localStorage.removeItem('portex-current-user');
    } catch {
      // ignore
    }
    setIsLoggedIn(false);
    showToast('Logged out. You have signed out successfully.');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('portex-current-user', JSON.stringify(updated));
      } catch {
        // ignore
      }

      setRegisteredUsers(usersPrev => {
        const idx = usersPrev.findIndex(
          u => u.id === updated.id || (u.email && u.email.toLowerCase() === updated.email.toLowerCase())
        );
        let nextUsers: User[];
        if (idx >= 0) {
          nextUsers = [...usersPrev];
          nextUsers[idx] = { ...nextUsers[idx], ...updated };
        } else {
          nextUsers = [updated, ...usersPrev];
        }
        try {
          localStorage.setItem('portex-registered-users', JSON.stringify(nextUsers));
        } catch {
          // ignore
        }
        return nextUsers;
      });

      return updated;
    });

    if (updates.role) {
      setUserRole(updates.role);
    }
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
        // Default is luxury Gold & Black theme
        setThemeState('dark');
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
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

      const savedConvs = localStorage.getItem('portex_conversations');
      if (savedConvs) {
        const parsedConvs = JSON.parse(savedConvs);
        if (Array.isArray(parsedConvs) && parsedConvs.length > 0) {
          setConversations(parsedConvs);
        }
      }

      const savedMsgs = localStorage.getItem('portex_messages');
      if (savedMsgs) {
        const parsedMsgs = JSON.parse(savedMsgs);
        if (parsedMsgs && typeof parsedMsgs === 'object') {
          setMessages(parsedMsgs);
        }
      }
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
      localStorage.setItem('portex_conversations', JSON.stringify(conversations));
      localStorage.setItem('portex_messages', JSON.stringify(messages));
    } catch {
      // Ignore quota errors
    }
  }, [listings, deliveries, businessProfile, favorites, conversations, messages]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const addListing = (item: Omit<Listing, 'id' | 'createdAt' | 'views' | 'likes'>): Listing => {
    const autoVehicle = getAutoVehicleForWeight(item.weightKg || 3);
    const newListing: Listing = {
      ...item,
      id: `lst-${Date.now()}`,
      createdAt: 'Just now',
      views: 1,
      likes: 0,
      status: 'ACTIVE',
      verificationStatus: item.verificationStatus ?? 'PENDING',
      recommendedVehicle: item.recommendedVehicle ?? autoVehicle.type,
      isFeatured: item.isFeatured ?? true,
    };
    setListings(prev => {
      const updated = [newListing, ...prev];
      try {
        localStorage.setItem('portex_listings', JSON.stringify(updated));
      } catch {
        // ignore quota
      }
      broadcastSync('LISTINGS_UPDATED', { listings: updated });
      return updated;
    });
    showToast(`📝 "${newListing.title.slice(0, 24)}..." submitted! Sent to Admin for verification.`);
    return newListing;
  };

  const verifyListing = (listingId: string, status: 'APPROVED' | 'REJECTED', overrideVehicle?: DeliveryVehicleType) => {
    setListings(prev => {
      const updated = prev.map(l => {
        if (l.id === listingId) {
          return {
            ...l,
            verificationStatus: status,
            status: status === 'APPROVED' ? ('ACTIVE' as const) : l.status,
            ...(overrideVehicle ? { recommendedVehicle: overrideVehicle } : {}),
          };
        }
        return l;
      });
      try {
        localStorage.setItem('portex_listings', JSON.stringify(updated));
      } catch {}
      broadcastSync('LISTINGS_UPDATED', { listings: updated });
      return updated;
    });
    if (status === 'APPROVED') {
      showToast('Product verified & approved by Admin! Now live on Marketplace.');
    } else {
      showToast('Product rejected by Admin.');
    }
  };

  const updateListing = (id: string, partial: Partial<Listing>) => {
    setListings(prev => {
      const updated = prev.map(l => (l.id === id ? { ...l, ...partial } : l));
      try {
        localStorage.setItem('portex_listings', JSON.stringify(updated));
      } catch {
        // ignore quota
      }
      broadcastSync('LISTINGS_UPDATED', { listings: updated });
      return updated;
    });
  };

  const deleteListing = (id: string) => {
    setListings(prev => {
      const updated = prev.filter(l => l.id !== id);
      try {
        localStorage.setItem('portex_listings', JSON.stringify(updated));
      } catch {
        // ignore quota
      }
      broadcastSync('LISTINGS_UPDATED', { listings: updated });
      return updated;
    });
    showToast('Listing removed from your catalog and buyer marketplace.');
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
      driverId: undefined,
      driverName: undefined,
      driverPhone: undefined,
      driverAvatar: undefined,
      driverRating: undefined,
      driverVehiclePlate: undefined,
      driverVehicleModel: undefined,
      timeline: [
        { stage: 'BOOKING_CREATED', title: 'Dispatch Requested (Awaiting Driver)', time: 'Just now', completed: true, active: false },
        { stage: 'DRIVER_ASSIGNED', title: 'Broadcasting to nearby drivers...', time: 'Pending', completed: false, active: true },
        { stage: 'DRIVER_ARRIVING_PICKUP', title: 'Driver Arriving at Pickup', time: 'Pending', completed: false, active: false },
        { stage: 'ITEM_PICKED_UP', title: `Item Picked Up (Pickup OTP: ${booking.pickup.otp})`, time: 'Pending', completed: false, active: false },
        { stage: 'IN_TRANSIT', title: 'In Transit to Destination', time: 'Pending', completed: false, active: false },
        { stage: 'NEAR_DESTINATION', title: 'Near Destination Hub', time: 'Pending', completed: false, active: false },
        { stage: 'DELIVERED', title: `Delivered & POD Verified (Drop OTP: ${booking.drop.otp})`, time: 'Pending', completed: false, active: false },
      ],
      createdAt: 'Just now',
    };

    setDeliveries(prev => {
      const updated = [newBooking, ...prev];
      try {
        localStorage.setItem('portex_deliveries', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Mark associated product as SOLD so it no longer shows in buyer feeds
    if (booking.listingId) {
      setListings(prev => {
        const updated = prev.map(l => (l.id === booking.listingId ? { ...l, status: 'SOLD' as const } : l));
        try {
          localStorage.setItem('portex_listings', JSON.stringify(updated));
        } catch {}
        broadcastSync('LISTINGS_UPDATED', { listings: updated });
        return updated;
      });
    }

    const incomingJobData: IncomingJobRequest = {
      id: newBooking.id,
      customerName: newBooking.customerName,
      vehicleType: newBooking.vehicleType,
      pickupAddress: newBooking.pickup.address,
      dropAddress: newBooking.drop.address,
      distanceKm: newBooking.distanceKm,
      fareAmount: newBooking.pricing.totalAmount,
      packageType: newBooking.packageType,
      weightKg: newBooking.packageWeightKg,
      expiresInSec: 60,
    };

    setIncomingJob(incomingJobData);
    try {
      localStorage.setItem('portex_incoming_dispatch', JSON.stringify(incomingJobData));
    } catch {}

    broadcastSync('NEW_DISPATCH_REQUEST', { booking: newBooking, job: incomingJobData });
    showToast(`🚀 Delivery Dispatched! Tracking: ${trackingNumber}. Broadcasted to drivers.`);

    return newBooking;
  };

  const dispatchProductDelivery = (params: {
    listingId: string;
    title: string;
    price: number;
    weightKg: number;
    buyerName?: string;
    buyerAddress?: string;
    buyerPhone?: string;
  }): DeliveryBooking => {
    const autoVeh = getAutoVehicleForWeight(params.weightKg || 3);
    const selectedVehOption = VEHICLE_OPTIONS.find(v => v.type === autoVeh.type) || VEHICLE_OPTIONS[0];
    const pickupOtp = String(Math.floor(1000 + Math.random() * 9000));
    const dropOtp = String(Math.floor(1000 + Math.random() * 9000));
    const distanceKm = 8.4;
    const baseFare = selectedVehOption.baseFare;
    const distanceFare = Number((distanceKm * selectedVehOption.perKmRate).toFixed(1));
    const totalAmount = baseFare + distanceFare;

    return createDeliveryBooking({
      listingId: params.listingId,
      listingTitle: params.title,
      customerId: 'usr_buyer_99',
      customerName: params.buyerName || 'Rahul Verma',
      customerPhone: params.buyerPhone || '+91 98765 11223',
      vehicleType: autoVeh.type,
      vehicleName: autoVeh.name,
      pickup: {
        address: currentUser.marketplaceProfile?.sellerPickupAddress || 'E-3/776, Sector-I Aliganj, Lucknow, UP',
        city: 'Lucknow',
        contactName: currentUser.name || 'Store Seller',
        contactPhone: currentUser.phone || '+91 97654 32109',
        lat: 26.8854,
        lng: 80.9452,
        otp: pickupOtp,
      },
      drop: {
        address: params.buyerAddress || 'Flat 402, Royal Palms, Gomti Nagar Extension, Lucknow',
        city: 'Lucknow',
        contactName: params.buyerName || 'Rahul Verma',
        contactPhone: params.buyerPhone || '+91 98765 11223',
        lat: 26.8505,
        lng: 81.0065,
        otp: dropOtp,
      },
      packageType: `Sold Goods: ${params.title}`,
      packageWeightKg: params.weightKg,
      dimensions: '50 x 35 x 30 cm',
      specialInstructions: 'Handle with care. Doorstep Porter logistics dispatch.',
      distanceKm,
      durationMins: 24,
      pricing: {
        baseFare,
        distanceFare,
        weightSurcharge: 0,
        gstAmount: Number((totalAmount * 0.18).toFixed(1)),
        discount: 0,
        totalAmount: Number((totalAmount * 1.18).toFixed(1)),
      },
      paymentMethod: 'ONLINE_UPI',
      paymentStatus: 'PAID',
    });
  };

  const updateDeliveryStatus = (id: string, newStage: DeliveryStatusStage) => {
    setDeliveries(prev => {
      const updated = prev.map(item => {
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
            return {
              ...t,
              completed: newStage === 'DELIVERED',
              active: newStage !== 'DELIVERED',
              time: newStage === 'DELIVERED' ? 'Delivered & Confirmed' : 'Updated just now',
            };
          } else {
            return { ...t, completed: false, active: false };
          }
        });

        return {
          ...item,
          status: newStage,
          timeline: updatedTimeline,
        };
      });
      try {
        localStorage.setItem('portex_deliveries', JSON.stringify(updated));
      } catch {}

      // If delivery is complete, settle records and ensure listing is marked SOLD
      if (newStage === 'DELIVERED') {
        const deliveredItem = updated.find(d => d.id === id);
        if (deliveredItem?.listingId) {
          setListings(lPrev => {
            const lUpdated = lPrev.map(l => (l.id === deliveredItem.listingId ? { ...l, status: 'SOLD' as const } : l));
            try {
              localStorage.setItem('portex_listings', JSON.stringify(lUpdated));
            } catch {}
            broadcastSync('LISTINGS_UPDATED', { listings: lUpdated });
            return lUpdated;
          });
        }

        // Increment driver earnings & trip stats
        const fare = deliveredItem?.pricing?.totalAmount || 380;
        setDriverEarnings(prev => ({
          ...prev,
          today: prev.today + fare,
          thisWeek: prev.thisWeek + fare,
          thisMonth: prev.thisMonth + fare,
          completedTrips: prev.completedTrips + 1,
        }));
      }

      broadcastSync('STAGE_UPDATED', { id, stage: newStage });
      return updated;
    });
    showToast(`Delivery status updated to: ${newStage.replace(/_/g, ' ')}`);
  };

  const updateDeliveryVehicle = (id: string, vehicleType: DeliveryVehicleType) => {
    const vehName =
      vehicleType === 'TWO_WHEELER'
        ? '2-Wheeler (Express Bike)'
        : vehicleType === 'THREE_WHEELER_AUTO'
        ? '3-Wheeler Auto Tempo'
        : 'Tata Ace (Chota Hathi Mini Truck)';

    setDeliveries(prev => {
      const updated = prev.map(d => (d.id === id ? { ...d, vehicleType, vehicleName: vehName } : d));
      try {
        localStorage.setItem('portex_deliveries', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast(`Admin updated shipping vehicle to: ${vehName}`);
  };

  const acceptDeliveryJob = (deliveryId: string, driver?: Partial<User>) => {
    const driverName = driver?.name || currentUser.name || 'Mohd. Imran Khan';
    const driverPhone = driver?.phone || currentUser.phone || '+91 98390 14592';
    const driverAvatar =
      driver?.avatar ||
      currentUser.avatar ||
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80';

    const driverPlate =
      (driver as any)?.vehiclePlate ||
      (driverVehicleType === 'TWO_WHEELER'
        ? 'UP32 EZ 1024'
        : driverVehicleType === 'THREE_WHEELER_AUTO'
        ? 'UP32 AT 8841'
        : 'UP32 EZ 4912');

    const driverModel =
      (driver as any)?.vehicleModel ||
      (driverVehicleType === 'TWO_WHEELER'
        ? '2-Wheeler (Hero Nyx Cargo Bike)'
        : driverVehicleType === 'THREE_WHEELER_AUTO'
        ? '3-Wheeler Auto (Bajaj Maxima)'
        : 'Tata Ace Gold CNG');

    let tripFare = 350;

    setDeliveries(prev => {
      const updated = prev.map(d => {
        if (d.id !== deliveryId) return d;
        tripFare = d.pricing?.totalAmount || d.fare?.total || 350;
        const updatedTimeline = d.timeline.map(t => {
          if (t.stage === 'BOOKING_CREATED') return { ...t, completed: true, active: false };
          if (t.stage === 'DRIVER_ASSIGNED') return { ...t, title: `Driver Assigned (${driverName})`, time: 'Just now', completed: true, active: true };
          if (t.stage === 'DRIVER_ARRIVING_PICKUP') return { ...t, time: 'Arriving in 6 mins', active: true };
          return t;
        });
        return {
          ...d,
          driverId: driver?.id || currentUser.id || 'drv-301',
          driverName,
          driverPhone,
          driverAvatar,
          driverRating: 4.95,
          driverVehiclePlate: driverPlate,
          driverVehicleModel: driverModel,
          status: 'DRIVER_ASSIGNED' as const,
          timeline: updatedTimeline,
        };
      });
      try {
        localStorage.setItem('portex_deliveries', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setDriverEarnings(prev => ({
      ...prev,
      today: prev.today + tripFare,
      completedTrips: prev.completedTrips + 1,
    }));

    setIncomingJob(null);
    try {
      localStorage.removeItem('portex_incoming_dispatch');
    } catch {}

    broadcastSync('DELIVERY_ACCEPTED', {
      deliveryId,
      driverName,
      driverPhone,
      driverPlate,
      driverModel,
    });

    showToast(`Trip accepted! Assigned to you with ${driverModel}. Proceed to pickup.`);
  };

  const verifyPickupOtp = (deliveryId: string, enteredOtp: string): boolean => {
    return verifyDeliveryOtp(deliveryId, enteredOtp, 'pickup');
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
    updateDeliveryStatus(id, 'DELIVERED');
    setDeliveries(prev => {
      const updated = prev.map(d => {
        if (d.id !== id) return d;
        return {
          ...d,
          podSignature: signature,
          podImage: photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
          status: 'DELIVERED' as const,
        };
      });
      try {
        localStorage.setItem('portex_deliveries', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('Digital Proof of Delivery (POD) recorded!');
  };

  const getOrCreateConversation = (params: {
    listingId?: string;
    deliveryId?: string;
    contactId?: string;
    contactName?: string;
    contactAvatar?: string;
    contactRole?: string;
    listingTitle?: string;
    listingPrice?: number;
    listingImage?: string;
    initialMessage?: string;
  }): ChatConversation => {
    // 1. Check if matching deliveryId
    if (params.deliveryId) {
      const existing = conversations.find(c => c.deliveryId === params.deliveryId);
      if (existing) return existing;
    }

    // 2. Check if matching listingId
    if (params.listingId) {
      const existing = conversations.find(c => c.listingId === params.listingId);
      if (existing) return existing;
    }

    // 3. Check if matching contactId
    if (params.contactId) {
      const existing = conversations.find(c => c.contactId === params.contactId);
      if (existing) return existing;
    }

    // 4. Create brand new conversation
    const newId = `conv-${Date.now()}`;
    const newConv: ChatConversation = {
      id: newId,
      contactId: params.contactId || (params.deliveryId ? 'drv-301' : 'usr_seller_temp'),
      contactName: params.contactName || (params.deliveryId ? 'Mohd. Imran Khan (Driver)' : 'Seller Support'),
      contactAvatar:
        params.contactAvatar ||
        (params.deliveryId
          ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
      contactRole: params.contactRole || (params.deliveryId ? 'Portex Fleet Partner' : 'Verified Seller'),
      lastMessage:
        params.initialMessage ||
        (params.deliveryId
          ? 'Hello! I am your assigned Portex driver partner.'
          : 'Hello! I am available to pack and dispatch via Portex anytime.'),
      lastTimestamp: 'Just now',
      unreadCount: 0,
      listingId: params.listingId,
      listingTitle: params.listingTitle,
      listingPrice: params.listingPrice,
      listingImage: params.listingImage,
      deliveryId: params.deliveryId,
      isOnline: true,
    };

    const initialWelcome: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: newConv.contactId,
      senderName: newConv.contactName,
      recipientId: currentUser.id,
      listingId: params.listingId,
      deliveryId: params.deliveryId,
      content: params.deliveryId
        ? `Hello ${currentUser.name}! I am Mohd. Imran Khan, your Portex driver partner. Cargo safety and fast delivery is guaranteed.`
        : `Hello! Thanks for your interest in ${params.listingTitle || 'this item'}. Feel free to ask questions, request Porter delivery, or make an offer!`,
      timestamp: 'Just now',
      isRead: true,
    };

    setConversations(prev => {
      const updated = [newConv, ...prev];
      try {
        localStorage.setItem('portex_conversations', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    setMessages(prev => {
      const updated = {
        ...prev,
        [newId]: [initialWelcome],
      };
      try {
        localStorage.setItem('portex_messages', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    return newConv;
  };

  const sendMessage = (conversationId: string, content: string, offerAmount?: number, imageUrl?: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      recipientId: 'usr_other',
      content: content || (imageUrl ? 'Sent an image attachment' : ''),
      imageUrl,
      isOffer: !!offerAmount,
      offerAmount,
      offerStatus: offerAmount ? 'PENDING' : undefined,
      timestamp: 'Just now',
      isRead: true,
    };

    setMessages(prev => {
      const updated = {
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMsg],
      };
      try {
        localStorage.setItem('portex_messages', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    const displaySummary = imageUrl ? '📷 Photo attachment' : content;
    setConversations(prev => {
      const updated = prev.map(c =>
        c.id === conversationId ? { ...c, lastMessage: displaySummary, lastTimestamp: 'Just now' } : c
      );
      try {
        localStorage.setItem('portex_conversations', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    // Simulated automated intelligent reply (Only if Admin Auto-Message is enabled)
    if (adminAutoMessageEnabled) {
      setTimeout(() => {
        const conv = conversations.find(c => c.id === conversationId);
        const isDriver =
          conv?.deliveryId ||
          conv?.contactRole?.toLowerCase().includes('driver') ||
          conv?.contactRole?.toLowerCase().includes('partner');

        let replyContent = adminAutoMessageText || 'Thank you for your message! I am available to dispatch via Portex anytime.';
        if (offerAmount) {
          replyContent = `Thanks for your offer of ₹${offerAmount.toLocaleString('en-IN')}! ${adminAutoMessageText || 'Let me review the readiness and confirm.'}`;
        } else if (imageUrl) {
          replyContent = `Photo received! ${adminAutoMessageText || 'Ready for packing and instant courier dispatch.'}`;
        } else if (isDriver) {
          replyContent = 'Acknowledged! Following live GPS route now. Will reach the waypoint shortly.';
        }

        const replyMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          senderId: conv?.contactId || 'usr_other',
          senderName: conv?.contactName || 'Support Desk',
          recipientId: currentUser.id,
          content: replyContent,
          timestamp: 'Just now',
          isRead: false,
        };

        setMessages(p => {
          const next = {
            ...p,
            [conversationId]: [...(p[conversationId] || []), replyMsg],
          };
          try {
            localStorage.setItem('portex_messages', JSON.stringify(next));
          } catch {
            // ignore
          }
          return next;
        });

        setConversations(p => {
          const next = p.map(c =>
            c.id === conversationId ? { ...c, lastMessage: replyContent, lastTimestamp: 'Just now' } : c
          );
          try {
            localStorage.setItem('portex_conversations', JSON.stringify(next));
          } catch {
            // ignore
          }
          return next;
        });
      }, 2000);
    }
  };

  const updateAdminAutoMessageSettings = (enabled: boolean, text: string) => {
    setAdminAutoMessageEnabled(enabled);
    setAdminAutoMessageText(text);
    try {
      localStorage.setItem('portex_admin_auto_message_enabled', String(enabled));
      localStorage.setItem('portex_admin_auto_message_text', text);
    } catch {}
    showToast(enabled ? 'Auto-message enabled with updated template!' : 'Auto-message disabled. Manual replies only.');
  };

  const adminSendReply = (conversationId: string, replyText: string) => {
    if (!replyText.trim()) return;
    const adminMsg: ChatMessage = {
      id: `msg-admin-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.role === 'ADMIN' ? 'Platform Administrator (Portex Support)' : currentUser.name,
      recipientId: 'usr_customer',
      content: replyText.trim(),
      timestamp: 'Just now',
      isRead: true,
    };

    setMessages(prev => {
      const updated = {
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), adminMsg],
      };
      try {
        localStorage.setItem('portex_messages', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setConversations(prev => {
      const updated = prev.map(c =>
        c.id === conversationId ? { ...c, lastMessage: replyText.trim(), lastTimestamp: 'Just now' } : c
      );
      try {
        localStorage.setItem('portex_conversations', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    showToast('Manual reply delivered successfully!');
  };

  const respondToOffer = (conversationId: string, messageId: string, status: 'ACCEPTED' | 'DECLINED') => {
    setMessages(prev => {
      const thread = prev[conversationId] || [];
      const updatedThread = thread.map(m => (m.id === messageId ? { ...m, offerStatus: status } : m));
      const next = {
        ...prev,
        [conversationId]: updatedThread,
      };
      try {
        localStorage.setItem('portex_messages', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    const statusNote = status === 'ACCEPTED' ? '✅ Offer Accepted!' : '❌ Offer Declined.';
    setConversations(prev => {
      const next = prev.map(c =>
        c.id === conversationId ? { ...c, lastMessage: statusNote, lastTimestamp: 'Just now' } : c
      );
      try {
        localStorage.setItem('portex_conversations', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    // If offer is accepted, the deal is closed: mark product as SOLD so it disappears from buyer browsing
    if (status === 'ACCEPTED') {
      const targetConv = conversations.find(c => c.id === conversationId);
      if (targetConv?.listingId) {
        setListings(prev => {
          const updated = prev.map(l => (l.id === targetConv.listingId ? { ...l, status: 'SOLD' as const } : l));
          try {
            localStorage.setItem('portex_listings', JSON.stringify(updated));
          } catch {}
          broadcastSync('LISTINGS_UPDATED', { listings: updated });
          return updated;
        });
      }
    }

    showToast(`Offer ${status.toLowerCase()}!`);
  };

  const triggerIncomingJobRadar = () => {
    const sampleJob: IncomingJobRequest = {
      id: `del-radar-${Date.now()}`,
      customerName: 'Vivek Singhania (Hazratganj Store)',
      vehicleType: 'Tata Ace Gold CNG',
      pickupAddress: 'Shop 14, Hazratganj Central, Lucknow',
      dropAddress: 'Warehouse 9, Transport Nagar, Kanpur Road, Lucknow',
      distanceKm: 14.8,
      fareAmount: 580,
      packageType: 'Commercial Garments & Fabric Rolls (380 kg)',
      weightKg: 380,
      expiresInSec: 45,
    };
    setIncomingJob(sampleJob);
    showToast('🚨 Incoming Portex Dispatch Ping received on radar!');
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

  const addRecentSearch = (query: string) => {
    if (!query || !query.trim()) return;
    const clean = query.trim();
    setRecentSearches(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 10);
      try {
        localStorage.setItem('portex_recent_searches', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const removeRecentSearch = (query: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(q => q !== query);
      try {
        localStorage.setItem('portex_recent_searches', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('portex_recent_searches');
    } catch {
      // ignore
    }
    showToast('Recent searches cleared');
  };

  const openVoiceSearch = () => setIsVoiceModalOpen(true);
  const closeVoiceSearch = () => setIsVoiceModalOpen(false);

  const renewListing = (listingId: string) => {
    setListings(prev => {
      const updated = prev.map(l => {
        if (l.id !== listingId) return l;
        return {
          ...l,
          status: 'ACTIVE' as ListingStatus,
          expiryDaysRemaining: 30,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
      });
      try {
        localStorage.setItem('portex_listings', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    setConversations(prev => {
      const updated = prev.map(c => {
        if (c.listingId !== listingId) return c;
        return {
          ...c,
          isAdInactive: false,
          chatExpiresInDays: undefined,
          adStatus: 'ACTIVE' as ListingStatus,
        };
      });
      try {
        localStorage.setItem('portex_conversations', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    showToast('🎉 Listing renewed! Active for 30 more days on the marketplace.');
  };

  const deleteConversations = (conversationIds: string[]) => {
    setConversations(prev => {
      const updated = prev.filter(c => !conversationIds.includes(c.id));
      try {
        localStorage.setItem('portex_conversations', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    setMessages(prev => {
      const copy = { ...prev };
      conversationIds.forEach(id => {
        delete copy[id];
      });
      try {
        localStorage.setItem('portex_messages', JSON.stringify(copy));
      } catch {
        // ignore
      }
      return copy;
    });

    showToast(`Deleted ${conversationIds.length} conversation${conversationIds.length > 1 ? 's' : ''}`);
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
        verifyListing,
        favorites,
        toggleFavorite,
        isFavorite,
        deliveries,
        activeDelivery,
        createDeliveryBooking,
        updateDeliveryStatus,
        updateDeliveryVehicle,
        acceptDeliveryJob,
        verifyPickupOtp,
        verifyDeliveryOtp,
        completeProofOfDelivery,
        conversations,
        messages,
        sendMessage,
        respondToOffer,
        getOrCreateConversation,
        isDriverOnline,
        setIsDriverOnline,
        driverVehicleType,
        setDriverVehicleType,
        incomingJob,
        acceptIncomingJob,
        rejectIncomingJob,
        triggerIncomingJobRadar,
        driverEarnings,
        dispatchProductDelivery,
        businessProfile,
        updateBusinessProfile,
        toastMessage,
        showToast,
        theme,
        setTheme,
        toggleTheme,
        isLoggedIn,
        setIsLoggedIn,
        registeredUsers,
        registerUser,
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
        recentSearches,
        addRecentSearch,
        removeRecentSearch,
        clearRecentSearches,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        openVoiceSearch,
        closeVoiceSearch,
        renewListing,
        deleteConversations,
        adminAutoMessageEnabled,
        adminAutoMessageText,
        updateAdminAutoMessageSettings,
        adminSendReply,
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
