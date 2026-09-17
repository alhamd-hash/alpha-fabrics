import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  getDocFromServer,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Order, Review, OrderStatus, HomeBanner, Product, Collection, Category, MarketingSettings, SeoSettings, Coupon } from './types';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
}, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth();

// Test connection on boot according to guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

// Define error handling types and operations
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

// Global firestore error handling wrapper conforming exactly to specifications
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper function to recursively remove all undefined properties from Firestore payload objects
export function removeUndefinedFields<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => removeUndefinedFields(item)) as any;
  }
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key of Object.keys(obj as any)) {
      const val = (obj as any)[key];
      if (val !== undefined) {
        cleaned[key] = removeUndefinedFields(val);
      }
    }
    return cleaned;
  }
  return obj;
}

// Document Operations for Orders and Reviews
const ORDERS_PATH = 'orders';
const REVIEWS_PATH = 'reviews';

// --- Orders Firestore Utilities ---
export async function addOrderToFirestore(order: Order): Promise<void> {
  const docRef = doc(db, ORDERS_PATH, order.id);
  try {
    await setDoc(docRef, removeUndefinedFields(order));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${ORDERS_PATH}/${order.id}`);
  }
}

export async function updateOrderStatusInFirestore(orderId: string, status: OrderStatus): Promise<void> {
  const docRef = doc(db, ORDERS_PATH, orderId);
  try {
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ORDERS_PATH}/${orderId}`);
  }
}

export async function updateOrderInFirestore(orderId: string, updatedOrder: Order): Promise<void> {
  const docRef = doc(db, ORDERS_PATH, orderId);
  try {
    await setDoc(docRef, removeUndefinedFields(updatedOrder));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ORDERS_PATH}/${orderId}`);
  }
}

export async function deleteOrderFromFirestore(orderId: string): Promise<void> {
  const docRef = doc(db, ORDERS_PATH, orderId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${ORDERS_PATH}/${orderId}`);
  }
}

export function listenToOrders(onUpdate: (orders: Order[]) => void, onError?: (err: Error) => void) {
  const ordersCol = collection(db, ORDERS_PATH);
  return onSnapshot(ordersCol, (snapshot) => {
    const list: Order[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as Order);
    });
    // Sort orders descending by createdAt timestamp/ISO date
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    onUpdate(list);
  }, (error) => {
    if (onError) {
      onError(error);
    } else {
      handleFirestoreError(error, OperationType.GET, ORDERS_PATH);
    }
  });
}

// --- Reviews Firestore Utilities ---
export async function addReviewToFirestore(review: Review): Promise<void> {
  const docRef = doc(db, REVIEWS_PATH, review.id);
  try {
    await setDoc(docRef, removeUndefinedFields(review));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${REVIEWS_PATH}/${review.id}`);
  }
}

export async function approveReviewInFirestore(reviewId: string): Promise<void> {
  const docRef = doc(db, REVIEWS_PATH, reviewId);
  try {
    await updateDoc(docRef, { approved: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${REVIEWS_PATH}/${reviewId}`);
  }
}

export async function deleteReviewInFirestore(reviewId: string): Promise<void> {
  const docRef = doc(db, REVIEWS_PATH, reviewId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${REVIEWS_PATH}/${reviewId}`);
  }
}

export function listenToReviews(onUpdate: (reviews: Review[]) => void, onError?: (err: Error) => void) {
  const reviewsCol = collection(db, REVIEWS_PATH);
  return onSnapshot(reviewsCol, (snapshot) => {
    const list: Review[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as Review);
    });
    // Sort reviews descending by createdAt
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    onUpdate(list);
  }, (error) => {
    if (onError) {
      onError(error);
    } else {
      handleFirestoreError(error, OperationType.GET, REVIEWS_PATH);
    }
  });
}

// --- Custom Home Banners Firestore Utilities ---
const BANNERS_PATH = 'banners';

export async function addBannerToFirestore(banner: HomeBanner): Promise<void> {
  const docRef = doc(db, BANNERS_PATH, banner.id);
  try {
    await setDoc(docRef, removeUndefinedFields(banner));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${BANNERS_PATH}/${banner.id}`);
  }
}

