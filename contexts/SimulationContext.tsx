'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { SimulationResult, SimulationInput } from '@/types';

interface SimulationContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  inputData: SimulationInput | null;
  setInputData: (data: SimulationInput | null) => void;
  result: SimulationResult | null;
  setResult: (result: SimulationResult | null) => void;
  desiredPension: number | undefined;
  setDesiredPension: (pension: number | undefined) => void;
  
  // Helper to get chat context
  getChatContext: () => {
    step: number;
    userData?: {
      age?: number;
      salary?: number;
      sex?: string;
    };
    results?: {
      nominalPension?: number;
      realPension?: number;
      replacementRate?: number;
      retirementYear?: number;
    };
    hasGoal: boolean;
    gap?: number;
  };
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [inputData, setInputData] = useState<SimulationInput | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [desiredPension, setDesiredPension] = useState<number | undefined>(undefined);

  const getChatContext = () => {
    const context: ReturnType<SimulationContextType['getChatContext']> = {
      step: currentStep,
      hasGoal: !!desiredPension,
    };

    // Add user data if available
    if (inputData) {
      context.userData = {
        age: inputData.age,
        salary: inputData.grossSalary,
        sex: inputData.sex,
      };
    }

    // Add results if available
    if (result) {
      context.results = {
        nominalPension: result.nominalPension,
        realPension: result.realPension,
        replacementRate: result.replacementRate,
        retirementYear: result.retirementYear,
      };
    }

    // Calculate gap if goal is set
    if (desiredPension && result) {
      const gap = desiredPension - result.nominalPension;
      if (gap > 0) {
        context.gap = gap;
      }
    }

    return context;
  };

  return (
    <SimulationContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        inputData,
        setInputData,
        result,
        setResult,
        desiredPension,
        setDesiredPension,
        getChatContext,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
