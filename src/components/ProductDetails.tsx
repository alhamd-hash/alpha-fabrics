import React, { useState } from 'react';
import { Star, Shield, RefreshCw, ChevronLeft, Calendar, User, MessageSquare, Plus, ShoppingCart, Send, Truck, Calculator } from 'lucide-react';
import { Product, Review } from '../types';
import { formatPKR, getProductSlug } from '../utils';

interface ProductDetailsProps {
  product: Product;
  allReviews: Review[];
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, selectedImage: string) => void;
  onOrderNow: (product: Product, quantity: number, selectedImage: string) => void;
  onSubmitReview: (productId: string, customerName: string, rating: number, comment: string) => void;
  onSubscribe?: (name: string, email: string) => Promise<{ success: boolean; message: string }>;
  subscriptions?: any[];
  allProducts?: Product[];
  onProductClick?: (id: string) => void;
}

export default function ProductDetails({
  product,
  allReviews,
  onBack,
  onAddToCart,
  onOrderNow,
  onSubmitReview,
  onSubscribe,
  subscriptions = [],
  allProducts = [],
  onProductClick = () => {}
}: ProductDetailsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState('');

  // Restock Subscription Alert States
  const [subscribeName, setSubscribeName] = useState('');
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Helper and calculations for out of stock checks
  const currentStock = product.inventory !== undefined ? product.inventory : 5;
  const isOutOfStock = currentStock <= 0;

  // Inventory & Fabric Requirement Calculator States
  const [calcSuitType, setCalcSuitType] = useState<'3pc' | '2pc' | 'shirt' | 'custom'>(product.isLadiesSuit ? '3pc' : '2pc');
  const [calcSuitsQty, setCalcSuitsQty] = useState(1);
  const [customMeters, setCustomMeters] = useState(8.0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Calculated values based on type
  const getRequiredMetersPerSuit = () => {
    if (calcSuitType === '3pc') return 8.0; // standard 3pc suit is 8 meters total
    if (calcSuitType === '2pc') return 5.5; // standard 2pc suit is 5.5 meters
    if (calcSuitType === 'shirt') return 3.0; // single shirt piece is 3 meters
    return customMeters;
  };

  const totalCalculatedMeters = getRequiredMetersPerSuit() * calcSuitsQty;
  const totalCalculatedCost = product.price * calcSuitsQty;

  // Related/Recommended Products Logic
  const getRelatedProducts = (): Product[] => {
    if (!allProducts || allProducts.length === 0) return [];
    
    // If custom related is specified and has items
    if (product.relatedType === 'custom' && product.customRelatedIds && product.customRelatedIds.length > 0) {
      return allProducts.filter(p => 
        p.id !== product.id && 
        product.customRelatedIds?.includes(p.id)
      );
    }
    
    // Otherwise fallback to "auto": Same collection or same category
    return allProducts
      .filter(p => {
        // Exclude current product
        if (p.id === product.id) return false;
        
        // Match collection ID
        const matchCol = p.collectionId === product.collectionId || 
                         (product.collectionIds && p.collectionIds && product.collectionIds.some(id => p.collectionIds?.includes(id)));
                         
        // Match category
        const matchCat = p.category === product.category || 
                         (product.categories && p.categories && p.categories.some(cat => p.categories?.includes(cat)));
                         
        return matchCol || matchCat;
      })
      .slice(0, 4); // Limit to top 4 recommendations
  };

  const relatedList = getRelatedProducts();

  const handleWhatsAppInquiry = (customMsgText?: string) => {
    const productCode = product.code || 'N/A';
    const messageText = customMsgText || `Assalam-o-Alaikum Al-Hamd Fabrics! 
I am interested in inquiring about this product:

Product Name: ${product.name}
Product Code: ${productCode}
Price: ${formatPKR(product.price)}

Is this item currently available in stock? Please guide me. Thank you!`;
    
    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/923053131133?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWhatsAppCalculatorInquiry = () => {
    const productCode = product.code || 'N/A';
    const suitTypeLabel = 
      calcSuitType === '3pc' ? '3-Piece Suit (8.0 Meter Cut)' :
      calcSuitType === '2pc' ? '2-Piece Suit (5.5 Meter Cut)' :
      calcSuitType === 'shirt' ? 'Shirt Piece (3.0 Meter Cut)' : `Custom Sizing (${customMeters} Meter Cut)`;

    const msg = `Assalam-o-Alaikum Al-Hamd Fabrics! 
I used your Inventory Calculator for this product:

Product Name: ${product.name}
Product Code: ${productCode}
Price per Suit: ${formatPKR(product.price)}

-----------------------------
Estimated Cut: ${suitTypeLabel}
Total Quantity: ${calcSuitsQty} Suit(s)
Total Estimated Yardage: ${totalCalculatedMeters.toFixed(1)} Meters
Total Calculated Cost: ${formatPKR(totalCalculatedCost)}
-----------------------------

Please let me know if you have this yardage available so I can proceed with the purchase. Thank you!`;
    handleWhatsAppInquiry(msg);
  };

  const handleShareWhatsApp = () => {
    const slug = getProductSlug(product.name);
    const productUrl = `${window.location.origin}/#/products/${slug}`;
    const text = `Take a look at Alhamd Fabrics! 😍\n\n*Product:* ${product.name}\n*Price:* PKR ${formatPKR(product.price)}\n\nClick here to view details and place an order:\n${productUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    const slug = getProductSlug(product.name);
    const productUrl = `${window.location.origin}/#/products/${slug}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(productUrl).then(() => {
          setCopiedLink(true);
          setTimeout(() => setCopiedLink(false), 2000);
        });
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = productUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Get only approved reviews for this product
  const approvedReviews = allReviews.filter(
    (rev) => rev.productId === product.id && rev.approved
  );

  const imagesList = product.images.length > 0 ? product.images : [
    'https://picsum.photos/seed/fabric1/600/800',
    'https://picsum.photos/seed/fabric2/600/800',
    'https://picsum.photos/seed/fabric3/600/800'
  ];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    onSubmitReview(product.id, reviewName, reviewRating, reviewComment);
    
    // Clear form and show feedback
    setReviewName('');
    setReviewRating(5);
    setReviewComment('');
    setReviewSuccessMessage('Alhamdulillah! Your review has been submitted. It will appear publicly as soon as it is approved by the admin.');
    
    setTimeout(() => {
      setReviewSuccessMessage('');
    }, 8000);
  };

  const handleSubscribeRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail.trim() || !subscribeName.trim()) return;
    if (!onSubscribe) return;
    setIsSubscribing(true);
    setSubscribeStatus(null);
    try {
      const res = await onSubscribe(subscribeName, subscribeEmail);
      if (res.success) {
        setSubscribeStatus({ type: 'success', message: res.message });
        setSubscribeName('');
        setSubscribeEmail('');
      } else {
        setSubscribeStatus({ type: 'error', message: res.message });
      }
    } catch (err) {
      setSubscribeStatus({ type: 'error', message: 'Something went wrong. Please check your internet connection and try again.' });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id={`product-detail-view-${product.id}`}>
      
      {/* Back button and navigation breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#e1d9cd] rounded-full text-xs font-semibold text-[#1e152a] hover:bg-[#faf9f6] hover:border-[#c5a880] transition-all cursor-pointer shadow-2xs"
          id="detail-back-button"
        >
          <ChevronLeft size={16} />
          Back to Catalog
        </button>
        <div className="text-xs text-gray-500">
          Home / Collections / <span className="text-[#c5a880] font-semibold">{product.category}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 lg:p-8 shadow-xs">
        
        {/* Left Column: Image Gallery (Grid-Columns: 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[3/4] bg-[#faf9f6] rounded-xl overflow-hidden border border-gray-100 shadow-2xs group">
            {/* Main Stage Image */}
            <img
              src={imagesList[selectedImageIndex]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-[1.03]"
            />
            {product.isNewArrival && (
              <span className="absolute top-4 left-4 bg-[#1e152a] text-[#f1ebd9] text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-xs">
                NEW ARRIVAL
              </span>
            )}
          </div>

          {/* Thumbnails list */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
            {imagesList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`flex-none w-20 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-gray-50 ${
                  idx === selectedImageIndex ? 'border-[#c5a880] scale-95 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover object-top" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Key purchase components (Grid-Columns: 7) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#c5a880] uppercase tracking-widest">
                {product.category}
              </span>
              <span className="text-gray-300 text-xs">•</span>
              <span className="bg-stone-50 text-[#1e152a] text-[10.5px] font-mono font-bold px-2.5 py-1 rounded border border-stone-150">
                Code: {product.code || 'ALH-N/A'}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#1e152a] font-extrabold leading-tight tracking-tight">
              {product.name}
            </h1>
            <p className="text-gray-500 text-xs mt-1.5 leading-relaxed italic">
              {product.shortDetails || 'Premium high-end dress fabric with timeless details.'}
            </p>

            {/* Ratings Summary */}
            <div className="flex items-center gap-4 mt-4 py-2 border-y border-gray-100">
              <div className="flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i <= Math.round(product.rating) ? 'fill-amber-500 text-amber-500' : 'text-gray-200'}
                  />
                ))}
                <span className="text-sm font-bold text-gray-800 ml-1 mt-0.5">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-400">
                | &nbsp;{approvedReviews.length} Verified Customer Review{approvedReviews.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Price display container */}
            <div className="bg-[#faf9f6] p-4 rounded-xl border border-[#e1d9cd] mt-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 font-semibold block uppercase">Our Special Price</span>
                <span className="font-sans text-2xl sm:text-3xl font-extrabold text-[#100c18]">
                  {formatPKR(product.price)}
                </span>
              </div>
              <div className="text-right">
                {isOutOfStock ? (
                  <span className="text-red-700 font-extrabold text-xs bg-red-50 px-2.5 py-1.5 rounded-full border border-red-100 flex items-center gap-1.5 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Out of Stock (Request Restock)
                  </span>
                ) : product.inventory !== undefined ? (
                  <span className="text-emerald-700 font-extrabold text-xs bg-emerald-50 px-2.5 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1.5 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Stock: {product.inventory} Pcs Available
                  </span>
                ) : (
                  <span className="text-emerald-700 font-extrabold text-xs bg-emerald-50 px-2.5 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1.5 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Stock: 5 Pcs Available
                  </span>
                )}
              </div>
            </div>

            {/* Large full description */}
            <div className="mt-5">
              <h3 className="font-serif font-bold text-[#1e152a] text-md mb-2">Product Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed font-sans font-light">
                {product.description}
              </p>
            </div>

            {/* Special Ladies Suit Specifications layout */}
            {product.isLadiesSuit && product.ladiesSuitInfo && (
              <div className="mt-6 bg-[#1e152a]/5 border border-[#1e152a]/15 p-5 rounded-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-[#1e152a]/15 pb-2">
                  <span className="w-2.5 h-2.5 bg-[#c5a880] rounded-sm" />
                  <h4 className="font-serif font-bold text-[#1e152a] text-sm tracking-wide uppercase">
                    Ladies Suit Premium Specifications
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
                  {product.ladiesSuitInfo.shirt && (
                    <div>
                      <span className="text-gray-400 font-medium block">Shirt Fabric Details:</span>
                      <strong className="text-gray-700">{product.ladiesSuitInfo.shirt}</strong>
                    </div>
                  )}
                  {product.ladiesSuitInfo.dupatta && (
                    <div>
                      <span className="text-gray-400 font-medium block">Dupatta Material Details:</span>
                      <strong className="text-gray-700">{product.ladiesSuitInfo.dupatta}</strong>
                    </div>
                  )}
                  {product.ladiesSuitInfo.trouser && (
                    <div>
                      <span className="text-gray-400 font-medium block">Trouser Specifications:</span>
                      <strong className="text-gray-700">{product.ladiesSuitInfo.trouser}</strong>
                    </div>
                  )}
                  {product.ladiesSuitInfo.fabricType && (
                    <div>
                      <span className="text-gray-400 font-medium block">Fabric Sourced Sizing:</span>
                      <strong className="text-gray-700 capitalize">{product.ladiesSuitInfo.fabricType}</strong>
                    </div>
                  )}
                  {product.ladiesSuitInfo.embroideryDetails && (
                    <div className="sm:col-span-2 border-t border-dashed border-[#1e152a]/10 pt-2.5">
                      <span className="text-gray-400 font-medium block">Intricate Threadwork Details:</span>
                      <strong className="text-[#100c18] font-medium block leading-relaxed mt-0.5">
                        {product.ladiesSuitInfo.embroideryDetails}
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Extra Specifications Table */}
            {product.specifications && Object.entries(product.specifications).filter(([_, value]) => value && value.trim() !== '').length > 0 && (
              <div className="mt-6 border border-gray-100 rounded-xl overflow-hidden animate-fade-in">
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
                  <span className="font-serif text-xs font-semibold text-gray-700 uppercase tracking-wider">Suit Specifications Grid</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {Object.entries(product.specifications)
                    .filter(([_, value]) => value && value.trim() !== '')
                    .map(([key, value]) => (
                      <div key={key} className="grid grid-cols-3 px-4 py-2.5 text-xs font-sans">
                        <span className="text-gray-400 font-medium">{key}</span>
                        <span className="text-gray-800 font-bold col-span-2">{value}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

          </div>

          {/* Checkout triggers and actions container */}
          <div className="pt-6 border-t border-gray-100 space-y-4">
            {/* Quantities selector */}
            {!isOutOfStock && (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-gray-500 uppercase">Quantity:</span>
                <div className="flex items-center border border-[#e1d9cd] rounded-md bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 text-gray-500 hover:bg-gray-100 font-bold transition-all text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 text-[#1e152a] font-bold text-sm w-12 text-center">
                    {Math.min(currentStock, quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="px-3.5 py-1.5 text-gray-500 hover:bg-gray-100 font-bold transition-all text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
                {currentStock <= 10 && (
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/50">
                    ⚠️ Limited Stock: Only {currentStock} suites left!
                  </span>
                )}
                {quantity > 1 && (
                  <span className="text-xs font-semibold text-gray-400">
                    Total: {formatPKR(product.price * Math.min(currentStock, quantity))}
                  </span>
                )}
              </div>
            )}

            {/* CTA Buy/Cart Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <button
                disabled={isOutOfStock}
                onClick={() => onAddToCart(product, Math.min(currentStock, quantity), imagesList[selectedImageIndex])}
                className={`w-full py-4 px-6 border-2 font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2.5 rounded-xs ${
                  isOutOfStock 
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                    : 'border-2 border-[#1e152a] text-[#1e152a] hover:bg-[#1e152a] hover:text-white cursor-pointer shadow-2xs'
                }`}
              >
                <ShoppingCart size={16} />
                {isOutOfStock ? 'Sold Out' : 'Add To Cart'}
              </button>
              
              <button
                disabled={isOutOfStock}
                onClick={() => onOrderNow(product, Math.min(currentStock, quantity), imagesList[selectedImageIndex])}
                className={`w-full py-4 px-6 font-extrabold uppercase text-xs tracking-widest transition-all shadow-md transform active:scale-98 flex items-center justify-center gap-2.5 rounded-xs ${
                  isOutOfStock 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-[#1e152a] text-[#f1ebd9] hover:bg-[#c5a880] hover:text-black cursor-pointer'
                }`}
              >
                🔥 {isOutOfStock ? 'Out of Stock' : 'Order Now (Direct Checkout)'}
              </button>
            </div>

            {/* Restock Notification Box */}
            {isOutOfStock && (
              <div id="restock-notification-form" className="bg-amber-50/40 p-5 rounded-2xl border border-[#c5a880]/30 mt-6 space-y-4 animate-fade-in text-left">
                <div className="flex items-center gap-2 pb-2 border-b border-[#c5a880]/20">
                  <span className="text-xl">📬</span>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1e152a] tracking-tight">
                      Subscribe to Restock Alerts
                    </h4>
                    <p className="text-[10px] text-gray-500 font-medium leading-normal">
                      This item is currently sold out. Subscribe with your email below and we will notify you automatically the moment we restock it!
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubscribeRestock} className="space-y-3">
                  {subscribeStatus && (
                    <div className={`p-3 text-xs rounded-lg font-medium leading-relaxed ${
                      subscribeStatus.type === 'success' ? 'bg-emerald-50 border border-emerald-100 text-emerald-800' : 'bg-red-50 border border-red-100 text-red-800'
                    }`}>
                      {subscribeStatus.message}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={subscribeName}
                      disabled={isSubscribing}
                      onChange={(e) => setSubscribeName(e.target.value)}
                      className="border border-[#e1d9cd] rounded px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] bg-white text-gray-800 w-full"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email Address"
                      value={subscribeEmail}
                      disabled={isSubscribing}
                      onChange={(e) => setSubscribeEmail(e.target.value)}
                      className="border border-[#e1d9cd] rounded px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] bg-white text-gray-800 w-full"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="w-full py-3 bg-[#1e152a] hover:bg-[#c5a880] text-[#f1ebd9] hover:text-black font-extrabold uppercase text-xs tracking-widest transition-all rounded shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubscribing ? 'Subscribing...' : '🔔 Notify me on restock'}
                  </button>
                </form>
              </div>
            )}

            {/* Direct WhatsApp Product Inquiry CTA */}
            <button
              onClick={() => handleWhatsAppInquiry()}
              className="w-full py-3.5 px-6 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold uppercase text-xs tracking-wider shadow-md active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer rounded"
            >
              <span className="text-base">💬</span>
              WhatsApp par Product Inquiry kryn (Code: {product.code || 'ALH-N/A'})
            </button>

            {/* Share Product Options Widget */}
            <div className="p-4 bg-stone-50 border border-stone-150 rounded-xl space-y-3 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-600">
                    🔗 Share This Suit
                  </span>
                  <span className="block text-[9px] text-gray-400 font-normal mt-0.5">
                    Share this premium unstitched suit with your friends or family members on WhatsApp.
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 rounded-lg border border-stone-200 overflow-hidden bg-white text-xs divide-x divide-stone-200 shadow-sm">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="py-2.5 px-3 hover:bg-emerald-50 text-emerald-700 font-bold transition-all flex items-center justify-center gap-2 cursor-pointer outline-none"
                >
                  <span className="text-sm">💬</span>
                  Share WhatsApp
                </button>
                
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-2.5 px-3 hover:bg-stone-50 text-[#1e152a] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer outline-none"
                >
                  <span className="text-sm">{copiedLink ? '✅' : '🔗'}</span>
                  {copiedLink ? 'Copied Link!' : 'Copy Page Link'}
                </button>
              </div>
            </div>

            {/* Guaranteed Trust badge icons */}
            <div className="grid grid-cols-3 gap-3 pt-4 text-center">
              <div className="p-3 bg-[#faf9f6] rounded-lg border border-gray-100 flex flex-col items-center">
                <Shield size={16} className="text-[#c5a880] mb-1" />
                <span className="text-[10px] font-bold text-[#1e152a]">100% Genuine</span>
                <span className="text-[9px] text-gray-400">Premium Fabrics Only</span>
              </div>
              <div className="p-3 bg-[#faf9f6] rounded-lg border border-gray-100 flex flex-col items-center">
                <RefreshCw size={16} className="text-[#c5a880] mb-1" />
                <span className="text-[10px] font-bold text-[#1e152a]">Easy Returns</span>
                <span className="text-[9px] text-gray-400">Within 7 Days S.O.P</span>
              </div>
              <div className="p-3 bg-[#faf9f6] rounded-lg border border-gray-100 flex flex-col items-center">
                <Truck size={16} className="text-[#c5a880] mb-1" />
                <span className="text-[10px] font-bold text-[#1e152a]">Swift Delivery</span>
                <span className="text-[9px] text-gray-400">Dispatch Across Pakistan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review system layout panel (Permanently Stored, Approved ones displayed) */}
      <h2 id="reviews-section-header" className="font-serif text-2xl text-[#1e152a] font-extrabold tracking-tight mt-16 mb-6 pb-2 border-b border-[#e1d9cd]">
        Customer Reviews & Testimonials
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form panel to submit feedback */}
        <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl p-6 shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#1e152a]">Share Your Honest Experience</h3>
          <p className="text-xs text-gray-400">
            Write down details about the texture fallback, quality of the tila thread, dyeing quality or printing. Your critique directly benefits others!
          </p>

          <form onSubmit={handleReviewSubmit} className="space-y-4 pt-1">
            {reviewSuccessMessage && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-lg font-medium leading-relaxed animate-fade-in">
                {reviewSuccessMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Your Full Name</label>
              <input
                type="text"
                placeholder="e.g. Maria Bibi / Saira Rasheed"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#faf9f6] border border-gray-200 focus:border-[#c5a880] rounded focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Fabric Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setReviewRating(stars)}
                    className="p-1 cursor-pointer transition-transform duration-100 hover:scale-120"
                  >
                    <Star
                      size={20}
                      className={stars <= reviewRating ? 'fill-amber-500 text-amber-500' : 'text-gray-200'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Review Comment</label>
              <textarea
                rows={4}
                required
                placeholder="Explain fabric color fastness, shrinkage details or embroidery weight..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#faf9f6] border border-gray-200 focus:border-[#c5a880] rounded focus:outline-none text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1e152a] text-white hover:bg-[#c5a880] hover:text-black font-bold uppercase text-[11px] tracking-widest rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Send size={12} />
              Submit For Approval
            </button>
          </form>
        </div>

        {/* List of customer testimonials */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs">
            <h3 className="font-serif font-bold text-lg text-[#1e152a] mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-[#c5a880]" />
              Verified Buyers Feedbacks ({approvedReviews.length})
            </h3>

            {approvedReviews.length === 0 ? (
              <div className="text-center py-12 bg-[#faf9f6] rounded-xl border border-dashed border-gray-100">
                <span className="text-4xl">🌸</span>
                <h4 className="font-serif font-bold text-md text-[#1e152a] mt-3">Be the first to write a review!</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                  Ensure to buy this high standard unstitched {product.name} suit and share your genuine review about fabric density and colors.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                {approvedReviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1e152a]/5 border border-[#1e152a]/10 flex items-center justify-center text-xs font-bold text-[#1e152a]">
                          {rev.customerName[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                            {rev.customerName}
                            <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider border border-emerald-100 inline-block font-sans">
                              Verified Buyer
                            </span>
                          </h4>
                          <span className="text-[10px] text-gray-400 block mt-0.5">
                            {new Date(rev.createdAt).toLocaleDateString('en-PK', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Display reviewer stars */}
                      <div className="flex gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-200'}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 font-sans font-light leading-relaxed pl-10">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related/Recommended Products Area */}
      {relatedList.length > 0 && (
        <div className="mt-16 pt-10 border-t border-[#e1d9cd]">
          <h2 className="font-serif text-2xl text-[#1e152a] font-extrabold tracking-tight mb-2">
            You May Also Like
          </h2>
          <p className="text-xs text-gray-500 mb-6 font-sans">
            Explore similar unstitched Premium designer lawn & cotton suit selections from Alhamd Fabrics.
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedList.map((p) => {
              const hasDiscount = p.isOnSale && p.originalPrice && p.originalPrice > p.price;
              const discountPercent = hasDiscount && p.originalPrice 
                ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) 
                : 0;

              return (
                <div 
                  key={p.id}
                  onClick={() => {
                    onProductClick(p.id);
                    // scroll to top immediately upon selecting a product
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer bg-white rounded-xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col h-full text-left"
                >
                  {/* Photo area with badges */}
                  <div className="relative aspect-[3/4] bg-[#faf9f6] overflow-hidden">
                    {p.images[0] ? (
                      <img 
                        src={p.images[0]} 
                        alt={p.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300 font-bold bg-stone-50 text-[10px]">NO IMAGE</div>
                    )}
                    
                    {/* Tags overlay */}
                    {p.promoTag && (
                      <span className="absolute top-2 left-2 bg-[#1e152a] text-[#f1ebd9] text-[9px] font-bold px-2 py-0.5 rounded tracking-wide shadow-xs font-sans">
                        {p.promoTag}
                      </span>
                    )}

                    {hasDiscount && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wide shadow-xs font-sans">
                        -{discountPercent}% OFF
                      </span>
                    )}
                    
                    {/* Hot label */}
                    {p.isHotSelling && !hasDiscount && (
                      <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wide shadow-xs font-sans">
                        🔥 HOT
                      </span>
                    )}
                  </div>

                  {/* Pricing / Meta details */}
                  <div className="p-3.5 flex-grow flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      <span className="block text-[10px] uppercase text-amber-600 font-extrabold tracking-wider">{p.category}</span>
                      <h3 className="font-serif font-bold text-xs sm:text-sm text-gray-800 group-hover:text-amber-700 transition-colors line-clamp-1">{p.name}</h3>
                    </div>
                    
                    <div className="flex items-center justify-between pt-1">
                      <div className="space-y-0.5">
                        <span className="block text-xs font-extrabold text-[#1e152a]">PKR {formatPKR(p.price)}</span>
                        {hasDiscount && p.originalPrice && (
                          <span className="block text-[10px] text-gray-400 line-through">PKR {formatPKR(p.originalPrice)}</span>
                        )}
                      </div>
                      
                      <div className="w-7 h-7 bg-[#1e152a]/5 rounded-full flex items-center justify-center text-[#1e152a] group-hover:bg-[#1e152a] group-hover:text-[#f1ebd9] transition-all">
                        <Plus size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
