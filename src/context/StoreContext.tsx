import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Address,
  Banner,
  CartItem,
  Category,
  ContactMessage,
  Coupon,
  Notification,
  Order,
  OrderStatus,
  Product,
  Review,
  User,
} from '../types';
import {
  SEED_BANNERS,
  SEED_CATEGORIES,
  SEED_COUPONS,
  SEED_ORDERS,
  SEED_PRODUCTS,
  SEED_REVIEWS,
  SEED_USERS,
} from '../data/seedData';
import { generateOrderNumber } from '../utils/order';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  activeCoupon: Coupon | null;
  currentUser: User | null;
  reviews: Review[];
  banners: Banner[];
  notifications: Notification[];
  recentlyViewed: string[];
  contactMessages: ContactMessage[];
  newsletterSubscribers: string[];
  // Cart Actions
  addToCart: (productId: string, variantId?: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, variantId: string, quantity: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  clearCart: () => void;
  cartCount: number;
  // Coupon Actions
  applyCoupon: (code: string, subtotal: number) => { success: boolean; message: string };
  removeCoupon: () => void;
  availableCoupons: Coupon[];
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  // Order Actions
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'statusHistory'>) => Order;
  cancelOrder: (orderId: string) => { success: boolean; message: string };
  updateOrderStatus: (
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    courierName?: string,
    trackingId?: string
  ) => void;
  reorder: (orderId: string) => void;
  // Product Admin Actions
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  // Review Actions
  addReview: (productId: string, rating: number, comment: string, userName?: string) => void;
  approveReview: (reviewId: string) => void;
  rejectReview: (reviewId: string) => void;
  deleteReview: (reviewId: string) => void;
  // Banner Admin Actions
  updateBanners: (banners: Banner[]) => void;
  // Auth Actions
  login: (email: string, role?: 'customer' | 'super_admin') => boolean;
  logout: () => void;
  registerUser: (name: string, email: string, phone: string) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  // Other Actions
  recordRecentlyViewed: (productId: string) => void;
  subscribeNewsletter: (email: string) => { success: boolean; message: string };
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  unreadNotificationCount: number;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('thanima_products');
    return saved ? JSON.parse(saved) : SEED_PRODUCTS;
  });

  // Categories
  const [categories] = useState<Category[]>(SEED_CATEGORIES);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('thanima_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('thanima_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('thanima_orders');
    return saved ? JSON.parse(saved) : SEED_ORDERS;
  });

  // Active Coupon
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [availableCoupons] = useState<Coupon[]>(SEED_COUPONS);

  // Current User (default to demo customer)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('thanima_user');
    return saved ? JSON.parse(saved) : SEED_USERS[0];
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('thanima_reviews');
    return saved ? JSON.parse(saved) : SEED_REVIEWS;
  });

  // Banners
  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('thanima_banners');
    return saved ? JSON.parse(saved) : SEED_BANNERS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      title: 'Welcome to Thanima!',
      message: 'Use code WELCOME10 for 10% off on your first homemade order.',
      timestamp: 'Just now',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Order Shipped',
      message: 'Order THN-20261107-3921 has been dispatched via India Post Speed Post.',
      timestamp: '1 hour ago',
      read: false,
    },
  ]);

  // Recently Viewed
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const saved = localStorage.getItem('thanima_recent');
    return saved ? JSON.parse(saved) : ['p-banana-chips', 'p-mango-pickle', 'p-unniyappam'];
  });

  // Contact Messages
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  // Newsletter
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<string[]>([
    'anjali.m@example.com',
    'karthik.n@example.com',
  ]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('thanima_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('thanima_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('thanima_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('thanima_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('thanima_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('thanima_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('thanima_recent', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('thanima_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('thanima_user');
    }
  }, [currentUser]);

  // Cart actions
  const addToCart = (productId: string, variantId?: string, quantity = 1) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const vId = variantId || product.variants[0]?.id;
    if (!vId) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId && item.variantId === vId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId && item.variantId === vId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, variantId: vId, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variantId === variantId))
    );
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Coupon actions
  const applyCoupon = (code: string, subtotal: number) => {
    const formatted = code.trim().toUpperCase();
    const found = availableCoupons.find((c) => c.code === formatted && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (subtotal < found.minOrderValue) {
      return {
        success: false,
        message: `This coupon requires a minimum cart value of ₹${found.minOrderValue}.`,
      };
    }
    setActiveCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Order actions
  const placeOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'statusHistory'>): Order => {
    const orderId = generateOrderNumber();
    const now = new Date().toISOString();
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: now,
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
          note: 'Order placed by customer.',
        },
        ...(orderData.orderStatus !== 'Pending'
          ? [
              {
                status: orderData.orderStatus,
                timestamp: new Date().toLocaleString('en-IN', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                }),
                note: `Payment confirmed via ${orderData.paymentMethod.toUpperCase()}.`,
              },
            ]
          : []),
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Push in-app notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Order Confirmed! 🎉',
        message: `Your order #${orderId} for ₹${newOrder.total} is being prepared in our kitchen.`,
        timestamp: 'Just now',
        read: false,
        link: orderId,
      },
      ...prev,
    ]);

    // Clear cart on successful order
    clearCart();

    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };
    if (order.orderStatus !== 'Pending' && order.orderStatus !== 'Confirmed') {
      return {
        success: false,
        message: `Order cannot be cancelled in '${order.orderStatus}' status.`,
      };
    }

    const timestamp = new Date().toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: 'Cancelled',
              paymentStatus: o.paymentStatus === 'Paid' ? 'Refunded' : o.paymentStatus,
              statusHistory: [
                ...o.statusHistory,
                { status: 'Cancelled', timestamp, note: 'Cancelled by customer.' },
              ],
            }
          : o
      )
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Order Cancelled',
        message: `Order #${orderId} was cancelled successfully. Any payment made will be refunded within 24 hours.`,
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);

    return { success: true, message: 'Order cancelled successfully.' };
  };

  const updateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    courierName?: string,
    trackingId?: string
  ) => {
    const timestamp = new Date().toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          orderStatus: newStatus,
          courierName: courierName || o.courierName,
          trackingId: trackingId || o.trackingId,
          paymentStatus:
            newStatus === 'Delivered' && o.paymentStatus === 'COD-Pending'
              ? 'Paid'
              : o.paymentStatus,
          statusHistory: [
            ...o.statusHistory,
            {
              status: newStatus,
              timestamp,
              note: note || `Order updated to ${newStatus}.`,
            },
          ],
        };
      })
    );

    // Push notification to user
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Order Update: ${newStatus}`,
        message: `Order #${orderId} status changed to ${newStatus}.${
          trackingId ? ` Tracking ID: ${trackingId}` : ''
        }`,
        timestamp: 'Just now',
        read: false,
        link: orderId,
      },
      ...prev,
    ]);
  };

  const reorder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    order.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        const variant =
          product.variants.find((v) => v.weight === item.variantWeight) || product.variants[0];
        addToCart(product.id, variant?.id, item.quantity);
      }
    });
  };

  // Product Admin actions
  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Review actions
  const addReview = (productId: string, rating: number, comment: string, userName?: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userName: userName || currentUser?.name || 'Verified Customer',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
      status: 'approved',
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  const approveReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: 'approved' } : r))
    );
  };

  const rejectReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: 'rejected' } : r))
    );
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const updateBanners = (newBanners: Banner[]) => {
    setBanners(newBanners);
  };

  // Auth actions
  const login = (email: string, role: 'customer' | 'super_admin' = 'customer'): boolean => {
    const found = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    // Create new customer session
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      phone: '9847000000',
      role,
      addresses: [],
    };
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const registerUser = (name: string, email: string, phone: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role: 'customer',
      addresses: [],
    };
    setCurrentUser(newUser);
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    const newAddr: Address = {
      ...address,
      id: `addr-${Date.now()}`,
      isDefault: currentUser.addresses.length === 0 ? true : address.isDefault,
    };
    const updated = {
      ...currentUser,
      addresses: [...currentUser.addresses, newAddr],
    };
    setCurrentUser(updated);
  };

  const updateAddress = (address: Address) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      addresses: currentUser.addresses.map((a) => (a.id === address.id ? address : a)),
    };
    setCurrentUser(updated);
  };

  const deleteAddress = (id: string) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      addresses: currentUser.addresses.filter((a) => a.id !== id),
    };
    setCurrentUser(updated);
  };

  const setDefaultAddress = (id: string) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      addresses: currentUser.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    };
    setCurrentUser(updated);
  };

  // Recently viewed
  const recordRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  };

  // Newsletter
  const subscribeNewsletter = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (newsletterSubscribers.includes(trimmed)) {
      return { success: true, message: 'You are already subscribed to Thanima specials!' };
    }
    setNewsletterSubscribers((prev) => [...prev, trimmed]);
    return {
      success: true,
      message: 'Thank you for subscribing! Check your email for special welcome offers.',
    };
  };

  // Contact Message
  const submitContactMessage = (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setContactMessages((prev) => [newMsg, ...prev]);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        orders,
        activeCoupon,
        currentUser,
        reviews,
        banners,
        notifications,
        recentlyViewed,
        contactMessages,
        newsletterSubscribers,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        applyCoupon,
        removeCoupon,
        availableCoupons,
        toggleWishlist,
        isInWishlist,
        placeOrder,
        cancelOrder,
        updateOrderStatus,
        reorder,
        addProduct,
        updateProduct,
        deleteProduct,
        addReview,
        approveReview,
        rejectReview,
        deleteReview,
        updateBanners,
        login,
        logout,
        registerUser,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        recordRecentlyViewed,
        subscribeNewsletter,
        submitContactMessage,
        markNotificationRead,
        clearNotifications,
        unreadNotificationCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
