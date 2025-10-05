'use client';

import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/formatters';

interface OvertimeCalculatorProps {
  currentPension: number;
  monthlySalary: number;
  yearsUntilRetirement: number;
}

const HOURS_PER_MONTH = 168; // Założenie: miesiąc roboczy = 168 godzin
const CONTRIBUTION_RATE = 0.1952; // 19.52% składki emerytalne
const PENSION_MONTHS = 18 * 12; // Oczekiwana długość życia na emeryturze (18 lat)

export default function OvertimeCalculator({
  currentPension,
  monthlySalary,
  yearsUntilRetirement,
}: OvertimeCalculatorProps) {
  // Oblicz domyślną stawkę godzinową (edytowalna)
  const defaultHourlyRate = monthlySalary / HOURS_PER_MONTH;
  const [hourlyRate, setHourlyRate] = useState(defaultHourlyRate);

  // Oblicz dodatkowy dochód za różną liczbę nadgodzin
  const calculateOvertimeIncome = (hours: number, months: number) => {
    const monthlyExtra = hourlyRate * hours * 4.33; // 4.33 tygodni w miesiącu
    const totalExtra = monthlyExtra * months;
    const contributions = totalExtra * CONTRIBUTION_RATE;
    const pensionIncrease = contributions / PENSION_MONTHS;
    
    return {
      monthlyExtra: Math.round(monthlyExtra),
      yearlyExtra: Math.round(monthlyExtra * 12),
      fiveYearExtra: Math.round(monthlyExtra * 60),
      pensionIncrease: Math.round(pensionIncrease * 100) / 100,
    };
  };

  // Dane do kafelków - wpływ na emeryturę (nie dochód!)
  const oneHourMonth = calculateOvertimeIncome(1, 1);
  const oneHourYear = calculateOvertimeIncome(1, 12);
  const oneHourFiveYears = calculateOvertimeIncome(1, 60);

  // Dane do wykresu - wpływ na emeryturę w zależności od lat pracy
  const chartData = useMemo(() => {
    const data = [];
    const maxYears = Math.min(yearsUntilRetirement, 20); // Max 20 lat na wykresie
    
    for (let year = 1; year <= maxYears; year++) {
      const months = year * 12;
      const oneHour = calculateOvertimeIncome(1, months);
      const twoHours = calculateOvertimeIncome(2, months);
      const threeHours = calculateOvertimeIncome(3, months);
      const fourHours = calculateOvertimeIncome(4, months);
      
      data.push({
        year,
        '1h': currentPension + oneHour.pensionIncrease,
        '2h': currentPension + twoHours.pensionIncrease,
        '3h': currentPension + threeHours.pensionIncrease,
        '4h': currentPension + fourHours.pensionIncrease,
      });
    }
    
    return data;
  }, [currentPension, yearsUntilRetirement, hourlyRate]);

  // Znajdź min i max dla osi Y (dynamiczny zakres)
  const minPension = useMemo(() => {
    if (chartData.length === 0) return currentPension;
    return Math.floor(currentPension * 0.95); // 5% poniżej obecnej emerytury
  }, [chartData, currentPension]);

  const maxPension = useMemo(() => {
    if (chartData.length === 0) return currentPension;
    const maxValue = Math.max(...chartData.map(d => d['4h']));
    return Math.ceil(maxValue * 1.05); // 5% powyżej maksymalnej wartości
  }, [chartData]);

  return (
    <div className="card bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800 border-l-4 border-orange-500">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-4xl">⏱️</div>
        <div>
          <h3 className="text-2xl font-bold text-zus-darkblue dark:text-white mb-1">
            Kalkulator Nadgodzin
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Zobacz wpływ dodatkowych godzin pracy dziennie (alternatywa dla dodatkowego źródła dochodu)
          </p>
        </div>
      </div>

      {/* Stawka godzinowa - edytowalna */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex-1">
            <label htmlFor="hourly-rate" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              Twoja stawka godzinowa (brutto):
            </label>
            <div className="flex items-center gap-2">
              <input
                id="hourly-rate"
                type="number"
                value={hourlyRate.toFixed(2)}
                onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                step="0.5"
                min="0"
                className="input-field max-w-[200px]"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">PLN/h</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setHourlyRate(defaultHourlyRate * 1.5)}
              className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              title="Nadgodziny x1.5"
            >
              x1.5
            </button>
            <button
              onClick={() => setHourlyRate(defaultHourlyRate * 2)}
              className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              title="Nadgodziny x2"
            >
              x2
            </button>
            <button
              onClick={() => setHourlyRate(defaultHourlyRate)}
              className="text-xs px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title="Resetuj do standardowej stawki"
            >
              Reset
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          💡 Obliczona z Twojego miesięcznego wynagrodzenia ({HOURS_PER_MONTH}h/miesiąc). 
          Możesz ją zmienić, np. jeśli nadgodziny są płatne x1.5 lub x2.
        </p>
      </div>

      {/* Kafelki z wzrostem EMERYTURY (nie dochodu!) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-white dark:bg-gray-700 text-center">
          <div className="text-2xl mb-2">📅</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            + do emerytury po 1 miesiącu
          </div>
          <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
            +{formatCurrency(oneHourMonth.pensionIncrease)}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            (+{((oneHourMonth.pensionIncrease / currentPension) * 100).toFixed(2)}%)
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            1 nadgodzina dziennie
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-700 text-center">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            + do emerytury po roku
          </div>
          <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
            +{formatCurrency(oneHourYear.pensionIncrease)}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            (+{((oneHourYear.pensionIncrease / currentPension) * 100).toFixed(2)}%)
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            przez cały rok
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-700 text-center">
          <div className="text-2xl mb-2">🎯</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            + do emerytury po 5 latach
          </div>
          <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
            +{formatCurrency(oneHourFiveYears.pensionIncrease)}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            (+{((oneHourFiveYears.pensionIncrease / currentPension) * 100).toFixed(2)}%)
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            przez 5 lat
          </div>
        </div>
      </div>

      {/* Wykres */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Wpływ na emeryturę w czasie
        </h4>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 70, bottom: 35 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="year"
              tick={{ fill: "#374151", fontSize: 12 }}
              label={{
                value: "Lata pracy z nadgodzinami",
                position: "insideBottom",
                offset: -25,
                style: { fill: "#6b7280" },
              }}
            />
            <YAxis
              domain={[minPension, maxPension]}
              tick={{ fill: "#374151", fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
              label={{
                value: "Emerytura (PLN)",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#6b7280" },
              }}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Po ${label} latach`}
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Line
              type="monotone"
              dataKey="1h"
              name="1 nadgodzina/dzień"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="2h"
              name="2 nadgodziny/dzień"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="3h"
              name="3 nadgodziny/dzień"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="4h"
              name="4 nadgodziny/dzień"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Ostrzeżenie Work-Life Balance */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded">
        <div className="flex gap-3">
          <div className="text-2xl">⚠️</div>
          <div className="flex-1">
            <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
              Ważna informacja o Work-Life Balance
            </h4>
            <p className="text-sm text-amber-800 dark:text-amber-300 mb-2">
              <strong>Nie zachęcamy do długotrwałej pracy w trybie nadgodzin.</strong> Zdrowie fizyczne 
              i psychiczne jest najważniejsze. Ten kalkulator ma służyć jako:
            </p>
            <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1 ml-4">
              <li>• <strong>Alternatywa krótkoterminowa</strong> - np. na konkretny cel oszczędnościowy</li>
              <li>• <strong>Opcja dla osób bez dostępu</strong> do dodatkowych źródeł dochodu</li>
              <li>• <strong>Świadoma decyzja</strong> - widzisz realny wpływ na emeryturę vs. czas życia</li>
            </ul>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-3">
              💡 <strong>Wskazówka:</strong> Rozważ najpierw inne opcje (freelancing, inwestycje, 
              rozwój umiejętności) zamiast wydłużania godzin pracy u obecnego pracodawcy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
