import React, { useState, useEffect } from 'react';
import { useShop, formatPKR } from '../context/ShopContext';
import { ClothingSize } from '../types';
import { X, Check, ShoppingBag, Eye, ShieldCheck, Truck } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { isQuickViewOpen, quickViewProduct, closeQuickView, addToCart, navigateTo } = useShop();

  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ClothingSize>('S');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImgIdx(0);
      setSelectedSize(quickViewProduct.sizes[0] || 'Unstitched');
      setSelectedColor(quickViewProduct.colors[0]?.name || 'Standard');
      setQuantity(1);
      setAdded(false);
    }
  }, [quickViewProduct]);

  if (!isQuickViewOpen || !quickViewProduct) return null;

  const currentPrice = quickViewProduct.salePrice ?? quickViewProduct.price;
  const hasDiscount = quickViewProduct.salePrice && quickViewProduct.salePrice < quickViewProduct.price;

  const handleAddToCart = () => {
    const success = addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleViewFullPage = () => {
    closeQuickView();
    navigateTo('product-detail', { productId: quickViewProduct.id });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={closeQuickView} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-[#FAF8F5] shadow-2xl rounded-xs overflow-hidden z-10 border border-stone-200">
          {/* Close button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-stone-900 bg-white/80 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Left */}
            <div className="bg-[#F2EFE9] p-4 flex flex-col justify-between">
              <div className="aspect-[3/4] w-full overflow-hidden bg-white relative">
                <img
                  src={quickViewProduct.images[selectedImgIdx] || quickViewProduct.images[0]}
                  alt={quickViewProduct.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>

              {/* Thumbnails */}
              {quickViewProduct.images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {quickViewProduct.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImgIdx(i)}
                      className={`relative w-14 h-18 shrink-0 overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImgIdx === i ? 'border-[#8A1C24]' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Right */}
            <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 uppercase tracking-widest mb-1">
                  <span>{quickViewProduct.category} · {quickViewProduct.fabric}</span>
                  <span className="font-mono text-[11px] text-stone-400">SKU: {quickViewProduct.sku}</span>
                </div>

                <h2 className="font-heading text-xl md:text-2xl text-[#1C1A1A] font-normal leading-snug">
                  {quickViewProduct.name}
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-3 my-3">
                  <span className="text-xl font-semibold text-[#1C1A1A]">
                    {formatPKR(currentPrice)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-sm text-stone-400 line-through">
                        {formatPKR(quickViewProduct.price)}
                      </span>
                      <span className="text-xs bg-[#8A1C24]/10 text-[#8A1C24] font-semibold px-2 py-0.5">
                        SAVE {formatPKR(quickViewProduct.price - quickViewProduct.salePrice!)}
                      </span>
                    </>
                  )}
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed border-b border-stone-200 pb-3">
                  {quickViewProduct.description}
                </p>

                {/* Color Selector */}
                <div className="mt-4">
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-2">
                    Color: <span className="font-semibold text-stone-900">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {quickViewProduct.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                          selectedColor === c.name ? 'border-[#8A1C24] ring-2 ring-[#8A1C24]/20 scale-110' : 'border-stone-300'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {selectedColor === c.name && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs uppercase tracking-wider text-stone-700 font-medium">
                      Select Size: <span className="font-semibold text-stone-900">{selectedSize}</span>
                    </label>
                    <button
                      onClick={() => {
                        closeQuickView();
                        navigateTo('size-guide');
                      }}
                      className="text-[11px] text-[#8A1C24] underline hover:text-[#58141A]"
                    >
                      Pakistani Size Chart
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((sz, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 text-xs font-medium tracking-wider uppercase border transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-[#1C1A1A] text-white border-[#1C1A1A]'
                            : 'bg-white text-stone-800 border-stone-300 hover:border-stone-600'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mt-4 flex items-center gap-4">
                  <label className="text-xs uppercase tracking-wider text-stone-700 font-medium">Quantity:</label>
                  <div className="flex items-center border border-stone-300 bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-2.5 py-1 text-stone-600 hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold text-stone-800 min-w-[28px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(quickViewProduct.stock, q + 1))}
                      className="px-2.5 py-1 text-stone-600 hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-stone-500">
                    {quickViewProduct.stock > 0 ? `${quickViewProduct.stock} Available` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Bottom CTAs */}
              <div className="pt-6 border-t border-stone-200 mt-6 space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={quickViewProduct.stock <= 0}
                  className={`w-full py-3 px-4 text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                    quickViewProduct.stock <= 0
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : added
                      ? 'bg-emerald-800 text-white'
                      : 'bg-[#8A1C24] hover:bg-[#A3232D] text-white'
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={16} />
                      Added to Shopping Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      Add to Bag · {formatPKR(currentPrice * quantity)}
                    </>
                  )}
                </button>

                <button
                  onClick={handleViewFullPage}
                  className="w-full py-2.5 px-4 text-xs tracking-wider uppercase font-medium text-stone-800 hover:text-[#8A1C24] hover:border-stone-400 border border-stone-300 flex items-center justify-center gap-2 bg-white transition-colors"
                >
                  <Eye size={14} />
                  View Full Product Details &amp; Video
                </button>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Truck size={13} className="text-[#8A1C24]" />
                    Nationwide Cash on Delivery
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={13} className="text-[#8A1C24]" />
                    Original Pure Fabric Guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
