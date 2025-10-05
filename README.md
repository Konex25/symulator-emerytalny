# 💰 Symulator Emerytalny ZUS

**Edukacyjna aplikacja webowa do prognozowania przyszłej emerytury**

Projekt stworzony dla **Zakładu Ubezpieczeń Społecznych (ZUS)** w ramach inicjatyw edukacyjnych mających na celu podniesienie świadomości młodych pracowników na temat planowania emerytalnego.

---

## 📋 Spis treści

- [O projekcie](#-o-projekcie)
- [Funkcjonalności](#-funkcjonalności)
- [Technologie](#-technologie)
- [Instalacja](#-instalacja)
- [Uruchomienie](#-uruchomienie)
- [Struktura projektu](#-struktura-projektu)
- [Dostępność](#-dostępność)
- [Panel administratora](#-panel-administratora)
- [Kolory ZUS Brand Book](#-kolory-zus-brand-book)
- [API](#-api)
- [Licencja](#-licencja)

---

## 🎯 O projekcie

**Symulator Emerytalny ZUS** to kompleksowa aplikacja umożliwiająca:
- Prognozowanie wysokości przyszłej emerytury
- Porównanie z średnią krajową
- Analizę wpływu różnych czynników (zwolnienia lekarskie, dłuższa praca)
- Wizualizację danych w formie wykresów interaktywnych
- Generowanie raportów PDF
- Zaawansowane scenariusze "co jeśli"

### Cel edukacyjny:
- Zwiększenie świadomości o systemie emerytalnym
- Pokazanie korelacji między wynagrodzeniem a przyszłą emeryturą
- Zachęcenie do dłuższej aktywności zawodowej
- Edukacja na temat wpływu zwolnień lekarskich

---

## ✅ Funkcjonalności

### 🏠 Landing Page
- ✓ Interaktywne wprowadzenie z pytaniem o oczekiwaną emeryturę
- ✓ Wykres porównawczy grup emerytalnych
- ✓ Tooltips z opisami grup przy najechaniu myszką
- ✓ Ciekawe fakty edukacyjne "Czy wiesz, że..."
- ✓ Auto-refresh faktów co 10 sekund
- ✓ Statystyki ZUS (9 mln+ emerytów, 35 lat średni staż, 60% stopa zastąpienia)

### 📝 Formularz Symulacji
- ✓ Walidacja w czasie rzeczywistym (react-hook-form + Zod)
- ✓ Pola obowiązkowe: wiek, płeć, wynagrodzenie, lata pracy
- ✓ Pola opcjonalne: środki ZUS, subkonto, oczekiwana emerytura
- ✓ Checkbox zwolnień lekarskich
- ✓ Automatyczne obliczanie roku emerytury
- ✓ Komunikaty błędów walidacji

### 📊 Ekran Wyników
- ✓ Dwie główne karty: Emerytura Nominalna i Realna
- ✓ Stopa zastąpienia z progress barem
- ✓ Wykres słupkowy: Twoja emerytura vs Średnia krajowa
- ✓ Porównanie z celem użytkownika
- ✓ Analiza luki emerytalnej z personalizowanymi sugestiami
- ✓ Analiza wpływu zwolnień lekarskich
- ✓ Instrumenty inwestycyjne: PPK, IKE, IKZE z kalkulatorami
- ✓ Dynamiczne suwaki wpłat (1-10% wynagrodzenia)
- ✓ Prognoza wartości przyszłych oszczędności

### 📈 Dashboard Zaawansowany
- ✓ Wykres liniowy timeline środków ZUS (konto + subkonto)
- ✓ Historia wynagrodzeń
- ✓ Dynamiczne zarządzanie danymi
- ✓ Przycisk "Przelicz ponownie"

### 📄 Generowanie PDF
- ✓ Raport 1:1 ze screenshotami kroków symulatora
- ✓ Automatyczne nazewnictwo pliku z datą
- ✓ Pole kodu pocztowego (opcjonalne, walidacja XX-XXX)
- ✓ Wymuszone jasne tło niezależnie od motywu użytkownika
- ✓ Zapis danych do localStorage z unikalnym sessionId

### 🔐 Panel Administratora
- ✓ Autoryzacja hasłem (demo: `demo123`)
- ✓ Statystyki: liczba symulacji, średnia emerytura, średni wiek
- ✓ Tabela z danymi (sticky header, scroll)
- ✓ Export do XLSX z automatyczną nazwą i formatowaniem
- ✓ Przycisk odśwież i usuń logi
- ✓ Dark mode support

### 🎨 UX/UI
- ✓ Responsywny design (mobile/tablet/desktop)
- ✓ Dark mode z przełącznikiem (domyślnie jasny)
- ✓ Kolory ZUS Brand Book
- ✓ Hover effects i animacje
- ✓ Loading states
- ✓ Empty states
- ✓ Error handling z komunikatami
- ✓ Walidacja wiek emerytalny i minimalnej emerytury
- ✓ Ostrzeżenie o 30-krotnym limicie podstawy składkowej

### 🤖 AI Assistant
- ✓ Chatbot z integracją OpenAI (GPT-4o-mini)
- ✓ Kontekst sytuacyjny (krok, dane użytkownika, wyniki)
- ✓ Szybkie sugestie pytań
- ✓ Streaming odpowiedzi w czasie rzeczywistym
- ✓ Floating widget z animacjami

---

## 🛠 Technologie

### Frontend
- **Next.js 14.2** - React framework z App Router
- **TypeScript 5.6** - Type safety
- **Tailwind CSS 3.4** - Utility-first styling
- **Recharts 2.12** - Wykresy interaktywne (Bar, Line)
- **React Hook Form 7.53** - Zarządzanie formularzami
- **Zod 3.23** - Walidacja schema

### Biblioteki dodatkowe
- **jsPDF 2.5** - Generowanie PDF
- **html2canvas** - Screenshoty komponentów do PDF
- **XLSX** - Export danych do Excel
- **OpenAI SDK** - Integracja chatbota AI
- **date-fns 3.6** - Formatowanie dat

### Narzędzia deweloperskie
- **ESLint** - Linting
- **PostCSS** - CSS processing
- **Autoprefixer** - Vendor prefixes

---

## 📦 Instalacja

### Wymagania
- Node.js 20.x lub nowszy
- npm 9.x lub nowszy

### Kroki instalacji

```bash
# Sklonuj repozytorium
git clone https://github.com/your-username/symulator-emerytalny.git

# Przejdź do katalogu projektu
cd symulator-emerytalny

# Zainstaluj zależności
npm install
```

---

## 🚀 Uruchomienie

### Tryb deweloperski

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: **http://localhost:3000**

### Tryb produkcyjny

```bash
# Build
npm run build

# Start
npm start
```

### Zmienne środowiskowe

Utwórz plik `.env.local` w katalogu głównym:

```bash
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
```

**Uwaga:** Klucz API OpenAI jest wymagany dla funkcjonalności chatbota AI.

### Linting

```bash
npm run lint
```

---

## 📁 Struktura projektu

```
symulator-emerytalny/
├── app/                          # Next.js App Router
│   ├── admin/                   # Panel administratora
│   │   └── page.tsx             # Strona /admin
│   ├── api/                     # API Routes
│   │   ├── calculate-pension/  # POST endpoint obliczeń
│   │   └── test/                # GET endpoint testowy
│   ├── api-docs/                # Dokumentacja API
│   │   └── page.tsx
│   ├── layout.tsx               # Root layout (header, footer)
│   ├── page.tsx                 # Strona główna
│   └── globals.css              # Style globalne + Tailwind
│
├── components/                   # Komponenty React
│   ├── AdvancedDashboard.tsx    # Dashboard zaawansowany
│   ├── ChatWidget.tsx           # Widget chatbota AI
│   ├── ExportStep.tsx           # Generowanie PDF z screenshotami
│   ├── GapAnalysis.tsx          # Analiza luki emerytalnej
│   ├── Header.tsx               # Nagłówek z logo i dark mode
│   ├── LandingScreen.tsx        # Landing page
│   ├── ResultsScreen.tsx        # Ekran wyników
│   ├── ScenarioComparer.tsx     # Porównanie scenariuszy
│   ├── SimulationForm.tsx       # Formularz symulacji
│   ├── SmartSuggestions.tsx     # Inteligentne sugestie
│   ├── ThemeProvider.tsx        # Context motywu
│   ├── ThemeScript.tsx          # Script przed hydracją
│   └── ThemeToggle.tsx          # Przełącznik dark mode
│
├── lib/                         # Biblioteki i logika biznesowa
│   ├── calculations.ts          # Algorytmy obliczeń emerytalnych
│   ├── chatSuggestions.ts       # Sugestie pytań dla chatbota
│   ├── constants.ts             # Stałe (wiek emerytalny, inflacja, limity)
│   ├── dataParsers.ts           # Parsery danych CSV
│   ├── mockData.ts              # Mock data (grupy, fakty, historia)
│   ├── pdf.ts                   # Generowanie PDF + localStorage
│   └── validationSchema.ts      # Zod schema walidacji
│
├── contexts/                    # React Contexts
│   └── SimulationContext.tsx    # Context danych symulacji
│
├── types/                       # TypeScript types
│   └── index.ts                 # Wszystkie typy projektu
│
├── utils/                       # Funkcje pomocnicze
│   └── formatters.ts            # Formatowanie (PLN, %, daty)
│
├── public/                      # Pliki statyczne
│   ├── GUS_estimated_lifespan.csv    # Dane GUS o długości życia
│   └── ValorizationParams.csv        # Parametry waloryzacji ZUS
│
├── next.config.js               # Konfiguracja Next.js
├── tailwind.config.ts           # Konfiguracja Tailwind + kolory ZUS
├── tsconfig.json                # Konfiguracja TypeScript
├── package.json                 # Dependencies
└── README.md                    # Dokumentacja
```

---

## ♿ Dostępność

Aplikacja spełnia wymogi **WCAG 2.0 (poziom AA)**:

### Zaimplementowane features:
- ✅ **ARIA labels** - wszystkie interaktywne elementy
- ✅ **ARIA roles** - regiony, alerty, progressbar
- ✅ **Keyboard navigation** - pełna obsługa klawiatury (Tab, Enter, Escape)
- ✅ **Semantic HTML** - nagłówki hierarchiczne (h1-h4)
- ✅ **Alt texts** - opisy dla elementów graficznych
- ✅ **Focus indicators** - widoczny focus (outline)
- ✅ **Kontrast kolorów** - minimum 4.5:1 dla tekstu
- ✅ **Responsywność** - działa na wszystkich urządzeniach
- ✅ **Skip navigation** - możliwość pominięcia nawigacji
- ✅ **Error messages** - komunikaty błędów z role="alert"

### Testowanie dostępności:
- Obsługa screen readers (VoiceOver, NVDA)
- Testowane na różnych urządzeniach i przeglądarkach

---

## 🔐 Panel Administratora

Panel admina dostępny pod adresem: **http://localhost:3000/admin**

### Dostęp
- **Hasło:** `demo123`
- Sesja przechowywana w `sessionStorage`

### Funkcjonalności
- Wyświetlanie statystyk (liczba symulacji, średnie wartości)
- Tabela z danymi wszystkich symulacji (sticky header)
- Export danych do pliku XLSX z formatowaniem
- Możliwość usunięcia logów
- Odświeżanie danych
- Dark mode support

### Dane przechowywane
Dane symulacji zapisywane w `localStorage` (klucz: `simulation_logs`):
- Data i czas
- Parametry wejściowe (wiek, płeć, wynagrodzenie)
- Wyniki (nominalna, realna emerytura)
- Kod pocztowy (jeśli podany)

**Uwaga:** To wersja MVP bez prawdziwego backendu. W wersji produkcyjnej dane powinny być przechowywane w bazie danych.

---

## 🎨 Kolory ZUS Brand Book

Aplikacja używa oficjalnej palety kolorów ZUS:

| Kolor | RGB | Hex | Zastosowanie |
|-------|-----|-----|--------------|
| **Żółto-złoty** | 255, 179, 79 | `#FFB34F` | Akcenty, ostrzeżenia |
| **Podstawowy zielony** | 0, 153, 63 | `#00993F` | Główne przyciski, header |
| **Szary neutralny** | 190, 195, 206 | `#BEC3CE` | Tła, separatory |
| **Niebieski dodatkowy** | 63, 132, 210 | `#3F84D2` | Wykresy, linki |
| **Ciemnoniebieski** | 0, 65, 110 | `#00416E` | Teksty główne, footer |
| **Czerwony ostrzeżenie** | 240, 94, 94 | `#F05E5E` | Błędy, komunikaty |
| **Czarny** | 0, 0, 0 | `#000000` | Teksty |

Konfiguracja w `tailwind.config.ts`:
```typescript
colors: {
  zus: {
    gold: "rgb(255, 179, 79)",
    green: "rgb(0, 153, 63)",
    gray: "rgb(190, 195, 206)",
    blue: "rgb(63, 132, 210)",
    darkblue: "rgb(0, 65, 110)",
    red: "rgb(240, 94, 94)",
    black: "rgb(0, 0, 0)",
  }
}
```

---

## 🔌 API

### POST /api/calculate-pension

Główny endpoint do obliczania prognozy emerytalnej.

**Request Body:**
```json
{
  "age": 30,
  "sex": "male",
  "grossSalary": 8000,
  "workStartYear": 2015,
  "workEndYear": 2055,
  "zusAccount": 50000,
  "zusSubAccount": 15000,
  "includeSickLeave": true,
  "desiredPension": 5000
}
```

**Response:**
```json
{
  "success": true,
  "input": { ... },
  "result": {
    "nominalPension": 4567.89,
    "realPension": 3234.56,
    "replacementRate": 0.623,
    "averagePension": 3500,
    "retirementYear": 2060,
    "sickLeaveImpact": {
      "difference": 123.45
    }
  }
}
```

### GET /api/test

Endpoint testowy z przykładowymi danymi.

**Dokumentacja pełna:** http://localhost:3000/api-docs

---

## 📊 Algorytmy obliczeń

### Emerytura nominalna
```
Składki roczne = min(Wynagrodzenie, 30× Średnia_Krajowa) × 12 × 0.1976
Konto główne: 12.22% składki
Subkonto: 7.3% składki (indeksowane PKB)
Kapitał początkowy: składki sprzed 1999 (zwaloryzowane)
Zgromadzone środki = Σ (Składki × Lata pracy) + Kapitał początkowy + Konto ZUS + Subkonto
Emerytura miesięczna = Środki / (Średnia długość życia × 12)
```

### Emerytura realna
```
Wartość realna = Nominalna / (1 + inflacja)^lata_do_emerytury
Inflacja: 2.5% rocznie (założenie)
```

### Stopa zastąpienia
```
Stopa = Emerytura / Ostatnie wynagrodzenie
Docelowa stopa w Polsce: ~60%
```

### Wpływ zwolnień
```
Dni zwolnienia rocznie: 12 (M) / 16 (K)
Składka podczas zwolnienia: 80% normalnej
Strata = (Dni × 0.2 × Składka dzienna) × Lata pracy
```

### Instrumenty dodatkowe (PPK/IKE/IKZE)
```
PPK: 3.5% wynagrodzenia (2% pracownik + 1.5% pracodawca)
IKE: do 26 019 zł/rok (2 168 zł/mies), zwolnienie z 19% podatku kapitałowego
IKZE: do 10 408 zł/rok (867 zł/mies), ulga 12-32% od PIT
Przyszła wartość = Wpłata × ((1 + r)^n - 1) / r, gdzie r = 5%/12, n = miesiące
```

---

## 📝 Licencja

**Projekt edukacyjny dla Zakładu Ubezpieczeń Społecznych (ZUS)**

© 2025 ZUS. Wszystkie prawa zastrzeżone.

---

## 👨‍💻 Autor

Projekt stworzony jako demonstracja możliwości nowoczesnych technologii webowych w służbie edukacji społecznej.

**Kontakt:**
- ZUS: www.zus.pl
- Email: kontakt@zus.pl

---

## 🚀 Roadmap (Future enhancements)

### Planowane funkcjonalności:
- [x] Kalkulator III filaru (PPK, IKE, IKZE) ✅
- [x] AI Assistant (ChatGPT) ✅
- [x] Dark mode ✅
- [x] Export do XLSX ✅
- [ ] Backend z bazą danych (PostgreSQL)
- [ ] Autentykacja użytkowników (NextAuth.js)
- [ ] Zapisywanie własnych scenariuszy użytkownika
- [ ] Więcej wykresów (pie charts, area charts)
- [ ] Porównanie z innymi krajami UE
- [ ] Wielojęzyczność (PL, EN)
- [ ] Progressive Web App (PWA)
- [ ] Historia sesji użytkownika
- [ ] Integracja z PUE ZUS API

---

## 📖 Źródła danych

### Wykorzystane dane:
- **Prognoza ZUS do 2080** - Departament Statystyki i Prognoz Aktuarialnych
- **GUS** - statystyki demograficzne i wynagrodzenia
- **NBP** - dane o inflacji
- **Ministerstwo Finansów** - prognozy makroekonomiczne

### Źródła edukacyjne:
- Ustawa o emeryturach i rentach z FUS
- Informacje ZUS dla przyszłych emerytów
- Analizy stopy zastąpienia w Polsce

---

## 🙏 Podziękowania

Dziękujemy zespołowi ZUS za udostępnienie danych i merytoryczne wsparcie w tworzeniu tego narzędzia edukacyjnego.

---

**Zbudowano z ❤️ dla lepszej przyszłości emerytalnej Polaków**
