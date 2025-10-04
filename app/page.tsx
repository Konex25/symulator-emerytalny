'use client';

import { useState, useRef } from 'react';
import SimulationForm from '@/components/SimulationForm';
import ResultsScreen from '@/components/ResultsScreen';
import type { SimulationResult, SimulationInput } from '@/types';

export default function Home() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [inputData, setInputData] = useState<SimulationInput | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSuccess = (calculatedResult: SimulationResult, input: SimulationInput) => {
    setResult(calculatedResult);
    setInputData(input);
    
    // Smooth scroll do wyników
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Wprowadzenie */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zus-darkblue mb-4">
            Sprawdź swoją przyszłą emeryturę
          </h1>
          <p className="text-lg text-gray-700 mb-2">
            Wypełnij formularz, aby obliczyć prognozowaną wysokość Twojej emerytury
          </p>
          <p className="text-sm text-gray-600">
            Średnia emerytura w Polsce wynosi <span className="font-bold text-zus-green">3500 PLN</span>
          </p>
        </div>

        {/* Formularz */}
        <div className="card mb-12">
          <h2 className="text-2xl font-bold text-zus-darkblue mb-6">
            Twoje dane
          </h2>
          <SimulationForm 
            onSuccess={handleSuccess}
          />
        </div>

        {/* Wyniki (jeśli są) */}
        {result && inputData && (
          <div ref={resultsRef} className="scroll-mt-20">
            <ResultsScreen result={result} input={inputData} />
          </div>
        )}
      </div>
    </div>
  );
}

