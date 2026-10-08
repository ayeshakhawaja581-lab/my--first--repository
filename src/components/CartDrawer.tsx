import React from 'react';
import { useShop, formatPKR } from '../context/ShopContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    cartSubtotal,
    shippingFee,
    cartGrandTotal,
    settings,
    updateCartQuantity,
    removeFromCart,
    navigateTo,
  } = useShop();

  if (!isOpen) return null;

  const freeShippingThreshold = settings.freeShippingThreshold || 5000;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleCheckoutClick = () => {
    onClose();
    navigateTo('checkout');
  };

  const handleShopMoreClick = () => {
    onClose();
    navigateTo('shop');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#8A1C24]" />
              <h2 className="font-heading text-lg tracking-wider text-stone-900 uppercase">
                Shopping Bag ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Close Bag"
            >
              <X size={20} />
            </button>
          </div>

          {/* Complimentary Shipping Progress */}
          <div className="bg-[#F4EFE6] px-5 py-3 border-b border-stone-200 text-xs">
            {amountToFreeShipping > 0 ? (
              <p className="text-stone-700">
                Add <span className="font-bold text-[#8A1C24]">{formatPKR(amountToFreeShipping)}</span> more for{' '}
                <span className="font-semibold text-stone-900">Complimentary Express Shipping</span> across Pakistan!
              </p>
            ) : (
              <p className="text-emerald-800 font-medium flex items-center gap-1.5">
                <Truck size={14} className="text-emerald-700" />
                You've unlocked <strong>Complimentary Express Delivery</strong> across Pakistan!
              </p>
            )}
            <div className="w-full bg-stone-300 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#8A1C24] h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-stone-500">
                <div className="w-16 h-16 rounded-full bg-stone-200/70 flex items-center justify-center text-stone-400">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <h3 className="font-heading text-base text-stone-800">Your Shopping Bag is Empty</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Discover our new arrivals, handcrafted luxury pret, and unstitched lawn collections.
                  </p>
                </div>
                <button
                  onClick={handleShopMoreClick}
                  className="bg-[#8A1C24] hover:bg-[#A3232D] text-white text-xs tracking-widest uppercase font-semibold py-2.5 px-6 rounded-sm transition-colors cursor-pointer"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white border border-stone-200/80 rounded-xs shadow-2xs"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0] || '/src/assets/images/zarmeen_hero_1791436571248.jpg'}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover object-top bg-[#F0EDE6] shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-heading text-xs text-stone-900 leading-snug line-clamp-1 pr-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-[#8A1C24] transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="text-[11px] text-stone-500 mt-0.5 space-x-2">
                        <span>Size: <strong>{item.size}</strong></span>
                        <span>·</span>
                        <span>Color: <strong>{item.color}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                      {/* Qty Counter */}
                      <div className="flex items-center border border-stone-200 bg-stone-50 rounded-xs">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-200"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-200"
                        >
                          +
                        </button>
                      </div>

                      {/* Total */}
                      <span className="text-xs font-semibold text-stone-900">
                        {formatPKR(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-stone-200 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">{formatPKR(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-stone-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-semibold">FREE (Over PKR {freeShippingThreshold.toLocaleString()})</span>
                    ) : (
                      formatPKR(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Estimated Total</span>
                  <span className="text-[#8A1C24] font-bold">{formatPKR(cartGrandTotal)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full bg-[#8A1C24] hover:bg-[#A3232D] text-white py-3 px-4 text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2 transition-colors shadow-md rounded-xs cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={15} />
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-[#8A1C24]" />
                  Secure Pakistani Checkout
                </span>
                <span>·</span>
                <span>Cash on Delivery</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
