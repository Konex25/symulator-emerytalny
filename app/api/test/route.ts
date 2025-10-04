import { NextResponse } from 'next/server';
import { calculateFullSimulation } from '@/lib/calculations';
import type { SimulationInput } from '@/types';

/**
 * Endpoint testowy do sprawdzenia API
 * GET /api/test
 */
export async function GET() {
  // Przykładowe dane testowe
  const testInput: SimulationInput = {
    age: 30,
    sex: 'male',
    grossSalary: 8000,
    workStartYear: 2015,
    workEndYear: 2055,
    includeSickLeave: true,
    desiredPension: 5000,
  };
  
  try {
    const result = calculateFullSimulation(testInput);
    
    return NextResponse.json({
      status: 'API działa poprawnie! ✓',
      testInput,
      calculatedResult: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: 'Błąd w kalkulacjach',
      error: error instanceof Error ? error.message : 'Nieznany błąd',
    }, { status: 500 });
  }
}

