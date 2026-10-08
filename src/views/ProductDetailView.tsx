import React, { useState } from 'react';
import { useShop, formatPKR } from '../context/ShopContext';
import { ClothingSize } from '../types';
import {
  Heart,
  ShoppingBag,
  Ruler,
  Truck,
  ShieldCheck,
  RefreshCw,
  Star,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Check,
  Share2,
} from 'lucide-react';

interface ProductDetailViewProps {
  onOpenSizeGuide: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ onOpenSizeGuide }) => {
  const {
    products,
    selectedProductId,
    addToCart,
    toggleWishlist,
    isInWishlist,
    reviews,
    addReview,
    navigateTo,
  } = useShop();

  const product =
    products.find((p) => p.id === selectedProductId) || products[0] || null;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-heading text-2xl text-stone-800">Garment Not Found</h2>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 bg-[#8A1C24] text-white px-6 py-2 text-xs uppercase tracking-wider"
        >
          Return to Boutique
        </button>
      </div>
    );
  }

  const [activeMedia, setActiveMedia] = useState<'image' | 'video'>('image');
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ClothingSize>(product.sizes[0] || 'Unstitched');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [revRating, setRevRating] = useState(5);
  const [revTitle, setRevTitle] = useState('');
  const [revComment, setRevComment] = useState('');
  const [revName, setRevName] = useState('');
  const [revEmail, setRevEmail] = useState('');
  const [revSubmitted, setRevSubmitted] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const currentPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const productReviews = reviews.filter((r) => r.productId === product.id && r.status === 'approved');

  const handleAddToCart = () => {
    const success = addToCart(product, selectedSize, selectedColor, quantity);
    if (success) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2500);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName || !revComment || !revTitle) return;

    addReview({
      productId: product.id,
      productName: product.name,
      customerName: revName,
      customerEmail: revEmail || 'patron@zarmeen.pk',
      rating: revRating,
      title: revTitle,
      comment: revComment,
    });

    setRevSubmitted(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setRevSubmitted(false);
      setRevTitle('');
      setRevComment('');
      setRevName('');
      setRevEmail('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-widest mb-6 border-b border-stone-200/60 pb-3">
        <button onClick={() => navigateTo('home')} className="hover:text-stone-900">
          Home
        </button>
        <span>/</span>
        <button
          onClick={() => navigateTo('shop', { category: product.category })}
          className="hover:text-stone-900"
        >
          {product.category}
        </button>
        <span>/</span>
        <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Gallery & Video */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails strip */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[600px] shrink-0 pb-2 md:pb-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveMedia('image');
                  setSelectedImgIdx(idx);
                }}
                className={`w-16 h-20 md:w-20 md:h-26 overflow-hidden border-2 transition-all cursor-pointer ${
                  activeMedia === 'image' && selectedImgIdx === idx
                    ? 'border-[#8A1C24] opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover object-top" />
              </button>
            ))}

            {/* Video Thumbnail tab */}
            {product.videoUrl && (
              <button
                onClick={() => setActiveMedia('video')}
                className={`w-16 h-20 md:w-20 md:h-26 bg-stone-900 flex flex-col items-center justify-center text-white border-2 transition-all cursor-pointer ${
                  activeMedia === 'video'
                    ? 'border-[#8A1C24] opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                title="Product Video"
              >
                <Play size={20} className="text-[#D6B57E]" />
                <span className="text-[10px] uppercase font-semibold mt-1">Video</span>
              </button>
            )}
          </div>

          {/* Main Visual Display */}
          <div className="flex-1 relative aspect-[3/4] bg-[#F2EFE9] border border-stone-200/80 overflow-hidden group">
            {activeMedia === 'image' ? (
              <div
                className={`w-full h-full relative cursor-crosshair overflow-hidden`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={product.images[selectedImgIdx] || product.images[0]}
                  alt={product.name}
                  className={`w-full h-full object-cover object-top transition-transform duration-500 ${
                    isZoomed ? 'scale-150' : 'scale-100 group-hover:scale-105'
                  }`}
                />
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] px-2 py-1 uppercase tracking-wider backdrop-blur-xs pointer-events-none">
                  {isZoomed ? 'Click to minimize' : 'Click to zoom'}
                </div>
              </div>
            ) : (
              <div className="w-full h-full relative bg-black flex items-center justify-center">
                <video
                  src={product.videoUrl}
                  loop
                  playsInline
                  muted={isMuted}
                  autoPlay={isPlaying}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between bg-black/60 backdrop-blur-xs p-2 text-white text-xs">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white/20 hover:bg-white/40 rounded-xs"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white/20 hover:bg-white/40 rounded-xs"
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    <span>{isMuted ? 'Muted' : 'Sound On'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Product Specs & Ordering */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 uppercase tracking-widest mb-1.5">
              <span>{product.collection} · {product.fabric}</span>
              <span className="font-mono text-stone-400">SKU: {product.sku}</span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl text-[#1C1A1A] font-normal leading-snug">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-stone-800">{product.rating}</span>
              <span className="text-xs text-stone-400">({product.reviewCount} customer reviews)</span>
            </div>

            {/* Price Block */}
            <div className="flex items-baseline gap-3 my-4">
              <span className="text-2xl font-bold text-[#1C1A1A]">
                {formatPKR(currentPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-stone-400 line-through">
                    {formatPKR(product.price)}
                  </span>
                  <span className="text-xs bg-[#8A1C24] text-white font-semibold px-2 py-0.5 uppercase tracking-wider">
                    {discountPercent}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock status */}
            <div className="text-xs font-medium">
              {product.stock > 5 ? (
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
                  In Stock · Ready for Immediate Dispatch across Pakistan
                </span>
              ) : product.stock > 0 ? (
                <span className="text-amber-800 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" />
                  Limited Atelier Run · Only {product.stock} units remaining
                </span>
              ) : (
                <span className="text-red-700 font-semibold">Sold Out</span>
              )}
            </div>
          </div>

          <div className="border-t border-b border-stone-200 py-4 space-y-4">
            {/* Color Swatches */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-2">
                Colorway: <span className="font-bold text-stone-900">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-2.5">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                      selectedColor === c.name
                        ? 'border-[#8A1C24] ring-2 ring-[#8A1C24]/20 scale-110'
                        : 'border-stone-300'
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

            {/* Size Options */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wider text-stone-700 font-medium">
                  Select Size: <span className="font-bold text-stone-900">{selectedSize}</span>
                </label>
                <button
                  onClick={onOpenSizeGuide}
                  className="text-xs text-[#8A1C24] font-medium flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Ruler size={13} />
                  Pakistani Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3.5 py-2 text-xs font-semibold tracking-wider uppercase border transition-all cursor-pointer ${
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

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-1">
              <label className="text-xs uppercase tracking-wider text-stone-700 font-medium">Quantity:</label>
              <div className="flex items-center border border-stone-300 bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-semibold text-stone-800 min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-3.5 px-6 text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                  product.stock <= 0
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : addedNotice
                    ? 'bg-emerald-800 text-white'
                    : 'bg-[#8A1C24] hover:bg-[#A3232D] text-white'
                }`}
              >
                {addedNotice ? (
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
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 border transition-all flex items-center justify-center cursor-pointer ${
                  isFavorited
                    ? 'bg-[#8A1C24] text-white border-[#8A1C24]'
                    : 'bg-white text-stone-800 border-stone-300 hover:text-[#8A1C24]'
                }`}
                title="Wishlist"
              >
                <Heart size={18} className={isFavorited ? 'fill-white' : ''} />
              </button>
            </div>
          </div>

          {/* Pakistani Garment Details Breakdown */}
          <div className="bg-[#F4EFE6] border border-stone-200 p-5 rounded-xs space-y-4 text-xs">
            <h4 className="font-heading text-sm text-stone-900 uppercase tracking-wider font-semibold border-b border-stone-300/70 pb-2">
              Garment Specifications &amp; Inclusions
            </h4>

            <div className="grid grid-cols-2 gap-y-2 text-stone-700">
              <div>
                <span className="text-stone-500 uppercase tracking-wider block text-[10px]">Product Type</span>
                <span className="font-semibold">{product.productType}</span>
              </div>
              <div>
                <span className="text-stone-500 uppercase tracking-wider block text-[10px]">Pieces</span>
                <span className="font-semibold">{product.pieces}</span>
              </div>
              <div>
                <span className="text-stone-500 uppercase tracking-wider block text-[10px]">Fabric Quality</span>
                <span className="font-semibold">{product.fabric}</span>
              </div>
              <div>
                <span className="text-stone-500 uppercase tracking-wider block text-[10px]">Occasion</span>
                <span className="font-semibold">{product.category}</span>
              </div>
            </div>

            {/* Included Pieces List */}
            {product.components.length > 0 && (
              <div className="pt-2 border-t border-stone-300/70">
                <span className="text-stone-500 uppercase tracking-wider block text-[10px] mb-1.5">
                  Package Components:
                </span>
                <ul className="space-y-1 text-stone-700">
                  {product.components.map((comp, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#8A1C24] font-bold">·</span>
                      <span>{comp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Delivery & Assurance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600">
            <div className="flex gap-2.5 items-start">
              <Truck size={16} className="text-[#8A1C24] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 block">Nationwide Delivery</span>
                <span>2-4 days via TCS &amp; Leopards Courier. Cash on Delivery available.</span>
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <ShieldCheck size={16} className="text-[#8A1C24] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 block">100% Original Fabric</span>
                <span>Tested Pima lawn threads &amp; genuine zardozi embellishments.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Care Tabs */}
      <div className="mt-16 border-t border-stone-200 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="font-heading text-xl text-stone-900 uppercase tracking-wide mb-3">
              Artisan Notes &amp; Design Philosophy
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed space-y-2">
              {product.description}
            </p>
          </div>

          <div>
            <h3 className="font-heading text-xl text-stone-900 uppercase tracking-wide mb-3">
              Care Instructions
            </h3>
            <ul className="space-y-2 text-xs text-stone-600">
              {product.careInstructions.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#8A1C24] font-semibold">✓</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-16 border-t border-stone-200 pt-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h3 className="font-heading text-2xl text-stone-900 uppercase tracking-wide">
              Customer Reviews ({productReviews.length})
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Real testimonials from women wearing Zarmeen across Pakistan.
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="mt-4 sm:mt-0 bg-[#1C1A1A] hover:bg-[#8A1C24] text-white px-5 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
          >
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white border border-stone-200 p-6 rounded-xs mb-8 space-y-4 max-w-2xl"
          >
            <h4 className="font-heading text-base text-stone-900 font-semibold">
              Share Your Experience With This Garment
            </h4>

            {revSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
                Thank you! Your verified review has been submitted and published.
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 mb-1">
                    Rating
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRevRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          size={20}
                          className={
                            star <= revRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      placeholder="e.g. Ayesha Tariq"
                      className="w-full bg-[#FAF8F5] border border-stone-300 px-3 py-2 text-xs focus:outline-none focus:border-[#8A1C24]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={revEmail}
                      onChange={(e) => setRevEmail(e.target.value)}
                      placeholder="ayesha@gmail.com"
                      className="w-full bg-[#FAF8F5] border border-stone-300 px-3 py-2 text-xs focus:outline-none focus:border-[#8A1C24]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 mb-1">
                    Review Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={revTitle}
                    onChange={(e) => setRevTitle(e.target.value)}
                    placeholder="e.g. Stunning lawn texture and embroidery!"
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-3 py-2 text-xs focus:outline-none focus:border-[#8A1C24]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-stone-700 mb-1">
                    Detailed Review *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    placeholder="Describe the fabric feel, stitching finesse, color accuracy, and overall fit..."
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-3 py-2 text-xs focus:outline-none focus:border-[#8A1C24]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#8A1C24] hover:bg-[#A3232D] text-white px-6 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
                >
                  Submit Verified Review
                </button>
              </>
            )}
          </form>
        )}

        {/* Reviews List */}
        {productReviews.length === 0 ? (
          <div className="bg-white border border-stone-200 p-8 text-center text-xs text-stone-500">
            No public reviews yet for this design. Be the first to share your thoughts!
          </div>
        ) : (
          <div className="space-y-4">
            {productReviews.map((rev) => (
              <div key={rev.id} className="bg-white border border-stone-200/80 p-5 rounded-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-sm font-semibold text-stone-900">
                      {rev.customerName}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 font-medium rounded-xs">
                      Verified Buyer
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400">{rev.date}</span>
                </div>

                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}
                    />
                  ))}
                </div>

                <h5 className="font-heading text-xs font-semibold text-stone-900">{rev.title}</h5>
                <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
