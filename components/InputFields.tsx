
import React from 'react';
import { ShapeConfig, Inputs } from '../types';

interface InputFieldsProps {
  shapeConfig: ShapeConfig;
  inputs: Inputs;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputFields: React.FC<InputFieldsProps> = ({ shapeConfig, inputs, onInputChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-3">Masukkan Ukuran</label>
      <div className={`grid grid-cols-1 ${shapeConfig.inputs.length > 1 ? 'sm:grid-cols-2' : ''} ${shapeConfig.inputs.length > 2 ? 'lg:grid-cols-4' : ''} gap-4`}>
        {shapeConfig.inputs.map(({ name, label }) => (
          <div key={name} className="relative">
            <input
              type="number"
              id={name}
              name={name}
              value={inputs[name] || ''}
              onChange={onInputChange}
              min="0.01"
              step="any"
              placeholder=" "
              className="block px-3.5 pb-2.5 pt-4 w-full text-md text-slate-200 bg-transparent rounded-lg border border-slate-600 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-500 peer"
              required
            />
            <label
              htmlFor={name}
              className="absolute text-md text-slate-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-slate-800/0 px-2 peer-focus:px-2 peer-focus:text-cyan-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              {label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputFields;
