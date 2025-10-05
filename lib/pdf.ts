/**
 * Funkcje do generowania raportów PDF - z użyciem html2canvas
 */

import jsPDF from 'jspdf';
import html2canvas from "html2canvas";
import type { SimulationInput, SimulationResult } from '@/types';
import { formatDate } from "@/utils/formatters";

/**
 * Generuje raport PDF z rzeczywistych screenshotów komponentów
 */
export async function generatePDF(
  input: SimulationInput,
  result: SimulationResult,
  postalCode?: string
): Promise<void> {
  // Zapamietaj obecny motyw i wymuś tryb jasny podczas generowania PDF
  const htmlElement = document.documentElement;
  const isDarkMode = htmlElement.classList.contains("dark");

  if (isDarkMode) {
    htmlElement.classList.remove("dark");
  }

  try {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    let currentPage = 1;

    // Helper do dodawania stopki
    const addFooter = (pageNum: number) => {
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Raport wygenerowany przez Symulator Emerytalny ZUS | www.zus.pl | Strona ${pageNum}`,
        pageWidth / 2,
        pageHeight - 5,
        { align: "center" }
      );
    };

    // Nagłówek na pierwszej stronie
    doc.setFillColor(0, 153, 63);
    doc.rect(0, 0, pageWidth, 35, "F");
    doc.setTextColor(255, 255, 255);

    // Tytuł wyśrodkowany
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("RAPORT EMERYTALNY ZUS", pageWidth / 2, 17, { align: "center" });

    // Data pod tytułem
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(formatDate(new Date()), pageWidth / 2, 27, {
      align: "justify",
    });

    let yPosition = 45;

    // Helper do renderowania elementu jako obrazu
    const captureAndAddToPDF = async (elementId: string) => {
      const element = document.getElementById(elementId);
      if (!element) {
        console.warn(`Element ${elementId} not found`);
        return;
      }

      try {
        // Capture element as canvas
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const imgWidth = pageWidth - 2 * margin;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Sprawdź czy obraz zmieści się na stronie
        if (yPosition + imgHeight > pageHeight - 15) {
          addFooter(currentPage);
          doc.addPage();
          currentPage++;
          yPosition = 15;
        }

        // Dodaj obraz
        doc.addImage(imgData, "PNG", margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      } catch (error) {
        console.error(`Error capturing ${elementId}:`, error);
      }
    };

    // Capture wszystkich sekcji - 1:1 odzwierciedlenie kroków symulatora
    await captureAndAddToPDF("pdf-step-1"); // Dane wejściowe
    await captureAndAddToPDF("pdf-step-2"); // Wykres prognozy wzrostu środków ZUS
    await captureAndAddToPDF("pdf-step-3"); // Kafelki, porównanie, sick leave, PPK/IKE/IKZE

    if (input.desiredPension) {
      await captureAndAddToPDF("pdf-step-4"); // Cel emerytalny + personalizowane ścieżki
    }

    await captureAndAddToPDF("pdf-step-5"); // Podsumowanie - 3 kafelki

    // Dodaj informację o kodzie pocztowym jeśli jest
    if (postalCode) {
      if (yPosition + 20 > pageHeight - 15) {
        addFooter(currentPage);
        doc.addPage();
        currentPage++;
        yPosition = 15;
      }

      doc.setFillColor(240, 245, 250);
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 15, 2, 2, "F");
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text(`Kod pocztowy: ${postalCode}`, margin + 5, yPosition + 10);
      yPosition += 20;
    }

    // Ostatnia stopka
    addFooter(currentPage);

    // Zapisz PDF
    const fileName = `raport-emerytalny-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);
  } finally {
    // Przywróć oryginalny motyw
    if (isDarkMode) {
      htmlElement.classList.add("dark");
    }
  }
}

/**
 * Generuje unikalny identyfikator sesji dla symulacji
 */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Zapisuje lub aktualizuje dane symulacji w localStorage dla analytics
 * @param sessionId - opcjonalny ID sesji; jeśli podany, zaktualizuje istniejący log zamiast dodawać nowy
 */
export function saveSimulationToLocalStorage(
  input: SimulationInput,
  result: SimulationResult,
  postalCode?: string,
  sessionId?: string
): string {
  const existingData = localStorage.getItem("simulation_logs");
  const logs = existingData ? JSON.parse(existingData) : [];

  const logData = {
    date: new Date().toISOString().split("T")[0],
    time: new Date().toISOString().split("T")[1].split(".")[0],
    expectedPension: input.desiredPension || null,
    age: input.age,
    sex: input.sex,
    salary: input.grossSalary,
    sickLeaveIncluded: input.includeSickLeave,
    zusAccount: input.zusAccount || null,
    zusSubAccount: input.zusSubAccount || null,
    nominalPension: result.nominalPension,
    realPension: result.realPension,
    postalCode: postalCode || null,
  };

  // Jeśli podano sessionId, znajdź i zaktualizuj istniejący log
  if (sessionId) {
    const existingIndex = logs.findIndex(
      (log: any) => log.sessionId === sessionId
    );
    if (existingIndex !== -1) {
      // Zaktualizuj istniejący log (zachowaj oryginalne date/time)
      logs[existingIndex] = {
        ...logs[existingIndex],
        ...logData,
        sessionId, // Zachowaj sessionId
      };
      localStorage.setItem("simulation_logs", JSON.stringify(logs));
      return sessionId;
    }
  }

  // Jeśli nie ma sessionId lub nie znaleziono loga, dodaj nowy
  const newSessionId = sessionId || generateSessionId();
  const newLog = {
    ...logData,
    sessionId: newSessionId,
  };

  logs.push(newLog);
  localStorage.setItem("simulation_logs", JSON.stringify(logs));
  return newSessionId;
}