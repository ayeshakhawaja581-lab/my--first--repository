import React, { useState } from 'react';
import { X, Ruler, CheckCircle } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

  const sizeChart = [
    { size: 'XS', bust: '36', waist: '32', hip: '38', shoulder: '14.0', sleeve: '21.5', shirtLen: '43', trouserLen: '37' },
    { size: 'S', bust: '38', waist: '34', hip: '40', shoulder: '14.5', sleeve: '22.0', shirtLen: '44', trouserLen: '38' },
    { size: 'M', bust: '40', waist: '36', hip: '42', shoulder: '15.0', sleeve: '22.5', shirtLen: '45', trouserLen: '38.5' },
    { size: 'L', bust: '43', waist: '39', hip: '45', shoulder: '15.5', sleeve: '23.0', shirtLen: '46', trouserLen: '39' },
    { size: 'XL', bust: '46', waist: '42', hip: '48', shoulder: '16.5', sleeve: '23.5', shirtLen: '46.5', trouserLen: '39.5' },
    { size: 'XXL', bust: '49', waist: '45', hip: '51', shoulder: '17.0', sleeve: '24.0', shirtLen: '47', trouserLen: '40' },
  ];

  const convertVal = (valInches: string) => {
    if (unit === 'inches') return `${valInches}"`;
    const num = parseFloat(valInches);
    return isNaN(num) ? valInches : `${Math.round(num * 2.54)} cm`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-[#FAF8F5] shadow-2xl rounded-xs overflow-hidden z-10 border border-stone-200">
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <Ruler size={20} className="text-[#8A1C24]" />
              <h3 className="font-heading text-lg tracking-wider text-stone-900 uppercase">
                Pakistani Ready-to-Wear Size Guide
              </h3>
            </div>
            <button onClick={onClose} className="p-1.5 text-stone-500 hover:text-stone-900">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[80vh] space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 bg-[#F2EFE9] p-3 rounded-xs">
              <span className="text-xs text-stone-700">
                All measurements represent the <strong>garment dimensions</strong> laid flat.
              </span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-sm border border-stone-300 text-xs">
                <button
                  onClick={() => setUnit('inches')}
                  className={`px-3 py-1 font-medium transition-colors cursor-pointer ${
                    unit === 'inches' ? 'bg-[#8A1C24] text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Inches (in)
                </button>
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1 font-medium transition-colors cursor-pointer ${
                    unit === 'cm' ? 'bg-[#8A1C24] text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Centimeters (cm)
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-stone-200 bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1C1A1A] text-white uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">Size</th>
                    <th className="py-3 px-3">Bust / Chest</th>
                    <th className="py-3 px-3">Waist</th>
                    <th className="py-3 px-3">Hips</th>
                    <th className="py-3 px-3">Shoulder</th>
                    <th className="py-3 px-3">Sleeve</th>
                    <th className="py-3 px-3">Shirt Length</th>
                    <th className="py-3 px-3">Trouser Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700 font-mono text-[11px]">
                  {sizeChart.map((row) => (
                    <tr key={row.size} className="hover:bg-stone-50 transition-colors">
                      <td className="py-2.5 px-3 font-bold font-sans text-[#8A1C24] bg-stone-50/50">{row.size}</td>
                      <td className="py-2.5 px-3">{convertVal(row.bust)}</td>
                      <td className="py-2.5 px-3">{convertVal(row.waist)}</td>
                      <td className="py-2.5 px-3">{convertVal(row.hip)}</td>
                      <td className="py-2.5 px-3">{convertVal(row.shoulder)}</td>
                      <td className="py-2.5 px-3">{convertVal(row.sleeve)}</td>
                      <td className="py-2.5 px-3">{convertVal(row.shirtLen)}</td>
                      <td className="py-2.5 px-3">{convertVal(row.trouserLen)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Measuring tips */}
            <div className="bg-white border border-stone-200 p-4 space-y-3">
              <h4 className="font-heading text-sm text-stone-900">How to Measure for Pakistani Outfits</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600">
                <div className="flex gap-2">
                  <CheckCircle size={15} className="text-[#8A1C24] shrink-0 mt-0.5" />
                  <span><strong>Chest/Bust:</strong> Measure around the fullest part of your chest, keeping tape measure horizontal.</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle size={15} className="text-[#8A1C24] shrink-0 mt-0.5" />
                  <span><strong>Shoulder:</strong> Measure straight from tip of one shoulder bone across upper back to other tip.</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle size={15} className="text-[#8A1C24] shrink-0 mt-0.5" />
                  <span><strong>Shirt Length:</strong> Measured from high point of shoulder seam down to bottom hemline.</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle size={15} className="text-[#8A1C24] shrink-0 mt-0.5" />
                  <span><strong>Unstitched Suits:</strong> Feature generous 3.0m - 3.2m shirt fabrics suitable for tailoring up to XXL.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
