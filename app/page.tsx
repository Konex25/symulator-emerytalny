'use client';

import { useState, useRef } from 'react';
import LandingScreen from '@/components/LandingScreen';
import SimulationForm from '@/components/SimulationForm';
import ResultsScreen from '@/components/ResultsScreen';
import type { SimulationResult, SimulationInput } from '@/types';

export default function Home() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [inputData, setInputData] = useState<SimulationInput | null>(null);
  const [desiredPension, setDesiredPension] = useState<number | undefined>(undefined);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleStartSimulation = () => {
    // Scroll do formularza
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDesiredPensionChange = (amount: number) => {
    setDesiredPension(amount);
  };

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
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Landing Screen */}
        <LandingScreen 
          onStartSimulation={handleStartSimulation}
          onDesiredPensionChange={handleDesiredPensionChange}
        />

        {/* Separator */}
        <div className="border-t-2 border-zus-gray"></div>

        {/* Formularz */}
        <div ref={formRef} className="scroll-mt-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-zus-darkblue mb-3">
              Kalkulator emerytury
            </h2>
            <p className="text-gray-600">
              Wprowadź swoje dane, aby obliczyć prognozę emerytury
            </p>
          </div>
          
          <div className="card">
            <SimulationForm 
              onSuccess={handleSuccess}
              desiredPension={desiredPension}
            />
          </div>
        </div>

        {/* Wyniki (jeśli są) */}
        {result && inputData && (
          <>
            <div className="border-t-2 border-zus-gray"></div>
            <div ref={resultsRef} className="scroll-mt-20">
              <ResultsScreen result={result} input={inputData} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

