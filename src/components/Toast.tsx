import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useShop();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-fade-in shadow-xl">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xs border text-xs font-medium ${
          isSuccess
            ? 'bg-emerald-950 text-emerald-100 border-emerald-800'
            : isError
            ? 'bg-red-950 text-red-100 border-red-800'
            : 'bg-stone-900 text-stone-100 border-stone-800'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
        ) : isError ? (
          <AlertCircle size={16} className="text-red-400 shrink-0" />
        ) : (
          <Info size={16} className="text-[#D6B57E] shrink-0" />
        )}
        <span className="flex-1 leading-snug">{toast.message}</span>
      </div>
    </div>
  );
};
