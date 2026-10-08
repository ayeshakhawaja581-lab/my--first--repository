import React, { useState, useMemo, useEffect } from 'react';
import { useShop, formatPKR } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import {
  ClothingCategory,
  ClothingCollection,
  ClothingFabric,
  ClothingSize,
} from '../types';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const ShopView: React.FC = () => {
  const {
    products,
    selectedCategory,
    selectedCollection,
    navigateTo,
  } = useShop();

  // Local Filter States
  const [categoryFilter, setCategoryFilter] = useState<string>(selectedCategory || 'all');
  const [collectionFilter, setCollectionFilter] = useState<string>(selectedCollection || 'all');
  const [fabricFilter, setFabricFilter] = useState<string>('all');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [colorFilter, setColorFilter] = useState<string>('all');
  const [onlySale, setOnlySale] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Sync when context changes
  useEffect(() => {
    if (selectedCategory) {
      setCategoryFilter(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCollection) {
      setCollectionFilter(selectedCollection);
    }
  }, [selectedCollection]);

  const categories: ClothingCategory[] = [
    'Ready to Wear',
    'Unstitched',
    'Luxury Pret',
    'Formal Wear',
    'Bridal / Wedding Edit',
    'Festive Collection',
    'Zarmeen Modest',
    'Sale',
  ];

  const fabrics: ClothingFabric[] = [
    'Lawn',
    'Cotton',
    'Khaddar',
    'Linen',
    'Cambric',
    'Chiffon',
    'Silk',
    'Organza',
    'Velvet',
    'Raw Silk',
  ];

  const sizes: ClothingSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom', 'Unstitched'];

  const colors = [
    { name: 'Ivory Cream', hex: '#F5F2EB' },
    { name: 'Emerald', hex: '#1C3D2F' },
    { name: 'Deep Maroon', hex: '#631821' },
    { name: 'Pistachio Sage', hex: '#A3B19B' },
    { name: 'Mocha Taupe', hex: '#7D6A5D' },
    { name: 'Onyx Black', hex: '#1C1A1A' },
    { name: 'Mustard Marigold', hex: '#D49438' },
    { name: 'Powder Blue', hex: '#B2C7D9' },
  ];

  // Filter application
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Must be active
      if (p.isActive === false) return false;

      // Category
      if (categoryFilter !== 'all') {
        if (categoryFilter === 'Sale') {
          if (!p.isSale && !(p.salePrice && p.salePrice < p.price)) return false;
        } else if (p.category !== categoryFilter) {
          return false;
        }
      }

      // Collection
      if (collectionFilter !== 'all' && p.collection !== collectionFilter) {
        return false;
      }

      // Fabric
      if (fabricFilter !== 'all' && p.fabric !== fabricFilter) {
        return false;
      }

      // Size
      if (sizeFilter !== 'all' && !p.sizes.includes(sizeFilter as any)) {
        return false;
      }

      // Color
      if (
        colorFilter !== 'all' &&
        !p.colors.some((c) => c.name.toLowerCase().includes(colorFilter.toLowerCase()))
      ) {
        return false;
      }

      // Sale toggle
      if (onlySale && !p.isSale && !(p.salePrice && p.salePrice < p.price)) {
        return false;
      }

      // In Stock
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      // Price
      const price = p.salePrice ?? p.price;
      if (price < minPrice || price > maxPrice) {
        return false;
      }

      return true;
    });
  }, [
    products,
    categoryFilter,
    collectionFilter,
    fabricFilter,
    sizeFilter,
    colorFilter,
    onlySale,
    inStockOnly,
    minPrice,
    maxPrice,
  ]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low') {
      list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'bestseller') {
      list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }
    return list;
  }, [filteredProducts, sortBy]);

  const resetFilters = () => {
    setCategoryFilter('all');
    setCollectionFilter('all');
    setFabricFilter('all');
    setSizeFilter('all');
    setColorFilter('all');
    setOnlySale(false);
    setInStockOnly(false);
    setMinPrice(0);
    setMaxPrice(150000);
    setSortBy('featured');
  };

  const hasActiveFilters =
    categoryFilter !== 'all' ||
    collectionFilter !== 'all' ||
    fabricFilter !== 'all' ||
    sizeFilter !== 'all' ||
    colorFilter !== 'all' ||
    onlySale ||
    inStockOnly ||
    minPrice > 0 ||
    maxPrice < 150000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Page Title & Breadcrumb */}
      <div className="mb-8 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-widest mb-2">
          <button onClick={() => navigateTo('home')} className="hover:text-stone-900">
            Home
          </button>
          <span>/</span>
          <span className="text-stone-900 font-semibold">The Boutique Shop</span>
          {categoryFilter !== 'all' && (
            <>
              <span>/</span>
              <span className="text-[#8A1C24] font-semibold">{categoryFilter}</span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl text-[#1C1A1A] uppercase tracking-wide">
              {categoryFilter !== 'all' ? categoryFilter : 'The Zarmeen Collection'}
            </h1>
            <p className="text-xs text-stone-500 mt-1 max-w-xl">
              Authentic Pakistani designs rendered in unstitched lawn, festive organza, and handcrafted pure raw silk pret.
            </p>
          </div>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-[#1C1A1A] text-white'
                  : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300'
              }`}
            >
              All Articles
            </button>
            <button
              onClick={() => setCategoryFilter('Unstitched')}
              className={`px-3 py-1.5 uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer ${
                categoryFilter === 'Unstitched'
                  ? 'bg-[#1C1A1A] text-white'
                  : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300'
              }`}
            >
              Unstitched Lawn
            </button>
            <button
              onClick={() => setCategoryFilter('Luxury Pret')}
              className={`px-3 py-1.5 uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer ${
                categoryFilter === 'Luxury Pret'
                  ? 'bg-[#1C1A1A] text-white'
                  : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300'
              }`}
            >
              Luxury Pret
            </button>
            <button
              onClick={() => setCategoryFilter('Zarmeen Modest')}
              className={`px-3 py-1.5 uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer ${
                categoryFilter === 'Zarmeen Modest'
                  ? 'bg-[#1C1A1A] text-white'
                  : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300'
              }`}
            >
              Modest Abayas
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Mobile Filter Button, Result Count, Sort Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-stone-900 text-white px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-xs"
          >
            <SlidersHorizontal size={14} />
            Filters {hasActiveFilters && '(Active)'}
          </button>
          <span className="text-xs text-stone-500 tracking-wide">
            Showing <strong>{sortedProducts.length}</strong> luxurious designs
          </span>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <span className="text-stone-500 uppercase tracking-wider font-medium">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-stone-300 text-stone-800 py-1.5 px-3 rounded-xs text-xs focus:outline-none focus:border-[#8A1C24]"
          >
            <option value="featured">Featured Collection</option>
            <option value="newest">New Arrivals First</option>
            <option value="bestseller">Bestselling First</option>
            <option value="price-low">Price: Low to High (PKR)</option>
            <option value="price-high">Price: High to Low (PKR)</option>
          </select>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filter (Desktop) */}
        <div className="hidden lg:block space-y-6">
          {hasActiveFilters && (
            <div className="flex justify-between items-center bg-[#F2EFE9] p-3 rounded-xs">
              <span className="text-xs text-stone-800 font-semibold uppercase tracking-wider">
                Filters Active
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-[#8A1C24] hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw size={12} />
                Clear All
              </button>
            </div>
          )}

          {/* Categories */}
          <div className="border-b border-stone-200 pb-5">
            <h4 className="font-heading text-xs uppercase tracking-widest text-stone-900 font-semibold mb-3">
              Categories
            </h4>
            <div className="space-y-1.5 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-stone-700 hover:text-stone-900">
                <input
                  type="radio"
                  name="cat"
                  checked={categoryFilter === 'all'}
                  onChange={() => setCategoryFilter('all')}
                  className="accent-[#8A1C24]"
                />
                <span>All Categories</span>
              </label>
              {categories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 cursor-pointer text-stone-700 hover:text-stone-900"
                >
                  <input
                    type="radio"
                    name="cat"
                    checked={categoryFilter === cat}
                    onChange={() => setCategoryFilter(cat)}
                    className="accent-[#8A1C24]"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Fabrics */}
          <div className="border-b border-stone-200 pb-5">
            <h4 className="font-heading text-xs uppercase tracking-widest text-stone-900 font-semibold mb-3">
              Fabric
            </h4>
            <div className="space-y-1.5 text-xs max-h-40 overflow-y-auto pr-1">
              <label className="flex items-center gap-2 cursor-pointer text-stone-700 hover:text-stone-900">
                <input
                  type="radio"
                  name="fab"
                  checked={fabricFilter === 'all'}
                  onChange={() => setFabricFilter('all')}
                  className="accent-[#8A1C24]"
                />
                <span>All Fabrics</span>
              </label>
              {fabrics.map((fab) => (
                <label
                  key={fab}
                  className="flex items-center gap-2 cursor-pointer text-stone-700 hover:text-stone-900"
                >
                  <input
                    type="radio"
                    name="fab"
                    checked={fabricFilter === fab}
                    onChange={() => setFabricFilter(fab)}
                    className="accent-[#8A1C24]"
                  />
                  <span>{fab}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="border-b border-stone-200 pb-5">
            <h4 className="font-heading text-xs uppercase tracking-widest text-stone-900 font-semibold mb-3">
              Size
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSizeFilter('all')}
                className={`px-2.5 py-1 text-xs uppercase font-medium border rounded-xs ${
                  sizeFilter === 'all'
                    ? 'bg-[#1C1A1A] text-white border-[#1C1A1A]'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
                }`}
              >
                All
              </button>
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSizeFilter(sizeFilter === sz ? 'all' : sz)}
                  className={`px-2.5 py-1 text-xs uppercase font-medium border rounded-xs ${
                    sizeFilter === sz
                      ? 'bg-[#8A1C24] text-white border-[#8A1C24]'
                      : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color filter */}
          <div className="border-b border-stone-200 pb-5">
            <h4 className="font-heading text-xs uppercase tracking-widest text-stone-900 font-semibold mb-3">
              Color Tone
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setColorFilter('all')}
                className={`text-[11px] px-2 py-0.5 border rounded-xs ${
                  colorFilter === 'all' ? 'bg-[#1C1A1A] text-white' : 'bg-white text-stone-600'
                }`}
              >
                All
              </button>
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColorFilter(colorFilter === c.name ? 'all' : c.name)}
                  className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                    colorFilter === c.name
                      ? 'border-[#8A1C24] ring-2 ring-[#8A1C24]/30 scale-110'
                      : 'border-stone-300'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Price Range Filter (PKR) */}
          <div className="border-b border-stone-200 pb-5">
            <h4 className="font-heading text-xs uppercase tracking-widest text-stone-900 font-semibold mb-3">
              Price Range (PKR)
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-stone-600 font-semibold">
                <span>PKR 0</span>
                <span>{formatPKR(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="150000"
                step="2500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#8A1C24]"
              />
            </div>
          </div>

          {/* Additional toggles */}
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-stone-800">
              <input
                type="checkbox"
                checked={onlySale}
                onChange={(e) => setOnlySale(e.target.checked)}
                className="accent-[#8A1C24]"
              />
              <span className="font-medium text-[#8A1C24]">Sale Articles Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-stone-800">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[#8A1C24]"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="lg:col-span-3">
          {sortedProducts.length === 0 ? (
            <div className="bg-white border border-stone-200 p-12 text-center rounded-xs space-y-4">
              <h3 className="font-heading text-xl text-stone-800">No Outfits Matched Your Filter</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Try widening your price range, removing fabric constraints, or browsing all categories.
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#8A1C24] hover:bg-[#A3232D] text-white text-xs tracking-widest uppercase font-semibold py-2.5 px-6 rounded-xs transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {sortedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative min-h-full bg-[#FAF8F5] max-w-xs w-full ml-auto p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-stone-200">
                <h3 className="font-heading text-base text-stone-900 uppercase">Filter Garments</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              {/* Category */}
              <div className="py-4 border-b border-stone-200">
                <h4 className="text-xs uppercase font-semibold text-stone-800 mb-2">Category</h4>
                <div className="space-y-1 text-xs">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="mcat"
                      checked={categoryFilter === 'all'}
                      onChange={() => setCategoryFilter('all')}
                      className="accent-[#8A1C24]"
                    />
                    <span>All</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mcat"
                        checked={categoryFilter === cat}
                        onChange={() => setCategoryFilter(cat)}
                        className="accent-[#8A1C24]"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="py-4 border-b border-stone-200">
                <h4 className="text-xs uppercase font-semibold text-stone-800 mb-2">
                  Max Price: {formatPKR(maxPrice)}
                </h4>
                <input
                  type="range"
                  min="5000"
                  max="150000"
                  step="2500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#8A1C24]"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-[#8A1C24] text-white py-2.5 text-xs uppercase tracking-widest font-semibold rounded-xs"
              >
                Apply Filters ({sortedProducts.length})
              </button>
              <button
                onClick={resetFilters}
                className="w-full bg-white text-stone-700 border border-stone-300 py-2 text-xs uppercase tracking-wider font-medium rounded-xs"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
