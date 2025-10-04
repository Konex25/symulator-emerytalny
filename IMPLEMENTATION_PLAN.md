# Plan Realizacji - Symulator Emerytalny ZUS (12h)

## Założenia Czasowe

**Łączny czas: 12 godzin**
**Strategia:** MVP z priorytetami MUST HAVE + wybrane SHOULD HAVE

---

## MILESTONE 1: Setup Projektu i Architektura (1h)

**Cel:** Przygotowanie środowiska deweloperskiego i podstawowej struktury projektu

### Zakres:
- Inicjalizacja projektu Next.js + TypeScript
- Konfiguracja Tailwind CSS z paletą kolorów ZUS
- Struktura folderów
- Podstawowe typy TypeScript
- Konfiguracja biblioteki wykresów (Recharts)
- Setup routingu

### Deliverables:
- ✅ Działający projekt Next.js
- ✅ Konfiguracja Tailwind z kolorami ZUS
- ✅ Podstawowa struktura komponentów
- ✅ Typy dla danych symulacji

### Prompt do wywołania:
```
Milestone 1: Zainicjuj projekt Next.js z TypeScript. Skonfiguruj Tailwind CSS z paletą kolorów ZUS (RGB: 255,179,79 | 0,153,63 | 190,195,206 | 63,132,210 | 0,65,110 | 240,94,94 | 0,0,0). Stwórz strukturę folderów: app/, components/, lib/, types/, utils/. Zainstaluj Recharts. Zdefiniuj typy TypeScript dla SimulationInput, SimulationResult, UserData. Stwórz layout z podstawowym nagłówkiem ZUS.
```

---

## MILESTONE 2: Logika Obliczeń Backend (2h)

**Cel:** Implementacja algorytmów kalkulacji emerytur

### Zakres:
- Logika indeksacji wstecznej wynagrodzeń
- Kalkulacja emerytury nominalnej
- Kalkulacja emerytury realnej (z inflacją)
- Stopa zastąpienia
- Wpływ zwolnień lekarskich
- Scenariusze +1, +2, +5 lat pracy
- Obliczenia lat potrzebnych do osiągnięcia celu
- API routes w Next.js

### Deliverables:
- ✅ `/api/calculate-pension` endpoint
- ✅ Funkcje pomocnicze w `lib/calculations.ts`
- ✅ Mock danych historycznych (inflacja, wzrost wynagrodzeń)
- ✅ Testy podstawowych przypadków

### Prompt do wywołania:
```
Milestone 2: Zaimplementuj logikę obliczeń emerytalnych. Stwórz plik lib/calculations.ts z funkcjami:
- calculateNominalPension(wiek, płeć, wynagrodzenie, rokRozpoczęcia, rokZakończenia, środkiZUS?)
- calculateRealPension(nominalna, rokEmerytury, inflacja)
- calculateReplacementRate(emerytura, ostatnieWynagrodzenie)
- calculateSickLeaveImpact(lataPracy, płeć)
- calculateLaterRetirementBonus(bazowa, dodatkoweLata)
- calculateYearsNeeded(obecnaEmerytura, celEmerytura, wynagrodzenie)

Dodaj API route /api/calculate-pension. Użyj mocków dla danych inflacji (2% rocznie) i wzrostu wynagrodzeń (4% rocznie). Wiek emerytalny: 60(K)/65(M).
```

---

## MILESTONE 3: Formularz Symulacji + Walidacja (2h)

**Cel:** Stworzenie interaktywnego formularza z walidacją

### Zakres:
- Komponent formularza symulacji
- Pola obowiązkowe (wiek, płeć, wynagrodzenie, rok rozpoczęcia/zakończenia)
- Pola opcjonalne (środki ZUS, checkbox zwolnień)
- Walidacja danych (react-hook-form + zod)
- Obliczanie domyślnego roku zakończenia pracy
- Auto-szacowanie środków ZUS
- Responsywny design
- Komunikaty błędów

### Deliverables:
- ✅ Komponent `SimulationForm.tsx`
- ✅ Walidacja z react-hook-form + zod
- ✅ UI zgodny z Brand Book ZUS
- ✅ Responsywność mobile/desktop

### Prompt do wywołania:
```
Milestone 3: Stwórz komponent SimulationForm w components/SimulationForm.tsx. Użyj react-hook-form i zod do walidacji. Pola:
- Wiek (18-67, number)
- Płeć (select: Kobieta/Mężczyzna)
- Wynagrodzenie brutto (min 3000, number)
- Rok rozpoczęcia pracy (1960-2025)
- Rok zakończenia (auto: wiek emerytalny, edytowalne)
- Środki ZUS/subkonto (opcjonalne, number)
- Checkbox "Uwzględnij zwolnienia lekarskie"

Stylizacja: Tailwind, kolory ZUS, responsywny grid. Przycisk "Prognozuj moją przyszłą emeryturę" po wypełnieniu. Pokaż błędy walidacji.
```

