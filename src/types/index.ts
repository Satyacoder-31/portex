export type UserRole = 'BUYER' | 'SELLER' | 'DRIVER' | 'ADMIN' | 'ENTERPRISE';

export type ListingCondition = 'BRAND_NEW' | 'LIKE_NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR';

export type ListingStatus = 'ACTIVE' | 'RESERVED' | 'SOLD' | 'EXPIRED';

export type DeliveryVehicleType =
  | 'TWO_WHEELER'
  | 'THREE_WHEELER_AUTO'
  | 'TATA_ACE_MINI_TRUCK'
  | 'PICKUP_8FT'
  | 'TEMPO_CLOSED'
  | 'EICHER_14FT'
  | 'ELECTRIC_CARGO';

export type DeliveryStatusStage =
  | 'BOOKING_CREATED'
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_ARRIVING_PICKUP'
  | 'ITEM_PICKED_UP'
  | 'IN_TRANSIT'
  | 'NEAR_DESTINATION'
  | 'DELIVERED'
  | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  city: string;
  isVerified: boolean;
  rating: number;
  totalDeals: number;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  condition: ListingCondition;
  category: string;
  subCategory?: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerRating: number;
  sellerIsVerified: boolean;
  sellerPhone: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    lat: number;
    lng: number;
  };
  weightKg: number;
  dimensions: string; // e.g., "60x40x30 cm"
  status: ListingStatus;
  isFeatured?: boolean;
  createdAt: string;
  views: number;
  likes: number;
}

export interface VehicleOption {
  type: DeliveryVehicleType;
  name: string;
  category: 'two_wheeler' | 'three_wheeler' | 'truck' | 'electric';
  tagline: string;
  maxWeightKg: number;
  dimensions: string;
  baseFare: number;
  perKmRate: number;
  etaMins: number;
  iconName: string;
  badge?: string;
  suitableFor: string;
}

export interface DeliveryBooking {
  id: string;
  trackingNumber: string;
  listingId?: string;
  listingTitle?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverAvatar?: string;
  driverRating?: number;
  driverVehiclePlate?: string;
  driverVehicleModel?: string;
  driverCurrentLocation?: { lat: number; lng: number };
  vehicleType: DeliveryVehicleType;
  vehicleName: string;
  status: DeliveryStatusStage;
  pickup: {
    address: string;
    city: string;
    contactName: string;
    contactPhone: string;
    lat: number;
    lng: number;
    otp: string;
  };
  drop: {
    address: string;
    city: string;
    contactName: string;
    contactPhone: string;
    lat: number;
    lng: number;
    otp: string;
  };
  packageType: string;
  packageWeightKg: number;
  dimensions?: string;
  specialInstructions?: string;
  distanceKm: number;
  durationMins: number;
  pricing: {
    baseFare: number;
    distanceFare: number;
    weightSurcharge: number;
    gstAmount: number;
    discount: number;
    totalAmount: number;
  };
  paymentMethod: 'ONLINE_UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'CASH_ON_DELIVERY';
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  timeline: {
    stage: DeliveryStatusStage;
    title: string;
    time: string;
    completed: boolean;
    active: boolean;
  }[];
  podImage?: string;
  podSignature?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  listingId?: string;
  deliveryId?: string;
  content: string;
  imageUrl?: string;
  offerAmount?: number;
  isOffer?: boolean;
  offerStatus?: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COUNTERED';
  timestamp: string;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  contactRole: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  listingId?: string;
  listingTitle?: string;
  listingPrice?: number;
  listingImage?: string;
  deliveryId?: string;
  isOnline: boolean;
}

export interface BusinessProfile {
  legalName: string;
  tradeName: string;
  gstin: string;
  constitution: string;
  principalAddress: string;
  jurisdiction: string;
  dateOfIssue: string;
  supportEmail: string;
  supportPhone: string;
  platformFeePercent: number;
  deliveryCommissionPercent: number;
  taxRatePercent: number;
}
