import React from 'react';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { Product } from '../types';
import { formatPKR } from '../utils';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  layout: 'large-horizontal' | 'compact-grid';
  onViewDetails: (productId: string) => void;
  onAddToCart: (product: Product, quantity: number, selectedImage: string) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export default function ProductCard({
  product,
  layout,
  onViewDetails,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist
}: ProductCardProps) {
  const currentImage = product.images[0] || 'https://picsum.photos/seed/fabric/300/400';
  const isOutOfStock = product.inventory !== undefined && product.inventory <= 0;

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onAddToCart(product, 1, currentImage);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
    }
  };

  if (layout === 'large-horizontal') {
    return (
      <div 
        onClick={() => onViewDetails(product.id)}
        className="flex-none w-[280px] sm:w-[320px] bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col justify-between"
        id={`new-arrival-card-${product.id}`}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
          <img
            src={currentImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Tag Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {isOutOfStock && (
              <span className="bg-red-700 text-white text-[9px] font-extrabold px-2 py-0.5 uppercase tracking-wider rounded-xs rounded-br-md shadow-xs animate-pulse">
                OUT OF STOCK
              </span>
            )}
            {product.isOnSale && !isOutOfStock && (
              <span className="bg-red-600 text-white text-[9px] font-extrabold px-2 py-0.5 uppercase tracking-wider rounded-xs rounded-br-md shadow-xs animate-pulse">
                SALE
              </span>
            )}
            {product.promoTag && !isOutOfStock && (
              <span className="bg-[#1e152a] text-[#c5a880] text-[9px] font-extrabold px-2 py-0.5 uppercase tracking-wider rounded-xs rounded-br-md shadow-xs border border-[#c5a880]/30">
                {product.promoTag}
              </span>
            )}
            {product.isNewArrival && !isOutOfStock && (
              <span className="bg-[#1e152a] text-[#f1ebd9] text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-xs rounded-br-md">
                NEW
              </span>
            )}
            {product.isHotSelling && !isOutOfStock && (
              <span className="bg-[#c5a880] text-black text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-xs rounded-br-md">
                HOT
              </span>
            )}
          </div>

          <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-gray-700 hover:text-red-500 rounded-full transition-colors z-10 shadow-xs cursor-pointer"
            aria-label="Add to wishlist"
          >
            <Heart size={16} fill={isWishlisted ? 'red' : 'none'} className={isWishlisted ? 'text-red-500' : ''} />
          </button>

          {/* Hover Show Quick View Button Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product.id);
              }}
              className="p-3 bg-white text-[#100c18] rounded-full shadow-lg hover:bg-[#c5a880] hover:text-white transition-all transform hover:scale-105 cursor-pointer"
              title="Quick View"
            >
              <Eye size={18} />
            </button>
            {!isOutOfStock ? (
              <button
                onClick={handleAddToCartClick}
                className="p-3 bg-white text-[#100c18] rounded-full shadow-lg hover:bg-[#1e152a] hover:text-white transition-all transform hover:scale-105 cursor-pointer"
                title="Add To Cart"
              >
                <ShoppingCart size={18} />
              </button>
            ) : (
              <span className="px-3 py-2 bg-red-600 text-white font-bold text-[10px] rounded-full shadow-md select-none tracking-widest uppercase">
                Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#c5a880] tracking-widest uppercase block mb-1">
              {product.category}
            </span>
            <h3 className="font-serif text-[#1e152a] font-bold text-base line-clamp-1 leading-snug group-hover:text-[#c5a880] transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-500 text-xs line-clamp-2 mt-1 leading-relaxed">
              {product.shortDetails}
            </p>
            <div className="flex flex-wrap gap-1 items-center mt-1.5">
              {product.isLadiesSuit && (
                <span className="inline-block text-[10px] text-gray-500 font-sans border border-gray-100 px-1 py-0.5 rounded-xs bg-[#faf9f6]">
                  Unstitched 3-Piece
                </span>
              )}
              {product.inventory !== undefined && (
                <span className="inline-block text-[10px] text-emerald-805 font-bold border border-emerald-100 px-1.5 py-0.5 rounded-xs bg-emerald-50">
                  Stock: {product.inventory} Pcs
                </span>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
            {product.isOnSale && product.originalPrice ? (
              <div className="flex flex-col items-start leading-none">
                <span className="font-sans text-red-600 font-extrabold text-base">
                  {formatPKR(product.price)}
                </span>
                <span className="font-sans text-gray-400 line-through text-xs mt-0.5">
                  {formatPKR(product.originalPrice)}
                </span>
              </div>
            ) : (
              <span className="font-sans text-[#1e152a] font-extrabold text-base">
                {formatPKR(product.price)}
              </span>
            )}
            <div className="flex items-center gap-1">
              <Star size={13} className="text-amber-500 fill-amber-500" />
              <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact Grid Layout (Max initial 10 elements on homepage, fully responsive)
  return (
    <div
      onClick={() => onViewDetails(product.id)}
      className="bg-white rounded-lg border border-gray-100/80 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col h-full justify-between"
      id={`hot-selling-card-${product.id}`}
    >
      <div className="relative aspect-[3/4] w-full bg-gray-50 overflow-hidden">
        <img
          src={currentImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top transform group-hover:scale-103 transition-transform duration-500"
        />

        {/* Tag Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {isOutOfStock && (
            <span className="bg-red-700 text-white text-[8px] font-extrabold px-1.5 py-0.5 uppercase tracking-wider rounded-xs rounded-br-md shadow-xs animate-pulse">
              OUT OF STOCK
            </span>
          )}
          {product.isOnSale && !isOutOfStock && (
            <span className="bg-red-600 text-white text-[8px] font-extrabold px-1.5 py-0.5 uppercase tracking-wider rounded-xs rounded-br-md shadow-xs animate-pulse">
              SALE
            </span>
          )}
          {product.promoTag && !isOutOfStock && (
            <span className="bg-[#1e152a] text-[#c5a880] text-[8px] font-extrabold px-1.5 py-0.5 uppercase tracking-wider rounded-xs rounded-br-md shadow-xs border border-[#c5a880]/30">
              {product.promoTag}
            </span>
          )}
          {product.isNewArrival && !isOutOfStock && (
            <span className="bg-[#1e152a] text-[#f1ebd9] text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-xs rounded-br-md">
              NEW
            </span>
          )}
          {product.isHotSelling && !isOutOfStock && (
            <span className="bg-[#c5a880] text-black text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-xs rounded-br-md">
              HOT
            </span>
          )}
        </div>

        <button
          onClick={handleWishlistClick}
          className="absolute top-2.5 right-2.5 p-1.5 bg-white/80 hover:bg-white text-gray-700 hover:text-red-500 rounded-full transition-colors z-10 shadow-xs cursor-pointer"
          aria-label="Wishlist"
        >
          <Heart size={14} fill={isWishlisted ? 'red' : 'none'} className={isWishlisted ? 'text-red-500' : ''} />
        </button>

        {/* Subtle quick button hover panel on bottom of image */}
        <div className="absolute bottom-2.5 inset-x-2.5 z-10 flex gap-1 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product.id);
            }}
            className="flex-1 py-1.5 bg-[#1e152a]/95 text-white hover:bg-[#c5a880] hover:text-black font-semibold text-[10px] uppercase tracking-wider rounded transition-colors text-center shadow-md flex items-center justify-center gap-1 cursor-pointer"
          >
            <Eye size={12} />
            Quick View
          </button>
          {!isOutOfStock ? (
            <button
              onClick={handleAddToCartClick}
              className="px-2 py-1.5 bg-white text-black hover:bg-[#1e152a] hover:text-white rounded transition-colors shadow-md flex items-center justify-center cursor-pointer"
              title="Add to Cart"
            >
              <ShoppingCart size={13} />
            </button>
          ) : (
            <span className="px-2.5 py-1.5 bg-red-600 text-white font-bold text-[8px] rounded shadow-md select-none tracking-wider uppercase text-center flex items-center justify-center">
              Sold Out
            </span>
          )}
        </div>
      </div>

      <div className="p-3 space-y-1 mt-auto">
        <span className="text-[9px] font-semibold text-gray-400 tracking-wider block">
          {product.category}
        </span>
        <h4 className="font-serif font-bold text-sm text-[#1e152a] line-clamp-1 group-hover:text-[#c5a880] transition-colors leading-tight">
          {product.name}
        </h4>
        
        <div className="flex flex-wrap gap-1 items-center mt-1">
          {product.isLadiesSuit && (
            <span className="inline-block text-[10px] text-gray-500 font-sans border border-gray-100 px-1 py-0.5 rounded-sm bg-[#faf9f6]">
              Unstitched 3-Piece
            </span>
          )}
          {product.inventory !== undefined && (
            <span className={`inline-block text-[10px] font-bold border px-1.5 py-0.5 rounded-sm ${
              isOutOfStock 
                ? 'border-red-100 bg-red-50 text-red-600' 
                : 'border-emerald-100 bg-emerald-50 text-emerald-800'
            }`}>
              {isOutOfStock ? 'Out of Stock' : `Stock: ${product.inventory} Pcs`}
            </span>
          )}
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-gray-50">
          {product.isOnSale && product.originalPrice ? (
            <div className="flex flex-col items-start leading-none">
              <span className="font-sans text-red-600 font-extrabold text-sm sm:text-base">
                {formatPKR(product.price)}
              </span>
              <span className="font-sans text-gray-400 line-through text-[11px] mt-0.5">
                {formatPKR(product.originalPrice)}
              </span>
            </div>
          ) : (
            <span className="font-sans text-[#1e152a] font-extrabold text-sm sm:text-base">
              {formatPKR(product.price)}
            </span>
          )}
          <div className="flex items-center gap-0.5">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-bold text-gray-600">{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
