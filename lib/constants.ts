/**
 * Stałe i dane konfiguracyjne dla Symulatora Emerytalnego ZUS
 */

// Wiek emerytalny
export const RETIREMENT_AGE = {
  male: 65,
  female: 60,
} as const;

// Domyślne wartości inflacji i wzrostu wynagrodzeń
export const ECONOMIC_INDICATORS = {
  averageInflation: 0.02, // 2% rocznie
  averageWageGrowth: 0.04, // 4% rocznie
  contributionRate: 0.1952, // Składka emerytalna 19.52%
} as const;

// Miesięczne składki emerytalne
export const MONTHLY_CONTRIBUTIONS = {
  zusAccountMonthly: 0.1222, // 12.22% miesięcznie z wynagrodzenia brutto na konto główne ZUS
  subAccountMonthly: 0.073, // 7.3% miesięcznie z wynagrodzenia brutto na subkonto ZUS
} as const;

// Średnie emerytury w Polsce (2024)
export const AVERAGE_PENSIONS = {
  overall: 3500,
  belowMinimum: 1800,
  minimum: 2000,
  average: 3500,
  aboveAverage: 5000,
  high: 8000,
} as const;

// Średnie czasy zwolnień lekarskich (dni rocznie)
export const SICK_LEAVE_AVERAGES = {
  male: 12, // 12 dni rocznie
  female: 16, // 16 dni rocznie
} as const;

// Walidacja formularza
export const VALIDATION_LIMITS = {
  minAge: 18,
  maxAge: 67,
  minSalary: 4666,
  maxSalary: 100000,
  minWorkYear: 1960,
  maxWorkYear: 2100, // Pozwalamy na rok zakończenia pracy do 2100
} as const;

