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

/**
 * ========================================
 * NOWE FUNKCJE: Gap Analysis & Smart Suggestions
 * ========================================
 */

/**
 * Oblicza lukę między celem a prognozą
 */
export function calculateGap(currentPension: number, targetPension: number) {
  const gap = targetPension - currentPension;
  const gapPercentage = (gap / targetPension) * 100;
  
  return {
    gap: Math.round(gap * 100) / 100,
    gapPercentage: Math.round(gapPercentage * 100) / 100,
    hasGap: gap > 0,
    meetsGoal: gap <= 0,
  };
}

/**
 * Oblicza szczegółowe scenariusze dłuższej pracy
 */
export function calculateWorkLongerScenarios(
  basePension: number,
  grossSalary: number,
  targetPension?: number
) {
  const scenarios = [];
  
  for (let years = 1; years <= 10; years++) {
    const newPension = calculateLaterRetirementBonus(basePension, years, grossSalary);
    const percentageIncrease = ((newPension - basePension) / basePension) * 100;
    const meetsGoal = targetPension ? newPension >= targetPension : false;
    
    scenarios.push({
      years,
      pension: Math.round(newPension * 100) / 100,
      increase: Math.round((newPension - basePension) * 100) / 100,
      percentageIncrease: Math.round(percentageIncrease * 100) / 100,
      meetsGoal,
    });
  }
  
  return scenarios;
}

/**
 * Oblicza scenariusze dodatkowego dochodu
 */
export function calculateExtraIncomeScenarios(
  basePension: number,
  currentSalary: number,
  targetPension?: number
) {
  const scenarios = [];
  const extraIncomes = [300, 500, 800, 1000, 1500, 2000]; // PLN/miesiąc
  const durations = [1, 2, 3, 5, 7, 10]; // lata
  
  for (const extraIncome of extraIncomes) {
    for (const duration of durations) {
      // Dodatkowy dochód zwiększa składki
      const additionalContributions = extraIncome * 12 * duration * ECONOMIC_INDICATORS.contributionRate;
      const monthsOfPension = 18 * 12;
      const pensionIncrease = additionalContributions / monthsOfPension;
      const newPension = basePension + pensionIncrease;
      const meetsGoal = targetPension ? newPension >= targetPension : false;
      
      scenarios.push({
        extraMonthlyIncome: extraIncome,
        durationYears: duration,
        totalExtra: extraIncome * 12 * duration,
        pension: Math.round(newPension * 100) / 100,
        increase: Math.round(pensionIncrease * 100) / 100,
        percentageIncrease: Math.round((pensionIncrease / basePension) * 100 * 100) / 100,
        meetsGoal,
        effort: extraIncome >= 1500 ? 'high' : extraIncome >= 800 ? 'medium' : 'low',
      });
    }
  }
  
  // Sortuj po % wzrostu
  return scenarios.sort((a, b) => b.percentageIncrease - a.percentageIncrease);
}

/**
 * Oblicza scenariusze podwyżek i rozwoju kariery
 */
export function calculateRaiseScenarios(
  basePension: number,
  currentSalary: number,
  yearsUntilRetirement: number,
  targetPension?: number
) {
  const scenarios = [];
  const raiseRates = [0.03, 0.05, 0.07, 0.10]; // 3%, 5%, 7%, 10% rocznie
  
  for (const raiseRate of raiseRates) {
    let totalContributions = 0;
    let salary = currentSalary;
    
    for (let year = 0; year < yearsUntilRetirement; year++) {
      salary *= (1 + raiseRate);
      totalContributions += salary * 12 * ECONOMIC_INDICATORS.contributionRate;
    }
    
    const monthsOfPension = 18 * 12;
    const pensionIncrease = totalContributions / monthsOfPension;
    const newPension = pensionIncrease; // to jest już nowa emerytura z nowymi składkami
    const meetsGoal = targetPension ? newPension >= targetPension : false;
    
    scenarios.push({
      annualRaiseRate: raiseRate * 100,
      finalSalary: Math.round(salary),
      pension: Math.round(newPension * 100) / 100,
      increase: Math.round((newPension - basePension) * 100) / 100,
      meetsGoal,
    });
  }
  
  return scenarios;
}

