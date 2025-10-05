'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PENSION_GROUPS, getRandomFunFact } from '@/lib/mockData';
import { formatCurrency } from '@/utils/formatters';
import AnimatedCounter from './AnimatedCounter';
import type { FunFact } from "@/types";

interface LandingScreenProps {
  onStartSimulation: () => void;
  onDesiredPensionChange?: (amount: number | undefined) => void;
  desiredPension?: number;
}

export default function LandingScreen({
  onStartSimulation,
  onDesiredPensionChange,
  desiredPension,
}: LandingScreenProps) {
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
    const numValue = value === "" ? undefined : parseFloat(value);
    if (onDesiredPensionChange) {
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
      className={`space-y-6 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="region"
      aria-label="Strona główna symulatora emerytalnego"
    >
      {/* Hero Section - 2 kolumny: wykres + CTA */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
        {/* LEWA: Wykres grup emerytalnych */}
        <div className="card order-2 lg:order-1 transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-2xl font-bold text-zus-darkblue dark:text-white mb-2 text-center">
            Grupy emerytalne w Polsce
          </h2>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
            Najedź kursorem na słupek, aby zobaczyć szczegóły
          </p>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={PENSION_GROUPS}
              margin={{ top: 20, right: 15, left: 10, bottom: 15 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={90}
                tick={{ fill: "#6b7280", fontSize: 11 }}
                interval={0}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 11 }}
                label={{
                  value: "Emerytura (PLN)",
                  angle: -90,
                  position: "center",
                  dx: -20,
                  style: { fill: "#6b7280", fontWeight: "600", textAnchor: "middle", fontSize: 12 },
                }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(0, 153, 63, 0.1)" }}
              />
              <Bar
                dataKey="amount"
                radius={[6, 6, 0, 0]}
                animationDuration={1000}
              >
                {PENSION_GROUPS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
            {PENSION_GROUPS.map((group) => (
              <div key={group.id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: group.color }}
                  aria-hidden="true"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300">{group.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PRAWA: CTA z tytułem */}
        <div className="order-1 lg:order-2 flex flex-col justify-center">
          <div className="space-y-6">
            <div className="relative">
              {/* Gradient orb za tytułem */}
              <div 
                className="gradient-orb hidden sm:block"
                style={{
                  width: '400px',
                  height: '400px',
                  background: 'radial-gradient(circle, rgba(0, 153, 63, 0.3) 0%, rgba(63, 132, 210, 0.2) 50%, transparent 70%)',
                  top: '-100px',
                  right: '-100px',
                }}
                aria-hidden="true"
              />
              {/* Dark mode gradient orb - stronger */}
              <div 
                className="gradient-orb hidden sm:dark:block"
                style={{
                  width: '400px',
                  height: '400px',
                  background: 'radial-gradient(circle, rgba(255, 179, 79, 0.2) 0%, rgba(0, 153, 63, 0.15) 50%, transparent 70%)',
                  top: '-100px',
                  right: '-100px',
                }}
                aria-hidden="true"
              />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-zus-darkblue dark:text-white mb-4 leading-tight relative">
                Jaką emeryturę chciałbyś
                <br />
                <span className="gradient-text">mieć w przyszłości?</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
                Poznaj swoją prognozę i zaplanuj przyszłość finansową
              </p>
            </div>

            {/* Input oczekiwanej emerytury */}
            <div>
              <label
                htmlFor="desired-pension"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
              >
                Wprowadź oczekiwaną kwotę (opcjonalnie):
              </label>
              <div className="relative group">
                <input
                  id="desired-pension"
                  type="number"
                  value={desiredPension || ""}
                  onChange={handleDesiredPensionChange}
                  placeholder="np. 5000"
                  className="input-field text-center text-2xl font-semibold pr-16 group-hover:ring-2 group-hover:ring-zus-green/20 dark:group-hover:ring-zus-gold/20 transition-all"
                  min="0"
                  step="100"
                  aria-label="Oczekiwana kwota emerytury"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold">
                  PLN
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Średnia emerytura w Polsce:{" "}
                <span className="font-bold text-zus-green dark:text-zus-gold text-lg">3 500 PLN</span>
              </p>
            </div>

            {/* CTA Button */}
            <div>
              <button
                onClick={handleStartClick}
                className="btn-primary btn-pulse text-xl px-12 py-4 w-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                aria-label="Rozpocznij symulację emerytury"
              >
                Rozpocznij symulację 🚀
              </button>
            </div>

            {/* Quick Info badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-xs">
              <div className="badge-lift flex items-center gap-1 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full cursor-default">
                <svg className="w-4 h-4 text-zus-green dark:text-zus-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">100% bezpieczne</span>
              </div>
              <div className="badge-lift flex items-center gap-1 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full cursor-default">
                <svg className="w-4 h-4 text-zus-green dark:text-zus-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Wynik w 2 minuty</span>
              </div>
              <div className="badge-lift flex items-center gap-1 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full cursor-default">
                <svg className="w-4 h-4 text-zus-green dark:text-zus-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                <span className="font-medium">Bez rejestracji</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sekcja "Czy wiesz, że..." - pasek na całą szerokość */}
      <section className="relative overflow-hidden -mx-4 px-4">
        <div className="bg-gradient-to-r from-zus-gold/10 via-zus-green/10 to-zus-blue/10 dark:from-zus-gold/5 dark:via-zus-green/5 dark:to-zus-blue/5 border-y-2 border-zus-gold/30 dark:border-zus-gold/20 py-4 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="text-3xl flex-shrink-0" aria-hidden="true">
                💡
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg md:text-xl font-bold text-zus-darkblue dark:text-white mb-1 inline-flex items-center gap-2">
                  <span>Czy wiesz, że...</span>
                  {funFact?.category && (
                    <span className="px-3 py-1 bg-zus-green/20 dark:bg-zus-gold/20 text-zus-green dark:text-zus-gold text-xs font-semibold rounded-full">
                      {funFact.category}
                    </span>
                  )}
                </h3>
                {funFact ? (
                  <p
                    className="text-sm md:text-base text-gray-800 dark:text-gray-100 leading-relaxed transition-opacity duration-500"
                    key={funFact.id}
                  >
                    {funFact.text}
                  </p>
                ) : (
                  <div className="text-sm md:text-base text-gray-800 dark:text-gray-100 leading-relaxed">
                    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 rounded mb-2"></div>
                    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 rounded w-3/4"></div>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => setFunFact(getRandomFunFact())}
                  className="text-sm text-zus-blue dark:text-zus-gold hover:text-zus-darkblue dark:hover:text-zus-gold/80 font-semibold underline transition-all hover:translate-x-1 whitespace-nowrap"
                  aria-label="Pokaż kolejny fakt"
                >
                  Zobacz kolejny fakt →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statystyki ZUS - dodatkowa sekcja informacyjna z animowanymi licznikami */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center bg-white dark:bg-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-default">
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">👥</div>
          <p className="text-3xl font-bold text-zus-green dark:text-zus-gold mb-2">
            <AnimatedCounter end={9} decimals={1} suffix=" mln+" />
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Emerytów i rencistów w Polsce</p>
        </div>
        <div className="card text-center bg-white dark:bg-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-default">
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">📈</div>
          <p className="text-3xl font-bold text-zus-blue dark:text-zus-gold mb-2">
            <AnimatedCounter end={35} suffix=" lat" />
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Średni staż pracy w Polsce</p>
        </div>
        <div className="card text-center bg-white dark:bg-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-default">
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">💰</div>
          <p className="text-3xl font-bold text-zus-darkblue dark:text-white mb-2">
            <AnimatedCounter end={60} suffix="%" />
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Średnia stopa zastąpienia</p>
        </div>
      </section>
    </div>
  );
}

