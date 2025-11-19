import React, { useState, useMemo, useCallback } from 'react';
import { Shape, Inputs, ValidationResult } from './types';
import { SHAPE_CONFIGS } from './constants';
import ShapeSelector from './components/ShapeSelector';
import InputFields from './components/InputFields';
import ResultDisplay from './components/ResultDisplay';
import { validateShape } from './services/geminiService';

const App: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState<Shape>(Shape.Square);
  const [inputs, setInputs] = useState<Inputs>({});
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const currentShapeConfig = useMemo(() => SHAPE_CONFIGS[selectedShape], [selectedShape]);

  const handleShapeChange = useCallback((shape: Shape) => {
    setSelectedShape(shape);
    setInputs({});
    setResult(null);
    setError(null);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  }, []);

  const isFormValid = useMemo(() => {
    return currentShapeConfig.inputs.every(input => {
      const value = inputs[input.name];
      return value && value.trim() !== '' && !isNaN(Number(value)) && Number(value) > 0;
    });
  }, [currentShapeConfig, inputs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const validationResult = await validateShape(selectedShape, inputs);
      setResult(validationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Validator Tuqang x AI
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Validasi ukuran proyek Anda dengan kekuatan AI
          </p>
        </header>

        <main className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl shadow-slate-950/50">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              <ShapeSelector selectedShape={selectedShape} onShapeChange={handleShapeChange} />
              <InputFields
                shapeConfig={currentShapeConfig}
                inputs={inputs}
                onInputChange={handleInputChange}
              />
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30 disabled:shadow-none"
              >
                {isLoading ? 'Memvalidasi...' : 'Validasi Ukuran'}
              </button>
            </div>
          </form>

          <ResultDisplay isLoading={isLoading} result={result} error={error} />
        </main>
        
        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>Ditenagai oleh Google Gemini API</p>
        </footer>
      </div>
    </div>
  );
};

export default App;