---

## MILESTONE 4: Ekran Wyników z Wizualizacjami (2.5h)

**Cel:** Wyświetlenie wyników symulacji z wykresami

### Zakres:
- Komponent wyświetlania wyników
- Karta z emeryturą nominalną i realną
- Porównanie ze średnią krajową
- Stopa zastąpienia
- Wykres porównawczy (użytkownik vs średnia)
- Tabela scenariuszy (+1, +2, +5 lat)
- Informacja o różnicy z oczekiwaną emeryturą
- "Musisz pracować X lat dłużej" (jeśli dotyczy)
- Animacje wejścia

### Deliverables:
- ✅ Komponent `ResultsScreen.tsx`
- ✅ Wykresy Recharts
- ✅ Karty wyników z ikonami
- ✅ Responsywny layout

### Prompt do wywołania:
```
Milestone 4: Stwórz ekran wyników w components/ResultsScreen.tsx. Wyświetl:
1. Dwie główne karty: Emerytura Nominalna (z ikoną) | Emerytura Realna (z ikoną inflacji)
2. Karta "Stopa zastąpienia" z % i opisem
3. Wykres słupkowy (Recharts): Twoja emerytura vs Średnia krajowa
4. Tabela scenariuszy: "Jeśli pracujesz dłużej" (+1, +2, +5 lat) → kwoty
5. Sekcja porównania z celem: "Twoja emerytura: X PLN | Twój cel: Y PLN" → komunikat o brakujących latach jeśli X < Y
6. Wpływ zwolnień (jeśli zaznaczono)

Użyj palety ZUS, dodaj tooltips do wykresów, animacje fade-in. Responsywność.
```

---

## MILESTONE 5: Ekran Główny (Landing) (1.5h)

**Cel:** Wprowadzenie użytkownika + edukacja + kontekst

### Zakres:
- Hero section z pytaniem "Jaką emeryturę chciałbyś mieć?"
- Input z walidacją kwoty
- Wykres porównawczy grup emerytalnych
- Tooltips z opisami grup
- Sekcja "Czy wiesz, że..." z losowymi faktami
- Przycisk "Rozpocznij symulację"
- Animacje i interaktywność

### Deliverables:
- ✅ Komponent `LandingScreen.tsx`
- ✅ Wykres grup emerytalnych (bar/pie chart)
- ✅ System losowych faktów
- ✅ Smooth scroll do formularza

### Prompt do wywołania:
```
Milestone 5: Stwórz ekran główny (landing) app/page.tsx i components/LandingScreen.tsx:
1. Hero: Nagłówek "Jaką emeryturę chciałbyś mieć w przyszłości?" + input kwoty + mały tekst "Średnia emerytura w Polsce: 3500 PLN"
2. Wykres słupkowy: Grupy emerytalne (Poniżej minimum: 1800 PLN | Minimalna: 2000 PLN | Średnia: 3500 PLN | Powyżej średniej: 5000 PLN | Wysokie świadczenia: 8000 PLN). Tooltip przy hover pokazuje opis grupy.
3. Sekcja "Czy wiesz, że...": Losowy fakt z listy 5 faktów (np. "Najwyższa emerytura w Polsce to 48,000 PLN").
4. Przycisk CTA "Rozpocznij symulację" → scroll do formularza poniżej.

Kolory ZUS, animacje, responsywność. Landing i formularz na jednej stronie (scroll).
```

---

## MILESTONE 6: Dashboard Zaawansowany (1.5h)

**Cel:** Dodatkowe narzędzia dla użytkowników chcących głębszej analizy

### Zakres:
- Sekcja dashboard po wynikach
- Input historycznych wynagrodzeń (rok + kwota)
- Slider/input dla przyszłej inflacji
- Dodawanie okresów zwolnień lekarskich
- Wykres liniowy: wzrost środków ZUS w czasie
- Przeliczanie na żywo

### Deliverables:
- ✅ Komponent `AdvancedDashboard.tsx`
- ✅ Wykres liniowy Recharts (timeline)
- ✅ Dynamiczne dodawanie wpisów
- ✅ Recalculation on change

