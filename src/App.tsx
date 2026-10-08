import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { QuickViewModal } from './components/QuickViewModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CheckoutView } from './views/CheckoutView';
import { OrderConfirmationView } from './views/OrderConfirmationView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { CustomerAccountView } from './views/CustomerAccountView';
import { InformationalViews } from './views/InformationalViews';
import { AdminDashboardView } from './views/AdminDashboardView';
import { Toast } from './components/Toast';

const AppContent: React.FC = () => {
  const { currentView, isAdminMode } = useShop();

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [sizeGuideModalOpen, setSizeGuideModalOpen] = useState(false);

  // If in admin mode, show the full admin dashboard
  if (isAdminMode || currentView === 'admin') {
    return (
      <>
        <AdminDashboardView />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#221F1F]">
      {/* Primary Sticky Header */}
      <Header
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'shop' && <ShopView />}
        {currentView === 'product-detail' && (
          <ProductDetailView onOpenSizeGuide={() => setSizeGuideModalOpen(true)} />
        )}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'order-confirmation' && <OrderConfirmationView />}
        {currentView === 'order-tracking' && <OrderTrackingView />}
        {currentView === 'account' && <CustomerAccountView />}
        {currentView === 'wishlist' && <CustomerAccountView />}
        {currentView === 'about' && <InformationalViews pageType="about" />}
        {currentView === 'contact' && <InformationalViews pageType="contact" />}
        {currentView === 'size-guide' && <InformationalViews pageType="size-guide" />}
        {currentView === 'shipping' && <InformationalViews pageType="shipping" />}
        {currentView === 'returns' && <InformationalViews pageType="returns" />}
        {currentView === 'faq' && <InformationalViews pageType="faq" />}
        {currentView === 'privacy' && <InformationalViews pageType="privacy" />}
        {currentView === 'terms' && <InformationalViews pageType="terms" />}
      </main>

      {/* Global Luxury Footer */}
      <Footer />

      {/* Slide-over Cart Bag Drawer */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />

      {/* Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />

      {/* Quick View Modal */}
      <QuickViewModal />

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={sizeGuideModalOpen} onClose={() => setSizeGuideModalOpen(false)} />

      {/* Global Floating Toast Feedback */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
