import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Truck, RefreshCw, Mail, Phone, MapPin, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, settings } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="bg-[#181616] text-[#EFECE6] border-t border-stone-800 pt-16 pb-10">
      {/* Trust & Heritage Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-stone-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center md:items-start gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#8A1C24]/20 border border-[#8A1C24]/40 flex items-center justify-center shrink-0 text-[#D6B57E]">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="font-heading text-base tracking-wider text-white">Nationwide Cash on Delivery</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Prompt 2-4 day doorstep delivery across Lahore, Karachi, Islamabad, and 120+ Pakistani cities.
              </p>
            </div>
          </div>

          <div className="flex items-center md:items-start gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#8A1C24]/20 border border-[#8A1C24]/40 flex items-center justify-center shrink-0 text-[#D6B57E]">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="font-heading text-base tracking-wider text-white">100% Heirloom Craftsmanship</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Authentic Pakistani Pima lawn, pure organza, raw silk, and hand-articulated zardozi threadwork.
              </p>
            </div>
          </div>

          <div className="flex items-center md:items-start gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#8A1C24]/20 border border-[#8A1C24]/40 flex items-center justify-center shrink-0 text-[#D6B57E]">
              <RefreshCw size={22} />
            </div>
            <div>
              <h4 className="font-heading text-base tracking-wider text-white">Seamless Exchange</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Hassle-free 14-day exchange policy for unstitched and ready-to-wear articles.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-heading text-2xl tracking-[0.25em] text-white block">
              ZARMEEN
            </span>
            <span className="text-[10px] tracking-[0.35em] text-[#D6B57E] uppercase block font-medium">
              Wear Your Heritage.
            </span>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm pt-2">
              Zarmeen is a luxury Pakistani fashion house dedicated to preserving ancient weaving, hand-embroidery, and regal silhouettes while crafting refined, modern ensembles for today’s woman.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#D6B57E] shrink-0" />
                <span>14-C Gulberg III, M.M. Alam Road, Lahore</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#D6B57E] shrink-0" />
                <span>{settings.supportPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#D6B57E] shrink-0" />
                <span>{settings.supportEmail}</span>
              </div>
            </div>
          </div>

          {/* Collections Column */}
          <div>
            <h5 className="font-heading text-sm uppercase tracking-widest text-white mb-4 border-b border-stone-800 pb-2">
              Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => navigateTo('shop', { category: 'Unstitched' })}
                  className="hover:text-white transition-colors"
                >
                  Unstitched Lawn 2026
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { category: 'Ready to Wear' })}
                  className="hover:text-white transition-colors"
                >
                  Ready to Wear Pret
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { category: 'Luxury Pret' })}
                  className="hover:text-white transition-colors"
                >
                  Luxury Handcrafted Pret
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { category: 'Formal Wear' })}
                  className="hover:text-white transition-colors"
                >
                  Formal &amp; Festive Chiffon
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { category: 'Bridal / Wedding Edit' })}
                  className="hover:text-white transition-colors"
                >
                  Bridal &amp; Wedding Edit
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { category: 'Zarmeen Modest' })}
                  className="hover:text-[#D6B57E] transition-colors font-medium"
                >
                  Zarmeen Modest (Abayas)
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h5 className="font-heading text-sm uppercase tracking-widest text-white mb-4 border-b border-stone-800 pb-2">
              Concierge
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => navigateTo('order-tracking')} className="hover:text-white transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('size-guide')} className="hover:text-white transition-colors">
                  Pakistani Size Guide
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shipping')} className="hover:text-white transition-colors">
                  Domestic &amp; COD Shipping
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('returns')} className="hover:text-white transition-colors">
                  Exchange &amp; Returns
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                  Our Heritage Story
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter / Circle */}
          <div>
            <h5 className="font-heading text-sm uppercase tracking-widest text-white mb-4 border-b border-stone-800 pb-2">
              Zarmeen Circle
            </h5>
            <p className="text-xs text-stone-400 mb-3 leading-relaxed">
              Subscribe for private previews of new lawn edits, festive couture drops, and 10% off your first order.
            </p>
            {subscribed ? (
              <div className="bg-[#8A1C24]/20 border border-[#8A1C24]/50 p-3 rounded-sm flex items-center gap-2 text-[#D6B57E] text-xs">
                <Check size={16} />
                <span>Welcome! Use code <strong>ZARMEEN10</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-stone-900 border border-stone-700 px-3 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#D6B57E] rounded-sm"
                />
                <button
                  type="submit"
                  className="w-full bg-[#8A1C24] hover:bg-[#A3232D] text-white py-2 text-xs uppercase tracking-widest font-medium transition-colors rounded-sm"
                >
                  Join The Circle
                </button>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-500">
              <span>Verified Pakistan Payment Channels:</span>
              <div className="flex flex-wrap gap-2 mt-2 text-stone-400 font-mono text-[10px]">
                <span className="bg-stone-900 border border-stone-800 px-2 py-0.5 rounded">CASH ON DELIVERY</span>
                <span className="bg-stone-900 border border-stone-800 px-2 py-0.5 rounded">MEEZAN BANK</span>
                <span className="bg-stone-900 border border-stone-800 px-2 py-0.5 rounded">VISA / MC</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
        <p>&copy; {new Date().getFullYear()} ZARMEEN Couture Private Ltd. All Rights Reserved.</p>
        <div className="flex items-center gap-6">
          <button onClick={() => navigateTo('privacy')} className="hover:text-stone-300">
            Privacy Policy
          </button>
          <button onClick={() => navigateTo('terms')} className="hover:text-stone-300">
            Terms of Service
          </button>
          <button onClick={() => navigateTo('contact')} className="hover:text-stone-300">
            Contact
          </button>
        </div>
      </div>
    </footer>
  );
};
