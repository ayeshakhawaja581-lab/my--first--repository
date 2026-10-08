import React, { useState } from 'react';
import { useShop, formatPKR } from '../context/ShopContext';
import { PAKISTANI_PROVINCES, PAKISTANI_CITIES } from '../data/initialData';
import { PakistaniProvince, Address } from '../types';
import {
  User,
  Package,
  Heart,
  MapPin,
  Plus,
  Trash2,
  ExternalLink,
  ShoppingBag,
  Check,
} from 'lucide-react';

export const CustomerAccountView: React.FC = () => {
  const {
    customerUser,
    orders,
    wishlist,
    products,
    addToCart,
    toggleWishlist,
    addCustomerAddress,
    deleteCustomerAddress,
    navigateTo,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist'>('orders');
  const [showAddressModal, setShowAddressModal] = useState(false);

  // New Address form state
  const [newFullName, setNewFullName] = useState(customerUser?.fullName || '');
  const [newPhone, setNewPhone] = useState(customerUser?.phone || '');
  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newCity, setNewCity] = useState('Lahore');
  const [newProvince, setNewProvince] = useState<PakistaniProvince>('Punjab');
  const [newPostal, setNewPostal] = useState('54000');
  const [newIsDefault, setNewIsDefault] = useState(false);

  const customerOrders = orders.filter(
    (o) => o.customer.email.toLowerCase() === (customerUser?.email || '').toLowerCase()
  );

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity) return;

    addCustomerAddress({
      fullName: newFullName,
      phone: newPhone,
      streetAddress: newStreet,
      area: newArea,
      city: newCity,
      province: newProvince,
      postalCode: newPostal,
      isDefault: newIsDefault,
    });

    setShowAddressModal(false);
    setNewStreet('');
    setNewArea('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Account Hero Bar */}
      <div className="bg-[#1C1A1A] text-white p-6 sm:p-8 rounded-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#8A1C24] flex items-center justify-center font-heading text-xl text-white">
            {customerUser?.fullName?.charAt(0) || 'A'}
          </div>
          <div>
            <span className="text-[10px] tracking-widest uppercase text-[#D6B57E] font-medium block">
              Zarmeen Privileged Patron
            </span>
            <h1 className="font-heading text-xl sm:text-2xl text-white">
              {customerUser?.fullName || 'Valued Patron'}
            </h1>
            <p className="text-xs text-stone-400">
              {customerUser?.email} · {customerUser?.phone}
            </p>
          </div>
        </div>

        <div className="text-xs text-stone-400 bg-white/5 border border-white/10 px-4 py-2 rounded-xs">
          <span>Member Since: <strong>{customerUser?.joinedDate || '2026'}</strong></span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-200 mb-8 space-x-8 text-xs tracking-widest uppercase font-semibold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center gap-2 transition-colors cursor-pointer border-b-2 ${
            activeTab === 'orders'
              ? 'border-[#8A1C24] text-[#8A1C24]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Package size={16} />
          <span>Order History ({customerOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 flex items-center gap-2 transition-colors cursor-pointer border-b-2 ${
            activeTab === 'addresses'
              ? 'border-[#8A1C24] text-[#8A1C24]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <MapPin size={16} />
          <span>Delivery Addresses ({customerUser?.addresses.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 flex items-center gap-2 transition-colors cursor-pointer border-b-2 ${
            activeTab === 'wishlist'
              ? 'border-[#8A1C24] text-[#8A1C24]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Heart size={16} />
          <span>My Wishlist ({wishlist.length})</span>
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {customerOrders.length === 0 ? (
            <div className="bg-white border border-stone-200 p-12 text-center text-xs text-stone-500 space-y-3">
              <Package size={32} className="mx-auto text-stone-300" />
              <p className="font-heading text-lg text-stone-800">No Orders Placed Yet</p>
              <p>Explore our seasonal lawn, luxury pret, and bridal wear collections.</p>
              <button
                onClick={() => navigateTo('shop')}
                className="bg-[#8A1C24] text-white px-5 py-2 uppercase tracking-wider font-semibold"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            customerOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white border border-stone-200 p-6 rounded-xs space-y-4 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-stone-100 gap-2">
                  <div>
                    <span className="font-mono font-bold text-sm text-stone-900">
                      Order #{ord.orderNumber}
                    </span>
                    <span className="text-stone-400 text-xs ml-3">
                      {new Date(ord.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="bg-[#8A1C24]/10 text-[#8A1C24] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-xs">
                      {ord.orderStatus}
                    </span>
                    <button
                      onClick={() => navigateTo('order-tracking', { orderNumber: ord.orderNumber })}
                      className="text-xs text-[#8A1C24] hover:underline flex items-center gap-1 font-medium"
                    >
                      Track Shipment <ExternalLink size={12} />
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 text-xs">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-20 object-cover object-top bg-[#F2EFE9] shrink-0"
                      />
                      <div className="flex-1 flex justify-between items-center">
                        <div>
                          <h4 className="font-heading text-sm text-stone-900">{item.name}</h4>
                          <p className="text-stone-500 text-[11px] mt-0.5">
                            Size: {item.size} · Color: {item.color} · Fabric: {item.fabric}
                          </p>
                          <p className="text-stone-400 text-[11px]">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-semibold text-stone-900 text-sm">
                          {formatPKR(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-stone-100 text-xs">
                  <div>
                    <span className="text-stone-500">Payment: </span>
                    <strong className="text-stone-800">{ord.paymentMethod}</strong> ({ord.paymentStatus})
                  </div>
                  <div className="text-right">
                    <span className="text-stone-500 mr-2">Grand Total:</span>
                    <span className="font-bold text-sm text-[#8A1C24]">{formatPKR(ord.grandTotal)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-lg text-stone-900">Saved Pakistani Addresses</h3>
            <button
              onClick={() => setShowAddressModal(true)}
              className="bg-[#1C1A1A] hover:bg-[#8A1C24] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 rounded-xs transition-colors cursor-pointer"
            >
              <Plus size={14} />
              Add New Address
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {customerUser?.addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white border border-stone-200 p-5 rounded-xs space-y-2 relative"
              >
                {addr.isDefault && (
                  <span className="absolute top-4 right-4 bg-[#8A1C24] text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs">
                    Default
                  </span>
                )}
                <h4 className="font-heading text-sm font-semibold text-stone-900">{addr.fullName}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {addr.streetAddress}, {addr.area}
                </p>
                <p className="text-xs text-stone-600">
                  {addr.city}, {addr.province} - {addr.postalCode}
                </p>
                <p className="text-xs text-stone-500 pt-1">Phone: {addr.phone}</p>

                <div className="pt-3 border-t border-stone-100 flex justify-end">
                  <button
                    onClick={() => deleteCustomerAddress(addr.id)}
                    className="text-stone-400 hover:text-red-700 text-xs flex items-center gap-1"
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistProducts.length === 0 ? (
            <div className="bg-white border border-stone-200 p-12 text-center text-xs text-stone-500 space-y-3">
              <Heart size={32} className="mx-auto text-stone-300" />
              <p className="font-heading text-lg text-stone-800">Your Wishlist is Empty</p>
              <p>Save pieces you love to revisit or purchase later.</p>
              <button
                onClick={() => navigateTo('shop')}
                className="bg-[#8A1C24] text-white px-5 py-2 uppercase tracking-wider font-semibold"
              >
                Discover Collections
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {wishlistProducts.map((p) => {
                const price = p.salePrice ?? p.price;
                return (
                  <div key={p.id} className="bg-white border border-stone-200 p-3 rounded-xs flex flex-col">
                    <div className="aspect-[3/4] overflow-hidden bg-[#F2EFE9] mb-3 relative">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover object-top" />
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 text-stone-600 hover:text-[#8A1C24] rounded-full"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <h4 className="font-heading text-xs text-stone-900 font-semibold line-clamp-1">{p.name}</h4>
                    <span className="text-[11px] text-stone-500">{p.fabric} · {p.pieces}</span>
                    <span className="font-semibold text-xs text-stone-900 my-1">{formatPKR(price)}</span>

                    <button
                      onClick={() => {
                        addToCart(p, p.sizes[0] || 'Unstitched', p.colors[0]?.name || 'Standard');
                        toggleWishlist(p.id);
                      }}
                      className="mt-auto w-full bg-[#1C1A1A] hover:bg-[#8A1C24] text-white py-2 text-[11px] uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag size={13} />
                      Move to Bag
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Address Creation Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowAddressModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-[#FAF8F5] p-6 rounded-xs shadow-2xl border border-stone-200">
              <h3 className="font-heading text-lg text-stone-900 uppercase tracking-wider mb-4">
                Add Pakistani Delivery Address
              </h3>
              <form onSubmit={handleCreateAddress} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full bg-white border border-stone-300 p-2.5 focus:outline-none focus:border-[#8A1C24]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Mobile Phone (Pakistan) *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full bg-white border border-stone-300 p-2.5 focus:outline-none focus:border-[#8A1C24]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">House &amp; Street Address *</label>
                  <input
                    type="text"
                    required
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    placeholder="House #, Street #"
                    className="w-full bg-white border border-stone-300 p-2.5 focus:outline-none focus:border-[#8A1C24]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Area / Sector</label>
                    <input
                      type="text"
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                      placeholder="e.g. F-8/3"
                      className="w-full bg-white border border-stone-300 p-2.5 focus:outline-none focus:border-[#8A1C24]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">City *</label>
                    <select
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full bg-white border border-stone-300 p-2.5 focus:outline-none focus:border-[#8A1C24]"
                    >
                      {PAKISTANI_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Province *</label>
                    <select
                      value={newProvince}
                      onChange={(e) => setNewProvince(e.target.value as PakistaniProvince)}
                      className="w-full bg-white border border-stone-300 p-2.5 focus:outline-none focus:border-[#8A1C24]"
                    >
                      {PAKISTANI_PROVINCES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={newPostal}
                      onChange={(e) => setNewPostal(e.target.value)}
                      className="w-full bg-white border border-stone-300 p-2.5 focus:outline-none focus:border-[#8A1C24]"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={newIsDefault}
                    onChange={(e) => setNewIsDefault(e.target.checked)}
                    className="accent-[#8A1C24]"
                  />
                  <span>Set as default shipping address</span>
                </label>

                <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#8A1C24] text-white font-semibold uppercase tracking-wider"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
