/**
 * Funkcje do obliczeń emerytalnych
 * Zakład Ubezpieczeń Społecznych - Symulator Emerytalny
 */

import { RETIREMENT_AGE, ECONOMIC_INDICATORS, SICK_LEAVE_AVERAGES, AVERAGE_PENSIONS } from './constants';
import type { SimulationInput, SimulationResult } from '@/types';

/**
 * Oblicza nominalną emeryturę
 * Wzór uproszczony: suma składek zgromadzonych na koncie / średnia długość życia po emeryturze
 */
export function calculateNominalPension(
  age: number,
  sex: 'male' | 'female',
  grossSalary: number,
  workStartYear: number,
  workEndYear: number,
  zusAccount?: number,
  zusSubAccount?: number
): number {
  const currentYear = new Date().getFullYear();
  const retirementAge = RETIREMENT_AGE[sex];
  
  // Oblicz lata pracy
  const yearsWorked = workEndYear - workStartYear;
  
  // Jeśli środki nie są podane, szacuj na podstawie historii
  let totalFunds = zusAccount || 0;
  const subAccountFunds = zusSubAccount || 0;
  
  if (!zusAccount) {
    // Szacowanie środków - indeksacja wsteczna wynagrodzeń
    totalFunds = estimateZUSAccount(grossSalary, yearsWorked, workStartYear, currentYear);
  }
  
  // Prognoza przyszłych wpłat (jeśli jeszcze pracuje)
  if (workEndYear > currentYear) {
    const futureYears = workEndYear - currentYear;
    const futureContributions = calculateFutureContributions(grossSalary, futureYears);
    totalFunds += futureContributions;
  }
  
  totalFunds += subAccountFunds;
  
  // Średnia długość życia po emeryturze (uproszczone)
  const lifeExpectancyAfterRetirement = sex === 'male' ? 18 : 24; // lata
  const monthsOfPension = lifeExpectancyAfterRetirement * 12;
  
  // Emerytura miesięczna
  const monthlyPension = totalFunds / monthsOfPension;
  
  return Math.round(monthlyPension * 100) / 100;
}

/**
 * Szacuje środki zgromadzone na koncie ZUS na podstawie historii wynagrodzeń
 */
function estimateZUSAccount(
  currentSalary: number,
  yearsWorked: number,
  startYear: number,
  currentYear: number
): number {
  let totalContributions = 0;
  const actualYearsWorked = Math.min(yearsWorked, currentYear - startYear);
  
  // Indeksacja wsteczna - zakładamy że wynagrodzenie rosło o 4% rocznie
  for (let i = 0; i < actualYearsWorked; i++) {
    const yearsFromNow = actualYearsWorked - i - 1;
    const historicalSalary = currentSalary / Math.pow(1 + ECONOMIC_INDICATORS.averageWageGrowth, yearsFromNow);
    const yearlyContribution = historicalSalary * 12 * ECONOMIC_INDICATORS.contributionRate;
    totalContributions += yearlyContribution;
  }
  
  return totalContributions;
}

/**
 * Oblicza przyszłe składki
 */
function calculateFutureContributions(grossSalary: number, futureYears: number): number {
  let totalContributions = 0;
  
  for (let i = 0; i < futureYears; i++) {
    // Zakładamy wzrost wynagrodzenia o 4% rocznie
    const futureSalary = grossSalary * Math.pow(1 + ECONOMIC_INDICATORS.averageWageGrowth, i);
    const yearlyContribution = futureSalary * 12 * ECONOMIC_INDICATORS.contributionRate;
    totalContributions += yearlyContribution;
  }
  
  return totalContributions;
}

/**
 * Oblicza realną emeryturę (skorygowaną o inflację)
 */
export function calculateRealPension(
  nominalPension: number,
  retirementYear: number,
  inflationRate: number = ECONOMIC_INDICATORS.averageInflation
): number {
  const currentYear = new Date().getFullYear();
  
  if (retirementYear <= currentYear) {
    return nominalPension; // Już na emeryturze
  }
  
  const yearsUntilRetirement = retirementYear - currentYear;
  
  // Dyskontowanie o inflację
  const realValue = nominalPension / Math.pow(1 + inflationRate, yearsUntilRetirement);
  
  return Math.round(realValue * 100) / 100;
}

/**
 * Oblicza stopę zastąpienia (replacement rate)
 * Stosunek emerytury do ostatniego wynagrodzenia
 */
export function calculateReplacementRate(
  pension: number,
  lastGrossSalary: number
): number {
  if (lastGrossSalary === 0) return 0;
  
  const rate = pension / lastGrossSalary;
  return Math.round(rate * 1000) / 1000; // 3 miejsca po przecinku
}

/**
 * Oblicza wpływ zwolnień lekarskich na emeryturę
 */
