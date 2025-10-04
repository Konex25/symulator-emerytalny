/**
 * Funkcje do generowania raportów PDF
 */

import jsPDF from 'jspdf';
import type { SimulationInput, SimulationResult } from '@/types';
import { formatCurrency, formatPercent, formatDate } from '@/utils/formatters';

/**
 * Generuje raport PDF z wynikami symulacji emerytalnej
 */
export function generatePDF(input: SimulationInput, result: SimulationResult, postalCode?: string): void {
  const doc = new jsPDF();
  
  let yPosition = 20;
  const lineHeight = 7;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  
  // Helper do dodawania tekstu
  const addText = (text: string, size: number = 12, style: 'normal' | 'bold' = 'normal') => {
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    doc.text(text, margin, yPosition);
    yPosition += lineHeight;
  };
  
  const addLine = () => {
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += lineHeight;
  };
  
  // Nagłówek
  doc.setFillColor(0, 153, 63); // ZUS green
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Raport Emerytalny ZUS', margin, 20);
  
  // Reset koloru
  doc.setTextColor(0, 0, 0);
  yPosition = 45;
  
  // Data wygenerowania
  addText(`Data wygenerowania: ${formatDate(new Date())}`, 10, 'normal');
  yPosition += 5;
  
  // Sekcja 1: Parametry wejściowe
  addText('PARAMETRY WEJŚCIOWE', 14, 'bold');
  addLine();
  
  addText(`Wiek: ${input.age} lat`);
  addText(`Płeć: ${input.sex === 'male' ? 'Mężczyzna' : 'Kobieta'}`);
  addText(`Wynagrodzenie brutto: ${formatCurrency(input.grossSalary)}`);
  addText(`Rok rozpoczęcia pracy: ${input.workStartYear}`);
  addText(`Rok zakończenia pracy: ${input.workEndYear}`);
  
  if (input.zusAccount) {
    addText(`Środki na koncie ZUS: ${formatCurrency(input.zusAccount)}`);
  }
  
  if (input.zusSubAccount) {
    addText(`Środki na subkoncie ZUS: ${formatCurrency(input.zusSubAccount)}`);
  }
  
  addText(`Zwolnienia lekarskie uwzględnione: ${input.includeSickLeave ? 'Tak' : 'Nie'}`);
  
  if (input.desiredPension) {
    addText(`Oczekiwana emerytura: ${formatCurrency(input.desiredPension)}`);
  }
  
  yPosition += 5;
  
  // Sekcja 2: Wyniki prognozy
  addText('WYNIKI PROGNOZY', 14, 'bold');
  addLine();
  
  addText(`Rok przejścia na emeryturę: ${result.retirementYear}`, 12, 'bold');
  yPosition += 2;
  
  addText(`Emerytura NOMINALNA: ${formatCurrency(result.nominalPension)}`, 12, 'bold');
  addText('  (Wartość w przyszłości)', 10);
  yPosition += 2;
  
  addText(`Emerytura REALNA: ${formatCurrency(result.realPension)}`, 12, 'bold');
  addText('  (Dzisiejsza siła nabywcza, skorygowana o inflację)', 10);
  yPosition += 2;
  
  addText(`Stopa zastąpienia: ${formatPercent(result.replacementRate)}`, 12, 'bold');
  addText('  (Stosunek emerytury do ostatniego wynagrodzenia)', 10);
  yPosition += 2;
  
  addText(`Średnia krajowa: ${formatCurrency(result.averagePension)}`);
  
  const difference = result.nominalPension - result.averagePension;
  if (difference > 0) {
    addText(`  Twoja emerytura jest wyższa o ${formatCurrency(difference)}`, 10);
  } else {
    addText(`  Twoja emerytura jest niższa o ${formatCurrency(Math.abs(difference))}`, 10);
  }
  
  yPosition += 5;
  
  // Sekcja 3: Scenariusze
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }
  
  addText('SCENARIUSZE PÓŹNIEJSZEGO PRZEJŚCIA NA EMERYTURĘ', 14, 'bold');
  addLine();
  
  addText(`+1 rok: ${formatCurrency(result.laterRetirementScenarios.plusOneYear)}`);
  addText(`+2 lata: ${formatCurrency(result.laterRetirementScenarios.plusTwoYears)}`);
  addText(`+5 lat: ${formatCurrency(result.laterRetirementScenarios.plusFiveYears)}`);
  yPosition += 5;
  
  // Sekcja 4: Analiza celu
  if (input.desiredPension) {
    addText('ANALIZA CELU', 14, 'bold');
    addLine();
    
    if (result.nominalPension >= input.desiredPension) {
      addText('✓ Osiągniesz swój cel emerytalny!', 12, 'bold');
      addText(`  Twoja emerytura przekroczy cel o ${formatCurrency(result.nominalPension - input.desiredPension)}`, 10);
    } else {
      addText('⚠ Cel nie zostanie osiągnięty przy obecnych parametrach', 12, 'bold');
      if (result.yearsNeededForGoal && result.yearsNeededForGoal > 0) {
        addText(`  Musisz pracować o ${result.yearsNeededForGoal} lat dłużej`, 10);
      }
    }
    yPosition += 5;
  }
  
  // Sekcja 5: Wpływ zwolnień lekarskich
  if (result.sickLeaveImpact) {
    addText('WPŁYW ZWOLNIEŃ LEKARSKICH', 14, 'bold');
    addLine();
    
    addText(`Strata w emeryturze: ${formatCurrency(result.sickLeaveImpact.difference)}/mies.`);
    const percentLoss = (result.sickLeaveImpact.difference / result.nominalPension) * 100;
    addText(`Procentowe zmniejszenie: ${percentLoss.toFixed(1)}%`);
    yPosition += 5;
  }
  
  // Kod pocztowy
  if (postalCode) {
    if (yPosition > 260) {
      doc.addPage();
      yPosition = 20;
    }
    addText('INFORMACJE DODATKOWE', 14, 'bold');
    addLine();
    addText(`Kod pocztowy: ${postalCode}`);
    yPosition += 5;
  }
  
  // Stopka
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Raport wygenerowany przez Symulator Emerytalny ZUS', margin, footerY);
  doc.text('www.zus.pl', margin, footerY + 5);
  
  // Zapisz PDF
  const fileName = `raport-emerytalny-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

/**
 * Zapisuje dane symulacji w localStorage dla analytics
 */
export function saveSimulationToLocalStorage(
  input: SimulationInput,
  result: SimulationResult,
  postalCode?: string
): void {
  const existingData = localStorage.getItem('simulation_logs');
  const logs = existingData ? JSON.parse(existingData) : [];
  
  const newLog = {
    date: new Date().toISOString().split('T')[0],
    time: new Date().toISOString().split('T')[1].split('.')[0],
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
  
  logs.push(newLog);
  localStorage.setItem('simulation_logs', JSON.stringify(logs));
}

