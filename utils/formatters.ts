/**
 * Funkcje pomocnicze do formatowania danych
 */

/**
 * Formatuje kwotę w PLN
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formatuje procent
 */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Formatuje datę
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Waliduje kod pocztowy Polski (XX-XXX)
 */
export function validatePostalCode(code: string): boolean {
  const postalCodeRegex = /^\d{2}-\d{3}$/;
  return postalCodeRegex.test(code);
}

/**
 * Oblicza wiek na podstawie roku urodzenia
 */
export function calculateAge(birthYear: number): number {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}

/**
 * Generuje unikalny identyfikator sesji
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

