import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  Coupon,
  ProductReview,
  WebsiteSettings,
  CustomerUser,
  ClothingSize,
  OrderStatus,
  PaymentStatus,
  Address,
  CategoryItem,
  CollectionItem,
  HomepageBanner,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_CUSTOMER,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_WEBSITE_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_COLLECTIONS,
  INITIAL_BANNERS,
} from '../data/initialData';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ShopContextType {
  // Navigation & View state
  currentView: string;
  selectedProductId: string | null;
  selectedCategory: string | null;
  selectedCollection: string | null;
  activeOrderNumber: string | null;
  activeOrder: Order | null;
  searchQuery: string;
  isQuickViewOpen: boolean;
  quickViewProduct: Product | null;
  isAdminMode: boolean;
  adminTab: string;

  // Actions for Navigation
  navigateTo: (
    view: string,
    params?: {
      productId?: string;
      category?: string;
      collection?: string;
      orderNumber?: string;
    }
  ) => void;
  setSearchQuery: (query: string) => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  toggleAdminMode: () => void;
  setAdminTab: (tab: string) => void;

  // Store data
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  reviews: ProductReview[];
  settings: WebsiteSettings;
  customerUser: CustomerUser | null;
  customers: CustomerUser[];
  categories: CategoryItem[];
  collections: CollectionItem[];
  banners: HomepageBanner[];

  // Toast
  toast: ToastNotification | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Cart & Wishlist
  cart: CartItem[];
  wishlist: string[];
  appliedCoupon: Coupon | null;
  couponError: string | null;
  cartSubtotal: number;
  discountAmount: number;
  shippingFee: number;
  cartGrandTotal: number;

  addToCart: (product: Product, size: ClothingSize, color: string, quantity?: number) => boolean;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  applyCouponCode: (code: string) => boolean;
  removeCoupon: () => void;

  // Order Placement & Tracking
  placeOrder: (orderPayload: {
    fullName: string;
    email: string;
    phone: string;
    streetAddress: string;
    area: string;
    city: string;
    province: any;
    postalCode: string;
    paymentMethod: any;
    notes?: string;
  }) => Order | null;
  trackOrder: (orderNumber: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  cancelOrder: (orderId: string, reason?: string) => void;

  // Admin Product Operations (Add, Edit, Delete, Toggle Active)
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  toggleProductActive: (productId: string) => void;

  // Admin Category Operations
  addCategory: (category: CategoryItem) => void;
  updateCategory: (category: CategoryItem) => void;
  deleteCategory: (categoryId: string) => void;
  toggleCategoryActive: (categoryId: string) => void;

  // Admin Collection Operations
  addCollection: (collection: CollectionItem) => void;
  updateCollection: (collection: CollectionItem) => void;
  deleteCollection: (collectionId: string) => void;
  toggleCollectionActive: (collectionId: string) => void;

  // Admin Banner Operations
  addBanner: (banner: HomepageBanner) => void;
  updateBanner: (banner: HomepageBanner) => void;
  deleteBanner: (bannerId: string) => void;
  toggleBannerActive: (bannerId: string) => void;

  // Admin Customer Operations
  toggleCustomerActive: (customerId: string) => void;

  // Admin Coupon Operations
  saveCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponId: string) => void;
  toggleCouponActive: (couponId: string) => void;

  // Review Operations
  addReview: (reviewData: {
    productId: string;
    productName: string;
    customerName: string;
    customerEmail: string;
    rating: number;
    title: string;
    comment: string;
  }) => void;
  updateReviewStatus: (reviewId: string, status: 'approved' | 'rejected') => void;
  deleteReview: (reviewId: string) => void;

  // Settings & Customer
  updateSettings: (newSettings: Partial<WebsiteSettings>) => void;
  updateCustomerProfile: (profile: Partial<CustomerUser>) => void;
  addCustomerAddress: (address: Omit<Address, 'id'>) => void;
  deleteCustomerAddress: (addressId: string) => void;

  // Utility
  formatPKR: (amount: number) => string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const formatPKR = (amount: number): string => {
  return `PKR ${Math.round(amount).toLocaleString('en-PK')}`;
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & UI state
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [activeOrderNumber, setActiveOrderNumber] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<string>('overview');

  // Toast notification state
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3800);
  };

  // Persistence backed by LocalStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('zarmeen_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    const saved = localStorage.getItem('zarmeen_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [collections, setCollections] = useState<CollectionItem[]>(() => {
    const saved = localStorage.getItem('zarmeen_collections');
    return saved ? JSON.parse(saved) : INITIAL_COLLECTIONS;
  });

  const [banners, setBanners] = useState<HomepageBanner[]>(() => {
    const saved = localStorage.getItem('zarmeen_banners');
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('zarmeen_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('zarmeen_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const saved = localStorage.getItem('zarmeen_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [settings, setSettings] = useState<WebsiteSettings>(() => {
    const saved = localStorage.getItem('zarmeen_settings');
    return saved ? JSON.parse(saved) : INITIAL_WEBSITE_SETTINGS;
  });

  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem('zarmeen_customer');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER;
  });

  const [customers, setCustomers] = useState<CustomerUser[]>(() => {
    const saved = localStorage.getItem('zarmeen_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('zarmeen_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('zarmeen_wishlist');
    return saved ? JSON.parse(saved) : ['zrm-prod-02', 'zrm-prod-03'];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('zarmeen_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('zarmeen_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('zarmeen_collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('zarmeen_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('zarmeen_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('zarmeen_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('zarmeen_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('zarmeen_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (customerUser) {
      localStorage.setItem('zarmeen_customer', JSON.stringify(customerUser));
    }
  }, [customerUser]);

  useEffect(() => {
    localStorage.setItem('zarmeen_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('zarmeen_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('zarmeen_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Calculations for Cart
  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.type === 'percentage') {
      const calculated = (cartSubtotal * appliedCoupon.discountValue) / 100;
      discountAmount = appliedCoupon.maxDiscount ? Math.min(calculated, appliedCoupon.maxDiscount) : calculated;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const shippingFee =
    cartSubtotal === 0 || cartSubtotal >= settings.freeShippingThreshold ? 0 : settings.standardShippingFee;

  const cartGrandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  // Navigation controller
  const navigateTo = (
    view: string,
    params?: {
      productId?: string;
      category?: string;
      collection?: string;
      orderNumber?: string;
    }
  ) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
    if (params?.productId) setSelectedProductId(params.productId);
    if (params?.category !== undefined) setSelectedCategory(params.category);
    if (params?.collection !== undefined) setSelectedCollection(params.collection);
    if (params?.orderNumber) setActiveOrderNumber(params.orderNumber);
    if (view !== 'admin') setIsAdminMode(false);
  };

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  const toggleAdminMode = () => {
    setIsAdminMode((prev) => {
      const next = !prev;
      if (next) {
        setCurrentView('admin');
      } else {
        setCurrentView('home');
      }
      return next;
    });
  };

  // Cart operations
  const addToCart = (product: Product, size: ClothingSize, color: string, quantity = 1): boolean => {
    if (product.stock <= 0) return false;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.size === size && item.color === color
      );

      const price = product.salePrice ?? product.price;

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          updated[existingIndex].quantity = product.stock;
        } else {
          updated[existingIndex].quantity = newQty;
        }
        return updated;
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        product,
        size,
        color,
        quantity: Math.min(quantity, product.stock),
        unitPrice: price,
      };
      return [...prev, newItem];
    });

    showToast(`Added ${product.name} to shopping bag`, 'success');
    return true;
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const max = item.product.stock;
          return { ...item, quantity: Math.min(quantity, max) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed article from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      }
      showToast('Article saved to your wishlist', 'success');
      return [...prev, productId];
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupon handling
  const applyCouponCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      setCouponError('Invalid coupon code or expired promotional voucher.');
      return false;
    }

    if (cartSubtotal < found.minOrderValue) {
      setCouponError(`This code requires a minimum order of ${formatPKR(found.minOrderValue)}.`);
      return false;
    }

    setAppliedCoupon(found);
    setCouponError(null);
    showToast(`Coupon ${found.code} applied successfully!`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    showToast('Coupon removed', 'info');
  };

  // Order Placement
  const placeOrder = (orderPayload: {
    fullName: string;
    email: string;
    phone: string;
    streetAddress: string;
    area: string;
    city: string;
    province: any;
    postalCode: string;
    paymentMethod: any;
    notes?: string;
  }): Order | null => {
    if (cart.length === 0) return null;

    const orderNum = `ZRM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: orderPayload.fullName,
        email: orderPayload.email,
        phone: orderPayload.phone,
        streetAddress: orderPayload.streetAddress,
        area: orderPayload.area,
        city: orderPayload.city,
        province: orderPayload.province,
        postalCode: orderPayload.postalCode,
      },
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        sku: item.product.sku,
        image: item.product.images[0] || '',
        fabric: item.product.fabric,
        size: item.size,
        color: item.color,
        price: item.unitPrice,
        quantity: item.quantity,
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
      couponCode: appliedCoupon?.code,
      shippingFee,
      grandTotal: cartGrandTotal,
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus: orderPayload.paymentMethod === 'Online Payment' ? 'Paid' : 'Pending',
      orderStatus: 'Order Placed',
      notes: orderPayload.notes,
      trackingHistory: [
        {
          status: 'Order Placed',
          timestamp: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          note: `Order placed via ${orderPayload.paymentMethod}. Order confirmation sent.`,
          completed: true,
        },
      ],
    };

    // Deduct stock for purchased items
    setProducts((prev) =>
      prev.map((p) => {
        const purchasedItem = cart.find((c) => c.productId === p.id);
        if (purchasedItem) {
          const updatedStock = Math.max(0, p.stock - purchasedItem.quantity);
          return { ...p, stock: updatedStock };
        }
        return p;
      })
    );

    // Update coupon usage if applicable
    if (appliedCoupon) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === appliedCoupon.id ? { ...c, usedCount: c.usedCount + 1 } : c))
      );
    }

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveOrderNumber(orderNum);
    showToast(`Order ${orderNum} confirmed successfully!`, 'success');

    return newOrder;
  };

  const trackOrder = (orderNumber: string): Order | undefined => {
    return orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase() ||
        o.id.toLowerCase() === orderNumber.trim().toLowerCase()
    );
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.orderNumber === orderId) {
          const timestamp = new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          // If transitioning to cancelled/returned, restore inventory
          if (
            (status === 'Cancelled' || status === 'Returned') &&
            ord.orderStatus !== 'Cancelled' &&
            ord.orderStatus !== 'Returned'
          ) {
            setProducts((prodPrev) =>
              prodPrev.map((p) => {
                const matched = ord.items.find((item) => item.productId === p.id);
                if (matched) {
                  return { ...p, stock: p.stock + matched.quantity };
                }
                return p;
              })
            );
          }

          const existingHistory = ord.trackingHistory || [];
          const updatedHistory = [
            ...existingHistory,
            {
              status,
              timestamp,
              note: note || `Status updated to ${status}`,
              completed: true,
            },
          ];

          return {
            ...ord,
            orderStatus: status,
            trackingHistory: updatedHistory,
          };
        }
        return ord;
      })
    );
    showToast(`Order status updated to "${status}"`, 'success');
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId || ord.orderNumber === orderId ? { ...ord, paymentStatus: status } : ord))
    );
    showToast(`Payment marked as ${status}`, 'success');
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    updateOrderStatus(orderId, 'Cancelled', reason ? `Cancelled: ${reason}` : 'Cancelled by store admin');
  };

  // Product Admin (Add, Edit, Delete, Toggle Active)
  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Garment "${newProduct.name}" added to catalog!`, 'success');
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    // If updated product is in cart, update cart item details as well
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === updatedProduct.id) {
          const price = updatedProduct.salePrice ?? updatedProduct.price;
          return { ...item, product: updatedProduct, unitPrice: price };
        }
        return item;
      })
    );
    showToast(`Garment "${updatedProduct.name}" updated successfully!`, 'success');
  };

  const deleteProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    setWishlist((prev) => prev.filter((id) => id !== productId));
    showToast(`Removed "${prod?.name || 'Garment'}" from catalog`, 'info');
  };

  const toggleProductActive = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextState = !p.isActive;
          showToast(`Product "${p.name}" is now ${nextState ? 'Active (Visible)' : 'Draft (Hidden)'}`, 'info');
          return { ...p, isActive: nextState };
        }
        return p;
      })
    );
  };

  // Category Admin
  const addCategory = (category: CategoryItem) => {
    setCategories((prev) => [category, ...prev]);
    showToast(`Category "${category.name}" added`, 'success');
  };

  const updateCategory = (category: CategoryItem) => {
    setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)));
    showToast(`Category "${category.name}" updated`, 'success');
  };

  const deleteCategory = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    showToast(`Category "${cat?.name || ''}" removed`, 'info');
  };

  const toggleCategoryActive = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Collection Admin
  const addCollection = (collection: CollectionItem) => {
    setCollections((prev) => [collection, ...prev]);
    showToast(`Collection "${collection.name}" added`, 'success');
  };

  const updateCollection = (collection: CollectionItem) => {
    setCollections((prev) => prev.map((c) => (c.id === collection.id ? collection : c)));
    showToast(`Collection "${collection.name}" updated`, 'success');
  };

  const deleteCollection = (collectionId: string) => {
    const col = collections.find((c) => c.id === collectionId);
    setCollections((prev) => prev.filter((c) => c.id !== collectionId));
    showToast(`Collection "${col?.name || ''}" removed`, 'info');
  };

  const toggleCollectionActive = (collectionId: string) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === collectionId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Banner Admin
  const addBanner = (banner: HomepageBanner) => {
    setBanners((prev) => [...prev, banner]);
    showToast(`Homepage Banner "${banner.title}" created`, 'success');
  };

  const updateBanner = (banner: HomepageBanner) => {
    setBanners((prev) => prev.map((b) => (b.id === banner.id ? banner : b)));
    showToast(`Homepage Banner updated`, 'success');
  };

  const deleteBanner = (bannerId: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== bannerId));
    showToast(`Banner removed`, 'info');
  };

  const toggleBannerActive = (bannerId: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === bannerId ? { ...b, isActive: !b.isActive } : b))
    );
  };

  // Customer Admin
  const toggleCustomerActive = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const next = !c.isActive;
          showToast(`Customer "${c.fullName}" account ${next ? 'Activated' : 'Deactivated'}`, 'info');
          return { ...c, isActive: next };
        }
        return c;
      })
    );
  };

  // Coupon Admin
  const saveCoupon = (coupon: Coupon) => {
    setCoupons((prev) => {
      const exists = prev.some((c) => c.id === coupon.id);
      if (exists) {
        return prev.map((c) => (c.id === coupon.id ? coupon : c));
      }
      return [coupon, ...prev];
    });
    showToast(`Coupon "${coupon.code}" saved successfully`, 'success');
  };

  const deleteCoupon = (couponId: string) => {
    const cpn = coupons.find((c) => c.id === couponId);
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    if (appliedCoupon?.id === couponId) {
      removeCoupon();
    }
    showToast(`Coupon "${cpn?.code || ''}" deleted`, 'info');
  };

  const toggleCouponActive = (couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Reviews
  const addReview = (reviewData: {
    productId: string;
    productName: string;
    customerName: string;
    customerEmail: string;
    rating: number;
    title: string;
    comment: string;
  }) => {
    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      ...reviewData,
      date: new Date().toISOString().split('T')[0],
      status: 'approved',
      verifiedPurchase: true,
    };
    setReviews((prev) => [newRev, ...prev]);

    // Update product rating and review count
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === reviewData.productId) {
          const prodReviews = reviews.filter((r) => r.productId === p.id && r.status === 'approved');
          const allRatings = [...prodReviews.map((r) => r.rating), reviewData.rating];
          const avg = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
          return {
            ...p,
            rating: Math.round(avg * 10) / 10,
            reviewCount: p.reviewCount + 1,
          };
        }
        return p;
      })
    );
    showToast('Your verified review has been published!', 'success');
  };

  const updateReviewStatus = (reviewId: string, status: 'approved' | 'rejected') => {
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, status } : r)));
    showToast(`Review marked as ${status}`, 'info');
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    showToast('Review removed', 'info');
  };

  // Settings & Customer
  const updateSettings = (newSettings: Partial<WebsiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Website and shipping settings saved!', 'success');
  };

  const updateCustomerProfile = (profile: Partial<CustomerUser>) => {
    if (customerUser) {
      setCustomerUser({ ...customerUser, ...profile });
      showToast('Profile updated', 'success');
    }
  };

  const addCustomerAddress = (addressData: Omit<Address, 'id'>) => {
    if (!customerUser) return;
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      ...addressData,
    };
    let updatedAddresses = [...customerUser.addresses];
    if (newAddr.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(newAddr);
    setCustomerUser({ ...customerUser, addresses: updatedAddresses });
    showToast('Delivery address saved', 'success');
  };

  const deleteCustomerAddress = (addressId: string) => {
    if (!customerUser) return;
    const updated = customerUser.addresses.filter((a) => a.id !== addressId);
    setCustomerUser({ ...customerUser, addresses: updated });
    showToast('Address removed', 'info');
  };

  const activeOrder = orders.find((o) => o.orderNumber === activeOrderNumber) || null;

  return (
    <ShopContext.Provider
      value={{
        currentView,
        selectedProductId,
        selectedCategory,
        selectedCollection,
        activeOrderNumber,
        activeOrder,
        searchQuery,
        isQuickViewOpen,
        quickViewProduct,
        isAdminMode,
        adminTab,
        navigateTo,
        setSearchQuery,
        openQuickView,
        closeQuickView,
        toggleAdminMode,
        setAdminTab,
        products,
        orders,
        coupons,
        reviews,
        settings,
        customerUser,
        customers,
        categories,
        collections,
        banners,
        toast,
        showToast,
        cart,
        wishlist,
        appliedCoupon,
        couponError,
        cartSubtotal,
        discountAmount,
        shippingFee,
        cartGrandTotal,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCouponCode,
        removeCoupon,
        placeOrder,
        trackOrder,
        updateOrderStatus,
        updatePaymentStatus,
        cancelOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
        addCategory,
        updateCategory,
        deleteCategory,
        toggleCategoryActive,
        addCollection,
        updateCollection,
        deleteCollection,
        toggleCollectionActive,
        addBanner,
        updateBanner,
        deleteBanner,
        toggleBannerActive,
        toggleCustomerActive,
        saveCoupon,
        deleteCoupon,
        toggleCouponActive,
        addReview,
        updateReviewStatus,
        deleteReview,
        updateSettings,
        updateCustomerProfile,
        addCustomerAddress,
        deleteCustomerAddress,
        formatPKR,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
