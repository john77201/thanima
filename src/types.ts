export type CategoryId =
  | 'snacks'
  | 'pickles'
  | 'spices'
  | 'breakfast'
  | 'sweets'
  | 'specialties'
  | 'rice-flours'
  | 'healthy';

export interface Category {
  id: CategoryId;
  name: string;
  malayalamName: string;
  slug: string;
  description: string;
  iconName: string;
  image: string;
  productCount?: number;
  subcategories: string[];
}

export interface ProductVariant {
  id: string;
  weight: string; // e.g. "250g", "500g", "1kg"
  price: number; // in INR
  mrp: number; // in INR
  stock: number;
  sku: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'rejected';
}

export interface Product {
  id: string;
  name: string;
  malayalamName: string;
  slug: string;
  categoryIds: CategoryId[]; // multiple categories support (e.g. Unniyappam in snacks & sweets)
  subcategory?: string;
  shortDescription: string;
  description: string;
  ingredients: string[];
  shelfLife: string; // e.g. "45 days"
  storageInstructions: string;
  isVeg: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  rating: number;
  reviewCount: number;
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  salesCount: number;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
  type: 'Home' | 'Work' | 'Other';
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type PaymentMethod = 'upi' | 'gpay' | 'phonepe' | 'card' | 'cod';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded' | 'COD-Pending';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  malayalamName: string;
  variantWeight: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string; // THN-YYYYMMDD-XXXX
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryCharge: number;
  codFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  orderStatus: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  courierName?: string;
  trackingId?: string;
  estimatedDeliveryDate?: string;
  createdAt: string;
  notes?: string;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'flat' | 'free_shipping';
  value: number; // percentage (e.g. 10) or flat amount (e.g. 50)
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  expiryDate: string;
  isActive: boolean;
  usageCount: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  malayalamTitle: string;
  tagline: string;
  buttonText: string;
  link: string;
  badge: string;
  bgColor: string;
  image: string;
  isActive: boolean;
}

export interface FAQ {
  id: string;
  category: 'Products' | 'Orders' | 'Payment' | 'Delivery' | 'Returns';
  question: string;
  answer: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'manager' | 'super_admin';
  addresses: Address[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}
