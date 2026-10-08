export type PakistaniProvince =
  | 'Punjab'
  | 'Sindh'
  | 'Khyber Pakhtunkhwa'
  | 'Balochistan'
  | 'Islamabad Capital Territory'
  | 'Gilgit-Baltistan'
  | 'Azad Jammu & Kashmir';

export type ClothingCategory =
  | 'Ready to Wear'
  | 'Unstitched'
  | 'Luxury Pret'
  | 'Formal Wear'
  | 'Bridal / Wedding Edit'
  | 'Festive Collection'
  | 'Zarmeen Modest'
  | 'Sale';

export type ClothingCollection =
  | 'The Heritage Edit'
  | 'Summer Lawn'
  | 'Khaddar Stories'
  | 'Festive Edit'
  | 'Eid Collection'
  | 'Wedding Edit'
  | 'Luxury Pret'
  | 'New Arrivals'
  | 'Velvet Royal';

export type ClothingFabric =
  | 'Lawn'
  | 'Cotton'
  | 'Khaddar'
  | 'Linen'
  | 'Cambric'
  | 'Chiffon'
  | 'Silk'
  | 'Organza'
  | 'Velvet'
  | 'Raw Silk'
  | 'Jacquard'
  | 'Net';

export type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Custom' | 'Unstitched';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface SizeMeasurement {
  size: ClothingSize;
  bust: string;
  waist: string;
  hip: string;
  shoulder: string;
  sleeve: string;
  length: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ClothingCategory;
  collection: ClothingCollection;
  productType: 'Stitched' | 'Unstitched';
  fabric: ClothingFabric;
  pieces: '1 Piece' | '2 Piece' | '3 Piece';
  components: string[];
  description: string;
  price: number; // PKR
  salePrice?: number; // PKR
  stock: number;
  sizes: ClothingSize[];
  colors: ProductColor[];
  measurements?: SizeMeasurement[];
  careInstructions: string[];
  deliveryInfo: string;
  images: string[];
  videoUrl?: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  isSale: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  size: ClothingSize;
  color: string;
  quantity: number;
  unitPrice: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Address {
  id: string;
  isDefault: boolean;
  fullName: string;
  phone: string;
  streetAddress: string;
  area: string;
  city: string;
  province: PakistaniProvince;
  postalCode: string;
}

export interface OrderTrackingStep {
  status: OrderStatus;
  timestamp: string;
  note: string;
  completed: boolean;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type PaymentMethod = 'Cash on Delivery' | 'Bank Transfer' | 'Online Payment';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  image: string;
  fabric: string;
  size: ClothingSize;
  color: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    streetAddress: string;
    area: string;
    city: string;
    province: PakistaniProvince;
    postalCode: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
  trackingHistory: OrderTrackingStep[];
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
  verifiedPurchase: boolean;
}

export interface CustomerUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  joinedDate: string;
  isActive: boolean;
  addresses: Address[];
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  itemCount?: number;
}

export interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerImage: string;
  isActive: boolean;
  season?: string;
}

export interface HomepageBanner {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  linkCategory: string;
  image: string;
  isActive: boolean;
  order: number;
}

export interface WebsiteSettings {
  announcementBarText: string;
  announcementBarActive: boolean;
  freeShippingThreshold: number; // PKR
  standardShippingFee: number; // PKR
  deliveryEstimateText: string;
  heroHeading: string;
  heroTagline: string;
  heroDescription: string;
  heroImage: string;
  heroVideoUrl?: string;
  heroButtonText: string;
  heroSecondaryButtonText: string;
  bannerHeading: string;
  bannerSubheading: string;
  bannerImage: string;
  bannerButtonText: string;
  supportPhone: string;
  supportEmail: string;
  flagshipAddress: string;
}
