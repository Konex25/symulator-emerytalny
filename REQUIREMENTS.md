# Wymagania Funkcjonalne i Techniczne - Symulator Emerytalny ZUS

## 1. WYMAGANIA FUNKCJONALNE

### 1.1. Ekran Główny (Landing)
- [ ] Pytanie: "Jaką emeryturę chciałbyś mieć w przyszłości?"
- [ ] Wyświetlenie informacji kontekstowej - porównanie ze średnim świadczeniem
- [ ] Wykres/wizualizacja średnich emerytur według grup
- [ ] Hover na wykresie pokazuje opis grupy (np. "Poniżej minimalnej emerytury")
- [ ] Losowe fakty "Czy wiesz, że..." przy każdym wejściu
- [ ] Przykład: "Najwyższa emerytura w Polsce to X PLN (mieszkaniec Śląska, X lat pracy, bez zwolnień)"

### 1.2. Formularz Symulacji

#### Pola Obowiązkowe:
- [ ] Wiek
- [ ] Płeć
- [ ] Kwota wynagrodzenia brutto
- [ ] Rok rozpoczęcia pracy
- [ ] Planowany rok zakończenia aktywności zawodowej (domyślnie = wiek emerytalny)

#### Pola Opcjonalne:
- [ ] Środki zgromadzone na koncie ZUS
- [ ] Środki zgromadzone na subkoncie ZUS

#### Opcje Dodatkowe:
- [ ] Checkbox: "Uwzględnij możliwość zwolnienia lekarskiego"
  - Symulacja dostosowuje się do średniego czasu zwolnień wg płci
  - Wyświetla informację o średnim krajowym czasie zwolnień i wpływie na świadczenie

#### Zachowanie Systemu:
- [ ] Jeśli środki nie są wprowadzone ręcznie → szacowanie na podstawie historii wynagrodzeń
- [ ] Pensje są **indeksowane wstecz** przez średni krajowy wzrost wynagrodzeń (dane NBP/GUS)
- [ ] Początek i koniec pracy zawsze odnoszą się do **stycznia**
- [ ] Po wprowadzeniu danych pojawia się przycisk: **"Prognozuj moją przyszłą emeryturę"**

### 1.3. Ekran Wyników

#### Wyświetlane Wartości:
- [ ] **Nominalna (rzeczywista)** kwota emerytury
- [ ] **Realna (skorygowana o inflację)** kwota emerytury

#### Dodatkowe Informacje:
- [ ] Porównanie z prognozowaną **średnią emeryturą** w roku przejścia na emeryturę
- [ ] **Stopa zastąpienia** (prognozowane świadczenie ÷ zindeksowane wynagrodzenie)
- [ ] Różnica w wynagrodzeniu **z i bez zwolnień lekarskich**
- [ ] Symulacja wzrostu emerytury przy późniejszym przejściu na emeryturę:
  - +1 rok
  - +2 lata
  - +5 lat
- [ ] Porównanie z **oczekiwaną emeryturą użytkownika**:
  - Jeśli prognoza < oczekiwanie → komunikat:  
    **"Musisz pracować o X lat dłużej, aby osiągnąć swój cel"**

### 1.4. Dashboard Symulatora Emerytur

Po symulacji użytkownik ma dostęp do **Dashboard** dla głębszej analizy:
- [ ] Wprowadzanie historycznych danych o wynagrodzeniu (konkretne lata)
- [ ] Dostosowanie przyszłych stóp waloryzacji
- [ ] Wprowadzanie okresów zwolnień lekarskich (przeszłych i przyszłych)
- [ ] Wykres: **wzrost nagromadzenia** na koncie i subkoncie ZUS w czasie

### 1.5. Pobieranie Raportu

- [ ] Użytkownik może **pobrać raport (.pdf)** zawierający:
  - Wyniki prognozy
  - Wykresy i tabele
  - Wszystkie wprowadzone parametry

### 1.6. Pole Kodu Pocztowego

- [ ] Na końcu opcjonalne pole: **kod pocztowy**
  - (Używane do analizy regionalnej; nieobowiązkowe)

### 1.7. Raportowanie Zainteresowania (Panel Administratora)

#### Funkcjonalność Administratora:
- [ ] Pobieranie raportu użycia w formacie `.xls`

#### Nagłówki Raportu:
| Pole | Opis |
|------|------|
| Data użycia | Data dostępu do symulatora |
| Czas użycia | Czas trwania sesji |
| Oczekiwana emerytura | Pożądana wartość emerytury użytkownika |
| Wiek | Wprowadzony wiek |
| Płeć | Wybrana płeć |
| Kwota wynagrodzenia | Wprowadzone wynagrodzenie brutto |
| Zwolnienie uwzględnione | Tak/Nie |
| Środki na koncie/subkoncie | Zadeklarowane lub szacowane |
| Rzeczywista emerytura | Nominalna wartość prognozy |
| Realna emerytura | Wartość skorygowana o inflację |
| Kod pocztowy | Opcjonalny identyfikator regionalny |

---

## 2. WYMAGANIA TECHNICZNE

### 2.1. Platforma
- [ ] Aplikacja webowa
- [ ] Dostępna przez oficjalną stronę ZUS
- [ ] Zgodność ze standardami **WCAG 2.0**
- [ ] Responsywność (mobile, tablet, desktop)