export async function updateBannerInFirestore(bannerId: string, banner: HomeBanner): Promise<void> {
  const docRef = doc(db, BANNERS_PATH, bannerId);
  try {
    await setDoc(docRef, removeUndefinedFields(banner));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${BANNERS_PATH}/${bannerId}`);
  }
}

export async function deleteBannerFromFirestore(bannerId: string): Promise<void> {
  const docRef = doc(db, BANNERS_PATH, bannerId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${BANNERS_PATH}/${bannerId}`);
  }
}

export function listenToBanners(onUpdate: (banners: HomeBanner[]) => void, onError?: (err: Error) => void) {
  const bannersCol = collection(db, BANNERS_PATH);
  return onSnapshot(bannersCol, (snapshot) => {
    const list: HomeBanner[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as HomeBanner);
    });
    // Sort reviews ascending by custom order property
    list.sort((a, b) => a.order - b.order);
    onUpdate(list);
  }, (error) => {
    if (onError) {
      onError(error);
    } else {
      handleFirestoreError(error, OperationType.GET, BANNERS_PATH);
    }
  });
}

// --- Dynamic Products CRUD ---
const PRODUCTS_PATH = 'products';

export async function addProductToFirestore(prod: Product): Promise<void> {
  const docRef = doc(db, PRODUCTS_PATH, prod.id);
  try {
    await setDoc(docRef, removeUndefinedFields(prod));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PRODUCTS_PATH}/${prod.id}`);
  }
}

export async function updateProductInFirestore(productId: string, prod: Product): Promise<void> {
  const docRef = doc(db, PRODUCTS_PATH, productId);
  try {
    await setDoc(docRef, removeUndefinedFields(prod));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PRODUCTS_PATH}/${productId}`);
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_PATH, productId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PRODUCTS_PATH}/${productId}`);
  }
}

export function listenToProducts(onUpdate: (products: Product[]) => void, onError?: (err: Error) => void) {
  const productsCol = collection(db, PRODUCTS_PATH);
  return onSnapshot(productsCol, (snapshot) => {
    const list: Product[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as Product);
    });
    onUpdate(list);
  }, (error) => {
    if (onError) {
      onError(error);
    } else {
      handleFirestoreError(error, OperationType.GET, PRODUCTS_PATH);
    }
  });
}

// --- Dynamic Collections CRUD ---
const COLLECTIONS_PATH = 'collections';

export async function addCollectionToFirestore(col: Collection): Promise<void> {
  const docRef = doc(db, COLLECTIONS_PATH, col.id);
  try {
    await setDoc(docRef, removeUndefinedFields(col));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS_PATH}/${col.id}`);
  }
}

export async function updateCollectionInFirestore(colId: string, col: Collection): Promise<void> {
  const docRef = doc(db, COLLECTIONS_PATH, colId);
  try {
    await setDoc(docRef, removeUndefinedFields(col));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS_PATH}/${colId}`);
  }
}

export async function deleteCollectionFromFirestore(colId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS_PATH, colId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS_PATH}/${colId}`);
  }
}

export function listenToCollections(onUpdate: (collections: Collection[]) => void, onError?: (err: Error) => void) {
  const collectionsCol = collection(db, COLLECTIONS_PATH);
  return onSnapshot(collectionsCol, (snapshot) => {
    const list: Collection[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as Collection);
    });
    onUpdate(list);
  }, (error) => {
    if (onError) {
      onError(error);
    } else {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS_PATH);
    }
  });
}

// --- Dynamic Categories CRUD ---
const CATEGORIES_PATH = 'categories';