### Prompt do wywołania:
```
Milestone 6: Stwórz dashboard w components/AdvancedDashboard.tsx (wyświetla się po wynikach jako accordion/sekcja):
1. Sekcja "Historia wynagrodzeń": Tabela z możliwością dodania wpisów (Rok | Kwota brutto) + przycisk "Dodaj rok"
2. Slider "Przewidywana inflacja": 0-10%, domyślnie 2%
3. Sekcja "Zwolnienia lekarskie": Lista okresów (Od | Do | Dni) + przycisk "Dodaj zwolnienie"
4. Wykres liniowy (Recharts): Oś X = lata, Oś Y = zgromadzone środki na koncie ZUS (line chart, 2 linie: konto + subkonto)
5. Przycisk "Przelicz ponownie" → wywołuje API z nowymi danymi

Użyj stanu React do zarządzania dynamicznymi wpisami. Responsywność.
```

---

## MILESTONE 7: Generowanie PDF + Kod Pocztowy (1h)

**Cel:** Export wyników do PDF i zbieranie danych regionalnych

### Zakres:
- Integracja react-to-pdf lub jsPDF
- Template PDF z wynikami, wykresami, parametrami
- Logo i branding ZUS w PDF
- Opcjonalne pole kodu pocztowego na końcu
- Przycisk "Pobierz raport PDF"

### Deliverables:
- ✅ Funkcja `generatePDF()` w `lib/pdf.ts`
- ✅ Przycisk download w ResultsScreen
- ✅ Input kodu pocztowego (opcjonalny)
- ✅ PDF zawiera wszystkie dane

### Prompt do wywołania:
```
Milestone 7: Dodaj generowanie PDF. Zainstaluj @react-pdf/renderer lub jsPDF. Stwórz funkcję generatePDF(resultsData, inputData) w lib/pdf.ts:
- Strona 1: Tytuł "Raport Emerytalny ZUS" + logo (placeholder), data wygenerowania
- Strona 2: Parametry wejściowe (tabela)
- Strona 3: Wyniki (nominalna, realna, stopa zastąpienia, scenariusze)
- Strona 4: Wykresy (zrzut jako image lub SVG)

Dodaj przycisk "Pobierz raport PDF" w ResultsScreen. Na końcu strony dodaj pole "Kod pocztowy (opcjonalnie)" z walidacją XX-XXX format. Zapisz kod w danych sesji.
```

---

## MILESTONE 8: Panel Administratora + Analytics (0.5h - MVP)

**Cel:** Podstawowe zbieranie danych użycia (bez pełnej bazy danych)

### Zakres:
- Zapisywanie danych sesji do localStorage (demo)
- Prosty panel admin (chroniony hasłem demo)
- Wyświetlenie listy symulacji
- Przycisk "Export do CSV" (simplified zamiast .xls)
- Mock funkcjonalności (bez prawdziwego backendu)

### Deliverables:
- ✅ Route `/admin` z prostym hasłem
- ✅ Wyświetlenie danych z localStorage
- ✅ Export do CSV

### Prompt do wywołania:
```
Milestone 8: Stwórz prosty panel admin (MVP):
1. Route app/admin/page.tsx z prostą autoryzacją (prompt hasła: "demo123")
2. Odczytaj dane symulacji z localStorage (klucz: "simulation_logs")
3. Wyświetl tabelę: Data | Czas | Wiek | Płeć | Wynagrodzenie | Emerytura nominalna | Emerytura realna | Kod pocztowy
4. Przycisk "Export do CSV" → pobiera plik .csv z danymi

Po każdej symulacji zapisuj dane do localStorage (append). To jest MVP bez prawdziwego backendu. Responsywna tabela.
```

---

## MILESTONE 9: Testy, Poprawki, Dostępność (1h)

**Cel:** Zapewnienie jakości i zgodności z WCAG 2.0

### Zakres:
- Testy manualne wszystkich flow
- Sprawdzenie responsywności
- Dodanie ARIA labels
- Keyboard navigation
- Testy na różnych przeglądarkach
- Poprawki błędów
- Optymalizacja wydajności

### Deliverables:
- ✅ Wszystkie flow działają
- ✅ ARIA labels dodane
- ✅ Keyboard navigation
- ✅ Responsywność przetestowana
- ✅ Bugfixes

### Prompt do wywołania:
```
Milestone 9: Przeprowadź testy i poprawki:
1. Dodaj ARIA labels do wszystkich interaktywnych elementów (buttons, inputs, links)
2. Sprawdź keyboard navigation (Tab, Enter, Escape)
3. Przetestuj responsywność na breakpointach: mobile (375px), tablet (768px), desktop (1920px)
4. Zweryfikuj kontrast kolorów zgodnie z WCAG 2.0 (minimum AA)
5. Dodaj skip navigation link
6. Przetestuj cały flow: Landing → Formularz → Wyniki → Dashboard → PDF → Admin
7. Popraw znalezione błędy
8. Dodaj loading states i error handling w formularzach

Użyj narzędzi: Lighthouse, axe DevTools. Lista błędów do naprawy w priorytecie.
```

