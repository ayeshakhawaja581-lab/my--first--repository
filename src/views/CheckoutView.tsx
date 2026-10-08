import React, { useState } from 'react';
import { useShop, formatPKR } from '../context/ShopContext';
import { PAKISTANI_PROVINCES, PAKISTANI_CITIES } from '../data/initialData';
import { PakistaniProvince, PaymentMethod } from '../types';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building,
  CheckCircle,
  AlertCircle,
  Tag,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartGrandTotal,
    appliedCoupon,
    couponError,
    applyCouponCode,
    removeCoupon,
    customerUser,
    placeOrder,
    navigateTo,
  } = useShop();

  const defaultAddr = customerUser?.addresses.find((a) => a.isDefault) || customerUser?.addresses[0];

  const [fullName, setFullName] = useState(defaultAddr?.fullName || customerUser?.fullName || '');
  const [email, setEmail] = useState(customerUser?.email || '');
  const [phone, setPhone] = useState(defaultAddr?.phone || customerUser?.phone || '');
  const [streetAddress, setStreetAddress] = useState(defaultAddr?.streetAddress || '');
  const [area, setArea] = useState(defaultAddr?.area || '');
  const [city, setCity] = useState(defaultAddr?.city || 'Lahore');
  const [province, setProvince] = useState<PakistaniProvince>(
    (defaultAddr?.province as PakistaniProvince) || 'Punjab'
  );
  const [postalCode, setPostalCode] = useState(defaultAddr?.postalCode || '54000');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');

  // Coupon code state
  const [couponInput, setCouponInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-stone-200 mx-auto flex items-center justify-center text-stone-500">
          <ShoppingBag size={28} />
        </div>
        <h2 className="font-heading text-2xl text-stone-800">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Please select your favorite Pakistani articles before proceeding to checkout.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="bg-[#8A1C24] text-white px-6 py-2.5 text-xs uppercase tracking-widest font-semibold"
        >
          Explore Boutique
        </button>
      </div>
    );
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = applyCouponCode(couponInput);
    if (ok) {
      setCouponInput('');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName || !email || !phone || !streetAddress || !city || !province) {
      setFormError('Please fill in all required shipping and contact details.');
      return;
    }

    setIsSubmitting(true);

    try {
      const createdOrder = placeOrder({
        fullName,
        email,
        phone,
        streetAddress,
        area,
        city,
        province,
        postalCode,
        paymentMethod,
        notes,
      });

      if (createdOrder) {
        navigateTo('order-confirmation', { orderNumber: createdOrder.orderNumber });
      }
    } catch (err: any) {
      setFormError('An error occurred while creating your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Checkout Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-widest mb-8 border-b border-stone-200 pb-3">
        <button onClick={() => navigateTo('home')} className="hover:text-stone-900">
          Home
        </button>
        <span>/</span>
        <button onClick={() => navigateTo('shop')} className="hover:text-stone-900">
          Shop
        </button>
        <span>/</span>
        <span className="text-stone-900 font-semibold">Secure Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Form Column (7 cols) */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">
          {formError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. Contact Information */}
          <div className="bg-white border border-stone-200 p-6 rounded-xs space-y-4">
            <h3 className="font-heading text-base text-stone-900 uppercase tracking-wider font-semibold border-b border-stone-100 pb-3">
              1. Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ayesha Khawaja"
                  className="w-full bg-[#FAF8F5] border border-stone-300 px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#8A1C24]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                  Phone Number (For Courier Call) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300 1234567"
                  className="w-full bg-[#FAF8F5] border border-stone-300 px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#8A1C24]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                  Email Address (For Invoice &amp; Tracking) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ayesha@example.com"
                  className="w-full bg-[#FAF8F5] border border-stone-300 px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#8A1C24]"
                />
              </div>
            </div>
          </div>

          {/* 2. Domestic Pakistani Shipping Address */}
          <div className="bg-white border border-stone-200 p-6 rounded-xs space-y-4">
            <h3 className="font-heading text-base text-stone-900 uppercase tracking-wider font-semibold border-b border-stone-100 pb-3">
              2. Delivery Address (Pakistan)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                  House / Apartment / Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="House 42, Street 7, Block C"
                  className="w-full bg-[#FAF8F5] border border-stone-300 px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#8A1C24]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                    Area / Sector / Colony
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Gulberg III / DHA Phase 5"
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#8A1C24]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                    City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#8A1C24]"
                  >
                    {PAKISTANI_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                    Province / Territory *
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value as PakistaniProvince)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#8A1C24]"
                  >
                    {PAKISTANI_PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="54000"
                    className="w-full bg-[#FAF8F5] border border-stone-300 px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#8A1C24]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                  Special Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Call before delivery, landmark near mosque or commercial plaza..."
                  className="w-full bg-[#FAF8F5] border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#8A1C24]"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white border border-stone-200 p-6 rounded-xs space-y-4">
            <h3 className="font-heading text-base text-stone-900 uppercase tracking-wider font-semibold border-b border-stone-100 pb-3">
              3. Payment Method
            </h3>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label
                className={`flex items-start gap-3 p-4 border rounded-xs cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-[#8A1C24] bg-[#8A1C24]/5 ring-1 ring-[#8A1C24]'
                    : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                  className="mt-0.5 accent-[#8A1C24]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-sm font-semibold text-stone-900">
                      Cash on Delivery (COD)
                    </span>
                    <Truck size={16} className="text-[#8A1C24]" />
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Pay in cash directly to the courier rider upon receiving your parcel at your doorstep.
                  </p>
                </div>
              </label>

              {/* Direct Bank Transfer */}
              <label
                className={`flex items-start gap-3 p-4 border rounded-xs cursor-pointer transition-all ${
                  paymentMethod === 'Bank Transfer'
                    ? 'border-[#8A1C24] bg-[#8A1C24]/5 ring-1 ring-[#8A1C24]'
                    : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === 'Bank Transfer'}
                  onChange={() => setPaymentMethod('Bank Transfer')}
                  className="mt-0.5 accent-[#8A1C24]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-sm font-semibold text-stone-900">
                      Direct Bank Transfer / IBFT
                    </span>
                    <Building size={16} className="text-[#8A1C24]" />
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Transfer funds via Meezan Bank, HBL, or Raast. Order verified upon sharing transaction slip.
                  </p>

                  {paymentMethod === 'Bank Transfer' && (
                    <div className="mt-3 p-3 bg-white border border-stone-200 text-xs text-stone-700 space-y-1">
                      <p><strong>Bank:</strong> Meezan Bank Limited (Islamic)</p>
                      <p><strong>Account Title:</strong> ZARMEEN LUXURY COUTURE</p>
                      <p><strong>IBAN:</strong> PK62 MEZN 0002 1801 0293 8812</p>
                      <p className="text-[11px] text-stone-500 pt-1">
                        WhatsApp receipt with Order ID to +92 300 8452199
                      </p>
                    </div>
                  )}
                </div>
              </label>

              {/* Online Debit/Credit Card */}
              <label
                className={`flex items-start gap-3 p-4 border rounded-xs cursor-pointer transition-all ${
                  paymentMethod === 'Online Payment'
                    ? 'border-[#8A1C24] bg-[#8A1C24]/5 ring-1 ring-[#8A1C24]'
                    : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === 'Online Payment'}
                  onChange={() => setPaymentMethod('Online Payment')}
                  className="mt-0.5 accent-[#8A1C24]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-sm font-semibold text-stone-900">
                      Credit / Debit Card (Visa, Mastercard, PayPak)
                    </span>
                    <CreditCard size={16} className="text-[#8A1C24]" />
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Encrypted payment via 3D-Secure Pakistani banking gateway.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Order Button (Mobile / Desktop) */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#8A1C24] hover:bg-[#A3232D] text-white py-4 px-6 text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2 shadow-lg transition-all rounded-xs cursor-pointer"
          >
            <span>Confirm &amp; Place Order ({formatPKR(cartGrandTotal)})</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Right Order Summary Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-stone-200 p-6 rounded-xs space-y-5 sticky top-28">
            <h3 className="font-heading text-base text-stone-900 uppercase tracking-wider font-semibold border-b border-stone-200 pb-3">
              Order Summary ({cart.length} Articles)
            </h3>

            {/* Itemized Mini List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-14 h-18 object-cover object-top bg-[#F0EDE6] shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-heading text-stone-900 line-clamp-1">{item.product.name}</h4>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {item.size} · {item.color} · Qty: {item.quantity}
                      </div>
                    </div>
                    <span className="font-semibold text-stone-900">
                      {formatPKR(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="border-t border-b border-stone-200 py-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xs text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag size={14} className="text-emerald-700" />
                    <span>
                      Coupon <strong>{appliedCoupon.code}</strong> applied (-{formatPKR(discountAmount)})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-500 hover:text-stone-900 text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon Code (e.g. ZARMEEN10)"
                      className="flex-1 bg-[#FAF8F5] border border-stone-300 px-3 py-2 text-xs uppercase tracking-wider text-stone-900 focus:outline-none focus:border-[#8A1C24]"
                    />
                    <button
                      type="submit"
                      className="bg-[#1C1A1A] hover:bg-[#8A1C24] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">{formatPKR(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Promotional Discount</span>
                  <span>-{formatPKR(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Nationwide Shipping</span>
                <span className="font-semibold text-stone-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700">COMPLIMENTARY</span>
                  ) : (
                    formatPKR(shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
                <span>Grand Total (PKR)</span>
                <span className="text-[#8A1C24]">{formatPKR(cartGrandTotal)}</span>
              </div>
            </div>

            <div className="p-3 bg-[#F2EFE9] rounded-xs text-[11px] text-stone-600 space-y-1">
              <p className="flex items-center gap-1.5 font-medium text-stone-800">
                <Truck size={13} className="text-[#8A1C24]" />
                Estimated Dispatch: 24 - 48 Hours
              </p>
              <p>Delivery via TCS / Leopards courier service across Pakistan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
