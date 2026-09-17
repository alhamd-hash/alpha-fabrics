import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X, Phone, MapPin, Truck } from 'lucide-react';
import { Product, Collection, Category } from '../types';
import { formatPKR } from '../utils';

interface NavbarProps {
  cart: { product: Product; quantity: number; selectedImage: string }[];
  onNavigate: (view: 'home' | 'about' | 'contact' | 'checkout' | 'admin' | 'collection' | 'category', payload?: string) => void;
  onOpenCart: () => void;
  onOpenTracker: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  collections: Collection[];
  categories?: Category[];
}

export default function Navbar({
  cart,
  onNavigate,
  onOpenCart,
  onOpenTracker,
  searchQuery,
  setSearchQuery,
  collections,
  categories = []
}: NavbarProps) {
  const dynamicLadiesCategories = categories ? categories.filter(c => !c.isGents && c.showInNavbar !== false).map(c => c.name) : [];
  const dynamicGentsCategories = categories ? categories.filter(c => c.isGents && c.showInNavbar !== false).map(c => c.name) : [];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Expanded menu states to support the category-explorer interactions
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [mobileGentsOpen, setMobileGentsOpen] = useState(false);
  const [mobileLadiesOpen, setMobileLadiesOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  const [mobileGentsColsOpen, setMobileGentsColsOpen] = useState(false);
  const [mobileLadiesColsOpen, setMobileLadiesColsOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('home');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs">
      {/* Prime Luxury Top bar notification */}
      <div className="w-full bg-[#1e152a] py-2 text-center text-xs md:text-sm text-[#f1ebd9] font-medium tracking-wide flex items-center justify-center gap-2 px-4">
        <Truck size={14} className="text-[#c5a880] animate-bounce" />
        <span>⚡ <strong>FREE DELIVERY</strong> on orders above <strong>PKR 6,000</strong></span>
        <span className="hidden md:inline">|</span>
        <span className="hidden md:inline">Flat Delivery Charges <strong>PKR 300</strong> pan Pakistan!</span>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#f1ebd9]/50">
        <div className="flex items-center justify-between h-20 gap-1 xs:gap-2 sm:gap-4">
          
          {/* Logo & Brand Details */}
          <div 
            onClick={() => { onNavigate('home'); setSearchQuery(''); }}
            className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 cursor-pointer shrink shadow-2xs min-w-0"
            id="brand-logo"
          >
            {/* Elegant logo mark styling with existing asset from public folder */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1e152a] rounded-full flex items-center justify-center border-2 border-[#c5a880] shadow-md transform hover:scale-105 transition-transform duration-300 shrink-0 overflow-hidden p-0.5">
              <img 
                src="/alpha-fabrics-icon-transparent.png" 
                alt="Al-Hamd Fabrics Logo" 
                className="w-full h-full object-contain" 
                referrerPolicy="no-referrer" 
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/header-logo-light-bg.png';
                }}
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif font-bold text-xs xs:text-sm sm:text-lg md:text-2xl text-[#1e152a] tracking-tight leading-none truncate pr-1">
                Al-Hamd Fabrics
              </span>
              <span className="font-sans text-[7px] xs:text-[9px] sm:text-[10px] text-[#c5a880] font-semibold uppercase tracking-widest mt-0.5 sm:mt-1 truncate hidden xs:block">
                Premium Timeless Elegance
              </span>
            </div>
          </div>

          {/* Center Search Bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex relative max-w-md w-full mx-4 items-center"
            id="search-form-desktop"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search premium lawn, wedding chiffon, unstitched..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-[#faf9f6] border border-[#e1d9cd] rounded-full text-sm focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] transition-all text-[#1e152a]"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c5a880] transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Action Icons right */}
          <div className="flex items-center gap-1 xs:gap-2 sm:gap-4 shrink-0">
            {/* Order status tracking trigger */}
            <button
              onClick={onOpenTracker}
              className="flex items-center gap-1 sm:gap-1.5 px-1.5 xs:px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#e1d9cd] text-[9px] xs:text-[10px] sm:text-xs font-semibold text-[#1e152a] hover:bg-[#faf9f6] hover:border-[#c5a880] transition-all cursor-pointer whitespace-nowrap"
              id="tracker-trigger-btn"
            >
              <Truck size={11} className="text-[#c5a880] sm:w-[14px] sm:h-[14px]" />
              <span className="hidden sm:inline">Track Order</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-1 xs:p-2 sm:p-2.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-[#1e152a] flex items-center gap-0.5 sm:gap-1"
              id="cart-trigger-btn"
              aria-label="Cart"
            >
              <ShoppingBag size={16} className="text-[#100c18] sm:w-[22px] sm:h-[22px]" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 sm:-top-1 sm:-right-1 bg-[#c5a880] text-white text-[8px] sm:text-[10px] font-bold w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border border-white animate-pulse">
                  {cartCount}
                </span>
              )}
              {cartTotal > 0 && (
                <span className="hidden lg:inline text-xs font-semibold text-gray-700 ml-1">
                  {formatPKR(cartTotal)}
                </span>
              )}
            </button>

            {/* Mobile menu toggle (Enhanced touch targets and alignment stability) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-gray-700 hover:text-[#1e152a] focus:outline-none cursor-pointer border border-[#e1d9cd] rounded-md hover:bg-gray-50 shrink-0"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </div>

      {/* Desktop Link Navigation with category groups */}
      <nav className="hidden md:block bg-[#1e152a] border-b border-[#c5a880]/30 shadow-xs">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-8">
              <button
                onClick={() => onNavigate('home')}
                className="text-[#f1ebd9] hover:text-[#c5a880] font-medium tracking-wide text-sm cursor-pointer py-1.5 transition-colors border-b-2 border-transparent hover:border-[#c5a880]"
              >
                Home
              </button>

              {/* Shop Categories Interactive Menu */}
              <div className="relative group">
                <button
                  className="flex items-center gap-1 text-[#f1ebd9] hover:text-[#c5a880] font-medium tracking-wide text-sm cursor-pointer py-1.5 transition-all border-b-2 border-transparent group-hover:border-[#c5a880]"
                >
                  Shop Categories
                  <svg className="w-4 h-4 ml-0.5 text-gray-400 group-hover:text-[#c5a880] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {/* Mega Menu Flyout panel with distinct Columns */}
                <div className="absolute left-0 mt-0 w-[480px] bg-white rounded-md shadow-2xl py-5 px-6 border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 origin-top-left pointer-events-none group-hover:pointer-events-auto group-hover:scale-100 z-50 grid grid-cols-2 gap-6">
                  {/* Left Column: Gents Categories */}
                  <div className="space-y-2.5">
                    <h5 className="font-serif font-extrabold text-[#110c18] text-xs uppercase tracking-wider border-b border-gray-100 pb-1.5">
                      👔 Gents Categories
                    </h5>
                    <div className="flex flex-col gap-1.5">
                      {dynamicGentsCategories.length === 0 ? (
                        <span className="text-[11px] italic text-gray-400 font-medium">No category available (Nill)</span>
                      ) : (
                        dynamicGentsCategories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => onNavigate('category', cat)}
                            className="w-full text-left py-1 text-xs text-gray-500 hover:text-[#c5a880] transition-all font-medium cursor-pointer"
                          >
                            • {cat}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right Column: Ladies Categories */}
                  <div className="space-y-2.5">
                    <h5 className="font-serif font-extrabold text-[#110c18] text-xs uppercase tracking-wider border-b border-gray-100 pb-1.5">
                      👗 Ladies Categories
                    </h5>
                    <div className="flex flex-col gap-1.5">
                      {dynamicLadiesCategories.length === 0 ? (
                        <span className="text-[11px] italic text-gray-400 font-medium">No category available (Nill)</span>
                      ) : (
                        dynamicLadiesCategories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => onNavigate('category', cat)}
                            className="w-full text-left py-1 text-xs text-gray-500 hover:text-[#c5a880] transition-all font-medium cursor-pointer"
                          >
                            • {cat}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shop Collections Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center gap-1 text-[#f1ebd9] hover:text-[#c5a880] font-medium tracking-wide text-sm cursor-pointer py-1.5 transition-all border-b-2 border-transparent group-hover:border-[#c5a880]"
                >
                  Shop Collections
                  <svg className="w-4 h-4 ml-0.5 text-gray-400 group-hover:text-[#c5a880] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-0 w-64 bg-white rounded-md shadow-lg py-2 border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 origin-top-left pointer-events-none group-hover:pointer-events-auto group-hover:scale-100 z-50">
                  <div className="px-4 py-1.5 text-[10px] text-gray-400 border-b border-gray-50 uppercase tracking-wider font-bold">👔 Gents Collections</div>
                  {collections.filter(c => c.isGents && c.showInNavbar !== false).length === 0 ? (
                    <div className="px-5 py-2 text-xs text-gray-400 italic font-medium">No collection available (Nill)</div>
                  ) : (
                    collections.filter(c => c.isGents && c.showInNavbar !== false).map((col) => (
                      <button
                        key={col.id}
                        onClick={() => onNavigate('collection', col.id)}
                        className="w-full text-left px-5 py-2 text-xs text-[#1e152a] hover:bg-[#faf9f6]/80 hover:text-[#c5a880] transition-all font-semibold block cursor-pointer"
                      >
                        • {col.name}
                      </button>
                    ))
                  )}
                  <div className="px-4 py-1.5 mt-1 text-[10px] text-gray-400 border-b border-gray-50 uppercase tracking-wider font-bold">👗 Ladies Collections</div>
                  {collections.filter(c => !c.isGents && c.showInNavbar !== false && c.id !== 'new-arrivals' && c.id !== 'hot-selling').length === 0 ? (
                    <div className="px-5 py-2 text-xs text-gray-400 italic font-medium">No collection available (Nill)</div>
                  ) : (
                    collections.filter(c => !c.isGents && c.showInNavbar !== false && c.id !== 'new-arrivals' && c.id !== 'hot-selling').map((col) => (
                      <button
                        key={col.id}
                        onClick={() => onNavigate('collection', col.id)}
                        className="w-full text-left px-5 py-2 text-xs text-[#1e152a] hover:bg-[#faf9f6]/80 hover:text-[#c5a880] transition-all font-semibold block cursor-pointer"
                      >
                        • {col.name}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <button
                onClick={() => onNavigate('about')}
                className="text-[#f1ebd9] hover:text-[#c5a880] font-medium tracking-wide text-sm cursor-pointer py-1.5 transition-colors border-b-2 border-transparent hover:border-[#c5a880]"
              >
                About Us
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="text-[#f1ebd9] hover:text-[#c5a880] font-medium tracking-wide text-sm cursor-pointer py-1.5 transition-colors border-b-2 border-transparent hover:border-[#c5a880]"
              >
                Contact Us
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs tracking-wide font-semibold text-[#c5a880]">
              <Phone size={13} />
              <span>Inquiries/Orders: 03053131133</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer - Interactive collapse elements (Urdu structure compliant) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e1d9cd] shadow-md animate-fade-in max-h-[85vh] overflow-y-auto">
          {/* Mobile Search */}
          <div className="p-4 border-b border-gray-100">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search lawn, wedding linen, unstitched..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-[#faf9f6] border border-[#e1d9cd] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#c5a880]"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </button>
            </form>
          </div>

          <div className="py-2 px-4 space-y-1">
            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className="w-full text-left py-3 text-sm font-semibold text-[#1e152a] hover:bg-[#faf9f6] rounded px-2 transition-all block"
            >
              Home
            </button>

            {/* Interactive Shop link (Expandable Accordion) */}
            <div className="border-b border-gray-50 pb-2">
              <button
                onClick={() => setMobileShopOpen(!mobileShopOpen)}
                className="w-full flex items-center justify-between py-3 text-sm font-semibold text-[#1e152a] hover:bg-[#faf9f6]/50 rounded px-2 transition-all cursor-pointer"
              >
                <span>🛍️ Shop Categories</span>
                <span className="text-gray-400 text-xs">{mobileShopOpen ? '▼' : '▶'}</span>
              </button>

              {mobileShopOpen && (
                <div className="pl-4 mt-1 space-y-3 border-l-2 border-[#c5a880]/30 ml-2 py-1 animate-fade-in">
                  {/* Gents Accordion */}
                  <div>
                    <button
                      onClick={() => setMobileGentsOpen(!mobileGentsOpen)}
                      className="w-full flex items-center justify-between py-2 text-xs font-bold text-gray-500 hover:text-[#c5a880] uppercase tracking-wider cursor-pointer"
                    >
                      <span>👔 Gents Categories</span>
                      <span>{mobileGentsOpen ? '−' : '+'}</span>
                    </button>
                    {mobileGentsOpen && (
                      <div className="pl-3 mt-1 space-y-1 bg-stone-50 rounded p-1.5 animate-fade-in">
                        {dynamicGentsCategories.length === 0 ? (
                          <div className="w-full text-left py-2 px-2 text-xs text-gray-400 italic font-medium">No category available (Nill)</div>
                        ) : (
                          dynamicGentsCategories.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => { onNavigate('category', cat); setMobileMenuOpen(false); }}
                              className="w-full text-left py-2 text-xs text-gray-600 hover:text-[#c5a880] block font-medium"
                            >
                              • {cat}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Ladies Accordion */}
                  <div>
                    <button
                      onClick={() => setMobileLadiesOpen(!mobileLadiesOpen)}
                      className="w-full flex items-center justify-between py-2 text-xs font-bold text-gray-500 hover:text-[#c5a880] uppercase tracking-wider cursor-pointer"
                    >
                      <span>👗 Ladies Categories</span>
                      <span>{mobileLadiesOpen ? '−' : '+'}</span>
                    </button>
                    {mobileLadiesOpen && (
                      <div className="pl-3 mt-1 space-y-1 bg-stone-50 rounded p-1.5 animate-fade-in">
                        {dynamicLadiesCategories.length === 0 ? (
                          <div className="w-full text-left py-2 px-2 text-xs text-gray-400 italic font-medium">No category available (Nill)</div>
                        ) : (
                          dynamicLadiesCategories.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => { onNavigate('category', cat); setMobileMenuOpen(false); }}
                              className="w-full text-left py-2 text-xs text-gray-600 hover:text-[#c5a880] block font-medium"
                            >
                              • {cat}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Collections (Expandable Accordion) */}
            <div className="border-b border-gray-50 pb-2">
              <button
                onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
                className="w-full flex items-center justify-between py-3 text-sm font-semibold text-[#1e152a] hover:bg-[#faf9f6]/50 rounded px-2 transition-all cursor-pointer"
              >
                <span>✨ Our Collections</span>
                <span className="text-gray-400 text-xs">{mobileCollectionsOpen ? '▼' : '▶'}</span>
              </button>

              {mobileCollectionsOpen && (
                <div className="pl-4 mt-1 space-y-3 border-l-2 border-[#c5a880]/30 ml-2 py-1 animate-fade-in">
                  {/* Gents Collections Accordion */}
                  <div>
                    <button
                      onClick={() => setMobileGentsColsOpen(!mobileGentsColsOpen)}
                      className="w-full flex items-center justify-between py-2 text-xs font-bold text-gray-500 hover:text-[#c5a880] uppercase tracking-wider cursor-pointer"
                    >
                      <span>👔 Gents Collections</span>
                      <span>{mobileGentsColsOpen ? '−' : '+'}</span>
                    </button>
                    {mobileGentsColsOpen && (
                      <div className="pl-3 mt-1 space-y-1 bg-stone-50 rounded p-1.5 animate-fade-in">
                        {collections.filter(c => c.isGents && c.showInNavbar !== false).length === 0 ? (
                          <div className="w-full text-left py-2 px-2 text-xs text-gray-400 italic font-medium">No collection available (Nill)</div>
                        ) : (
                          collections.filter(c => c.isGents && c.showInNavbar !== false).map((col) => (
                            <button
                              key={col.id}
                              onClick={() => { onNavigate('collection', col.id); setMobileMenuOpen(false); }}
                              className="w-full text-left py-2 text-xs text-gray-600 hover:text-[#c5a880] block font-medium"
                            >
                              • {col.name}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Ladies Collections Accordion */}
                  <div>
                    <button
                      onClick={() => setMobileLadiesColsOpen(!mobileLadiesColsOpen)}
                      className="w-full flex items-center justify-between py-2 text-xs font-bold text-gray-500 hover:text-[#c5a880] uppercase tracking-wider cursor-pointer"
                    >
                      <span>👗 Ladies Collections</span>
                      <span>{mobileLadiesColsOpen ? '−' : '+'}</span>
                    </button>
                    {mobileLadiesColsOpen && (
                      <div className="pl-3 mt-1 space-y-1 bg-stone-50 rounded p-1.5 animate-fade-in">
                        {collections.filter(c => !c.isGents && c.showInNavbar !== false && c.id !== 'new-arrivals' && c.id !== 'hot-selling').length === 0 ? (
                          <div className="w-full text-left py-2 px-2 text-xs text-gray-400 italic font-medium">No collection available (Nill)</div>
                        ) : (
                          collections.filter(c => !c.isGents && c.showInNavbar !== false && c.id !== 'new-arrivals' && c.id !== 'hot-selling').map((col) => (
                            <button
                              key={col.id}
                              onClick={() => { onNavigate('collection', col.id); setMobileMenuOpen(false); }}
                              className="w-full text-left py-2 text-xs text-gray-600 hover:text-[#c5a880] block font-medium"
                            >
                              • {col.name}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }}
              className="w-full text-left py-3 text-sm font-semibold text-[#1e152a] hover:bg-[#faf9f6] hover:text-[#c5a880] rounded px-2 transition-all block"
            >
              About Us
            </button>

            <button
              onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }}
              className="w-full text-left py-3 text-sm font-semibold text-[#1e152a] hover:bg-[#faf9f6] hover:text-[#c5a880] rounded px-2 transition-all block"
            >
              Contact Us
            </button>

            <div className="pt-4 pb-3 border-t border-gray-100 text-xs text-gray-500 space-y-2 px-2">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#c5a880]" />
                <span>Call/WhatsApp: 03053131133</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#c5a880]" />
                <span>Manga Mandi, Raiwind Road, Lahore</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
