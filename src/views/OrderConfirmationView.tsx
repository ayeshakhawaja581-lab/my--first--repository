import React, { useState } from 'react';
import { useShop, formatPKR } from '../context/ShopContext';
import {
  CheckCircle,
  Printer,
  Download,
  Truck,
  ArrowRight,
  ShieldCheck,
  Building,
  MapPin,
  Calendar,
  CreditCard,
} from 'lucide-react';

export const OrderConfirmationView: React.FC = () => {
  const { orders, activeOrderNumber, navigateTo } = useShop();

  const order =
    orders.find((o) => o.orderNumber === activeOrderNumber) || orders[0] || null;

  const [showPrintInvoice, setShowPrintInvoice] = useState(false);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-heading text-2xl text-stone-800">No Recent Order Found</h2>
        <button
          onClick={() => navigateTo('home')}
          className="mt-4 bg-[#8A1C24] text-white px-6 py-2 text-xs uppercase tracking-wider"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Printable Invoice Container (Visible on screen and optimized for print) */}
      <div className="bg-white border border-stone-200/90 shadow-md p-6 sm:p-10 rounded-xs space-y-8">
        {/* Top Confirmation Header */}
        <div className="text-center space-y-2 border-b border-stone-200 pb-8 no-print">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle size={28} />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8A1C24] font-semibold block">
            Shukriya · Thank You
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl text-stone-950 uppercase tracking-wide">
            Your Zarmeen Order Has Been Placed
          </h1>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            An order confirmation along with your digital invoice has been registered. Our Lahore atelier concierge is preparing your parcel.
          </p>
        </div>

        {/* Invoice Brand Header (Shows on Screen & Print) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200 pb-6 gap-4">
          <div>
            <span className="font-heading text-3xl tracking-[0.2em] text-[#1C1A1A] block">
              ZARMEEN
            </span>
            <span className="text-[10px] tracking-[0.3em] text-[#8C7654] uppercase font-semibold block">
              Wear Your Heritage
            </span>
            <p className="text-[11px] text-stone-500 mt-1">
              14-C Gulberg III, M.M. Alam Road, Lahore, Pakistan · NTN: 8192044-7
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1 text-xs">
            <span className="font-mono text-sm font-bold text-stone-900 block">
              ORDER #{order.orderNumber}
            </span>
            <span className="text-stone-500 block">
              Invoice Date: {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <span className="inline-block bg-[#8A1C24]/10 text-[#8A1C24] font-semibold px-2.5 py-0.5 text-[11px] uppercase tracking-wider rounded-xs">
              Status: {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Customer & Shipping Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-stone-700 bg-[#FAF8F5] p-5 rounded-xs border border-stone-200/60">
          <div className="space-y-1.5">
            <h4 className="font-heading text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2">
              Billed &amp; Shipped To:
            </h4>
            <p className="font-semibold text-stone-900">{order.customer.fullName}</p>
            <p>{order.customer.streetAddress}, {order.customer.area}</p>
            <p>{order.customer.city}, {order.customer.province} - {order.customer.postalCode}</p>
            <p className="text-stone-500 pt-1">Phone: {order.customer.phone}</p>
            <p className="text-stone-500">Email: {order.customer.email}</p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-heading text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2">
              Payment &amp; Logistics:
            </h4>
            <p>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>
            <p>
              <strong>Payment Status:</strong>{' '}
              <span className={order.paymentStatus === 'Paid' ? 'text-emerald-700 font-semibold' : 'text-amber-800 font-semibold'}>
                {order.paymentStatus}
              </span>
            </p>
            <p>
              <strong>Logistics Partner:</strong> TCS Express / Leopards COD Domestic
            </p>
            <p>
              <strong>Estimated Arrival:</strong> 2 - 4 Business Days
            </p>
            {order.notes && (
              <p className="text-stone-500 italic pt-1">Note: "{order.notes}"</p>
            )}
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-800 uppercase tracking-wider text-[11px] text-stone-900">
                <th className="py-2.5">Garment Description</th>
                <th className="py-2.5">Specifications</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Unit Price</th>
                <th className="py-2.5 text-right">Total (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {order.items.map((item, idx) => (
                <tr key={idx} className="py-2">
                  <td className="py-3 pr-2">
                    <span className="font-semibold text-stone-900 block font-heading text-xs">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">SKU: {item.sku}</span>
                  </td>
                  <td className="py-3 text-stone-600">
                    {item.size} · {item.color} · {item.fabric}
                  </td>
                  <td className="py-3 text-center font-semibold text-stone-800">{item.quantity}</td>
                  <td className="py-3 text-right text-stone-600">{formatPKR(item.price)}</td>
                  <td className="py-3 text-right font-semibold text-stone-900">
                    {formatPKR(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing Summary */}
        <div className="border-t-2 border-stone-800 pt-4 flex flex-col items-end text-xs space-y-1.5">
          <div className="w-64 flex justify-between text-stone-600">
            <span>Subtotal:</span>
            <span className="font-semibold text-stone-900">{formatPKR(order.subtotal)}</span>
          </div>

          {order.discount > 0 && (
            <div className="w-64 flex justify-between text-emerald-800 font-semibold">
              <span>Coupon Discount ({order.couponCode || 'PROMO'}):</span>
              <span>-{formatPKR(order.discount)}</span>
            </div>
          )}

          <div className="w-64 flex justify-between text-stone-600">
            <span>Shipping Fee:</span>
            <span>{order.shippingFee === 0 ? 'FREE' : formatPKR(order.shippingFee)}</span>
          </div>

          <div className="w-64 flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
            <span>Grand Total:</span>
            <span className="text-[#8A1C24]">{formatPKR(order.grandTotal)}</span>
          </div>
        </div>

        {/* Pakistani COD Note */}
        <div className="p-4 bg-[#F4EFE6] border border-stone-200 text-xs text-stone-700 leading-relaxed">
          <p className="font-semibold text-stone-900 mb-0.5">Important Notice for Cash on Delivery:</p>
          <p>
            Please have the exact amount of <strong>{formatPKR(order.grandTotal)}</strong> ready for the courier courier representative. Parcels are securely sealed with Zarmeen tamper-proof holographic tape.
          </p>
        </div>

        {/* Invoice Action Buttons (Hidden on Print) */}
        <div className="pt-6 border-t border-stone-200 flex flex-wrap gap-4 justify-between items-center no-print">
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="bg-[#1C1A1A] hover:bg-stone-800 text-white px-5 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 rounded-xs transition-colors cursor-pointer"
            >
              <Printer size={15} />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-5 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 rounded-xs transition-colors cursor-pointer"
            >
              <Download size={15} />
              <span>Download PDF</span>
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigateTo('order-tracking', { orderNumber: order.orderNumber })}
              className="bg-[#8A1C24] hover:bg-[#A3232D] text-white px-5 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 rounded-xs transition-colors cursor-pointer"
            >
              <Truck size={15} />
              <span>Track Order Status</span>
            </button>

            <button
              onClick={() => navigateTo('shop')}
              className="border border-stone-300 hover:border-stone-800 text-stone-800 px-5 py-2.5 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
