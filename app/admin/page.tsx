'use client';

import { useState, useEffect } from 'react';
import type { UsageLog } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import * as XLSX from "xlsx";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Sprawdź czy user jest już zalogowany (sessionStorage)
    const authStatus = sessionStorage.getItem("admin_authenticated");
    if (authStatus === "true") {
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
      const storedLogs = localStorage.getItem("simulation_logs");
      if (storedLogs) {
        const parsedLogs = JSON.parse(storedLogs);
        setLogs(parsedLogs);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error("Błąd wczytywania logów:", err);
      setLogs([]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === "demo123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      setError("");
      loadLogs();
    } else {
      setError("Nieprawidłowe hasło");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_authenticated");
    setPassword("");
  };

  const exportToXLSX = () => {
    if (logs.length === 0) {
      alert("Brak danych do eksportu");
      return;
    }

    // Przygotuj dane w formacie dla xlsx
    const worksheetData = logs.map((log) => ({
      "Data użycia": log.date,
      "Godzina użycia": log.time,
      "Emerytura oczekiwana": log.expectedPension || "",
      Wiek: log.age,
      Płeć: log.sex === "male" ? "Mężczyzna" : "Kobieta",
      "Wysokość wynagrodzenia": log.salary,
      "Czy uwzględniał okresy choroby": log.sickLeaveIncluded ? "Tak" : "Nie",
      "Wysokość zgromadzonych środków na koncie": log.zusAccount || "",
      "Wysokość zgromadzonych środków na subkoncie": log.zusSubAccount || "",
      "Emerytura nominalna (rzeczywista)": log.nominalPension,
      "Emerytura realna (urealniona)": log.realPension,
      "Kod pocztowy": log.postalCode || "",
    }));

    // Stwórz workbook i worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Symulacje");

    // Ustaw szerokości kolumn dla lepszej czytelności
    const colWidths = [
      { wch: 12 }, // Data użycia
      { wch: 10 }, // Godzina użycia
      { wch: 18 }, // Emerytura oczekiwana
      { wch: 6 }, // Wiek
      { wch: 12 }, // Płeć
      { wch: 22 }, // Wysokość wynagrodzenia
      { wch: 30 }, // Czy uwzględniał okresy choroby
      { wch: 35 }, // Wysokość zgromadzonych środków na koncie
      { wch: 40 }, // Wysokość zgromadzonych środków na subkoncie
      { wch: 30 }, // Emerytura nominalna
      { wch: 30 }, // Emerytura realna
      { wch: 15 }, // Kod pocztowy
    ];
    worksheet["!cols"] = colWidths;

    // Pobierz plik
    const fileName = `symulator-zus-logs-${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const clearLogs = () => {
    if (
      confirm(
        "Czy na pewno chcesz usunąć wszystkie logi? Ta operacja jest nieodwracalna."
      )
    ) {
      localStorage.removeItem("simulation_logs");
      setLogs([]);
      alert("Logi zostały usunięte");
    }
  };

  // Ekran logowania
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zus-green/10 to-zus-blue/10 flex items-center justify-center p-4">
        <div className="card max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💰</div>
            <h1 className="text-3xl font-bold text-zus-darkblue mb-2">
              Symulator Emerytalny
            </h1>
            <p className="text-gray-600">🔒 Panel Administratora</p>
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
                className={`input-field ${error ? "border-zus-red" : ""}`}
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
              Demo: hasło to{" "}
              <code className="bg-gray-200 px-2 py-1 rounded">demo123</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Panel admina
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Nagłówek sekcji z przyciskiem wyloguj */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zus-darkblue dark:text-white mb-2">
              🔒 Panel Administratora
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Zarządzanie logami i statystykami symulatora
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-zus-red hover:bg-zus-red/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
          >
            🚪 Wyloguj
          </button>
        </div>
        {/* Statystyki */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-zus-green/10 to-white dark:from-zus-green/20 dark:to-gray-800">
            <div className="flex items-center gap-4">
              <div className="text-4xl">📊</div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Liczba symulacji
                </p>
                <p className="text-3xl font-bold text-zus-green dark:text-zus-green">
                  {logs.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-zus-blue/10 to-white dark:from-zus-blue/20 dark:to-gray-800">
            <div className="flex items-center gap-4">
              <div className="text-4xl">💰</div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Średnia emerytura nominalna
                </p>
                <p className="text-2xl font-bold text-zus-blue dark:text-zus-blue">
                  {logs.length > 0
                    ? formatCurrency(
                        logs.reduce((sum, log) => sum + log.nominalPension, 0) /
                          logs.length
                      )
                    : "0 PLN"}
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-zus-gold/10 to-white dark:from-zus-gold/20 dark:to-gray-800">
            <div className="flex items-center gap-4">
              <div className="text-4xl">👥</div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Średni wiek użytkowników
                </p>
                <p className="text-3xl font-bold text-zus-darkblue dark:text-white">
                  {logs.length > 0
                    ? Math.round(
                        logs.reduce((sum, log) => sum + log.age, 0) /
                          logs.length
                      )
                    : 0}{" "}
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
              <h2 className="text-xl font-bold text-zus-darkblue dark:text-white">
                Logi użycia symulatora
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ostatnia aktualizacja: {new Date().toLocaleString("pl-PL")}
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
                onClick={exportToXLSX}
                disabled={logs.length === 0}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📥 Export do XLSX
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full relative">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-zus-green/10 dark:bg-zus-green/20 border-b-2 border-zus-green dark:border-zus-green">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-zus-darkblue dark:text-white whitespace-nowrap bg-zus-green/10 dark:bg-zus-green/20">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-zus-darkblue dark:text-white whitespace-nowrap bg-zus-green/10 dark:bg-zus-green/20">
                      Czas
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-zus-darkblue dark:text-white whitespace-nowrap bg-zus-green/10 dark:bg-zus-green/20">
                      Em. oczekiwana
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-zus-darkblue dark:text-white whitespace-nowrap bg-zus-green/10 dark:bg-zus-green/20">
                      Wiek
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-zus-darkblue dark:text-white whitespace-nowrap bg-zus-green/10 dark:bg-zus-green/20">
                      Płeć
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-zus-darkblue dark:text-white whitespace-nowrap bg-zus-green/10 dark:bg-zus-green/20">
                      Wynagrodzenie
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-zus-darkblue dark:text-white whitespace-nowrap bg-zus-green/10 dark:bg-zus-green/20">
                      Zwolnienia
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-zus-darkblue dark:text-white whitespace-nowrap bg-zus-green/10 dark:bg-zus-green/20">
                      ZUS konto
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-zus-darkblue dark:text-white whitespace-nowrap bg-zus-green/10 dark:bg-zus-green/20">
                      ZUS subkonto
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-zus-darkblue dark:text-white whitespace-nowrap bg-zus-green/10 dark:bg-zus-green/20">
                      Em. nominalna
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-zus-darkblue dark:text-white whitespace-nowrap bg-zus-green/10 dark:bg-zus-green/20">
                      Em. realna
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-zus-darkblue dark:text-white whitespace-nowrap bg-zus-green/10 dark:bg-zus-green/20">
                      Kod pocztowy
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm dark:text-gray-300">
                        {log.date}
                      </td>
                      <td className="px-4 py-3 text-sm dark:text-gray-300">
                        {log.time}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-purple-600 dark:text-purple-400">
                        {log.expectedPension ? (
                          formatCurrency(log.expectedPension)
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-right dark:text-gray-300">
                        {log.age}
                      </td>
                      <td className="px-4 py-3 text-sm dark:text-gray-300">
                        {log.sex === "male" ? "M" : "K"}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold dark:text-gray-300">
                        {formatCurrency(log.salary)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {log.sickLeaveIncluded ? (
                          <span className="text-zus-green">✓</span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-right dark:text-gray-300">
                        {log.zusAccount ? (
                          formatCurrency(log.zusAccount)
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-right dark:text-gray-300">
                        {log.zusSubAccount ? (
                          formatCurrency(log.zusSubAccount)
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-zus-green">
                        {formatCurrency(log.nominalPension)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-zus-blue">
                        {formatCurrency(log.realPension)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center dark:text-gray-300">
                        {log.postalCode || (
                          <span className="text-gray-400 dark:text-gray-600">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              Brak danych
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Żadne symulacje nie zostały jeszcze przeprowadzone.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

