
import React from 'react';
import { Shape } from '../types';
import { SHAPE_CONFIGS } from '../constants';

interface ShapeSelectorProps {
  selectedShape: Shape;
  onShapeChange: (shape: Shape) => void;
}

const ShapeSelector: React.FC<ShapeSelectorProps> = ({ selectedShape, onShapeChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-3">Pilih Bangun Ruang</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(SHAPE_CONFIGS).map(([key, config]) => {
          const isSelected = selectedShape === key;
          const Icon = config.icon;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onShapeChange(key as Shape)}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ease-in-out transform hover:-translate-y-1
                ${isSelected 
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                  : 'bg-slate-700/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                }`}
            >
              <Icon className="w-8 h-8 mb-2" />
              <span className="font-semibold text-sm text-center">{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ShapeSelector;
