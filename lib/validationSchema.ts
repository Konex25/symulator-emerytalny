/**
 * Schema walidacji Zod dla formularza symulacji
 */

import { z } from 'zod';
import { VALIDATION_LIMITS, RETIREMENT_AGE } from './constants';

export const simulationFormSchema = z.object({
  age: z
    .number({
      required_error: 'Wiek jest wymagany',
      invalid_type_error: 'Wiek musi być liczbą',
    })
    .int('Wiek musi być liczbą całkowitą')
    .min(VALIDATION_LIMITS.minAge, `Wiek musi być co najmniej ${VALIDATION_LIMITS.minAge} lat`)
    .max(VALIDATION_LIMITS.maxAge, `Wiek nie może przekraczać ${VALIDATION_LIMITS.maxAge} lat`),
  
  sex: z.enum(['male', 'female'], {
    required_error: 'Płeć jest wymagana',
    invalid_type_error: 'Nieprawidłowa wartość płci',
  }),
  
  grossSalary: z
    .number({
      required_error: 'Wynagrodzenie brutto jest wymagane',
      invalid_type_error: 'Wynagrodzenie musi być liczbą',
    })
    .min(VALIDATION_LIMITS.minSalary, `Wynagrodzenie musi być co najmniej ${VALIDATION_LIMITS.minSalary} PLN`)
    .max(VALIDATION_LIMITS.maxSalary, `Wynagrodzenie nie może przekraczać ${VALIDATION_LIMITS.maxSalary} PLN`),
  
  workStartYear: z
    .number({
      required_error: 'Rok rozpoczęcia pracy jest wymagany',
      invalid_type_error: 'Rok musi być liczbą',
    })
    .int('Rok musi być liczbą całkowitą')
    .min(VALIDATION_LIMITS.minWorkYear, `Rok nie może być wcześniejszy niż ${VALIDATION_LIMITS.minWorkYear}`)
    .max(VALIDATION_LIMITS.maxWorkYear, `Rok nie może być późniejszy niż ${VALIDATION_LIMITS.maxWorkYear}`),
  
  workEndYear: z
    .number({
      required_error: 'Rok zakończenia pracy jest wymagany',
      invalid_type_error: 'Rok musi być liczbą',
    })
    .int('Rok musi być liczbą całkowitą')
    .min(VALIDATION_LIMITS.minWorkYear, `Rok nie może być wcześniejszy niż ${VALIDATION_LIMITS.minWorkYear}`)
    .max(VALIDATION_LIMITS.maxWorkYear, `Rok nie może być późniejszy niż ${VALIDATION_LIMITS.maxWorkYear}`),
  
  zusAccount: z
    .number({
      invalid_type_error: 'Kwota musi być liczbą',
    })
    .min(0, 'Kwota nie może być ujemna')
    .optional()
    .or(z.literal('')),
  
  zusSubAccount: z
    .number({
      invalid_type_error: 'Kwota musi być liczbą',
    })
    .min(0, 'Kwota nie może być ujemna')
    .optional()
    .or(z.literal('')),
  
  includeSickLeave: z.boolean().default(false),
  
  desiredPension: z
    .number({
      invalid_type_error: 'Kwota musi być liczbą',
    })
    .min(0, 'Kwota nie może być ujemna')
    .optional()
    .or(z.literal('')),
}).refine((data) => data.workEndYear >= data.workStartYear, {
  message: 'Rok zakończenia pracy nie może być wcześniejszy niż rok rozpoczęcia',
  path: ['workEndYear'],
});

export type SimulationFormData = z.infer<typeof simulationFormSchema>;

/**
 * Oblicza domyślny rok zakończenia pracy na podstawie wieku i płci
 */
export function calculateDefaultWorkEndYear(age: number, sex: 'male' | 'female'): number {
  const currentYear = new Date().getFullYear();
  const retirementAge = RETIREMENT_AGE[sex];
  const yearsUntilRetirement = retirementAge - age;
  return currentYear + yearsUntilRetirement;
}

/**
 * Oblicza rok urodzenia na podstawie wieku
 */
export function calculateBirthYear(age: number): number {
  const currentYear = new Date().getFullYear();
  return currentYear - age;
}

