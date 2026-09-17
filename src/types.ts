export type OrderStatus = 'Pending' | 'Confirmed' | 'Dispatched' | 'On The Way' | 'Delivered' | 'Cancelled';

export interface LadiesSuitInfo {
  shirt?: string;
  dupatta?: string;
  trouser?: string;
  fabricType?: string;
  embroideryDetails?: string;
}

export interface Product {
  id: string;
  code?: string; // Optional custom code
  inventory?: number; // Number of unstitched suit pieces/cut inventory available
  name: string;
  shortDetails: string;
  description: string;
  price: number; // in PKR
  images: string[];
  category: string;
  collectionId: string;
  collectionIds?: string[];
  categories?: string[];
  specifications: Record<string, string>;
  isLadiesSuit?: boolean;
  ladiesSuitInfo?: LadiesSuitInfo;
  isNewArrival: boolean;
  isHotSelling: boolean;
  rating: number;
  isOnSale?: boolean;
  originalPrice?: number;
  promoTag?: string;
  relatedType?: 'auto' | 'custom';
  customRelatedIds?: string[];
}

export interface Collection {
  id: string;
  name: string;
  image: string;
  banner: string;
  description: string;
  isGents?: boolean;
  showInNavbar?: boolean;
  linkedCategoryIds?: string[];
  showProductsOnHomepage?: boolean;
  homepageLayoutStyle?: 'grid' | 'carousel';
  isCombine?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selectedImage: string;
}

export interface Order {
  id: string;
  customerName: string;
  whatsappNumber?: string;
  phoneNumber: string;
  city: string;
  province: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharges: number;
  total: number;
  paymentMethod: 'cod' | 'advance';
  paymentStatus: 'pending' | 'paid' | 'failed';
  advanceProvider?: 'jazzcash' | 'easypaisa';
  paymentReceiptImage?: string;
  status: OrderStatus;
  createdAt: string; // ISO string
  isReceived?: boolean;
  couponCode?: string;
  couponDiscount?: number;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  approved: boolean; // Reviews first go to admin approval
  createdAt: string;
}

export interface Subscription {
  id: string;
  customerName: string;
  email: string;
  createdAt: string;
}

export interface HomeBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  image: string;
  targetView: 'home' | 'collection' | 'category' | 'product';
  targetPayload: string;
  badge: string;
  isActive: boolean;
  order: number;
}

export interface NewsletterNotification {
  id: string;
  productName: string;
  productImage: string;
  sentAt: string;
  recipientsCount: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  isGents: boolean;
  showInNavbar?: boolean;
  showProductsOnHomepage?: boolean;
}

export interface MarketingSettings {
  id: string;
  pixelId: string;
  enabled: boolean;
  updatedAt?: string;
}

export interface SeoSettings {
  id: string;
  title: string;
  description: string;
  keywords: string;
  updatedAt?: string;
}

export interface Coupon {
  id: string; // the coupon code (e.g. SUMMER300)
  discountType: 'flat' | 'percentage';
  discountValue: number;
  applyTo: 'all' | 'specific';
  productIds: string[]; // specific product ids
  active: boolean;
  createdAt: string;
  activationDate?: string;
  expiryDate?: string;
}

