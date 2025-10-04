'use client';

import { ReactNode } from 'react';

interface StepContainerProps {
  stepNumber: number;
  title: string;
  description?: string;
  children: ReactNode;
  isActive: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
  canSkip?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  nextLabel?: string;
  showNavButtons?: boolean;
}

export default function StepContainer({
  stepNumber,
  title,
  description,
  children,
  isActive,
  onNext,
  onPrev,
  onSkip,
  canSkip = false,
  isFirstStep = false,
  isLastStep = false,
  nextLabel = 'Dalej',
  showNavButtons = true,
}: StepContainerProps) {
  if (!isActive) return null;

  return (
    <div className="min-h-[70vh] py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-zus-blue/10 dark:bg-zus-gold/10 px-4 py-1 rounded-full text-sm font-medium text-zus-blue dark:text-zus-gold mb-3">
            Krok {stepNumber}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-zus-darkblue dark:text-white mb-2">
            {title}
          </h2>
          {description && (
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {description}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="mb-8">{children}</div>

        {/* Navigation buttons */}
        {showNavButtons && (
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-6">
            <div>
              {!isFirstStep && onPrev && (
                <button
                  onClick={onPrev}
                  className="px-6 py-3 rounded-lg font-semibold transition-colors border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  ← Wstecz
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {canSkip && onSkip && (
                <button
                  onClick={onSkip}
                  className="px-6 py-3 rounded-lg font-semibold transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline"
                >
                  Pomiń ten krok
                </button>
              )}

              {onNext && (
                <button
                  onClick={onNext}
                  className="btn-primary px-8 py-3 text-lg"
                >
                  {isLastStep ? '✓ Zakończ' : `${nextLabel} →`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
