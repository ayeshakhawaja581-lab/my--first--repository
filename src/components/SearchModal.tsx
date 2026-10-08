import React, { useState, useEffect, useMemo } from 'react';
import { useShop, formatPKR } from '../context/ShopContext';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { products, navigateTo } = useShop();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const popularSearches = [
    'Embroidered Lawn',
    'Raw Silk Pret',
    'Zardozi Pishwas',
    'Festive Chiffon',
    'Summer Lawn 3-Piece',
    'Korean Silk Abaya',
    'Bridal Gharara',
  ];

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.components.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [products, searchTerm]);

  if (!isOpen) return null;

  const handleSelectProduct = (productId: string) => {
    onClose();
    navigateTo('product-detail', { productId });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-start justify-center pt-16 px-4 pb-6">
        <div className="relative w-full max-w-3xl bg-[#FAF8F5] shadow-2xl rounded-xs overflow-hidden z-10 border border-stone-200">
          {/* Search Input Bar */}
          <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center gap-3 bg-white">
            <Search size={22} className="text-[#8A1C24] shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search lawn suits, raw silk pret, fabrics, or SKU..."
              className="w-full text-base sm:text-lg bg-transparent border-none text-stone-900 placeholder-stone-400 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 text-stone-400 hover:text-stone-600"
              >
                <X size={18} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors ml-2"
              aria-label="Close Search"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Suggestions when empty */}
          {!searchTerm && (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8A1C24] font-semibold">
                <Sparkles size={14} />
                <span>Popular Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => setSearchTerm(term)}
                    className="bg-white border border-stone-200 hover:border-[#8A1C24] hover:text-[#8A1C24] text-stone-700 px-3 py-1.5 text-xs rounded-sm transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-stone-200">
                <div className="text-xs uppercase tracking-wider text-stone-500 mb-2">Browse by Category</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {['Unstitched Lawn', 'Luxury Pret', 'Formal Wear', 'Zarmeen Modest'].map((cat, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        onClose();
                        navigateTo('shop', {
                          category: cat === 'Unstitched Lawn' ? 'Unstitched' : (cat as any),
                        });
                      }}
                      className="p-2.5 text-left bg-[#F2EFE9] hover:bg-[#8A1C24] hover:text-white transition-colors rounded-xs font-medium text-stone-800"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Results Display */}
          {searchTerm && (
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="flex justify-between items-center text-xs text-stone-500 mb-4 pb-2 border-b border-stone-200">
                <span>
                  Found <strong>{filteredProducts.length}</strong> matching results for "{searchTerm}"
                </span>
                <button
                  onClick={() => {
                    onClose();
                    navigateTo('shop');
                  }}
                  className="text-[#8A1C24] hover:underline"
                >
                  View full shop
                </button>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <p className="font-heading text-lg text-stone-800">No matching garments found</p>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    We could not find any products matching "{searchTerm}". Try searching for fabrics like "Lawn", "Chiffon", or categories like "Pret".
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="inline-block mt-2 text-xs text-[#8A1C24] font-medium underline"
                  >
                    Clear search term
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.map((p) => {
                    const price = p.salePrice ?? p.price;
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProduct(p.id)}
                        className="flex gap-3 p-2.5 bg-white border border-stone-200/80 hover:border-[#8A1C24] transition-all cursor-pointer rounded-xs group"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-16 h-20 object-cover object-top bg-[#F2EFE9] shrink-0"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-[#8A1C24] uppercase tracking-wider font-semibold">
                              {p.fabric} · {p.pieces}
                            </span>
                            <h4 className="font-heading text-xs text-stone-900 group-hover:text-[#8A1C24] transition-colors line-clamp-1">
                              {p.name}
                            </h4>
                            <span className="text-[10px] text-stone-400 font-mono">SKU: {p.sku}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-semibold text-stone-900">
                              {formatPKR(price)}
                            </span>
                            <span className="text-[11px] text-[#8A1C24] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                              View <ArrowRight size={11} />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
