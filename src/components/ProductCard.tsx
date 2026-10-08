import React, { useState } from 'react';
import { Product } from '../types';
import { useShop, formatPKR } from '../context/ShopContext';
import { Heart, Eye, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, isInWishlist, toggleWishlist, openQuickView, addToCart } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const primaryImg = product.images[0] || '/src/assets/images/zarmeen_hero_1791436571248.jpg';
  const secondaryImg = product.images[1] || primaryImg;

  const currentPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'Unstitched';
    const defaultColor = product.colors[0]?.name || 'Standard';
    const success = addToCart(product, defaultSize, defaultColor, 1);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    }
  };

  return (
    <div
      className="group relative flex flex-col cursor-pointer transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigateTo('product-detail', { productId: product.id })}
    >
      {/* Visual Image Container with 3:4 Aspect Ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F0EDE6] border border-stone-200/60">
        {/* Primary Image */}
        <img
          src={primaryImg}
          alt={product.name}
          className={`h-full w-full object-cover object-top transition-opacity duration-700 ease-in-out ${
            isHovered && secondaryImg !== primaryImg ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
          loading="lazy"
        />

        {/* Secondary Hover Image */}
        {secondaryImg && secondaryImg !== primaryImg && (
          <img
            src={secondaryImg}
            alt={`${product.name} lookbook`}
            className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 ease-in-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            loading="lazy"
          />
        )}

        {/* Badges Stack */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isSale && hasDiscount && (
            <span className="bg-[#8A1C24] text-white text-[10px] tracking-widest uppercase font-semibold px-2 py-0.5 shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#1C1A1A] text-white text-[10px] tracking-widest uppercase font-semibold px-2 py-0.5 shadow-xs">
              NEW
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-[#A3824E] text-white text-[10px] tracking-widest uppercase font-semibold px-2 py-0.5 shadow-xs">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer ${
            isFavorited
              ? 'bg-[#8A1C24] text-white'
              : 'bg-white/90 text-stone-700 hover:text-[#8A1C24] hover:bg-white'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart size={15} className={isFavorited ? 'fill-white' : ''} />
        </button>

        {/* Quick View Button (Desktop Hover) */}
        <div
          className={`absolute inset-x-2.5 bottom-2.5 z-10 flex gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="flex-1 bg-white/95 hover:bg-white text-stone-900 text-[11px] tracking-wider uppercase font-medium py-2.5 px-2 flex items-center justify-center gap-1.5 shadow-md border border-stone-200 transition-colors"
          >
            <Eye size={13} />
            Quick View
          </button>

          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className={`px-3 py-2.5 text-[11px] uppercase tracking-wider font-medium flex items-center justify-center shadow-md transition-colors ${
              product.stock <= 0
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-[#8A1C24] hover:bg-[#A3232D] text-white'
            }`}
            title="Quick Add to Bag"
          >
            {justAdded ? <Check size={14} /> : <ShoppingBag size={14} />}
          </button>
        </div>

        {/* Low Stock Warning Overlay */}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute bottom-0 inset-x-0 bg-amber-950/80 text-amber-100 text-[10px] text-center py-1 tracking-wider uppercase font-medium backdrop-blur-xs">
            Only {product.stock} pieces left in stock
          </div>
        )}

        {/* Out of stock tag */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center backdrop-blur-xs">
            <span className="bg-white text-stone-900 px-3 py-1 text-xs uppercase tracking-widest font-semibold">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="pt-3 pb-1 flex flex-col flex-1">
        {/* Subtle Category & Fabric Tag */}
        <div className="text-[11px] tracking-wider text-[#8A1C24] font-medium uppercase mb-1">
          {product.fabric} · {product.pieces}
        </div>

        {/* Title */}
        <h3 className="font-heading text-sm text-[#1C1A1A] group-hover:text-[#8A1C24] transition-colors line-clamp-1 font-normal">
          {product.name}
        </h3>

        {/* Available Color Swatches Indicator */}
        <div className="flex items-center gap-1.5 my-1.5">
          {product.colors.map((c, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full border border-stone-300/80 inline-block shadow-2xs"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
          {product.colors.length > 3 && (
            <span className="text-[10px] text-stone-400">+{product.colors.length - 3}</span>
          )}
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mt-auto pt-1 font-medium">
          <span className="text-sm font-semibold text-[#1C1A1A]">
            {formatPKR(currentPrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-stone-400 line-through">
              {formatPKR(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
