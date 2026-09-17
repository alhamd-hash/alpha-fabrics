import { Collection, Product, Review, Category } from './types';

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'new-arrivals',
    name: 'New Arrivals',
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&q=80&w=300&h=300',
    banner: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&q=80&w=1500&h=500',
    description: 'Our freshest unstitched Lawn and designer cotton arrivals straight from Lahore.',
    isGents: false,
    showInNavbar: true,
    showProductsOnHomepage: false
  },
  {
    id: 'hot-selling',
    name: 'Hot Selling',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=300&h=300',
    banner: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1500&h=500',
    description: 'Our most popular and highly demanded premium suites.',
    isGents: false,
    showInNavbar: true,
    showProductsOnHomepage: false
  },
  // Gents Collections (Upper line)
  {
    id: 'gents-summer-suits',
    name: 'Gents Summer Suits',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300&h=300',
    banner: 'https://images.unsplash.com/photo-1492552181161-62217fc3076d?auto=format&fit=crop&q=80&w=1500&h=500',
    description: 'Ultra-breathable premium summer fabrics carefully selected for ultimate comfort.',
    isGents: true
  },
  {
    id: 'gents-cotton-sk',
    name: 'Cotton Shalwar Kameez',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=300&h=300',
    banner: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1500&h=500',
    description: '100% pure premium long-staple cotton suits with rich texture for a classic, traditional look.',
    isGents: true
  },
  {
    id: 'gents-wash-wear',
    name: 'Wash & Wear Collection',
    image: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=300&h=300',
    banner: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=1500&h=500',
    description: 'Crease-resistant, easy-to-iron premium soft fabric tailored to handle daily active wear.',
    isGents: true
  },
  {
    id: 'gents-casual-wear',
    name: 'Casual Summer Wear',
    image: 'https://images.unsplash.com/photo-1505022610485-0249ba5b3675?auto=format&fit=crop&q=80&w=300&h=300',
    banner: 'https://images.unsplash.com/photo-1505022610485-0249ba5b3675?auto=format&fit=crop&q=80&w=1500&h=500',
    description: 'Lightweight and dynamic comfort suits designed with breezy soft finish structures.',
    isGents: true
  },
  {
    id: 'gents-premium-collection',
    name: 'Premium Gents Collection',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=300&h=300',
    banner: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=1500&h=500',
    description: 'Elite unstitched fabric, featuring dense luxury thread bindings for formal wear.',
    isGents: true
  },

  // Ladies Collections (Lower line)
  {
    id: 'ladies-summer-lawn',
    name: 'Ladies Summer Lawn',
    image: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=300&h=300',
    banner: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=1500&h=500',
    description: 'Premium light-weight beautifully designed printed lawn collections.',
    isGents: false
  },
  {
    id: 'ladies-2-piece-summer',
    name: '2 Piece Summer Collection',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=300&h=300',
    banner: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1500&h=500',
    description: 'Chic printed 2-piece suits featuring a shirt and dupatta set or shirt and trousers.',
    isGents: false
  },
  {
    id: 'ladies-3-piece-embroidered',
    name: '3 Piece Embroidered',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=300&h=300',
    banner: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1500&h=500',
    description: 'Exquisite patterns, intricate necklines, and fully hand-crafted embroidery details.',
    isGents: false
  },
  {
    id: 'ladies-casual-pret',
    name: 'Casual Pret Wear',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=300&h=300',
    banner: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=1500&h=500',
    description: 'Ready-to-wear everyday style with highly breathable cuts and neat styling touches.',
    isGents: false
  },
  {
    id: 'ladies-summer-festive',
    name: 'Summer Festive Collection',
    image: 'https://images.unsplash.com/photo-1590156546746-c58d04737aa1?auto=format&fit=crop&q=80&w=300&h=300',
    banner: 'https://images.unsplash.com/photo-1590156546746-c58d04737aa1?auto=format&fit=crop&q=80&w=1500&h=500',
    description: 'Luxurious designer-grade selections with tila lace highlights for family gatherings and Eid.',
    isGents: false
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // LADIES CATEGORIES PRODUCTS
  {
    id: 'prod-ladies-1',
    name: 'Premium Mughal Lawn (3-Piece)',
    shortDetails: '3 Piece Unstitched Suit with Printed Silk Dupatta',
    description: 'Experience pure indulgence with our signature Al-Hamd Mughal digital printed lawn. Spanned carefully with deep magenta hues and traditional subcontinental motifs. Extremely smooth and feather-weight.',
    price: 2850,
    images: [
      'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=600&h=800',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=600&h=800'
    ],
    category: 'Lawn Collection',
    collectionId: 'ladies-summer-lawn',
    specifications: {
      'Fabric': 'Premium Cotton Lawn',
      'Dupatta': 'Digital Printed Silk (2.5m)',
      'Shirt': 'Premium Printed Shirt (3m)',
      'Trouser': 'Cambric Dyed Trouser (2.5m)'
    },
    isLadiesSuit: true,
    ladiesSuitInfo: {
      shirt: 'Fine Digital Printed Lawn - 3.0m',
      dupatta: 'Premium Printed Medium Silk - 2.5m',
      trouser: 'Dyed Soft Cotton Trouser - 2.5m',
      fabricType: 'Lawn & Silk',
      embroideryDetails: 'No embroidery. High-definition botanical prints with deep reaction styling dyes.'
    },
    isNewArrival: true,
    isHotSelling: true,
    rating: 4.8
  },
  {
    id: 'prod-ladies-2',
    name: 'Pastel Aqua Block-Print 2pc',
    shortDetails: '2 Piece Unstitched Printed Suit (Shirt + Dupatta)',
    description: 'Minimalist daytime summer option. Styled with classic geometric block-patterns in cooling pastel colors. Hand-wash safe colors that do not fade.',
    price: 1950,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600&h=800',
      'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=600&h=800'
    ],
    category: '2 Piece',
    collectionId: 'ladies-2-piece-summer',
    specifications: {
      'Fabric': 'Egyptian Cotton Lawn',
      'Dupatta': 'Voile Lawn Dupatta (2.5m)',
      'Shirt': 'Digital Printed Shirt (3m)'
    },
    isLadiesSuit: true,
    ladiesSuitInfo: {
      shirt: 'Printed Lightweight Lawn - 3.0m',
      dupatta: 'Voile Summer Lawn Dupatta - 2.5m',
      trouser: 'None (2 Piece Set)',
      fabricType: 'Pure Cotton Voile',
      embroideryDetails: 'Rich geometric block border digital designs without hard embroidery.'
    },
    isNewArrival: true,
    isHotSelling: false,
    rating: 4.6
  },
  {
    id: 'prod-ladies-3',
    name: 'Teal Peacock Majesty (3pc)',
    shortDetails: '3 Piece Embroidered Luxury Lawn Suit with Chiffon Dupatta',
    description: 'Stand out in a premium teal shade. Heavy floral sequence resham thread-work down the neckline, paired with a gorgeous scalloped soft crinkle chiffon dupatta.',
    price: 3650,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600&h=800',
      'https://images.unsplash.com/photo-1590156546746-c58d04737aa1?auto=format&fit=crop&q=80&w=600&h=800'
    ],
    category: '3 Piece',
    collectionId: 'ladies-3-piece-embroidered',
    specifications: {
      'Fabric': 'Premium Swiss Voile',
      'Dupatta': 'Scalloped Embroidered Chiffon (2.5m)',
      'Shirt': 'Neckline Embroidered Swiss Voile (3.0m)',
      'Trouser': 'Dyed Cambric Cotton with organza patch'
    },
    isLadiesSuit: true,
    ladiesSuitInfo: {
      shirt: 'Neckline Thread Embroidered Swiss Voile - 3.0m',
      dupatta: 'Chiffon Dupatta with dense borders - 2.5m',
      trouser: 'Dyed Cambric cotton - 2.5m',
      fabricType: 'Swiss Voile & Crinkle Chiffon',
      embroideryDetails: 'Multicolor floral kashmiri threadwork with glistening golden micro tila borders.'
    },
    isNewArrival: true,
    isHotSelling: true,
    rating: 4.9
  },
  {
    id: 'prod-ladies-4',
    name: 'Summer Breeze Linen Pret',
    shortDetails: 'Ready-to-Wear Straight Designer Kurti',
    description: 'Pret-assembled single-piece straight kurti structured out of lightweight high-stretch linen. Elegant button details and scalloped sleeve slits.',
    price: 2450,
    images: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=600&h=800',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600&h=800'
    ],
    category: 'Pret Wear',
    collectionId: 'ladies-casual-pret',
    specifications: {
      'Fabric': 'Breezy Linen Cotton',
      'Stitching Mode': 'Stitched Ready-to-wear',
      'Sleeve Type': 'Quarter Scalloped Slit',
      'Style': 'Straight fit Kurti'
    },
    isLadiesSuit: true,
    ladiesSuitInfo: {
      shirt: 'Stitched kurti ready-to-wear',
      dupatta: 'None',
      trouser: 'None',
      fabricType: 'Linen Cotton Blend',
      embroideryDetails: 'Minimal neck piping with elegant wood buttons.'
    },
    isNewArrival: false,
    isHotSelling: true,
    rating: 4.7
  },
  {
    id: 'prod-ladies-5',
    name: 'Emerald Royal Festive (3pc)',
    shortDetails: '3 Piece Luxury Silk Embroidered Gala Masterpiece',
    description: 'Designed exclusively for festive occasions and Eid gatherings. Crafted in premium organza-trimmed lawn, accented with highly dense hand-finished metallic tila embroideries.',
    price: 4950,
    images: [
      'https://images.unsplash.com/photo-1590156546746-c58d04737aa1?auto=format&fit=crop&q=80&w=600&h=800',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600&h=800'
    ],
    category: 'Embroidered',
    collectionId: 'ladies-summer-festive',
    specifications: {
      'Fabric': 'Premium Egyptian Lawn',
      'Dupatta': 'Silk-trimmed luxury net dupatta',
      'Shirt': 'Lawn front + tila borders',
      'Trouser': 'Premium Raw Silk Trouser'
    },
    isLadiesSuit: true,
    ladiesSuitInfo: {
      shirt: 'Heavy tila embroidered lawn front - 3m',
      dupatta: 'Organza borders on block printed net dupatta - 2.5m',
      trouser: 'Raw Silk pants fabric - 2.5m',
      fabricType: 'Luxury Lawn & Organza',
      embroideryDetails: 'Elegant floral motifs with intricate gold zari work and laser cut hem finishes.'
    },
    isNewArrival: false,
    isHotSelling: true,
    rating: 5.0
  },

  // GENTS CATEGORIES PRODUCTS
  {
    id: 'prod-gents-1',
    name: 'Premium Classic White Cotton Shalwar Kameez',
    shortDetails: 'Unstitched Pure Cotton Suit for Gents in Elegant White shade',
    description: 'Tailor the timeless elegance. Al-Hamd pure combed cotton long-staple yarn provides outstanding stiffness and fall. Excellent for official and festive occasions.',
    price: 3200,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600&h=800',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600&h=800'
    ],
    category: 'Shalwar Kameez',
    collectionId: 'gents-cotton-sk',
    specifications: {
      'Fabric': '100% Cotton Combed',
      'Suit Length': '4.5 Meters (Full width)',
      'Style': 'Unstitched Gents traditional suit',
      'Finish': 'Crisp Latha Finish',
      'Width': '54 Inches'
    },
    isLadiesSuit: false,
    isNewArrival: true,
    isHotSelling: true,
    rating: 4.9
  },
  {
    id: 'prod-gents-2',
    name: 'Soft Wash & Wear (Slate Gray)',
    shortDetails: 'Unstitched Crease-Resistant Soft Wash & Wear Suit',
    description: 'Perfect for busy routines. Highly durable, easy-iron synthetic blended fabric that resists wrinkling and maintains color through countless laundry cycles.',
    price: 2500,
    images: [
      'https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=600&h=800',
      'https://images.unsplash.com/photo-1505022610485-0249ba5b3675?auto=format&fit=crop&q=80&w=600&h=800'
    ],
    category: 'Wash & Wear',
    collectionId: 'gents-wash-wear',
    specifications: {
      'Fabric': 'Polyester Viscose Blend',
      'Suit Length': '4.0 Meters (Double width)',
      'Ironing Need': 'Extremely Low',
      'Feel': 'Silky, soft, fall-friendly'
    },
    isLadiesSuit: false,
    isNewArrival: true,
    isHotSelling: true,
    rating: 4.8
  },
  {
    id: 'prod-gents-3',
    name: 'Gents Camel-Brown Summer Khaddar',
    shortDetails: 'Premium Summer Cotton Suit with Breathable weave',
    description: 'Designed natively to endure hot climates. Soft-treated summer cotton fibers woven down in a breathable, airy canvas representing timeless camel tone.',
    price: 2950,
    images: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600&h=800',
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=600&h=800'
    ],
    category: 'Cotton Suits',
    collectionId: 'gents-summer-suits',
    specifications: {
      'Fabric': 'Lawn Cotton blend',
      'Suit Length': '4.25 Meters',
      'Color Dyeing': 'Organic non-irritant vat dyes'
    },
    isLadiesSuit: false,
    isNewArrival: false,
    isHotSelling: true,
    rating: 4.7
  },
  {
    id: 'prod-gents-4',
    name: 'Navy Summer Breezer Suit',
    shortDetails: 'Casual Unstitched Air-breezing cotton blend',
    description: 'A superb casual fabric featuring premium cross-weave lines that facilitate high ventilation. Perfect for dry, hot summer afternoons.',
    price: 2300,
    images: [
      'https://images.unsplash.com/photo-1505022610485-0249ba5b3675?auto=format&fit=crop&q=80&w=600&h=800',
      'https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=600&h=800'
    ],
    category: 'Casual Wear',
    collectionId: 'gents-casual-wear',
    specifications: {
      'Fabric': 'Poly-Lawn Cotton',
      'Suit Length': '4.0 Meters',
      'Fit Mode': 'Unstitched'
    },
    isLadiesSuit: false,
    isNewArrival: false,
    isHotSelling: false,
    rating: 4.5
  },
  {
    id: 'prod-gents-5',
    name: 'Royal Charcoal Latha Suit (Elite Grade)',
    shortDetails: 'Egyptian Cotton Premium Unstitched Gents Suit',
    description: 'The Absolute Pinnacle of our men’s catalog. Made utilizing 100% fine Egyptian thread cotton with liquid mercerization, completing a rich textured luster surface that falls beautifully.',
    price: 4500,
    images: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=600&h=800',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600&h=800'
    ],
    category: 'Premium Suits',
    collectionId: 'gents-premium-collection',
    specifications: {
      'Fabric': '100% Long Staple Egyptian Giza Cotton',
      'Suit Length': '4.5 Meters (Broad width)',
      'Texture': 'Exquisite soft sheen finish'
    },
    isLadiesSuit: false,
    isNewArrival: true,
    isHotSelling: true,
    rating: 5.0
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-ladies-1',
    productName: 'Premium Mughal Lawn (3-Piece)',
    customerName: 'Ayesha Khan',
    rating: 5,
    comment: 'Alhamdulillah! The fabric quality is exceptional. Soft touch and the colors are exactly as shown in the picture. Will definitely buy more!',
    approved: true,
    createdAt: '2026-05-20T12:30:00Z'
  },
  {
    id: 'rev-2',
    productId: 'prod-ladies-3',
    productName: 'Teal Peacock Majesty (3pc)',
    customerName: 'Sana Malik',
    rating: 5,
    comment: 'Beautiful embroidery! The chiffon dupatta has a great fall. Free delivery over 6000 was a great plus!',
    approved: true,
    createdAt: '2026-05-23T09:15:00Z'
  },
  {
    id: 'rev-3',
    productId: 'prod-gents-1',
    productName: 'Premium Classic White Cotton Shalwar Kameez',
    customerName: 'Zubair Iqbal',
    rating: 5,
    comment: 'Kamal ki quality hai! The Giza cotton feels rich and very breathable in this scorching heat.',
    approved: true,
    createdAt: '2026-05-24T18:45:00Z'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-2pc', name: '2 Piece', description: 'Chic printed 2-piece summer outfits for women.', isGents: false },
  { id: 'cat-3pc', name: '3 Piece', description: 'Graceful embroidered 3-piece complete sets for women.', isGents: false },
  { id: 'cat-lawn', name: 'Lawn Collection', description: 'Soft airy premium printed garden lawns for women.', isGents: false },
  { id: 'cat-pret', name: 'Pret Wear', description: 'Pret-to-go designer printed styles for women.', isGents: false },
  { id: 'cat-ladies-embroidered', name: 'Embroidered', description: 'Intricate premium embroidered garments for women.', isGents: false },
  { id: 'cat-gents-sk', name: 'Shalwar Kameez', description: 'Classic gents shalwar kameez traditional wear.', isGents: true },
  { id: 'cat-gents-ww', name: 'Wash & Wear', description: 'Soft wrinkle-free premium daily wear for men.', isGents: true },
  { id: 'cat-gents-cotton', name: 'Cotton Suits', description: '100% pure premium high-texture cottons for men.', isGents: true },
  { id: 'cat-gents-casual', name: 'Casual Wear', description: 'Easy breezy casual unstitched clothing for men.', isGents: true },
  { id: 'cat-gents-premium', name: 'Premium Suits', description: 'Lustrous high-thread luxurious gents selections.', isGents: true }
];

