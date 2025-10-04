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
            +{pathsData.gap.toLocaleString('pl-PL')} PLN/mies
          </span>
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-4">
        {pathsData.suggestions.map((suggestion, index) => {
          const isExpanded = expandedId === suggestion.id;
          
          return (
            <div
              key={suggestion.id}
              className={`border-2 rounded-lg transition-all duration-300 ${
                isExpanded
                  ? 'border-zus-green dark:border-zus-gold shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : suggestion.id)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-3xl">
                    {strategyEmoji[suggestion.strategy as keyof typeof strategyEmoji]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        #{index + 1} {suggestion.title}
                      </h3>
                      <span className="text-sm">
                        {effortEmoji[suggestion.effort as keyof typeof effortEmoji]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
                <div className="ml-4">
                  <svg
                    className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                  {/* Szczegóły */}
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-200 mb-2">
                      📊 Szczegóły planu:
                    </h4>
                    <div className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                      {suggestion.strategy === 'extra_income' && (
                        <>
                          <div className="flex justify-between">
                            <span>Dodatkowy dochód miesięczny:</span>
                            <span className="font-bold">
                              {suggestion.details.extraMonthlyIncome} PLN
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Przez ile czasu:</span>
                            <span className="font-bold">{suggestion.details.duration} lat</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Łącznie zarobisz:</span>
                            <span className="font-bold">
                              {suggestion.details.totalEarned.toLocaleString('pl-PL')} PLN
                            </span>
                          </div>
                        </>
                      )}
                      
                      {suggestion.strategy === 'work_longer' && (
                        <>
                          <div className="flex justify-between">
                            <span>Dodatkowe lata pracy:</span>
                            <span className="font-bold">
                              {suggestion.details.workLongerYears} lat
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Wiek przejścia na emeryturę:</span>
                            <span className="font-bold">{suggestion.details.retirementAge} lat</span>
                          </div>
                        </>
                      )}
                      
                      {suggestion.strategy === 'combined' && (
                        <>
                          <div className="flex justify-between">
                            <span>Dodatkowy dochód:</span>
                            <span className="font-bold">
                              {suggestion.details.extraMonthlyIncome} PLN/mies
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Przez:</span>
                            <span className="font-bold">{suggestion.details.extraDuration} lat</span>
                          </div>
                          <div className="flex justify-between">
                            <span>+ Praca dłużej o:</span>
                            <span className="font-bold">
                              {suggestion.details.workLongerYears} lat
                            </span>
                          </div>
                        </>
                      )}
                      
                      {suggestion.strategy === 'investment' && (
                        <>
                          <div className="flex justify-between">
                            <span>Miesięczna wpłata:</span>
                            <span className="font-bold">
                              {suggestion.details.monthlyInvestment} PLN
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Łącznie zainwestujesz:</span>
                            <span className="font-bold">
                              {suggestion.details.totalInvested.toLocaleString('pl-PL')} PLN
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Oczekiwany zwrot:</span>
                            <span className="font-bold">
                              {suggestion.details.expectedReturn.toLocaleString('pl-PL')} PLN/mies
                            </span>
                          </div>
                        </>
                      )}
                      
                      {suggestion.id === 'realistic' && (
                        <>
                          <div className="flex justify-between">
                            <span>Oryginalny cel:</span>
                            <span className="font-bold line-through text-gray-500">
                              {suggestion.details.originalTarget} PLN
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Skorygowany cel:</span>
                            <span className="font-bold text-green-600">
                              {suggestion.details.adjustedTarget} PLN
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Dodatkowy dochód:</span>
                            <span className="font-bold">
                              {suggestion.details.extraMonthlyIncome} PLN/mies
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Przez:</span>
                            <span className="font-bold">{suggestion.details.extraDuration} lat</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Pros & Cons */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {/* Pros */}
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-semibold text-sm text-green-900 dark:text-green-200 mb-2 flex items-center gap-2">
                        <span>✅</span> Zalety
                      </h4>
                      <ul className="space-y-1">
                        {suggestion.pros.map((pro, i) => (
                          <li key={i} className="text-xs text-green-800 dark:text-green-300">
                            • {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cons */}
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <h4 className="font-semibold text-sm text-orange-900 dark:text-orange-200 mb-2 flex items-center gap-2">
                        <span>⚠️</span> Do rozważenia
                      </h4>
                      <ul className="space-y-1">
                        {suggestion.cons.map((con, i) => (
                          <li key={i} className="text-xs text-orange-800 dark:text-orange-300">
                            • {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="text-center pt-2">
                    <button className="btn-primary text-sm py-2 px-6">
                      Zapisz tę strategię
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info footer */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          💡 <strong>Wskazówka:</strong> Możesz łączyć różne strategie! Najlepsze 
          rezultaty osiągniesz stosując 2-3 podejścia jednocześnie.
        </p>
      </div>
    </div>
  );
}

