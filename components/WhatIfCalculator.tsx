'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/utils/formatters';

interface WhatIfCalculatorProps {
  basePension: number;
  currentSalary: number;
}

export default function WhatIfCalculator({
  basePension,
  currentSalary,
}: WhatIfCalculatorProps) {
  const [extraIncome, setExtraIncome] = useState(500);
  const [years, setYears] = useState(5);
  const [calculatedPension, setCalculatedPension] = useState(basePension);
  const [percentageIncrease, setPercentageIncrease] = useState(0);

  useEffect(() => {
    // Prosty model: dodatkowy dochód zwiększa składki
    const CONTRIBUTION_RATE = 0.1952; // 19.52% składki emerytalne
    const additionalContributions = extraIncome * 12 * years * CONTRIBUTION_RATE;
    const monthsOfPension = 18 * 12; // Oczekiwana długość życia na emeryturze
    const pensionIncrease = additionalContributions / monthsOfPension;
    const newPension = basePension + pensionIncrease;
    const increase = ((newPension - basePension) / basePension) * 100;

    setCalculatedPension(newPension);
    setPercentageIncrease(increase);
  }, [extraIncome, years, basePension]);

  return (
    <div className="card bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 border-l-4 border-purple-500">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-4xl">🔮</div>
        <div>
          <h3 className="text-2xl font-bold text-zus-darkblue dark:text-white mb-1">
            Kalkulator &quot;Co jeśli&quot;
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Zobacz wpływ dodatkowego dochodu w czasie rzeczywistym
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Slider 1: Dodatkowy dochód */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              💰 Dodatkowy dochód miesięczny
            </label>
            <div className="text-xl font-bold text-zus-blue dark:text-zus-gold">
              {extraIncome} PLN
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="3000"
            step="100"
            value={extraIncome}
            onChange={(e) => setExtraIncome(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>0 PLN</span>
            <span>1500 PLN</span>
            <span>3000 PLN</span>
          </div>
        </div>

        {/* Slider 2: Lata */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              ⏰ Przez ile lat
            </label>
            <div className="text-xl font-bold text-zus-blue dark:text-zus-gold">
              {years} {years === 1 ? 'rok' : years < 5 ? 'lata' : 'lat'}
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            step="1"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>1 rok</span>
            <span>7 lat</span>
            <span>15 lat</span>
          </div>
        </div>

        {/* Result box */}
        <div className="bg-gradient-to-r from-zus-green to-zus-blue text-white rounded-xl p-6 shadow-lg">
          <div className="text-center">
            <div className="text-sm opacity-90 mb-2">Twoja nowa emerytura:</div>
            <div className="text-4xl md:text-5xl font-bold mb-2">
              {formatCurrency(calculatedPension)}
            </div>
            <div className="flex items-center justify-center gap-2 text-lg">
              <span className="opacity-90">Wzrost:</span>
              <span className="font-bold">
                +{formatCurrency(calculatedPension - basePension)}
              </span>
              <span className="bg-white/20 px-2 py-1 rounded text-sm">
                +{percentageIncrease.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Jak to działa?</strong> Dodatkowy dochód zwiększa Twoje składki emerytalne
              (19,52% podstawy). Te środki są dzielone na przewidywaną długość życia na emeryturze
              (~18 lat), co daje miesięczny wzrost emerytury.
            </div>
          </div>
        </div>

        {/* Quick examples */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { income: 500, years: 3, label: 'Mały wysiłek' },
            { income: 1000, years: 5, label: 'Średni wysiłek' },
            { income: 1500, years: 7, label: 'Duży wysiłek' },
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => {
                setExtraIncome(example.income);
                setYears(example.years);
              }}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {example.label}
              </div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">
                +{example.income} PLN / {example.years} lat
              </div>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, var(--zus-green), var(--zus-blue));
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .slider-thumb::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, var(--zus-green), var(--zus-blue));
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
