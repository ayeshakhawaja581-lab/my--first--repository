import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Truck,
  RefreshCw,
  ShieldAlert,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

interface InformationalViewProps {
  pageType: 'about' | 'contact' | 'size-guide' | 'shipping' | 'returns' | 'faq' | 'privacy' | 'terms';
}

export const InformationalViews: React.FC<InformationalViewProps> = ({ pageType }) => {
  const { settings, navigateTo } = useShop();

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do you offer Cash on Delivery across all cities in Pakistan?',
      a: 'Yes, Zarmeen offers verified Cash on Delivery (COD) services to over 150 cities and towns across Pakistan via our logistics partners TCS, Leopards Courier, and Call Courier. For orders exceeding PKR 5,000, express delivery is completely complimentary.',
    },
    {
      q: 'What is the standard delivery timeframe for stitched vs. unstitched articles?',
      a: 'Unstitched articles and Ready-to-Wear pret in stock are dispatched within 24 to 48 hours, arriving within 2 to 4 working days for major cities (Lahore, Karachi, Islamabad, Rawalpindi) and 3 to 5 days nationwide. Custom bridal or couture pishwas require 2 to 4 weeks handcrafted atelier time.',
    },
    {
      q: 'How do I know what size to order for Pakistani Ready-to-Wear?',
      a: 'Our sizes follow standardized Pakistani designer garment measurements from XS to XXL. Please refer to our detailed Size Guide which lists chest/bust, shoulder, waist, and shirt length in both inches and centimeters.',
    },
    {
      q: 'What is your exchange and return policy?',
      a: 'We offer an easy 14-day exchange policy for unstitched suits and standard ready-to-wear garments, provided items remain unworn, unwashed, with all original luxury packaging and price tags intact.',
    },
    {
      q: 'Are your fabrics 100% pure Pakistani Pima lawn and raw silk?',
      a: 'Without exception. Zarmeen takes immense pride in genuine 80s count combed Pima lawn, handwoven raw silk, pure organza, and artisanal zardozi hand-embroidery. We guarantee 100% fabric authenticity.',
    },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactName('');
      setContactPhone('');
      setContactMessage('');
    }, 3500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* 1. ABOUT ZARMEEN */}
      {pageType === 'about' && (
        <div className="space-y-8">
          <div className="text-center space-y-2 border-b border-stone-200 pb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8A1C24] font-semibold">
              The Heritage Atelier
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl text-stone-900 uppercase tracking-wide">
              About Zarmeen
            </h1>
            <p className="font-editorial text-xl italic text-stone-600">
              "Wear Your Heritage."
            </p>
          </div>

          <div className="aspect-[16/9] overflow-hidden bg-stone-900 shadow-md">
            <img
              src="/src/assets/images/zarmeen_hero_1791436571248.jpg"
              alt="The House of Zarmeen"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="prose prose-stone text-xs sm:text-sm leading-relaxed text-stone-700 space-y-4">
            <p>
              Founded in Lahore, <strong>Zarmeen</strong> was conceived from an unwavering reverence for centuries-old South Asian artisanal heritage and a modern vision for contemporary Pakistani women's luxury fashion.
            </p>
            <p>
              From the master looms of Multan and Bahawalpur to our hand-embroidery ateliers in Old Lahore, every Zarmeen piece brings together heirloom needlecraft—zardozi, tilla, marori, resham jaal, and delicate French knots—with fluid, modest silhouettes tailored for the contemporary global lifestyle.
            </p>
            <p>
              Whether it is our signature summer Pima lawn adorned with scalloped organza borders, hand-embellished raw silk pret, or the regal Zarmeen Modest abaya collection, our dedication remains singular: creating attire that instills confidence, celebrates heritage, and endures across generations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-stone-200 text-center">
            <div className="p-4 bg-white border border-stone-200">
              <h4 className="font-heading text-2xl text-[#8A1C24]">100%</h4>
              <p className="text-xs text-stone-600 uppercase tracking-wider mt-1">Authentic Pure Fabrics</p>
            </div>
            <div className="p-4 bg-white border border-stone-200">
              <h4 className="font-heading text-2xl text-[#8A1C24]">150+</h4>
              <p className="text-xs text-stone-600 uppercase tracking-wider mt-1">Cities Served Across Pakistan</p>
            </div>
            <div className="p-4 bg-white border border-stone-200">
              <h4 className="font-heading text-2xl text-[#8A1C24]">25,000+</h4>
              <p className="text-xs text-stone-600 uppercase tracking-wider mt-1">Heirloom Creations Crafted</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONTACT & FLAGSHIP BOUTIQUES */}
      {pageType === 'contact' && (
        <div className="space-y-8">
          <div className="text-center space-y-2 border-b border-stone-200 pb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8A1C24] font-semibold">
              Concierge &amp; Flagship Studios
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl text-stone-900 uppercase tracking-wide">
              Connect With Zarmeen
            </h1>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Our couture consultants are at your service for sizing guidance, bridal appointments, and order assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white border border-stone-200 p-6 rounded-xs space-y-4">
              <h3 className="font-heading text-base text-stone-900 font-semibold uppercase tracking-wider">
                Send an Inquiry
              </h3>
              {contactSent ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle size={16} />
                    <span>Inquiry Received</span>
                  </div>
                  <p>Our concierge team will contact you via WhatsApp or phone within 2 business hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Fatima Ali"
                      className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5 focus:outline-none focus:border-[#8A1C24]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5 focus:outline-none focus:border-[#8A1C24]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Message / Bridal Inquiry *</label>
                    <textarea
                      rows={4}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Provide order number, bespoke measurements, or boutique styling inquiry..."
                      className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5 focus:outline-none focus:border-[#8A1C24]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#8A1C24] hover:bg-[#A3232D] text-white py-2.5 uppercase tracking-widest text-xs font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send size={13} />
                    <span>Send to Concierge</span>
                  </button>
                </form>
              )}
            </div>

            {/* Boutiques */}
            <div className="space-y-4 text-xs text-stone-700">
              <div className="bg-[#FAF8F5] border border-stone-200 p-5 rounded-xs space-y-2">
                <div className="flex items-center gap-2 text-[#8A1C24] font-semibold uppercase tracking-wider text-xs">
                  <MapPin size={16} />
                  <span>Lahore Flagship Studio</span>
                </div>
                <p className="font-medium text-stone-900">{settings.flagshipAddress}</p>
                <p className="text-stone-500">Timings: Mon - Sat: 11:00 AM - 10:00 PM | Sun: 2:00 PM - 10:00 PM</p>
                <p className="text-stone-500">Phone: {settings.supportPhone}</p>
              </div>

              <div className="bg-[#FAF8F5] border border-stone-200 p-5 rounded-xs space-y-2">
                <div className="flex items-center gap-2 text-[#8A1C24] font-semibold uppercase tracking-wider text-xs">
                  <MapPin size={16} />
                  <span>Islamabad Couture Lounge</span>
                </div>
                <p className="font-medium text-stone-900">Shop 4, Beverly Centre, Blue Area / F-6, Islamabad</p>
                <p className="text-stone-500">Timings: 12:00 PM - 9:00 PM</p>
                <p className="text-stone-500">Phone: +92 51 289 4421</p>
              </div>

              <div className="bg-[#FAF8F5] border border-stone-200 p-5 rounded-xs space-y-2">
                <div className="flex items-center gap-2 text-[#8A1C24] font-semibold uppercase tracking-wider text-xs">
                  <MapPin size={16} />
                  <span>Karachi Boutique</span>
                </div>
                <p className="font-medium text-stone-900">Plot 12-C, 10th Commercial Street, Phase V DHA, Karachi</p>
                <p className="text-stone-500">Phone: +92 21 3587 9011</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SHIPPING POLICY */}
      {pageType === 'shipping' && (
        <div className="space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div className="text-center space-y-2 border-b border-stone-200 pb-6">
            <h1 className="font-heading text-3xl sm:text-4xl text-stone-900 uppercase tracking-wide">
              Shipping &amp; Delivery Policy
            </h1>
          </div>
          <div className="space-y-4 bg-white p-6 border border-stone-200">
            <h3 className="font-heading text-base font-semibold text-stone-900 uppercase">
              Domestic Delivery in Pakistan
            </h3>
            <p>
              We provide express doorstep delivery across Pakistan utilizing established logistics partners: TCS, Leopards Courier, and Call Courier.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Complimentary Delivery:</strong> Applicable on all domestic orders above PKR 5,000.</li>
              <li><strong>Standard Delivery Fee:</strong> Flat PKR 350 for orders under PKR 5,000.</li>
              <li><strong>Major Cities (Lahore, Karachi, Islamabad, Rawalpindi):</strong> 2 to 4 business days.</li>
              <li><strong>Other Cities &amp; Regions:</strong> 3 to 6 business days.</li>
              <li><strong>Cash on Delivery:</strong> Available nationwide with no extra surcharge.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 4. RETURNS & EXCHANGE */}
      {pageType === 'returns' && (
        <div className="space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div className="text-center space-y-2 border-b border-stone-200 pb-6">
            <h1 className="font-heading text-3xl sm:text-4xl text-stone-900 uppercase tracking-wide">
              Exchange &amp; Returns Policy
            </h1>
          </div>
          <div className="bg-white p-6 border border-stone-200 space-y-4">
            <h3 className="font-heading text-base font-semibold text-stone-900 uppercase">
              14-Day Hassle-Free Exchange
            </h3>
            <p>
              At Zarmeen, your satisfaction is paramount. If you are not completely content with the sizing or fit of your garment, you may request an exchange within 14 days of delivery.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Articles must be unworn, undamaged, and in original luxury packaging with swing tags intact.</li>
              <li>Unstitched fabric that has already been cut or tailored cannot be returned.</li>
              <li>Sale or clearance items are eligible for size exchange only, subject to stock availability.</li>
              <li>To initiate an exchange, message our WhatsApp support (+92 300 8452199) with your Order ID.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 5. FAQ */}
      {pageType === 'faq' && (
        <div className="space-y-6">
          <div className="text-center space-y-2 border-b border-stone-200 pb-6">
            <h1 className="font-heading text-3xl sm:text-4xl text-stone-900 uppercase tracking-wide">
              Frequently Asked Questions
            </h1>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-stone-200 rounded-xs overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 flex justify-between items-center text-xs sm:text-sm font-semibold text-stone-900 hover:text-[#8A1C24] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 shrink-0 ml-2 ${
                      openFaq === idx ? 'rotate-180 text-[#8A1C24]' : 'text-stone-400'
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. PRIVACY & TERMS */}
      {(pageType === 'privacy' || pageType === 'terms') && (
        <div className="space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed bg-white p-6 border border-stone-200">
          <h1 className="font-heading text-2xl text-stone-900 uppercase tracking-wide">
            {pageType === 'privacy' ? 'Privacy & Data Protection Policy' : 'Terms & Conditions of Service'}
          </h1>
          <p>
            Welcome to Zarmeen Couture Private Limited (registered in Pakistan). We respect and protect the privacy of all patrons who visit and shop on our digital boutique.
          </p>
          <p>
            Your personal information (name, delivery address, contact details) is strictly utilized to process, verify, and fulfill orders, generate invoices, and communicate shipping tracking alerts. We do not sell or lease customer records to external third-party advertisers.
          </p>
        </div>
      )}
    </div>
  );
};
