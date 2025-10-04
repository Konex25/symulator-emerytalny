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
  const [isExpanded, setIsExpanded] = useState(false);
  const [inflationRate, setInflationRate] = useState(2);
  const [salaryHistory, setSalaryHistory] = useState<SalaryHistory[]>([]);
  const [newSalaryYear, setNewSalaryYear] = useState("");
  const [newSalaryAmount, setNewSalaryAmount] = useState("");

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

  const handleAddSalary = () => {
    if (newSalaryYear && newSalaryAmount) {
      const year = parseInt(newSalaryYear);
      const amount = parseFloat(newSalaryAmount);

      if (!isNaN(year) && !isNaN(amount) && amount > 0) {
        setSalaryHistory(
          [...salaryHistory, { year, amount }].sort((a, b) => a.year - b.year)
        );
        setNewSalaryYear("");
        setNewSalaryAmount("");
      }
    }
  };

  const handleRemoveSalary = (index: number) => {
    setSalaryHistory(salaryHistory.filter((_, i) => i !== index));
  };

  const handleRecalculate = () => {
    if (onRecalculate) {
      // Przygotuj zaktualizowane dane
      const updatedInput: SimulationInput = {
        ...initialInput,
        // Możesz tutaj dodać logikę wykorzystania historii wynagrodzeń
        // i zwolnień do przeliczenia
      };
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
    <div className="card bg-gradient-to-br from-zus-blue/5 to-white">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
        aria-expanded={isExpanded}
        aria-controls="advanced-dashboard-content"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <div className="text-left">
            <h3 className="text-2xl font-bold text-zus-darkblue">
              Dashboard zaawansowany
            </h3>
            <p className="text-sm text-gray-600">
              Dostosuj parametry i zobacz szczegółowe prognozy
            </p>
          </div>
        </div>
        <svg
          className={`w-6 h-6 text-zus-green transition-transform ${
            isExpanded ? "rotate-180" : ""
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

      {isExpanded && (
        <div
          id="advanced-dashboard-content"
          className="space-y-8 mt-6 px-4 pb-4"
        >
          {/* Wykres timeline */}
          <section>
            <h4 className="text-xl font-bold text-zus-darkblue mb-4">
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

          {/* Slider inflacji */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h4 className="text-xl font-bold text-zus-darkblue mb-4">
              Przewidywana inflacja
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                  className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-zus-green"
                  aria-label="Stopa inflacji"
                />
                <div className="text-center min-w-[80px]">
                  <p className="text-3xl font-bold text-zus-green">
                    {inflationRate.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>0%</span>
                <span>2% (domyślnie)</span>
                <span>5%</span>
                <span>10%</span>
              </div>
              <p className="text-sm text-gray-600">
                Inflacja wpływa na realną wartość Twojej przyszłej emerytury.
                Wyższa inflacja oznacza niższą siłę nabywczą.
              </p>
            </div>
          </section>

          {/* Historia wynagrodzeń */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h4 className="text-xl font-bold text-zus-darkblue mb-4">
              Historia wynagrodzeń
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Dodaj konkretne dane o swoich wynagrodzeniach w poszczególnych
              latach.
            </p>

            <div className="space-y-4">
              {/* Formularz dodawania */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="number"
                  placeholder="Rok (np. 2020)"
                  value={newSalaryYear}
                  onChange={(e) => setNewSalaryYear(e.target.value)}
                  className="input-field flex-1"
                  min={initialInput.workStartYear}
                  max={new Date().getFullYear()}
                />
                <input
                  type="number"
                  placeholder="Wynagrodzenie brutto (PLN)"
                  value={newSalaryAmount}
                  onChange={(e) => setNewSalaryAmount(e.target.value)}
                  className="input-field flex-1"
                  min="0"
                  step="100"
                />
                <button
                  onClick={handleAddSalary}
                  className="btn-primary whitespace-nowrap"
                  disabled={!newSalaryYear || !newSalaryAmount}
                >
                  + Dodaj rok
                </button>
              </div>

              {/* Tabela historii */}
              {salaryHistory.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-zus-green/10 border-b-2 border-zus-green">
                        <th className="px-4 py-2 text-left text-sm font-semibold text-zus-darkblue">
                          Rok
                        </th>
                        <th className="px-4 py-2 text-right text-sm font-semibold text-zus-darkblue">
                          Wynagrodzenie brutto
                        </th>
                        <th className="px-4 py-2 text-center text-sm font-semibold text-zus-darkblue">
                          Akcje
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {salaryHistory.map((entry, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 text-sm font-medium">
                            {entry.year}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {formatCurrency(entry.amount)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleRemoveSalary(index)}
                              className="text-zus-red hover:text-red-700 font-semibold text-sm"
                              aria-label={`Usuń wpis z roku ${entry.year}`}
                            >
                              Usuń
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {salaryHistory.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                  Brak wpisów. Dodaj historię swoich wynagrodzeń.
                </p>
              )}
            </div>
          </section>

          {/* Przycisk przelicz ponownie */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleRecalculate}
              className="btn-primary text-lg px-8 py-4"
              disabled={salaryHistory.length === 0 && inflationRate === 2}
            >
              🔄 Przelicz ponownie z nowymi danymi
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Uwaga: Zaawansowane przeliczenia uwzględnią podane przez Ciebie
            szczegółowe dane.
          </p>
        </div>
      )}
    </div>
  );
}

