'use client';

import { useState } from 'react';

export default function APIDocsPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ error: 'Błąd połączenia z API' });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-zus-darkblue mb-6">
          Dokumentacja API - Symulator Emerytalny
        </h1>

        <div className="card mb-6">
          <h2 className="text-2xl font-bold text-zus-green mb-4">
            POST /api/calculate-pension
          </h2>
          <p className="text-gray-700 mb-4">
            Główny endpoint do kalkulacji emerytury.
          </p>

          <h3 className="font-bold text-lg mb-2">Wymagane pola:</h3>
          <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">
            <li><code className="bg-gray-100 px-2 py-1 rounded">age</code> - wiek (18-67)</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">sex</code> - płeć ('male' | 'female')</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">grossSalary</code> - wynagrodzenie brutto (min 3000)</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">workStartYear</code> - rok rozpoczęcia pracy (1960-2080)</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">workEndYear</code> - rok zakończenia pracy</li>
          </ul>

          <h3 className="font-bold text-lg mb-2">Opcjonalne pola:</h3>
          <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">
            <li><code className="bg-gray-100 px-2 py-1 rounded">zusAccount</code> - środki na koncie ZUS</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">zusSubAccount</code> - środki na subkoncie</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">includeSickLeave</code> - uwzględnij zwolnienia</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded">desiredPension</code> - oczekiwana emerytura</li>
          </ul>

          <h3 className="font-bold text-lg mb-2">Przykładowe zapytanie:</h3>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`fetch('/api/calculate-pension', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    age: 30,
    sex: 'male',
    grossSalary: 8000,
    workStartYear: 2015,
    workEndYear: 2055,
    includeSickLeave: true,
    desiredPension: 5000
  })
})`}
          </pre>
        </div>

        <div className="card mb-6">
          <h2 className="text-2xl font-bold text-zus-green mb-4">
            Zwracane dane
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>nominalPension</strong> - nominalna kwota emerytury</li>
            <li><strong>realPension</strong> - realna kwota (skorygowana o inflację)</li>
            <li><strong>replacementRate</strong> - stopa zastąpienia</li>
            <li><strong>averagePension</strong> - średnia emerytura w Polsce</li>
            <li><strong>retirementYear</strong> - rok przejścia na emeryturę</li>
            <li><strong>laterRetirementScenarios</strong> - scenariusze +1, +2, +5 lat</li>
            <li><strong>yearsNeededForGoal</strong> - lata do osiągnięcia celu</li>
            <li><strong>sickLeaveImpact</strong> - wpływ zwolnień (opcjonalnie)</li>
          </ul>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-zus-green mb-4">
            Test API
          </h2>
          <p className="text-gray-700 mb-4">
            Kliknij przycisk aby przetestować API z przykładowymi danymi.
          </p>
          <button
            onClick={runTest}
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Testowanie...' : 'Uruchom Test API'}
          </button>

          {testResult && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Wynik testu:</h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