### 2.2. Frontend

#### Technologie (sugerowane):
- [ ] React / Next.js
- [ ] TypeScript
- [ ] Tailwind CSS lub styled-components
- [ ] Biblioteka wykresów (Chart.js / Recharts / D3.js)

#### Wymagania UI/UX:
- [ ] Tożsamość wizualna zgodna z **ZUS Brand Book**
- [ ] Paleta kolorów ZUS:

| Kolor nr | RGB | Zastosowanie |
|----------|-----|--------------|
| 1 | 255, 179, 79 | Żółto-złoty akcent |
| 2 | 0, 153, 63 | Podstawowy zielony |
| 3 | 190, 195, 206 | Szary neutralny |
| 4 | 63, 132, 210 | Niebieski dodatkowy |
| 5 | 0, 65, 110 | Ciemnoniebieski tekst |
| 6 | 240, 94, 94 | Czerwony ostrzeżenie |
| 7 | 0, 0, 0 | Czarny tekst |

- [ ] Interaktywne wykresy z tooltipami
- [ ] Animacje przejść między ekranami
- [ ] Dostępność (ARIA labels, keyboard navigation)

### 2.3. Backend

#### Wymagania:
- [ ] API do obliczeń emerytalnych
- [ ] Integracja z danymi:
  - Prognozy ZUS do 2080 roku
  - Dane GUS (statystyki demograficzne)
  - Dane NBP (inflacja, wzrost wynagrodzeń)
  - Dane Ministerstwa Finansów
- [ ] Walidacja danych wejściowych
- [ ] Logika obliczeń:
  - Indeksacja wsteczna wynagrodzeń
  - Kalkulacja emerytury nominalnej i realnej
  - Stopa zastąpienia
  - Wpływ zwolnień lekarskich
  - Scenariusze późniejszego przejścia na emeryturę

#### Technologie (sugerowane):
- [ ] Node.js / Python (FastAPI)
- [ ] PostgreSQL / MongoDB (przechowywanie danych)
- [ ] Redis (cache dla danych statystycznych)

### 2.4. Bezpieczeństwo i Prywatność
- [ ] Zgodność z RODO
- [ ] Szyfrowanie danych w transporcie (HTTPS)
- [ ] Anonimizacja danych analitycznych
- [ ] Brak przechowywania danych osobowych bez zgody
- [ ] Opcjonalne dane (kod pocztowy) z jasną informacją o celu

### 2.5. Analytics i Raportowanie
- [ ] System zbierania danych użycia (backend)
- [ ] Panel administratora
- [ ] Export do .xls
- [ ] Agregacja danych demograficznych i regionalnych

### 2.6. Generowanie PDF
- [ ] Biblioteka do generowania PDF (puppeteer / jsPDF / PDFKit)
- [ ] Template raportu zawierający:
  - Wykresy
  - Tabele wyników
  - Parametry wejściowe
  - Logo i branding ZUS

---

## 3. ŹRÓDŁA DANYCH

### 3.1. Główne
- [ ] Prognoza przychodów i wydatków Funduszu Emerytalnego do **2080**
  - Źródło: Departament Statystyki i Prognoz Aktuarialnych ZUS

### 3.2. Uzupełniające
- [ ] **GUS** - Główny Urząd Statystyczny
  - Statystyki demograficzne
  - Średnie wynagrodzenia
  - Czas pracy
- [ ] **NBP** - Narodowy Bank Polski
  - Dane inflacyjne
  - Wskaźniki wzrostu wynagrodzeń
- [ ] **Ministerstwo Finansów**
  - Prognozy makroekonomiczne
- [ ] **Wewnętrzne dane ZUS**
  - Średnie świadczenia
  - Czasy zwolnień lekarskich wg płci
  - Grupy beneficjentów

---

## 4. KRYTERIA SUKCESU

- [ ] Aplikacja dostępna i funkcjonalna
- [ ] Wszystkie obliczenia zgodne z metodologią ZUS
- [ ] UI/UX intuicyjny i zgodny z Brand Book
- [ ] Zgodność z WCAG 2.0
- [ ] Raportowanie działa poprawnie
- [ ] Generowanie PDF bez błędów
- [ ] Responsywność na wszystkich urządzeniach
- [ ] Testy użyteczności pozytywne

---

## 5. PRIORYTETYZACJA (dla realizacji 12h)

### MUST HAVE (Priorytet 1):
- Formularz symulacji (pola obowiązkowe)
- Logika obliczeń podstawowych (nominalna emerytura)
- Ekran wyników (podstawowe wartości)
- Responsywny UI z kolorami ZUS

### SHOULD HAVE (Priorytet 2):
- Ekran główny z wykresem i faktami
- Realna emerytura (skorygowana o inflację)
- Stopa zastąpienia
- Symulacja późniejszego przejścia na emeryturę
- Zwolnienia lekarskie

### COULD HAVE (Priorytet 3):
- Dashboard zaawansowany
- Generowanie PDF
- Kod pocztowy
- Panel administratora z eksportem .xls

### WON'T HAVE (w pierwszej wersji):
- Pełna integracja z systemami ZUS
- Zaawansowane scenariusze "what-if"
- Wielojęzyczność

