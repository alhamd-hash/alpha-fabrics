import React, { useState } from 'react';
import {
  Lock, Settings, ShoppingBag, MessageSquare, Plus, Trash2, Edit2, Filter,
  Calendar, Check, X, LogOut, CheckCircle, Flame, Mail, Send, Eye, Users, AlertTriangle, FileText, Sparkles, Tag, Upload, Calculator, Loader, Globe
} from 'lucide-react';
import { Product, Collection, Category, Order, Review, Subscription, OrderStatus, NewsletterNotification, HomeBanner, MarketingSettings, SeoSettings, Coupon } from '../types';
import { formatPKR, compressImage } from '../utils';

interface AdminPanelProps {
  products: Product[];
  collections: Collection[];
  categories: Category[];
  orders: Order[];
  reviews: Review[];
  subscriptions: Subscription[];
  notifications: NewsletterNotification[];
  banners: HomeBanner[];
  onAddProduct: (prod: Product) => void;
  onEditProduct: (prod: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddCollection: (col: Collection) => void;
  onEditCollection: (col: Collection) => void;
  onDeleteCollection: (id: string) => void;
  onAddCategory: (cat: Category) => void;
  onEditCategory: (cat: Category) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdatePaymentStatus: (orderId: string, status: 'pending' | 'paid' | 'failed') => void;
  onMarkOrderReceived: (orderId: string) => void;
  onApproveReview: (reviewId: string) => void;
  onRejectReview: (reviewId: string) => void;
  onSendProductNotification: (prodName: string, prodImage: string) => void;
  onAddBanner: (banner: HomeBanner) => void;
  onUpdateBanner: (bannerId: string, banner: HomeBanner) => void;
  onDeleteBanner: (bannerId: string) => void;
  onClose: () => void;
  onRestoreDefaults?: () => Promise<void>;
  isAuthenticatedProp?: boolean;
  onLogout?: () => void;
  seoSettings: SeoSettings | null;
  onSaveSeoSettings: (settings: SeoSettings) => Promise<void>;
  coupons?: Coupon[];
  onAddCoupon?: (coupon: Coupon) => void;
  onDeleteCoupon?: (id: string) => void;
  onDeleteOrders?: (orderIds: string[]) => void;
}

export default function AdminPanel({
  products,
  collections,
  categories = [],
  orders,
  reviews,
  subscriptions,
  notifications,
  banners = [],
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onAddCollection,
  onEditCollection,
  onDeleteCollection,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onUpdateOrderStatus,
  onUpdatePaymentStatus,
  onMarkOrderReceived,
  onApproveReview,
  onRejectReview,
  onSendProductNotification,
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner,
  onClose,
  onRestoreDefaults,
  isAuthenticatedProp = false,
  onLogout,
  seoSettings,
  onSaveSeoSettings,
  coupons = [],
  onAddCoupon,
  onDeleteCoupon,
  onDeleteOrders
}: AdminPanelProps) {
  // Authentication State
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(isAuthenticatedProp);
  const [loginError, setLoginError] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);

  // Sync state if prop changes
  React.useEffect(() => {
    setIsAuthenticated(isAuthenticatedProp);
  }, [isAuthenticatedProp]);

  // Dashboard Sub-views
  const [currentTab, setCurrentTab] = useState<'orders' | 'reviews' | 'banners' | 'collections' | 'categories' | 'subscribers' | 'products' | 'marketing_pixel' | 'seo' | 'coupons'>('orders');

  // --- Admin SEO Tab States ---
  const [seoFormTitle, setSeoFormTitle] = useState('');
  const [seoFormDescription, setSeoFormDescription] = useState('');
  const [seoFormKeywords, setSeoFormKeywords] = useState('');
  const [seoFormStatus, setSeoFormStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [seoErrorMessage, setSeoErrorMessage] = useState('');
  const [isSeoInitialized, setIsSeoInitialized] = useState(false);

  React.useEffect(() => {
    if (seoSettings) {
      setSeoFormTitle(seoSettings.title);
      setSeoFormDescription(seoSettings.description);
      setSeoFormKeywords(seoSettings.keywords);
      setIsSeoInitialized(true);
    } else if (!isSeoInitialized) {
      setSeoFormTitle('Al-Hamd Fabrics | Premium Lawn Suits & Unstitched Gents Fabrics');
      setSeoFormDescription("Discover Al-Hamd Fabrics Lahore's exquisite collections of luxury unstitched lawn, premium gents Giza cotton, and festive ceremonial suits. Real-time updates direct from our database.");
      setSeoFormKeywords('Al-Hamd Fabrics, Lawn Suits, Unstitched, Gents Fabrics, Cotton, Pakistan Fashion, Lahore');
      setIsSeoInitialized(true);
    }
  }, [seoSettings, isSeoInitialized]);

  // --- Marketing Pixel States ---
  const [pixelId, setPixelId] = useState('');
  const [pixelEnabled, setPixelEnabled] = useState(false);
  const [isLoadingPixel, setIsLoadingPixel] = useState(true);
  const [pixelSaveStatus, setPixelSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [pixelError, setPixelError] = useState('');
  const [pixelSuccess, setPixelSuccess] = useState('');
  const [pixelVerificationState, setPixelVerificationState] = useState<'idle' | 'checking' | 'verified' | 'failed'>('idle');
  const [pixelLatency, setPixelLatency] = useState<number | null>(null);
  const [pixelWarning, setPixelWarning] = useState('');

  // Zoomed-in receipt image modal state
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);

  // --- Order Filter states ---
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [datePeriod, setDatePeriod] = useState<'all' | 'lasthour' | 'today' | '7days' | 'lastmonth' | 'custom'>('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // --- New Collection Form States ---
  const [showColForm, setShowColForm] = useState(false);
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [colName, setColName] = useState('');
  const [colDesc, setColDesc] = useState('');
  const [colImage, setColImage] = useState('');
  const [colBanner, setColBanner] = useState('');
  const [colIsGents, setColIsGents] = useState(true);
  const [colShowInNavbar, setColShowInNavbar] = useState(true);
  const [colShowProductsOnHomepage, setColShowProductsOnHomepage] = useState(false);
  const [colHomepageLayoutStyle, setColHomepageLayoutStyle] = useState<'grid' | 'carousel'>('grid');
  const [colIsCombine, setColIsCombine] = useState(false);
  const [colLinkedCategoryIds, setColLinkedCategoryIds] = useState<string[]>([]);

  // --- New Category Form States ---
  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catIsGents, setCatIsGents] = useState(true);
  const [catShowInNavbar, setCatShowInNavbar] = useState(true);
  const [catShowProductsOnHomepage, setCatShowProductsOnHomepage] = useState(false);

  // --- New Product Form States ---
  const [showProdForm, setShowProdForm] = useState(false);
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [prodCode, setProdCode] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodShort, setProdShort] = useState('');
  const [prodInventory, setProdInventory] = useState<number | ''>('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodCategory, setProdCategory] = useState('');
  const [prodCollection, setProdCollection] = useState('');
  const [prodImage1, setProdImage1] = useState('');
  const [prodImage2, setProdImage2] = useState('');
  const [prodImage3, setProdImage3] = useState('');
  const [prodImage4, setProdImage4] = useState('');
  const [prodImage5, setProdImage5] = useState('');
  const [isOnSale, setIsOnSale] = useState(false);
  const [prodOriginalPrice, setProdOriginalPrice] = useState(0);
  const [promoTag, setPromoTag] = useState('');
  const [prodSelectedCollections, setProdSelectedCollections] = useState<string[]>([]);
  const [prodSelectedCategories, setProdSelectedCategories] = useState<string[]>([]);
  
  // Specs and Ladies Suit Details
  const [specFabric, setSpecFabric] = useState('');
  const [specDupatta, setSpecDupatta] = useState('');
  const [specShirt, setSpecShirt] = useState('');
  const [specTrouser, setSpecTrouser] = useState('');
  const [specStyle, setSpecStyle] = useState('');

  const [isLadiesSuit, setIsLadiesSuit] = useState(true);
  const [ladiesShirtDetail, setLadiesShirtDetail] = useState('');
  const [ladiesDupattaDetail, setLadiesDupattaDetail] = useState('');
  const [ladiesTrouserDetail, setLadiesTrouserDetail] = useState('');
  const [ladiesFabricType, setLadiesFabricType] = useState('Lawn & Silk');
  const [ladiesEmbroidery, setLadiesEmbroidery] = useState('');

  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isHotSelling, setIsHotSelling] = useState(false);
  const [prodRelatedType, setProdRelatedType] = useState<'auto' | 'custom'>('auto');
  const [prodCustomRelatedIds, setProdCustomRelatedIds] = useState<string[]>([]);
  const [relatedSearch, setRelatedSearch] = useState('');

  // Admin Catalog Search & Row Flags Filter
  const [adminProductSearch, setAdminProductSearch] = useState('');
  const [adminProductFilterType, setAdminProductFilterType] = useState<'all' | 'newArrivals' | 'hotSelling'>('all');

