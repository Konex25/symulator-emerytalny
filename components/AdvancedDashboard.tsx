'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SalaryHistory, SimulationInput } from "@/types";
import { formatCurrency } from '@/utils/formatters';

interface AdvancedDashboardProps {
  initialInput: SimulationInput;
  onRecalculate?: (updatedInput: SimulationInput) => void;
}

export default function AdvancedDashboard({ initialInput, onRecalculate }: AdvancedDashboardProps) {
  const [salaryExpanded, setSalaryExpanded] = useState(false);
  const [salaryHistory, setSalaryHistory] = useState<SalaryHistory[]>([]);

  // Generuj dane do wykresu timeline
  const generateTimelineData = () => {
    const data = [];
    const startYear = initialInput.workStartYear;
    const endYear = initialInput.workEndYear;
    const currentYear = new Date().getFullYear();

    for (
      let year = startYear;
      year <= Math.min(endYear, currentYear + 40);
      year++
    ) {
      const yearsWorked = year - startYear;
      const salary = initialInput.grossSalary * Math.pow(1.04, yearsWorked);
      const annualContribution = salary * 12 * 0.1976;

      // Konto główne (poprzednie lata)
      const accountBalance = yearsWorked * annualContribution;

      // Subkonto (uproszczone - 30% konta)
      const subAccountBalance = accountBalance * 0.3;

      data.push({
        year,
        konto: Math.round(accountBalance),
        subkonto: Math.round(subAccountBalance),
        total: Math.round(accountBalance + subAccountBalance),
      });
    }

    return data;
  };

  const timelineData = generateTimelineData();

  // Generuj dane do wykresu wynagrodzeń
  const generateSalaryChartData = () => {
    const data = [];
    const startYear = initialInput.workStartYear;
    const endYear = initialInput.workEndYear;
    const currentYear = new Date().getFullYear();

    for (let year = startYear; year <= endYear; year++) {
      const yearsFromNow = currentYear - year;
      let salary: number;
      
      // Sprawdź czy użytkownik dostosował to wynagrodzenie
      const customEntry = salaryHistory.find((entry) => entry.year === year);
      
      if (customEntry) {
        salary = customEntry.amount;
      } else {
        // Oblicz domyślne wynagrodzenie z 4% wzrostem
        salary = yearsFromNow >= 0
          ? initialInput.grossSalary / Math.pow(1.04, yearsFromNow)
          : initialInput.grossSalary * Math.pow(1.04, Math.abs(yearsFromNow));
      }

      data.push({
        year,
        salary: Math.round(salary),
      });
    }

    return data;
  };

  const salaryChartData = generateSalaryChartData();

  const handleRemoveSalary = (index: number) => {
    setSalaryHistory(salaryHistory.filter((_, i) => i !== index));
  };

  const handleRecalculate = () => {
    if (onRecalculate) {
      // Przygotuj zaktualizowane dane
      const yearlySalaries: { [year: number]: number } = {};
      salaryHistory.forEach((entry) => {
        yearlySalaries[entry.year] = entry.amount;
      });

      const updatedInput: SimulationInput = {
        ...initialInput,
        yearlySalaries:
          Object.keys(yearlySalaries).length > 0 ? yearlySalaries : undefined,
      };

      // Wywołaj callback - ResultsScreen obsłuży API call
      onRecalculate(updatedInput);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-2 border-zus-green rounded-lg p-3 shadow-lg">
          <p className="font-bold text-zus-darkblue mb-2">
            Rok {payload[0].payload.year}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-br from-zus-blue/5 to-white dark:from-zus-blue/10 dark:to-gray-800 border-l-4 border-zus-blue">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <h3 className="text-2xl font-bold text-zus-darkblue dark:text-white">
              Dashboard zaawansowany
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Dostosuj parametry i zobacz szczegółowe prognozy
            </p>
          </div>
        </div>
      </div>

      {/* Wykres timeline */}
      <section className="card bg-white dark:bg-gray-800">
        <h4 className="text-xl font-bold text-zus-darkblue dark:text-white mb-4">
          Prognoza wzrostu środków na kontach ZUS
        </h4>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={timelineData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="year"
              tick={{ fill: "#374151", fontSize: 12 }}
              label={{
                value: "Rok",
                position: "insideBottom",
                offset: -5,
                style: { fill: "#6b7280" },
              }}
            />
            <YAxis
              tick={{ fill: "#374151", fontSize: 12 }}
              label={{
                value: "Zgromadzone środki (PLN)",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#6b7280" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Line
              type="monotone"
              dataKey="konto"
              name="Konto główne"
              stroke="rgb(0, 153, 63)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="subkonto"
              name="Subkonto"
              stroke="rgb(63, 132, 210)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Wynagrodzenia roczne z wykresem */}
      <section className="card bg-white dark:bg-gray-800">
        <h4 className="text-xl font-bold text-zus-darkblue dark:text-white mb-4">
          Wynagrodzenia roczne
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Poniżej przedstawiamy prognozę Twoich wynagrodzeń z 4% rocznym wzrostem.
          Możesz edytować poszczególne lata w szczegółach poniżej.
        </p>

        {/* Wykres wynagrodzeń */}
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={salaryChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="year"
                tick={{ fill: "#374151", fontSize: 12 }}
                label={{
                  value: "Rok",
                  position: "insideBottom",
                  offset: -5,
                  style: { fill: "#6b7280" },
                }}
              />
              <YAxis
                tick={{ fill: "#374151", fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                label={{
                  value: "Wynagrodzenie (PLN)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#6b7280" },
                }}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Rok ${label}`}
              />
              <Line
                type="monotone"
                dataKey="salary"
                name="Wynagrodzenie"
                stroke="rgb(209, 166, 63)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "rgb(209, 166, 63)", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Accordion do edycji szczegółów */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={() => setSalaryExpanded(!salaryExpanded)}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-expanded={salaryExpanded}
            aria-controls="salary-details"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">📝</span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Edytuj poszczególne wynagrodzenia per rok
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({salaryHistory.length > 0 ? `${salaryHistory.length} dostosowanych` : 'wszystkie domyślne'})
              </span>
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                salaryExpanded ? 'rotate-180' : ''
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
          </button>

          {salaryExpanded && (
            <div id="salary-details" className="mt-4 space-y-4">
              {/* Automatyczne pola dla każdego roku */}
              <div className="grid gap-3">
                {Array.from(
                  {
                    length:
                      initialInput.workEndYear - initialInput.workStartYear + 1,
                  },
                  (_, i) => {
                    const year = initialInput.workStartYear + i;
                    const currentYear = new Date().getFullYear();
                    const yearsFromNow = currentYear - year;
                    const defaultSalary =
                      yearsFromNow >= 0
                        ? initialInput.grossSalary /
                          Math.pow(1.04, yearsFromNow)
                        : initialInput.grossSalary *
                          Math.pow(1.04, Math.abs(yearsFromNow));

                     const existingEntry = salaryHistory.find(
                       (entry) => entry.year === year
                     );

                     return (
                       <div
                         key={year}
                         className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                       >
                         <div className="w-20 text-sm font-medium text-gray-700">
                           {year}
                         </div>
                         <div className="flex-1">
                           <input
                             type="number"
                             value={existingEntry ? existingEntry.amount : ""}
                             onChange={(e) => {
                               const newValue = parseFloat(e.target.value) || 0;
                               if (newValue > 0) {
                                 const updatedHistory = salaryHistory.filter(
                                   (entry) => entry.year !== year
                                 );
                                 setSalaryHistory(
                                   [
                                     ...updatedHistory,
                                     { year, amount: newValue },
                                   ].sort((a, b) => a.year - b.year)
                                 );
                               } else if (e.target.value === "") {
                                 // Pozwól na puste pole podczas edycji
                                 const updatedHistory = salaryHistory.filter(
                                   (entry) => entry.year !== year
                                 );
                                 setSalaryHistory(updatedHistory);
                               } else {
                                 // Usuń wpis jeśli wartość jest 0 lub nieprawidłowa
                                 setSalaryHistory(
                                   salaryHistory.filter(
                                     (entry) => entry.year !== year
                                   )
                                 );
                               }
                             }}
                             onBlur={(e) => {
                               // Jeśli pole jest puste po odkliknięciu, przywróć domyślną wartość
                               if (
                                 e.target.value === "" ||
                                 parseFloat(e.target.value) <= 0
                               ) {
                                 const updatedHistory = salaryHistory.filter(
                                   (entry) => entry.year !== year
                                 );
                                 setSalaryHistory(updatedHistory);
                               }
                             }}
                             className="input-field w-full"
                             min="0"
                             step="100"
                             placeholder={`${Math.round(defaultSalary)}`}
                           />
                         </div>
                         {existingEntry && (
                           <div className="text-xs text-green-600 w-24">
                             Dostosowane
                           </div>
                         )}
                         {existingEntry && (
                           <button
                             onClick={() =>
                               setSalaryHistory(
                                 salaryHistory.filter(
                                   (entry) => entry.year !== year
                                 )
                               )
                             }
                             className="text-zus-red hover:text-red-700 font-semibold text-sm"
                             aria-label={`Przywróć domyślną wartość dla roku ${year}`}
                           >
                             Reset
                           </button>
                         )}
                       </div>
                     );
                  }
                )}
              </div>

              {/* Informacja o domyślnych wartościach */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>💡 Jak to działa:</strong> Domyślne wartości są
                  obliczane z 4% rocznym wzrostem wynagrodzeń. Jeśli dostosujesz
                  konkretny rok, symulator użyje Twojej wartości zamiast
                  obliczonej.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Przycisk przelicz ponownie */}
      {salaryHistory.length > 0 && (
        <div className="flex flex-col items-center gap-3 pt-4">
          <button
            onClick={handleRecalculate}
            className="btn-primary text-lg px-8 py-4"
          >
            🔄 Przelicz ponownie z nowymi danymi
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Uwaga: Zaawansowane przeliczenia uwzględnią podane przez Ciebie
            szczegółowe dane.
          </p>
        </div>
      )}
    </div>
  );
}

