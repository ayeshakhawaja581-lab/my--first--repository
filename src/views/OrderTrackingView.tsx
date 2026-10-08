import React, { useState, useEffect } from 'react';
import { useShop, formatPKR } from '../context/ShopContext';
import { OrderStatus } from '../types';
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  AlertCircle,
  XCircle,
  FileText,
  Phone,
} from 'lucide-react';

interface OrderTrackingViewProps {
  initialOrderNumber?: string | null;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ initialOrderNumber }) => {
  const { orders, trackOrder, activeOrderNumber, navigateTo } = useShop();

  const [searchCode, setSearchCode] = useState(initialOrderNumber || activeOrderNumber || 'ZRM-2026-8942');
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  useEffect(() => {
    if (searchCode) {
      const match = trackOrder(searchCode);
      if (match) {
        setCurrentOrder(match);
        setErrorNotice(null);
      }
    }
  }, [searchCode, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    const match = trackOrder(searchCode);
    if (match) {
      setCurrentOrder(match);
      setErrorNotice(null);
    } else {
      setErrorNotice(`No order found matching "${searchCode}". Please check your order ID or email.`);
      setCurrentOrder(null);
    }
  };

  const allTimelineSteps: OrderStatus[] = [
    'Order Placed',
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  const getStepIndex = (status: OrderStatus) => {
    return allTimelineSteps.indexOf(status);
  };

  const isCancelled = currentOrder?.orderStatus === 'Cancelled';
  const isReturned = currentOrder?.orderStatus === 'Returned';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      {/* Header & Search Bar */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8A1C24] font-semibold">
          Nationwide Dispatch Tracking
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl text-[#1C1A1A] uppercase tracking-wide">
          Track Your Zarmeen Parcel
        </h1>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Enter your Zarmeen Order Reference (e.g. ZRM-2026-8942) to monitor live courier progress.
        </p>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2 pt-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="e.g. ZRM-2026-8942"
              className="w-full bg-white border border-stone-300 pl-9 pr-3 py-2.5 text-xs text-stone-900 uppercase tracking-wider focus:outline-none focus:border-[#8A1C24] rounded-xs"
            />
          </div>
          <button
            type="submit"
            className="bg-[#8A1C24] hover:bg-[#A3232D] text-white px-5 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
          >
            Track
          </button>
        </form>
      </div>

      {errorNotice && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 max-w-md mx-auto rounded-xs">
          <AlertCircle size={16} />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Tracking Result View */}
      {currentOrder && (
        <div className="bg-white border border-stone-200/90 shadow-md p-6 sm:p-10 rounded-xs space-y-8">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200 pb-5 gap-3">
            <div>
              <span className="text-[10px] tracking-widest text-[#8A1C24] uppercase font-bold">
                Live Shipment Status
              </span>
              <h2 className="font-heading text-xl sm:text-2xl text-stone-900 font-semibold">
                Order #{currentOrder.orderNumber}
              </h2>
              <span className="text-xs text-stone-500">
                Placed on {new Date(currentOrder.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-xs ${
                  isCancelled
                    ? 'bg-red-100 text-red-800'
                    : isReturned
                    ? 'bg-amber-100 text-amber-800'
                    : currentOrder.orderStatus === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-[#8A1C24]/10 text-[#8A1C24]'
                }`}
              >
                {currentOrder.orderStatus}
              </span>

              <button
                onClick={() => navigateTo('order-confirmation', { orderNumber: currentOrder.orderNumber })}
                className="text-xs text-stone-600 hover:text-stone-900 border border-stone-300 px-3 py-1 rounded-xs flex items-center gap-1.5"
              >
                <FileText size={13} />
                <span>Invoice</span>
              </button>
            </div>
          </div>

          {/* Cancellation Warning if applicable */}
          {isCancelled && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 rounded-xs">
              <XCircle size={18} />
              <span>This order has been cancelled. If payment was made, your refund will be processed within 5-7 bank days.</span>
            </div>
          )}

          {/* Step Timeline Graphic */}
          {!isCancelled && (
            <div className="py-4">
              <div className="relative">
                {/* Desktop Horizontal Stepper */}
                <div className="hidden md:flex justify-between items-center relative z-10">
                  {allTimelineSteps.map((step, idx) => {
                    const currentIndex = getStepIndex(currentOrder.orderStatus);
                    const isDone = currentIndex >= idx;
                    const isCurrent = currentIndex === idx;

                    return (
                      <div key={step} className="flex flex-col items-center text-center max-w-[90px]">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-[#8A1C24] text-white shadow-sm'
                              : 'bg-stone-100 border-2 border-stone-300 text-stone-400'
                          } ${isCurrent ? 'ring-4 ring-[#8A1C24]/20 scale-110' : ''}`}
                        >
                          {isDone ? <CheckCircle2 size={16} /> : <span className="text-xs">{idx + 1}</span>}
                        </div>
                        <span
                          className={`text-[10px] tracking-wider uppercase font-semibold mt-2 ${
                            isDone ? 'text-stone-900' : 'text-stone-400'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Connecting bar for desktop */}
                <div className="hidden md:block absolute top-4.5 inset-x-8 h-0.5 bg-stone-200 -z-0">
                  <div
                    className="h-full bg-[#8A1C24] transition-all duration-500"
                    style={{
                      width: `${(Math.max(0, getStepIndex(currentOrder.orderStatus)) / (allTimelineSteps.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                {/* Mobile Vertical Stepper */}
                <div className="md:hidden space-y-4">
                  {allTimelineSteps.map((step, idx) => {
                    const currentIndex = getStepIndex(currentOrder.orderStatus);
                    const isDone = currentIndex >= idx;
                    const isCurrent = currentIndex === idx;

                    return (
                      <div key={step} className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                            isDone ? 'bg-[#8A1C24] text-white' : 'bg-stone-200 text-stone-400'
                          }`}
                        >
                          {isDone ? <CheckCircle2 size={14} /> : <span className="text-xs">{idx + 1}</span>}
                        </div>
                        <span
                          className={`text-xs uppercase tracking-wider font-medium ${
                            isDone ? 'text-stone-900 font-semibold' : 'text-stone-400'
                          }`}
                        >
                          {step}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-[#8A1C24]/10 text-[#8A1C24] px-2 py-0.5 font-bold uppercase rounded-xs">
                            Current
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Activity Logs from Database */}
          <div className="border-t border-stone-200 pt-6">
            <h4 className="font-heading text-sm text-stone-900 uppercase tracking-wider font-semibold mb-4">
              Shipment Activity &amp; Timestamps
            </h4>
            <div className="space-y-3">
              {(currentOrder.trackingHistory || []).map((step: any, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-[#FAF8F5] border border-stone-200/80 rounded-xs text-xs"
                >
                  <Clock size={15} className="text-[#8A1C24] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-stone-900 uppercase tracking-wider">
                        {step.status}
                      </span>
                      <span className="text-stone-400 text-[11px]">{step.timestamp}</span>
                    </div>
                    <p className="text-stone-600 mt-1">{step.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Destination Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200 text-xs text-stone-700">
            <div>
              <span className="text-stone-400 uppercase tracking-wider text-[10px] block mb-1">
                Recipient &amp; Delivery Address:
              </span>
              <p className="font-semibold text-stone-900">{currentOrder.customer.fullName}</p>
              <p>{currentOrder.customer.streetAddress}, {currentOrder.customer.area}</p>
              <p>{currentOrder.customer.city}, {currentOrder.customer.province}</p>
              <p className="text-stone-500">Contact: {currentOrder.customer.phone}</p>
            </div>

            <div>
              <span className="text-stone-400 uppercase tracking-wider text-[10px] block mb-1">
                Payment Details:
              </span>
              <p>Method: <strong>{currentOrder.paymentMethod}</strong></p>
              <p>Total Payable: <strong className="text-[#8A1C24]">{formatPKR(currentOrder.grandTotal)}</strong></p>
              <p>Articles: {currentOrder.items.length} Pakistani Designer Outfits</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
