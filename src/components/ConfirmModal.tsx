import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  itemName,
  confirmLabel = 'Yes, Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onCancel} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-[#FAF8F5] border border-stone-300 shadow-2xl rounded-xs p-6 space-y-4 z-10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-lg font-semibold text-stone-900">{title}</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">{message}</p>
              {itemName && (
                <div className="mt-2.5 p-2 bg-stone-100 border border-stone-200 rounded-xs text-xs font-semibold text-stone-800">
                  {itemName}
                </div>
              )}
            </div>
            <button
              onClick={onCancel}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-200 text-xs">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-xs font-medium cursor-pointer"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Trash2 size={13} />
              <span>{confirmLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
