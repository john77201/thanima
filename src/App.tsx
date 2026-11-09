import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { HomeView } from './components/home/HomeView';
import { ShopView } from './components/shop/ShopView';
import { ProductDetailsModal } from './components/product/ProductDetailsModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTrackingModal } from './components/orders/OrderTrackingModal';
import { MyOrdersView } from './components/orders/MyOrdersView';
import { MyAccountView } from './components/account/MyAccountView';
import { WishlistView } from './components/wishlist/WishlistView';
import { AboutView } from './components/pages/AboutView';
import { ContactView } from './components/pages/ContactView';
import { FaqView } from './components/pages/FaqView';
import { TrackOrderView } from './components/pages/TrackOrderView';
import { PolicyView } from './components/pages/PolicyView';
import { AdminPortal } from './components/admin/AdminPortal';
import { DeploymentInspector } from './components/deployment/DeploymentInspector';
import { AuthModal } from './components/account/AuthModal';
import { CategoryId, Order, Product } from './types';

export function AppContent() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParam, setViewParam] = useState<string | undefined>(undefined);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directBuyItem, setDirectBuyItem] = useState<{
    product: Product;
    variantId: string;
    quantity: number;
  } | null>(null);

  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, viewParam]);

  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    setViewParam(param);
  };

  const handleBuyNow = (product: Product, variantId: string, quantity = 1) => {
    setDirectBuyItem({ product, variantId, quantity });
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setActiveTrackingOrder(order);
  };

  // If in Admin View, render full Admin Portal
  if (currentView === 'admin') {
    return <AdminPortal onExitAdmin={() => setCurrentView('home')} />;
  }

  // If in Deployment Inspector View, render full inspector
  if (currentView === 'deployment') {
    return <DeploymentInspector onBackToStore={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-[#4A2C17] pb-16 md:pb-0">
      {/* Header */}
      <Header
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {currentView === 'shop' && (
          <ShopView
            initialCategory="all"
            searchFilter={viewParam?.startsWith('search:') ? viewParam.replace('search:', '') : ''}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onNavigateCategory={(catId) => handleNavigate('category', catId)}
          />
        )}

        {currentView === 'category' && (
          <ShopView
            initialCategory={(viewParam as CategoryId) || 'snacks'}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onNavigateCategory={(catId) => handleNavigate('category', catId)}
          />
        )}

        {currentView === 'product' && (
          <ShopView
            initialCategory="all"
            onSelectProduct={(p) => setSelectedProduct(p)}
            onNavigateCategory={(catId) => handleNavigate('category', catId)}
          />
        )}

        {currentView === 'my-orders' && (
          <MyOrdersView onContinueShopping={() => handleNavigate('shop')} />
        )}

        {currentView === 'my-account' && (
          <MyAccountView onNavigateOrders={() => handleNavigate('my-orders')} />
        )}

        {currentView === 'wishlist' && (
          <WishlistView
            onSelectProduct={(p) => setSelectedProduct(p)}
            onContinueShopping={() => handleNavigate('shop')}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentView === 'about' && <AboutView />}

        {currentView === 'contact' && <ContactView />}

        {currentView === 'faq' && <FaqView />}

        {currentView === 'track-order' && <TrackOrderView />}

        {currentView === 'privacy' && <PolicyView type="privacy" />}
        {currentView === 'terms' && <PolicyView type="terms" />}
        {currentView === 'shipping-policy' && <PolicyView type="shipping" />}
        {currentView === 'refund-policy' && <PolicyView type="refund" />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setDirectBuyItem(null);
          setIsCheckoutOpen(true);
        }}
        onContinueShopping={() => handleNavigate('shop')}
      />

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={(prod, variantId, qty) => handleBuyNow(prod, variantId, qty)}
        onSelectRelated={(p) => setSelectedProduct(p)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
        directBuyItem={directBuyItem}
      />

      {activeTrackingOrder && (
        <OrderTrackingModal
          order={activeTrackingOrder}
          onClose={() => setActiveTrackingOrder(null)}
          onReorder={(id) => {
            setActiveTrackingOrder(null);
            setIsCartOpen(true);
          }}
        />
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
