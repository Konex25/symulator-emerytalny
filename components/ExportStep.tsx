'use client';

import { useState } from 'react';
import { SimulationInput, SimulationResult } from '@/types';
import { validatePostalCode } from '@/utils/formatters';
import { generatePDF, saveSimulationToLocalStorage } from '@/lib/pdf';

interface ExportStepProps {
  input: SimulationInput;
  result: SimulationResult;
  onNewSimulation: () => void;
}

export default function ExportStep({ input, result, onNewSimulation }: ExportStepProps) {
  const [postalCode, setPostalCode] = useState('');
  const [postalCodeError, setPostalCodeError] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPostalCode(value);

    if (value && !validatePostalCode(value)) {
      setPostalCodeError('Format: XX-XXX (np. 00-950)');
    } else {
      setPostalCodeError('');
    }
  };

  const handleGeneratePDF = () => {
    setIsGeneratingPDF(true);

    try {
      saveSimulationToLocalStorage(input, result, postalCode || undefined);
      generatePDF(input, result, postalCode || undefined);

      setTimeout(() => {
        setIsGeneratingPDF(false);
        setPdfGenerated(true);
      }, 500);
    } catch (error) {
      console.error('Błąd generowania PDF:', error);
      setIsGeneratingPDF(false);
      alert('Wystąpił błąd podczas generowania raportu PDF');
    }
  };

  return (
    <div className="space-y-6">
      {/* Success message if PDF generated */}
      {pdfGenerated && (
        <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="text-5xl">✅</div>
            <div>
              <h3 className="text-2xl font-bold mb-1">Raport wygenerowany!</h3>
              <p className="opacity-90">
                Twój raport PDF został pobrany. Sprawdź folder &quot;Pobrane&quot;.
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
              Pobierz raport PDF
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Zapisz szczegółowy raport z wynikami symulacji
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
            className={`input-field max-w-xs ${postalCodeError ? 'border-zus-red' : ''}`}
            aria-invalid={postalCodeError ? 'true' : 'false'}
            aria-describedby={postalCodeError ? 'postal-code-error postal-code-help' : 'postal-code-help'}
          />
          {postalCodeError && (
            <p id="postal-code-error" className="text-zus-red text-sm mt-1" role="alert">
              {postalCodeError}
            </p>
          )}
          <p id="postal-code-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Format: XX-XXX (np. 00-950). Dane są anonimowe i służą do analiz regionalnych.
          </p>
        </div>

        {/* Download button */}
        <button
          onClick={handleGeneratePDF}
          disabled={isGeneratingPDF || (postalCode !== '' && !!postalCodeError)}
          className="btn-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
        >
          {isGeneratingPDF ? (
            <span className="flex items-center gap-2 justify-center">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generowanie...
            </span>
          ) : pdfGenerated ? (
            '✓ Raport pobrany'
          ) : (
            '📥 Pobierz raport PDF'
          )}
        </button>

        {/* Info */}
        <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            📋 <strong>Co zawiera raport?</strong> Wszystkie dane wejściowe, prognozy emerytury (nominalna, realna),
            stopa zastąpienia, scenariusze dłuższej pracy, personalizowane sugestie oraz porównanie z celem.
          </p>
        </div>
      </div>

      {/* Auto-save info */}
      <div className="card bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 border-l-4 border-blue-500">
        <div className="flex items-center gap-4">
          <div className="text-4xl">💾</div>
          <div>
            <h3 className="text-xl font-bold text-zus-darkblue dark:text-white mb-1">
              Dane zapisane automatycznie
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Twoja symulacja została zapisana lokalnie. Możesz wrócić do niej później w panelu administratora.
            </p>
          </div>
        </div>
      </div>

      {/* Thank you card */}
      <div className="card bg-gradient-to-r from-zus-green to-zus-blue text-white border-0 shadow-xl">
        <div className="text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold mb-3">Dziękujemy za skorzystanie z symulatora!</h3>
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

      {/* Quick stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-white dark:bg-gray-800 text-center">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Twoja emerytura</div>
          <div className="text-xl font-bold text-zus-green dark:text-zus-gold">
            {result.nominalPension.toLocaleString('pl-PL')} PLN
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800 text-center">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Stopa zastąpienia</div>
          <div className="text-xl font-bold text-zus-blue dark:text-zus-gold">
            {(result.replacementRate * 100).toFixed(0)}%
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800 text-center">
          <div className="text-3xl mb-2">📅</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rok emerytury</div>
          <div className="text-xl font-bold text-zus-darkblue dark:text-white">
            {result.retirementYear}
          </div>
        </div>
      </div>
    </div>
  );
}
