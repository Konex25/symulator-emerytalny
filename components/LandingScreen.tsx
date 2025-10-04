'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PENSION_GROUPS, getRandomFunFact } from '@/lib/mockData';
import { formatCurrency } from '@/utils/formatters';
import type { FunFact } from "@/types";

interface LandingScreenProps {
  onStartSimulation: () => void;
  onDesiredPensionChange?: (amount: number) => void;
}

export default function LandingScreen({
  onStartSimulation,
  onDesiredPensionChange,
}: LandingScreenProps) {
  const [desiredPension, setDesiredPension] = useState<string>("");
  const [funFact, setFunFact] = useState<FunFact | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade-in animation
    setIsVisible(true);

    // Initialize fun fact on client side to avoid hydration mismatch
    setFunFact(getRandomFunFact());

    // Losuj nowy fakt co 10 sekund
    const interval = setInterval(() => {
      setFunFact(getRandomFunFact());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleDesiredPensionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setDesiredPension(value);

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0 && onDesiredPensionChange) {
      onDesiredPensionChange(numValue);
    }
  };

  const handleStartClick = () => {
    onStartSimulation();
  };

  // Custom tooltip dla wykresu
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border-2 border-zus-green rounded-lg p-4 shadow-lg max-w-xs">
          <p className="font-bold text-zus-darkblue mb-2">{data.name}</p>
          <p className="text-2xl font-bold text-zus-green mb-2">
            {formatCurrency(data.amount)}
          </p>
          <p className="text-sm text-gray-700 leading-snug">
            {data.description}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`space-y-16 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="region"
      aria-label="Strona główna symulatora emerytalnego"
    >
      {/* Hero Section */}
      <section className="text-center py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-zus-darkblue mb-4 leading-tight">
            Jaką emeryturę chciałbyś
            <br />
            mieć w przyszłości?
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Poznaj swoją prognozę i zaplanuj przyszłość finansową
          </p>
        </div>

        {/* Input oczekiwanej emerytury */}
        <div className="max-w-md mx-auto mb-6">
          <label
            htmlFor="desired-pension"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Wprowadź oczekiwaną kwotę (opcjonalnie):
          </label>
          <div className="relative">
            <input
              id="desired-pension"
              type="number"
              value={desiredPension}
              onChange={handleDesiredPensionChange}
              placeholder="np. 5000"
              className="input-field text-center text-2xl font-semibold pr-16"
              min="0"
              step="100"
              aria-label="Oczekiwana kwota emerytury"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
              PLN
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Średnia emerytura w Polsce wynosi{" "}
          <span className="font-bold text-zus-green text-lg">3 500 PLN</span>
        </p>

        {/* CTA Button */}
        <div className="mt-8">
          <button
            onClick={handleStartClick}
            className="btn-primary text-xl px-12 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            aria-label="Rozpocznij symulację emerytury"
          >
            Rozpocznij symulację 🚀
          </button>
        </div>
      </section>

      {/* Wykres grup emerytalnych */}
      <section className="card">
        <h2 className="text-3xl font-bold text-zus-darkblue mb-4 text-center">
          Grupy emerytalne w Polsce
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Najedź kursorem na słupek, aby zobaczyć szczegóły każdej grupy
        </p>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={PENSION_GROUPS}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: "#374151", fontSize: 12 }}
              interval={0}
            />
            <YAxis
              tick={{ fill: "#374151", fontSize: 12 }}
              label={{
                value: "Miesięczna emerytura (PLN)",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#374151", fontWeight: "bold" },
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0, 153, 63, 0.1)" }}
            />
            <Bar
              dataKey="amount"
              radius={[8, 8, 0, 0]}
              animationDuration={1000}
            >
              {PENSION_GROUPS.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
          {PENSION_GROUPS.map((group) => (
            <div key={group.id} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: group.color }}
                aria-hidden="true"
              />
              <span className="text-xs text-gray-700">{group.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Sekcja "Czy wiesz, że..." */}
      <section className="relative overflow-hidden">
        <div className="card bg-gradient-to-br from-zus-gold/20 via-white to-zus-blue/10 border-2 border-zus-gold">
          <div className="flex items-start gap-4">
            <div className="text-5xl flex-shrink-0" aria-hidden="true">
              💡
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-zus-darkblue mb-3">
                Czy wiesz, że...
              </h3>
              {funFact ? (
                <>
                  <p
                    className="text-lg text-gray-800 leading-relaxed transition-opacity duration-500"
                    key={funFact.id}
                  >
                    {funFact.text}
                  </p>
                  {funFact.category && (
                    <span className="inline-block mt-3 px-3 py-1 bg-zus-green/10 text-zus-green text-xs font-semibold rounded-full">
                      {funFact.category}
                    </span>
                  )}
                </>
              ) : (
                <div className="text-lg text-gray-800 leading-relaxed">
                  <div className="animate-pulse bg-gray-200 h-6 rounded mb-2"></div>
                  <div className="animate-pulse bg-gray-200 h-6 rounded w-3/4"></div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => setFunFact(getRandomFunFact())}
              className="text-sm text-zus-blue hover:text-zus-darkblue font-semibold underline transition-colors"
              aria-label="Pokaż kolejny fakt"
            >
              Zobacz kolejny fakt →
            </button>
          </div>
        </div>
      </section>

      {/* Statystyki ZUS - dodatkowa sekcja informacyjna */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center bg-gradient-to-br from-zus-green/5 to-white">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-3xl font-bold text-zus-green mb-2">9 mln+</p>
          <p className="text-sm text-gray-600">Emerytów i rencistów w Polsce</p>
        </div>
        <div className="card text-center bg-gradient-to-br from-zus-blue/5 to-white">
          <div className="text-4xl mb-3">📈</div>
          <p className="text-3xl font-bold text-zus-blue mb-2">35 lat</p>
          <p className="text-sm text-gray-600">Średni staż pracy w Polsce</p>
        </div>
        <div className="card text-center bg-gradient-to-br from-zus-gold/5 to-white">
          <div className="text-4xl mb-3">💰</div>
          <p className="text-3xl font-bold text-zus-darkblue mb-2">60%</p>
          <p className="text-sm text-gray-600">Średnia stopa zastąpienia</p>
        </div>
      </section>

      {/* Wezwanie do działania - powtórzone przed formularzem */}
      <section className="card bg-gradient-to-r from-zus-green to-zus-darkblue text-white text-center py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Gotowy, aby poznać swoją przyszłość?
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Wypełnij krótki formularz poniżej i zobacz prognozę swojej emerytury
        </p>
        <div className="flex items-center justify-center gap-2 text-2xl animate-bounce">
          <span>👇</span>
          <span>Przewiń w dół</span>
          <span>👇</span>
        </div>
      </section>
    </div>
  );
}