export async function addCategoryToFirestore(cat: Category): Promise<void> {
  const docRef = doc(db, CATEGORIES_PATH, cat.id);
  try {
    await setDoc(docRef, removeUndefinedFields(cat));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${CATEGORIES_PATH}/${cat.id}`);
  }
}

export async function updateCategoryInFirestore(catId: string, cat: Category): Promise<void> {
  const docRef = doc(db, CATEGORIES_PATH, catId);
  try {
    await setDoc(docRef, removeUndefinedFields(cat));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${CATEGORIES_PATH}/${catId}`);
  }
}

export async function deleteCategoryFromFirestore(catId: string): Promise<void> {
  const docRef = doc(db, CATEGORIES_PATH, catId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${CATEGORIES_PATH}/${catId}`);
  }
}

export function listenToCategories(onUpdate: (categories: Category[]) => void, onError?: (err: Error) => void) {
  const categoriesCol = collection(db, CATEGORIES_PATH);
  return onSnapshot(categoriesCol, (snapshot) => {
    const list: Category[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as Category);
    });
    onUpdate(list);
  }, (error) => {
    if (onError) {
      onError(error);
    } else {
      handleFirestoreError(error, OperationType.GET, CATEGORIES_PATH);
    }
  });
}

// --- Marketing Settings CRUD ---
const SETTINGS_PATH = 'settings';

export async function saveMarketingSettingsToFirestore(settings: MarketingSettings): Promise<void> {
  const docRef = doc(db, SETTINGS_PATH, settings.id);
  try {
    await setDoc(docRef, removeUndefinedFields(settings));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${SETTINGS_PATH}/${settings.id}`);
  }
}

export function listenToMarketingSettings(onUpdate: (settings: MarketingSettings | null) => void, onError?: (err: Error) => void) {
  const docRef = doc(db, SETTINGS_PATH, 'marketing_pixel');
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      onUpdate(snapshot.data() as MarketingSettings);
    } else {
      onUpdate(null);
    }
  }, (error) => {
    if (onError) {
      onError(error);
    } else {
      handleFirestoreError(error, OperationType.GET, `${SETTINGS_PATH}/marketing_pixel`);
    }
  });
}

// --- SEO Settings CRUD ---
export async function saveSeoSettingsToFirestore(settings: SeoSettings): Promise<void> {
  const docRef = doc(db, SETTINGS_PATH, settings.id);
  try {
    await setDoc(docRef, removeUndefinedFields(settings));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${SETTINGS_PATH}/${settings.id}`);
  }
}

export function listenToSeoSettings(onUpdate: (settings: SeoSettings | null) => void, onError?: (err: Error) => void) {
  const docRef = doc(db, SETTINGS_PATH, 'seo_config');
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      onUpdate(snapshot.data() as SeoSettings);
    } else {
      onUpdate(null);
    }
  }, (error) => {
    if (onError) {
      onError(error);
    } else {
      handleFirestoreError(error, OperationType.GET, `${SETTINGS_PATH}/seo_config`);
    }
  });
}

// --- Dynamic Coupons CRUD ---
const COUPONS_PATH = 'coupons';

export async function addCouponToFirestore(coupon: Coupon): Promise<void> {
  const docRef = doc(db, COUPONS_PATH, coupon.id);
  try {
    const cleaned = removeUndefinedFields(coupon);
    console.log('addCouponToFirestore cleaned payload:', JSON.stringify(cleaned));
    await setDoc(docRef, cleaned);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COUPONS_PATH}/${coupon.id}`);
  }
}

export async function deleteCouponFromFirestore(couponId: string): Promise<void> {
  const docRef = doc(db, COUPONS_PATH, couponId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COUPONS_PATH}/${couponId}`);
  }
}

export function listenToCoupons(onUpdate: (coupons: Coupon[]) => void, onError?: (err: Error) => void) {
  const couponsCol = collection(db, COUPONS_PATH);
  return onSnapshot(couponsCol, (snapshot) => {
    const list: Coupon[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as Coupon);
    });
    // Sort descending by createdAt
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    onUpdate(list);
  }, (error) => {
    if (onError) {
      onError(error);
    } else {
      handleFirestoreError(error, OperationType.GET, COUPONS_PATH);
    }
  });
}


