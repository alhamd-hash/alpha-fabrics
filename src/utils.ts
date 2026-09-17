import { Collection, Product, Order, Review, Subscription, Category } from './types';
import { INITIAL_COLLECTIONS, INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_CATEGORIES } from './data';

// Local Storage Keys
const KEYS = {
  PRODUCTS: 'alhamd_products',
  COLLECTIONS: 'alhamd_collections',
  CATEGORIES: 'alhamd_categories',
  ORDERS: 'alhamd_orders',
  REVIEWS: 'alhamd_reviews',
  SUBSCRIPTIONS: 'alhamd_subscriptions'
};

export const getStoredProducts = (): Product[] => {
  const data = localStorage.getItem(KEYS.PRODUCTS);
  if (!data) {
    return [];
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const saveStoredProducts = (products: Product[]) => {
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
};

export const getStoredCollections = (): Collection[] => {
  const data = localStorage.getItem(KEYS.COLLECTIONS);
  if (!data) {
    return [];
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const saveStoredCollections = (collections: Collection[]) => {
  localStorage.setItem(KEYS.COLLECTIONS, JSON.stringify(collections));
};

export const getStoredCategories = (): Category[] => {
  const data = localStorage.getItem(KEYS.CATEGORIES);
  if (!data) {
    return [];
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const saveStoredCategories = (categories: Category[]) => {
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
};

export const getStoredOrders = (): Order[] => {
  const data = localStorage.getItem(KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
};

export const saveStoredOrders = (orders: Order[]) => {
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
};

export const getStoredReviews = (): Review[] => {
  const data = localStorage.getItem(KEYS.REVIEWS);
  if (!data) {
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    return INITIAL_REVIEWS;
  }
  return JSON.parse(data);
};

export const saveStoredReviews = (reviews: Review[]) => {
  localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
};

export const getStoredSubscriptions = (): Subscription[] => {
  const data = localStorage.getItem(KEYS.SUBSCRIPTIONS);
  return data ? JSON.parse(data) : [];
};

export const saveStoredSubscriptions = (subs: Subscription[]) => {
  localStorage.setItem(KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
};

export const formatPKR = (amount: number): string => {
  return `PKR ${amount.toLocaleString('en-PK')}`;
};

// Delivery charges logic
// Standard delivery: 300 PKR
// Free delivery if total exceeds 6000 PKR
export const calculateDeliveryCharges = (subtotal: number): number => {
  if (subtotal > 6000) return 0;
  return 300;
};

/**
 * Compresses an image file using HTML Canvas.
 * Automatically downscales the image to fit within maxWidth / maxHeight
 * and compresses with the given quality multiplier (0.1 to 1.0).
 * Returns the base64-encoded Data URL string.
 */
export const compressImage = (
  file: File,
  maxWidth: number = 1000,
  maxHeight: number = 1000,
  quality: number = 0.6
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export function getProductSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}


