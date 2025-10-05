'use client';

import { useState } from 'react';
import { SimulationInput, SimulationResult } from '@/types';
import {
  validatePostalCode,
  formatCurrency,
  formatPercent,
} from "@/utils/formatters";
import { generatePDF, saveSimulationToLocalStorage } from "@/lib/pdf";
import {
  calculateGap,
  suggestOptimalPaths,
  calculateWorkLongerScenarios,
  calculateExtraIncomeScenarios,
} from "@/lib/calculations";
import { RETIREMENT_AGE } from "@/lib/constants";

interface ExportStepProps {
  input: SimulationInput;
  result: SimulationResult;
  onNewSimulation: () => void;
}

export default function ExportStep({
  input,
  result,
  onNewSimulation,
}: ExportStepProps) {
  const [postalCode, setPostalCode] = useState("");
  const [postalCodeError, setPostalCodeError] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPostalCode(value);

    if (value && !validatePostalCode(value)) {
      setPostalCodeError("Format: XX-XXX (np. 00-950)");
    } else {
      setPostalCodeError("");
    }
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);

    try {
      saveSimulationToLocalStorage(input, result, postalCode || undefined);

      // Czekaj chwilę aby DOM się zaktualizował
      await new Promise((resolve) => setTimeout(resolve, 100));

      await generatePDF(input, result, postalCode || undefined);

      setTimeout(() => {
        setIsGeneratingPDF(false);
        setPdfGenerated(true);
      }, 500);
    } catch (error) {
      console.error("Błąd generowania PDF:", error);
      setIsGeneratingPDF(false);
      alert("Wystąpił błąd podczas generowania raportu PDF");
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick stats summary - NA GÓRZE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-white dark:bg-gray-800 text-center">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Twoja emerytura
          </div>
          <div className="text-xl font-bold text-zus-green dark:text-zus-gold">
            {result.nominalPension.toLocaleString("pl-PL")} PLN
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800 text-center">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Stopa zastąpienia
          </div>
          <div className="text-xl font-bold text-zus-blue dark:text-zus-gold">
            {(result.replacementRate * 100).toFixed(0)}%
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800 text-center">
          <div className="text-3xl mb-2">📅</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Rok emerytury
          </div>
          <div className="text-xl font-bold text-zus-darkblue dark:text-white">
            {result.retirementYear}
          </div>
        </div>
      </div>
      {/* Success message if PDF generated */}
      {pdfGenerated && (
        <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="text-5xl">✅</div>
            <div>
              <h3 className="text-2xl font-bold mb-1">Raport wygenerowany!</h3>
              <p className="opacity-90">
                Twój raport PDF został pobrany. Sprawdź folder
                &quot;Pobrane&quot;.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PDF Download section */}
      <div className="card bg-gradient-to-br from-zus-gold/10 to-white dark:from-zus-gold/20 dark:to-gray-800 border-l-4 border-zus-gold">
        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl">📄</div>
          <div>
            <h3 className="text-2xl font-bold text-zus-darkblue dark:text-white mb-1">
              Pobierz kompletny raport PDF
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Zapisz szczegółowy raport z rzeczywistymi widokami wszystkich
              kroków symulacji
            </p>
          </div>
        </div>

        {/* Postal code input */}
        <div className="mb-6">
          <label htmlFor="postal-code" className="label mb-2">
            Kod pocztowy (opcjonalnie)
          </label>
          <input
            id="postal-code"
            type="text"
            value={postalCode}
            onChange={handlePostalCodeChange}
            placeholder="np. 00-950"
            maxLength={6}
            className={`input-field max-w-xs ${
              postalCodeError ? "border-zus-red" : ""
            }`}
            aria-invalid={postalCodeError ? "true" : "false"}
            aria-describedby={
              postalCodeError
                ? "postal-code-error postal-code-help"
                : "postal-code-help"
            }
          />
          {postalCodeError && (
            <p
              id="postal-code-error"
              className="text-zus-red text-sm mt-1"
              role="alert"
            >
              {postalCodeError}
            </p>
          )}
          <p
            id="postal-code-help"
            className="text-xs text-gray-500 dark:text-gray-400 mt-1"
          >
            Format: XX-XXX (np. 00-950). Dane są anonimowe i służą do analiz
            regionalnych.
          </p>
        </div>

        {/* Download button */}
        <button
          onClick={handleGeneratePDF}
          disabled={isGeneratingPDF || (postalCode !== "" && !!postalCodeError)}
          className="btn-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
        >
          {isGeneratingPDF ? (
            <span className="flex items-center gap-2 justify-center">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generowanie...
            </span>
          ) : pdfGenerated ? (
            "✓ Raport pobrany"
          ) : (
            "📥 Pobierz raport PDF"
          )}
        </button>

        {/* Info */}
        <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            📋 <strong>Co zawiera raport?</strong> Rzeczywiste screenshoty
            wszystkich kroków:
          </p>
          <ul className="text-xs text-gray-600 dark:text-gray-400 mt-2 ml-4 space-y-1">
            <li>📝 Screenshot danych wejściowych (Krok 1-2)</li>
            <li>📊 Screenshot prognozy z kartami i tabelami (Krok 3)</li>
            <li>🎯 Screenshot analizy celu i sugestii (Krok 4)</li>
            <li>📊 Screenshot porównania scenariuszy (Krok 5)</li>
            <li>✨ PDF wygląda dokładnie jak w aplikacji!</li>
          </ul>
        </div>
      </div>

      {/* Educational resources */}
      <div className="card bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 border-l-4 border-blue-500">
        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl">📚</div>
          <div>
            <h3 className="text-2xl font-bold text-zus-darkblue dark:text-white mb-1">
              Dowiedz się więcej o oszczędzaniu
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Przydatne zasoby edukacyjne do planowania finansowego
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* ZUS.pl */}
          <a
            href="https://www.zus.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="card bg-white dark:bg-gray-700 hover:shadow-lg transition-all hover:scale-105 border-2 border-transparent hover:border-zus-green"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">🏛️</div>
              <h4 className="font-bold text-lg text-zus-darkblue dark:text-white mb-2">
                Portal ZUS
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Oficjalna strona Zakładu Ubezpieczeń Społecznych - wszystko o emeryturach
              </p>
              <span className="text-xs text-zus-green dark:text-zus-gold font-semibold">
                Odwiedź →
              </span>
            </div>
          </a>

          {/* Gov.pl PPK */}
          <a
            href="https://www.mojeppk.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="card bg-white dark:bg-gray-700 hover:shadow-lg transition-all hover:scale-105 border-2 border-transparent hover:border-zus-blue"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">💼</div>
              <h4 className="font-bold text-lg text-zus-darkblue dark:text-white mb-2">
                Pracownicze Plany Kapitałowe
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Wszystko o PPK - jak działa i jakie daje korzyści
              </p>
              <span className="text-xs text-zus-blue dark:text-zus-gold font-semibold">
                Odwiedź →
              </span>
            </div>
          </a>

          {/* KNF */}
          <a
            href="https://www.knf.gov.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="card bg-white dark:bg-gray-700 hover:shadow-lg transition-all hover:scale-105 border-2 border-transparent hover:border-purple-500"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <h4 className="font-bold text-lg text-zus-darkblue dark:text-white mb-2">
                Komisja Nadzoru Finansowego
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Edukacja finansowa, inwestycje i oszczędzanie
              </p>
              <span className="text-xs text-purple-600 dark:text-zus-gold font-semibold">
                Odwiedź →
              </span>
            </div>
          </a>

          {/* ZBP */}
          <a
            href="https://zbp.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="card bg-white dark:bg-gray-700 hover:shadow-lg transition-all hover:scale-105 border-2 border-transparent hover:border-orange-500"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">🎓</div>
              <h4 className="font-bold text-lg text-zus-darkblue dark:text-white mb-2">
                Związek Banków Polskich
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Edukacja finansowa i programy oszczędnościowe
              </p>
              <span className="text-xs text-orange-600 dark:text-zus-gold font-semibold">
                Odwiedź →
              </span>
            </div>
          </a>

          {/* Gov.pl */}
          <a
            href="https://www.gov.pl/web/finanse"
            target="_blank"
            rel="noopener noreferrer"
            className="card bg-white dark:bg-gray-700 hover:shadow-lg transition-all hover:scale-105 border-2 border-transparent hover:border-green-500"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">📈</div>
              <h4 className="font-bold text-lg text-zus-darkblue dark:text-white mb-2">
                Ministerstwo Finansów
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Informacje o IKE, IKZE i dodatkowych oszczędnościach emerytalnych
              </p>
              <span className="text-xs text-green-600 dark:text-zus-gold font-semibold">
                Odwiedź →
              </span>
            </div>
          </a>

          {/* NBP */}
          <a
            href="https://www.nbportal.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="card bg-white dark:bg-gray-700 hover:shadow-lg transition-all hover:scale-105 border-2 border-transparent hover:border-yellow-500"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <h4 className="font-bold text-lg text-zus-darkblue dark:text-white mb-2">
                Portal Edukacji Finansowej NBP
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Edukacja ekonomiczna Narodowego Banku Polskiego
              </p>
              <span className="text-xs text-yellow-600 dark:text-zus-gold font-semibold">
                Odwiedź →
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* Thank you card */}
      <div className="card bg-gradient-to-r from-zus-green to-zus-blue text-white border-0 shadow-xl">
        <div className="text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold mb-3">
            Dziękujemy za skorzystanie z symulatora!
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Zaplanuj swoją przyszłość emerytalną już dziś
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onNewSimulation}
              className="bg-white text-zus-green px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              🔄 Nowa symulacja
            </button>
            <a
              href="https://www.zus.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/40 text-center"
            >
              🌐 Odwiedź ZUS.pl
            </a>
          </div>
        </div>
      </div>

      {/* UKRYTE KONTENERY DO SCREENSHOTÓW PDF */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        {/* Krok 1-2: Dane wejściowe */}
        <div
          id="pdf-step-1-2"
          style={{
            width: "800px",
            padding: "20px",
            backgroundColor: "#ffffff",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div className="card bg-gradient-to-br from-green-50 to-white border-2 border-green-200">
            <h2
              className="text-2xl font-bold text-gray-900 mb-4"
              style={{ letterSpacing: "0.5px", wordSpacing: "2px" }}
            >
              📝 Twoje dane
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Wiek:</span> {input.age} lat
              </div>
              <div>
                <span className="font-semibold">Płeć:</span>{" "}
                {input.sex === "male" ? "Mężczyzna" : "Kobieta"}
              </div>
              <div>
                <span className="font-semibold">Wynagrodzenie brutto:</span>{" "}
                {formatCurrency(input.grossSalary)}
              </div>
              <div>
                <span className="font-semibold">Okres pracy:</span>{" "}
                {input.workStartYear} - {input.workEndYear}
              </div>
              {input.zusAccount && (
                <div>
                  <span className="font-semibold">Konto ZUS:</span>{" "}
                  {formatCurrency(input.zusAccount)}
                </div>
              )}
              {input.zusSubAccount && (
                <div>
                  <span className="font-semibold">Subkonto ZUS:</span>{" "}
                  {formatCurrency(input.zusSubAccount)}
                </div>
              )}
              {input.desiredPension && (
                <div className="col-span-2">
                  <span className="font-semibold text-blue-600">
                    🎯 Cel emerytalny:
                  </span>{" "}
                  {formatCurrency(input.desiredPension)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Krok 3: Prognoza */}
        <div
          id="pdf-step-3"
          style={{
            width: "800px",
            padding: "20px",
            backgroundColor: "#ffffff",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h2
            className="text-2xl font-bold text-gray-900 mb-4"
            style={{ letterSpacing: "0.5px", wordSpacing: "2px" }}
          >
            📊 Twoja prognoza emerytalna
          </h2>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="card bg-gradient-to-br from-green-50 to-white border-2 border-green-500 text-center">
              <div className="text-sm text-gray-600 mb-2">
                💰 Emerytura nominalna
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(result.nominalPension)}
              </div>
              <div className="text-xs text-gray-500 mt-1">(bez inflacji)</div>
            </div>

            <div className="card bg-gradient-to-br from-blue-50 to-white border-2 border-blue-500 text-center">
              <div className="text-sm text-gray-600 mb-2">
                💎 Emerytura realna
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(result.realPension)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                (dzisiejsza wartość)
              </div>
            </div>

            <div className="card bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-500 text-center">
              <div className="text-sm text-gray-600 mb-2">
                📈 Stopa zastąpienia
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {formatPercent(result.replacementRate)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Twojego wynagrodzenia
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-white border-l-4 border-purple-500">
            <h3
              className="font-bold text-lg mb-4"
              style={{ letterSpacing: "0.5px", wordSpacing: "2px" }}
            >
              💰 Zainwestuj w swoją przyszłość
            </h3>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* PPK */}
              <div className="bg-white p-3 rounded-lg border-2 border-blue-300 shadow-sm">
                <div className="text-center mb-2">
                  <div className="text-2xl mb-1">🏢</div>
                  <div className="font-bold text-sm text-blue-700">PPK</div>
                  <div className="text-xs text-gray-500">
                    Pracownicze Plany Kapitałowe
                  </div>
                </div>
                <div className="text-xs space-y-1 text-gray-700">
                  <div className="flex justify-between border-b pb-1">
                    <span>Twoja wpłata:</span>
                    <span className="font-semibold">2%</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>Pracodawca:</span>
                    <span className="font-semibold">1.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Razem:</span>
                    <span className="font-bold text-blue-700">3.5%</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t text-center">
                  <div className="text-xs text-gray-500">
                    Szacunkowa wartość*
                  </div>
                  <div className="text-sm font-bold text-green-600">
                    {(() => {
                      const years = Math.max(
                        1,
                        RETIREMENT_AGE[input.sex] - input.age
                      );
                      const monthlyContribution = input.grossSalary * 0.035;
                      const annualRate = 0.05; // 5% rocznie
                      const monthlyRate = annualRate / 12;
                      const months = years * 12;
                      // Wzór na wartość przyszłą renty (FV annuity)
                      const futureValue =
                        monthlyContribution *
                        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
                      return formatCurrency(Math.round(futureValue));
                    })()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    przy 3.5% wynagrodzenia
                  </div>
                </div>
              </div>

              {/* IKE */}
              <div className="bg-white p-3 rounded-lg border-2 border-green-300 shadow-sm">
                <div className="text-center mb-2">
                  <div className="text-2xl mb-1">💼</div>
                  <div className="font-bold text-sm text-green-700">IKE</div>
                  <div className="text-xs text-gray-500">
                    Indywidualne Konto Emerytalne
                  </div>
                </div>
                <div className="text-xs space-y-1 text-gray-700">
                  <div className="flex justify-between border-b pb-1">
                    <span>Limit 2025:</span>
                    <span className="font-semibold">26 019 zł</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>Korzyść:</span>
                    <span className="font-semibold text-green-700">
                      0% podatku
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>od zysków</span>
                    <span className="font-bold text-green-700">✓</span>
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-600 italic px-1">
                  Po 60. roku życia wypłata bez 19% podatku
                </div>
                <div className="mt-2 pt-2 border-t text-center">
                  <div className="text-xs text-gray-500">
                    Szacunkowa wartość*
                  </div>
                  <div className="text-sm font-bold text-green-600">
                    {(() => {
                      const years = Math.max(
                        1,
                        RETIREMENT_AGE[input.sex] - input.age
                      );
                      const annualContribution = 26019;
                      const annualRate = 0.05; // 5% rocznie
                      // Wzór na wartość przyszłą renty rocznej
                      const futureValue =
                        annualContribution *
                        ((Math.pow(1 + annualRate, years) - 1) / annualRate);
                      return formatCurrency(Math.round(futureValue));
                    })()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    przy maks. wpłatach (26 019 zł/rok)
                  </div>
                </div>
              </div>

              {/* IKZE */}
              <div className="bg-white p-3 rounded-lg border-2 border-yellow-300 shadow-sm">
                <div className="text-center mb-2">
                  <div className="text-2xl mb-1">📈</div>
                  <div className="font-bold text-sm text-yellow-700">IKZE</div>
                  <div className="text-xs text-gray-500">
                    Indywidualne Konto Zabezpieczenia Emerytalnego
                  </div>
                </div>
                <div className="text-xs space-y-1 text-gray-700">
                  <div className="flex justify-between border-b pb-1">
                    <span>Limit 2025:</span>
                    <span className="font-semibold">10 408 zł</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 text-xs">
                    <span>(przedsiębiorca:</span>
                    <span className="font-semibold">15 611 zł)</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>Zwrot podatku:</span>
                    <span className="font-semibold text-yellow-700">
                      1 249 - 3 330 zł
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">(przedsiębiorca:</span>
                    <span className="text-gray-600">1 873 - 4 996 zł)</span>
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-600 italic px-1">
                  Zwrot 12-32% od wpłaty. Po 65 roku wypłata z 10% podatkiem
                </div>
                <div className="mt-2 pt-2 border-t text-center">
                  <div className="text-xs text-gray-500">
                    Szacunkowa wartość*
                  </div>
                  <div className="text-sm font-bold text-green-600">
                    {(() => {
                      const years = Math.max(
                        1,
                        RETIREMENT_AGE[input.sex] - input.age
                      );
                      const annualContribution = 10408;
                      const annualRate = 0.05; // 5% rocznie
                      // Wzór na wartość przyszłą renty rocznej
                      const futureValue =
                        annualContribution *
                        ((Math.pow(1 + annualRate, years) - 1) / annualRate);
                      return formatCurrency(Math.round(futureValue));
                    })()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    przy maks. wpłatach (10 408 zł/rok)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded p-2 text-xs text-gray-600">
              <strong>💡 Dlaczego warto?</strong> Systematyczne inwestowanie w
              dodatkowe instrumenty emerytalne może znacząco zwiększyć Twoją
              przyszłą emeryturę dzięki efektowi procentu składanego.
              <div className="mt-1 text-xs text-gray-500">
                * Szacunki używają wzoru na procent składany przy założeniu 5%
                rocznej stopy zwrotu. To konserwatywne założenie - historyczne
                średnie funduszy emerytalnych wynoszą 6-8% rocznie.
              </div>
            </div>
          </div>

          {/* Porównanie ze średnią krajową */}
          <div className="card bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-500 mt-6">
            <h3
              className="font-bold text-lg mb-4"
              style={{ letterSpacing: "0.5px", wordSpacing: "2px" }}
            >
              📊 Porównanie z średnią krajową
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">
                  Twoja emerytura
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(result.nominalPension)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">
                  Średnia krajowa
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(result.averagePension)}
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              {result.nominalPension > result.averagePension ? (
                <div className="text-green-600 font-semibold">
                  ✓ Twoja emerytura jest wyższa od średniej o{" "}
                  {formatCurrency(
                    result.nominalPension - result.averagePension
                  )}
                </div>
              ) : (
                <div className="text-orange-600 font-semibold">
                  Twoja emerytura jest niższa od średniej o{" "}
                  {formatCurrency(
                    result.averagePension - result.nominalPension
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Wpływ zwolnień lekarskich */}
          {result.sickLeaveImpact && (
            <div className="card bg-gradient-to-br from-red-50 to-white border-l-4 border-red-500 mt-6">
              <h3
                className="font-bold text-lg mb-4"
                style={{ letterSpacing: "0.5px", wordSpacing: "2px" }}
              >
                🏥 Wpływ zwolnień lekarskich
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Uwzględniliśmy średnią liczbę dni zwolnienia lekarskiego:{" "}
                <span className="font-semibold">
                  {input.sex === "male"
                    ? "12 dni/rok (mężczyźni)"
                    : "16 dni/rok (kobiety)"}
                </span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded border border-red-200">
                  <div className="text-xs text-gray-600 mb-1">
                    Strata w emeryturze:
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(result.sickLeaveImpact.difference)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">miesięcznie</div>
                </div>
                <div className="bg-white p-3 rounded border border-red-200">
                  <div className="text-xs text-gray-600 mb-1">
                    Procent zmniejszenia:
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(
                      (result.sickLeaveImpact.difference /
                        result.nominalPension) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    całkowitej emerytury
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-3">
                💡 Podczas zwolnienia lekarskiego składki emerytalne są niższe
                (80% podstawy), co wpływa na wysokość przyszłej emerytury.
              </p>
            </div>
          )}
        </div>

        {/* Krok 4: Cel emerytalny (tylko jeśli jest cel) */}
        {input.desiredPension &&
          (() => {
            const gapData = calculateGap(
              result.nominalPension,
              input.desiredPension
            );
            const retirementAge = RETIREMENT_AGE[input.sex];
            const yearsUntilRetirement = Math.max(0, retirementAge - input.age);
            const pathsData = suggestOptimalPaths(
              result.nominalPension,
              input.desiredPension,
              input.grossSalary,
              yearsUntilRetirement
            );
            const achievedPercentage = Math.min(
              (result.nominalPension / input.desiredPension) * 100,
              100
            );

            return (
              <div
                id="pdf-step-4"
                style={{
                  width: "800px",
                  padding: "20px",
                  backgroundColor: "#ffffff",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <h2
                  className="text-2xl font-bold text-gray-900 mb-4"
                  style={{ letterSpacing: "0.5px", wordSpacing: "2px" }}
                >
                  🎯 Twój cel emerytalny
                </h2>

                <div
                  className={`card ${
                    gapData.meetsGoal
                      ? "bg-green-50 border-2 border-green-500"
                      : "bg-orange-50 border-2 border-orange-500"
                  } mb-4`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Twoja prognoza</span>
                    <span className="text-lg font-bold">
                      {formatCurrency(result.nominalPension)}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
                    <div
                      className="bg-green-600 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ width: `${achievedPercentage}%` }}
                    >
                      {Math.round(achievedPercentage)}%
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Twój cel</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(input.desiredPension)}
                    </span>
                  </div>

                  {gapData.hasGap ? (
                    <div className="mt-2 p-2 bg-orange-100 rounded">
                      <span className="text-sm font-bold text-orange-700">
                        ⚠ Luka: {formatCurrency(gapData.gap)}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2 p-2 bg-green-100 rounded">
                      <span className="text-sm font-bold text-green-700">
                        ✓ Cel osiągnięty!
                      </span>
                    </div>
                  )}
                </div>

                {pathsData.needsSuggestions &&
                  pathsData.suggestions &&
                  pathsData.suggestions.length > 0 && (
                    <div className="card bg-blue-50">
                      <h3
                        className="font-bold text-lg mb-3"
                        style={{ letterSpacing: "0.5px", wordSpacing: "2px" }}
                      >
                        💡 Personalizowane sugestie
                      </h3>
                      <div className="space-y-3">
                        {pathsData.suggestions
                          .slice(0, 3)
                          .map((suggestion, index) => (
                            <div
                              key={suggestion.id}
                              className="bg-white p-3 rounded border border-blue-200"
                            >
                              <div className="font-bold text-sm mb-1">
                                {index + 1}. {suggestion.title}
                              </div>
                              <div className="text-xs text-gray-600">
                                {suggestion.description}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
              </div>
            );
          })()}

        {/* Krok 5: Porównanie scenariuszy */}
        {(() => {
          const workScenarios = calculateWorkLongerScenarios(
            result.nominalPension,
            input.grossSalary,
            0,
            input.desiredPension
          );
          const incomeScenarios = calculateExtraIncomeScenarios(
            result.nominalPension,
            input.grossSalary,
            input.desiredPension
          );

          return (
            <div
              id="pdf-step-5"
              style={{
                width: "800px",
                padding: "20px",
                backgroundColor: "#ffffff",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ letterSpacing: "0.5px", wordSpacing: "2px" }}
              >
                📊 Porównanie scenariuszy
              </h2>

              <div className="card bg-green-50 mb-4">
                <h3
                  className="font-bold text-lg mb-3"
                  style={{ letterSpacing: "0.5px", wordSpacing: "2px" }}
                >
                  ⏰ Dłuższa praca
                </h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2">Lata</th>
                      <th className="text-right py-2">Emerytura</th>
                      <th className="text-right py-2">Wzrost</th>
                      <th className="text-center py-2">Cel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workScenarios.slice(0, 3).map((scenario) => (
                      <tr
                        key={scenario.years}
                        className="border-b border-gray-200"
                      >
                        <td className="py-2">+{scenario.years}</td>
                        <td className="text-right font-semibold">
                          {formatCurrency(scenario.pension)}
                        </td>
                        <td className="text-right text-green-600">
                          +{scenario.percentageIncrease.toFixed(1)}%
                        </td>
                        <td className="text-center">
                          {scenario.meetsGoal ? "✓" : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="card bg-yellow-50 mb-4">
                <h3
                  className="font-bold text-lg mb-3"
                  style={{ letterSpacing: "0.5px", wordSpacing: "2px" }}
                >
                  💼 Dodatkowy dochód
                </h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2">Kwota/mies</th>
                      <th className="text-left py-2">Okres</th>
                      <th className="text-right py-2">Emerytura</th>
                      <th className="text-right py-2">Wzrost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomeScenarios.slice(0, 3).map((scenario, idx) => (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="py-2">+{scenario.extraMonthlyIncome}</td>
                        <td className="py-2">{scenario.durationYears} lat</td>
                        <td className="text-right font-semibold">
                          {formatCurrency(scenario.pension)}
                        </td>
                        <td className="text-right text-green-600">
                          +{scenario.percentageIncrease.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Kalkulator Nadgodzin */}
              {(() => {
                const retirementAge = RETIREMENT_AGE[input.sex];
                const yearsUntilRetirement = Math.max(0, retirementAge - input.age);
                const overtimeHours = 10;
                const overtimeRate = 1.5;
                const hourlyRate = input.grossSalary / 168;
                const overtimeIncome = hourlyRate * overtimeHours * overtimeRate;
                const monthsUntilRetirement = yearsUntilRetirement * 12;
                const monthlyRate = 0.05 / 12;
                const additionalContributions = overtimeIncome * 0.1952;
                const futureValue =
                  additionalContributions *
                  ((Math.pow(1 + monthlyRate, monthsUntilRetirement) - 1) /
                    monthlyRate);
                const additionalMonthlyPension = futureValue / (25 * 12);

                return (
                  <div className="card bg-gradient-to-br from-orange-50 to-white border-l-4 border-orange-500">
                    <h3
                      className="font-bold text-lg mb-3"
                      style={{ letterSpacing: "0.5px", wordSpacing: "2px" }}
                    >
                      ⏱️ Kalkulator Nadgodzin
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      Wpływ dodatkowych godzin pracy na przyszłą emeryturę
                    </p>

                    <div className="bg-white p-3 rounded border border-orange-200 mb-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-gray-600 text-xs mb-1">
                            Nadgodziny miesięcznie:
                          </div>
                          <div className="text-lg font-bold text-orange-600">
                            {overtimeHours} godz.
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-xs mb-1">
                            Stawka nadgodzin:
                          </div>
                          <div className="text-lg font-bold text-orange-600">
                            150%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-xs mb-1">
                            Dodatkowy dochód/mies:
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            {formatCurrency(Math.round(overtimeIncome))}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-xs mb-1">
                            Dodatkowa składka ZUS:
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            {formatCurrency(Math.round(additionalContributions))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded border-2 border-green-300">
                      <h4 className="font-bold text-gray-900 text-sm mb-2">
                        📊 Wpływ na emeryturę
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Okres do emerytury:</span>
                          <span className="font-bold">
                            {yearsUntilRetirement} lat
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">
                            Łączny dodatkowy dochód:
                          </span>
                          <span className="font-bold text-green-600">
                            {formatCurrency(
                              Math.round(overtimeIncome * monthsUntilRetirement)
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                          <span className="text-gray-700">
                            Dodatkowa emerytura miesięcznie:
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            +{formatCurrency(Math.round(additionalMonthlyPension))}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-2 rounded">
                      <strong>💡</strong> Kalkulacja zakłada 10 godz. nadgodzin/mies
                      przez cały okres do emerytury (150% stawki).
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
