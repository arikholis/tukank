import React from 'react';
import { ValidationResult } from '../types';

interface ResultDisplayProps {
  isLoading: boolean;
  result: ValidationResult | null;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, result, error }) => {
  if (isLoading) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center p-6 border-t border-slate-700">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        <p className="mt-4 text-slate-400">AI sedang berpikir...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-6 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 border-t border-slate-700 pt-8">
        <h3 className="font-bold text-lg mb-2">Terjadi Kesalahan</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="mt-8 border-t border-slate-700 pt-8">
      <div
        className={`p-6 rounded-lg border transition-all duration-300 ${
          result.isValid 
            ? 'bg-green-500/10 border-green-500/30 text-green-300' 
            : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
        }`}
      >
        <h3 className="font-bold text-xl mb-2 flex items-center">
          {result.isValid ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          Hasil Validasi: {result.isValid ? 'Valid' : 'Tidak Valid'}
        </h3>
        <p className="text-slate-300">{result.explanation}</p>

        {result.isValid && typeof result.keliling === 'number' && result.keliling > 0 && (
          <div className="mt-6 pt-6 border-t border-green-500/20 text-center">
            <p className="text-sm uppercase tracking-wider text-green-400">Keliling</p>
            <p className="text-5xl font-bold text-white mt-1">
              {result.keliling.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;