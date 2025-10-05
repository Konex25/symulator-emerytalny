/**
 * Quick suggestions for chat based on current step
 */
export function getQuickSuggestions(step: number): string[] {
  const suggestions: { [key: number]: string[] } = {
    1: [
      'Gdzie znajdę stan mojego konta ZUS?',
      'Jaki wiek emerytalny powinienem wybrać?',
      'Co to jest subkonto ZUS?',
    ],
    2: [
      'Jak sprawdzić stan konta ZUS online?',
      'Co to jest waloryzacja składek?',
      'Czy historia wynagrodzeń ma duży wpływ?',
    ],
    3: [
      'Czy mój wynik jest dobry?',
      'Co to jest stopa zastąpienia?',
      'Jak zwiększyć moją emeryturę?',
      'Czym różni się IKE od IKZE?',
    ],
    4: [
      'Jak zamknąć lukę do celu?',
      'Ile muszę odkładać miesięcznie?',
      'Co lepsze - PPK, IKE czy IKZE?',
    ],
    5: [
      'Czy warto pracować dłużej?',
      'Jak nadgodziny wpływają na emeryturę?',
      'Co się stanie jeśli zmienię pracę?',
    ],
    6: [
      'Jak mogę poprawić swój wynik?',
      'Co dalej po tej symulacji?',
      'Gdzie mogę otworzyć IKE?',
    ],
  };

  return suggestions[step] || [
    'Jak działa system emerytalny?',
    'Co to jest PPK?',
    'Jak oszczędzać na emeryturę?',
  ];
}
