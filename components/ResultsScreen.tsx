'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import AdvancedDashboard from './AdvancedDashboard';
import GapAnalysis from './GapAnalysis';
import SmartSuggestions from './SmartSuggestions';
import ScenarioComparer from './ScenarioComparer';
import type { SimulationResult, SimulationInput } from '@/types';
import { formatCurrency, formatPercent, validatePostalCode } from '@/utils/formatters';
import { generatePDF, saveSimulationToLocalStorage } from '@/lib/pdf';
import { RETIREMENT_AGE } from '@/lib/constants';

interface ResultsScreenProps {
  result: SimulationResult;
  input: SimulationInput;
}

export default function ResultsScreen({ result, input }: ResultsScreenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [postalCodeError, setPostalCodeError] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    // Fade-in animation
    setIsVisible(true);
  }, []);

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPostalCode(value);
    
    if (value && !validatePostalCode(value)) {
      setPostalCodeError('Format: XX-XXX (np. 00-950)');
    } else {
      setPostalCodeError('');
    }
  };

  const handleGeneratePDF = () => {
    setIsGeneratingPDF(true);
    
    try {
      // Zapisz w localStorage
      saveSimulationToLocalStorage(input, result, postalCode || undefined);
      
      // Generuj PDF
      generatePDF(input, result, postalCode || undefined);
      
      // Pokaż komunikat sukcesu
      setTimeout(() => {
        setIsGeneratingPDF(false);
        alert('✓ Raport PDF został pobrany!');
      }, 500);
    } catch (error) {
      console.error('Błąd generowania PDF:', error);
      setIsGeneratingPDF(false);
      alert('Wystąpił błąd podczas generowania raportu PDF');
    }
  };

  // Dane do wykresu porównawczego
  const comparisonData = [
    {
      name: 'Twoja emerytura',
      value: result.nominalPension,
      color: 'rgb(0, 153, 63)', // zus-green
    },
    {
      name: 'Średnia krajowa',
      value: result.averagePension,
      color: 'rgb(63, 132, 210)', // zus-blue
    },
  ];

  // Dane do tabeli scenariuszy
  const scenarios = [
    { label: 'Obecnie', years: 0, pension: result.nominalPension },
    { label: 'Za 1 rok', years: 1, pension: result.laterRetirementScenarios.plusOneYear },
    { label: 'Za 2 lata', years: 2, pension: result.laterRetirementScenarios.plusTwoYears },
    { label: 'Za 5 lat', years: 5, pension: result.laterRetirementScenarios.plusFiveYears },
  ];

  return (
    <div 
      className={`space-y-8 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      role="region"
      aria-label="Wyniki symulacji emerytalnej"
    >
      {/* Nagłówek */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-zus-darkblue mb-2">
          Twoja prognoza emerytalna
        </h2>
        <p className="text-gray-600">
          Rok przejścia na emeryturę: <span className="font-bold text-zus-green">{result.retirementYear}</span>
        </p>
      </div>

      {/* Główne karty - Emerytura nominalna i realna */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emerytura Nominalna */}
        <div className="card bg-gradient-to-br from-zus-green/5 to-white border-2 border-zus-green">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-zus-darkblue mb-1">
                Emerytura Nominalna
              </h3>
              <p className="text-sm text-gray-600">
                Wartość w przyszłości
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
          <p className="text-4xl md:text-5xl font-bold text-zus-green mb-2">
            {formatCurrency(result.nominalPension)}
          </p>
          <p className="text-xs text-gray-500">
            Kwota miesięczna, jaką otrzymasz w {result.retirementYear} roku
          </p>
        </div>

        {/* Emerytura Realna */}
        <div className="card bg-gradient-to-br from-zus-blue/5 to-white border-2 border-zus-blue">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-zus-darkblue mb-1">
                Emerytura Realna
              </h3>
              <p className="text-sm text-gray-600">
                Siła nabywcza dzisiaj
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
          <p className="text-4xl md:text-5xl font-bold text-zus-blue mb-2">
            {formatCurrency(result.realPension)}
          </p>
          <p className="text-xs text-gray-500">
            Wartość skorygowana o inflację (~2% rocznie)
          </p>
        </div>
      </div>

      {/* Stopa zastąpienia */}
      <div className="card bg-gradient-to-br from-zus-gold/10 to-white border-l-4 border-zus-gold">
        <div className="flex items-center gap-4">
          <div className="text-5xl">📈</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-zus-darkblue mb-2">
              Stopa zastąpienia: {formatPercent(result.replacementRate)}
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              Stosunek Twojej emerytury do ostatniego wynagrodzenia przed przejściem na emeryturę.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-zus-green h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(result.replacementRate * 100, 100)}%` }}
                  role="progressbar"
                  aria-valuenow={result.replacementRate * 100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <span className="text-sm font-semibold text-zus-darkblue">
                {(result.replacementRate * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {result.replacementRate >= 0.7 
                ? '✅ Bardzo dobra stopa zastąpienia!' 
                : result.replacementRate >= 0.55
                ? '✓ Dobra stopa zastąpienia'
                : '⚠️ Rozważ dłuższą pracę lub dodatkowe oszczędności'}
            </p>
          </div>
        </div>
      </div>

      {/* Wykres porównawczy */}
      <div className="card">
        <h3 className="text-2xl font-bold text-zus-darkblue mb-6">
          Porównanie z średnią krajową
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={comparisonData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#374151', fontSize: 14 }}
              axisLine={{ stroke: '#9ca3af' }}
            />
            <YAxis 
              tick={{ fill: '#374151', fontSize: 12 }}
              axisLine={{ stroke: '#9ca3af' }}
              label={{ value: 'PLN', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '2px solid rgb(0, 153, 63)',
                borderRadius: '8px',
                padding: '12px'
              }}
              formatter={(value: number) => [formatCurrency(value), 'Emerytura']}
              labelStyle={{ color: 'rgb(0, 65, 110)', fontWeight: 'bold' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="value" 
              name="Miesięczna emerytura"
              radius={[8, 8, 0, 0]}
            >
              {comparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {result.nominalPension > result.averagePension ? (
              <span className="text-zus-green font-semibold">
                ✓ Twoja emerytura jest wyższa od średniej o {formatCurrency(result.nominalPension - result.averagePension)}
              </span>
            ) : (
              <span className="text-zus-red font-semibold">
                Twoja emerytura jest niższa od średniej o {formatCurrency(result.averagePension - result.nominalPension)}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Scenariusze późniejszego przejścia na emeryturę */}
      <div className="card">
        <h3 className="text-2xl font-bold text-zus-darkblue mb-4">
          Co jeśli pracujesz dłużej?
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Każdy dodatkowy rok pracy zwiększa Twoją emeryturę dzięki:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 mb-6 space-y-1">
          <li>Dodatkowym składkom emerytalnym</li>
          <li>Krótszemu okresowi wypłaty emerytury</li>
          <li>Wyższej podstawie obliczeniowej</li>
        </ul>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zus-green/10 border-b-2 border-zus-green">
                <th className="px-4 py-3 text-left text-sm font-semibold text-zus-darkblue">
                  Scenariusz
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zus-darkblue">
                  Dodatkowe lata pracy
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-zus-darkblue">
                  Miesięczna emerytura
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-zus-darkblue">
                  Wzrost
                </th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario, index) => {
                const increase = scenario.pension - result.nominalPension;
                const increasePercent = (increase / result.nominalPension) * 100;
                
                return (
                  <tr 
                    key={index}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      index === 0 ? 'bg-zus-blue/5 font-semibold' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {scenario.label}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {scenario.years === 0 ? '—' : `+${scenario.years} ${scenario.years === 1 ? 'rok' : 'lata/lat'}`}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-zus-darkblue">
                      {formatCurrency(scenario.pension)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      {scenario.years === 0 ? (
                        <span className="text-gray-400">—</span>
                      ) : (
                        <span className="text-zus-green font-semibold">
                          +{formatCurrency(increase)} ({increasePercent.toFixed(1)}%)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Porównanie z celem */}
      {input.desiredPension && (
        <div className="card bg-gradient-to-br from-zus-blue/5 to-white border-l-4 border-zus-blue">
          <h3 className="text-2xl font-bold text-zus-darkblue mb-4">
            Porównanie z Twoim celem
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Twoja prognozowana emerytura:</p>
              <p className="text-3xl font-bold text-zus-green">
                {formatCurrency(result.nominalPension)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Twój cel:</p>
              <p className="text-3xl font-bold text-zus-blue">
                {formatCurrency(input.desiredPension)}
              </p>
            </div>
          </div>
          
          {result.nominalPension >= input.desiredPension ? (
            <div className="bg-zus-green/10 border border-zus-green rounded-lg p-4">
              <p className="text-zus-green font-bold text-lg mb-2">
                🎉 Gratulacje! Osiągniesz swój cel!
              </p>
              <p className="text-sm text-gray-700">
                Twoja prognozowana emerytura przekracza Twoje oczekiwania o{' '}
                <span className="font-semibold">
                  {formatCurrency(result.nominalPension - input.desiredPension)}
                </span>.
              </p>
            </div>
          ) : (
            <div className="bg-zus-gold/10 border border-zus-gold rounded-lg p-4">
              <p className="text-zus-darkblue font-bold text-lg mb-2">
                📊 Aby osiągnąć swój cel...
              </p>
              {result.yearsNeededForGoal !== undefined && result.yearsNeededForGoal > 0 ? (
                <p className="text-sm text-gray-700 mb-2">
                  Musisz pracować o{' '}
                  <span className="font-bold text-zus-red text-lg">
                    {result.yearsNeededForGoal} {result.yearsNeededForGoal === 1 ? 'rok' : 'lata/lat'}
                  </span>{' '}
                  dłużej, aby osiągnąć emeryturę w wysokości {formatCurrency(input.desiredPension)}.
                </p>
              ) : (
                <p className="text-sm text-gray-700 mb-2">
                  Różnica wynosi {formatCurrency(input.desiredPension - result.nominalPension)}.
                </p>
              )}
              <p className="text-xs text-gray-600 mt-3">
                💡 Rozważ także dodatkowe oszczędności w III filarze (IKE, IKZE) lub dłuższą pracę.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Wpływ zwolnień lekarskich */}
      {result.sickLeaveImpact && (
        <div className="card bg-gradient-to-br from-zus-red/5 to-white border-l-4 border-zus-red">
          <h3 className="text-2xl font-bold text-zus-darkblue mb-4">
            Wpływ zwolnień lekarskich
          </h3>
          <div className="flex items-start gap-4">
            <div className="text-4xl">🏥</div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 mb-4">
                Uwzględniliśmy średnią liczbę dni zwolnienia lekarskiego:{' '}
                <span className="font-semibold">
                  {input.sex === 'male' ? '12 dni/rok (mężczyźni)' : '16 dni/rok (kobiety)'}
                </span>
              </p>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Strata w emeryturze:</p>
                    <p className="text-2xl font-bold text-zus-red">
                      {formatCurrency(result.sickLeaveImpact.difference)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">miesięcznie</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Procent zmniejszenia:</p>
                    <p className="text-2xl font-bold text-zus-darkblue">
                      {((result.sickLeaveImpact.difference / result.nominalPension) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">całkowitej emerytury</p>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mt-4">
                💡 Podczas zwolnienia lekarskiego składki emerytalne są niższe (80% podstawy), co wpływa na wysokość przyszłej emerytury.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard zaawansowany */}
      <AdvancedDashboard 
        initialInput={input}
        onRecalculate={(updatedInput) => {
          console.log('Przeliczanie z nowymi danymi:', updatedInput);
          // Tutaj możesz dodać logikę wywołania API z nowymi parametrami
        }}
      />

      {/* ===== NOWE SEKCJE: Przystępna edukacja emerytalna ===== */}
      
      {/* Gap Analysis - Analiza luki do celu */}
      {input.desiredPension && (
        <GapAnalysis
          currentPension={result.nominalPension}
          targetPension={input.desiredPension}
        />
      )}

      {/* Smart Suggestions - Personalizowane sugestie */}
      {input.desiredPension && (
        <SmartSuggestions
          currentPension={result.nominalPension}
          targetPension={input.desiredPension}
          currentSalary={input.grossSalary}
          age={input.age}
          retirementAge={RETIREMENT_AGE[input.sex]}
        />
      )}

      {/* Scenario Comparer - Porównanie scenariuszy */}
      <ScenarioComparer
        currentPension={result.nominalPension}
        currentSalary={input.grossSalary}
        targetPension={input.desiredPension}
      />

      {/* Timeline Visualizer - Ścieżka do celu */}
      {input.desiredPension && (
        <TimelineVisualizer
          currentAge={input.age}
          retirementAge={RETIREMENT_AGE[input.sex]}
          currentPension={result.nominalPension}
          targetPension={input.desiredPension}
          currentSalary={input.grossSalary}
        />
      )}

      {/* Kod pocztowy i pobieranie PDF */}
      <div className="card bg-gradient-to-br from-zus-gold/10 to-white border-l-4 border-zus-gold">
        <h3 className="text-2xl font-bold text-zus-darkblue mb-4">
          Pobierz raport PDF
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Zapisz szczegółowy raport z wynikami symulacji w formacie PDF. 
          Opcjonalnie możesz podać kod pocztowy (dane wykorzystywane do analiz regionalnych ZUS).
        </p>

        {/* Pole kodu pocztowego */}
        <div className="mb-6">
          <label htmlFor="postal-code" className="label">
            Kod pocztowy (opcjonalnie)
          </label>
          <input
            id="postal-code"
            type="text"
            value={postalCode}
            onChange={handlePostalCodeChange}
            placeholder="np. 00-950"
            maxLength={6}
            className={`input-field max-w-xs ${postalCodeError ? 'border-zus-red' : ''}`}
            aria-invalid={postalCodeError ? 'true' : 'false'}
            aria-describedby={postalCodeError ? 'postal-code-error postal-code-help' : 'postal-code-help'}
          />
          {postalCodeError && (
            <p id="postal-code-error" className="text-zus-red text-sm mt-1" role="alert">
              {postalCodeError}
            </p>
          )}
          <p id="postal-code-help" className="text-xs text-gray-500 mt-1">
            Format: XX-XXX (np. 00-950). Dane są anonimowe i służą do analiz regionalnych.
          </p>
        </div>

        {/* Przycisk pobierz PDF */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <button
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF || (postalCode !== '' && !!postalCodeError)}
            className="btn-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generowanie...
              </span>
            ) : (
              '📄 Pobierz raport PDF'
            )}
          </button>
          
          <p className="text-xs text-gray-500">
            Raport zawiera wszystkie dane i wyniki symulacji
          </p>
        </div>
      </div>

      {/* Podsumowanie i CTA */}
      <div className="card bg-gradient-to-r from-zus-green to-zus-blue text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-3">
            Dziękujemy za skorzystanie z symulatora!
          </h3>
          <p className="text-sm mb-6 opacity-90">
            Zaplanuj swoją przyszłość emerytalną już dziś
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              className="bg-white text-zus-green px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              🔄 Nowa symulacja
            </button>
            <a
              href="https://www.zus.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/40 text-center"
            >
              🌐 Odwiedź ZUS.pl
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

