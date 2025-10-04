import { NextRequest, NextResponse } from 'next/server';
import { calculateFullSimulation } from '@/lib/calculations';
import type { SimulationInput, SimulationResult } from '@/types';
import { readFileSync } from "fs";
import { join } from "path";
import {
  parseGUSLifespanData,
  parseValorizationParams,
} from "@/lib/dataParsers";

// Cache for CSV data on server side
let cachedLifespanData: any = null;
let cachedValorizationData: any = null;

/**
 * Load CSV data on server side
 */
function loadCSVData() {
  if (cachedLifespanData && cachedValorizationData) {
    return {
      lifespanData: cachedLifespanData,
      valorizationData: cachedValorizationData,
    };
  }

  try {
    // Load GUS lifespan data from public directory
    const lifespanPath = join(
      process.cwd(),
      "public",
      "GUS_estimated_lifespan.csv"
    );
    const lifespanCSV = readFileSync(lifespanPath, "utf-8");
    cachedLifespanData = parseGUSLifespanData(lifespanCSV);

    // Load valorization parameters from public directory
    const valorizationPath = join(
      process.cwd(),
      "public",
      "ValorizationParams.csv"
    );
    const valorizationCSV = readFileSync(valorizationPath, "utf-8");
    cachedValorizationData = parseValorizationParams(valorizationCSV);

    return {
      lifespanData: cachedLifespanData,
      valorizationData: cachedValorizationData,
    };
  } catch (error) {
    console.error("Error loading CSV data:", error);
    throw new Error("Nie można załadować danych do obliczeń");
  }
}

/**
 * API Route do kalkulacji emerytury
 * POST /api/calculate-pension
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Walidacja podstawowa
    if (
      !body.age ||
      !body.sex ||
      !body.grossSalary ||
      !body.workStartYear ||
      !body.workEndYear
    ) {
      return NextResponse.json(
        {
          error:
            "Brakujące wymagane pola: age, sex, grossSalary, workStartYear, workEndYear",
        },
        { status: 400 }
      );
    }

    // Walidacja zakresu wartości
    if (body.age < 18 || body.age > 67) {
      return NextResponse.json(
        { error: "Wiek musi być w zakresie 18-67" },
        { status: 400 }
      );
    }

    if (body.grossSalary < 4666) {
      return NextResponse.json(
        { error: "Wynagrodzenie musi być co najmniej 4666 PLN" },
        { status: 400 }
      );
    }

    if (body.workStartYear < 1960 || body.workStartYear > 2100) {
      return NextResponse.json(
        { error: "Rok rozpoczęcia pracy musi być w zakresie 1960-2100" },
        { status: 400 }
      );
    }

    if (body.workEndYear < 1960 || body.workEndYear > 2100) {
      return NextResponse.json(
        { error: "Rok zakończenia pracy musi być w zakresie 1960-2100" },
        { status: 400 }
      );
    }

    if (body.workEndYear < body.workStartYear) {
      return NextResponse.json(
        {
          error:
            "Rok zakończenia pracy nie może być wcześniejszy niż rok rozpoczęcia",
        },
        { status: 400 }
      );
    }

    // Przygotuj dane wejściowe
    const input: SimulationInput = {
      age: parseInt(body.age),
      sex: body.sex === "male" || body.sex === "female" ? body.sex : "male",
      grossSalary: parseFloat(body.grossSalary),
      workStartYear: parseInt(body.workStartYear),
      workEndYear: parseInt(body.workEndYear),
      zusAccount: body.zusAccount ? parseFloat(body.zusAccount) : undefined,
      zusSubAccount: body.zusSubAccount
        ? parseFloat(body.zusSubAccount)
        : undefined,
      startCapital: body.startCapital
        ? parseFloat(body.startCapital)
        : undefined,
      ofeAccount: body.ofeAccount ? parseFloat(body.ofeAccount) : undefined,
      includeSickLeave: body.includeSickLeave === true,
      desiredPension: body.desiredPension
        ? parseFloat(body.desiredPension)
        : undefined,
    };

    // Load CSV data on server side
    const csvData = loadCSVData();

    // Wykonaj kalkulacje z danymi CSV
    const result: SimulationResult = calculateFullSimulation(input, csvData);

    // Zwróć wyniki
    return NextResponse.json({
      success: true,
      input,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Błąd podczas obliczania emerytury:", error);
    return NextResponse.json(
      {
        error: "Wystąpił błąd podczas obliczania emerytury",
        details: error instanceof Error ? error.message : "Nieznany błąd",
      },
      { status: 500 }
    );
  }
}

/**
 * GET method dla testów
 */
export async function GET() {
  return NextResponse.json({
    message: "API Calculator ZUS - użyj POST z danymi symulacji",
    requiredFields: [
      "age",
      "sex",
      "grossSalary",
      "workStartYear",
      "workEndYear",
    ],
    optionalFields: [
      "zusAccount",
      "zusSubAccount",
      "startCapital",
      "ofeAccount",
      "includeSickLeave",
      "desiredPension",
    ],
    example: {
      age: 30,
      sex: "male",
      grossSalary: 8000,
      workStartYear: 2015,
      workEndYear: 2055,
      includeSickLeave: true,
      desiredPension: 5000,
    },
  });
}

