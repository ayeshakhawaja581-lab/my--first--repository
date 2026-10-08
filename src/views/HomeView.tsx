import React from 'react';
import { useShop, formatPKR } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, Sparkles, Star, ShieldCheck, Heart, Award } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { products, settings, reviews, navigateTo } = useShop();

  const featuredProducts = products.filter((p) => p.isFeatured && p.isActive !== false).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival && p.isActive !== false).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestseller && p.isActive !== false).slice(0, 4);
  const modestProducts = products.filter((p) => p.category === 'Zarmeen Modest' && p.isActive !== false).slice(0, 3);

  const categories = [
    {
      title: 'Unstitched Lawn',
      subtitle: 'Premium Pima Lawn · Schiffli & Silk Dupattas',
      image: '/src/assets/images/lawn_collection_1791436586308.jpg',
      category: 'Unstitched',
    },
    {
      title: 'Luxury Pret',
      subtitle: 'Pure Raw Silk · Hand-Embellished Kalis',
      image: '/src/assets/images/pret_couture_1791436600244.jpg',
      category: 'Luxury Pret',
    },
    {
      title: 'Festive & Formal',
      subtitle: 'Pure Crinkle Chiffon · Regal Zardozi Work',
      image: '/src/assets/images/zarmeen_hero_1791436571248.jpg',
      category: 'Formal Wear',
    },
    {
      title: 'Zarmeen Modest',
      subtitle: 'Luxury Textured Abayas & Coordinated Hijabs',
      image: '/src/assets/images/modest_abaya_1791436612870.jpg',
      category: 'Zarmeen Modest',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO CAMPAIGN SECTION */}
      <section className="relative min-h-[75vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#181616]">
        {/* Hero Background Image with Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={settings.heroImage || '/src/assets/images/zarmeen_hero_1791436571248.jpg'}
            alt="Zarmeen Pakistani Luxury Fashion Campaign"
            className="w-full h-full object-cover object-center scale-102 transition-transform duration-1000 ease-out"
          />
          {/* Gradients ensuring 4.5:1 text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/35" />
          <div className="absolute inset-0 bg-black/20 backdrop-brightness-95" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white py-16">
          <div className="inline-flex items-center gap-2 border border-[#D6B57E]/60 bg-black/40 backdrop-blur-xs px-3.5 py-1 text-xs uppercase tracking-[0.25em] text-[#D6B57E] mb-6 rounded-xs">
            <Sparkles size={12} />
            <span>The Festive Couture 2026 Collection</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.16em] uppercase font-normal text-white drop-shadow-md">
            {settings.heroHeading}
          </h1>

          <p className="font-editorial text-2xl sm:text-3xl md:text-4xl italic text-[#EAE2D5] mt-2 mb-4 tracking-wide font-light">
            "{settings.heroTagline}"
          </p>

          <p className="max-w-xl mx-auto text-xs sm:text-sm text-stone-200 tracking-wide font-light leading-relaxed mb-8">
            {settings.heroDescription}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigateTo('shop', { collection: 'Festive Edit' })}
              className="w-full sm:w-auto bg-[#8A1C24] hover:bg-[#A3232D] text-white px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-semibold transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              {settings.heroButtonText}
            </button>
            <button
              onClick={() => navigateTo('shop', { category: 'Unstitched' })}
              className="w-full sm:w-auto bg-white/10 hover:bg-white text-white hover:text-stone-900 border border-white/60 px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-semibold backdrop-blur-xs transition-all cursor-pointer"
            >
              {settings.heroSecondaryButtonText}
            </button>
          </div>

          {/* Quick Pillars */}
          <div className="mt-12 pt-8 border-t border-white/15 flex flex-wrap justify-center gap-6 sm:gap-12 text-[11px] tracking-widest uppercase text-stone-300">
            <span>· Nationwide COD</span>
            <span>· 100% Pure Fabrics</span>
            <span>· Lahore Flagship Studio</span>
            <span>· Free Delivery Above PKR 5,000</span>
          </div>
        </div>
      </section>

      {/* 2. PAKISTANI CLOTHING CATEGORIES (EDITORIAL TILES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] tracking-[0.25em] text-[#8A1C24] uppercase font-semibold block mb-1">
            Curated Lines
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#1C1A1A] uppercase tracking-[0.1em]">
            Signature Categories
          </h2>
          <div className="w-12 h-0.5 bg-[#8A1C24] mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => navigateTo('shop', { category: cat.category as any })}
              className="group relative aspect-[3/4] overflow-hidden bg-stone-900 cursor-pointer shadow-xs border border-stone-200/60"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-x-4 bottom-5 text-white">
                <span className="text-[10px] tracking-widest uppercase text-[#D6B57E] font-medium block mb-1">
                  Explore Collection
                </span>
                <h3 className="font-heading text-xl uppercase tracking-wider text-white group-hover:text-[#D6B57E] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-stone-300 mt-1 line-clamp-1">
                  {cat.subtitle}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#D6B57E] font-medium tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                  <span>View All</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS EDITORIAL GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-8 border-b border-stone-200 pb-4">
          <div>
            <span className="text-[11px] tracking-[0.25em] text-[#8A1C24] uppercase font-semibold block mb-1">
              Handpicked Elegance
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl text-[#1C1A1A] uppercase tracking-[0.08em]">
              The Festive Edit
            </h2>
          </div>
          <button
            onClick={() => navigateTo('shop', { collection: 'Festive Edit' })}
            className="mt-3 sm:mt-0 text-xs tracking-widest uppercase font-semibold text-[#8A1C24] hover:text-[#58141A] flex items-center gap-1.5 group cursor-pointer"
          >
            <span>View Complete Collection</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 4. EDITORIAL STORY BANNER: HERITAGE MEETS MODERNITY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1C1A1A] text-white grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-lg border border-stone-800">
          <div className="lg:col-span-5 relative aspect-[4/5] lg:aspect-auto">
            <img
              src="/src/assets/images/pret_couture_1791436600244.jpg"
              alt="Pakistani craftsmanship"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 to-transparent" />
          </div>

          <div className="lg:col-span-7 p-8 sm:p-12 md:p-16 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 text-[#D6B57E] text-xs uppercase tracking-[0.25em] font-semibold">
              <Award size={14} />
              <span>Couture Heritage &amp; Hand-Craft</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wide uppercase leading-tight">
              Threads of Tradition.<br />A Signature of You.
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl font-light">
              Every Zarmeen creation tells a story woven by master artisans in Lahore, Multan, and Rawalpindi. We source fine Pima cottons, hand-dyed crinkle chiffons, and heirloom raw silks—adorning each silhouette with intricate kora, dabka, resham jaal, and hand-scalloped organza borders.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-2 border-t border-stone-800 text-xs">
              <div>
                <h4 className="font-heading text-white text-base">Pure 80s Count Pima Lawn</h4>
                <p className="text-stone-400 mt-1">Lightweight breathability with high color fastness.</p>
              </div>
              <div>
                <h4 className="font-heading text-white text-base">Zardozi &amp; Tilla Embellishments</h4>
                <p className="text-stone-400 mt-1">Real antique metallic threadwork handcrafted stitch-by-stitch.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigateTo('shop', { category: 'Luxury Pret' })}
                className="bg-[#D6B57E] hover:bg-[#C29E65] text-stone-950 px-7 py-3 text-xs tracking-widest uppercase font-semibold transition-colors cursor-pointer"
              >
                Explore Luxury Pret
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ZARMEEN MODEST COLLECTION SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F4EFE6] border border-stone-300/80 p-8 sm:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-3">
              <span className="text-[11px] tracking-[0.25em] text-emerald-900 uppercase font-semibold">
                Dedicated Modest Line
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-stone-900 uppercase tracking-wide">
                ZARMEEN MODEST
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Refined modesty elevated by Korean textured silk crepes, subtle tone-on-tone French knots, and gracefully draped matching hijabs. Designed for timeless elegance and modest occasions.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigateTo('shop', { category: 'Zarmeen Modest' })}
                  className="bg-stone-900 hover:bg-[#8A1C24] text-white px-6 py-2.5 text-xs tracking-widest uppercase font-semibold transition-colors cursor-pointer"
                >
                  Shop Modest Abayas &amp; Drapes
                </button>
              </div>
            </div>

            <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] overflow-hidden bg-white shadow-sm border border-stone-200">
                <img
                  src="/src/assets/images/modest_abaya_1791436612870.jpg"
                  alt="Zarmeen Modest Abaya"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="aspect-[3/4] overflow-hidden bg-white shadow-sm border border-stone-200">
                <img
                  src="/src/assets/images/zarmeen_hero_1791436571248.jpg"
                  alt="Zarmeen Modest Couture"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BESTSELLERS ROW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-8 border-b border-stone-200 pb-4">
          <div>
            <span className="text-[11px] tracking-[0.25em] text-[#8A1C24] uppercase font-semibold block mb-1">
              Customer Favorites
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl text-[#1C1A1A] uppercase tracking-[0.08em]">
              Most Coveted Pieces
            </h2>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="mt-3 sm:mt-0 text-xs tracking-widest uppercase font-semibold text-[#8A1C24] hover:text-[#58141A] flex items-center gap-1.5 group cursor-pointer"
          >
            <span>View All Bestsellers</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 7. VERIFIED REVIEWS & SOCIAL PROOF */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] tracking-[0.25em] text-[#8A1C24] uppercase font-semibold block mb-1">
            Voices of Elegance
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl text-[#1C1A1A] uppercase tracking-[0.08em]">
            From Our Discerning Patrons
          </h2>
          <div className="w-12 h-0.5 bg-[#8A1C24] mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 border border-stone-200/80 rounded-xs shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-2">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      size={14}
                      className={idx < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}
                    />
                  ))}
                  <span className="text-xs text-stone-500 ml-1.5 font-medium">{rev.rating}.0</span>
                </div>
                <h4 className="font-heading text-sm text-stone-900 font-semibold">{rev.title}</h4>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span className="font-medium text-stone-800">{rev.customerName}</span>
                <span className="text-[#8A1C24] font-medium">Verified Purchase</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
