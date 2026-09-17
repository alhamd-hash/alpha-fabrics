import React, { useState } from 'react';
import { CreditCard, ShoppingBag, Truck, Check, HelpCircle, ShieldCheck, Lock, ArrowRight, AlertCircle, RefreshCw, Upload, Tag, X } from 'lucide-react';
import { Product, Order, Coupon } from '../types';
import { formatPKR, calculateDeliveryCharges, compressImage } from '../utils';

interface CheckoutFormProps {
  cart: { product: Product; quantity: number; selectedImage: string }[];
  onSubmitOrder: (formData: any) => Promise<string>; // returns the new orderId
  onCancel: () => void;
  onClearCart: () => void;
  coupons?: Coupon[];
}

export default function CheckoutForm({
  cart,
  onSubmitOrder,
  onCancel,
  onClearCart,
  coupons = []
}: CheckoutFormProps) {
  // Customer details form state
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('Punjab');
  const [address, setAddress] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'advance'>('cod');

  // Advance Payment Details (JazzCash/EasyPaisa)
  const [advanceProvider, setAdvanceProvider] = useState<'jazzcash' | 'easypaisa'>('jazzcash');
  const [paymentReceiptImage, setPaymentReceiptImage] = useState<string>('');
  const [receiptError, setReceiptError] = useState('');

  // Order state handling
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [orderIdCreated, setOrderIdCreated] = useState('');
  const [purchasedSnapshot, setPurchasedSnapshot] = useState<{ name: string; quantity: number; price: number }[]>([]);

  // Snapshot states to preserve values once cart is cleared on checkout
  const [snapshotSubtotal, setSnapshotSubtotal] = useState(0);
  const [snapshotDeliveryCharges, setSnapshotDeliveryCharges] = useState(0);
  const [snapshotGrandTotal, setSnapshotGrandTotal] = useState(0);
  const [snapshotPaymentMethod, setSnapshotPaymentMethod] = useState<'cod' | 'advance'>('cod');
  const [snapshotAdvanceProvider, setSnapshotAdvanceProvider] = useState<'jazzcash' | 'easypaisa'>('jazzcash');

  // --- Promo Coupon States ---
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [snapshotCouponDiscount, setSnapshotCouponDiscount] = useState(0);
  const [snapshotCouponCode, setSnapshotCouponCode] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryCharges = calculateDeliveryCharges(subtotal);
  const advanceDiscount = paymentMethod === 'advance' ? 200 : 0;

  // Calculate dynamic coupon discount amount
  const getCouponDiscount = (coupon: Coupon | null) => {
    if (!coupon || !coupon.active) return 0;
    
    const now = new Date();
    if (coupon.activationDate && now < new Date(coupon.activationDate)) return 0;
    if (coupon.expiryDate && now > new Date(coupon.expiryDate)) return 0;

    if (coupon.applyTo === 'all') {
      if (coupon.discountType === 'flat') {
        return coupon.discountValue;
      } else {
        return Math.floor((subtotal * coupon.discountValue) / 100);
      }
    } else {
      // Apply only to specific product IDs
      const matchedItems = cart.filter(item => coupon.productIds?.includes(item.product.id));
      if (matchedItems.length === 0) return 0;
      
      if (coupon.discountType === 'flat') {
        return coupon.discountValue;
      } else {
        const applicableSum = matchedItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        return Math.floor((applicableSum * coupon.discountValue) / 100);
      }
    }
  };

  const couponDiscount = getCouponDiscount(appliedCoupon);
  const grandTotal = Math.max(0, subtotal + deliveryCharges - advanceDiscount - couponDiscount);

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setReceiptError('Please upload a valid image file (PNG, JPG, JPEG).');
      return;
    }
    if (file.size > 12 * 1024 * 1024) { // 12MB limit now that we compress
      setReceiptError('Image is too large. Please upload an image under 12MB.');
      return;
    }
    setReceiptError('');
    setIsProcessing(true);
    setProcessingStep('Compressing verification receipt screenshot...');
    try {
      const compressedBase64 = await compressImage(file, 800, 800, 0.6);
      setPaymentReceiptImage(compressedBase64);
    } catch (err) {
      console.error('Failed to compress receipt image:', err);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPaymentReceiptImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phoneNumber.trim() || !city.trim() || !address.trim()) {
      return;
    }

    if (paymentMethod === 'advance' && !paymentReceiptImage) {
      setReceiptError('Please upload your JazzCash or EasyPaisa payment receipt screenshot before submitting.');
      return;
    }

    // Begin Checkout Simulation process
    setIsProcessing(true);
    
    try {
      if (paymentMethod === 'advance') {
        setProcessingStep('Registering your JazzCash / EasyPaisa advance ledger...');
        await new Promise((r) => setTimeout(r, 1000));

        setProcessingStep('Validating uploaded transaction receipt file...');
        await new Promise((r) => setTimeout(r, 800));

        setProcessingStep('Saving order inquiry securely on Cloud-Linked Ledger...');
        await new Promise((r) => setTimeout(r, 700));
      } else {
        setProcessingStep('Confirming your Order request ledger...');
        await new Promise((r) => setTimeout(r, 1000));
      }

      // Compile payload
      const orderPayload = {
        customerName,
        whatsappNumber,
        phoneNumber,
        city,
        province,
        address,
        paymentMethod,
        paymentStatus: 'pending' as const, // Always 'pending' initially for safety, verifying later
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          selectedImage: item.selectedImage
        })),
        subtotal,
        deliveryCharges,
        total: grandTotal,
        couponCode: appliedCoupon ? appliedCoupon.id : '',
        couponDiscount: couponDiscount,
        ...(paymentMethod === 'advance' ? {
          advanceProvider,
          paymentReceiptImage
        } : {})
      };

      setSnapshotSubtotal(subtotal);
      setSnapshotDeliveryCharges(deliveryCharges);
      setSnapshotGrandTotal(grandTotal);
      setSnapshotPaymentMethod(paymentMethod);
      setSnapshotAdvanceProvider(advanceProvider);
      setSnapshotCouponDiscount(couponDiscount);
      setSnapshotCouponCode(appliedCoupon ? appliedCoupon.id : '');

      setPurchasedSnapshot(cart.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })));

      const newId = await onSubmitOrder(orderPayload);
      setOrderIdCreated(newId);
    } catch (err) {
      console.error(err);
      setReceiptError('Something went wrong during checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // If order was successfully completed, show checkout completion success panel!
  if (orderIdCreated) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6 animate-fade-in" id="order-success-screen">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border-2 border-emerald-400 mx-auto text-emerald-500 shadow-xs animate-bounce">
          <Check size={32} className="stroke-[3]" />
        </div>
        
        <div className="space-y-1.5">
          <span className="text-xs text-amber-600 font-extrabold uppercase tracking-wide">ALHAMDULILLAH!</span>
          <h2 className="font-serif text-2xl font-extrabold text-[#1e152a] tracking-tight">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-500 text-xs max-w-sm mx-auto leading-relaxed">
            Your beautiful clothing selection is locked down! We have registered your inquiry and our team is preparing it for secure Lahore dispatch.
          </p>
        </div>

        <div className="bg-[#faf9f6] border-2 border-[#e1d9cd] rounded-2xl p-6 text-left max-w-md mx-auto space-y-4 shadow-xs relative overflow-hidden" id="invoice-receipt-card">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#c5a880]/5 rounded-bl-full pointer-events-none" />
          
          <div className="text-center pb-3 border-b border-[#e1d9cd]/50 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#1e152a] p-0.5 border border-[#c5a880] overflow-hidden mb-1.5 shadow-2xs">
              <img 
                src="/alpha-fabrics-icon-transparent.png" 
                alt="Al-Hamd Fabrics" 
                className="w-full h-full object-contain" 
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="font-serif font-extrabold text-sm uppercase text-[#1e152a] tracking-widest">
              Al-Hamd Fabrics
            </h3>
            <span className="text-[10px] text-gray-400 font-sans block mt-0.5 tracking-wider uppercase font-light">
              Lahore Premium Heritage • Sourced Manga Mandi
            </span>
          </div>

          <div className="text-xs space-y-2.5 text-gray-600">
            <div className="flex justify-between items-center bg-[#1e152a]/5 p-2 rounded border border-[#e1d9cd]/40">
              <span className="font-bold uppercase text-[9px] text-[#1e152a]">Order Code:</span>
              <strong className="text-[#c5a880] font-mono text-sm leading-none select-all">{orderIdCreated}</strong>
            </div>

            <div className="space-y-1 mt-1 font-sans">
              <div className="flex justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-400">Recipient Name:</span>
                <strong className="text-gray-900">{customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-400">Contact Phone:</span>
                <strong className="text-gray-900 font-mono">{phoneNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-400">Destination:</span>
                <strong className="text-gray-900">{city}, {province}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-400">Payment Method:</span>
                <strong className={`uppercase text-[9px] px-1.5 py-0.5 rounded border font-bold ${
                  snapshotPaymentMethod === 'advance' ? 'bg-indigo-50 text-indigo-700 border-indigo-150' : 'bg-amber-50 text-amber-800 border-amber-100'
                }`}>
                  {snapshotPaymentMethod === 'advance' ? `ADVANCE (${snapshotAdvanceProvider.toUpperCase()}) - PENDING` : 'C.O.D (AWAITING)'}
                </strong>
              </div>
            </div>

            {/* List the purchased items snapshotted */}
            <div className="border-t border-b border-dashed border-[#e1d9cd] py-3 my-2 bg-stone-50/50 px-2.5 rounded-xl">
              <span className="text-[9px] font-extrabold uppercase text-[#c5a880] tracking-widest block mb-2">Invoiced Fabric Suites:</span>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 no-scrollbar">
                {purchasedSnapshot.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] text-gray-750 font-sans gap-2 leading-tight">
                    <span className="truncate flex-1 font-medium text-gray-800">{item.name}</span>
                    <span className="text-gray-400 text-[10px] shrink-0">×{item.quantity}</span>
                    <strong className="text-gray-850 font-mono text-[11px] shrink-0">{formatPKR(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Price lines */}
            <div className="space-y-1 text-[11px] text-gray-650 pt-1">
              <div className="flex justify-between">
                <span>Fabric Subtotal:</span>
                <strong className="font-mono">{formatPKR(snapshotSubtotal)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Shipping Surcharge:</span>
                <strong className="font-mono text-gray-750">{formatPKR(snapshotDeliveryCharges)}</strong>
              </div>
              {snapshotCouponDiscount > 0 && (
                <div className="flex justify-between text-purple-700 font-semibold">
                  <span>Promo Code Applied ({snapshotCouponCode}):</span>
                  <strong className="font-mono">-{formatPKR(snapshotCouponDiscount)}</strong>
                </div>
              )}
              {snapshotPaymentMethod === 'advance' && (
                <div className="flex justify-between text-indigo-700 font-semibold">
                  <span>Advance Payment Discount:</span>
                  <strong className="font-mono">-PKR 200</strong>
                </div>
              )}
              <div className="flex justify-between text-[#1e152a] font-extrabold text-xs pt-2.5 border-t border-[#e1d9cd]/60">
                <span className="uppercase tracking-wider text-[10px] text-gray-900">Total Bill Due:</span>
                <span className="text-sm font-black text-[#c5a880] font-sans">{formatPKR(snapshotGrandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-3.5 max-w-sm mx-auto font-sans">
          {snapshotPaymentMethod === 'advance' && (
            <div className="p-3 bg-indigo-50 border border-indigo-150 rounded-xl text-center">
              <p className="text-[11px] text-indigo-700 font-bold leading-relaxed">
                ⚖️ ADVANCE PAYMENT RECEIVED (PENDING VERIFICATION)
              </p>
              <p className="text-[10px] text-gray-600 mt-1 leading-relaxed font-light">
                Our accounting team will verify your payment receipt. The order status will turn **Confirmed** once Zaffar Iqbal verifies the ledger.
              </p>
            </div>
          )}

          <div className="p-3 bg-amber-50/60 border border-amber-200/50 rounded-xl text-center">
            <p className="text-[11px] text-[#c5a880] font-bold leading-relaxed">
              📸 PLEASE TAKE A SCREENSHOT OF THIS INVOICE RECEIPT!
            </p>
            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed font-light">
              Order Code is required for tracking. Use code <strong className="font-mono text-gray-800 select-all font-bold">{orderIdCreated}</strong> in the <strong>Track Order</strong> portal at the top menu to check live لاہور dispatch schedules.
            </p>
          </div>
          <button
            onClick={() => {
              onClearCart();
              onCancel();
            }}
            className="w-full py-3 bg-[#1e152a] text-[#f1ebd9] hover:bg-[#c5a880] hover:text-black font-extrabold uppercase text-xs tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="checkout-form-container">
      {/* Checkout Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-[#1e152a]/70 backdrop-blur-xs flex flex-col items-center justify-center z-50 p-6 text-center animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl space-y-4">
            <RefreshCw size={44} className="text-[#c5a880] animate-spin mx-auto" />
            <h3 className="font-serif font-bold text-lg text-[#1e152a]">Processing Checkout...</h3>
            <p className="text-xs text-gray-500 font-mono p-2 bg-[#faf9f6] border border-gray-100 rounded leading-relaxed animate-pulse">
              {processingStep}
            </p>
            <p className="text-[10px] text-gray-400">
              Please do lock your screen or reload. Connecting securely with standard APIs.
            </p>
          </div>
        </div>
      )}

      <h1 className="font-serif text-3xl text-[#1e152a] font-extrabold tracking-tight mb-8 pb-3 border-b border-[#e1d9cd]">
        Order Checkout & Dispatch Request
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Checkout Inputs (Grid-Columns: 7) */}
        <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Delivery Details */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <span className="w-5 h-5 bg-[#c5a880] text-black font-bold text-[10px] rounded-full flex items-center justify-center">1</span>
              <h2 className="font-serif font-bold text-md text-[#1e152a] tracking-wide uppercase">Shipping & Delivery Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Recipient Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zafar Iqbal / Ayesha Bibi"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf9f6] border border-gray-200 focus:border-[#c5a880] rounded focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Primary Phone Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 03001234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf9f6] border border-gray-200 focus:border-[#c5a880] rounded focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">WhatsApp Inquiry Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="e.g. 03053131133"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf9f6] border border-gray-200 focus:border-[#c5a880] rounded focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">City <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lahore, Karachi, Manga Mandi"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf9f6] border border-gray-200 focus:border-[#c5a880] rounded focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Province <span className="text-red-500">*</span></label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf9f6] border border-gray-200 focus:border-[#c5a880] rounded focus:outline-none text-xs text-gray-700"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Khyber Pakhtunkhwa (KPK)">Khyber Pakhtunkhwa (KPK)</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Azad Kashmir">Azad Kashmir</option>
                  <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Complete Delivery Address <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={3}
                  placeholder="House number, Street name, Mohallah, Area details..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf9f6] border border-gray-200 focus:border-[#c5a880] rounded focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Selector and Simulation */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <span className="w-5 h-5 bg-[#c5a880] text-black font-bold text-[10px] rounded-full flex items-center justify-center">2</span>
              <h2 className="font-serif font-bold text-md text-[#1e152a] tracking-wide uppercase">Select Secured Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-none">
              {/* COD */}
              <label className={`block px-5 py-4 border rounded-xl cursor-pointer transition-all ${
                paymentMethod === 'cod' ? 'border-[#1e152a] bg-[#1e152a]/5 shadow-2xs' : 'border-gray-200 hover:border-[#c5a880]'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_opt"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-[#100c18] focus:ring-[#c5a880] w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-sm block text-gray-800">Cash On Delivery (COD)</span>
                      <span className="text-[10px] text-gray-400">Pay when suit reaches Lahore/Pakistan</span>
                    </div>
                  </div>
                  <Truck size={20} className={paymentMethod === 'cod' ? 'text-[#c5a880]' : 'text-gray-400'} />
                </div>
              </label>

              {/* Advance Payment (JazzCash/EasyPaisa) */}
              <label className={`block px-5 py-4 border rounded-xl cursor-pointer transition-all ${
                paymentMethod === 'advance' ? 'border-[#1e152a] bg-[#1e152a]/5 shadow-2xs' : 'border-gray-200 hover:border-[#c5a880]'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_opt"
                      checked={paymentMethod === 'advance'}
                      onChange={() => setPaymentMethod('advance')}
                      className="text-[#100c18] focus:ring-[#c5a880] w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-sm block text-gray-800">
                        JazzCash / EasyPaisa Advance
                        <span className="ml-1.5 bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded font-extrabold font-mono uppercase tracking-wider">
                          SAVE PKR 200
                        </span>
                      </span>
                      <span className="text-[10px] text-gray-400">PKR 200 relaxation on advance payments</span>
                    </div>
                  </div>
                  <CreditCard size={20} className={paymentMethod === 'advance' ? 'text-[#c5a880]' : 'text-gray-400'} />
                </div>
              </label>
            </div>

            {/* Advance Payment Instructions with Upload field */}
            {paymentMethod === 'advance' && (
              <div className="p-5 bg-stone-50 rounded-xl border border-gray-200/80 space-y-4 animate-fade-in animate-duration-300">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
                  <span className="text-xs text-[#222] font-mono leading-none flex items-center gap-1 font-bold">
                    📲 CHOOSE YOUR ADVANCE WALLET
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pb-1">
                  <button
                    type="button"
                    onClick={() => setAdvanceProvider('jazzcash')}
                    className={`py-2.5 px-4 rounded border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      advanceProvider === 'jazzcash'
                        ? 'bg-[#c5a880] border-[#c5a880] text-black shadow-xs'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    🎨 JazzCash Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdvanceProvider('easypaisa')}
                    className={`py-2.5 px-4 rounded border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      advanceProvider === 'easypaisa'
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    ☘️ EasyPaisa Wallet
                  </button>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-3 shadow-3xs">
                  <div className="text-xs text-gray-850 font-sans space-y-2 leading-relaxed">
                    <p className="text-[11px] uppercase tracking-wider font-extrabold text-[#c5a880]">
                      Official Account Details
                    </p>
                    <div className="grid grid-cols-1 gap-2 bg-[#faf9f6] p-3 rounded border border-gray-150 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Bank / Mobile Wallet:</span>
                        <strong className="text-gray-900 text-xs font-extrabold">
                          {advanceProvider === 'jazzcash' ? 'JazzCash Mobile Wallet' : 'EasyPaisa Mobile Wallet'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Account Number (Account Holder ID):</span>
                        <strong className="text-gray-900 text-sm font-mono tracking-wide">03053131133</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Account Title / Holder:</span>
                        <strong className="text-[#1e152a] text-xs font-extrabold">Zaffar Iqbal</strong>
                      </div>
                    </div>
                    <p className="text-[11px] text-red-500 font-bold mt-1.5">
                      ⚠️ instruction: Please transfer exactly <strong className="font-mono text-gray-850 bg-stone-100 px-1">{formatPKR(grandTotal)}</strong> to the account above first, then take a screenshot of the receipt and upload it below.
                    </p>
                  </div>
                </div>

                {receiptError && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-750 text-xs rounded font-medium flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{receiptError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-gray-700 uppercase">
                    Upload Payment Receipt (Screenshot or Transaction Slip) <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer bg-white hover:bg-gray-50/50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                        <Upload size={22} className="text-[#c5a880] mb-1" />
                        <p className="text-[11px] text-gray-600 font-bold mb-0.5">Click to upload or Drag & Drop screenshot</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono font-light">PNG, JPG, JPEG (Max 2MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleReceiptUpload}
                      />
                    </label>
                  </div>

                  {paymentReceiptImage && (
                    <div className="mt-2.5 p-2 bg-white border border-gray-200 rounded flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 border border-gray-150 rounded overflow-hidden flex-none">
                        <img src={paymentReceiptImage} alt="Payment Receipt" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-emerald-600 font-bold block">✓ Receipt Image Attached</span>
                        <span className="text-[9px] text-gray-400 block truncate">Ready for Lahore administrator checkout review.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPaymentReceiptImage('')}
                        className="text-red-500 text-xs font-bold hover:underline cursor-pointer px-2"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 pt-1 border-t border-dashed border-gray-270">
                  <Lock size={12} className="text-[#a98d63]" />
                  <span>Encrypted receipt stored inside sandbox database layers securely.</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-4 border border-[#e1d9cd] text-[#1e152a] hover:bg-gray-100 font-bold uppercase text-xs tracking-wider rounded-xs transition-colors cursor-pointer"
            >
              Back To Cart
            </button>
            <button
              type="submit"
              className="w-full py-4 bg-[#1e152a] hover:bg-emerald-700 text-white font-extrabold uppercase text-xs tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              Submit Order ({formatPKR(grandTotal)})
              <ArrowRight size={14} />
            </button>
          </div>
        </form>

        {/* Right Column: Order Invoice details (Grid-Columns: 5) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-100 p-5 sm:p-6 shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#1e152a] pb-3 border-b border-gray-100 flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#c5a880]" />
            Checkout Ledger Overview
          </h3>

          {/* Cart items review */}
          <div className="divide-y divide-gray-100 max-h-[290px] overflow-y-auto pr-2 no-scrollbar">
            {cart.map((item, index) => (
              <div key={index} className="py-2.5 flex items-center gap-3 text-xs">
                <div className="w-12 h-16 rounded overflow-hidden flex-none bg-gray-50 border border-gray-100">
                  <img src={item.selectedImage} alt={item.product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover object-top" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 line-clamp-1">{item.product.name}</h4>
                  <span className="text-[10px] text-gray-400 block mt-0.5 font-semibold">Qty: {item.quantity}</span>
                  <span className="text-gray-500 font-mono text-[10px] block mt-0.5">{formatPKR(item.product.price)} each</span>
                </div>
                <span className="font-bold text-gray-800 text-right shrink-0">
                  {formatPKR(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Promo Coupon Entry field */}
          <div className="py-3.5 bg-stone-50 rounded-xl p-3 border border-gray-150 space-y-2 mt-2 text-left">
            <span className="text-[10px] font-bold uppercase text-gray-400 block tracking-wider">Promo Coupon Discount</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ENTER CODE (e.g. SUMMER500)"
                value={couponCodeInput}
                onChange={(e) => {
                  setCouponCodeInput(e.target.value.toUpperCase().trim());
                  setCouponError('');
                  setCouponSuccess('');
                }}
                className="bg-white border text-gray-800 rounded px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden focus:border-[#1e152a] uppercase flex-1 shadow-3xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (!couponCodeInput) {
                    setCouponError('Please enter a coupon code.');
                    return;
                  }
                  const matched = coupons.find(c => c.id.toUpperCase() === couponCodeInput.toUpperCase());
                  if (!matched) {
                    setCouponError('Invalid coupon code. Please try again.');
                    setAppliedCoupon(null);
                    return;
                  }
                  if (!matched.active) {
                    setCouponError('This promo coupon has expired or is deactivated.');
                    setAppliedCoupon(null);
                    return;
                  }

                  const now = new Date();
                  if (matched.activationDate) {
                    const activation = new Date(matched.activationDate);
                    if (now < activation) {
                      setCouponError(`This promo code is not active yet. It will activate on ${activation.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}.`);
                      setAppliedCoupon(null);
                      return;
                    }
                  }
                  if (matched.expiryDate) {
                    const expiry = new Date(matched.expiryDate);
                    if (now > expiry) {
                      setCouponError(`This promo code has expired on ${expiry.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}.`);
                      setAppliedCoupon(null);
                      return;
                    }
                  }
                  
                  if (matched.applyTo === 'specific') {
                    const matchedItems = cart.filter(item => matched.productIds?.includes(item.product.id));
                    if (matchedItems.length === 0) {
                      setCouponError('This coupon does not apply to any suite inside your Shopping cart.');
                      setAppliedCoupon(null);
                      return;
                    }
                  }
                  
                  setAppliedCoupon(matched);
                  setCouponSuccess('Promotion coupon code applied successfully!');
                  setCouponError('');
                }}
                className="bg-[#1e152a] text-[#f1ebd9] px-3.5 py-1.5 rounded text-xs font-bold uppercase hover:bg-[#c5a880] hover:text-black transition-colors shrink-0 cursor-pointer"
              >
                Apply
              </button>
            </div>

            {couponError && (
              <p className="text-[10.5px] text-red-650 font-medium leading-none mt-1 text-left">⚠️ {couponError}</p>
            )}
            {couponSuccess && (
              <p className="text-[10.5px] text-emerald-600 font-bold leading-none mt-1 text-left">✓ {couponSuccess}</p>
            )}

            {appliedCoupon && (
              <div className="flex items-center justify-between text-[10.5px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 mt-1 rounded-md animate-fade-in text-left">
                <span className="font-bold uppercase tracking-wider font-sans leading-none">
                  {appliedCoupon.id} ({appliedCoupon.discountType === 'flat' ? `${formatPKR(appliedCoupon.discountValue)} Off` : `${appliedCoupon.discountValue}% Off`})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAppliedCoupon(null);
                    setCouponCodeInput('');
                    setCouponSuccess('');
                    setCouponError('');
                  }}
                  className="text-red-500 hover:text-red-700 font-bold focus:outline-hidden scale-110 ml-2 cursor-pointer leading-none"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Settlement ledger rules */}
          <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Items Subtotal:</span>
              <strong className="text-gray-800">{formatPKR(subtotal)}</strong>
            </div>
            
            <div className="flex justify-between text-gray-500 items-center">
              <span className="flex items-center gap-1.5">
                Delivery Surcharge:
                {subtotal > 6000 && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded-sm uppercase tracking-wide text-[9px] font-bold">
                    FREE LIMIT
                  </span>
                )}
              </span>
              <strong className={subtotal > 6000 ? 'text-emerald-600 line-through' : 'text-gray-800'}>
                {formatPKR(deliveryCharges)}
              </strong>
            </div>

            {deliveryCharges > 0 && (
              <div className="p-3 bg-amber-50/50 border border-amber-100/50 rounded-lg text-amber-800 text-[10px] leading-relaxed">
                📢 Delivery becomes <strong>FREE automatically</strong> if your cart total exceeds <strong>PKR 6,000</strong>. Buy for {formatPKR(6001 - subtotal)} more to qualify!
              </div>
            )}

            {paymentMethod === 'advance' && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Advance Payment Relaxation:</span>
                <span>-{formatPKR(200)}</span>
              </div>
            )}

            {couponDiscount > 0 && (
              <div className="flex justify-between text-purple-700 font-extrabold animate-fade-in">
                <span className="flex items-center gap-1">
                  <Tag size={12} />
                  Coupon Discount ({appliedCoupon?.id}):
                </span>
                <span>-{formatPKR(couponDiscount)}</span>
              </div>
            )}

            <div className="pt-3.5 border-t border-gray-100 flex justify-between text-base font-bold text-[#1e152a]">
              <span>Settled Balance due:</span>
              <span className="text-[#c5a880] text-lg font-extrabold">{formatPKR(grandTotal)}</span>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-gray-400 font-light space-y-1">
            <div className="flex gap-2">
              <ShieldCheck size={14} className="text-[#c5a880] shrink-0" />
              <span>Standard delivery fee holds at 300 PKR across Pakistan.</span>
            </div>
            <div className="flex gap-2">
              <Lock size={14} className="text-[#c5a880] shrink-0" />
              <span>Full SSL support for Cash on Delivery and credit validation.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
