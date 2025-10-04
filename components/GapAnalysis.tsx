'use client';

import { calculateGap } from '@/lib/calculations';

interface GapAnalysisProps {
  currentPension: number;
  targetPension: number;
}

export default function GapAnalysis({ currentPension, targetPension }: GapAnalysisProps) {
  const gapData = calculateGap(currentPension, targetPension);
  
  // Procent osiągnięcia celu
  const achievedPercentage = Math.min((currentPension / targetPension) * 100, 100);
  
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">🎯</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Twój Cel Emerytalny
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {gapData.meetsGoal ? 'Gratulacje! Osiągniesz swój cel!' : 'Zobacz co możesz zrobić'}
          </p>
        </div>
      </div>

      {/* Wizualizacja celu */}
      <div className="space-y-4">
        {/* Obecna emerytura */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Twoja prognoza
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {currentPension.toLocaleString('pl-PL')} PLN
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                gapData.meetsGoal
                  ? 'bg-gradient-to-r from-zus-green to-green-400'
                  : 'bg-gradient-to-r from-yellow-400 to-orange-400'
              }`}
              style={{ width: `${achievedPercentage}%` }}
            >
              <div className="flex items-center justify-center h-full">
                <span className="text-xs font-bold text-white">
                  {Math.round(achievedPercentage)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cel */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Twój cel
          </span>
          <span className="text-lg font-bold text-zus-green dark:text-zus-gold">
            {targetPension.toLocaleString('pl-PL')} PLN
          </span>
        </div>

        {/* Luka */}
        {gapData.hasGap && (
          <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div className="flex-1">
                <h3 className="font-bold text-orange-900 dark:text-orange-200 mb-1">
                  Brakuje Ci {gapData.gap.toLocaleString('pl-PL')} PLN miesięcznie
                </h3>
                <p className="text-sm text-orange-800 dark:text-orange-300">
                  To {gapData.gapPercentage.toFixed(1)}% Twojego celu. Ale nie martw się! 
                  Poniżej znajdziesz sprawdzone sposoby, jak to zmienić.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sukces */}
        {gapData.meetsGoal && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎉</div>
              <div className="flex-1">
                <h3 className="font-bold text-green-900 dark:text-green-200 mb-1">
                  Świetna wiadomość!
                </h3>
                <p className="text-sm text-green-800 dark:text-green-300">
                  Osiągniesz swój cel emerytalny! Możesz rozważyć wcześniejszą emeryturę 
                  lub zwiększenie swoich celów finansowych.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Informacyjna belka */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-2">
            <div className="text-xl">💡</div>
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <strong>Dobra wiadomość:</strong> Nawet niewielkie zmiany mogą znacząco 
              wpłynąć na Twoją przyszłą emeryturę. Sprawdź poniżej personalizowane 
              sugestie dopasowane do Twojej sytuacji.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

