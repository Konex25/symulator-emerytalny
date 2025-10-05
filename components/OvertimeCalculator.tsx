'use client';

import { useMemo } from 'react';
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
  // Oblicz stawkę godzinową
  const hourlyRate = monthlySalary / HOURS_PER_MONTH;

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

  // Dane do kafelków (1 nadgodzina dziennie)
  const oneHourStats = calculateOvertimeIncome(1, yearsUntilRetirement * 12);

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

      {/* Stawka godzinowa */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Twoja stawka godzinowa:</span>
          <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {formatCurrency(hourlyRate)}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Obliczona z Twojego miesięcznego wynagrodzenia ({HOURS_PER_MONTH}h/miesiąc)
        </p>
      </div>

      {/* Kafelki z wzrostem */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-white dark:bg-gray-700 text-center">
          <div className="text-2xl mb-2">📅</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Wzrost miesięczny
          </div>
          <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
            +{formatCurrency(oneHourStats.monthlyExtra)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            1 nadgodzina dziennie
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-700 text-center">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Wzrost roczny
          </div>
          <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
            +{formatCurrency(oneHourStats.yearlyExtra)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            przez cały rok
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-700 text-center">
          <div className="text-2xl mb-2">🎯</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Wzrost 5-letni
          </div>
          <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
            +{formatCurrency(oneHourStats.fiveYearExtra)}
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
            margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="year"
              tick={{ fill: "#374151", fontSize: 12 }}
              label={{
                value: "Lata pracy z nadgodzinami",
                position: "insideBottom",
                offset: -5,
                style: { fill: "#6b7280" },
              }}
            />
            <YAxis
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
            <Legend />
            <Line
              type="monotone"
              dataKey="1h"
              name="1 nadgodzina/dzień"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="2h"
              name="2 nadgodziny/dzień"
              stroke="#ea580c"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="3h"
              name="3 nadgodziny/dzień"
              stroke="#c2410c"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="4h"
              name="4 nadgodziny/dzień"
              stroke="#9a3412"
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