---

## MILESTONE 10: Deployment + Dokumentacja (1h)

**Cel:** Uruchomienie aplikacji i dokumentacja

### Zakres:
- Deployment na Vercel
- Konfiguracja zmiennych środowiskowych
- README.md z instrukcją uruchomienia
- Dokumentacja API
- Instrukcja użytkownika (krótka)

### Deliverables:
- ✅ Live URL aplikacji
- ✅ README.md
- ✅ Dokumentacja dla dewelopera

### Prompt do wywołania:
```
Milestone 10: Deployment i dokumentacja:
1. Stwórz README.md z:
   - Opis projektu
   - Technologie użyte
   - Instrukcja instalacji (npm install, npm run dev)
   - Zmienne środowiskowe (jeśli są)
   - Struktura projektu
2. Dodaj komentarze JSDoc do głównych funkcji w lib/calculations.ts
3. Stwórz plik USAGE.md z instrukcją dla użytkownika końcowego (screenshots opcjonalnie)
4. Przygotuj deployment na Vercel:
   - Zainicjuj git repo (jeśli nie jest)
   - Push do GitHub
   - Connect z Vercel
   - Deploy

Podaj finalny URL aplikacji.
```

---

## HARMONOGRAM GODZINOWY

| Milestone | Czas | Skumulowany | Priorytet |
|-----------|------|-------------|-----------|
| M1: Setup | 1h | 1h | MUST |
| M2: Backend Logic | 2h | 3h | MUST |
| M3: Formularz | 2h | 5h | MUST |
| M4: Wyniki | 2.5h | 7.5h | MUST |
| M5: Landing | 1.5h | 9h | SHOULD |
| M6: Dashboard | 1.5h | 10.5h | SHOULD |
| M7: PDF | 1h | 11.5h | COULD |
| M8: Admin (MVP) | 0.5h | 12h | COULD |
| M9: Testy | 1h* | 13h* | MUST |
| M10: Deploy | 1h* | 14h* | MUST |

*M9 i M10 mogą być równoległe z ostatnimi milestone'ami lub robione na bieżąco

---

## STRATEGIA PRZYSPIESZONA (jeśli brak czasu)

### Jeśli zostaje 8h:
- M1, M2, M3, M4 (core functionality) = 7.5h
- Skrócone testy + deploy = 0.5h

### Jeśli zostaje 10h:
- M1-M5 (z landingiem) = 9h
- Podstawowe testy + deploy = 1h

### Pełna wersja 12h+:
- M1-M8 z testami na końcu

---

## CHECKLISTY DO KAŻDEGO MILESTONE

### Po każdym milestone sprawdź:
- [ ] Kod kompiluje się bez błędów
- [ ] Komponenty renderują się poprawnie
- [ ] Żadne console.errors
- [ ] Git commit z opisem: "feat: [M#] [opis]"
- [ ] Szybki test manualny działania

---

## WSPARCIE I ZASOBY

### Mock Data potrzebne:
- `data/pension-groups.json` - grupy emerytalne dla wykresu
- `data/fun-facts.json` - losowe fakty
- `data/inflation-rates.json` - historyczna inflacja 1990-2024
- `data/wage-growth.json` - wzrost wynagrodzeń 1990-2024
- `data/sick-leave-averages.json` - średnie zwolnienia M/K

### Przydatne biblioteki:
```json
{
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "recharts": "^2.x",
    "@react-pdf/renderer": "^3.x",
    "date-fns": "^2.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "@types/node": "^20.x",
    "@types/react": "^18.x"
  }
}
```

---

## OSTATECZNY CHECKLIST

### Przed uznaniem projektu za ukończony:
- [ ] Wszystkie pola formularza działają
- [ ] Obliczenia dają sensowne wyniki
- [ ] Wykresy się wyświetlają
- [ ] Responsywność działa
- [ ] Kolorystyka zgodna z ZUS
- [ ] PDF się generuje
- [ ] Admin panel pokazuje dane
- [ ] Brak krytycznych błędów
- [ ] Kod jest w repo
- [ ] Aplikacja jest wdrożona
- [ ] README istnieje

---

**Powodzenia! 🚀**

**Tip:** Po każdym milestone rób commit. Jeśli coś pójdzie nie tak, możesz wrócić do poprzedniego kroku.

