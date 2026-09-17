import { Product } from './types';

// Declare gtag and dataLayer on the global window context
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const MEASUREMENT_ID = 'G-DR9FPR4Q12';
let isGaInitialized = false;

/**
 * Dynamically injects the Google Analytics 4 script and configures G-DR9FPR4Q12
 */
export function initGA() {
  if (typeof window === 'undefined') return;
  if (isGaInitialized) return;

  console.log(`[GA4] Dynamic bootstrap initiated for Measurement ID: ${MEASUREMENT_ID}`);

  // 1. Ingest Google Tag script asynchronously
  const scriptId = 'google-analytics-gtag-js';
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  // 2. Define global dataLayer and gtag if non-existent
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function (...args: any[]) {
      window.dataLayer.push(arguments);
    };
  }

  // 3. Initialize current date registry and tracking ID configuration
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false, // Disabling automatic full-page tracker to avoid duplicates in React SPA
    cookie_flags: 'SameSite=None;Secure'
  });

  isGaInitialized = true;

  // 4. Register automatic visibility and page-leave unload interceptors
  setupPageLeaveListeners();

  // 5. Register automatic button click observer
  setupButtonClickObserver();
}

/**
 * Global button listener that automatically detects and tracks any button elements clicked
 */
function setupButtonClickObserver() {
  if (typeof window === 'undefined') return;

  document.addEventListener('click', (event) => {
    try {
      const target = event.target as HTMLElement;
      const button = target.closest('button');
      if (button) {
        // Extract distinct information (text inside, id, or accessibility label)
        const text = button.innerText || button.getAttribute('aria-label') || button.id || button.name || 'Button';
        const cleanText = text.trim().substring(0, 50);
        trackGAButtonClick(cleanText, {
          element_id: button.id || undefined,
          element_class: button.className || undefined
        });
      }
    } catch (e) {
      console.error('[GA4] Click observer exception:', e);
    }
  }, { passive: true });
}

/**
 * Tracks custom SPA relative paths and screen name navigation
 */
export function trackGAPageView(viewName: string, customTitle?: string) {
  if (typeof window === 'undefined') return;
  if (!isGaInitialized || !window.gtag) {
    initGA();
  }

  const title = customTitle || `Al-Hamd Fabrics | ${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`;
  const path = `/${viewName}`;

  if (window.gtag) {
    window.gtag('config', MEASUREMENT_ID, {
      page_title: title,
      page_path: path,
      page_location: window.location.href
    });

    // Also dispatch explicit custom virtual page_view event
    window.gtag('event', 'page_view', {
      page_title: title,
      page_path: path,
      page_location: window.location.href
    });
    
    console.log(`[GA4] Visual Navigation Registered: ${path} (${title})`);
  }
}

/**
 * Tracks high-priority interactive button interactions
 */
export function trackGAButtonClick(buttonLabel: string, extraContext?: Record<string, any>) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'button_click', {
    button_label: buttonLabel,
    page_location: window.location.href,
    ...extraContext
  });
  console.log(`[GA4] User Button Interaction Recorded: "${buttonLabel}"`, extraContext);
}

/**
 * E-commerce standard: view_item (when clicking to see details)
 */
export function trackGAViewContent(product: Product) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'view_item', {
    currency: 'PKR',
    value: product.price,
    items: [{
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      quantity: 1
    }]
  });
  console.log(`[GA4] Content Detailed View tracked for product: ${product.name}`);
}

/**
 * E-commerce standard: add_to_cart
 */
export function trackGAAddToCart(product: Product, quantity: number = 1) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'add_to_cart', {
    currency: 'PKR',
    value: product.price * quantity,
    items: [{
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      quantity: quantity
    }]
  });
  console.log(`[GA4] Add to cart tracked: ${product.name} × ${quantity}`);
}

/**
 * E-commerce standard: begin_checkout
 */
export function trackGABeginCheckout(items: { product: Product; quantity: number }[], total: number) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'begin_checkout', {
    currency: 'PKR',
    value: total,
    items: items.map(item => ({
      item_id: item.product.id,
      item_name: item.product.name,
      item_category: item.product.category,
      price: item.product.price,
      quantity: item.quantity
    }))
  });
  console.log(`[GA4] Begin Checkout transition tracked for ${items.length} items. Total value: PKR ${total}`);
}

/**
 * E-commerce standard: purchase completion
 */
export function trackGAPurchase(orderId: string, items: { product: Product; quantity: number }[], total: number) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'purchase', {
    transaction_id: orderId,
    value: total,
    currency: 'PKR',
    items: items.map(item => ({
      item_id: item.product.id,
      item_name: item.product.name,
      item_category: item.product.category,
      price: item.product.price,
      quantity: item.quantity
    }))
  });
  console.log(`[GA4] Purchase successfully tracked: Transaction ID ${orderId}, Total: PKR ${total}`);
}

/**
 * Active Page Leave and Window Hidden listeners to detect bounce rate / page exit
 */
function setupPageLeaveListeners() {
  if (typeof window === 'undefined') return;

  // Track when a user minimizes the browser or navigates to a different browser tab
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && window.gtag) {
      window.gtag('event', 'page_leave', {
        page_path: window.location.pathname,
        page_location: window.location.href,
        exit_cause: 'tab_minimized',
        transport_type: 'beacon'
      });
      console.log('[GA4] Tab minimized/hidden. Sent page_leave beacon.');
    }
  });

  // Track when the user unloads the website (closing tab, typing new URL)
  window.addEventListener('beforeunload', () => {
    if (window.gtag) {
      window.gtag('event', 'page_leave', {
        page_path: window.location.pathname,
        page_location: window.location.href,
        exit_cause: 'window_unload',
        transport_type: 'beacon'
      });
      console.log('[GA4] Window or tab uninstalled. Dispatched page_leave beacon.');
    }
  });
}
