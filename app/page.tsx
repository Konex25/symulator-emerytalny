'use client';

// Multi-step wizard implementation for pension calculator
import { useState, useEffect } from 'react';
import LandingScreen from '@/components/LandingScreen';
import SimulationForm from '@/components/SimulationForm';
import StepperNavigation, { Step } from '@/components/StepperNavigation';
import StepContainer from '@/components/StepContainer';
import AdvancedDashboard from '@/components/AdvancedDashboard';
import GapAnalysis from '@/components/GapAnalysis';
import SmartSuggestions from '@/components/SmartSuggestions';
import ScenarioComparer from '@/components/ScenarioComparer';
import WhatIfCalculator from '@/components/WhatIfCalculator';
import OvertimeCalculator from '@/components/OvertimeCalculator';
import ExportStep from '@/components/ExportStep';
import type { SimulationResult, SimulationInput } from '@/types';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { RETIREMENT_AGE } from '@/lib/constants';

const STEPS: Step[] = [
  {
    id: 1,
    title: 'Podstawowe dane',
    shortTitle: 'Dane',
    description: 'Wprowadź swoje dane do symulacji',
    icon: '📝',
  },
  {
    id: 2,
    title: 'Szczegóły (opcjonalnie)',
    shortTitle: 'Detale',
    description: 'Dostosuj zaawansowane parametry',
    icon: '🔧',
    optional: true,
  },
  {
    id: 3,
    title: 'Twoja prognoza',
    shortTitle: 'Wynik',
    description: 'Zobacz swoją przyszłą emeryturę',
    icon: '📊',
  },
  {
    id: 4,
    title: 'Twój cel emerytalny',
    shortTitle: 'Cel',
    description: 'Droga do wymarzonych pieniędzy',
    icon: '🎯',
  },
  {
    id: 5,
    title: 'Porównaj scenariusze',
    shortTitle: 'Plan',
    description: 'Znajdź najlepszą strategię',
    icon: '💡',
  },
  {
    id: 6,
    title: 'Eksport wyników',
    shortTitle: 'Export',
    description: 'Zapisz i udostępnij raport',
    icon: '💾',
  },
];

