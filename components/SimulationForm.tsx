'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { simulationFormSchema, calculateDefaultWorkEndYear, type SimulationFormData } from '@/lib/validationSchema';
import type { SimulationResult, SimulationInput } from '@/types';

interface SimulationFormProps {
  onSuccess?: (result: SimulationResult, input: SimulationInput) => void;
  desiredPension?: number;
  onDesiredPensionChange?: (amount: number | undefined) => void;
}

export default function SimulationForm({
  onSuccess,
  desiredPension,
  onDesiredPensionChange,
}: SimulationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<SimulationFormData>({
    resolver: zodResolver(simulationFormSchema),
    mode: "onChange",
    defaultValues: {
      includeSickLeave: false,
      desiredPension: desiredPension || undefined,
    },
  });

  // Obserwuj zmiany wieku i płci aby automatycznie ustawić rok zakończenia pracy
  const watchAge = watch("age");
  const watchSex = watch("sex");

  useEffect(() => {
    if (watchAge && watchSex) {
      const defaultEndYear = calculateDefaultWorkEndYear(watchAge, watchSex);
      setValue("workEndYear", defaultEndYear);
    }
  }, [watchAge, watchSex, setValue]);

  // Synchronizuj desiredPension z prop
  useEffect(() => {
    if (desiredPension !== undefined) {
      setValue("desiredPension", desiredPension);
    }
  }, [desiredPension, setValue]);

  // Funkcja wypełniająca formularz przykładowymi danymi
  const fillDemoData = () => {
    const currentYear = new Date().getFullYear();
    setValue("age", 35);
    setValue("sex", "male");
    setValue("grossSalary", 8000);
    setValue("workStartYear", 2010);
    setValue("workEndYear", currentYear + 30); // 30 lat do emerytury
    setValue("zusAccount", 50000);
    setValue("zusSubAccount", 15000);
    setValue("startCapital", 0);
    setValue("ofeAccount", 0);
    setValue("desiredPension", 5000);
    setValue("includeSickLeave", false);
    
    // Jeśli jest callback dla desiredPension, wywołaj go
    if (onDesiredPensionChange) {
      onDesiredPensionChange(5000);
    }
  };

  const onSubmit = async (data: SimulationFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Przygotuj dane do API (konwersja pustych stringów na undefined)
      const payload = {
        ...data,
        zusAccount: data.zusAccount === "" ? undefined : data.zusAccount,
        zusSubAccount:
          data.zusSubAccount === "" ? undefined : data.zusSubAccount,
        startCapital: data.startCapital === "" ? undefined : data.startCapital,
        ofeAccount: data.ofeAccount === "" ? undefined : data.ofeAccount,
        desiredPension:
          data.desiredPension === "" ? undefined : data.desiredPension,
      };

      const response = await fetch("/api/calculate-pension", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Błąd podczas obliczania emerytury");
      }

      if (onSuccess && result.result) {
        const inputForCallback: SimulationInput = {
          age: payload.age,
          sex: payload.sex,
          grossSalary: payload.grossSalary,
          workStartYear: payload.workStartYear,
          workEndYear: payload.workEndYear,
          zusAccount: payload.zusAccount,
          zusSubAccount: payload.zusSubAccount,
          startCapital: payload.startCapital,
          ofeAccount: payload.ofeAccount,
          includeSickLeave: payload.includeSickLeave,
          desiredPension: payload.desiredPension,
        };
        onSuccess(result.result, inputForCallback);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Demo button - dyskretny na górze */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={fillDemoData}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-zus-blue dark:hover:text-zus-gold underline transition-colors flex items-center gap-1"
          title="Wypełnij formularz przykładowymi danymi"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          Wypełnij danymi demo
        </button>
      </div>

      {error && (
        <div
          className="bg-zus-red/10 border border-zus-red text-zus-red px-4 py-3 rounded-lg"
          role="alert"
        >
          <strong className="font-bold">Błąd: </strong>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wiek */}
        <div>
          <label htmlFor="age" className="label">
            Wiek <span className="text-zus-red">*</span>
          </label>
          <input
            id="age"
            type="number"
            {...register("age", { valueAsNumber: true })}
            className={`input-field ${errors.age ? "border-zus-red" : ""}`}
            placeholder="np. 30"
            aria-required="true"
            aria-invalid={errors.age ? "true" : "false"}
            aria-describedby={errors.age ? "age-error" : undefined}
          />
          {errors.age && (
            <p
              id="age-error"
              className="text-zus-red text-sm mt-1"
              role="alert"
            >
              {errors.age.message}
            </p>
          )}
        </div>

        {/* Płeć */}
        <div>
          <label htmlFor="sex" className="label">
            Płeć <span className="text-zus-red">*</span>
          </label>
          <select
            id="sex"
            {...register("sex")}
            className={`input-field ${errors.sex ? "border-zus-red" : ""}`}
            aria-required="true"
            aria-invalid={errors.sex ? "true" : "false"}
            aria-describedby={errors.sex ? "sex-error" : undefined}
          >
            <option value="">Wybierz płeć</option>
            <option value="female">Kobieta</option>
            <option value="male">Mężczyzna</option>
          </select>
          {errors.sex && (
            <p
              id="sex-error"
              className="text-zus-red text-sm mt-1"
              role="alert"
            >
              {errors.sex.message}
            </p>
          )}
        </div>

        {/* Wynagrodzenie brutto */}
        <div>
          <label htmlFor="grossSalary" className="label">
            Wynagrodzenie brutto (PLN/mies.){" "}
            <span className="text-zus-red">*</span>
          </label>
          <input
            id="grossSalary"
            type="number"
            step="0.01"
            {...register("grossSalary", { valueAsNumber: true })}
            className={`input-field ${
              errors.grossSalary ? "border-zus-red" : ""
            }`}
            placeholder="np. 8000"
            aria-required="true"
            aria-invalid={errors.grossSalary ? "true" : "false"}
            aria-describedby={
              errors.grossSalary ? "grossSalary-error" : undefined
            }
          />
          {errors.grossSalary && (
            <p
              id="grossSalary-error"
              className="text-zus-red text-sm mt-1"
              role="alert"
            >
              {errors.grossSalary.message}
            </p>
          )}
          <p className="text-xs text-gray-600 mt-1">
            Minimalne wynagrodzenie: 4666 PLN
            <br />
            <span className="text-blue-600 font-medium">
              💡 Symulator zakłada 4% roczny wzrost wynagrodzeń
            </span>
          </p>
        </div>

        {/* Rok rozpoczęcia pracy */}
        <div>
          <label htmlFor="workStartYear" className="label">
            Rok rozpoczęcia pracy <span className="text-zus-red">*</span>
          </label>
          <input
            id="workStartYear"
            type="number"
            {...register("workStartYear", { valueAsNumber: true })}
            className={`input-field ${
              errors.workStartYear ? "border-zus-red" : ""
            }`}
            placeholder="np. 2015"
            aria-required="true"
            aria-invalid={errors.workStartYear ? "true" : "false"}
            aria-describedby={
              errors.workStartYear ? "workStartYear-error" : undefined
            }
          />
          {errors.workStartYear && (
            <p
              id="workStartYear-error"
              className="text-zus-red text-sm mt-1"
              role="alert"
            >
              {errors.workStartYear.message}
            </p>
          )}
        </div>

        {/* Rok zakończenia pracy */}
        <div>
          <label htmlFor="workEndYear" className="label">
            Planowany rok zakończenia pracy{" "}
            <span className="text-zus-red">*</span>
          </label>
          <input
            id="workEndYear"
            type="number"
            {...register("workEndYear", { valueAsNumber: true })}
            className={`input-field ${
              errors.workEndYear ? "border-zus-red" : ""
            }`}
            placeholder="Wypełni się automatycznie"
            aria-required="true"
            aria-invalid={errors.workEndYear ? "true" : "false"}
            aria-describedby={
              errors.workEndYear
                ? "workEndYear-error workEndYear-help"
                : "workEndYear-help"
            }
          />
          {errors.workEndYear && (
            <p
              id="workEndYear-error"
              className="text-zus-red text-sm mt-1"
              role="alert"
            >
              {errors.workEndYear.message}
            </p>
          )}
          <p id="workEndYear-help" className="text-xs text-gray-600 mt-1">
            Domyślnie: rok osiągnięcia wieku emerytalnego (60 lat dla kobiet, 65
            dla mężczyzn). Możesz podać inny rok - wiek emerytalny zostanie
            obliczony automatycznie.
          </p>
        </div>

        {/* Środki na koncie ZUS */}
        <div>
          <label htmlFor="zusAccount" className="label">
            Środki zgromadzone na koncie ZUS (PLN)
          </label>
          <input
            id="zusAccount"
            type="number"
            step="0.01"
            {...register("zusAccount", {
              setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
            })}
            className={`input-field ${
              errors.zusAccount ? "border-zus-red" : ""
            }`}
            placeholder="Opcjonalnie"
            aria-invalid={errors.zusAccount ? "true" : "false"}
            aria-describedby={
              errors.zusAccount
                ? "zusAccount-error zusAccount-help"
                : "zusAccount-help"
            }
          />
          {errors.zusAccount && (
            <p
              id="zusAccount-error"
              className="text-zus-red text-sm mt-1"
              role="alert"
            >
              {errors.zusAccount.message}
            </p>
          )}
        </div>

        {/* Środki na subkoncie ZUS */}
        <div>
          <label htmlFor="zusSubAccount" className="label">
            Środki zgromadzone na subkoncie ZUS (PLN)
          </label>
          <input
            id="zusSubAccount"
            type="number"
            step="0.01"
            {...register("zusSubAccount", {
              setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
            })}
            className={`input-field ${
              errors.zusSubAccount ? "border-zus-red" : ""
            }`}
            placeholder="Opcjonalnie"
            aria-invalid={errors.zusSubAccount ? "true" : "false"}
            aria-describedby={
              errors.zusSubAccount ? "zusSubAccount-error" : undefined
            }
          />
          {errors.zusSubAccount && (
            <p
              id="zusSubAccount-error"
              className="text-zus-red text-sm mt-1"
              role="alert"
            >
              {errors.zusSubAccount.message}
            </p>
          )}
        </div>

        {/* Kwota zwaloryzowanego kapitału początkowego */}
        <div>
          <label htmlFor="startCapital" className="label">
            Kwota zwaloryzowanego kapitału początkowego (PLN)
          </label>
          <input
            id="startCapital"
            type="number"
            step="0.01"
            {...register("startCapital", {
              setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
            })}
            className={`input-field ${
              errors.startCapital ? "border-zus-red" : ""
            }`}
            placeholder="Opcjonalnie"
            aria-invalid={errors.startCapital ? "true" : "false"}
            aria-describedby={
              errors.startCapital
                ? "startCapital-error startCapital-help"
                : "startCapital-help"
            }
          />
          {errors.startCapital && (
            <p
              id="startCapital-error"
              className="text-zus-red text-sm mt-1"
              role="alert"
            >
              {errors.startCapital.message}
            </p>
          )}
          <p id="startCapital-help" className="text-xs text-gray-600 mt-1">
            Kapitał początkowy z poprzednich systemów emerytalnych. Dotyczy osób
            pracujących przed 1999 rokiem.
          </p>
        </div>

        {/* Środki zgromadzone na rachunku OFE */}
        <div>
          <label htmlFor="ofeAccount" className="label">
            Środki zgromadzone na rachunku OFE (PLN)
          </label>
          <input
            id="ofeAccount"
            type="number"
            step="0.01"
            {...register("ofeAccount", {
              setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
            })}
            className={`input-field ${
              errors.ofeAccount ? "border-zus-red" : ""
            }`}
            placeholder="Opcjonalnie"
            aria-invalid={errors.ofeAccount ? "true" : "false"}
            aria-describedby={
              errors.ofeAccount
                ? "ofeAccount-error ofeAccount-help"
                : "ofeAccount-help"
            }
          />
          {errors.ofeAccount && (
            <p
              id="ofeAccount-error"
              className="text-zus-red text-sm mt-1"
              role="alert"
            >
              {errors.ofeAccount.message}
            </p>
          )}
          <p id="ofeAccount-help" className="text-xs text-gray-600 mt-1">
            Środki z Otwartych Funduszy Emerytalnych
          </p>
        </div>

        {/* Oczekiwana emerytura */}
        <div>
          <label htmlFor="desiredPension" className="label">
            Jaką emeryturę chciałbyś mieć? (PLN/mies.)
          </label>
          <input
            id="desiredPension"
            type="number"
            step="0.01"
            {...register("desiredPension", {
              setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
            })}
            onChange={(e) => {
              const value = e.target.value;
              const numValue = value === "" ? undefined : parseFloat(value);
              if (onDesiredPensionChange) {
                onDesiredPensionChange(numValue);
              }
            }}
            className={`input-field ${
              errors.desiredPension ? "border-zus-red" : ""
            }`}
            placeholder="np. 5000"
            aria-invalid={errors.desiredPension ? "true" : "false"}
            aria-describedby={
              errors.desiredPension
                ? "desiredPension-error desiredPension-help"
                : "desiredPension-help"
            }
          />
          {errors.desiredPension && (
            <p
              id="desiredPension-error"
              className="text-zus-red text-sm mt-1"
              role="alert"
            >
              {errors.desiredPension.message}
            </p>
          )}
          <p id="desiredPension-help" className="text-xs text-gray-600 mt-1">
            Obliczymy ile lat musisz pracować, aby to osiągnąć
          </p>
        </div>
      </div>

      {/* Checkbox - Zwolnienia lekarskie */}
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="includeSickLeave"
            type="checkbox"
            {...register("includeSickLeave")}
            className="w-4 h-4 text-zus-green border-gray-300 rounded focus:ring-zus-green focus:ring-2"
            aria-describedby="includeSickLeave-help"
          />
        </div>
        <div className="ml-3">
          <label
            htmlFor="includeSickLeave"
            className="font-medium text-gray-700"
          >
            Uwzględnij możliwość zwolnień lekarskich
          </label>
          <p id="includeSickLeave-help" className="text-xs text-gray-600 mt-1">
            Średnio: 12 dni/rok (mężczyźni), 16 dni/rok (kobiety). Zwolnienia
            zmniejszają składki emerytalne.
          </p>
        </div>
      </div>

      {/* Przycisk submit */}
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Prognozuj moją przyszłą emeryturę"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
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
              Obliczam...
            </span>
          ) : (
            "Prognozuj moją przyszłą emeryturę"
          )}
        </button>
      </div>

      <p className="text-center text-xs text-gray-500">
        <span className="text-zus-red">*</span> Pola wymagane
      </p>
    </form>
  );
}

