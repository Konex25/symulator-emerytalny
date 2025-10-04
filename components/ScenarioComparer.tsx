'use client';

import { calculateWorkLongerScenarios, calculateExtraIncomeScenarios } from '@/lib/calculations';
import { useState } from 'react';

interface ScenarioComparerProps {
  currentPension: number;
  currentSalary: number;
  targetPension?: number;
}

export default function ScenarioComparer({
  currentPension,
  currentSalary,
  targetPension,
}: ScenarioComparerProps) {
  const [activeTab, setActiveTab] = useState<'work' | 'income'>('work');
  
  const workScenarios = calculateWorkLongerScenarios(
    currentPension,
    currentSalary,
    targetPension
  );
  
  const incomeScenarios = calculateExtraIncomeScenarios(
    currentPension,
    currentSalary,
    targetPension
  );
  
  // Top 5 najbardziej efektywnych scenariuszy dodatkowego dochodu
  const topIncomeScenarios = incomeScenarios.slice(0, 8);

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">📊</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Porównaj Scenariusze
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Zobacz jak różne decyzje wpłyną na Twoją emeryturę
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('work')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'work'
              ? 'border-zus-green dark:border-zus-gold text-zus-green dark:text-zus-gold'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          ⏰ Dłuższa praca
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'income'
              ? 'border-zus-green dark:border-zus-gold text-zus-green dark:text-zus-gold'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          💼 Dodatkowy dochód
        </button>
      </div>

      {/* Work Longer Scenarios */}
      {activeTab === 'work' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Dodatkowe lata
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Emerytura
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Wzrost
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                  Cel
                </th>
              </tr>
            </thead>
            <tbody>
              {workScenarios.map((scenario) => (
                <tr
                  key={scenario.years}
                  className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    scenario.meetsGoal ? 'bg-green-50 dark:bg-green-900/10' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        +{scenario.years} {scenario.years === 1 ? 'rok' : 'lat'}
                      </span>
                      {scenario.years <= 2 && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">
                          Polecane
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">
                    {scenario.pension.toLocaleString('pl-PL')} PLN
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        +{scenario.increase.toLocaleString('pl-PL')} PLN
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        (+{scenario.percentageIncrease}%)
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {scenario.meetsGoal ? (
                      <span className="inline-flex items-center text-green-600 dark:text-green-400 font-bold">
                        ✓ Cel osiągnięty
                      </span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              💡 <strong>Pamiętaj:</strong> Każdy dodatkowy rok pracy zwiększa Twoją emeryturę 
              średnio o {workScenarios[0]?.percentageIncrease.toFixed(1)}% rocznie. To jeden z 
              najpewniejszych sposobów na wyższą emeryturę!
            </p>
          </div>
        </div>
      )}

      {/* Extra Income Scenarios */}
      {activeTab === 'income' && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Dodatkowy dochód
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Okres
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Emerytura
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Wzrost
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                    Wysiłek
                  </th>
                </tr>
              </thead>
              <tbody>
                {topIncomeScenarios.map((scenario, index) => (
                  <tr
                    key={`${scenario.extraMonthlyIncome}-${scenario.durationYears}`}
                    className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      scenario.meetsGoal ? 'bg-green-50 dark:bg-green-900/10' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          +{scenario.extraMonthlyIncome} PLN/mies
                        </span>
                        {index === 0 && (
                          <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded">
                            TOP
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Razem: {scenario.totalExtra.toLocaleString('pl-PL')} PLN
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {scenario.durationYears} {scenario.durationYears === 1 ? 'rok' : 'lat'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">
                      {scenario.pension.toLocaleString('pl-PL')} PLN
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          +{scenario.increase.toLocaleString('pl-PL')} PLN
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          (+{scenario.percentageIncrease.toFixed(2)}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {scenario.effort === 'low' && (
                        <span className="text-green-600 dark:text-green-400">⭐</span>
                      )}
                      {scenario.effort === 'medium' && (
                        <span className="text-yellow-600 dark:text-yellow-400">⭐⭐</span>
                      )}
                      {scenario.effort === 'high' && (
                        <span className="text-orange-600 dark:text-orange-400">⭐⭐⭐</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-sm text-green-900 dark:text-green-200 mb-2">
                💡 Pomysły na dodatkowy dochód:
              </h4>
              <ul className="text-xs text-green-800 dark:text-green-300 space-y-1">
                <li>• Praca weekendowa (kelnerstwo, dostawa)</li>
                <li>• Freelancing (grafika, pisanie, programowanie)</li>
                <li>• Sprzedaż online (aukcje, własne produkty)</li>
                <li>• Korepetycje lub szkolenia</li>
              </ul>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-200 mb-2">
                📊 Wysiłek vs Rezultat:
              </h4>
              <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                <li>⭐ Niski - łatwe do osiągnięcia</li>
                <li>⭐⭐ Średni - wymaga dodatkowej pracy</li>
                <li>⭐⭐⭐ Wysoki - znaczny dodatkowy wysiłek</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