export default function Home() {
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [inputData, setInputData] = useState<SimulationInput | null>(null);
  const [desiredPension, setDesiredPension] = useState<number | undefined>(undefined);
  const [hasDataChanges, setHasDataChanges] = useState(false);
  const [updatedInputFromStep2, setUpdatedInputFromStep2] =
    useState<SimulationInput | null>(null);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleStartSimulation = () => {
    setShowWizard(true);
    setCurrentStep(1);
  };

  const handleDesiredPensionChange = (amount: number | undefined) => {
    setDesiredPension(amount);
  };

  const handleFormSuccess = (
    calculatedResult: SimulationResult,
    input: SimulationInput
  ) => {
    setResult(calculatedResult);
    setInputData(input);
    markStepCompleted(1);
    // Automatically proceed to step 2 (details)
    setCurrentStep(2);
  };

  const handleRecalculate = (
    newResult: SimulationResult,
    newInput: SimulationInput
  ) => {
    setResult(newResult);
    setInputData(newInput);
  };

  const handleAdvancedRecalculate = async (updatedInput: SimulationInput) => {
    try {
      const response = await fetch("/api/calculate-pension", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedInput),
      });

      const data = await response.json();

      if (response.ok && data.result) {
        handleRecalculate(data.result, updatedInput);
      }
    } catch (error) {
      console.error("Error recalculating:", error);
    }
  };

  const handleDataChange = (
    hasChanges: boolean,
    updatedInput: SimulationInput | null
  ) => {
    setHasDataChanges(hasChanges);
    setUpdatedInputFromStep2(updatedInput);
  };

  const markStepCompleted = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const nextStep = async () => {
    // If we're on step 2 and there are data changes, recalculate before moving forward
    if (currentStep === 2 && hasDataChanges && updatedInputFromStep2) {
      await handleAdvancedRecalculate(updatedInputFromStep2);
      setHasDataChanges(false);
      setUpdatedInputFromStep2(null);
    }

    markStepCompleted(currentStep);
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipStep = async () => {
    // If we're on step 2 and there are data changes, recalculate before moving forward
    if (currentStep === 2 && hasDataChanges && updatedInputFromStep2) {
      await handleAdvancedRecalculate(updatedInputFromStep2);
      setHasDataChanges(false);
      setUpdatedInputFromStep2(null);
    }

    markStepCompleted(currentStep);
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleNewSimulation = () => {
    setShowWizard(false);
    setCurrentStep(1);
    setCompletedSteps([]);
    setResult(null);
    setInputData(null);
    setDesiredPension(undefined);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Landing screen (before wizard)
  if (!showWizard) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <LandingScreen
            onStartSimulation={handleStartSimulation}
            onDesiredPensionChange={handleDesiredPensionChange}
            desiredPension={desiredPension}
          />
        </div>
      </div>
    );
  }

  // Wizard screens
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <StepperNavigation
        steps={STEPS}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={goToStep}
        canNavigate={true}
      />

      {/* STEP 1: Basic Form */}
      <StepContainer
        stepNumber={1}
        title="Wprowadź swoje dane"
        description="Zacznijmy od podstawowych informacji"
        isActive={currentStep === 1}
        onNext={() => {
          if (result) {
            nextStep();
          } else {
            alert('Uzupełnij formularz i kliknij "Oblicz prognozę"');
          }
        }}
        isFirstStep={true}
        showNavButtons={false}
      >
        <div className="card max-w-3xl mx-auto">
          <SimulationForm
            onSuccess={handleFormSuccess}
            desiredPension={desiredPension}
            onDesiredPensionChange={handleDesiredPensionChange}
          />
        </div>
      </StepContainer>

      {/* STEP 2: Advanced Options (Optional) */}
      <StepContainer
        stepNumber={2}
        title="Doprecyzuj swoje dane"
        description="Opcjonalnie: dostosuj zaawansowane parametry"
        isActive={currentStep === 2}
        onNext={nextStep}
        onPrev={prevStep}
        onSkip={skipStep}
        canSkip={true}
      >
        {result && inputData && (
          <AdvancedDashboard
            initialInput={inputData}
            onRecalculate={handleAdvancedRecalculate}
            onDataChange={handleDataChange}
          />
        )}
      </StepContainer>

      {/* STEP 3: Basic Results */}
      <StepContainer
        stepNumber={3}
        title="Twoja prognoza emerytalna"
        description={
          result ? `Rok przejścia na emeryturę: ${result.retirementYear}` : ""
        }
        isActive={currentStep === 3}
        onNext={nextStep}
        onPrev={prevStep}
      >
        {result && inputData && (
          <div className="space-y-6">
            {/* Main cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card bg-gradient-to-br from-zus-green/5 to-white dark:from-zus-green/10 dark:to-gray-800 border-2 border-zus-green">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-zus-darkblue dark:text-white">
                    Emerytura Nominalna
                  </h3>
                  <svg
                    className="w-8 h-8 text-zus-green"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-4xl font-bold text-zus-green mb-2">
                  {formatCurrency(result.nominalPension)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kwota bez uwzględnienia inflacji.
                </p>
              </div>

              <div className="card bg-gradient-to-br from-zus-blue/5 to-white dark:from-zus-blue/10 dark:to-gray-800 border-2 border-zus-blue">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-zus-darkblue dark:text-white">
                    Emerytura Realna
                  </h3>
                  <svg
                    className="w-8 h-8 text-zus-blue"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-4xl font-bold text-zus-blue mb-2">
                  {formatCurrency(result.realPension)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kwota skorygowana o przewidywaną inflację (
                  {formatPercent(0.02)} rocznie).
                </p>
              </div>
            </div>

            {/* Replacement rate */}
            <div className="card bg-gradient-to-br from-zus-gold/5 to-white dark:from-zus-gold/10 dark:to-gray-800 border-2 border-zus-gold">
              <h3 className="text-2xl font-bold text-zus-darkblue dark:text-white mb-4">
                Stopa zastąpienia
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <p className="text-5xl font-bold text-zus-gold">
                  {formatPercent(result.replacementRate)}
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  Twoja emerytura będzie stanowić{" "}
                  <span className="font-bold text-zus-gold">
                    {formatPercent(result.replacementRate)}
                  </span>{" "}
                  Twojego ostatniego wynagrodzenia.
                </p>
              </div>
            </div>

            {/* Comparison chart */}
            <div className="card bg-gradient-to-br from-zus-blue/5 to-white dark:from-zus-blue/10 dark:to-gray-800 border-2 border-zus-blue">
              <h3 className="text-2xl font-bold text-zus-darkblue dark:text-white mb-4">
                Porównanie z średnią krajową
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: "Twoja emerytura",
                        value: result.nominalPension,
                        color: "rgb(0, 153, 63)",
                      },
                      {
                        name: "Średnia krajowa",
                        value: result.averagePension,
                        color: "rgb(63, 132, 210)",
                      },
                    ]}
                    margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-gray-200 dark:stroke-gray-700"
                    />
                    <XAxis
                      dataKey="name"
                      className="text-sm text-gray-600 dark:text-gray-400"
                    />
                    <YAxis
                      tickFormatter={formatCurrency}
                      className="text-sm text-gray-600 dark:text-gray-400"
                      label={{
                        value: "Emerytura (PLN)",
                        angle: -90,
                        position: "center",
                        dx: -25,
                        style: { fill: "#6b7280", textAnchor: "middle" },
                      }}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Kwota emerytury">
                      {[
                        {
                          name: "Twoja emerytura",
                          value: result.nominalPension,
                          color: "rgb(0, 153, 63)",
                        },
                        {
                          name: "Średnia krajowa",
                          value: result.averagePension,
                          color: "rgb(63, 132, 210)",
                        },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Investment Options - PPK/IKE/IKZE */}
            <div className="card bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 border-l-4 border-purple-500">
              <h3 className="text-2xl font-bold text-zus-darkblue dark:text-white mb-4">
                💰 Zainwestuj w swoją przyszłość
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Oprócz emerytury z ZUS, możesz budować dodatkowe zabezpieczenie
                emerytalne. Oto najpopularniejsze opcje:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* PPK */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border-2 border-blue-300 dark:border-blue-600 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-center mb-3">
                    <div className="text-4xl mb-2">🏢</div>
                    <div className="font-bold text-lg text-blue-700 dark:text-blue-400">
                      PPK
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Pracownicze Plany Kapitałowe
                    </div>
                  </div>
                  <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                      <span>Twoja wpłata:</span>
                      <span className="font-semibold">2%</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                      <span>Pracodawca:</span>
                      <span className="font-semibold">1.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Razem:</span>
                      <span className="font-bold text-blue-700 dark:text-blue-400">
                        3.5%
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Szacunkowa wartość*
                    </div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {(() => {
                        const years = Math.max(
                          1,
                          RETIREMENT_AGE[inputData.sex] - inputData.age
                        );
                        const monthlyContribution =
                          inputData.grossSalary * 0.035;
                        const annualRate = 0.05;
                        const monthlyRate = annualRate / 12;
                        const months = years * 12;
                        const futureValue =
                          monthlyContribution *
                          ((Math.pow(1 + monthlyRate, months) - 1) /
                            monthlyRate);
                        return formatCurrency(Math.round(futureValue));
                      })()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      przy wpłacie 3.5% wynagrodzenia
                    </div>
                  </div>
                </div>

                {/* IKE */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border-2 border-green-300 dark:border-green-600 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-center mb-3">
                    <div className="text-4xl mb-2">💼</div>
                    <div className="font-bold text-lg text-green-700 dark:text-green-400">
                      IKE
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Indywidualne Konto Emerytalne
                    </div>
                  </div>
                  <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                      <span>Limit 2025:</span>
                      <span className="font-semibold">26 019 zł</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                      <span>Korzyść:</span>
                      <span className="font-semibold text-green-700 dark:text-green-400">
                        0% podatku
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>od zysków</span>
                      <span className="font-bold text-green-700 dark:text-green-400">
                        ✓
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 italic">
                    ** Po 60. roku życia wypłata bez podatku od zysków
                    kapitałowych (19%)
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Szacunkowa wartość*
                    </div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {(() => {
                        const years = Math.max(
                          1,
                          RETIREMENT_AGE[inputData.sex] - inputData.age
                        );
                        const annualContribution = 26019;
                        const annualRate = 0.05;
                        const futureValue =
                          annualContribution *
                          ((Math.pow(1 + annualRate, years) - 1) / annualRate);
                        return formatCurrency(Math.round(futureValue));
                      })()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      przy maksymalnych wpłatach (26 019 zł/rok)
                    </div>
                  </div>
                </div>

                {/* IKZE */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border-2 border-yellow-300 dark:border-yellow-600 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-center mb-3">
                    <div className="text-4xl mb-2">📈</div>
                    <div className="font-bold text-lg text-yellow-700 dark:text-yellow-400">
                      IKZE
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Indywidualne Konto Zabezpieczenia Emerytalnego
                    </div>
                  </div>
                  <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                      <span>Limit 2025:</span>
                      <span className="font-semibold">10 408 zł</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                      <span className="text-xs">(przedsiębiorca:</span>
                      <span className="font-semibold text-xs">15 611 zł)</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                      <span>Odliczenie:</span>
                      <span className="font-semibold text-yellow-700 dark:text-yellow-400">
                        od PIT
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zwrot podatku:</span>
                      <span className="font-bold text-yellow-700 dark:text-yellow-400">
                        1 249 - 3 330 zł
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        (przedsiębiorca:
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        1 873 - 4 996 zł)
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 italic">
                    ** Wpłaty odlicza się od dochodu (zwrot zależy od progu: 12%
                    lub 32%). Po 65. roku życia wypłata z 10% podatkiem
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Szacunkowa wartość*
                    </div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {(() => {
                        const years = Math.max(
                          1,
                          RETIREMENT_AGE[inputData.sex] - inputData.age
                        );
                        const annualContribution = 10408;
                        const annualRate = 0.05;
                        const futureValue =
                          annualContribution *
                          ((Math.pow(1 + annualRate, years) - 1) / annualRate);
                        return formatCurrency(Math.round(futureValue));
                      })()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      przy maksymalnych wpłatach (10 408 zł/rok)
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>💡 Dlaczego warto?</strong> Systematyczne inwestowanie
                  w dodatkowe instrumenty emerytalne może znacząco zwiększyć
                  Twoją przyszłą emeryturę dzięki efektowi procentu składanego.
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  * Szacunki używają wzoru na procent składany przy założeniu 5%
                  rocznej stopy zwrotu. To konserwatywne założenie - historyczne
                  średnie funduszy emerytalnych wynoszą 6-8% rocznie.
                </p>
              </div>
            </div>

            {/* Sick leave impact */}
            {result.sickLeaveImpact && (
              <div className="card bg-gradient-to-br from-zus-red/5 to-white dark:from-zus-red/10 dark:to-gray-800 border-l-4 border-zus-red">
                <h3 className="text-2xl font-bold text-zus-darkblue dark:text-white mb-4">
                  Wpływ zwolnień lekarskich
                </h3>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🏥</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      Uwzględniliśmy średnią liczbę dni zwolnienia lekarskiego:{" "}
                      <span className="font-semibold">
                        {inputData.sex === "male"
                          ? "12 dni/rok (mężczyźni)"
                          : "16 dni/rok (kobiety)"}
                      </span>
                    </p>

                    <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Strata w emeryturze:
                          </p>
                          <p className="text-2xl font-bold text-zus-red">
                            {formatCurrency(result.sickLeaveImpact.difference)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            miesięcznie
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Procent zmniejszenia:
                          </p>
                          <p className="text-2xl font-bold text-zus-darkblue dark:text-zus-gold">
                            {(
                              (result.sickLeaveImpact.difference /
                                result.nominalPension) *
                              100
                            ).toFixed(1)}
                            %
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            całkowitej emerytury
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                      💡 Podczas zwolnienia lekarskiego składki emerytalne są
                      niższe (80% podstawy), co wpływa na wysokość przyszłej
                      emerytury.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </StepContainer>

      {/* STEP 4: Goal Analysis */}
      <StepContainer
        stepNumber={4}
        title="Twój cel emerytalny"
        description="Jak osiągnąć wymarzoną emeryturę?"
        isActive={currentStep === 4}
        onNext={nextStep}
        onPrev={prevStep}
        onSkip={inputData?.desiredPension ? undefined : skipStep}
        canSkip={!inputData?.desiredPension}
      >
        {result && inputData && inputData.desiredPension ? (
          <div className="space-y-6">
            <GapAnalysis
              currentPension={result.nominalPension}
              targetPension={inputData.desiredPension}
            />
            <SmartSuggestions
              currentPension={result.nominalPension}
              targetPension={inputData.desiredPension}
              currentSalary={inputData.grossSalary}
              age={inputData.age}
              retirementAge={RETIREMENT_AGE[inputData.sex]}
            />
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              Nie określono celu emerytalnego
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Wróć do kroku 1 i wprowadź pożądaną kwotę emerytury, aby zobaczyć
              personalizowane sugestie.
            </p>
            <button onClick={skipStep} className="btn-primary">
              Pomiń ten krok →
            </button>
          </div>
        )}
      </StepContainer>

      {/* STEP 5: Scenario Comparison + What If */}
      <StepContainer
        stepNumber={5}
        title="Porównaj wszystkie opcje"
        description="Zobacz różne ścieżki i eksperymentuj"
        isActive={currentStep === 5}
        onNext={nextStep}
        onPrev={prevStep}
      >
        {result && inputData && (
          <div className="space-y-6">
            <ScenarioComparer
              currentPension={result.nominalPension}
              currentSalary={inputData.grossSalary}
              targetPension={inputData.desiredPension}
            />
            <WhatIfCalculator
              basePension={result.nominalPension}
              currentSalary={inputData.grossSalary}
            />
            <OvertimeCalculator
              currentPension={result.nominalPension}
              monthlySalary={inputData.grossSalary}
              yearsUntilRetirement={Math.max(
                0,
                inputData.workEndYear - new Date().getFullYear()
              )}
            />
          </div>
        )}
      </StepContainer>

      {/* STEP 6: Export */}
      <StepContainer
        stepNumber={6}
        title="Zapisz swoje wyniki"
        description="Pobierz raport PDF i podziel się wynikami"
        isActive={currentStep === 6}
        isLastStep={true}
        showNavButtons={false}
        onPrev={prevStep}
      >
        {result && inputData && (
          <ExportStep
            input={inputData}
            result={result}
            onNewSimulation={handleNewSimulation}
          />
        )}
      </StepContainer>
    </div>
  );
}

