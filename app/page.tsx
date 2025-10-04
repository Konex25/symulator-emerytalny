'use client';

import { useState } from 'react';
import SimulationForm from '@/components/SimulationForm';
import type { SimulationResult } from '@/types';

export default function Home() {
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleSuccess = (calculatedResult: SimulationResult) => {
    setResult(calculatedResult);
    // Scroll do wyników (zaimplementujemy w następnym milestone)
    console.log('Wyniki:', calculatedResult);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
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
        <div className="card">
          <h2 className="text-2xl font-bold text-zus-darkblue mb-6">
            Twoje dane
          </h2>
          <SimulationForm onSuccess={handleSuccess} />
        </div>

        {/* Wyniki (jeśli są) */}
        {result && (
          <div className="card mt-8">
            <h2 className="text-2xl font-bold text-zus-green mb-4">
              Wyniki symulacji
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Nominalna emerytura:</p>
                <p className="text-3xl font-bold text-zus-darkblue">
                  {result.nominalPension.toFixed(2)} PLN
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Realna emerytura (skorygowana o inflację):</p>
                <p className="text-2xl font-bold text-zus-blue">
                  {result.realPension.toFixed(2)} PLN
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Stopa zastąpienia:</p>
                <p className="text-xl font-bold text-zus-green">
                  {(result.replacementRate * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rok przejścia na emeryturę:</p>
                <p className="text-xl font-bold">
                  {result.retirementYear}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Szczegółowe wyniki z wykresami będą dostępne w następnym kroku 📊
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

