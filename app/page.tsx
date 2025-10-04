'use client';

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

  const handleFormSuccess = (calculatedResult: SimulationResult, input: SimulationInput) => {
    setResult(calculatedResult);
    setInputData(input);
    markStepCompleted(1);
    // Automatically proceed to step 2 (details)
    setCurrentStep(2);
  };

  const handleRecalculate = (newResult: SimulationResult, newInput: SimulationInput) => {
    setResult(newResult);
    setInputData(newInput);
  };

  const markStepCompleted = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
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

  const skipStep = () => {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            onRecalculate={handleRecalculate}
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
                  {formatPercent(inputData.inflationRate || 0.02)} rocznie).
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
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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

            {/* Work longer scenarios */}
            <div className="card bg-gradient-to-br from-zus-green/5 to-white dark:from-zus-green/10 dark:to-gray-800 border-2 border-zus-green">
              <h3 className="text-2xl font-bold text-zus-darkblue dark:text-white mb-4">
                Co jeśli popracujesz dłużej?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Każdy dodatkowy rok pracy może znacząco zwiększyć Twoją przyszłą
                emeryturę.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        Scenariusz
                      </th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        Wiek
                      </th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        Emerytura
                      </th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        Wzrost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        label: "Obecnie",
                        years: 0,
                        pension: result.nominalPension,
                      },
                      {
                        label: "Za 1 rok",
                        years: 1,
                        pension: result.laterRetirementScenarios.plusOneYear,
                      },
                      {
                        label: "Za 2 lata",
                        years: 2,
                        pension: result.laterRetirementScenarios.plusTwoYears,
                      },
                      {
                        label: "Za 5 lat",
                        years: 5,
                        pension: result.laterRetirementScenarios.plusFiveYears,
                      },
                    ].map((scenario, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                      >
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-100">
                          {scenario.label}
                        </td>
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-100">
                          {inputData.age + scenario.years} lat
                        </td>
                        <td className="px-4 py-3 font-semibold text-zus-green dark:text-zus-gold">
                          {formatCurrency(scenario.pension)}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                          {index > 0
                            ? `+${formatCurrency(
                                scenario.pension - result.nominalPension
                              )}`
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