export function calculateSickLeaveImpact(
  yearsWorked: number,
  sex: 'male' | 'female',
  grossSalary: number
): {
  withSickLeave: number;
  withoutSickLeave: number;
  difference: number;
} {
  const averageSickDaysPerYear = SICK_LEAVE_AVERAGES[sex];
  const totalSickDays = yearsWorked * averageSickDaysPerYear;
  
  // Podczas zwolnienia składki są mniejsze (80% podstawy)
  const workDaysPerYear = 250; // robocze dni w roku
  const sickLeaveFactor = 0.8; // 80% składki podczas zwolnienia
  
  const totalWorkDays = yearsWorked * workDaysPerYear;
  const effectiveDaysLost = totalSickDays * (1 - sickLeaveFactor);
  const reductionPercentage = effectiveDaysLost / totalWorkDays;
  
  const dailySalary = grossSalary / 21.67; // średnio dni roboczych w miesiącu
  const annualLoss = (effectiveDaysLost / yearsWorked) * dailySalary * 12;
  const pensionLoss = annualLoss * ECONOMIC_INDICATORS.contributionRate * yearsWorked / (18 * 12); // uproszczone
  
  return {
    withSickLeave: Math.round(pensionLoss * 100) / 100,
    withoutSickLeave: 0,
    difference: Math.round(pensionLoss * 100) / 100,
  };
}

/**
 * Oblicza bonus za późniejsze przejście na emeryturę
 */
export function calculateLaterRetirementBonus(
  basePension: number,
  additionalYears: number,
  grossSalary: number
): number {
  // Za każdy dodatkowy rok pracy:
  // 1. Dodatkowe składki
  // 2. Krótsza średnia wypłaty emerytury (mniej lat życia)
  
  const additionalContributions = grossSalary * 12 * ECONOMIC_INDICATORS.contributionRate * additionalYears;
  const monthsOfPension = 18 * 12; // zakładamy średnio 18 lat emerytury
  const bonusFromContributions = additionalContributions / monthsOfPension;
  
  // Bonus za skrócenie okresu wypłaty (emerytura jest wyższa bo wypłacana krócej)
  const shorterPayoutBonus = basePension * (additionalYears / monthsOfPension) * 12;
  
  const totalBonus = bonusFromContributions + shorterPayoutBonus;
  
  return Math.round((basePension + totalBonus) * 100) / 100;
}

/**
 * Oblicza ile lat trzeba pracować dłużej aby osiągnąć cel
 */
export function calculateYearsNeeded(
  currentPension: number,
  targetPension: number,
  grossSalary: number
): number {
  if (currentPension >= targetPension) return 0;
  
  const deficit = targetPension - currentPension;
  const monthsOfPension = 18 * 12; // średnio 18 lat emerytury
  
  // Ile dodatkowych składek trzeba zgromadzić
  const additionalFundsNeeded = deficit * monthsOfPension;
  
  // Ile lat pracy to zajmie
  const annualContribution = grossSalary * 12 * ECONOMIC_INDICATORS.contributionRate;
  const yearsNeeded = additionalFundsNeeded / annualContribution;
  
  return Math.ceil(yearsNeeded); // zaokrąglamy w górę
}

/**
 * Główna funkcja obliczająca pełną symulację
 */
export function calculateFullSimulation(input: SimulationInput): SimulationResult {
  const {
    age,
    sex,
    grossSalary,
    workStartYear,
    workEndYear,
    zusAccount,
    zusSubAccount,
    includeSickLeave,
    desiredPension,
  } = input;
  
  const currentYear = new Date().getFullYear();
  const retirementAge = RETIREMENT_AGE[sex];
  const birthYear = currentYear - age;
  const retirementYear = birthYear + retirementAge;
  
  // Oblicz nominalną emeryturę
  const nominalPension = calculateNominalPension(
    age,
    sex,
    grossSalary,
    workStartYear,
    workEndYear,
    zusAccount,
    zusSubAccount
  );
  
  // Oblicz realną emeryturę
  const realPension = calculateRealPension(nominalPension, retirementYear);
  
  // Oblicz stopę zastąpienia
  const futureGrossSalary = grossSalary * Math.pow(
    1 + ECONOMIC_INDICATORS.averageWageGrowth,
    Math.max(0, retirementYear - currentYear)
  );
  const replacementRate = calculateReplacementRate(nominalPension, futureGrossSalary);
  
  // Oblicz wpływ zwolnień lekarskich
  const yearsWorked = workEndYear - workStartYear;
  const sickLeaveImpact = includeSickLeave
    ? calculateSickLeaveImpact(yearsWorked, sex, grossSalary)
    : undefined;
  
  // Scenariusze późniejszego przejścia na emeryturę
  const laterRetirementScenarios = {
    plusOneYear: calculateLaterRetirementBonus(nominalPension, 1, futureGrossSalary),
    plusTwoYears: calculateLaterRetirementBonus(nominalPension, 2, futureGrossSalary),
    plusFiveYears: calculateLaterRetirementBonus(nominalPension, 5, futureGrossSalary),
  };
  
  // Oblicz lata potrzebne do osiągnięcia celu
  const yearsNeededForGoal = desiredPension
    ? calculateYearsNeeded(nominalPension, desiredPension, futureGrossSalary)
    : undefined;
  
  return {
    nominalPension,
    realPension,
    replacementRate,
    averagePension: AVERAGE_PENSIONS.overall,
    retirementYear,
    sickLeaveImpact,
    laterRetirementScenarios,
    yearsNeededForGoal,
  };
}

