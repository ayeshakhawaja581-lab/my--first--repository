import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, onOpenSearch }) => {
  const {
    currentView,
    navigateTo,
    cart,
    wishlist,
    settings,
    isAdminMode,
    toggleAdminMode,
    customerUser,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsDropdown, setCollectionsDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { label: 'Home', view: 'home' },
    { label: 'New Arrivals', view: 'shop', category: undefined, collection: 'New Arrivals' },
    { label: 'Ready to Wear', view: 'shop', category: 'Ready to Wear' },
    { label: 'Unstitched', view: 'shop', category: 'Unstitched' },
    { label: 'Luxury Pret', view: 'shop', category: 'Luxury Pret' },
    { label: 'Formal Wear', view: 'shop', category: 'Formal Wear' },
    { label: 'Bridal Edit', view: 'shop', category: 'Bridal / Wedding Edit' },
    { label: 'Zarmeen Modest', view: 'shop', category: 'Zarmeen Modest' },
    { label: 'Sale', view: 'shop', category: 'Sale' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md transition-all duration-300">
      {/* Announcement Bar */}
      {settings.announcementBarActive && (
        <div className="bg-[#6B1820] text-[#F5EBE1] px-4 py-2 text-xs tracking-wider font-medium text-center flex items-center justify-center gap-2 border-b border-[#521217]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D6B57E] animate-pulse"></span>
          <span>{settings.announcementBarText}</span>
          <span className="hidden md:inline text-[#D6B57E] font-semibold ml-2">PKR Standard COD Available</span>
        </div>
      )}

      {/* Admin Mode Switch Banner */}
      <div className="bg-[#1C1A1A] text-white px-4 py-1.5 text-xs flex justify-between items-center border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-stone-300 tracking-wide">
            Live Pakistani Fashion Storefront &amp; Unified Admin
          </span>
        </div>
        <button
          onClick={toggleAdminMode}
          className="flex items-center gap-1.5 bg-[#8A1C24] hover:bg-[#A3232D] text-white px-3.5 py-1.5 rounded-xs text-xs font-semibold tracking-wider transition-all cursor-pointer shadow-xs"
        >
          <SlidersHorizontal size={13} />
          {isAdminMode ? '← Return to Customer Boutique' : 'Admin Panel: Add / Remove / Edit Clothes'}
        </button>
      </div>

      {/* Main Header Container */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
        <div className="flex items-center justify-between">
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-stone-800 hover:text-[#6B1820] transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu size={24} />
            </button>
            <button
              onClick={onOpenSearch}
              className="p-1.5 text-stone-800 hover:text-[#6B1820] transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </div>

          {/* Left spacer for desktop balance */}
          <div className="hidden lg:flex items-center gap-4 text-xs tracking-widest text-stone-600 font-medium uppercase">
            <span className="text-[#8A1C24] font-semibold">Lahore</span>
            <span className="text-stone-300">|</span>
            <span>Karachi</span>
            <span className="text-stone-300">|</span>
            <span>Islamabad</span>
          </div>

          {/* Center Brand Identity */}
          <div className="text-center cursor-pointer" onClick={() => navigateTo('home')}>
            <span className="block font-heading text-2xl sm:text-3xl md:text-4xl tracking-[0.22em] text-[#1C1A1A] font-normal hover:text-[#6B1820] transition-colors">
              ZARMEEN
            </span>
            <span className="block text-[10px] md:text-[11px] tracking-[0.35em] text-[#8C7654] uppercase font-medium mt-0.5">
              Wear Your Heritage
            </span>
          </div>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onOpenSearch}
              className="hidden lg:flex items-center gap-2 text-xs tracking-wider text-stone-700 hover:text-[#6B1820] px-2 py-1 transition-colors"
              aria-label="Search Catalog"
            >
              <Search size={18} />
              <span className="hidden xl:inline text-stone-500">Search...</span>
            </button>

            {/* Currency Pill */}
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold tracking-wider text-stone-700 bg-stone-100 border border-stone-200/80 px-2.5 py-1 rounded-sm">
              <span className="text-[#8A1C24]">PKR</span>
              <span className="text-stone-400">/</span>
              <span>Rs.</span>
            </div>

            {/* Customer Account Button */}
            <button
              onClick={() => navigateTo('account')}
              className="p-2 text-stone-800 hover:text-[#6B1820] transition-colors relative"
              title={customerUser ? customerUser.fullName : 'My Account'}
              aria-label="Customer Account"
            >
              <User size={20} />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => navigateTo('wishlist')}
              className="p-2 text-stone-800 hover:text-[#6B1820] transition-colors relative"
              title="My Wishlist"
              aria-label="View Wishlist"
            >
              <Heart size={20} className={wishlist.length > 0 ? 'text-[#8A1C24] fill-[#8A1C24]/10' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#8A1C24] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="p-2 text-stone-800 hover:text-[#6B1820] transition-colors relative"
              title="Shopping Bag"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag size={20} />
              {totalCartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#8A1C24] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Primary Desktop Navigation Bar */}
        <nav className="hidden lg:flex items-center justify-center gap-8 pt-4 mt-2 border-t border-stone-200/60">
          {navItems.map((item, idx) => {
            const isActive =
              currentView === item.view &&
              (!item.category || item.category === undefined);

            const isSale = item.label === 'Sale';
            const isModest = item.label === 'Zarmeen Modest';

            return (
              <button
                key={idx}
                onClick={() =>
                  navigateTo(item.view, {
                    category: item.category,
                    collection: item.collection,
                  })
                }
                className={`text-[12px] tracking-[0.16em] uppercase font-medium transition-all py-1 cursor-pointer relative group ${
                  isSale
                    ? 'text-[#8A1C24] font-semibold'
                    : isModest
                    ? 'text-emerald-900 font-semibold'
                    : 'text-stone-800 hover:text-[#8A1C24]'
                }`}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#8A1C24] transition-all duration-200 group-hover:w-full" />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#FAF8F5] shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="p-5 border-b border-stone-200 flex justify-between items-center">
              <div>
                <span className="font-heading text-xl tracking-[0.2em] text-[#1C1A1A] block">
                  ZARMEEN
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#8C7654] uppercase font-medium">
                  Wear Your Heritage
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-stone-500 hover:text-stone-800"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-4 bg-stone-100/70 border-b border-stone-200/80">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  toggleAdminMode();
                }}
                className="w-full py-2 px-3 bg-[#1C1A1A] text-white text-xs tracking-wider uppercase font-medium flex items-center justify-center gap-2 rounded-sm"
              >
                <SlidersHorizontal size={14} />
                {isAdminMode ? 'Customer View' : 'Admin Control Panel'}
              </button>
            </div>

            <nav className="p-5 space-y-3 flex-1">
              {navItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    navigateTo(item.view, {
                      category: item.category,
                      collection: item.collection,
                    });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2.5 text-sm tracking-widest uppercase font-medium text-stone-800 hover:text-[#8A1C24] border-b border-stone-100 flex items-center justify-between"
                >
                  <span className={item.label === 'Sale' ? 'text-[#8A1C24]' : ''}>{item.label}</span>
                </button>
              ))}

              <div className="pt-4 space-y-2">
                <button
                  onClick={() => {
                    navigateTo('order-tracking');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-xs text-stone-600 hover:text-[#8A1C24] tracking-wider"
                >
                  Track Your Order
                </button>
                <button
                  onClick={() => {
                    navigateTo('size-guide');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-xs text-stone-600 hover:text-[#8A1C24] tracking-wider"
                >
                  Pakistani Size Guide &amp; Fit
                </button>
                <button
                  onClick={() => {
                    navigateTo('about');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-xs text-stone-600 hover:text-[#8A1C24] tracking-wider"
                >
                  About The House of Zarmeen
                </button>
                <button
                  onClick={() => {
                    navigateTo('contact');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-xs text-stone-600 hover:text-[#8A1C24] tracking-wider"
                >
                  Flagship Boutiques &amp; Concierge
                </button>
              </div>
            </nav>

            <div className="p-5 border-t border-stone-200 bg-stone-50 text-xs text-stone-600 space-y-2">
              <p className="font-medium text-stone-800">Zarmeen Concierge Support</p>
              <p>{settings.supportPhone}</p>
              <p>{settings.supportEmail}</p>
              <p className="text-[11px] text-stone-500 pt-1">Cash on Delivery Across Pakistan</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