  // --- New/Edit Home Banner Form States ---
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerCtaText, setBannerCtaText] = useState('Shop Collection');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerTargetView, setBannerTargetView] = useState<'home' | 'collection' | 'category' | 'product'>('home');
  const [bannerTargetPayload, setBannerTargetPayload] = useState('');
  const [bannerBadge, setBannerBadge] = useState('EID SPECIAL');
  const [bannerIsActive, setBannerIsActive] = useState(true);
  const [bannerOrder, setBannerOrder] = useState(0);
  const [bannerImageError, setBannerImageError] = useState('');

  // Dual levels dropdown state (legacy, kept for references)
  const [bannerLinkType, setBannerLinkType] = useState<'gents-collection' | 'gents-category' | 'ladies-collection' | 'ladies-category' | 'none'>('none');
  
  // --- Enhanced Guided Redirection Wizard States ---
  const [bannerHasLink, setBannerHasLink] = useState(false);
  const [bannerLinkTargetType, setBannerLinkTargetType] = useState<'product' | 'collection' | 'category'>('collection');
  const [bannerGenderType, setBannerGenderType] = useState<'gents' | 'ladies'>('gents');
  const [bannerSelectedColId, setBannerSelectedColId] = useState<string>('');
  const [bannerSelectedCatName, setBannerSelectedCatName] = useState<string>('');
  const [bannerProductSearchMode, setBannerProductSearchMode] = useState<'gents-collection' | 'gents-category' | 'ladies-collection' | 'ladies-category' | null>(null);

  const [bannerIdToDelete, setBannerIdToDelete] = useState<string | null>(null);
  const [activeConfirmKey, setActiveConfirmKey] = useState<string | null>(null);

  // --- New/Edit Coupon Form States ---
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscountType, setCouponDiscountType] = useState<'flat' | 'percentage'>('flat');
  const [couponDiscountValue, setCouponDiscountValue] = useState(0);
  const [couponApplyTo, setCouponApplyTo] = useState<'all' | 'specific'>('all');
  const [couponSelectedProductIds, setCouponSelectedProductIds] = useState<string[]>([]);
  const [couponActive, setCouponActive] = useState(true);
  const [couponSearchProduct, setCouponSearchProduct] = useState('');
  const [couponActivationDate, setCouponActivationDate] = useState('');
  const [couponExpiryDate, setCouponExpiryDate] = useState('');
  const [couponActivateNow, setCouponActivateNow] = useState(true);

  // Interactive Delete Assistant states
  const [deleteWizardType, setDeleteWizardType] = useState<'gents-col' | 'gents-cat' | 'ladies-col' | 'ladies-cat' | null>(null);
  const [deleteWizardSelectedId, setDeleteWizardSelectedId] = useState<string>('');

  // --- Order Deletion Feature States ---
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [bulkDeleteStatus, setBulkDeleteStatus] = useState<'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled' | 'all'>('all');
  const [bulkDeleteTimeframe, setBulkDeleteTimeframe] = useState<'24h' | '7d' | 'all'>('all');
  const [showBulkDeletePanel, setShowBulkDeletePanel] = useState(false);
  const [bulkDeleteConfirmationText, setBulkDeleteConfirmationText] = useState('');
  const [isDeletingOrders, setIsDeletingOrders] = useState(false);
  const handleSaveMarketingPixel = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSaveSeoSettings = (e: React.FormEvent) => {
    e.preventDefault();
  };



  // Authentication submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'alHamdNeweb') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Astaghfirullah! Invalid Password. Please check and try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setLoginError('');
    if (onLogout) {
      onLogout();
    }
  };

  // Date Filtering Logic
  const filterOrdersByDateAndStatus = (orderList: Order[]) => {
    let result = [...orderList];

    // 1. Filter by Status
    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter);
    }

    // 2. Filter by Date Range
    const now = new Date();
    
    if (datePeriod === 'lasthour') {
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      result = result.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= oneHourAgo && orderDate <= now;
      });
    } else if (datePeriod === 'today') {
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      result = result.filter(o => new Date(o.createdAt) >= startOfToday);
    } else if (datePeriod === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter(o => new Date(o.createdAt) >= sevenDaysAgo);
    } else if (datePeriod === 'lastmonth') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      result = result.filter(o => new Date(o.createdAt) >= thirtyDaysAgo);
    } else if (datePeriod === 'custom') {
      if (customStart) {
        const customStartDate = new Date(customStart);
        result = result.filter(o => new Date(o.createdAt) >= customStartDate);
      }
      if (customEnd) {
        const customEndDate = new Date(customEnd);
        // Adjust end date to capture the entire end day
        customEndDate.setHours(23, 59, 59, 999);
        result = result.filter(o => new Date(o.createdAt) <= customEndDate);
      }
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const filteredOrders = filterOrdersByDateAndStatus(orders);

  // --- Order deletion action handlers ---
  const [bulkConfirmStage, setBulkConfirmStage] = useState<'idle' | 'confirming'>('idle');
  const [selectedConfirmStage, setSelectedConfirmStage] = useState<'idle' | 'confirming'>('idle');
  const [bulkDeleteMessage, setBulkDeleteMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const getMatchingBulkOrderCount = () => {
    let matches = [...orders];
    // Filter by Status
    if (bulkDeleteStatus !== 'all') {
      matches = matches.filter(o => o.status === bulkDeleteStatus);
    }
    // Filter by Timeframe
    const now = new Date();
    if (bulkDeleteTimeframe === '24h') {
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      matches = matches.filter(o => new Date(o.createdAt) >= oneDayAgo);
    } else if (bulkDeleteTimeframe === '7d') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matches = matches.filter(o => new Date(o.createdAt) >= sevenDaysAgo);
    }
    return matches.length;
  };

  const handleBulkDeleteOrdersSubmit = async () => {
    if (!onDeleteOrders) return;
    setIsDeletingOrders(true);
    setBulkDeleteMessage(null);
    try {
      let matches = [...orders];

      // Filter by Status
      if (bulkDeleteStatus !== 'all') {
        matches = matches.filter(o => o.status === bulkDeleteStatus);
      }

      // Filter by Timeframe
      const now = new Date();
      if (bulkDeleteTimeframe === '24h') {
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        matches = matches.filter(o => new Date(o.createdAt) >= oneDayAgo);
      } else if (bulkDeleteTimeframe === '7d') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matches = matches.filter(o => new Date(o.createdAt) >= sevenDaysAgo);
      }

      const matchIds = matches.map(o => o.id);
      if (matchIds.length === 0) {
        setBulkDeleteMessage({ text: "No matching orders found inside the chosen timeline and status filters.", type: 'info' });
        setBulkConfirmStage('idle');
        return;
      }

      await onDeleteOrders(matchIds);
      
      // Clear selection states
      setSelectedOrderIds(prev => prev.filter(id => !matchIds.includes(id)));
      setBulkDeleteMessage({ text: `Successfully deleted ${matchIds.length} orders permanently from live database.`, type: 'success' });
      setBulkConfirmStage('idle');
      // Reset after a short delay
      setTimeout(() => {
        setShowBulkDeletePanel(false);
        setBulkDeleteMessage(null);
      }, 3000);
    } catch (e) {
      console.error("Bulk delete error: ", e);
      setBulkDeleteMessage({ text: "An error occurred while bulk deleting orders from database.", type: 'error' });
    } finally {
      setIsDeletingOrders(false);
    }
  };

  // Delete selected targeted orders
  const handleDeleteSelectedOrdersSubmit = async () => {
    if (!onDeleteOrders || selectedOrderIds.length === 0) return;
    setIsDeletingOrders(true);
    try {
      await onDeleteOrders(selectedOrderIds);
      setSelectedOrderIds([]);
      setSelectedConfirmStage('idle');
    } catch (e) {
      console.error("Selected delete error: ", e);
    } finally {
      setIsDeletingOrders(false);
    }
  };

  // Toggle order in selection list
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrderIds(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  // Toggle all filtered orders on current page
  const toggleAllFilteredOrders = () => {
    const allFilteredIds = filteredOrders.map(o => o.id);
    const areAllSelected = allFilteredIds.every(id => selectedOrderIds.includes(id));

    if (areAllSelected) {
      // Deselect all filtered
      setSelectedOrderIds(prev => prev.filter(id => !allFilteredIds.includes(id)));
    } else {
      // Select all filtered (add non-duplicates)
      setSelectedOrderIds(prev => {
        const additions = allFilteredIds.filter(id => !prev.includes(id));
        return [...prev, ...additions];
      });
    }
  };

  // Stats Counters
  const pendingReviewsCount = reviews.filter(r => !r.approved).length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;

  // Save/Update Collection
  const handleCollectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colName.trim()) return;

    const payload: Collection = {
      id: editingColId || `col-${Date.now()}`,
      name: colName,
      description: colDesc || 'Premium clothing collection catalog item.',
      image: colImage || 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=300&h=300',
      banner: colBanner || 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=1200&h=400',
      isGents: colIsGents,
      showInNavbar: colShowInNavbar,
      showProductsOnHomepage: colShowProductsOnHomepage,
      homepageLayoutStyle: colHomepageLayoutStyle,
      isCombine: colIsCombine,
      linkedCategoryIds: colLinkedCategoryIds
    };

    if (editingColId) {
      onEditCollection(payload);
    } else {
      onAddCollection(payload);
    }

    // Reset
    setColName('');
    setColDesc('');
    setColImage('');
    setColBanner('');
    setColIsGents(true);
    setColShowInNavbar(true);
    setColShowProductsOnHomepage(false);
    setColHomepageLayoutStyle('grid');
    setColIsCombine(false);
    setColLinkedCategoryIds([]);
    setEditingColId(null);
    setShowColForm(false);
  };

  const startEditCollection = (col: Collection) => {
    setEditingColId(col.id);
    setColName(col.name);
    setColDesc(col.description);
    setColImage(col.image);
    setColBanner(col.banner);
    setColIsGents(col.isGents !== false);
    setColShowInNavbar(col.showInNavbar !== false);
    setColShowProductsOnHomepage(col.showProductsOnHomepage || false);
    setColHomepageLayoutStyle(col.homepageLayoutStyle || 'grid');
    setColIsCombine(!!col.isCombine);
    setColLinkedCategoryIds(col.linkedCategoryIds || []);
    setShowColForm(true);
  };

  // Save/Update Category
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const payload: Category = {
      id: editingCatId || `cat-${Date.now()}`,
      name: catName,
      description: catDesc || 'Product category description.',
      isGents: catIsGents,
      showInNavbar: catShowInNavbar,
      showProductsOnHomepage: catShowProductsOnHomepage
    };

    if (editingCatId) {
      onEditCategory(payload);
    } else {
      onAddCategory(payload);
    }

    // Reset
    setCatName('');
    setCatDesc('');
    setCatIsGents(true);
    setCatShowInNavbar(true);
    setCatShowProductsOnHomepage(false);
    setEditingCatId(null);
    setShowCatForm(false);
  };

  const startEditCategory = (cat: Category) => {
    setEditingCatId(cat.id);
    setCatName(cat.name);
    setCatDesc(cat.description);
    setCatIsGents(cat.isGents);
    setCatShowInNavbar(cat.showInNavbar !== false);
    setCatShowProductsOnHomepage(cat.showProductsOnHomepage || false);
    setShowCatForm(true);
  };

  // Save/Update Product
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || prodPrice <= 0) {
      alert("Sahi product title aur price likhein!");
      return;
    }

    const imagesArray = [prodImage1, prodImage2, prodImage3, prodImage4, prodImage5]
      .map(img => img.trim())
      .filter(img => img !== '');

    if (imagesArray.length < 2) {
      alert("Product save krne k liye kam se kam 2 images enter ya upload kryn! (Min 2, Max 5 Allowed)");
      return;
    }

    if (prodSelectedCollections.length === 0) {
      alert("Please check kam se kam aik collection select lzmi kryn!");
      return;
    }

    if (prodSelectedCategories.length === 0) {
      alert("Please check kam se kam aik category select lzmi kryn!");
      return;
    }

    const firstCol = prodSelectedCollections[0];
    const firstCat = prodSelectedCategories[0];

    const payload: Product = {
      id: editingProdId || `prod-${Date.now()}`,
      code: prodCode ? prodCode.trim() : `ALH-${Math.floor(1000 + Math.random() * 9000)}`, // auto assign if empty
      inventory: prodInventory !== '' ? Number(prodInventory) : undefined,
      name: prodName,
      shortDetails: prodShort || `${specStyle} Premium Collection`,
      description: prodDesc || 'Elegantly tailored traditional unstitched suit fabric with exquisite pattern design details.',
      price: prodPrice,
      images: imagesArray,
      category: firstCat,
      collectionId: firstCol,
      collectionIds: prodSelectedCollections,
      categories: prodSelectedCategories,
      specifications: {
        ...(specFabric.trim() ? { 'Fabric': specFabric.trim() } : {}),
        ...(specDupatta.trim() ? { 'Dupatta': specDupatta.trim() } : {}),
        ...(specShirt.trim() ? { 'Shirt': specShirt.trim() } : {}),
        ...(specTrouser.trim() ? { 'Trouser': specTrouser.trim() } : {}),
        ...(specStyle.trim() ? { 'Style': specStyle.trim() } : {})
      },
      isLadiesSuit,
      isNewArrival,
      isHotSelling,
      rating: 4.8,
      isOnSale,
      originalPrice: isOnSale ? prodOriginalPrice : undefined,
      promoTag: promoTag.trim() || undefined,
      relatedType: prodRelatedType,
      customRelatedIds: prodRelatedType === 'custom' ? prodCustomRelatedIds : []
    };

    if (editingProdId) {
      onEditProduct(payload);
    } else {
      onAddProduct(payload);
      
      // Dispatch Simulated email notification on new product arrival!
      onSendProductNotification(payload.name, imagesArray[0]);
    }

    // Reset Form states
    setEditingProdId(null);
    setProdCode('');
    setProdInventory('');
    setProdName('');
    setProdShort('');
    setProdDesc('');
    setProdPrice(0);
    setProdCategory('');
    setProdCollection('');
    setProdImage1('');
    setProdImage2('');
    setProdImage3('');
    setProdImage4('');
    setProdImage5('');
    setIsOnSale(false);
    setProdOriginalPrice(0);
    setPromoTag('');
    setProdSelectedCollections([]);
    setProdSelectedCategories([]);
    
    setSpecFabric('');
    setSpecDupatta('');
    setSpecShirt('');
    setSpecTrouser('');
    setSpecStyle('');

    setIsLadiesSuit(true);
    setLadiesShirtDetail('');
    setLadiesDupattaDetail('');
    setLadiesTrouserDetail('');
    setLadiesFabricType('Lawn & Silk');
    setLadiesEmbroidery('');

    setIsNewArrival(true);
    setIsHotSelling(false);
    setProdRelatedType('auto');
    setProdCustomRelatedIds([]);
    setRelatedSearch('');
    
    setShowProdForm(false);
  };

  const startEditProduct = (prod: Product) => {
    setEditingProdId(prod.id);
    setProdCode(prod.code || '');
    setProdInventory(prod.inventory !== undefined ? prod.inventory : '');
    setProdName(prod.name);
    setProdShort(prod.shortDetails);
    setProdDesc(prod.description);
    setProdPrice(prod.price);
    setProdCategory(prod.category);
    setProdCollection(prod.collectionId);
    
    setProdImage1(prod.images[0] || '');
    setProdImage2(prod.images[1] || '');
    setProdImage3(prod.images[2] || '');
    setProdImage4(prod.images[3] || '');
    setProdImage5(prod.images[4] || '');

    setIsOnSale(!!prod.isOnSale);
    setProdOriginalPrice(prod.originalPrice || 0);
    setPromoTag(prod.promoTag || '');

    setProdSelectedCollections(prod.collectionIds || (prod.collectionId ? [prod.collectionId] : []));
    setProdSelectedCategories(prod.categories || (prod.category ? [prod.category] : []));

    setSpecFabric(prod.specifications?.['Fabric'] || '');
    setSpecDupatta(prod.specifications?.['Dupatta'] || '');
    setSpecShirt(prod.specifications?.['Shirt'] || '');
    setSpecTrouser(prod.specifications?.['Trouser'] || '');
    setSpecStyle(prod.specifications?.['Style'] || '');

    setIsLadiesSuit(prod.isLadiesSuit !== false);
    setIsNewArrival(!!prod.isNewArrival);
    setIsHotSelling(!!prod.isHotSelling);
    setProdRelatedType(prod.relatedType || 'auto');
    setProdCustomRelatedIds(prod.customRelatedIds || []);

    setShowProdForm(true);
  };

  // --- Home Banner Form Handlers ---
  const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setBannerImageError('The image is too large! Please upload a photo under 10MB.');
      return;
    }

    setBannerImageError('');
    try {
      const compressed = await compressImage(file, 1200, 600, 0.75);
      setBannerImage(compressed);
    } catch (err) {
      console.error('Failed to compress banner image:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setBannerImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerImage.trim()) {
      setBannerImageError('Banner must have an image!');
      return;
    }

    const payload: HomeBanner = {
      id: editingBannerId || `banner-${Date.now()}`,
      title: bannerTitle,
      subtitle: bannerSubtitle,
      ctaText: bannerCtaText,
      image: bannerImage,
      targetView: bannerTargetView,
      targetPayload: bannerTargetPayload,
      badge: bannerBadge,
      isActive: bannerIsActive,
      order: Number(bannerOrder) || 0
    };

    if (editingBannerId) {
      await onUpdateBanner(editingBannerId, payload);
    } else {
      await onAddBanner(payload);
    }

    resetBannerForm();
  };

  const startEditBanner = (banner: HomeBanner) => {
    setEditingBannerId(banner.id);
    setBannerTitle(banner.title);
    setBannerSubtitle(banner.subtitle);
    setBannerCtaText(banner.ctaText);
    setBannerImage(banner.image);
    setBannerTargetView(banner.targetView || 'home');
    setBannerTargetPayload(banner.targetPayload || '');
    setBannerBadge(banner.badge);
    setBannerIsActive(banner.isActive);
    setBannerOrder(banner.order);
    setBannerImageError('');

    // Dynamically calculate guided step states based on stored targets
    if (banner.targetView === 'home' || !banner.targetView) {
      setBannerHasLink(false);
      setBannerLinkTargetType('collection');
      setBannerGenderType('gents');
      setBannerSelectedColId('');
      setBannerSelectedCatName('');
      setBannerProductSearchMode(null);
    } else if (banner.targetView === 'collection') {
      setBannerHasLink(true);
      setBannerLinkTargetType('collection');
      const parentCol = collections.find(c => c.id === banner.targetPayload);
      if (parentCol && parentCol.isGents) {
        setBannerGenderType('gents');
      } else {
        setBannerGenderType('ladies');
      }
      setBannerSelectedColId(banner.targetPayload || '');
    } else if (banner.targetView === 'category') {
      setBannerHasLink(true);
      setBannerLinkTargetType('category');
      const matchedCat = categories.find(c => c.name.toLowerCase().trim() === banner.targetPayload.toLowerCase().trim());
      if (matchedCat && matchedCat.isGents) {
        setBannerGenderType('gents');
      } else {
        const isGentsCat = ['Shalwar Kameez', 'Wash & Wear', 'Cotton Suits', 'Casual Wear', 'Premium Suits'].includes(banner.targetPayload);
        setBannerGenderType(isGentsCat ? 'gents' : 'ladies');
      }
      setBannerSelectedCatName(banner.targetPayload || '');
    } else if (banner.targetView === 'product') {
      setBannerHasLink(true);
      setBannerLinkTargetType('product');
      const targetProd = products.find(p => p.id === banner.targetPayload);
      if (targetProd) {
        if (targetProd.isLadiesSuit) {
          if (targetProd.collectionId && targetProd.collectionId !== '') {
            setBannerProductSearchMode('ladies-collection');
            setBannerSelectedColId(targetProd.collectionId);
          } else {
            setBannerProductSearchMode('ladies-category');
            setBannerSelectedCatName(targetProd.category || '');
          }
        } else {
          if (targetProd.collectionId && targetProd.collectionId !== '') {
            setBannerProductSearchMode('gents-collection');
            setBannerSelectedColId(targetProd.collectionId);
          } else {
            setBannerProductSearchMode('gents-category');
            setBannerSelectedCatName(targetProd.category || '');
          }
        }
      }
    }

    setShowBannerForm(true);
  };

  const resetBannerForm = () => {
    setEditingBannerId(null);
    setBannerTitle('');
    setBannerSubtitle('');
    setBannerCtaText('Shop Collection');
    setBannerImage('');
    setBannerTargetView('home');
    setBannerTargetPayload('');
    setBannerBadge('EID SPECIAL');
    setBannerIsActive(true);
    setBannerOrder(banners.length);
    setBannerImageError('');
    setBannerLinkType('none');

    // Reset advanced guided steps
    setBannerHasLink(false);
    setBannerLinkTargetType('collection');
    setBannerGenderType('gents');
    setBannerSelectedColId('');
    setBannerSelectedCatName('');
    setBannerProductSearchMode(null);

    setShowBannerForm(false);
  };

  // If Admin is not logged in, showcase secure locks form
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-6 animate-fade-in" id="admin-login-screen">
        <div className="w-20 h-20 bg-[#1e152a] rounded-full flex items-center justify-center border-2 border-[#c5a880] mx-auto text-[#c5a880] shadow-md overflow-hidden p-2">
          <img 
            src="/header-logo-dark-bg.png" 
            alt="Al-Hamd Fabrics Admin Console" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="space-y-1">
          <h2 className="font-serif text-2xl font-bold text-[#1e152a]">Al-Hamd Fabrics Admin Console</h2>
          <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Strict Authorised Entry Only</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white border border-gray-100 rounded-xl p-6 shadow-md text-left space-y-4">
          {loginError && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded font-medium flex items-center gap-2">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Enter Admin Security Key</label>
            <input
              type="password"
              placeholder="••••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#faf9f6] border border-gray-200 focus:border-[#c5a880] rounded focus:outline-none text-xs text-center tracking-widest"
              id="admin-passfield"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-xs font-semibold rounded hover:bg-gray-50 uppercase cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#1e152a] text-white text-xs font-bold rounded hover:bg-[#c5a880] hover:text-black transition-colors uppercase tracking-wider cursor-pointer shadow-sm"
              id="admin-login-submit"
            >
              Log In
            </button>
          </div>
        </form>

        <p className="text-[10px] text-gray-400">
          Note: This terminal logs IP, login timestamps, and modifications automatically for security and auditing.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="admin-main-console">
      {/* Dashboard Top Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 mb-8 border-b border-[#e1d9cd]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1e152a] rounded-full flex items-center justify-center border border-[#c5a880] overflow-hidden p-1 shrink-0">
            <img 
              src="/alpha-fabrics-icon-transparent.png" 
              alt="Al-Hamd Fabrics Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-extrabold text-[#1e152a]">Admin Control Hub</h1>
            <p className="text-gray-400 text-[10px] sm:text-xs">
              Manga Mandi Headquarters | Lahore, Pakistan (Owner Zafar Iqbal logs)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          <button
            onClick={onClose}
            className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold border border-gray-200 rounded text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Store View
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold bg-[#1e152a] hover:bg-red-700 text-[#f1ebd9] rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            Logout
          </button>
        </div>
      </div>

      {/* Grid container layout for Sidebar Nav + Selected Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Admin sidebar (Grid-Columns: 3) */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-xl p-4 shadow-3xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block px-2.5 mb-2">Management Tabs</span>

          <button
            onClick={() => setCurrentTab('orders')}
            className={`w-full flex items-center justify-between px-3 py-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              currentTab === 'orders' ? 'bg-[#1e152a] text-[#f1ebd9]' : 'text-gray-600 hover:bg-gray-50 hover:text-black'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag size={14} className="text-[#c5a880]" />
              Manage Orders
            </span>
            {pendingOrdersCount > 0 && (
              <span className="bg-[#c5a880] text-black font-extrabold text-[9px] px-2 py-0.5 rounded-full animate-pulse uppercase">
                {pendingOrdersCount} NEW
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('reviews')}
            className={`w-full flex items-center justify-between px-3 py-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              currentTab === 'reviews' ? 'bg-[#1e152a] text-[#f1ebd9]' : 'text-gray-600 hover:bg-gray-50 hover:text-black'
            }`}
          >
            <span className="flex items-center gap-2">
              <MessageSquare size={14} className="text-[#c5a880]" />
              Approve Reviews
            </span>
            {pendingReviewsCount > 0 && (
              <span className="bg-[#c5a880] text-black font-extrabold text-[9px] px-2 py-0.5 rounded-full animate-bounce uppercase">
                {pendingReviewsCount} Pending
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('banners')}
            className={`w-full flex items-center justify-between px-3 py-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              currentTab === 'banners' ? 'bg-[#1e152a] text-[#f1ebd9]' : 'text-gray-600 hover:bg-gray-50 hover:text-black'
            }`}
          >
            <span className="flex items-center gap-2">
              <Eye size={14} className="text-[#c5a880]" />
              Home Page Banners
            </span>
            {banners.length > 0 && (
              <span className="bg-[#c5a880]/20 text-[#c5a880] font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">
                {banners.length} Banners
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('collections')}
            className={`w-full flex items-center justify-between px-3 py-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              currentTab === 'collections' ? 'bg-[#1e152a] text-[#f1ebd9]' : 'text-gray-600 hover:bg-gray-50 hover:text-black'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#c5a880]" />
              Manage Collections
            </span>
            {collections.length > 0 && (
              <span className="bg-[#c5a880]/20 text-[#c5a880] font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">
                {collections.length} Cols
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('categories')}
            className={`w-full flex items-center justify-between px-3 py-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              currentTab === 'categories' ? 'bg-[#1e152a] text-[#f1ebd9]' : 'text-gray-600 hover:bg-gray-50 hover:text-black'
            }`}
          >
            <span className="flex items-center gap-2">
              <Tag size={14} className="text-[#c5a880]" />
              Manage Categories
            </span>
            {categories.length > 0 && (
              <span className="bg-[#c5a880]/20 text-[#c5a880] font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">
                {categories.length} Cats
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('products')}
            className={`w-full flex items-center justify-between px-3 py-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              currentTab === 'products' ? 'bg-[#1e152a] text-[#f1ebd9]' : 'text-gray-600 hover:bg-gray-50 hover:text-black'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag size={14} className="text-[#c5a880]" />
              Manage Products
            </span>
            {products.length > 0 && (
              <span className="bg-[#a89270] text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">
                {products.length} Suits
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('subscribers')}
            className={`w-full flex items-center justify-between px-3 py-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              currentTab === 'subscribers' ? 'bg-[#1e152a] text-[#f1ebd9]' : 'text-gray-600 hover:bg-gray-50 hover:text-black'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users size={14} className="text-[#c5a880]" />
              Subscribers & Logs
            </span>
            {subscriptions.length > 0 && (
              <span className="bg-[#c5a880]/20 text-[#c5a880] font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">
                {subscriptions.length} Subs
              </span>
            )}
          </button>



          <button
            onClick={() => setCurrentTab('coupons')}
            className={`w-full flex items-center justify-between px-3 py-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              currentTab === 'coupons' ? 'bg-[#1e152a] text-[#f1ebd9]' : 'text-gray-600 hover:bg-gray-50 hover:text-black'
            }`}
            id="admin-sidebar-tab-coupons"
          >
            <span className="flex items-center gap-2">
              <Tag size={14} className="text-[#c5a880]" />
              Manage Coupons
            </span>
            <span className="bg-purple-100 text-purple-800 border border-purple-200 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">
              Promo Codes
            </span>
          </button>

          {onRestoreDefaults && (
            <div className="mt-4 pt-4 border-t border-gray-100 text-left">
              <span className="text-[10px] font-bold text-[#c5a880] uppercase tracking-widest block px-2.5 mb-2">Db Utilities</span>
              <div className="p-3 bg-stone-50 border border-gray-200 rounded-lg space-y-2.5">
                <p className="text-[10px] text-gray-500 leading-normal font-medium">
                  If the store database is empty or was cleared, use this to instantly restore the standard Al-Hamd collections, categories, and inventory.
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm("Restore standard Al-Hamd Fabrics collections, categories, and products to live database? This will rewrite standard entries!")) {
                      setIsSeeding(true);
                      try {
                        await onRestoreDefaults();
                      } catch (e) {
                        console.error('Failed to manually seed DB:', e);
                      } finally {
                        setIsSeeding(false);
                      }
                    }
                  }}
                  disabled={isSeeding}
                  className="w-full py-2 px-3 bg-stone-100 hover:bg-[#c5a880]/20 text-gray-700 hover:text-black font-extrabold uppercase text-[9px] tracking-wider border border-gray-200 rounded cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  {isSeeding ? (
                    <>
                      <Loader size={11} className="animate-spin text-[#c5a880]" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={11} className="text-[#c5a880]" />
                      <span>Restore Demo Data</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Dashboard Detail Panel (Grid-Columns: 9) */}
        <div className="lg:col-span-9 bg-white border border-gray-100 rounded-xl p-5 sm:p-6 shadow-3xs">
          
          {/* TAB 1:ORDERS MANAGEMENT */}
          {currentTab === 'orders' && (
            <div className="space-y-6">
              {/* Filter grid pane */}
              <div className="p-4 bg-stone-50 rounded-xl border border-gray-200/60 text-xs space-y-4">
                <div className="flex items-center gap-1 pb-2 border-b border-gray-200/60 text-gray-700 font-serif font-bold text-sm">
                  <Filter size={15} className="text-[#c5a880]" />
                  <span>Configure Active Orders Queries</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Status */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Status Query</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="w-full bg-white border border-gray-200 px-2.5 py-1.5 rounded focus:outline-none focus:border-[#c5a880]"
                    >
                      <option value="all">Display All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="On The Way">On The Way</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Date Period Selector */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Date Window Period</label>
                    <select
                      value={datePeriod}
                      onChange={(e) => setDatePeriod(e.target.value as any)}
                      className="w-full bg-white border border-gray-200 px-2.5 py-1.5 rounded focus:outline-none focus:border-[#c5a880]"
                    >
                      <option value="all">Lifetime Records</option>
                      <option value="lasthour">Last Decidual Hour</option>
                      <option value="today">Today (Past 24 Hrs)</option>
                      <option value="7days">Last 7 Days</option>
                      <option value="lastmonth">Last Calendar Month</option>
                      <option value="custom">Custom Specified Range</option>
                    </select>
                  </div>

                  {/* Empty Spacer */}
                  <div className="hidden md:block" />

                  {/* Custom Calendar bounds */}
                  {datePeriod === 'custom' && (
                    <div className="col-span-1 sm:col-span-2 grid grid-cols-2 gap-2 animate-fade-in">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Lower Date Bound</label>
                        <input
                          type="date"
                          value={customStart}
                          onChange={(e) => setCustomStart(e.target.value)}
                          className="w-full bg-white border border-gray-200 px-2.5 py-1.5 rounded focus:outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Upper Date Bound</label>
                        <input
                          type="date"
                          value={customEnd}
                          onChange={(e) => setCustomEnd(e.target.value)}
                          className="w-full bg-white border border-gray-200 px-2.5 py-1.5 rounded focus:outline-none text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* --- Order Deletion Command Center --- */}
              <div className="bg-rose-50/40 rounded-xl border border-rose-100 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="space-y-0.5">
                    <h4 className="font-semibold text-xs text-rose-900 flex items-center gap-1.5 uppercase tracking-wide">
                      <Trash2 size={13} className="text-rose-600 stroke-[2.5]" />
                      Database Maintenance & Order Purging
                    </h4>
                    <p className="text-[10px] text-rose-700/80">
                      Permanently erase order invoice records from live database files and release related metrics.
                    </p>
                  </div>
                  <div className="flex gap-2 self-stretch sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowBulkDeletePanel(!showBulkDeletePanel)}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase transition-all flex items-center gap-1 cursor-pointer ${
                        showBulkDeletePanel 
                          ? 'bg-rose-700 text-white shadow-xs' 
                          : 'bg-white text-rose-800 border border-rose-200 hover:bg-rose-50'
                      }`}
                    >
                      <Filter size={11} />
                      Bulk Deletion Tool
                    </button>

                    {selectedOrderIds.length > 0 && (
                      <div className="flex items-center gap-1">
                        {selectedConfirmStage === 'idle' ? (
                          <button
                            type="button"
                            onClick={() => setSelectedConfirmStage('confirming')}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase flex items-center gap-1.5 animate-pulse cursor-pointer"
                          >
                            <Trash2 size={11} />
                            Purge {selectedOrderIds.length} Selected/All
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 animate-fade-in">
                            <span className="text-[10px] font-bold text-rose-800 mr-1 animate-pulse">Confirm?</span>
                            <button
                              type="button"
                              onClick={handleDeleteSelectedOrdersSubmit}
                              disabled={isDeletingOrders}
                              className="bg-emerald-600 text-white px-2.5 py-1.5 rounded-md text-[10px] font-extrabold uppercase hover:bg-emerald-700 shadow-xs cursor-pointer"
                            >
                              Yes, Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedConfirmStage('idle')}
                              className="bg-gray-200 text-gray-700 px-2 py-1.5 rounded-md text-[10px] font-extrabold uppercase hover:bg-gray-300 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bulk delete setup control panel */}
                {showBulkDeletePanel && (
                  <div className="bg-white border border-rose-200 p-4 rounded-lg space-y-4 animate-fade-in text-left">
                    <div className="text-xs font-bold text-rose-900 border-b border-rose-100 pb-1.5 flex justify-between items-center">
                      <span>1. CONFIGURE BULK PURGE FILTER CRITERIA</span>
                      <span className="bg-rose-100 text-rose-800 font-mono text-[10px] px-2 py-0.5 rounded-full">
                        Matches: {getMatchingBulkOrderCount()} records
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* From dynamic category status */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                          Delete From Order Status
                        </label>
                        <select
                          value={bulkDeleteStatus}
                          onChange={(e) => {
                            setBulkDeleteStatus(e.target.value as any);
                            setBulkConfirmStage('idle');
                          }}
                          className="w-full bg-[#faf9f6]/40 border border-gray-200 text-xs px-2.5 py-1.5 rounded focus:outline-none focus:border-rose-500 font-medium"
                        >
                          <option value="all">ALL System Orders (Confirmed & Pending & Cancelled etc.)</option>
                          <option value="Pending">Only Pending Orders</option>
                          <option value="Confirmed">Only Confirmed Orders</option>
                          <option value="Delivered">Only Delivered Orders</option>
                          <option value="Cancelled">Only Cancelled Orders</option>
                        </select>
                      </div>

                      {/* Timeline filter */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                          Delete Registered Within Timeline
                        </label>
                        <select
                          value={bulkDeleteTimeframe}
                          onChange={(e) => {
                            setBulkDeleteTimeframe(e.target.value as any);
                            setBulkConfirmStage('idle');
                          }}
                          className="w-full bg-[#faf9f6]/40 border border-gray-200 text-xs px-2.5 py-1.5 rounded focus:outline-none focus:border-rose-500 font-medium"
                        >
                          <option value="all">All Timelines (Historical/Infinite)</option>
                          <option value="24h">Created Last 24 Hours Only</option>
                          <option value="7d">Created Last 7 Days Only</option>
                        </select>
                      </div>
                    </div>

                    {/* Safeguard checks */}
                    {getMatchingBulkOrderCount() > 0 ? (
                      <div className="bg-rose-50 rounded p-3 border border-dashed border-rose-200 space-y-3">
                        <div className="text-[11px] text-rose-800 leading-relaxed font-semibold">
                          ⚠️ Security Checkpoint: To safely proceed with purging <strong>{getMatchingBulkOrderCount()}</strong> orders matching status {bulkDeleteStatus === 'all' ? 'All' : bulkDeleteStatus} and timeline {bulkDeleteTimeframe === 'all' ? 'All' : bulkDeleteTimeframe === '24h' ? '24 Hours' : '7 Days'}, you must type <span className="underline font-bold text-rose-900 font-mono">DELETE</span> below to confirm.
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <input
                            type="text"
                            placeholder="Type 'DELETE' here..."
                            value={bulkDeleteConfirmationText}
                            onChange={(e) => setBulkDeleteConfirmationText(e.target.value)}
                            className="bg-white border border-gray-300 rounded text-xs px-3 py-1.5 focus:outline-none focus:border-rose-600 sm:w-48 font-mono"
                          />

                          {bulkConfirmStage === 'idle' ? (
                            <button
                              type="button"
                              onClick={() => {
                                if (bulkDeleteConfirmationText === 'DELETE') {
                                  setBulkConfirmStage('confirming');
                                }
                              }}
                              disabled={bulkDeleteConfirmationText !== 'DELETE' || isDeletingOrders}
                              className={`px-4 py-1.5 rounded text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 ${
                                bulkDeleteConfirmationText === 'DELETE'
                                  ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs'
                                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                              }`}
                            >
                              <Trash2 size={13} />
                              Review Purge Action
                            </button>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-red-700 font-bold animate-pulse mr-2">Irreversible! Confirm?</span>
                              <button
                                type="button"
                                onClick={handleBulkDeleteOrdersSubmit}
                                disabled={isDeletingOrders}
                                className="bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded text-[10px] font-extrabold uppercase shadow cursor-pointer"
                              >
                                {isDeletingOrders ? "Processing..." : "Purge Now"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setBulkConfirmStage('idle')}
                                className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-2 py-1.5 rounded text-[10px] font-extrabold uppercase cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-2 text-xs text-gray-400 font-medium">
                        (Zero actual orders match status '{bulkDeleteStatus}' & timeline '{bulkDeleteTimeframe === 'all' ? 'All' : bulkDeleteTimeframe}')
                      </div>
                    )}

                    {bulkDeleteMessage && (
                      <div className={`p-2 rounded text-[11px] font-bold ${
                        bulkDeleteMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800' :
                        bulkDeleteMessage.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'
                      }`}>
                        {bulkDeleteMessage.text}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Orders count layout summary */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleAllFilteredOrders}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded text-[10px] uppercase transition-all cursor-pointer"
                  >
                    <CheckCircle size={12} className={filteredOrders.length > 0 && filteredOrders.every(o => selectedOrderIds.includes(o.id)) ? "text-emerald-600" : "text-stone-400"} />
                    {filteredOrders.length > 0 && filteredOrders.every(o => selectedOrderIds.includes(o.id)) ? "Deselect All Filtered" : "Select All Filtered"}
                  </button>
                  <span className="text-gray-500">
                    Showing <strong>{filteredOrders.length}</strong> matching records (<strong>{selectedOrderIds.length}</strong> selected for purge)
                  </span>
                </div>
                {(statusFilter !== 'all' || datePeriod !== 'all') && (
                  <button
                    onClick={() => { setStatusFilter('all'); setDatePeriod('all'); }}
                    className="text-[#c5a880] font-bold hover:underline cursor-pointer"
                  >
                    Reset Filter Queries
                  </button>
                )}
              </div>

              {/* Main Orders listing accordion */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-100 rounded-xl">
                  <span className="text-4xl">🧾</span>
                  <h3 className="font-serif font-bold text-sm text-gray-800 mt-2">No Matching Invoices Found</h3>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">
                    Select a wider date coverage or status filters in order query panels above.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 no-scrollbar">
                  {filteredOrders.map(order => (
                    <div key={order.id} className="border border-gray-100 rounded-xl bg-[#faf9f6]/30 overflow-hidden shadow-2xs">
                      {/* Top ribbon header */}
                      <div className="p-4 bg-stone-50 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={selectedOrderIds.includes(order.id)}
                            onChange={() => toggleOrderSelection(order.id)}
                            className="w-4 h-4 rounded text-[#c5a880] focus:ring-[#c5a880]/30 border-gray-300 accent-[#c5a880] cursor-pointer"
                          />
                          <div>
                            <strong className="text-[#1e152a] font-mono text-[13px]">{order.id}</strong>
                            <span className="text-gray-400 block sm:inline sm:ml-2">
                              Placing: {new Date(order.createdAt).toLocaleString('en-PK')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {order.status === 'Delivered' && !order.isReceived && (
                            <button
                              type="button"
                              onClick={() => {
                                const key = 'order-received-' + order.id;
                                if (activeConfirmKey === key) {
                                  onMarkOrderReceived(order.id);
                                  setActiveConfirmKey(null);
                                } else {
                                  setActiveConfirmKey(key);
                                  setTimeout(() => setActiveConfirmKey(null), 5000);
                                }
                              }}
                              className={`py-1 px-2.5 font-extrabold text-[9px] sm:text-[10px] uppercase rounded-lg shadow-2xs transition-all tracking-wider cursor-pointer font-sans shrink-0 ${
                                activeConfirmKey === 'order-received-' + order.id
                                  ? 'bg-amber-500 text-black animate-bounce'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                              }`}
                            >
                              {activeConfirmKey === 'order-received-' + order.id ? '⚠️ Tap again to confirm!' : '✓ Received Parcel'}
                            </button>
                          )}

                          {order.isReceived && (
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-sm text-[9px] font-extrabold tracking-wide uppercase">
                              🎉 CONFIRMED RECEIVED
                            </span>
                          )}

                          {order.couponCode && (
                            <span className="bg-emerald-50 text-emerald-800 border border-[#b2e1bf] px-2 py-0.5 rounded-sm text-[9px] font-extrabold tracking-wide uppercase flex items-center gap-1">
                              <Tag size={10} className="stroke-[3]" />
                              PROMO CODE: {order.couponCode}
                            </span>
                          )}

                          <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider ${
                            order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-amber-50 text-amber-800 border border-amber-100'
                          }`}>
                            💳 {order.paymentMethod === 'advance' 
                              ? `ADVANCE (${order.advanceProvider?.toUpperCase() || 'MOBILE WALLET'}) - ${order.paymentStatus === 'paid' ? 'PAID/VERIFIED' : 'PENDING'}` 
                              : (order.paymentMethod.toUpperCase() === 'STRIPE' ? `STRIPE (${order.paymentStatus})` : `COD (${order.paymentStatus})`)}
                          </span>

                          <select
                            value={order.status || 'Pending'}
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className={`px-2 py-1 font-bold rounded-lg border text-[10px] uppercase shadow-2xs focus:outline-none cursor-pointer ${
                              order.status === 'Delivered' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' :
                              order.status === 'Cancelled' ? 'bg-red-50 border-red-300 text-red-600' :
                              order.status === 'Pending' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' :
                              'bg-amber-50 border-amber-300 text-amber-700'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="On The Way">On The Way</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Info split body */}
                      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                        <div className="md:col-span-4 space-y-1">
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Recipient Ledger</span>
                          {order.isReceived ? (
                            <div className="p-2.5 bg-emerald-50/50 border border-emerald-100 text-emerald-800 rounded-lg text-[10px] font-sans space-y-1 animate-fade-in">
                              <span className="font-bold block uppercase text-[8px] tracking-wider text-emerald-600">🎉 DATA CLEANED / RECEIVED</span>
                              <p className="text-gray-500 font-normal leading-relaxed">
                                Personal shipping numbers, recipient name, and address details have been permanently cleared from database logs.
                              </p>
                            </div>
                          ) : (
                            <>
                              <p className="font-bold text-gray-800">{order.customerName}</p>
                              <p className="text-gray-600 flex items-center gap-1.5 mt-1 font-mono">
                                📞 Phone: <strong>{order.phoneNumber}</strong>
                              </p>
                              {order.whatsappNumber && (
                                <p className="text-gray-600 flex items-center gap-1.5 font-mono">
                                  💬 WhatsApp: <strong>{order.whatsappNumber}</strong>
                                </p>
                              )}
                              <p className="text-gray-500 mt-1 leading-relaxed">
                                📍 {order.address}, {order.city}, {order.province}
                              </p>

                              {order.paymentMethod === 'advance' && (
                                <div className="mt-3 p-2.5 border border-dashed border-gray-200 rounded-lg bg-gray-50/50 space-y-2">
                                  <span className="text-[9px] uppercase font-bold text-gray-400 block pb-1 border-b border-gray-100">
                                    📸 ADVANCE TRANSFER RECEIPT
                                  </span>
                                  {order.paymentReceiptImage ? (
                                    <div className="space-y-1.5 focus:outline-none">
                                      <div className="relative group cursor-zoom-in max-w-[150px] border border-gray-150 rounded overflow-hidden shadow-3xs" onClick={() => setSelectedReceiptUrl(order.paymentReceiptImage || null)}>
                                        <img src={order.paymentReceiptImage} alt="Receipt Slip" className="w-full max-h-24 object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                          <Eye size={14} className="text-white" />
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => setSelectedReceiptUrl(order.paymentReceiptImage || null)}
                                        className="text-[10px] text-blue-650 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                                      >
                                        🔍 Zoom/View Receipt
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-red-500 font-semibold block">⚠️ No screenshot uploaded</span>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {/* Dispatch list items */}
                        <div className="md:col-span-5 space-y-2 border-t md:border-t-0 md:border-x border-gray-100 pt-3 md:pt-0 md:px-4">
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Invoiced Outfits</span>
                          <div className="space-y-2">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="flex items-center gap-3 font-sans pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                                {it.selectedImage && (
                                  <img
                                    src={it.selectedImage}
                                    alt={it.productName}
                                    className="w-12 h-16 object-cover bg-stone-100 rounded border border-gray-200 shrink-0 shadow-2xs"
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-800 line-clamp-2 select-all leading-tight">
                                    {it.productName}
                                  </p>
                                  <p className="text-gray-500 text-[10px] mt-1">
                                    Qty: <strong className="text-gray-800">{it.quantity}</strong> × {formatPKR(it.price)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Invoice summary billing */}
                        <div className="md:col-span-3 text-right space-y-1">
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold text-right">Invoice Sum</span>
                          {order.isReceived ? (
                            <div className="text-xs space-y-1">
                              <span className="text-gray-400 block">Personal billing redacted</span>
                              <strong className="text-emerald-700 block bg-emerald-50 p-1.5 rounded border border-emerald-100/45 text-[10px] text-center font-mono">
                                Total: {formatPKR(order.items.reduce((sum, it) => sum + (it.price * it.quantity), 0))}
                              </strong>
                            </div>
                          ) : (
                            <>
                              <div className="text-gray-500">
                                <span>Subtotal:</span> &nbsp;<strong className="text-gray-700">{formatPKR(order.subtotal)}</strong>
                              </div>
                              {order.couponCode && (
                                <div className="text-emerald-700 flex items-center justify-end gap-1 text-[11px] font-bold">
                                  <Tag size={12} className="inline-block shrink-0 stroke-[2.5]" />
                                  <span>Coupon ({order.couponCode}):</span> &nbsp;
                                  <strong className="text-emerald-700 font-mono">-{formatPKR(order.couponDiscount || 0)}</strong>
                                </div>
                              )}
                              {order.paymentMethod === 'advance' && (
                                <div className="text-amber-700 flex items-center justify-end gap-1 text-[11px] font-bold">
                                  <span>Advance Discount:</span> &nbsp;
                                  <strong className="text-amber-700 font-mono">-PKR 200</strong>
                                </div>
                              )}
                              <div className="text-gray-500 font-sans">
                                <span>Delivery Surcharge:</span> &nbsp;<strong className="text-gray-700">{formatPKR(order.deliveryCharges)}</strong>
                              </div>
                              <div className="text-sm font-bold pt-1.5 border-t border-[#f1ebd9] text-[#1e152a]">
                                <span>Grand Total:</span> &nbsp;<span className="text-[#c5a880] text-sm font-extrabold font-sans">{formatPKR(order.total)}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REVIEWS MANAGEMENT APPROVALS */}
          {currentTab === 'reviews' && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1e152a]">Verify customer reviews before publishing</h3>
                  <p className="text-xs text-gray-400">
                    To maintain store integrity, all incoming buyer reviews must be audited and published manually.
                  </p>
                </div>
                <span className="bg-[#1e152a] text-white px-3 py-1 font-bold text-xs rounded-full">
                  Pending approvals: {reviews.filter(r => !r.approved).length}
                </span>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-10 bg-stone-50 border border-dashed rounded-xl border-gray-100">
                  <span className="text-4xl">💬</span>
                  <h4 className="font-serif font-bold text-sm text-gray-800 mt-2">No Active testimonials submitted yet</h4>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                  {reviews.map(rev => (
                    <div
                      key={rev.id}
                      className={`p-4 border rounded-xl text-xs space-y-2 animate-fade-in transition-all ${
                        rev.approved ? 'border-gray-100 bg-[#faf9f6]/30' : 'border-amber-200 bg-amber-50/20 shadow-2xs'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <strong className="text-gray-800 text-sm block">{rev.customerName}</strong>
                          <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                            Product Reviewed: <strong className="text-gray-600 italic">"{rev.productName}"</strong>
                          </span>
                        </div>

                        {/* Status tag badges */}
                        <div className="flex gap-2 items-center">
                          <span className={`px-2 py-0.5 rounded-sm font-bold uppercase text-[8px] tracking-widest ${
                            rev.approved ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-amber-50 text-amber-800 border border-amber-100'
                          }`}>
                            {rev.approved ? 'APPROVED & LIVE' : 'AWAITING APPROVAL'}
                          </span>

                          <div className="text-amber-500 flex gap-0.5 scale-90">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Check key={i} size={10} className={`w-3 h-3 fill-amber-500 ${i < rev.rating ? 'opacity-100' : 'opacity-20'}`} />
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 font-sans italic p-2.5 bg-white border border-gray-100/50 rounded leading-relaxed">
                        "{rev.comment}"
                      </p>

                      <div className="flex justify-between items-center text-[10px] text-gray-400">
                        <span>Submitted Log timestamp: {new Date(rev.createdAt).toLocaleString()}</span>
                        
                        <div className="flex gap-1.5 shrink-0">
                          {!rev.approved && (
                            <button
                              onClick={() => { onApproveReview(rev.id); }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1 transition-colors uppercase cursor-pointer"
                            >
                              <Check size={11} />
                              Approve & Publish
                            </button>
                          )}
                          <button
                            onClick={() => { onRejectReview(rev.id); }}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded flex items-center gap-1 transition-colors uppercase cursor-pointer"
                          >
                            <X size={11} />
                            {rev.approved ? 'Revoke Review' : 'Reject & Delete'}
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2.5: HOME PAGE BANNERS MANAGEMENT */}
          {currentTab === 'banners' && (
            <div className="space-y-6 animate-fade-in">
              {/* CUSTOM IN-UI DELETE CONFIRMATION MODAL */}
              {bannerIdToDelete && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999] animate-fade-in">
                  <div className="bg-white p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl text-center border border-gray-100">
                    <span className="text-3xl inline-block mt-1">🗑️</span>
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-gray-900 text-base">Delete Banner?</h4>
                      <p className="text-stone-400 text-xs leading-relaxed">
                        This action will immediately remove this custom banner from the active slider carousel in the storefront.
                      </p>
                    </div>
                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setBannerIdToDelete(null)}
                        className="flex-1 py-2 border border-stone-200 hover:bg-stone-50 text-stone-600 font-bold text-xs rounded-md uppercase tracking-wider cursor-pointer transition-colors"
                      >
                        No, Keep it
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const id = bannerIdToDelete;
                          setBannerIdToDelete(null);
                          onDeleteBanner(id);
                        }}
                        className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-md uppercase tracking-wider cursor-pointer shadow-sm transition-colors"
                      >
                        Delete Banner
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1e152a]">Home Carousel Slider Banners</h3>
                  <p className="text-xs text-gray-400">
                    Upload new gallery photos, configure gorgeous titles and descriptions, customize button names, and link slides to categories/collections.
                  </p>
                </div>
                {!showBannerForm && (
                  <button
                    onClick={() => {
                      resetBannerForm();
                      setShowBannerForm(true);
                    }}
                    className="px-4 py-2 bg-[#1e152a] hover:bg-[#c5a880] text-white hover:text-black font-semibold text-xs rounded flex items-center gap-1.5 transition-all uppercase cursor-pointer"
                  >
                    <Plus size={14} />
                    Add New Banner
                  </button>
                )}
              </div>

              {/* BANNER EDIT / CREATE FORM */}
              {showBannerForm && (
                <form onSubmit={handleBannerSubmit} className="p-5 bg-stone-50 border border-gray-200/60 rounded-xl space-y-4 text-xs animate-slide-up">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-150">
                    <h4 className="font-serif font-bold text-sm text-gray-800">
                      {editingBannerId ? '✏️ Rewrite Slider Banner' : '✨ Design New Home Slide Banner'}
                    </h4>
                    <button
                      type="button"
                      onClick={resetBannerForm}
                      className="p-1 text-gray-400 hover:text-red-500 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Slide Display Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Gents Exclusive Cotton Collection"
                        value={bannerTitle}
                        onChange={(e) => setBannerTitle(e.target.value)}
                        className="w-full bg-white border border-gray-200 px-3 py-2 rounded focus:outline-none"
                      />
                    </div>

                    {/* Badge */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Ribbon Badge Tag Text</label>
                      <input
                        type="text"
                        placeholder="e.g. EID 2026, BEST SELLER, REGIONAL SPEC"
                        value={bannerBadge}
                        onChange={(e) => setBannerBadge(e.target.value)}
                        className="w-full bg-white border border-gray-200 px-3 py-2 rounded focus:outline-none"
                      />
                    </div>

                    {/* Description/Subtitle */}
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Short Description / Subtitle *</label>
                      <textarea
                        required
                        rows={2}
                        placeholder="Provide detailed description of this Eid collection suit or discount offer..."
                        value={bannerSubtitle}
                        onChange={(e) => setBannerSubtitle(e.target.value)}
                        className="w-full bg-white border border-gray-200 px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>

                    {/* Image Upload Option */}
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                        Slider Photo * (Upload directly from device gallery or paste direct link URL)
                      </label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                        <div className="md:col-span-2 space-y-2">
                          {/* File input */}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBannerImageUpload}
                            className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 cursor-pointer"
                          />
                          {/* Fallback link input */}
                          <input
                            type="text"
                            placeholder="Or paste direct image URL here..."
                            value={bannerImage ? (bannerImage.startsWith('data:image/') ? '' : bannerImage) : ''}
                            onChange={(e) => {
                              if (e.target.value.trim()) {
                                setBannerImage(e.target.value);
                              }
                            }}
                            className="w-full bg-white border border-gray-200 px-3 py-2 rounded focus:outline-none"
                          />
                        </div>

                        {/* Image Preview Window */}
                        <div className="h-28 border border-gray-200/80 rounded bg-white flex items-center justify-center overflow-hidden relative group">
                          {bannerImage ? (
                            <>
                              <img src={bannerImage} alt="Banner Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setBannerImage('')}
                                className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={10} />
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-400 font-mono text-[9px]">Preview Grid</span>
                          )}
                        </div>
                      </div>

                      {bannerImageError && (
                        <p className="text-red-600 font-semibold text-[10px] sm:text-xs mt-1.5">{bannerImageError}</p>
                      )}
                    </div>

                     {/* NEW COMPREHENSIVE PATH-BASED GUIDED REDIRECTION BUILDER */}
                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                        <span className="text-xs uppercase font-extrabold text-[#1e152a] tracking-wider flex items-center gap-1.5">
                          <Sparkles size={12} className="text-[#c5a880]" />
                          Destination Redirection Link
                        </span>
                        
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={bannerHasLink}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setBannerHasLink(checked);
                              if (!checked) {
                                setBannerTargetView('home');
                                setBannerTargetPayload('');
                              } else {
                                // Default link view is collection when initialized
                                setBannerTargetView('collection');
                                setBannerLinkTargetType('collection');
                              }
                            }}
                            className="rounded accent-[#c5a880] cursor-pointer"
                          />
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                            Enable Link
                          </span>
                        </label>
                      </div>

                      {bannerHasLink ? (
                        <div className="space-y-4 animate-fade-in text-xs">
                          {/* Step 1: Select Redirection Level */}
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                              Step 1: What do you want to link on this banner?
                            </span>
                            <div className="grid grid-cols-3 gap-2">
                              {(['collection', 'category', 'product'] as const).map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => {
                                    setBannerLinkTargetType(t);
                                    setBannerTargetView(t);
                                    setBannerTargetPayload('');
                                    setBannerSelectedColId('');
                                    setBannerSelectedCatName('');
                                    if (t === 'product') {
                                      setBannerProductSearchMode('gents-collection');
                                    }
                                  }}
                                  className={`py-2 px-3 border rounded font-semibold text-center uppercase tracking-wider text-[9px] transition-all cursor-pointer ${
                                    bannerLinkTargetType === t
                                      ? 'bg-[#1e152a] text-white border-[#1e152a]'
                                      : 'bg-white hover:bg-stone-100 text-gray-700 border-gray-200'
                                  }`}
                                >
                                  {t === 'collection' && '📂 Collection'}
                                  {t === 'category' && '🏷️ Category'}
                                  {t === 'product' && '🛍️ Specific Product'}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* IF COLLECTION OR CATEGORY */}
                          {(bannerLinkTargetType === 'collection' || bannerLinkTargetType === 'category') && (
                            <div className="space-y-3 p-3 bg-white border border-stone-200 rounded-lg">
                              {/* Step 2(Col/Cat): Select Gender Department */}
                              <div>
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                  Step 2: Department Sourcing (Gents or Ladies)?
                                </span>
                                <div className="flex gap-2">
                                  {(['gents', 'ladies'] as const).map((gender) => (
                                    <button
                                      key={gender}
                                      type="button"
                                      onClick={() => {
                                        setBannerGenderType(gender);
                                        setBannerTargetPayload('');
                                        setBannerSelectedColId('');
                                        setBannerSelectedCatName('');
                                      }}
                                      className={`flex-1 py-1.5 rounded text-[10px] uppercase tracking-wide font-extrabold border transition-all cursor-pointer ${
                                        bannerGenderType === gender
                                          ? 'border-[#c5a880] bg-amber-50/50 text-[#9d7e52]'
                                          : 'border-gray-200 bg-white hover:bg-stone-50 text-gray-400'
                                      }`}
                                    >
                                      {gender === 'gents' ? '🧔 Gents department' : '👩 Ladies department'}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Step 3: Choose actual Collection or Category */}
                              <div>
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                  Step 3: Select the target {bannerLinkTargetType}
                                </span>
                                {bannerLinkTargetType === 'collection' ? (
                                  <select
                                    required
                                    value={bannerTargetPayload}
                                    onChange={(e) => {
                                      setBannerTargetPayload(e.target.value);
                                      setBannerSelectedColId(e.target.value);
                                    }}
                                    className="w-full bg-stone-50 border border-gray-200 p-2 rounded text-xs text-gray-850 cursor-pointer font-bold focus:outline-none focus:border-[#c5a880]"
                                  >
                                    <option value="">-- Click to choose collection --</option>
                                    {collections
                                      .filter((c) => (bannerGenderType === 'gents' ? c.isGents : !c.isGents))
                                      .map((col) => (
                                        <option key={col.id} value={col.id}>{col.name}</option>
                                      ))}
                                  </select>
                                ) : (
                                  <select
                                    required
                                    value={bannerTargetPayload}
                                    onChange={(e) => {
                                      setBannerTargetPayload(e.target.value);
                                      setBannerSelectedCatName(e.target.value);
                                    }}
                                    className="w-full bg-stone-50 border border-gray-200 p-2 rounded text-xs text-gray-850 cursor-pointer font-bold focus:outline-none focus:border-[#c5a880]"
                                  >
                                    <option value="">-- Click to choose category --</option>
                                    {categories
                                      .filter((c) => (bannerGenderType === 'gents' ? c.isGents : !c.isGents))
                                      .map((cat) => (
                                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                                      ))}
                                  </select>
                                )}
                              </div>
                            </div>
                          )}

                          {/* IF SPECIFIC PRODUCT CHOSEN */}
                          {bannerLinkTargetType === 'product' && (
                            <div className="space-y-4 p-3 bg-white border border-stone-200 rounded-lg">
                              {/* Step 2 (Product): Filter Method */}
                              <div>
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                  Step 2: Where is this product located?
                                </span>
                                <select
                                  value={bannerProductSearchMode || 'gents-collection'}
                                  onChange={(e) => {
                                    const mode = e.target.value as any;
                                    setBannerProductSearchMode(mode);
                                    setBannerTargetPayload('');
                                    setBannerSelectedColId('');
                                    setBannerSelectedCatName('');
                                  }}
                                  className="w-full bg-stone-50 border border-gray-200 p-2 rounded text-[11px] font-bold text-gray-800 cursor-pointer focus:outline-none focus:border-[#c5a880]"
                                >
                                  <option value="gents-collection">🧔 Sourced Gents Collection</option>
                                  <option value="gents-category">👔 Sourced Gents Category</option>
                                  <option value="ladies-collection">👩 Sourced Ladies Collection</option>
                                  <option value="ladies-category">👗 Sourced Ladies Category</option>
                                </select>
                              </div>

                              {/* Step 3 (Product): Choose specific collection or category folder */}
                              {bannerProductSearchMode && (
                                <div>
                                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                    Step 3: Choose Category/Collection Folder
                                  </span>
                                  {bannerProductSearchMode.endsWith('collection') ? (
                                    <select
                                      value={bannerSelectedColId}
                                      onChange={(e) => {
                                        setBannerSelectedColId(e.target.value);
                                        setBannerTargetPayload(''); // Reset product payload until Step 4 selected!
                                      }}
                                      className="w-full bg-stone-50 border border-gray-200 p-2 rounded text-[11px] text-gray-800 cursor-pointer focus:outline-none focus:border-[#c5a880]"
                                    >
                                      <option value="">-- Choose target collection --</option>
                                      {collections
                                        .filter((c) => bannerProductSearchMode.startsWith('gents') ? c.isGents : !c.isGents)
                                        .map((col) => (
                                          <option key={col.id} value={col.id}>{col.name}</option>
                                        ))}
                                    </select>
                                  ) : (
                                    <select
                                      value={bannerSelectedCatName}
                                      onChange={(e) => {
                                        setBannerSelectedCatName(e.target.value);
                                        setBannerTargetPayload(''); // Reset product payload until Step 4 selected!
                                      }}
                                      className="w-full bg-stone-50 border border-gray-200 p-2 rounded text-[11px] text-gray-800 cursor-pointer focus:outline-none focus:border-[#c5a880]"
                                    >
                                      <option value="">-- Choose target category --</option>
                                      {categories
                                        .filter((c) => bannerProductSearchMode.startsWith('gents') ? c.isGents : !c.isGents)
                                        .map((cat) => (
                                          <option key={cat.name} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                  )}
                                </div>
                              )}

                              {/* Step 4 (Product): Choose specific Product list */}
                              {((bannerProductSearchMode?.endsWith('collection') && bannerSelectedColId !== '') ||
                                (bannerProductSearchMode?.endsWith('category') && bannerSelectedCatName !== '')) && (
                                <div className="space-y-1">
                                  <span className="block text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <Check size={11} className="text-emerald-600" />
                                    Step 4: Select specific unstitched fabric product
                                  </span>
                                  {(() => {
                                    let filteredList = [];
                                    if (bannerProductSearchMode?.endsWith('collection')) {
                                      filteredList = products.filter(
                                        (p) =>
                                          (bannerProductSearchMode.startsWith('gents') ? !p.isLadiesSuit : p.isLadiesSuit) &&
                                          (p.collectionId === bannerSelectedColId || p.collectionIds?.includes(bannerSelectedColId))
                                      );
                                    } else {
                                      filteredList = products.filter(
                                        (p) =>
                                          (bannerProductSearchMode.startsWith('gents') ? !p.isLadiesSuit : p.isLadiesSuit) &&
                                          (p.category.toLowerCase().trim() === bannerSelectedCatName.toLowerCase().trim() ||
                                            p.categories?.some((cat) => cat.toLowerCase().trim() === bannerSelectedCatName.toLowerCase().trim()))
                                      );
                                    }

                                    return (
                                      <select
                                        required
                                        value={bannerTargetPayload}
                                        onChange={(e) => setBannerTargetPayload(e.target.value)}
                                        className="w-full bg-white border-2 border-[#c5a880] p-2.5 rounded font-bold text-xs text-[#1e152a] cursor-pointer focus:outline-none"
                                      >
                                        <option value="">-- select product design --</option>
                                        {filteredList.map((prod) => (
                                          <option key={prod.id} value={prod.id}>
                                            [{prod.code || 'NO-CODE'}] {prod.name} - {formatPKR(prod.price)}
                                          </option>
                                        ))}
                                      </select>
                                    );
                                  })()}
                                </div>
                              )}
                            </div>
                          )}

                          {bannerTargetPayload && (
                            <div className="bg-emerald-50 text-emerald-800 p-2.5 border border-emerald-100 rounded text-[10px] flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                              <span>
                                REDIRECT PATH ACTIVE: <strong>{bannerTargetView}</strong> → <strong>{bannerTargetPayload}</strong>
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 bg-stone-100 border border-stone-200/50 rounded-lg text-[10px] text-stone-400 italic font-medium">
                          No destination link active. This banner is static and information-only.
                        </div>
                      )}
                    </div>

                    {/* Custom Button text CTA */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1.5 align-middle">
                        <input
                          type="checkbox"
                          checked={bannerCtaText !== ''}
                          onChange={(e) => {
                            setBannerCtaText(e.target.checked ? 'Shop Collection' : '');
                          }}
                          className="rounded cursor-pointer"
                        />
                        <span>Enable Call-To-Action Button</span>
                      </label>
                      {bannerCtaText !== '' ? (
                        <input
                          type="text"
                          placeholder="Button label: Like Buy Now, Visit, Purchase"
                          value={bannerCtaText}
                          onChange={(e) => setBannerCtaText(e.target.value)}
                          className="w-full bg-white border border-gray-200 px-3 py-2 rounded focus:outline-none mt-1"
                        />
                      ) : (
                        <input
                          type="text"
                          disabled
                          placeholder="CTA Button is hidden"
                          className="w-full bg-gray-100 border border-gray-200 px-3 py-2 rounded mt-1"
                        />
                      )}
                      {bannerCtaText !== '' && (
                        <div className="flex gap-1.5 mt-1">
                          {['Shop Collection', 'Buy Now', 'Visit', 'Purchase'].map(btnText => (
                            <button
                              key={btnText}
                              type="button"
                              onClick={() => setBannerCtaText(btnText)}
                              className="px-1.5 py-0.5 border border-stone-200 hover:border-[#c5a880] rounded-sm text-[8px] bg-[#faf9f6]/80 text-stone-500 hover:text-black"
                            >
                              {btnText}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Order and Active state */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Sorting Order</label>
                        <input
                          type="number"
                          value={bannerOrder}
                          onChange={(e) => setBannerOrder(Number(e.target.value) || 0)}
                          className="w-full bg-white border border-gray-200 px-3 py-2 rounded text-center focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col justify-center pl-2">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-3.5 align-middle">
                          <input
                            type="checkbox"
                            checked={bannerIsActive}
                            onChange={(e) => setBannerIsActive(e.target.checked)}
                            className="rounded cursor-pointer"
                          />
                          <span>Visible On Site</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-200/50">
                    <button
                      type="button"
                      onClick={resetBannerForm}
                      className="flex-1 py-2 text-xs font-semibold border border-gray-200 rounded text-gray-700 hover:bg-gray-50 uppercase cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-[#1e152a] text-white hover:bg-[#c5a880] hover:text-black text-xs font-bold rounded transition-all uppercase tracking-wider cursor-pointer shadow-sm"
                    >
                      {editingBannerId ? 'Update Permanent Slide' : 'Commit Permanent Slide'}
                    </button>
                  </div>
                </form>
              )}

              {/* BANNERS INVENTORY LIST */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#1e152a] pb-2 border-b border-stone-100">
                  Active Carousel Banners ({banners.length})
                </h4>

                {banners.length === 0 ? (
                  <div className="bg-[#faf9f6]/40 border border-dashed border-stone-200 rounded-xl py-12 px-4 text-center space-y-2">
                    <span className="text-3xl">🖼️</span>
                    <h5 className="font-serif font-bold text-gray-700 text-sm">No Custom Banners Uploaded</h5>
                    <p className="text-stone-400 text-xs max-w-sm mx-auto">
                      The active storefront will automatically loop through the default pre-set "Gents Eid cotton suits" and "Ladies Premium Shawls" slides.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {banners.map((slide) => (
                      <div
                        key={slide.id}
                        className={`p-4 bg-white border rounded-xl flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between text-xs transition-all ${
                          slide.isActive ? 'border-stone-200 shadow-3xs' : 'border-dashed border-stone-200 opacity-60 bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Visual Thumbnail */}
                          <div className="w-24 h-16 rounded overflow-hidden bg-gray-100 border border-stone-200 relative shrink-0">
                            <img src={slide.image} alt={slide.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 right-1 bg-black/70 text-[8px] text-white px-1.5 py-0.5 rounded font-mono">
                              #{slide.order}
                            </span>
                          </div>

                          <div className="space-y-1">
                            {/* Badge & Title */}
                            <div className="flex items-center gap-1.5">
                              {slide.badge && (
                                <span className="bg-[#c5a880] text-black text-[8px] font-extrabold px-1.5 py-0.5 rounded-xs uppercase leading-none">
                                  {slide.badge}
                                </span>
                              )}
                              <span className={`text-[8px] tracking-wider font-bold uppercase rounded px-1.5 py-0.5 leading-none ${
                                slide.isActive ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-stone-150 text-stone-600 border border-stone-200'
                              }`}>
                                {slide.isActive ? 'ACTIVE LINK ON HOME' : 'DRAFT INACTIVE'}
                              </span>
                            </div>
                            
                            <h5 className="font-serif font-bold text-gray-800 text-sm leading-snug">{slide.title}</h5>
                            
                            {slide.subtitle && (
                              <p className="text-stone-400 text-[10px] line-clamp-1">{slide.subtitle}</p>
                            )}
                            
                            {/* CTA & Targets */}
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-stone-500 font-mono mt-1 leading-none">
                              {slide.ctaText && (
                                <span className="flex items-center gap-1">
                                  <span>Button label:</span>
                                  <strong className="text-stone-700 italic">"{slide.ctaText}"</strong>
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <span>Redirection views:</span>
                                <span className="bg-stone-50 px-1 py-0.5 text-stone-600 border border-stone-100/60 rounded uppercase text-[8px]">
                                  {slide.targetView} {slide.targetPayload && `→ ${slide.targetPayload}`}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                          <button
                            onClick={() => startEditBanner(slide)}
                            className="p-2 border border-stone-200 rounded text-stone-600 hover:text-black hover:border-yellow-400 hover:bg-amber-50/20 cursor-pointer"
                            title="Edit this banner"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => setBannerIdToDelete(slide.id)}
                            className="p-2 border border-stone-200 rounded text-stone-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50/20 cursor-pointer"
                            title="Delete Banner"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCT CATALOG (Add / Edit / Delete Products - FULLY CUSTOMIZED & CONNECTED TO FIRESTORE) */}
          {currentTab === 'products' && (
            <div className="space-y-6 animate-fade-in leading-relaxed text-xs">
              <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1e152a]">Inventory Store Catalog</h3>
                  <p className="text-xs text-gray-400">
                    Sahi main live Firebase database se products add, edit, or delete kryn. Configured with dual genders, sales, promotion tag and unstitched specs.
                  </p>
                </div>
                {!showProdForm && (
                  <button
                    onClick={() => {
                      setEditingProdId(null);
                      setProdCode('');
                      setProdInventory('');
                      setProdName('');
                      setProdShort('');
                      setProdDesc('');
                      setProdPrice(0);
                      setProdCategory('');
                      setProdCollection('');
                      setProdImage1('');
                      setProdImage2('');
                      setProdImage3('');
                      setProdImage4('');
                      setProdImage5('');
                      setIsOnSale(false);
                      setProdOriginalPrice(0);
                      setPromoTag('');
                      setProdSelectedCollections([]);
                      setProdSelectedCategories([]);
                      setSpecFabric('');
                      setSpecDupatta('');
                      setSpecShirt('');
                      setSpecTrouser('');
                      setSpecStyle('');
                      setIsLadiesSuit(true);
                      setShowProdForm(true);
                    }}
                    className="py-2.5 px-4 bg-[#1e152a] text-[#f1ebd9] hover:bg-[#c5a880] hover:text-black font-bold uppercase text-xs tracking-wider rounded transition-all cursor-pointer flex items-center gap-1.5 animate-pulse"
                  >
                    <Plus size={14} /> Add New Suit
                  </button>
                )}
              </div>

              {/* Add/Edit Product Block Form */}
              {showProdForm && (
                <form onSubmit={handleProductSubmit} className="p-6 bg-stone-50 border border-gray-200 rounded-xl space-y-5 animate-fade-in leading-relaxed text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <h4 className="font-serif font-bold text-md text-[#1e152a] flex items-center gap-2">
                      <ShoppingBag size={16} className="text-[#c5a880]" />
                      {editingProdId ? 'Modify Suit Specification Ledger' : 'Register New Unstitched / Lawn Suit'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowProdForm(false)}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors text-gray-400 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* 1. GENDER SELECTION (Gents vs Ladies) */}
                  <div className="p-4 bg-white border border-[#c5a880]/20 rounded-lg space-y-2">
                    <span className="block text-[10px] font-bold text-[#c5a880] uppercase tracking-wider">Select Suit Catalog (Gents / Ladies) *</span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsLadiesSuit(false);
                          // Clear selection to avoid mismatch
                          setProdSelectedCollections([]);
                          setProdSelectedCategories([]);
                        }}
                        className={`py-3 px-4 font-bold border text-xs tracking-wide uppercase transition-all rounded cursor-pointer text-center flex items-center justify-center gap-2 ${
                          !isLadiesSuit
                            ? 'bg-[#1e152a] text-[#f1ebd9] border-[#1e152a] shadow-xs'
                            : 'bg-white text-gray-700 hover:bg-stone-50 border-stone-200'
                        }`}
                      >
                        👔 Gents Collection & Category
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsLadiesSuit(true);
                          setProdSelectedCollections([]);
                          setProdSelectedCategories([]);
                        }}
                        className={`py-3 px-4 font-bold border text-xs tracking-wide uppercase transition-all rounded cursor-pointer text-center flex items-center justify-center gap-2 ${
                          isLadiesSuit
                            ? 'bg-[#1e152a] text-[#f1ebd9] border-[#1e152a] shadow-xs'
                            : 'bg-white text-gray-700 hover:bg-stone-50 border-stone-200'
                        }`}
                      >
                        👗 Ladies Collection & Category
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Product Title / Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Traditional Embroidered Lawn"
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        className="w-full bg-white border border-gray-200 px-3 py-2.5 rounded focus:outline-none focus:ring-1 focus:ring-[#c5a880] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Product Code *</label>
                      <input
                        type="text"
                        placeholder="e.g. ALH-5042"
                        value={prodCode}
                        onChange={(e) => setProdCode(e.target.value)}
                        className="w-full bg-white border border-gray-200 px-3 py-2.5 rounded focus:outline-none focus:ring-1 focus:ring-[#c5a880] text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Price (PKR) *</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 2850"
                        value={prodPrice || ''}
                        onChange={(e) => setProdPrice(Number(e.target.value))}
                        className="w-full bg-white border border-gray-200 px-3 py-2.5 rounded focus:outline-none focus:ring-1 focus:ring-[#c5a880] text-xs font-semibold"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Short Description / Subtitle <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <input
                        type="text"
                        placeholder="e.g. Premium 3 Piece Printed Lawn Suit"
                        value={prodShort}
                        onChange={(e) => setProdShort(e.target.value)}
                        className="w-full bg-white border border-gray-200 px-3 py-2.5 rounded focus:outline-none focus:ring-1 focus:ring-[#c5a880] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Inventory Value (Pcs) <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <input
                        type="number"
                        placeholder="e.g. 100"
                        value={prodInventory}
                        onChange={(e) => setProdInventory(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-white border border-gray-200 px-3 py-2.5 rounded focus:outline-none focus:ring-1 focus:ring-[#c5a880] text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* 2. INSTANT ON SALE TOGGLE & PROMOTION TAGS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/70 border border-stone-200 rounded-lg">
                    {/* On Sale Switch */}
                    <div className="space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">On Sale / Discount Deal?</span>
                        <button
                          type="button"
                          onClick={() => setIsOnSale(!isOnSale)}
                          className={`w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
                            isOnSale ? 'bg-red-600' : 'bg-stone-300'
                          }`}
                        >
                          <span
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                              isOnSale ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                      
                      {isOnSale ? (
                        <div className="animate-fade-in p-3 bg-red-50/50 border border-red-100 rounded-md">
                          <label className="block text-[10px] font-bold text-red-800 uppercase tracking-wide mb-1">
                            Original Price before discount (PKR) *
                          </label>
                          <input
                            type="number"
                            required
                            placeholder="e.g. 4500 (Abhi waali price sale price ho gi aur aur ye crossed waali)"
                            value={prodOriginalPrice || ''}
                            onChange={(e) => setProdOriginalPrice(Number(e.target.value))}
                            className="w-full bg-white border border-red-200 px-2.5 py-2 rounded focus:outline-none focus:ring-1 focus:ring-red-400 font-bold text-red-800"
                          />
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-400 italic">Enable sale to display crossed out previous prices on the website.</p>
                      )}
                    </div>

                    {/* Promo Tags */}
                    <div className="space-y-1.5 text-left">
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-500">Promotion Tag Badge (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. EID SPECIAL, FLAT 15% OFF, BEST SELLER"
                        value={promoTag}
                        onChange={(e) => setPromoTag(e.target.value)}
                        className="w-full bg-white border border-gray-200 px-3 py-2.5 rounded focus:outline-none focus:ring-1 focus:ring-[#c5a880]"
                      />
                      <span className="text-[9px] text-gray-400 block font-normal text-left">This badge renders on the product image overlay as a glowing tag (Max 1 label).</span>
                    </div>
                  </div>

                  {/* 3. IMAGES MANAGMENT (Min 2, Max 5 Allowed) */}
                  <div className="p-4 bg-white/70 border border-stone-200 rounded-lg space-y-3 text-left">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-600">
                      Product Suit Photos (Min 2 and Max 5 images)
                    </span>
                    <p className="text-[10px] text-gray-400 leading-snug font-normal text-left">
                      Aap file upload kr k images direct load kr skte hain jo automatic optimize ho gi, ya direct online source image links copy paste kr skte hain. (Urgent: First 2 Images are Required).
                    </p>

                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((idx) => {
                        const val =
                          idx === 1 ? prodImage1 :
                          idx === 2 ? prodImage2 :
                          idx === 3 ? prodImage3 :
                          idx === 4 ? prodImage4 : prodImage5;
                        const setVal =
                          idx === 1 ? setProdImage1 :
                          idx === 2 ? setProdImage2 :
                          idx === 3 ? setProdImage3 :
                          idx === 4 ? setProdImage4 : setProdImage5;
                        
                        return (
                          <div key={idx} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                            <div className="w-16 shrink-0 text-left font-bold text-[10px] text-gray-505">
                              Image {idx} {idx <= 2 ? '*' : '(Optional)'}
                            </div>
                            <div className="flex-1 w-full flex items-center gap-2">
                              <input
                                type="url"
                                required={idx <= 2}
                                placeholder={`https://example.com/photo-${idx}.jpg`}
                                value={val}
                                onChange={(e) => setVal(e.target.value)}
                                className="flex-1 bg-white border border-gray-200 px-3 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-[#c5a880]"
                              />
                              
                              <label className="cursor-pointer shrink-0 py-1.5 px-3 bg-stone-100 hover:bg-[#c5a880] text-black hover:text-white transition-all font-bold uppercase text-[9px] rounded flex items-center gap-1 border border-stone-200">
                                <Upload size={10} />
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      try {
                                        const comp = await compressImage(file, 800, 1000, 0.7);
                                        setVal(comp);
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }
                                  }}
                                />
                              </label>
                            </div>
                            
                            {val && (
                              <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden bg-gray-50 flex-none">
                                <img src={val} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. CHOOSE MULTIPLE CATEGORIES AND COLLECTIONS (GENDER RESTRICTED) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {/* Select Multiple Collections */}
                    <div className="p-4 bg-white border border-stone-200 rounded-lg space-y-2">
                      <span className="block text-[10px] font-bold text-[#c5a880] uppercase tracking-wider">
                        Linked Collections * (Select Multiple Checkboxes)
                      </span>
                      <p className="text-[9px] text-gray-400">Showing only {isLadiesSuit ? 'Ladies' : 'Gents'} collections.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 bg-stone-50 border border-stone-150 rounded max-h-40 overflow-y-auto">
                        {collections
                          .filter(col => (isLadiesSuit ? !col.isGents : col.isGents) && col.id !== 'new-arrivals' && col.id !== 'hot-selling')
                          .map(col => {
                            const isChecked = prodSelectedCollections.includes(col.id);
                            return (
                              <label key={col.id} className="flex items-center gap-2 cursor-pointer py-1 hover:bg-white px-1.5 rounded transition-all">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setProdSelectedCollections([...prodSelectedCollections, col.id]);
                                    } else {
                                      setProdSelectedCollections(prodSelectedCollections.filter(c => c !== col.id));
                                    }
                                  }}
                                  className="accent-[#1e152a] rounded cursor-pointer"
                                />
                                <span className="font-semibold text-[11px] text-gray-755">{col.name}</span>
                              </label>
                            );
                          })}
                        {collections.filter(col => (isLadiesSuit ? !col.isGents : col.isGents) && col.id !== 'new-arrivals' && col.id !== 'hot-selling').length === 0 && (
                          <div className="text-[10px] text-gray-400 italic text-center col-span-2 py-4">No collections found for this gender catalog!</div>
                        )}
                      </div>
                    </div>

                    {/* Select Multiple Categories */}
                    <div className="p-4 bg-white border border-stone-200 rounded-lg space-y-2">
                      <span className="block text-[10px] font-bold text-[#c5a880] uppercase tracking-wider">
                        Linked Categories * (Select Multiple Checkboxes)
                      </span>
                      <p className="text-[9px] text-gray-400">Showing only {isLadiesSuit ? 'Ladies' : 'Gents'} categories.</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 bg-stone-50 border border-stone-150 rounded max-h-40 overflow-y-auto">
                        {categories
                          .filter(cat => isLadiesSuit ? !cat.isGents : cat.isGents)
                          .map(cat => {
                            const isChecked = prodSelectedCategories.includes(cat.name);
                            return (
                              <label key={cat.id} className="flex items-center gap-2 cursor-pointer py-1 hover:bg-white px-1.5 rounded transition-all">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setProdSelectedCategories([...prodSelectedCategories, cat.name]);
                                    } else {
                                      setProdSelectedCategories(prodSelectedCategories.filter(c => c !== cat.name));
                                    }
                                  }}
                                  className="accent-[#1e152a] rounded cursor-pointer"
                                />
                                <span className="font-semibold text-[11px] text-gray-755">{cat.name}</span>
                              </label>
                            );
                          })}
                        {categories.filter(cat => isLadiesSuit ? !cat.isGents : cat.isGents).length === 0 && (
                          <div className="text-[10px] text-gray-400 italic text-center col-span-2 py-4">No categories found for this gender catalog!</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 5. PRODUCT COMPONENT SPECIFICATIONS (OPTIONAL) */}
                  <div className="p-4 bg-white/75 border border-stone-200 rounded-lg space-y-3 text-left">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-650">
                      Product Specifications / Suit Components (Optional)
                    </span>
                    <p className="text-[10px] text-gray-400 leading-snug font-normal text-left">
                      Yahan sirf woh components likhein jo aap is product main customer ko detail dena chahte hain. Jis field ko aap khali (blank) chorein ge, woh product page pr show nahi ho gi aur na he khd se dupatta waghaira add ho ga.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 tracking-wide mb-1">Fabric Type</label>
                        <input
                          type="text"
                          placeholder="e.g. Lawn, Cotton, Khaddar"
                          value={specFabric}
                          onChange={(e) => setSpecFabric(e.target.value)}
                          className="w-full bg-white border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#c5a880] text-xs font-medium text-gray-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 tracking-wide mb-1">Dupatta Details</label>
                        <input
                          type="text"
                          placeholder="Leave blank if not applicable (e.g. Silk Printed 2.5m)"
                          value={specDupatta}
                          onChange={(e) => setSpecDupatta(e.target.value)}
                          className="w-full bg-white border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#c5a880] text-xs font-medium text-gray-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 tracking-wide mb-1">Shirt Fabric</label>
                        <input
                          type="text"
                          placeholder="Leave blank if not applicable (e.g. Printed Lawn 3m)"
                          value={specShirt}
                          onChange={(e) => setSpecShirt(e.target.value)}
                          className="w-full bg-white border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#c5a880] text-xs font-medium text-gray-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 tracking-wide mb-1">Trouser Fabric</label>
                        <input
                          type="text"
                          placeholder="Leave blank if not applicable (e.g. Cambric Cotton 2.5m)"
                          value={specTrouser}
                          onChange={(e) => setSpecTrouser(e.target.value)}
                          className="w-full bg-white border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#c5a880] text-xs font-medium text-gray-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 tracking-wide mb-1">Suit Style / Stitch Type</label>
                        <input
                          type="text"
                          placeholder="e.g. Unstitched 3-Piece, Unstitched Kurtis"
                          value={specStyle}
                          onChange={(e) => setSpecStyle(e.target.value)}
                          className="w-full bg-white border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#c5a880] text-xs font-medium text-gray-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="text-left">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Detailed Description *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Explain fabric comfort, dimensions, weave pattern, style or other details here..."
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      className="w-full bg-white border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#c5a880] text-xs"
                    />
                  </div>

                  {/* Switch trigger specifications */}
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <label className="flex items-center gap-2 cursor-pointer font-bold select-none p-3 bg-white border border-gray-200 rounded">
                      <input
                        type="checkbox"
                        checked={isNewArrival}
                        onChange={(e) => setIsNewArrival(e.target.checked)}
                        className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-400 shrink-0 cursor-pointer"
                      />
                      <div>
                        <span className="block text-[11px] text-gray-700">Flag as New Arrival</span>
                        <span className="block text-[9px] text-gray-400 font-normal">Shows in the Homepage New Arrivals list.</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold select-none p-3 bg-white border border-gray-200 rounded">
                      <input
                        type="checkbox"
                        checked={isHotSelling}
                        onChange={(e) => setIsHotSelling(e.target.checked)}
                        className="w-4 h-4 text-emerald-500 rounded border-gray-300 focus:ring-emerald-400 shrink-0 cursor-pointer"
                      />
                      <div>
                        <span className="block text-[11px] text-gray-700">Flag as Hot Selling</span>
                        <span className="block text-[9px] text-gray-400 font-normal">Adds a Hot Tag overlay badge on grids.</span>
                      </div>
                    </label>
                  </div>

                  {/* Related Products Section */}
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-600">
                          Related Products Configuration
                        </span>
                        <span className="block text-[9px] text-gray-400 font-normal">
                          Choose how related/recommended items are displayed at the bottom of this product's page.
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-6 py-1">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-xs select-none">
                        <input
                          type="radio"
                          name="relatedType"
                          value="auto"
                          checked={prodRelatedType === 'auto'}
                          onChange={() => setProdRelatedType('auto')}
                          className="w-4 h-4 text-[#c5a880] focus:ring-[#c5a880] cursor-pointer"
                        />
                        <span className="text-gray-700">🔄 Auto Related Products</span>
                      </label>
                      
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-xs select-none">
                        <input
                          type="radio"
                          name="relatedType"
                          value="custom"
                          checked={prodRelatedType === 'custom'}
                          onChange={() => setProdRelatedType('custom')}
                          className="w-4 h-4 text-[#c5a880] focus:ring-[#c5a880] cursor-pointer"
                        />
                        <span className="text-gray-700">🛠️ Custom Related Products</span>
                      </label>
                    </div>

                    {prodRelatedType === 'auto' ? (
                      <p className="text-[10px] text-gray-500 bg-white p-3 border border-gray-150 rounded leading-relaxed">
                        💡 <strong>Auto Mode Active:</strong> Recommendations will automatically show items from the same collection(s) or category of this product. Fits dynamically side-by-side with inventory.
                      </p>
                    ) : (
                      <div className="space-y-3 bg-white p-3 border border-gray-150 rounded">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                            Select Custom Products ({prodCustomRelatedIds.length} selected)
                          </span>
                          <input
                            type="text"
                            placeholder="Type to search products..."
                            value={relatedSearch}
                            onChange={(e) => setRelatedSearch(e.target.value)}
                            className="bg-stone-50 border border-gray-205 px-2.5 py-1 rounded text-[11px] focus:outline-none focus:ring-1 focus:ring-[#c5a880] w-full sm:w-48 placeholder:text-gray-400"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-stone-100 p-2 rounded bg-stone-50/50">
                          {products
                            .filter(p => {
                              // Don't recommend itself
                              if (editingProdId && p.id === editingProdId) return false;
                              
                              if (!relatedSearch.trim()) return true;
                              const searchLower = relatedSearch.toLowerCase();
                              return (
                                p.name.toLowerCase().includes(searchLower) ||
                                (p.code && p.code.toLowerCase().includes(searchLower))
                              );
                            })
                            .map(p => {
                              const isChecked = prodCustomRelatedIds.includes(p.id);
                              return (
                                <button
                                  type="button"
                                  key={p.id}
                                  onClick={() => {
                                    if (isChecked) {
                                      setProdCustomRelatedIds(prodCustomRelatedIds.filter(id => id !== p.id));
                                    } else {
                                      setProdCustomRelatedIds([...prodCustomRelatedIds, p.id]);
                                    }
                                  }}
                                  className={`flex items-center gap-2 cursor-pointer p-1.5 hover:bg-stone-100 rounded text-left transition-all border ${
                                    isChecked ? 'border-amber-300 bg-amber-50/20' : 'border-transparent'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    readOnly
                                    className="accent-[#1e152a] rounded cursor-pointer shrink-0"
                                  />
                                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                                    {p.images[0] && (
                                      <img src={p.images[0]} alt="" className="w-7 h-7 object-cover rounded" />
                                    )}
                                    <div className="truncate flex-1">
                                      <div className="font-semibold text-[11px] text-gray-700 truncate leading-tight">{p.name}</div>
                                      <div className="text-[9px] text-gray-400 leading-none mt-0.5">Code: {p.code || 'N/A'} - Price: PKR {p.price}</div>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          {products.filter(p => {
                            if (editingProdId && p.id === editingProdId) return false;
                            return true;
                          }).length === 0 && (
                            <div className="text-center text-[10px] text-gray-400 italic py-4 col-span-2">No other products registered in catalog yet.</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submission Row */}
                  <div className="pt-2 border-t flex justify-end gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setShowProdForm(false)}
                      className="py-2.5 px-4 bg-gray-200 hover:bg-gray-300 font-bold uppercase text-[10px] tracking-wider text-black rounded transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 px-6 bg-[#1e152a] text-[#f1ebd9] hover:bg-emerald-600 hover:text-white font-bold uppercase text-[10px] tracking-wider rounded transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      {editingProdId ? 'Save Specs Updates' : 'Add Suit to Store Record'}
                    </button>
                  </div>
                </form>
              )}

              {/* PRODUCT FILTERING INDEX & SEARCHABLE CATALOG LIST */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-3xs space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <span className="font-serif font-bold text-sm text-gray-850 block">Search Product Inventory Ledger ({products.length} Items)</span>
                    <p className="text-[10px] text-gray-400">Manage and instantly flag products as New Arrivals or Hot Selling on your Homepage.</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                    {/* Filter tabs */}
                    <button
                      type="button"
                      onClick={() => setAdminProductFilterType('all')}
                      className={`px-3 py-1.5 rounded text-[10px] font-bold tracking-tight uppercase border transition-all ${
                        adminProductFilterType === 'all'
                          ? 'bg-[#1e152a] text-white border-[#1e152a]'
                          : 'bg-stone-50 text-gray-500 border-gray-200 hover:bg-stone-100'
                      }`}
                    >
                      All ({products.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminProductFilterType('newArrivals')}
                      className={`px-3 py-1.5 rounded text-[10px] font-bold tracking-tight uppercase border transition-all ${
                        adminProductFilterType === 'newArrivals'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-stone-50 text-amber-700 border-gray-200 hover:bg-amber-50'
                      }`}
                    >
                      🚀 New Arrivals ({products.filter(p => p.isNewArrival).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminProductFilterType('hotSelling')}
                      className={`px-3 py-1.5 rounded text-[10px] font-bold tracking-tight uppercase border transition-all ${
                        adminProductFilterType === 'hotSelling'
                          ? 'bg-red-650 text-white border-red-650 bg-red-600'
                          : 'bg-stone-50 text-red-700 border-gray-200 hover:bg-red-50'
                      }`}
                    >
                      🔥 Hot Selling ({products.filter(p => p.isHotSelling).length})
                    </button>
                  </div>

                  {/* Quick catalog search input */}
                  <div className="relative w-full sm:w-64 shrink-0">
                    <input
                      type="text"
                      id="inventory-catalog-search"
                      value={adminProductSearch}
                      onChange={(e) => setAdminProductSearch(e.target.value)}
                      placeholder="Search title, category, colors..."
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1e152a]"
                    />
                    {adminProductSearch && (
                      <button
                        onClick={() => setAdminProductSearch('')}
                        className="absolute right-2.5 top-2 text-gray-400 hover:text-black text-xs font-mono"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-stone-100 border border-stone-200 rounded-lg overflow-hidden">
                  {(() => {
                    const filteredList = products.filter(prod => {
                      if (adminProductSearch.trim() !== '') {
                        const qWords = adminProductSearch.toLowerCase().split(/\s+/).filter(w => w.length > 0);
                        const titleWords = prod.name.toLowerCase().split(/\s+/).filter(w => w.length > 0);
                        const descWords = (prod.description || '').toLowerCase().split(/\s+/).filter(w => w.length > 0);
                        const tags = [prod.category, prod.id, ...(prod.categories || [])];
                        
                        const matchesQuery = qWords.some(qw => {
                          const titleMatch = titleWords.some(tw => tw.includes(qw));
                          const descMatch = descWords.some(dw => dw.includes(qw));
                          const tagMatch = tags.some(t => t.toLowerCase().includes(qw));
                          return titleMatch || descMatch || tagMatch;
                        });
                        
                        if (!matchesQuery) return false;
                      }
                      
                      if (adminProductFilterType === 'newArrivals') {
                        return prod.isNewArrival;
                      }
                      if (adminProductFilterType === 'hotSelling') {
                        return prod.isHotSelling;
                      }
                      return true;
                    });

                    if (filteredList.length === 0) {
                      return (
                        <div className="p-12 text-center text-gray-400 italic text-xs bg-stone-50/50">
                          Matches matching current search and filters not found in store register.
                        </div>
                      );
                    }

                    return filteredList.map((prod) => {
                      const linkedCatsStr = [prod.category, ...(prod.categories || [])]
                        .filter((val, i, self) => val && self.indexOf(val) === i)
                        .join(', ');
                      const linkedColsStr = [prod.collectionId, ...(prod.collectionIds || [])]
                        .filter((val, i, self) => val && self.indexOf(val) === i)
                        .map(id => collections.find(c => c.id === id)?.name || id)
                        .join(', ');

                      return (
                        <div
                          key={prod.id}
                          className="inventory-item-row p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white hover:bg-stone-50/50 transition-all text-left"
                        >
                          <div className="flex gap-3 items-center min-w-0">
                            {/* Photo Thumbnail */}
                            <div className="w-12 h-16 rounded overflow-hidden bg-stone-50 border border-stone-200 shrink-0 relative">
                              <img src={prod.images[0] || 'https://picsum.photos/seed/fabric/100/100'} alt={prod.name} referrerPolicy="no-referrer" className="w-full h-full object-cover object-top" />
                              {prod.images.length > 1 && (
                                <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-[8px] text-white font-mono px-1 rounded-sm scale-90">
                                  {prod.images.length}P
                                </span>
                              )}
                            </div>

                            <div className="space-y-1 min-w-0 text-left w-full">
                              <div className="flex flex-wrap gap-1.5 items-center">
                                <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm shrink-0 ${
                                  prod.isLadiesSuit ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-green-50 text-green-700 border border-green-100'
                                }`}>
                                  {prod.isLadiesSuit ? '👗 LADIES' : '👔 GENTS'}
                                </span>
                                
                                {prod.isOnSale && (
                                  <span className="bg-red-50 text-red-700 border border-red-100 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm shrink-0">
                                    SALE
                                  </span>
                                )}

                                {prod.promoTag && (
                                  <span className="bg-[#1e152a] text-[#c5a880] text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm shrink-0">
                                    {prod.promoTag}
                                  </span>
                                )}

                                {prod.inventory !== undefined && (
                                  <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm shrink-0 ${
                                    prod.inventory > 10
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                                      : 'bg-amber-50 text-amber-800 border border-amber-150'
                                  }`}>
                                    Stock: {prod.inventory} Pcs
                                  </span>
                                )}
                              </div>

                              <h5 className="font-serif font-bold text-gray-800 text-xs truncate max-w-xs sm:max-w-md">{prod.name}</h5>
                              
                              <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[9px] text-gray-400 font-mono">
                                <span>Cats: <strong className="text-gray-600">{linkedCatsStr || 'None'}</strong></span>
                                <span>•</span>
                                <span>Cols: <strong className="text-gray-700">{linkedColsStr || 'None'}</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3.5 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 shrink-0">
                            {/* Instant Status Badges Manager */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  onEditProduct({
                                    ...prod,
                                    isNewArrival: !prod.isNewArrival
                                  });
                                }}
                                className={`text-[9.5px] font-semibold uppercase px-2 py-1 rounded transition-all flex items-center gap-1 cursor-pointer border ${
                                  prod.isNewArrival
                                    ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                    : 'bg-white text-gray-400 border-gray-200 hover:bg-stone-50 hover:text-gray-700'
                                }`}
                                title="Click to Toggle New Arrival flag"
                              >
                                <span>🚀</span>
                                <span>New {prod.isNewArrival ? 'Yes' : 'No'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  onEditProduct({
                                    ...prod,
                                    isHotSelling: !prod.isHotSelling
                                  });
                                }}
                                className={`text-[9.5px] font-semibold uppercase px-2 py-1 rounded transition-all flex items-center gap-1 cursor-pointer border ${
                                  prod.isHotSelling
                                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                    : 'bg-white text-gray-400 border-gray-200 hover:bg-stone-50 hover:text-gray-700'
                                }`}
                                title="Click to Toggle Hot Selling flag"
                              >
                                <span>🔥</span>
                                <span>Hot {prod.isHotSelling ? 'Yes' : 'No'}</span>
                              </button>
                            </div>

                            {/* Price Tag values */}
                            <div className="text-right shrink-0">
                              {prod.isOnSale && prod.originalPrice ? (
                                <div className="flex flex-col items-end">
                                  <span className="text-red-650 font-extrabold text-xs">{formatPKR(prod.price)}</span>
                                  <span className="text-gray-400 line-through text-[10px]">{formatPKR(prod.originalPrice)}</span>
                                </div>
                              ) : (
                                <span className="text-gray-900 font-extrabold text-xs">{formatPKR(prod.price)}</span>
                              )}
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => {
                                  startEditProduct(prod);
                                  window.scrollTo({ top: 300, behavior: 'smooth' });
                                }}
                                className="p-1.5 border border-stone-200 hover:border-yellow-400 hover:bg-yellow-50/20 text-stone-600 hover:text-black rounded transition-all cursor-pointer"
                                title="Edit specifications"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => {
                                  const key = 'delete-prod-' + prod.id;
                                  if (activeConfirmKey === key) {
                                    onDeleteProduct(prod.id);
                                    setActiveConfirmKey(null);
                                  } else {
                                    setActiveConfirmKey(key);
                                    setTimeout(() => {
                                      setActiveConfirmKey(null);
                                    }, 5000); // 5 sec fallback reset
                                  }
                                }}
                                className={`p-1.5 rounded transition-all cursor-pointer ${
                                  activeConfirmKey === 'delete-prod-' + prod.id
                                    ? 'text-red-600 bg-red-50 hover:bg-red-100 animate-pulse font-extrabold text-[9px]'
                                    : 'text-gray-400 hover:text-red-600 border border-stone-200'
                                }`}
                                title={activeConfirmKey === 'delete-prod-' + prod.id ? "Click again to confirm" : "Delete product"}
                              >
                                {activeConfirmKey === 'delete-prod-' + prod.id ? 'TAP COMFIRM' : <Trash2 size={12} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EDIT COLLECTIONS */}
          {currentTab === 'collections' && (
            <div className="space-y-6 animate-fade-in leading-relaxed">
              <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1e152a]">Manage Circular Collections</h3>
                  <p className="text-xs text-gray-400">
                    Create collection groups. These appear in the horizontal layout directly below navbar on the homepage!
                  </p>
                </div>
                {!showColForm && (
                  <button
                    onClick={() => {
                      setEditingColId(null);
                      setShowColForm(true);
                    }}
                    className="py-2 px-3.5 bg-[#1e152a] text-[#f1ebd9] hover:bg-[#c5a880] hover:text-black font-bold uppercase text-xs tracking-wider rounded transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus size={14} /> New Collection
                  </button>
                )}
              </div>

              {/* INTERACTIVE GUIDED DELETE ASSISTANT */}
              <div className="bg-stone-50 border-2 border-dashed border-[#c5a880]/30 rounded-xl p-5 mb-6 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Trash2 size={18} className="text-red-600 animate-pulse" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1e152a]">Guided Deletion Assistant (Mandi HQ Safeguard)</h4>
                    <p className="text-[10px] text-gray-400">Select which classification type you would like to securely delete, then choose the item from the dropdown below.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteWizardType('gents-col');
                      setDeleteWizardSelectedId('');
                    }}
                    className={`p-2.5 rounded border text-center transition-all cursor-pointer ${
                      deleteWizardType === 'gents-col'
                        ? 'bg-[#1e152a] text-[#f1ebd9] border-[#1e152a] font-bold shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-stone-105'
                    }`}
                  >
                    <span className="block text-[14px] mb-1">🧔</span>
                    <span className="block text-[10px] uppercase font-bold tracking-tight text-gray-800">Gents Collection</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteWizardType('gents-cat');
                      setDeleteWizardSelectedId('');
                    }}
                    className={`p-2.5 rounded border text-center transition-all cursor-pointer ${
                      deleteWizardType === 'gents-cat'
                        ? 'bg-[#1e152a] text-[#f1ebd9] border-[#1e152a] font-bold shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-stone-105'
                    }`}
                  >
                    <span className="block text-[14px] mb-1">👔</span>
                    <span className="block text-[10px] uppercase font-bold tracking-tight text-gray-800">Gents Category</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteWizardType('ladies-col');
                      setDeleteWizardSelectedId('');
                    }}
                    className={`p-2.5 rounded border text-center transition-all cursor-pointer ${
                      deleteWizardType === 'ladies-col'
                        ? 'bg-[#1e152a] text-[#f1ebd9] border-[#1e152a] font-bold shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-stone-105'
                    }`}
                  >
                    <span className="block text-[14px] mb-1">👩</span>
                    <span className="block text-[10px] uppercase font-bold tracking-tight text-gray-800">Ladies Collection</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteWizardType('ladies-cat');
                      setDeleteWizardSelectedId('');
                    }}
                    className={`p-2.5 rounded border text-center transition-all cursor-pointer ${
                      deleteWizardType === 'ladies-cat'
                        ? 'bg-[#1e152a] text-[#f1ebd9] border-[#1e152a] font-bold shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-stone-105'
                    }`}
                  >
                    <span className="block text-[14px] mb-1">👗</span>
                    <span className="block text-[10px] uppercase font-bold tracking-tight text-gray-800">Ladies Category</span>
                  </button>
                </div>

                {deleteWizardType && (
                  <div className="p-3 bg-white border border-gray-250 rounded-lg space-y-3 animate-fade-in text-xs">
                    <div>
                      <label className="block text-[9px] font-bold text-[#c5a880] uppercase tracking-wide mb-1">
                        Select Lead Item to Delete
                      </label>
                      <select
                        value={deleteWizardSelectedId}
                        onChange={(e) => setDeleteWizardSelectedId(e.target.value)}
                        className="w-full bg-white border border-gray-250 px-3 py-2 rounded focus:outline-none focus:border-[#c5a880] cursor-pointer font-medium"
                      >
                        <option value="">-- Choose item below --</option>
                        {deleteWizardType === 'gents-col' &&
                          collections
                            .filter((c) => c.isGents !== false)
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                🧔 {c.name} ({c.description.substring(0, 40)}...)
                              </option>
                            ))}
                        {deleteWizardType === 'ladies-col' &&
                          collections
                            .filter((c) => !c.isGents)
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                👩 {c.name} ({c.description.substring(0, 40)}...)
                              </option>
                            ))}
                        {deleteWizardType === 'gents-cat' &&
                          categories
                            .filter((c) => c.isGents)
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                👔 {c.name} ({c.description.substring(0, 40)}...)
                              </option>
                            ))}
                        {deleteWizardType === 'ladies-cat' &&
                          categories
                            .filter((c) => !c.isGents)
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                👗 {c.name} ({c.description.substring(0, 40)}...)
                              </option>
                            ))}
                      </select>
                    </div>

                    {deleteWizardSelectedId && (
                      <div className="pt-2 flex items-center justify-between gap-3 border-t border-gray-100 animate-slide-up bg-red-50/40 p-2.5 rounded border border-red-150">
                        <div className="text-[10px] text-red-800 font-medium">
                          ⚠️ <strong>CRITICAL DATA REMOVAL ACTION:</strong> This will delete this specific entry from the database. This action is irreversible.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (activeConfirmKey === 'guided-delete-' + deleteWizardSelectedId) {
                              if (deleteWizardType === 'gents-col' || deleteWizardType === 'ladies-col') {
                                onDeleteCollection(deleteWizardSelectedId);
                              } else {
                                onDeleteCategory(deleteWizardSelectedId);
                              }
                              setDeleteWizardSelectedId('');
                              setDeleteWizardType(null);
                              setActiveConfirmKey(null);
                            } else {
                              setActiveConfirmKey('guided-delete-' + deleteWizardSelectedId);
                              setTimeout(() => setActiveConfirmKey(null), 5500);
                            }
                          }}
                          className={`py-1.5 px-4 rounded font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer shadow-xs shrink-0 ${
                            activeConfirmKey === 'guided-delete-' + deleteWizardSelectedId
                              ? 'bg-red-600 text-white animate-pulse'
                              : 'bg-[#1e152a] text-white hover:bg-red-600'
                          }`}
                        >
                          {activeConfirmKey === 'guided-delete-' + deleteWizardSelectedId ? 'TAP ONCE MORE TO CONFIRM' : '✓ Secure Delete'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Col editing form */}
              {showColForm && (
                <form onSubmit={handleCollectionSubmit} className="p-5 bg-stone-50 border border-gray-200 rounded-xl text-xs space-y-4 animate-fade-in">
                  <h4 className="font-serif font-bold text-md text-[#1e152a] border-b border-[#e1d9cd]/50 pb-2">
                    {editingColId ? 'Configure Collection Specs' : 'Register New Collection'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Collection Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lawn Embroidered Collection"
                        value={colName}
                        onChange={(e) => setColName(e.target.value)}
                        className="w-full bg-white border border-gray-200 px-3 py-2 rounded focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Gender Designation *</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setColIsGents(true)}
                          className={`flex-1 py-1.5 px-3 rounded text-xs font-bold transition-all border ${
                            colIsGents 
                              ? 'bg-[#1e152a] border-[#1e152a] text-[#f1ebd9]' 
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          👔 Gents
                        </button>
                        <button
                          type="button"
                          onClick={() => setColIsGents(false)}
                          className={`flex-1 py-1.5 px-3 rounded text-xs font-bold transition-all border ${
                            !colIsGents 
                              ? 'bg-[#1e152a] border-[#1e152a] text-[#f1ebd9]' 
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          👗 Ladies
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Circle Thumbnail Image *</label>
                      {colImage && (
                        <div className="flex items-center gap-3 p-2 bg-white border rounded-lg shadow-3xs">
                          <img src={colImage} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-[#c5a880] bg-[#fff] shrink-0" />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-gray-700 block truncate">Selected Thumbnail</span>
                            <span className="text-[8px] text-gray-400 font-mono block truncate">
                              {colImage.startsWith('data:') ? '📂 Encoded Device Image' : colImage}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setColImage('')}
                            className="text-red-650 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 text-[9px] uppercase tracking-wider px-2 py-1 rounded cursor-pointer transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <label className="flex items-center justify-center gap-1.5 px-3 py-2 border-2 border-dashed border-[#c5a880]/30 hover:border-[#c5a880] rounded-lg cursor-pointer bg-white transition-all text-[11px] font-bold text-gray-750">
                          <Upload size={14} className="text-[#c5a880] animate-bounce" />
                          <span>Choose from device gallery</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const compressed = await compressImage(file, 600, 600, 0.7);
                                  setColImage(compressed);
                                } catch (err) {
                                  console.error('Failed to compress collection image:', err);
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setColImage(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }
                            }}
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="Or paste direct image URL fallback..."
                          value={colImage ? (colImage.startsWith('data:') ? '' : colImage) : ''}
                          onChange={(e) => setColImage(e.target.value)}
                          className="w-full bg-white border border-gray-200 px-3 py-2 rounded focus:outline-none placeholder-gray-350 text-[11px]"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Large Header Banner Image *</label>
                      {colBanner && (
                        <div className="p-2.5 bg-white border rounded-lg shadow-3xs space-y-2">
                          <div className="h-24 w-full rounded-lg overflow-hidden bg-gray-50 border relative">
                            <img src={colBanner} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setColBanner('')}
                              className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded cursor-pointer shadow-md transition-all"
                            >
                              Remove Banner
                            </button>
                          </div>
                          <span className="text-[9px] text-gray-400 font-mono block truncate">
                            {colBanner.startsWith('data:') ? '📂 Encoded Large Device Banner' : colBanner}
                          </span>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <label className="sm:col-span-1 flex items-center justify-center gap-1.5 px-3 py-2 border-2 border-dashed border-[#c5a880]/30 hover:border-[#c5a880] rounded-lg cursor-pointer bg-white transition-all text-[11px] font-bold text-gray-750 text-center">
                          <Upload size={14} className="text-[#c5a880] animate-bounce" />
                          <span>Choose Banner Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const compressed = await compressImage(file, 1200, 600, 0.7);
                                  setColBanner(compressed);
                                } catch (err) {
                                  console.error('Failed to compress collection banner:', err);
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setColBanner(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }
                            }}
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="Or paste direct banner/cover URL fallback..."
                          value={colBanner ? (colBanner.startsWith('data:') ? '' : colBanner) : ''}
                          onChange={(e) => setColBanner(e.target.value)}
                          className="sm:col-span-2 bg-white border border-gray-200 px-3 py-2 rounded focus:outline-none placeholder-gray-350 text-[11px]"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Short collection tagline description</label>
                      <textarea
                        rows={2}
                        placeholder="Briefly state fabric quality and collection target weather styles..."
                        value={colDesc}
                        onChange={(e) => setColDesc(e.target.value)}
                        className="w-full bg-white border border-gray-200 px-3 py-2 rounded focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200/50 pt-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Navigation Setting</label>
                        <label className="flex items-center gap-2 cursor-pointer bg-white border border-gray-200 p-2.5 rounded-lg select-none">
                          <input
                            type="checkbox"
                            checked={colShowInNavbar}
                            onChange={(e) => setColShowInNavbar(e.target.checked)}
                            className="rounded text-[#1e152a] focus:ring-[#1e152a] w-4 h-4 cursor-pointer"
                          />
                          <span className="font-semibold text-gray-750">Show on Public Navigation / Menu</span>
                        </label>
                        <p className="text-[9px] text-gray-400 mt-1">If unchecked, this collection hides from headers and storefront grids, but stays fully manageable in admin dashboard linking.</p>

                        <div className="mt-4 space-y-3">
                          <label className="block text-[10px] font-bold text-[#c5a880] uppercase tracking-wide">Homepage layout & grouping</label>
                          
                          <label className="flex items-center gap-2 cursor-pointer bg-white border border-gray-100 p-2.5 rounded-lg select-none">
                            <input
                              type="checkbox"
                              checked={colIsCombine}
                              onChange={(e) => setColIsCombine(e.target.checked)}
                              className="rounded text-violet-650 focus:ring-violet-400 w-4 h-4 cursor-pointer text-[#1e152a]"
                            />
                            <span className="font-semibold text-gray-800">📦 Put under 'Combine Products' section</span>
                          </label>
                          <p className="text-[9px] text-gray-400">If enabled, this collection will be grouped in a special "Combine Products" category on the home page circular list/browsing deck.</p>

                          <label className="flex items-center gap-2 cursor-pointer bg-white border border-gray-200 p-2.5 rounded-lg select-none">
                            <input
                              type="checkbox"
                              checked={colShowProductsOnHomepage}
                              onChange={(e) => setColShowProductsOnHomepage(e.target.checked)}
                              className="rounded text-[#1e152a] focus:ring-[#1e152a] w-4 h-4 cursor-pointer"
                            />
                            <span className="font-semibold text-gray-755">Show Products on Home Page</span>
                          </label>
                          <p className="text-[9px] text-gray-400">If enabled, unstitched suit fabrics from this collection will display dynamically on the home storefront page.</p>

                          {colShowProductsOnHomepage && (
                            <div className="p-3 bg-amber-50/40 border border-amber-200/50 rounded-lg space-y-2 animate-fade-in">
                              <label className="block text-[9px] font-bold text-amber-700 uppercase tracking-wider">
                                Select Homepage Layout Style
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setColHomepageLayoutStyle('grid')}
                                  className={`py-1.5 px-2.5 rounded border text-[10px] font-bold tracking-tight transition-all uppercase ${
                                    colHomepageLayoutStyle === 'grid'
                                      ? 'bg-amber-655 text-white border-amber-600 bg-[#c5a880]'
                                      : 'bg-white text-gray-650 border-gray-200 hover:bg-stone-50'
                                  }`}
                                >
                                  🔳 Small Grid View
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setColHomepageLayoutStyle('carousel')}
                                  className={`py-1.5 px-2.5 rounded border text-[10px] font-bold tracking-tight transition-all uppercase ${
                                    colHomepageLayoutStyle === 'carousel'
                                      ? 'bg-amber-655 text-white border-amber-600 bg-[#c5a880]'
                                      : 'bg-white text-gray-650 border-gray-200 hover:bg-stone-50'
                                  }`}
                                >
                                  ↔️ Horizontally Scrolling Carousel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Link Categories to Collection</label>
                        <div className="bg-white border border-gray-200 rounded-lg p-2.5 max-h-36 overflow-y-auto space-y-1.5">
                          {categories.length === 0 ? (
                            <span className="text-gray-400 italic text-[10px] block py-1">No categories found in database. Create categories first.</span>
                          ) : (
                            categories.map(cat => (
                              <label key={cat.id} className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={colLinkedCategoryIds.includes(cat.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setColLinkedCategoryIds([...colLinkedCategoryIds, cat.id]);
                                    } else {
                                      setColLinkedCategoryIds(colLinkedCategoryIds.filter(id => id !== cat.id));
                                    }
                                  }}
                                  className="rounded text-[#1e152a] focus:ring-[#1e152a] w-3.5 h-3.5 cursor-pointer"
                                />
                                <span className="font-semibold text-gray-700 text-[11px] flex items-center gap-1">
                                  <span>{cat.isGents ? '👔' : '👗'}</span>
                                  <span>{cat.name}</span>
                                </span>
                              </label>
                            ))
                          )}
                        </div>
                        <p className="text-[9px] text-gray-400 mt-1">Select categories whose unstitched fabrics should be showcased inside this collection page.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowColForm(false)}
                      className="flex-1 py-2 border rounded font-semibold text-gray-700 uppercase hover:bg-gray-50 cursor-pointer"
                    >
                      Close Form
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-[#1e152a] text-white hover:bg-[#c5a880] hover:text-black font-extrabold rounded uppercase tracking-wider cursor-pointer"
                    >
                      {editingColId ? 'Save Specs' : 'Publish Collection'}
                    </button>
                  </div>
                </form>
              )}

              {/* Collections table list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {collections.map(col => (
                  <div key={col.id} className="border border-gray-100 rounded-xl overflow-hidden p-3 bg-stone-50 flex items-center justify-between hover:shadow-xs transition-shadow">
                    <div className="flex gap-2.5 items-center min-w-0">
                      <img src={col.image} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-[#c5a880] flex-none bg-[#fff]" />
                      <div className="truncate">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <strong className="text-gray-800 text-sm font-bold truncate block">{col.name}</strong>
                          <span className="text-[8px] font-extrabold px-1 py-0.5 rounded bg-[#c5a880]/15 text-[#c5a880] shrink-0 uppercase tracking-tight">
                            {col.isGents !== false ? 'Gents' : 'Ladies'}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 block mt-0.5 truncate">{col.description}</span>
                      </div>
                    </div>
                    <div className="flex gap-0.5 shrink-0 pl-1">
                      <button
                        onClick={() => startEditCollection(col)}
                        className="p-1 text-gray-400 hover:text-[#c5a880] rounded cursor-pointer"
                        title="Edit collection specs"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => {
                          const key = 'delete-col-' + col.id;
                          if (activeConfirmKey === key) {
                            onDeleteCollection(col.id);
                            setActiveConfirmKey(null);
                          } else {
                            setActiveConfirmKey(key);
                            setTimeout(() => setActiveConfirmKey(null), 4000);
                          }
                        }}
                        className={`p-1 rounded transition-all cursor-pointer ${
                          activeConfirmKey === 'delete-col-' + col.id
                            ? 'text-red-500 bg-red-50 hover:bg-red-100 animate-pulse'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                        title={activeConfirmKey === 'delete-col-' + col.id ? "Click again to confirm" : "Delete collection"}
                      >
                        {activeConfirmKey === 'delete-col-' + col.id ? (
                          <span className="text-[9px] font-extrabold tracking-tight px-0.5 uppercase leading-none">TAP TO CONFIRM</span>
                        ) : (
                          <Trash2 size={13} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: EDIT CATEGORIES */}
          {currentTab === 'categories' && (
            <div className="space-y-6 animate-fade-in leading-relaxed text-xs">
              <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1e152a]">Manage Dynamic Categories</h3>
                  <p className="text-xs text-gray-400">
                    Create product categories. Easily assign them to Ladies or Gents classifications, appearing directly in the site menus!
                  </p>
                </div>
                {!showCatForm && (
                  <button
                    onClick={() => {
                      setEditingCatId(null);
                      setCatName('');
                      setCatDesc('');
                      setCatIsGents(true);
                      setShowCatForm(true);
                    }}
                    className="py-2 px-3.5 bg-[#1e152a] text-[#f1ebd9] hover:bg-[#c5a880] hover:text-black font-bold uppercase text-xs tracking-wider rounded transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus size={14} /> New Category
                  </button>
                )}
              </div>

              {/* INTERACTIVE GUIDED DELETE ASSISTANT */}
              <div className="bg-stone-50 border-2 border-dashed border-[#c5a880]/30 rounded-xl p-5 mb-6 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Trash2 size={18} className="text-red-600 animate-pulse" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1e152a]">Guided Deletion Assistant (Mandi HQ Safeguard)</h4>
                    <p className="text-[10px] text-gray-400">Select which classification type you would like to securely delete, then choose the item from the dropdown below.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteWizardType('gents-col');
                      setDeleteWizardSelectedId('');
                    }}
                    className={`p-2.5 rounded border text-center transition-all cursor-pointer ${
                      deleteWizardType === 'gents-col'
                        ? 'bg-[#1e152a] text-[#f1ebd9] border-[#1e152a] font-bold shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-stone-105'
                    }`}
                  >
                    <span className="block text-[14px] mb-1">🧔</span>
                    <span className="block text-[10px] uppercase font-bold tracking-tight text-gray-800">Gents Collection</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteWizardType('gents-cat');
                      setDeleteWizardSelectedId('');
                    }}
                    className={`p-2.5 rounded border text-center transition-all cursor-pointer ${
                      deleteWizardType === 'gents-cat'
                        ? 'bg-[#1e152a] text-[#f1ebd9] border-[#1e152a] font-bold shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-stone-105'
                    }`}
                  >
                    <span className="block text-[14px] mb-1">👔</span>
                    <span className="block text-[10px] uppercase font-bold tracking-tight text-gray-800">Gents Category</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteWizardType('ladies-col');
                      setDeleteWizardSelectedId('');
                    }}
                    className={`p-2.5 rounded border text-center transition-all cursor-pointer ${
                      deleteWizardType === 'ladies-col'
                        ? 'bg-[#1e152a] text-[#f1ebd9] border-[#1e152a] font-bold shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-stone-105'
                    }`}
                  >
                    <span className="block text-[14px] mb-1">👩</span>
                    <span className="block text-[10px] uppercase font-bold tracking-tight text-gray-800">Ladies Collection</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteWizardType('ladies-cat');
                      setDeleteWizardSelectedId('');
                    }}
                    className={`p-2.5 rounded border text-center transition-all cursor-pointer ${
                      deleteWizardType === 'ladies-cat'
                        ? 'bg-[#1e152a] text-[#f1ebd9] border-[#1e152a] font-bold shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-stone-105'
                    }`}
                  >
                    <span className="block text-[14px] mb-1">👗</span>
                    <span className="block text-[10px] uppercase font-bold tracking-tight text-gray-800">Ladies Category</span>
                  </button>
                </div>

                {deleteWizardType && (
                  <div className="p-3 bg-white border border-gray-250 rounded-lg space-y-3 animate-fade-in text-xs">
                    <div>
                      <label className="block text-[9px] font-bold text-[#c5a880] uppercase tracking-wide mb-1">
                        Select Lead Item to Delete
                      </label>
                      <select
                        value={deleteWizardSelectedId}
                        onChange={(e) => setDeleteWizardSelectedId(e.target.value)}
                        className="w-full bg-white border border-gray-250 px-3 py-2 rounded focus:outline-none focus:border-[#c5a880] cursor-pointer font-medium"
                      >
                        <option value="">-- Choose item below --</option>
                        {deleteWizardType === 'gents-col' &&
                          collections
                            .filter((c) => c.isGents !== false)
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                🧔 {c.name} ({c.description.substring(0, 40)}...)
                              </option>
                            ))}
                        {deleteWizardType === 'ladies-col' &&
                          collections
                            .filter((c) => !c.isGents)
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                👩 {c.name} ({c.description.substring(0, 40)}...)
                              </option>
                            ))}
                        {deleteWizardType === 'gents-cat' &&
                          categories
                            .filter((c) => c.isGents)
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                👔 {c.name} ({c.description.substring(0, 40)}...)
                              </option>
                            ))}
                        {deleteWizardType === 'ladies-cat' &&
                          categories
                            .filter((c) => !c.isGents)
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                👗 {c.name} ({c.description.substring(0, 40)}...)
                              </option>
                            ))}
                      </select>
                    </div>

                    {deleteWizardSelectedId && (
                      <div className="pt-2 flex items-center justify-between gap-3 border-t border-gray-100 animate-slide-up bg-red-50/40 p-2.5 rounded border border-red-150">
                        <div className="text-[10px] text-red-800 font-medium">
                          ⚠️ <strong>CRITICAL DATA REMOVAL ACTION:</strong> This will delete this specific entry from the database. This action is irreversible.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (activeConfirmKey === 'guided-delete-' + deleteWizardSelectedId) {
                              if (deleteWizardType === 'gents-col' || deleteWizardType === 'ladies-col') {
                                onDeleteCollection(deleteWizardSelectedId);
                              } else {
                                onDeleteCategory(deleteWizardSelectedId);
                              }
                              setDeleteWizardSelectedId('');
                              setDeleteWizardType(null);
                              setActiveConfirmKey(null);
                            } else {
                              setActiveConfirmKey('guided-delete-' + deleteWizardSelectedId);
                              setTimeout(() => setActiveConfirmKey(null), 5500);
                            }
                          }}
                          className={`py-1.5 px-4 rounded font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer shadow-xs shrink-0 ${
                            activeConfirmKey === 'guided-delete-' + deleteWizardSelectedId
                              ? 'bg-red-600 text-white animate-pulse'
                              : 'bg-[#1e152a] text-white hover:bg-red-600'
                          }`}
                        >
                          {activeConfirmKey === 'guided-delete-' + deleteWizardSelectedId ? 'TAP ONCE MORE TO CONFIRM' : '✓ Secure Delete'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cat editing form */}
              {showCatForm && (
                <form onSubmit={handleCategorySubmit} className="p-5 bg-stone-50 border border-gray-200 rounded-xl space-y-4 animate-fade-in text-xs">
                  <h4 className="font-serif font-bold text-md text-[#1e152a] border-b border-[#e1d9cd]/50 pb-2">
                    {editingCatId ? 'Configure Category Specs' : 'Register New Category'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Category Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Silk Dupatta"
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        className="w-full bg-white border border-gray-200 px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Gender Belonging *</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setCatIsGents(true)}
                          className={`flex-1 py-1.5 px-3 rounded text-xs font-bold transition-all border ${
                            catIsGents 
                              ? 'bg-[#1e152a] border-[#1e152a] text-[#f1ebd9]' 
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          👔 Gents Category
                        </button>
                        <button
                          type="button"
                          onClick={() => setCatIsGents(false)}
                          className={`flex-1 py-1.5 px-3 rounded text-xs font-bold transition-all border ${
                            !catIsGents 
                              ? 'bg-[#1e152a] border-[#1e152a] text-[#f1ebd9]' 
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          👗 Ladies Category
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Small Tagline / Description *</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="e.g. Elegant printed chiffon or silk dupatta sets..."
                        value={catDesc}
                        onChange={(e) => setCatDesc(e.target.value)}
                        className="w-full bg-white border border-gray-200 px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>

                    <div className="sm:col-span-2 border-t border-gray-200/50 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Navigation Setting</label>
                        <label className="flex items-center gap-2 cursor-pointer bg-white border border-gray-200 p-2.5 rounded-lg select-none">
                          <input
                            type="checkbox"
                            checked={catShowInNavbar}
                            onChange={(e) => setCatShowInNavbar(e.target.checked)}
                            className="rounded text-[#1e152a] focus:ring-[#1e152a] w-4 h-4 cursor-pointer"
                          />
                          <span className="font-semibold text-gray-750">Show on Public Navigation / Menu</span>
                        </label>
                        <p className="text-[9px] text-gray-400 mt-1">If unchecked, this category hides from header layout menus, but stays fully available to link inside collections or products.</p>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Home Page Setting</label>
                        <label className="flex items-center gap-2 cursor-pointer bg-white border border-gray-200 p-2.5 rounded-lg select-none">
                          <input
                            type="checkbox"
                            checked={catShowProductsOnHomepage}
                            onChange={(e) => setCatShowProductsOnHomepage(e.target.checked)}
                            className="rounded text-[#1e152a] focus:ring-[#1e152a] w-4 h-4 cursor-pointer"
                          />
                          <span className="font-semibold text-gray-755">Show Products on Home Page</span>
                        </label>
                        <p className="text-[9px] text-gray-400 mt-1">If enabled, a dedicated row of unstitched fabrics featured under this category will dynamically display on the home storefront page.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCatForm(false)}
                      className="flex-1 py-2 border rounded font-semibold text-gray-700 uppercase hover:bg-gray-50 cursor-pointer text-xs"
                    >
                      Close Form
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-[#1e152a] text-white hover:bg-[#c5a880] hover:text-black font-extrabold rounded uppercase tracking-wider cursor-pointer text-xs"
                    >
                      {editingCatId ? 'Save Specs' : 'Publish Category'}
                    </button>
                  </div>
                </form>
              )}

              {/* Categories table list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map(cat => (
                  <div key={cat.id} className="border border-gray-100 rounded-xl overflow-hidden p-3 bg-stone-50 flex items-center justify-between hover:shadow-xs transition-shadow">
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-gray-800 text-xs font-serif font-bold truncate block">{cat.name}</strong>
                        <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100/30 text-amber-800 uppercase tracking-tight font-sans">
                          {cat.isGents ? '👔 Gents' : '👗 Ladies'}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">{cat.description}</p>
                    </div>
                    
                    <div className="flex gap-0.5 shrink-0 pl-1 border-l border-gray-200/40">
                      <button
                        onClick={() => startEditCategory(cat)}
                        className="p-1 text-gray-400 hover:text-[#c5a880] rounded cursor-pointer"
                        title="Edit category details"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => {
                          const key = 'delete-cat-' + cat.id;
                          if (activeConfirmKey === key) {
                            onDeleteCategory(cat.id);
                            setActiveConfirmKey(null);
                          } else {
                            setActiveConfirmKey(key);
                            setTimeout(() => setActiveConfirmKey(null), 4000);
                          }
                        }}
                        className={`p-1 rounded transition-all cursor-pointer ${
                          activeConfirmKey === 'delete-cat-' + cat.id
                            ? 'text-red-500 bg-red-50 hover:bg-red-100 animate-pulse'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                        title={activeConfirmKey === 'delete-cat-' + cat.id ? "Click again to confirm" : "Delete category"}
                      >
                        {activeConfirmKey === 'delete-cat-' + cat.id ? (
                          <span className="text-[9px] font-extrabold tracking-tight px-0.5 uppercase leading-none">CONFIRM</span>
                        ) : (
                          <Trash2 size={13} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SUBSCRIBERS LIST AND NEWSLETTER BROADCAST LOGS */}
          {currentTab === 'subscribers' && (
            <div className="space-y-6 animate-fade-in leading-relaxed text-xs">
              <div className="pb-3 border-b border-gray-100">
                <h3 className="font-serif font-bold text-lg text-[#1e152a]">Subscribed Customers & Email Dispatch Logs</h3>
                <p className="text-xs text-gray-400">
                  Track customers who opted into newsletters, and inspect automated notifications fired on product publishing!
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left panel: Active Subscribers (Grid-Columns: 5) */}
                <div className="lg:col-span-5 bg-stone-50 p-4 rounded-xl border border-gray-100 space-y-4">
                  <h4 className="font-serif font-bold text-sm text-gray-800 flex items-center gap-1.5 border-b pb-2">
                    <Users size={16} className="text-[#c5a880]" />
                    Registered Subscribers ({subscriptions.length})
                  </h4>

                  {subscriptions.length === 0 ? (
                    <div className="text-center py-10 bg-white border border-gray-100 rounded-lg">
                      <span className="text-2xl">📪</span>
                      <p className="text-[11px] text-gray-400 mt-1">No subscribers recorded yet.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 space-y-2 max-h-[300px] overflow-y-auto pr-1 no-scrollbar bg-white p-3 rounded-lg border border-gray-100">
                      {subscriptions.map(sub => (
                        <div key={sub.id} className="pt-2 first:pt-0 space-y-0.5">
                          <strong className="text-gray-800 block">{sub.customerName || 'Anonymous Friend'}</strong>
                          <span className="text-gray-500 font-mono text-[10px] block">{sub.email}</span>
                          <span className="text-[9px] text-gray-400 font-light block">Opt-in on: {new Date(sub.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right panel: Broadcast Log ledger (Grid-Columns: 7) */}
                <div className="lg:col-span-7 bg-white rounded-xl border border-gray-100 p-4 space-y-4">
                  <h4 className="font-serif font-bold text-sm text-[#1e152a] flex items-center gap-1.5 border-b pb-2">
                    <Mail size={16} className="text-[#c5a880]" />
                    Automated Broadcast Histories ({notifications.length})
                  </h4>

                  {notifications.length === 0 ? (
                    <div className="text-center py-10 bg-stone-50 rounded-lg border border-dashed border-gray-100">
                      <p className="text-gray-400 text-xs text-center">
                        Add a new product entry from the "Product Catalog" tab to fire automated email dispatches automatically!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                      {notifications.map(logs => (
                        <div key={logs.id} className="p-3 border border-gray-100 bg-[#faf9f6]/30 rounded-xl space-y-2 animate-fade-in">
                          <div className="flex justify-between items-center bg-white p-1 rounded border">
                            <div className="flex items-center gap-2">
                              <img src={logs.productImage} alt="" className="w-8 h-10 rounded object-cover" />
                              <div>
                                <strong className="text-gray-800 font-serif leading-none text-xs block">"{logs.productName}"</strong>
                                <span className="font-sans text-[10px] text-gray-400 block mt-1">Status: Dispatched</span>
                              </div>
                            </div>
                            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-mono px-2 py-1 font-bold rounded-sm border border-emerald-100">
                              💌 Sent successful
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium">
                            <span>Target: {logs.recipientsCount} Active Inbox{logs.recipientsCount !== 1 ? 'es' : ''} Lahore</span>
                            <span>Date: {new Date(logs.sentAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MARKETING PIXELS */}
          {false && (
            <div className="space-y-6 animate-fade-in leading-relaxed text-xs">
              <div className="pb-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1e152a]">Marketing Pixels & Analytics Integration</h3>
                  <p className="text-xs text-gray-400">
                    Propel store sales growth by connecting tracking tools. Dynamically inject tags and measure automated catalog acquisitions.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    pixelEnabled && pixelId 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-stone-100 text-gray-400 border border-stone-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${pixelEnabled && pixelId ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                    {pixelEnabled && pixelId ? 'Meta Pixel Connected' : 'Deactivated'}
                  </span>
                </div>
              </div>

              {/* Alert notifications */}
              {pixelError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-2.5 animate-fade-in" id="pixel-error-banner">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <strong className="block font-bold">Failed to sync settings</strong>
                    <p className="text-[11px] text-red-650 mt-0.5">{pixelError}</p>
                  </div>
                </div>
              )}

              {pixelSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-850 rounded-xl flex items-start gap-2.5 animate-fade-in" id="pixel-success-banner">
                  <CheckCircle size={16} className="shrink-0 mt-0.5 text-emerald-500" />
                  <div>
                    <strong className="block font-bold">Settings Updated Successfully</strong>
                    <p className="text-[11px] text-emerald-705 mt-0.5">{pixelSuccess}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Main Configuration Card (lg:col-span-7) */}
                <form onSubmit={handleSaveMarketingPixel} className="lg:col-span-7 bg-white rounded-xl border border-gray-150 p-5 space-y-5 shadow-xs" id="marketing-setup-form">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#1e152a] text-sm block">Facebook Meta Pixel (Shopify-style)</span>
                        <p className="text-[11px] text-gray-400">Track and optimize conversion campaigns automatically on your ad accounts.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={pixelEnabled} 
                          onChange={(e) => setPixelEnabled(e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#c5a880]"></div>
                        <span className="sr-only">Toggle tracking state</span>
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-gray-700 font-bold text-[11px] uppercase tracking-wider">Facebook Pixel ID</label>
                      <input 
                        type="text" 
                        value={pixelId}
                        disabled={isLoadingPixel}
                        onChange={(e) => {
                          setPixelId(e.target.value);
                          if (pixelSaveStatus === 'saved') setPixelSaveStatus('idle');
                          if (pixelVerificationState !== 'idle') setPixelVerificationState('idle');
                        }}
                        placeholder="e.g. 1779877349104"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-lg text-xs font-mono tracking-wider focus:outline-hidden focus:border-[#1e152a] focus:bg-white transition-all disabled:opacity-50"
                      />
                      <p className="text-[10px] text-gray-400 font-light">
                        Locate your numeric 15-to-16 digit Pixel ID inside Meta Events Manager under Data Sources.
                      </p>
                    </div>

                    {pixelVerificationState !== 'idle' && (
                      <div className={`p-4 rounded-xl border text-xs font-sans space-y-2 animate-fade-in ${
                        pixelVerificationState === 'checking' ? 'bg-amber-50/40 border-amber-200 text-amber-900' :
                        pixelVerificationState === 'verified' ? 'bg-emerald-50/40 border-emerald-200 text-emerald-900' :
                        'bg-red-50/40 border-red-200 text-red-900'
                      }`} id="pixel-live-status-card">
                        <div className="flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                            {pixelVerificationState === 'checking' && (
                              <>
                                <Loader size={13} className="animate-spin text-amber-600" />
                                <span>Initiating Telemetry Connection Test...</span>
                              </>
                            )}
                            {pixelVerificationState === 'verified' && (
                              <>
                                <CheckCircle size={13} className="text-emerald-600" />
                                <span>Meta Pixel Connectivity Verified</span>
                              </>
                            )}
                            {pixelVerificationState === 'failed' && (
                              <>
                                <AlertTriangle size={13} className="text-red-650 animate-bounce" />
                                <span>Telemetry Handshake Refused</span>
                              </>
                            )}
                          </span>
                          
                          {pixelLatency !== null && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded font-extrabold uppercase">
                              {pixelLatency}ms OK
                            </span>
                          )}
                        </div>
                        
                        <p className="text-[10.5px] leading-relaxed text-gray-500 font-medium font-sans">
                          {pixelVerificationState === 'checking' && 'Contacting connect.facebook.net edge routing to request active pageview pixel headers.'}
                          {pixelVerificationState === 'verified' && 'Pixel active. Communication tests with Meta’s fallback ledger returned a success status. Events are ready to be captured.'}
                          {pixelVerificationState === 'failed' && 'Error: The telemetry test timed out or returned no response. Make sure you entered a registered Pixel ID, your internet is online, and adblock is turned off.'}
                        </p>

                        {pixelWarning && (
                          <div className="mt-2 pt-2 border-t border-amber-200/50 text-[10px] text-amber-800/90 flex items-start gap-1.5">
                            <AlertTriangle size={12} className="mt-0.5 shrink-0 text-amber-600 animate-pulse" />
                            <span><strong>Note:</strong> {pixelWarning}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {pixelId.trim() && !/^\d+$/.test(pixelId.trim()) && (
                      <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-[10px] flex items-start gap-1.5">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-700" />
                        <span><strong>Format Notice:</strong> Meta Pixel IDs contain digits only. Please verify no alphabetic prefix or letters are included.</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-150 flex items-center justify-between gap-4 font-sans">
                    <span className="text-[10px] text-gray-400 select-none">
                      {pixelSaveStatus === 'saving' ? 'Saving configuration parameters...' : 'Secure SSL Active'}
                    </span>
                    <button
                      type="submit"
                      disabled={isLoadingPixel || pixelSaveStatus === 'saving'}
                      className="px-5 py-2.5 bg-[#1e152a] text-[#f1ebd9] hover:bg-[#c5a880] hover:text-black font-extrabold uppercase text-[10px] tracking-widest rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs active:scale-98"
                    >
                      {pixelSaveStatus === 'saving' ? (
                        <>
                          <Loader size={12} className="animate-spin" />
                          Saving settings...
                        </>
                      ) : (
                        <>
                          <Check size={12} className="stroke-[3]" />
                          Save Settings
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Sidebar Information Panel (lg:col-span-5) */}
                <div className="lg:col-span-5 bg-stone-50 rounded-xl border border-gray-200/65 p-4 space-y-4 font-sans">
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-[#1e152a] text-sm">Automated Event Tracking Matrix</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Our system automatically tracks direct ecommerce funnel behaviors and communicates them securely to Facebook:
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-gray-100 shadow-3xs">
                      <span className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <div className="space-y-0.5">
                        <strong className="text-[#1e152a] font-mono font-bold block text-[10px]">PageView</strong>
                        <p className="text-[10px] text-gray-500 leading-normal">Fires as people transition between categories, collections, or custom about sections.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-gray-100 shadow-3xs">
                      <span className="w-4 h-4 rounded-full bg-purple-50 text-purple-600 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <div className="space-y-0.5">
                        <strong className="text-[#1e152a] font-mono font-bold block text-[10px]">ViewContent</strong>
                        <p className="text-[10px] text-gray-500 leading-normal">Fires when looking at individual premium lawn suits or Winter shawls.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-gray-100 shadow-3xs">
                      <span className="w-4 h-4 rounded-full bg-amber-50 text-amber-600 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <div className="space-y-0.5">
                        <strong className="text-[#1e152a] font-mono font-bold block text-[10px]">AddToCart</strong>
                        <p className="text-[10px] text-gray-550 leading-normal">Fires immediately when an outfit is added to the shopping drawer bag.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-gray-100 shadow-3xs">
                      <span className="w-4 h-4 rounded-full bg-indigo-50 text-indigo-600 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                      <div className="space-y-0.5">
                        <strong className="text-[#1e152a] font-mono font-bold block text-[10px]">InitiateCheckout</strong>
                        <p className="text-[10px] text-gray-550 leading-normal">Fires when they view the checkout shipment collection information page.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-gray-100 shadow-3xs">
                      <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">5</span>
                      <div className="space-y-0.5">
                        <strong className="text-[#1e152a] font-mono font-bold block text-[10px]">Purchase</strong>
                        <p className="text-[10px] text-gray-550 leading-normal">Fires right as Zaffar Iqbal receives a Lahore COD/Advance transfer order dispatch lock.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: SEO & GOOGLE SERP SIMULATOR */}
          {false && (
            <div className="space-y-6 animate-fade-in leading-relaxed text-xs">
              <div className="pb-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1e152a]">Google SEO Metadata & SERP Simulator</h3>
                  <p className="text-xs text-gray-400">
                    Optimize metadata in real time. Formulate precise descriptions and keywords to maximize click-through rates (CTR) on organic query systems.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    seoFormStatus === 'saved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-gray-400 border border-stone-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${seoFormStatus === 'saved' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                    {seoFormStatus === 'saved' ? 'Changes Live' : 'Not Saved'}
                  </span>
                </div>
              </div>

              {/* Success/Error Notifications */}
              {seoErrorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-2.5 animate-fade-in" id="seo-error-banner">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <strong className="block font-bold">Failed to update SEO config</strong>
                    <p className="text-[11px] text-red-655 mt-0.5">{seoErrorMessage}</p>
                  </div>
                </div>
              )}

              {seoFormStatus === 'saved' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-850 rounded-xl flex items-start gap-2.5 animate-fade-in" id="seo-success-banner">
                  <CheckCircle size={16} className="shrink-0 mt-0.5 text-emerald-500" />
                  <div>
                    <strong className="block font-bold">SEO Parameters Connected Real-Time!</strong>
                    <p className="text-[11px] text-emerald-705 mt-0.5">
                      Your changes have been saved to Firestore and dynamically updated across browser titles and indexable metadata meta tags.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Form fields */}
                <form onSubmit={handleSaveSeoSettings} className="lg:col-span-7 bg-white rounded-xl border border-gray-150 p-5 space-y-5 shadow-xs" id="seo-setup-form">
                  <div className="space-y-4">
                    <span className="font-bold text-[#1e152a] text-sm block border-b pb-2">Global Meta Configuration</span>

                    {/* SEO Title */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block text-gray-700 font-bold text-[11px] uppercase tracking-wider">Search Engine Title</label>
                        <span className={`text-[10px] font-mono ${seoFormTitle.length > 60 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                          {seoFormTitle.length} / 60 chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={seoFormTitle}
                        onChange={(e) => {
                          setSeoFormTitle(e.target.value);
                          if (seoFormStatus === 'saved') setSeoFormStatus('idle');
                        }}
                        placeholder="Al-Hamd Fabrics | Premium Lawn Suits & Unstitched Gents Fabrics"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-lg text-xs font-sans focus:outline-hidden focus:border-[#1e152a] focus:bg-white transition-all"
                        required
                      />
                      <p className="text-[10px] text-gray-400">
                        The clickable blue header shown on search results pages. Keep it under 60 characters for best display on desktop/mobile screens.
                      </p>
                    </div>

                    {/* Meta Description */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block text-gray-700 font-bold text-[11px] uppercase tracking-wider">Meta Description</label>
                        <span className={`text-[10px] font-mono ${seoFormDescription.length > 160 ? 'text-amber-600 font-bold' : 'text-gray-400'}`}>
                          {seoFormDescription.length} / 160 chars
                        </span>
                      </div>
                      <textarea
                        value={seoFormDescription}
                        onChange={(e) => {
                          setSeoFormDescription(e.target.value);
                          if (seoFormStatus === 'saved') setSeoFormStatus('idle');
                        }}
                        placeholder="Discover Al-Hamd Fabrics Lahore's exquisite collections of luxury unstitched lawn..."
                        className="w-full h-24 px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-lg text-xs font-sans focus:outline-hidden focus:border-[#1e152a] focus:bg-white transition-all resize-none"
                        required
                      />
                      <p className="text-[10px] text-gray-400">
                        A detailed summary of your store. Helps crawlers index keywords. Google suggests descriptions between 120 and 160 characters.
                      </p>
                    </div>

                    {/* Keywords */}
                    <div className="space-y-1.5">
                      <label className="block text-gray-700 font-bold text-[11px] uppercase tracking-wider">Search Keywords (Comma Separated)</label>
                      <input
                        type="text"
                        value={seoFormKeywords}
                        onChange={(e) => {
                          setSeoFormKeywords(e.target.value);
                          if (seoFormStatus === 'saved') setSeoFormStatus('idle');
                        }}
                        placeholder="Al-Hamd Fabrics, Lawn Suits, Unstitched Gents Fabrics, Giza Cotton, Lahore"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-lg text-xs font-sans focus:outline-hidden focus:border-[#1e152a] focus:bg-white transition-all"
                      />
                      <div className="flex flex-wrap gap-1 mt-1.5 pt-1">
                        {seoFormKeywords.split(',').map((kw, idx) => {
                          const trimmed = kw.trim();
                          if (!trimmed) return null;
                          return (
                            <span key={idx} className="bg-[#c5a880]/10 text-[#1e152a] text-[9.5px] px-2 py-0.5 rounded font-medium border border-[#c5a880]/20">
                              #{trimmed}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Submission and Status */}
                  <div className="pt-4 border-t border-gray-150 flex items-center justify-between gap-4 font-sans">
                    <span className="text-[10px] text-gray-400 select-none">
                      {seoFormStatus === 'saving' ? 'Publishing parameters to server...' : 'Secure SSL Active'}
                    </span>
                    <button
                      type="submit"
                      disabled={seoFormStatus === 'saving'}
                      className="px-5 py-2.5 bg-[#1e152a] text-[#f1ebd9] hover:bg-[#c5a880] hover:text-black font-extrabold uppercase text-[10px] tracking-widest rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs active:scale-98"
                    >
                      {seoFormStatus === 'saving' ? (
                        <>
                          <Loader size={12} className="animate-spin" />
                          Publishing Seos...
                        </>
                      ) : (
                        <>
                          <Check size={12} className="stroke-[3]" />
                          Save SEO Settings
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Real-time Google SERP Simulator Widget (lg:col-span-5) */}
                <div className="lg:col-span-5 bg-stone-50 rounded-xl border border-gray-200 p-4 space-y-4 font-sans font-normal text-left">
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-[#1e152a] text-sm flex items-center gap-1.5">
                      <Globe size={14} className="text-[#c5a880] animate-pulse" />
                      Google SERP Sandbox Previews
                    </h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                      This simulator renders exactly how Google crawlers will present your store homepage on live desktop and mobile search engine search screens:
                    </p>
                  </div>

                  {/* Dynamic Google Result - Desktop */}
                  <div className="bg-white rounded-xl border border-gray-155 p-4.5 space-y-2 pb-5 shadow-3xs hover:shadow-2xs transition-shadow">
                    <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 pb-1.5">
                      <span>Desktop Search Preview</span>
                      <span className="text-[#c5a880]">Live Sandbox</span>
                    </div>

                    <div className="space-y-1 font-sans text-left mt-2">
                      {/* Breadcrumb URL snippet */}
                      <div className="text-[12px] text-[#202124] flex items-center gap-1 overflow-hidden whitespace-nowrap text-ellipsis font-light">
                        <span className="font-medium text-[13px]">https://alhamdfabrics.shop</span>
                        <span className="text-[#5f6368] text-[10px]">› categories › gents-cotton</span>
                      </div>
                      
                      {/* Live Blue Title tag */}
                      <div className="text-[19px] leading-tight text-[#1a0dab] hover:underline font-normal cursor-pointer break-words line-clamp-2">
                        {seoFormTitle || 'Al-Hamd Fabrics | Premium Lawn Suits & Unstitched Gents Fabrics'}
                      </div>

                      {/* Snippet text description */}
                      <div className="text-[13px] text-[#4d5156] leading-relaxed break-words line-clamp-2 font-normal">
                        <span className="text-gray-400 font-mono text-[10.5px] border border-gray-100 px-1 py-0.2 rounded mr-1">Jun 5, 2026</span>
                        {seoFormDescription || "Discover Al-Hamd Fabrics Lahore's exquisite collections of luxury unstitched lawn, premium gents Giza cotton, and festive ceremonial suits..."}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Google Result - Mobile Grid */}
                  <div className="bg-white rounded-xl border border-gray-155 p-4.5 space-y-2 pb-5 shadow-3xs overflow-hidden">
                    <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 pb-1.5">
                      <span>Mobile Search Card</span>
                      <span className="text-blue-500 font-mono">Pixel Sync Responsive</span>
                    </div>

                    <div className="space-y-1.5 font-sans text-left mt-2 max-w-sm mx-auto p-3.5 border border-stone-100 rounded-2xl bg-[#f8f9fa]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#1e152a] flex items-center justify-center shrink-0 border border-stone-200 overflow-hidden p-0.5">
                          <img 
                            src="/alpha-fabrics-icon-transparent.png" 
                            alt="Al-Hamd Fabrics Icon" 
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="text-[12px] leading-tight flex flex-col">
                          <span className="font-medium text-[#202124] text-[11px]">Al-Hamd Fabrics</span>
                          <span className="text-[#5f6368] text-[9px]">https://alhamdfabrics.shop</span>
                        </div>
                      </div>

                      {/* Live Blue Title tag */}
                      <div className="text-[16px] leading-snug text-[#1558d6] hover:underline font-medium cursor-pointer break-words line-clamp-3">
                        {seoFormTitle || 'Al-Hamd Fabrics | Premium Lawn Suits & Unstitched Gents Fabrics'}
                      </div>

                      {/* Snippet message description */}
                      <div className="text-[12px] text-[#4d5156] leading-relaxed break-words font-light">
                        {seoFormDescription || "Discover Al-Hamd Fabrics Lahore's exquisite collections of luxury unstitched lawn, premium gents Giza cotton, and festive ceremonial suits..."}
                      </div>
                    </div>
                  </div>

                  {/* SEO Audit Checklist (Bento style) */}
                  <div className="p-3 bg-stone-100/50 rounded-lg space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#c5a880] tracking-wider block">SEO Checklist Analysis</span>
                    
                    <div className="space-y-1 text-[10px]">
                      {/* Check Title Length */}
                      <div className="flex items-center gap-2">
                        {seoFormTitle.length >= 30 && seoFormTitle.length <= 60 ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
                        )}
                        <span className={seoFormTitle.length >= 30 && seoFormTitle.length <= 60 ? 'text-gray-600 font-medium' : 'text-amber-800 font-light'}>
                          Title Length: {seoFormTitle.length}/60 chars ({seoFormTitle.length >= 30 && seoFormTitle.length <= 60 ? 'Optimal' : 'Aim for 30-60 characters'})
                        </span>
                      </div>

                      {/* Check Description Length */}
                      <div className="flex items-center gap-2">
                        {seoFormDescription.length >= 120 && seoFormDescription.length <= 165 ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
                        )}
                        <span className={seoFormDescription.length >= 120 && seoFormDescription.length <= 165 ? 'text-gray-600 font-medium' : 'text-amber-800 font-light'}>
                          Description Length: {seoFormDescription.length}/160 chars ({seoFormDescription.length >= 120 && seoFormDescription.length <= 165 ? 'Optimal' : 'Aim for 120-160 characters'})
                        </span>
                      </div>

                      {/* Google Crawler Link Badge */}
                      <div className="flex items-center gap-2 text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        <span>Dynamic injection active across all site routers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: COUPON MANAGEMENT */}
          {currentTab === 'coupons' && (
            <div className="space-y-6 animate-fade-in leading-relaxed text-xs">
              <div className="pb-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1e152a]">Discount Coupon Codes Manager</h3>
                  <p className="text-xs text-gray-400">
                    Generate and manage promotional coupon codes, less flat price or percentages, and define applicability constraints.
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setCouponCode('');
                      setCouponDiscountType('flat');
                      setCouponDiscountValue(0);
                      setCouponApplyTo('all');
                      setCouponSelectedProductIds([]);
                      setCouponActive(true);
                      setCouponActivationDate('');
                      setCouponExpiryDate('');
                      setCouponActivateNow(true);
                      setShowCouponForm(!showCouponForm);
                    }}
                    className="px-4 py-2 bg-[#1e152a] text-[#f1ebd9] hover:bg-[#c5a880] hover:text-black font-extrabold uppercase text-[10px] tracking-widest rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs animate-none"
                  >
                    {showCouponForm ? <X size={12} className="stroke-[3]" /> : <Plus size={12} className="stroke-[3]" />}
                    {showCouponForm ? 'Close Editor' : 'Generate New Coupon'}
                  </button>
                </div>
              </div>

              {showCouponForm && (
                <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-xs space-y-4" id="coupon-editor-card">
                  <span className="font-bold text-[#1e152a] text-sm block border-b pb-2">Create New Coupon Settings</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-full text-left">
                    {/* Code input */}
                    <div className="space-y-1.5">
                      <label className="block text-gray-700 font-bold text-[11px] uppercase tracking-wider">Coupon Code (Alpha-numeric, uppercase)</label>
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                        placeholder="e.g. SUMMER500"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-lg text-xs font-sans focus:outline-hidden focus:border-[#1e152a] focus:bg-white transition-all uppercase font-semibold"
                        required
                      />
                    </div>

                    {/* Active Status */}
                    <div className="space-y-1.5">
                      <label className="block text-gray-700 font-bold text-[11px] uppercase tracking-wider">Coupon Status</label>
                      <div className="flex gap-4 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={couponActive}
                            onChange={() => setCouponActive(true)}
                            className="text-[#1e152a] focus:ring-[#1e152a]"
                          />
                          <span className="font-medium text-gray-750 text-xs">Active & Usable</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={!couponActive}
                            onChange={() => setCouponActive(false)}
                            className="text-[#1e152a] focus:ring-[#1e152a]"
                          />
                          <span className="font-medium text-gray-750 text-xs">Disabled & Hidden</span>
                        </label>
                      </div>
                    </div>

                    {/* Scheduling Options */}
                    <div className="col-span-full border border-stone-200 bg-stone-50/50 p-4 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                      <div className="space-y-1.5 flex flex-col justify-center">
                        <label className="block text-gray-750 font-bold text-[11px] uppercase tracking-wider">Activate Now</label>
                        <label className="relative inline-flex items-center gap-2.5 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={couponActivateNow}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setCouponActivateNow(checked);
                              if (checked) {
                                setCouponActive(true);
                              }
                            }}
                            className="w-4 h-4 text-[#1e152a] border-gray-300 rounded focus:ring-[#1e152a] accent-[#1e152a] cursor-pointer"
                          />
                          <span className="font-bold text-[#1e152a] text-xs">Activate Immediately</span>
                        </label>
                        <p className="text-[10px] text-gray-400 font-light mt-1">If enabled, schedules are bypassed and coupon launches instantly.</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-gray-750 font-bold text-[11px] uppercase tracking-wider">Activation Start Date & Time</label>
                        <input
                          type="datetime-local"
                          value={couponActivationDate}
                          onChange={(e) => {
                            setCouponActivationDate(e.target.value);
                            if (e.target.value) {
                              setCouponActivateNow(false);
                            }
                          }}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-sans focus:outline-hidden focus:border-[#1e152a]"
                        />
                        <p className="text-[10px] text-gray-400 font-light">Specify when this coupon starts working (Optional).</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-gray-755 font-bold text-[11px] uppercase tracking-wider">Expiry / Ending Date & Time</label>
                        <input
                          type="datetime-local"
                          value={couponExpiryDate}
                          onChange={(e) => setCouponExpiryDate(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-sans focus:outline-hidden focus:border-[#1e152a]"
                        />
                        <p className="text-[10px] text-gray-400 font-light">Specify when code gets automatically disabled (Optional).</p>
                      </div>
                    </div>

                    {/* Discount Type */}
                    <div className="space-y-1.5">
                      <label className="block text-gray-700 font-bold text-[11px] uppercase tracking-wider">Discount Type</label>
                      <select
                        value={couponDiscountType}
                        onChange={(e) => {
                          setCouponDiscountType(e.target.value as 'flat' | 'percentage');
                          setCouponDiscountValue(0);
                        }}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-lg text-xs font-sans focus:outline-hidden focus:border-[#1e152a] focus:bg-white transition-all font-semibold"
                      >
                        <option value="flat">Flat Price Reduction (PKR Off)</option>
                        <option value="percentage">Percentage Offset (% Off)</option>
                      </select>
                    </div>

                    {/* Discount Value */}
                    <div className="space-y-1.5">
                      <label className="block text-gray-700 font-bold text-[11px] uppercase tracking-wider">
                        {couponDiscountType === 'flat' ? 'Discount Value (in PKR)' : 'Discount Percentage (e.g. 10 for 10% off)'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={couponDiscountValue || ''}
                        onChange={(e) => setCouponDiscountValue(Number(e.target.value))}
                        placeholder={couponDiscountType === 'flat' ? 'e.g. 500' : 'e.g. 15'}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-lg text-xs font-sans focus:outline-hidden focus:border-[#1e152a] focus:bg-white transition-all font-semibold"
                        required
                      />
                    </div>

                    {/* Apply To */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-gray-700 font-bold text-[11px] uppercase tracking-wider">Applicable Products</label>
                      <select
                        value={couponApplyTo}
                        onChange={(e) => setCouponApplyTo(e.target.value as 'all' | 'specific')}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-gray-200 rounded-lg text-xs font-sans focus:outline-hidden focus:border-[#1e152a] focus:bg-white transition-all font-semibold"
                      >
                        <option value="all">Work on All Products Store-Wide</option>
                        <option value="specific">Work Only on Specific Selected Products</option>
                      </select>
                    </div>

                    {/* Specific Product Selection widget */}
                    {couponApplyTo === 'specific' && (
                      <div className="md:col-span-2 space-y-3 bg-stone-50 p-4 rounded-xl border border-gray-150 text-left">
                        <span className="font-bold text-[#1e152a] text-xs block">Select Specific Products</span>
                        
                        {/* Search product filter input */}
                        <div className="relative">
                          <input
                            type="text"
                            value={couponSearchProduct}
                            onChange={(e) => setCouponSearchProduct(e.target.value)}
                            placeholder="Type product model code or name to search..."
                            className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs font-sans focus:outline-hidden"
                          />
                        </div>

                        {/* Search result and match select list */}
                        <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1 font-sans">
                          {products
                            .filter(p => !couponSearchProduct || p.name.toLowerCase().includes(couponSearchProduct.toLowerCase()) || p.id.toLowerCase().includes(couponSearchProduct.toLowerCase()))
                            .map((prod) => {
                              const isSelected = couponSelectedProductIds.includes(prod.id);
                              return (
                                <div key={prod.id} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-100 shadow-3xs text-[11px]">
                                  <div className="flex items-center gap-2">
                                    {prod.images?.[0] && (
                                      <img referrerPolicy="no-referrer" src={prod.images[0]} alt="" className="w-8 h-8 rounded object-cover" />
                                    )}
                                    <div className="text-left">
                                      <span className="font-bold text-gray-800 block">{prod.name}</span>
                                      <span className="font-mono text-[9px] text-gray-400">{prod.id} • {formatPKR(prod.price)}</span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (isSelected) {
                                        setCouponSelectedProductIds(couponSelectedProductIds.filter(id => id !== prod.id));
                                      } else {
                                        setCouponSelectedProductIds([...couponSelectedProductIds, prod.id]);
                                      }
                                    }}
                                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100'
                                        : 'bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                                    }`}
                                  >
                                    {isSelected ? 'Remove' : 'Select'}
                                  </button>
                                </div>
                              );
                            })}
                        </div>

                        {/* Selected product badges */}
                        {couponSelectedProductIds.length > 0 && (
                          <div className="pt-2 border-t border-gray-200/60 text-left">
                            <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1.5">Selected Products ({couponSelectedProductIds.length}):</span>
                            <div className="flex flex-wrap gap-1.5">
                              {couponSelectedProductIds.map(id => {
                                const matched = products.find(p => p.id === id);
                                return (
                                  <span key={id} className="inline-flex items-center gap-1 bg-[#1e152a] text-[#f1ebd9] px-2 py-0.5 rounded text-[10px] uppercase font-medium">
                                    <span className="truncate max-w-[150px]">{matched ? matched.name : id}</span>
                                    <button
                                      type="button"
                                      onClick={() => setCouponSelectedProductIds(couponSelectedProductIds.filter(x => x !== id))}
                                      className="text-red-300 hover:text-red-500 font-extrabold focus:outline-none ml-1 cursor-pointer"
                                    >
                                      ×
                                    </button>
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Submit trigger button */}
                  <div className="pt-4 border-t border-gray-150 flex items-center justify-between gap-4 font-sans text-left">
                    <span className="text-[10px] text-gray-400 select-none">
                      Dynamic coupons are parsed safely across checkout modules.
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!couponCode.trim()) {
                          alert('Please enter a unique alphanumeric coupon code.');
                          return;
                        }
                        if (couponDiscountValue <= 0) {
                          alert('Please enter a valid discount value greater than zero.');
                          return;
                        }
                        if (couponApplyTo === 'specific' && couponSelectedProductIds.length === 0) {
                          alert('Please select at least one applicable product for the specific coupon constraint.');
                          return;
                        }

                        const couponObj: Coupon = {
                          id: couponCode.trim().toUpperCase(),
                          discountType: couponDiscountType,
                          discountValue: couponDiscountValue,
                          applyTo: couponApplyTo,
                          productIds: couponApplyTo === 'all' ? [] : couponSelectedProductIds,
                          active: couponActivateNow ? true : couponActive,
                          createdAt: new Date().toISOString(),
                          activationDate: couponActivationDate || undefined,
                          expiryDate: couponExpiryDate || undefined
                        };

                        if (onAddCoupon) {
                          onAddCoupon(couponObj);
                        }

                        // Reset states
                        setShowCouponForm(false);
                      }}
                      className="px-5 py-2.5 bg-[#1e152a] text-[#f1ebd9] hover:bg-[#c5a880] hover:text-black font-extrabold uppercase text-[10px] tracking-widest rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                    >
                      <Check size={12} className="stroke-[3]" />
                      Publish Promo Code
                    </button>
                  </div>
                </div>
              )}

              {/* Coupons List View */}
              <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-xs whitespace-normal text-left">
                <span className="font-bold text-[#1e152a] text-sm block border-b pb-3.5 mb-4">Active & Saved Promos</span>

                {coupons.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 space-y-1.5">
                    <Tag size={28} className="mx-auto text-gray-300 stroke-[1.5]" />
                    <p className="font-serif font-bold text-[#1e152a]">No Promotions Created Yet</p>
                    <p className="text-[10.5px] max-w-xs mx-auto text-gray-500 font-sans">
                      Generate clean promotional campaign codes to provide discounts on Pakistan dispatch orders.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {coupons.map((coupon) => (
                      <div key={coupon.id} className="border border-gray-200 rounded-xl p-4 space-y-3 shadow-3xs relative overflow-hidden bg-stone-50/50">
                        {/* Status absolute badge */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full ${coupon.active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                          <span className={`text-[9px] font-extrabold uppercase tracking-widest ${coupon.active ? 'text-emerald-700' : 'text-gray-400'}`}>
                            {coupon.active ? 'Active' : 'Disabled'}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-sans">Campaign Code</span>
                          <strong className="text-sm font-mono tracking-wider font-extrabold text-[#1e152a] select-all bg-white border px-2.5 py-1 rounded inline-block shadow-3xs uppercase">
                            {coupon.id}
                          </strong>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                          <div>
                            <span className="text-gray-400 block font-light">Offset:</span>
                            <strong className="text-gray-950">
                              {coupon.discountType === 'flat' ? `${formatPKR(coupon.discountValue)} Off` : `${coupon.discountValue}% Off`}
                            </strong>
                          </div>
                          <div>
                            <span className="text-gray-400 block font-light">Constraint:</span>
                            <strong className="text-gray-950 uppercase text-[10px]">
                              {coupon.applyTo === 'all' ? 'Store-wide' : `${coupon.productIds?.length || 0} Products`}
                            </strong>
                          </div>
                        </div>

                        {coupon.applyTo === 'specific' && coupon.productIds && coupon.productIds.length > 0 && (
                          <div className="pt-2 border-t border-gray-200/50">
                            <span className="text-[9.5px] text-gray-400 block mb-1">Applicable models:</span>
                            <div className="flex flex-wrap gap-1 max-h-[50px] overflow-y-auto no-scrollbar">
                              {coupon.productIds.map(pid => {
                                const matched = products.find(p => p.id === pid);
                                return (
                                  <span key={pid} className="bg-white border text-gray-600 text-[9px] px-1.5 py-0.2 rounded font-sans leading-none">
                                    {matched ? matched.name : pid}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {(coupon.activationDate || coupon.expiryDate) && (
                          <div className="pt-2 border-t border-gray-150/60 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[9.5px] text-gray-600 font-sans">
                            {coupon.activationDate && (
                              <div>
                                <span className="text-gray-400 font-light block">Activates:</span>
                                <span className="font-semibold text-gray-700 font-mono text-[9px]">{new Date(coupon.activationDate).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}</span>
                              </div>
                            )}
                            {coupon.expiryDate && (
                              <div>
                                <span className="text-gray-400 font-light block">Expires:</span>
                                <span className="font-semibold text-rose-600 font-mono text-[9px]">{new Date(coupon.expiryDate).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="pt-2.5 border-t border-gray-200/50 flex items-center justify-between">
                          <span className="text-[9px] text-gray-400 font-mono">Created: {new Date(coupon.createdAt).toLocaleDateString()}</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (onDeleteCoupon) {
                                onDeleteCoupon(coupon.id);
                              }
                            }}
                            className="text-red-500 hover:text-white p-1 hover:bg-rose-500 rounded-md transition-all font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-rose-500"
                          >
                            <Trash2 size={13} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Zoomed-in receipt screenshot modal */}
      {selectedReceiptUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in" onClick={() => setSelectedReceiptUrl(null)}>
          <div className="relative max-w-2xl bg-white rounded-xl overflow-hidden shadow-2xl p-2 cursor-default animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-2 border-b border-gray-150 px-2 mt-1">
              <span className="text-[11px] font-bold text-[#1e152a] uppercase font-sans tracking-wide">
                📸 Full Transfer Receipt Screenshot
              </span>
              <button
                onClick={() => setSelectedReceiptUrl(null)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors font-bold text-gray-500 hover:text-red-500 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-1 max-h-[75vh] overflow-auto">
              <img src={selectedReceiptUrl} alt="Screenshot receipt full view" className="max-w-full max-h-[70vh] object-contain mx-auto" />
            </div>
            <div className="bg-stone-50 p-3 text-center text-[10px] text-gray-500 font-sans border-t flex justify-center gap-1">
              <span>Secure receipt review modal — Click anywhere outside or the "X" button to dismiss.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
