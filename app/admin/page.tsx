'use client';

import { useState, useEffect } from 'react';
import type { UsageLog } from '@/types';
import { formatCurrency } from '@/utils/formatters';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Sprawdź czy user jest już zalogowany (sessionStorage)
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadLogs();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadLogs();
    }
  }, [isAuthenticated]);

  const loadLogs = () => {
    try {
      const storedLogs = localStorage.getItem('simulation_logs');
      if (storedLogs) {
        const parsedLogs = JSON.parse(storedLogs);
        setLogs(parsedLogs);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error('Błąd wczytywania logów:', err);
      setLogs([]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === 'demo123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setError('');
      loadLogs();
    } else {
      setError('Nieprawidłowe hasło');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setPassword('');
  };

  const exportToCSV = () => {
    if (logs.length === 0) {
      alert('Brak danych do eksportu');
      return;
    }

    // Nagłówki CSV
    const headers = [
      'Data użycia',
      'Czas użycia',
      'Oczekiwana emerytura',
      'Wiek',
      'Płeć',
      'Wynagrodzenie',
      'Zwolnienie uwzględnione',
      'Środki na koncie',
      'Środki na subkoncie',
      'Emerytura nominalna',
      'Emerytura realna',
      'Kod pocztowy'
    ];

    // Dane CSV
    const rows = logs.map(log => [
      log.date,
      log.time,
      log.expectedPension?.toString() || '',
      log.age.toString(),
      log.sex === 'male' ? 'Mężczyzna' : 'Kobieta',
      log.salary.toString(),
      log.sickLeaveIncluded ? 'Tak' : 'Nie',
      log.zusAccount?.toString() || '',
      log.zusSubAccount?.toString() || '',
      log.nominalPension.toString(),
      log.realPension.toString(),
      log.postalCode || ''
    ]);

    // Stwórz CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Pobierz plik
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `symulator-zus-logs-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearLogs = () => {
    if (confirm('Czy na pewno chcesz usunąć wszystkie logi? Ta operacja jest nieodwracalna.')) {
      localStorage.removeItem('simulation_logs');
      setLogs([]);
      alert('Logi zostały usunięte');
    }
  };

  // Ekran logowania
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zus-green/10 to-zus-blue/10 flex items-center justify-center p-4">
        <div className="card max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-zus-darkblue mb-2">
              🔒 Panel Administratora
            </h1>
            <p className="text-gray-600">
              Symulator Emerytalny ZUS
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="label">
                Hasło dostępu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input-field ${error ? 'border-zus-red' : ''}`}
                placeholder="Wprowadź hasło"
                autoFocus
                required
              />
              {error && (
                <p className="text-zus-red text-sm mt-1" role="alert">
                  {error}
                </p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full">
              Zaloguj się
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              Demo: hasło to <code className="bg-gray-200 px-2 py-1 rounded">demo123</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Panel admina
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nagłówek */}
      <header className="bg-zus-green text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Panel Administratora
              </h1>
              <p className="text-sm opacity-90 mt-1">
                Zakład Ubezpieczeń Społecznych - Analytics
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Wyloguj
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Statystyki */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-zus-green/10 to-white">
            <div className="flex items-center gap-4">
              <div className="text-4xl">📊</div>
              <div>
                <p className="text-sm text-gray-600">Liczba symulacji</p>
                <p className="text-3xl font-bold text-zus-green">{logs.length}</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-zus-blue/10 to-white">
            <div className="flex items-center gap-4">
              <div className="text-4xl">💰</div>
              <div>
                <p className="text-sm text-gray-600">Średnia emerytura nominalna</p>
                <p className="text-2xl font-bold text-zus-blue">
                  {logs.length > 0
                    ? formatCurrency(logs.reduce((sum, log) => sum + log.nominalPension, 0) / logs.length)
                    : '0 PLN'}
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-zus-gold/10 to-white">
            <div className="flex items-center gap-4">
              <div className="text-4xl">👥</div>
              <div>
                <p className="text-sm text-gray-600">Średni wiek użytkowników</p>
                <p className="text-3xl font-bold text-zus-darkblue">
                  {logs.length > 0
                    ? Math.round(logs.reduce((sum, log) => sum + log.age, 0) / logs.length)
                    : 0}{' '}
                  lat
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Akcje */}
        <div className="card mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zus-darkblue">
                Logi użycia symulatora
              </h2>
              <p className="text-sm text-gray-600">
                Ostatnia aktualizacja: {new Date().toLocaleString('pl-PL')}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadLogs}
                className="btn-secondary"
                title="Odśwież dane"
              >
                🔄 Odśwież
              </button>
              <button
                onClick={exportToCSV}
                disabled={logs.length === 0}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📥 Export do CSV
              </button>
              <button
                onClick={clearLogs}
                disabled={logs.length === 0}
                className="bg-zus-red text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🗑️ Usuń logi
              </button>
            </div>
          </div>
        </div>

        {/* Tabela */}
        {logs.length > 0 ? (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zus-green/10 border-b-2 border-zus-green">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-zus-darkblue whitespace-nowrap">
                    Data
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-zus-darkblue whitespace-nowrap">
                    Czas
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-zus-darkblue whitespace-nowrap">
                    Wiek
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-zus-darkblue whitespace-nowrap">
                    Płeć
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-zus-darkblue whitespace-nowrap">
                    Wynagrodzenie
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-zus-darkblue whitespace-nowrap">
                    Zwolnienia
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-zus-darkblue whitespace-nowrap">
                    Em. nominalna
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-zus-darkblue whitespace-nowrap">
                    Em. realna
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-zus-darkblue whitespace-nowrap">
                    Kod pocztowy
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm">{log.date}</td>
                    <td className="px-4 py-3 text-sm">{log.time}</td>
                    <td className="px-4 py-3 text-sm text-right">{log.age}</td>
                    <td className="px-4 py-3 text-sm">
                      {log.sex === 'male' ? 'M' : 'K'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold">
                      {formatCurrency(log.salary)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {log.sickLeaveIncluded ? (
                        <span className="text-zus-green">✓</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-zus-green">
                      {formatCurrency(log.nominalPension)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-zus-blue">
                      {formatCurrency(log.realPension)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {log.postalCode || <span className="text-gray-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Brak danych
            </h3>
            <p className="text-gray-600">
              Żadne symulacje nie zostały jeszcze przeprowadzone.
            </p>
          </div>
        )}
      </div>

      {/* Stopka */}
      <footer className="bg-zus-darkblue text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-90">
            © 2025 ZUS - Panel Administratora (Demo)
          </p>
          <p className="text-xs opacity-75 mt-2">
            Dane przechowywane lokalnie w przeglądarce
          </p>
        </div>
      </footer>
    </div>
  );
}

