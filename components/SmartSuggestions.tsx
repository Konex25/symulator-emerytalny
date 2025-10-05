'use client';

import { suggestOptimalPaths } from '@/lib/calculations';
import { useState } from 'react';

interface SmartSuggestionsProps {
  currentPension: number;
  targetPension: number;
  currentSalary: number;
  age: number;
  retirementAge: number;
}

export default function SmartSuggestions({
  currentPension,
  targetPension,
  currentSalary,
  age,
  retirementAge,
}: SmartSuggestionsProps) {
  const yearsUntilRetirement = Math.max(0, retirementAge - age);
  const pathsData = suggestOptimalPaths(
    currentPension,
    targetPension,
    currentSalary,
    yearsUntilRetirement
  );
  
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!pathsData.needsSuggestions) {
    return (
      <div className="card p-6">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {pathsData.message}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Jesteś na dobrej drodze do osiągnięcia swoich celów emerytalnych!
          </p>
        </div>
      </div>
    );
  }

  const effortEmoji = {
    low: '⭐',
    medium: '⭐⭐',
    high: '⭐⭐⭐',
  };

  const strategyEmoji = {
    extra_income: '💼',
    work_longer: '⏰',
    combined: '🔄',
    investment: '📈',
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">💡</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Twoje Personalizowane Ścieżki
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Wybierz strategię dopasowaną do Twoich możliwości
          </p>
        </div>
      </div>

      {/* Gap info */}
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Do osiągnięcia celu potrzebujesz:
          </span>
          <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
            +{pathsData?.gap?.toLocaleString("pl-PL")} PLN/mies
          </span>
        </div>
      </div>


      {/* Investment Instruments Analysis */}
      <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">💰</span>
          Dodatkowe Oszczędności Emerytalne
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Ile musisz odkładać miesięcznie, aby uzupełnić lukę do celu?
        </p>

        {(() => {
          const gap = pathsData?.gap || 0;
          const years = yearsUntilRetirement;
          const months = years * 12;
          const monthlyRate = 0.05 / 12; // 5% annual return
          const retirementYears = 25; // assumed years in retirement

          // Calculate how much monthly contribution gives X pension per month
          // FV = PMT × [(1 + r)^n - 1] / r
          // Then pension = FV / (retirementYears * 12)

          const calculateMonthlyContribution = (
            targetMonthlyPension: number
          ) => {
            const targetCapital = targetMonthlyPension * retirementYears * 12;
            // Reverse FV formula to get PMT
            const pmt =
              (targetCapital * monthlyRate) /
              (Math.pow(1 + monthlyRate, months) - 1);
            return Math.round(pmt);
          };

          const calculatePensionFromContribution = (
            monthlyContribution: number
          ) => {
            const futureValue =
              monthlyContribution *
              ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
            const monthlyPension = futureValue / (retirementYears * 12);
            return Math.round(monthlyPension);
          };

          // PPK - 3.5% of salary
          const ppkContribution = Math.round(currentSalary * 0.035);
          const ppkPension = calculatePensionFromContribution(ppkContribution);

          // IKE - calculate needed or use 10%
          const ikeNeededForGap = calculateMonthlyContribution(
            gap - ppkPension
          );
          const ikeMax = 2168; // monthly limit
          const ike10Percent = Math.round(currentSalary * 0.1);
          const ikeRealistic = Math.min(
            Math.max(ikeNeededForGap, ike10Percent),
            ikeMax
          );
          const ikePension = calculatePensionFromContribution(ikeRealistic);

          // IKZE - calculate needed or use 10%
          const remainingGap = gap - ppkPension - ikePension;
          const ikzeNeededForGap = calculateMonthlyContribution(remainingGap);
          const ikzeMax = 867; // monthly limit
          const ikze10Percent = Math.round(currentSalary * 0.1);
          const ikzeRealistic = Math.min(
            Math.max(ikzeNeededForGap, ikze10Percent),
            ikzeMax
          );
          const ikzePension = calculatePensionFromContribution(ikzeRealistic);

          const totalAdditionalPension = ppkPension + ikePension + ikzePension;
          const coveragePercent = Math.min(
            (totalAdditionalPension / gap) * 100,
            100
          );

          return (
            <div className="space-y-4">
              {/* PPK Card */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏢</span>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      PPK
                    </h4>
                  </div>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    Zalecane
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">
                      Miesięczna wpłata (3.5%)
                    </div>
                    <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                      {ppkContribution.toLocaleString("pl-PL")} zł
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">
                      Dodatkowa emerytura
                    </div>
                    <div className="font-bold text-lg text-green-600 dark:text-green-400">
                      +{ppkPension.toLocaleString("pl-PL")} zł/mies
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  ✓ Dopłata pracodawcy | ✓ Automatyczne odprowadzanie
                </div>
              </div>

              {/* IKE Card */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💼</span>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      IKE
                    </h4>
                  </div>
                  {ikeNeededForGap > ikeMax && (
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                      Limit
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">
                      {ikeNeededForGap > ikeMax
                        ? "Sugerowana wpłata (max)"
                        : "Potrzebna wpłata"}
                    </div>
                    <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                      {ikeRealistic.toLocaleString("pl-PL")} zł
                    </div>
                    <div className="text-xs text-gray-500">
                      ({((ikeRealistic / currentSalary) * 100).toFixed(1)}%
                      wynagrodzenia)
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">
                      Dodatkowa emerytura
                    </div>
                    <div className="font-bold text-lg text-green-600 dark:text-green-400">
                      +{ikePension.toLocaleString("pl-PL")} zł/mies
                    </div>
                  </div>
                </div>
                {ikeNeededForGap > ikeMax && (
                  <div className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                    ⚠ Potrzebna kwota ({ikeNeededForGap.toLocaleString("pl-PL")}{" "}
                    zł) przekracza miesięczny limit{" "}
                    {ikeMax.toLocaleString("pl-PL")} zł
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  ✓ Brak podatku od zysków po 60. roku życia
                </div>
              </div>

              {/* IKZE Card */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📈</span>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      IKZE
                    </h4>
                  </div>
                  {ikzeNeededForGap > ikzeMax && (
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                      Limit
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">
                      {ikzeNeededForGap > ikzeMax
                        ? "Sugerowana wpłata (max)"
                        : "Potrzebna wpłata"}
                    </div>
                    <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                      {ikzeRealistic.toLocaleString("pl-PL")} zł
                    </div>
                    <div className="text-xs text-gray-500">
                      ({((ikzeRealistic / currentSalary) * 100).toFixed(1)}%
                      wynagrodzenia)
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">
                      Dodatkowa emerytura
                    </div>
                    <div className="font-bold text-lg text-green-600 dark:text-green-400">
                      +{ikzePension.toLocaleString("pl-PL")} zł/mies
                    </div>
                  </div>
                </div>
                {ikzeNeededForGap > ikzeMax && (
                  <div className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                    ⚠ Potrzebna kwota (
                    {ikzeNeededForGap.toLocaleString("pl-PL")} zł) przekracza
                    miesięczny limit {ikzeMax.toLocaleString("pl-PL")} zł
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  ✓ Roczny zwrot podatku:{" "}
                  {Math.round(ikzeRealistic * 12 * 0.12).toLocaleString(
                    "pl-PL"
                  )}{" "}
                  -{" "}
                  {Math.round(ikzeRealistic * 12 * 0.32).toLocaleString(
                    "pl-PL"
                  )}{" "}
                  zł
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border-2 border-green-200 dark:border-green-700">
                <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                  📊 Podsumowanie
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Łączna miesięczna wpłata:
                    </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {(
                        ppkContribution +
                        ikeRealistic +
                        ikzeRealistic
                      ).toLocaleString("pl-PL")}{" "}
                      zł
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      % wynagrodzenia:
                    </span>
                    <span className="font-bold">
                      {(
                        ((ppkContribution + ikeRealistic + ikzeRealistic) /
                          currentSalary) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Dodatkowa emerytura razem:
                    </span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      +{totalAdditionalPension.toLocaleString("pl-PL")} zł/mies
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-300 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-400">
                      Pokrycie luki:
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{
                            width: `${Math.min(coveragePercent, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="font-bold text-lg">
                        {coveragePercent.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                {coveragePercent >= 100 ? (
                  <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
                    <div className="text-2xl mb-1">🎉</div>
                    <div className="text-sm font-bold text-green-800 dark:text-green-200">
                      Osiągniesz swój cel!
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>💡 Uwaga:</strong> Sugerowane wpłaty nie pokrywają
                      całej luki. Rozważ dodatkowe oszczędności lub dłuższą
                      pracę.
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Info footer */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          💡 <strong>Wskazówka:</strong> Możesz łączyć różne strategie!
          Najlepsze rezultaty osiągniesz stosując 2-3 podejścia jednocześnie.
        </p>
      </div>
    </div>
  );
}

