/**
 * Typy dla Symulatora Emerytalnego ZUS
 */

// Dane wejściowe użytkownika do symulacji
export interface SimulationInput {
  age: number;
  sex: "male" | "female";
  grossSalary: number;
  workStartYear: number;
  workEndYear: number;
  zusAccount?: number;
  zusSubAccount?: number;
  startCapital?: number; // Kwota zwaloryzowanego kapitału początkowego
  ofeAccount?: number; // Środki zgromadzone na rachunku OFE
  includeSickLeave: boolean;
  desiredPension?: number;
}

// Wyniki symulacji
export interface SimulationResult {
  nominalPension: number;
  realPension: number;
  replacementRate: number;
  averagePension: number;
  retirementYear: number;
  sickLeaveImpact?: {
    withSickLeave: number;
    withoutSickLeave: number;
    difference: number;
  };
  laterRetirementScenarios: {
    plusOneYear: number;
    plusTwoYears: number;
    plusFiveYears: number;
  };
  yearsNeededForGoal?: number;
}

// Dane użytkownika (dla analytics)
export interface UserData {
  sessionId: string;
  timestamp: Date;
  input: SimulationInput;
  result: SimulationResult;
  postalCode?: string;
  sessionDuration?: number;
}

// Historyczne dane wynagrodzeń (dla dashboard)
export interface SalaryHistory {
  year: number;
  amount: number;
}

// Okres zwolnienia lekarskiego
export interface SickLeavePeriod {
  startDate: string;
  endDate: string;
  days: number;
}

// Grupa emerytalna (dla wykresów)
export interface PensionGroup {
  id: string;
  name: string;
  amount: number;
  description: string;
  color: string;
}

// Fakt edukacyjny
export interface FunFact {
  id: string;
  text: string;
  category?: string;
}

// Dane do wygenerowania PDF
export interface PDFReportData {
  input: SimulationInput;
  result: SimulationResult;
  generatedAt: Date;
  salaryHistory?: SalaryHistory[];
  sickLeavePeriods?: SickLeavePeriod[];
}

// Log użycia dla administratora
export interface UsageLog {
  date: string;
  time: string;
  expectedPension?: number;
  age: number;
  sex: 'male' | 'female';
  salary: number;
  sickLeaveIncluded: boolean;
  zusAccount?: number;
  zusSubAccount?: number;
  nominalPension: number;
  realPension: number;
  postalCode?: string;
}