/**
 * Sugeruje optymalne ścieżki do celu
 */
export function suggestOptimalPaths(
  currentPension: number,
  targetPension: number,
  currentSalary: number,
  yearsUntilRetirement: number
) {
  if (currentPension >= targetPension) {
    return {
      needsSuggestions: false,
      message: 'Gratulacje! Osiągniesz swój cel emerytalny!',
    };
  }
  
  const gap = targetPension - currentPension;
  const suggestions = [];
  
  // #1: NAJSZYBSZA ŚCIEŻKA - dodatkowy dochód
  // Dla dużych luk użyj dłuższego okresu (5 lat zamiast 3)
  const fastDuration = gap > 1500 ? 5 : 3;
  const extraIncomeNeeded = calculateExtraIncomeForGoal(gap, fastDuration);
  
  // Dodaj tylko jeśli jest realistyczne (max 3000 PLN/mies)
  if (extraIncomeNeeded <= 3000) {
    suggestions.push({
      id: 'fastest',
      title: `Najszybsza (${fastDuration} ${fastDuration === 1 ? 'rok' : 'lat'})`,
      strategy: 'extra_income',
      description: `Dodatkowy dochód +${extraIncomeNeeded} PLN/mies przez ${fastDuration} ${fastDuration === 1 ? 'rok' : 'lat'}`,
      effort: extraIncomeNeeded >= 2000 ? 'high' : extraIncomeNeeded >= 1000 ? 'medium' : 'low',
      timeframe: fastDuration,
      details: {
        extraMonthlyIncome: extraIncomeNeeded,
        duration: fastDuration,
        totalEarned: extraIncomeNeeded * 12 * fastDuration,
      },
      pros: ['Najszybszy rezultat', 'Krótki wysiłek', 'Konkretny plan'],
      cons: ['Wymaga dodatkowej pracy', extraIncomeNeeded >= 2000 ? 'Wysokie tempo' : 'Wymaga dyscypliny'],
    });
  }
  
  // #2: ZBALANSOWANA - kombinacja
  const workLongerYears = Math.ceil(yearsUntilRetirement * 0.2); // +20% czasu pracy
  const workLongerPension = calculateLaterRetirementBonus(currentPension, workLongerYears, currentSalary);
  const remainingGap = targetPension - workLongerPension;
  
  if (remainingGap > 0) {
    // Spróbuj z dłuższym okresem (10 lat zamiast 5) dla większych luk
    const durationYears = remainingGap > 1000 ? 10 : 5;
    const extraIncomeForBalance = calculateExtraIncomeForGoal(remainingGap, durationYears);
    
    // Dodaj tylko jeśli jest realistyczne (max 3000 PLN/mies)
    if (extraIncomeForBalance <= 3000) {
      suggestions.push({
        id: 'balanced',
        title: `Zbalansowana (${durationYears + workLongerYears} lat)`,
        strategy: 'combined',
        description: `+${extraIncomeForBalance} PLN/mies przez ${durationYears} lat + pracuj ${workLongerYears} lat dłużej`,
        effort: 'medium',
        timeframe: durationYears + workLongerYears,
        details: {
          extraMonthlyIncome: extraIncomeForBalance,
          extraDuration: durationYears,
          workLongerYears,
          totalEarned: extraIncomeForBalance * 12 * durationYears,
        },
        pros: ['Umiarkowany wysiłek', 'Realistyczna', 'Elastyczna'],
        cons: ['Dłuższy czas', 'Wymaga dyscypliny'],
      });
    }
  }
  
  // #3: BEZ WYSIŁKU - tylko dłuższa praca
  const yearsNeededForGoal = calculateYearsNeeded(currentPension, targetPension, currentSalary);
  if (yearsNeededForGoal <= 10) {
    suggestions.push({
      id: 'effortless',
      title: 'Bez wysiłku',
      strategy: 'work_longer',
      description: `Po prostu pracuj ${yearsNeededForGoal} lat dłużej`,
      effort: 'low',
      timeframe: yearsNeededForGoal,
      details: {
        workLongerYears: yearsNeededForGoal,
        retirementAge: 65 + yearsNeededForGoal,
      },
      pros: ['Bez dodatkowego wysiłku', 'Pewne', 'Proste'],
      cons: ['Późna emerytura', 'Długi czas'],
    });
  }
  
  // #4: INWESTYCJE (IKE/IKZE)
  const monthlyInvestment = calculateMonthlyInvestmentForGoal(gap, yearsUntilRetirement);
  if (monthlyInvestment <= 1500) {
    suggestions.push({
      id: 'investment',
      title: 'Inwestycje długoterminowe',
      strategy: 'investment',
      description: `Odkładaj ${monthlyInvestment} PLN/mies do IKE/IKZE`,
      effort: 'low',
      timeframe: yearsUntilRetirement,
      details: {
        monthlyInvestment,
        totalInvested: monthlyInvestment * 12 * yearsUntilRetirement,
        expectedReturn: gap,
      },
      pros: ['Ulga podatkowa', 'Długoterminowe', 'Pasywne'],
      cons: ['Wymaga dyscypliny', 'Ryzyko rynkowe'],
    });
  }
  
  // #5: REALISTYCZNA dla trudnych przypadków - obniż cel lub pracuj znacznie dłużej
  if (suggestions.length < 2 && gap > 1500) {
    // Jeśli nie ma realistycznych sugestii, zaproponuj korektę celu
    const reducedTarget = currentPension * 1.3; // +30% obecnej prognozy
    const reducedGap = reducedTarget - currentPension;
    const realisticExtra = calculateExtraIncomeForGoal(reducedGap, 7);
    
    if (realisticExtra <= 2000) {
      suggestions.push({
        id: 'realistic',
        title: 'Realistyczna modyfikacja',
        strategy: 'combined',
        description: `Rozważ cel ${Math.round(reducedTarget)} PLN (zamiast ${targetPension}) + dodatkowy dochód ${realisticExtra} PLN przez 7 lat`,
        effort: 'medium',
        timeframe: 7,
        details: {
          extraMonthlyIncome: realisticExtra,
          extraDuration: 7,
          adjustedTarget: Math.round(reducedTarget),
          originalTarget: targetPension,
          totalEarned: realisticExtra * 12 * 7,
        },
        pros: ['Realistyczne do osiągnięcia', 'Elastyczne', 'Nadal znaczna poprawa'],
        cons: ['Wymaga obniżenia oczekiwań', 'Średni wysiłek'],
      });
    }
  }
  
  return {
    needsSuggestions: true,
    gap: Math.round(gap * 100) / 100,
    gapPercentage: Math.round((gap / targetPension) * 100 * 100) / 100,
    suggestions: suggestions.slice(0, 4), // max 4 sugestie
  };
}

/**
 * Pomocnicza: Oblicza jaki dodatkowy dochód miesięczny jest potrzebny
 */
function calculateExtraIncomeForGoal(gap: number, durationYears: number): number {
  const monthsOfPension = 18 * 12;
  const additionalFundsNeeded = gap * monthsOfPension;
  const monthlyIncome = additionalFundsNeeded / (durationYears * 12 * ECONOMIC_INDICATORS.contributionRate);
  return Math.ceil(monthlyIncome / 50) * 50; // Zaokrągl do 50 PLN
}

/**
 * Pomocnicza: Oblicza miesięczną kwotę inwestycji do celu
 */
function calculateMonthlyInvestmentForGoal(gap: number, years: number): number {
  // Uproszczony model: zakładamy 5% rocznego zwrotu
  const monthlyRate = 0.05 / 12;
  const months = years * 12;
  
  // Formuła FV dla anuitet: FV = PMT * [((1 + r)^n - 1) / r]
  // PMT = FV / [((1 + r)^n - 1) / r]
  const futureValue = gap;
  const monthlyPayment = futureValue / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  
  return Math.ceil(monthlyPayment / 50) * 50; // Zaokrągl do 50 PLN
}

