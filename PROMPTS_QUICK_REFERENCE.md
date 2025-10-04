# Prompty Quick Reference - Symulator Emerytalny ZUS

## Jak używać tego pliku:
Kopiuj i wklejaj poniższe prompty po kolei, aby realizować kolejne milestone'y projektu.

---

## 🚀 MILESTONE 1: Setup Projektu (1h)
```
Milestone 1: Zainicjuj projekt Next.js z TypeScript. Skonfiguruj Tailwind CSS z paletą kolorów ZUS (RGB: 255,179,79 | 0,153,63 | 190,195,206 | 63,132,210 | 0,65,110 | 240,94,94 | 0,0,0). Stwórz strukturę folderów: app/, components/, lib/, types/, utils/. Zainstaluj Recharts. Zdefiniuj typy TypeScript dla SimulationInput, SimulationResult, UserData. Stwórz layout z podstawowym nagłówkiem ZUS.
```

---

## ⚙️ MILESTONE 2: Logika Obliczeń (2h)
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

## 📝 MILESTONE 3: Formularz Symulacji (2h)
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

## 📊 MILESTONE 4: Ekran Wyników (2.5h)
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

## 🎯 MILESTONE 5: Ekran Główny Landing (1.5h)
```
Milestone 5: Stwórz ekran główny (landing) app/page.tsx i components/LandingScreen.tsx:
1. Hero: Nagłówek "Jaką emeryturę chciałbyś mieć w przyszłości?" + input kwoty + mały tekst "Średnia emerytura w Polsce: 3500 PLN"
2. Wykres słupkowy: Grupy emerytalne (Poniżej minimum: 1800 PLN | Minimalna: 2000 PLN | Średnia: 3500 PLN | Powyżej średniej: 5000 PLN | Wysokie świadczenia: 8000 PLN). Tooltip przy hover pokazuje opis grupy.
3. Sekcja "Czy wiesz, że...": Losowy fakt z listy 5 faktów (np. "Najwyższa emerytura w Polsce to 48,000 PLN").
4. Przycisk CTA "Rozpocznij symulację" → scroll do formularza poniżej.

Kolory ZUS, animacje, responsywność. Landing i formularz na jednej stronie (scroll).
```

---

## 📈 MILESTONE 6: Dashboard Zaawansowany (1.5h)
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

## 📄 MILESTONE 7: Generowanie PDF (1h)
```
Milestone 7: Dodaj generowanie PDF. Zainstaluj @react-pdf/renderer lub jsPDF. Stwórz funkcję generatePDF(resultsData, inputData) w lib/pdf.ts:
- Strona 1: Tytuł "Raport Emerytalny ZUS" + logo (placeholder), data wygenerowania
- Strona 2: Parametry wejściowe (tabela)
- Strona 3: Wyniki (nominalna, realna, stopa zastąpienia, scenariusze)
- Strona 4: Wykresy (zrzut jako image lub SVG)

Dodaj przycisk "Pobierz raport PDF" w ResultsScreen. Na końcu strony dodaj pole "Kod pocztowy (opcjonalnie)" z walidacją XX-XXX format. Zapisz kod w danych sesji.
```

---

## 👨‍💼 MILESTONE 8: Panel Admin MVP (0.5h)
```
Milestone 8: Stwórz prosty panel admin (MVP):
1. Route app/admin/page.tsx z prostą autoryzacją (prompt hasła: "demo123")
2. Odczytaj dane symulacji z localStorage (klucz: "simulation_logs")
3. Wyświetl tabelę: Data | Czas | Wiek | Płeć | Wynagrodzenie | Emerytura nominalna | Emerytura realna | Kod pocztowy
4. Przycisk "Export do CSV" → pobiera plik .csv z danymi

Po każdej symulacji zapisuj dane do localStorage (append). To jest MVP bez prawdziwego backendu. Responsywna tabela.
```

---

## ✅ MILESTONE 9: Testy i Dostępność (1h)
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

## 🚀 MILESTONE 10: Deployment (1h)
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

## 🔥 PROMPT PRZYSPIESZONEGO MVP (jeśli mało czasu)

Jeśli zostało tylko 6-8h, użyj tego promptu dla core functionality:

```
Stwórz MVP symulatora emerytalnego ZUS w Next.js + TypeScript + Tailwind:

CORE FEATURES:
1. Strona główna z formularzem: wiek, płeć, wynagrodzenie brutto, rok rozpoczęcia/zakończenia pracy
2. Walidacja: react-hook-form + zod
3. Logika obliczeń w lib/calculations.ts:
   - Emerytura nominalna: (wynagrodzenie * lata_pracy * 0.24) // uproszczone
   - Emerytura realna: nominalna / (1.02 ^ lata_do_emerytury) // inflacja 2%
   - Stopa zastąpienia: emerytura / ostatnie_wynagrodzenie
4. Ekran wyników z kartami: Nominalna | Realna | Stopa zastąpienia
5. Prosty wykres Recharts: user vs średnia (3500 PLN)
6. Kolory ZUS: primary green (0,153,63), blue (63,132,210), gray (190,195,206)
7. Responsywność: mobile-first

POMIŃ: PDF, admin panel, zaawansowany dashboard, landing z faktami
CZAS: 6-7h maksymalnie

Rozpocznij od setupu projektu.
```

---

## 📋 CHECKLISTY KONTROLNE

### Po każdym milestone:
```
- [ ] npm run build działa bez błędów
- [ ] npm run dev pokazuje zmiany
- [ ] Komponenty się renderują
- [ ] Brak console.errors
- [ ] Git commit wykonany
```

### Przed uznaniem za ukończone:
```
- [ ] Formularz działa i waliduje
- [ ] Obliczenia dają sensowne wyniki
- [ ] Wykresy się wyświetlają
- [ ] Działa na mobile i desktop
- [ ] Kolory zgodne z ZUS Brand Book
- [ ] Brak krytycznych błędów
- [ ] README istnieje
- [ ] Kod w repo Git
- [ ] Aplikacja wdrożona (Vercel/Netlify)
```

---

## 🆘 TROUBLESHOOTING PROMPTS

Jeśli coś nie działa, użyj:

### Problem z TypeScript:
```
Napraw błędy TypeScript w projekcie. Przejrzyj wszystkie pliki .ts/.tsx i dodaj brakujące typy. Upewnij się, że interfejsy są poprawnie zdefiniowane.
```

### Problem z stylami:
```
Sprawdź konfigurację Tailwind CSS. Upewnij się, że kolory ZUS są zdefiniowane w tailwind.config.js i działają w komponentach.
```

### Problem z wykresami:
```
Debuguj wykresy Recharts. Sprawdź czy dane są w poprawnym formacie, czy komponent jest poprawnie zaimportowany i czy ResponsiveContainer jest użyty.
```

### Problem z formularzem:
```
Napraw walidację formularza react-hook-form. Upewnij się, że schema Zod jest poprawna, błędy są wyświetlane i submit jest obsługiwany.
```

---

**Powodzenia z realizacją! 🎉**

