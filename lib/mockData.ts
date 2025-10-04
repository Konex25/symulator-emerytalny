/**
 * Mock dane dla symulatora
 * Historyczne dane inflacji, wzrostu wynagrodzeń, grup emerytalnych, faktów
 */

import type { PensionGroup, FunFact } from '@/types';

/**
 * Historyczne stopy inflacji (1990-2024)
 * Uproszczone - średnio 2% rocznie
 */
export const HISTORICAL_INFLATION: Record<number, number> = {
  1990: 0.585,
  1995: 0.278,
  2000: 0.103,
  2005: 0.021,
  2010: 0.026,
  2015: -0.009,
  2020: 0.034,
  2021: 0.054,
  2022: 0.144,
  2023: 0.112,
  2024: 0.046,
};

/**
 * Historyczny wzrost wynagrodzeń (1990-2024)
 * Uproszczone - średnio 4% rocznie
 */
export const HISTORICAL_WAGE_GROWTH: Record<number, number> = {
  1990: 0.589,
  1995: 0.331,
  2000: 0.120,
  2005: 0.035,
  2010: 0.042,
  2015: 0.036,
  2020: 0.045,
  2021: 0.073,
  2022: 0.115,
  2023: 0.127,
  2024: 0.089,
};

/**
 * Grupy emerytalne dla wykresu porównawczego
 */
export const PENSION_GROUPS: PensionGroup[] = [
  {
    id: 'below-minimum',
    name: 'Poniżej minimum',
    amount: 1800,
    description: 'Beneficjenci, którzy pracowali krócej niż 25 lat (mężczyźni) lub 20 lat (kobiety) i nie spełnili wymogów dla minimalnej emerytury.',
    color: 'rgb(240, 94, 94)', // zus-red
  },
  {
    id: 'minimum',
    name: 'Minimalna emerytura',
    amount: 2000,
    description: 'Gwarantowana minimalna emerytura dla osób, które przepracowały wymagany okres składkowy.',
    color: 'rgb(255, 179, 79)', // zus-gold
  },
  {
    id: 'average',
    name: 'Średnia emerytura',
    amount: 3500,
    description: 'Średnia emerytura w Polsce. Dotyczy osób z przeciętnym stażem pracy i wynagrodzeniami.',
    color: 'rgb(0, 153, 63)', // zus-green
  },
  {
    id: 'above-average',
    name: 'Powyżej średniej',
    amount: 5000,
    description: 'Emerytury osób z ponadprzeciętnym stażem pracy, wyższymi zarobkami i regularną historią składek.',
    color: 'rgb(63, 132, 210)', // zus-blue
  },
  {
    id: 'high',
    name: 'Wysokie świadczenia',
    amount: 8000,
    description: 'Najwyższe emerytury w Polsce. Dotyczy osób z długim stażem pracy, wysokimi zarobkami i pełną historią składek.',
    color: 'rgb(0, 65, 110)', // zus-darkblue
  },
];

/**
 * Ciekawe fakty o emeryturach ("Czy wiesz, że...")
 */
export const FUN_FACTS: FunFact[] = [
  {
    id: 'fact-1',
    text: 'Najwyższa emerytura w Polsce wynosi około 48 000 PLN miesięcznie. Otrzymuje ją mieszkaniec Śląska, który przepracował 47 lat i nigdy nie był na zwolnieniu lekarskim.',
    category: 'rekord',
  },
  {
    id: 'fact-2',
    text: 'Średnia emerytura kobiet w Polsce jest o około 30% niższa niż mężczyzn, głównie ze względu na różnicę w wieku emerytalnym i przerwach w karierze.',
    category: 'statystyka',
  },
  {
    id: 'fact-3',
    text: 'Każdy dodatkowy rok pracy po osiągnięciu wieku emerytalnego może zwiększyć Twoją emeryturę o 8-12%, dzięki dodatkowym składkom i krótszemu okresowi wypłaty.',
    category: 'porada',
  },
  {
    id: 'fact-4',
    text: 'W Polsce jest ponad 9 milionów emerytów i rencistów. Do 2060 roku ich liczba może wzrosnąć do 11 milionów.',
    category: 'demografia',
  },
  {
    id: 'fact-5',
    text: 'Średni staż pracy w Polsce wynosi około 35 lat. Osoby z ponad 40-letnim stażem stanowią mniej niż 15% emerytów.',
    category: 'statystyka',
  },
  {
    id: 'fact-6',
    text: 'Każdy dzień zwolnienia lekarskiego to mniejsze składki emerytalne. Rocznie średnio to 12-16 dni, co może zmniejszyć emeryturę o 2-3%.',
    category: 'zwolnienia',
  },
  {
    id: 'fact-7',
    text: 'Stopa zastąpienia (stosunek emerytury do ostatniego wynagrodzenia) w Polsce wynosi średnio 55-60%, podczas gdy w UE to około 70%.',
    category: 'porównanie',
  },
  {
    id: 'fact-8',
    text: 'Jeśli odkładasz dodatkowo 200 PLN miesięcznie do III filaru (np. IKE), po 30 latach może to dać dodatkowe 150-200 PLN miesięcznie do emerytury.',
    category: 'oszczędności',
  },
];

/**
 * Losuje jeden fakt z listy
 */
export function getRandomFunFact(): FunFact {
  const randomIndex = Math.floor(Math.random() * FUN_FACTS.length);
  return FUN_FACTS[randomIndex];
}

/**
 * Pobiera stopę inflacji dla danego roku (lub domyślną)
 */
export function getInflationRate(year: number): number {
  return HISTORICAL_INFLATION[year] || 0.02; // domyślnie 2%
}

/**
 * Pobiera stopę wzrostu wynagrodzeń dla danego roku (lub domyślną)
 */
export function getWageGrowthRate(year: number): number {
  return HISTORICAL_WAGE_GROWTH[year] || 0.04; // domyślnie 4%
}

