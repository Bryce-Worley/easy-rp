import React from 'react';

interface UnitToggleProps {
    unit: 'lbs' | 'kg';
    onUnitChange: (newUnit: 'lbs' | 'kg') => void;
}

export default function UnitToggle({ unit, onUnitChange }: UnitToggleProps) {
    return (
        <div className="inline-flex items-center bg-[#4A4A4C] p-0.5 rounded-lg border border-zinc-700">
            <button
                type="button"
                onClick={() => onUnitChange('lbs')}
                className={`px-2 py-1 text-[10px] font-semibold rounded transition-colors ${
                    unit === 'lbs' ? 'bg-[#ff5722] text-white shadow' : 'text-zinc-300 hover:text-white'
                }`}
            >
                LBS
            </button>
            <button
                type="button"
                onClick={() => onUnitChange('kg')}
                className={`px-2 py-1 text-[10px] font-semibold rounded transition-colors ${
                    unit === 'kg' ? 'bg-[#ff5722] text-white shadow' : 'text-zinc-300 hover:text-white'
                }`}
            >
                KG
            </button>
        </div>
    );
}