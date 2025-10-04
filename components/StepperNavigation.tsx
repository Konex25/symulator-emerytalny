'use client';

import React from "react";

export interface Step {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  optional?: boolean;
}

interface StepperNavigationProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
  canNavigate?: boolean;
}

export default function StepperNavigation({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  canNavigate = true,
}: StepperNavigationProps) {
  const getStepStatus = (stepId: number) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    if (stepId < currentStep) return 'available';
    return 'locked';
  };

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        {/* Desktop stepper */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const isClickable =
              canNavigate &&
              (status === "completed" ||
                status === "current" ||
                status === "available");

            return (
              <React.Fragment key={step.id}>
                {/* Step circle */}
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={`group relative flex flex-col items-center ${
                    isClickable ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                >
                  {/* Circle */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                      status === "completed"
                        ? "bg-zus-green text-white shadow-lg"
                        : status === "current"
                        ? "bg-zus-blue text-white shadow-lg ring-4 ring-blue-200 dark:ring-blue-800"
                        : status === "available"
                        ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-400 dark:hover:bg-gray-600"
                        : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600"
                    }`}
                  >
                    {status === "completed" ? "✓" : step.icon}
                  </div>

                  {/* Label */}
                  <div className="mt-2 text-center">
                    <div
                      className={`text-xs font-medium ${
                        status === "current"
                          ? "text-zus-blue dark:text-zus-gold"
                          : status === "completed"
                          ? "text-zus-green"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {step.shortTitle}
                    </div>
                    {step.optional && (
                      <div className="text-[10px] text-gray-400">
                        (opcjonalnie)
                      </div>
                    )}
                  </div>

                  {/* Tooltip on hover */}
                  {isClickable && (
                    <div className="absolute bottom-full mb-2 hidden group-hover:block">
                      <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        {step.description}
                      </div>
                    </div>
                  )}
                </button>

                {/* Connector line - between steps */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-4">
                    <div
                      className={`h-full rounded transition-colors ${
                        completedSteps.includes(step.id)
                          ? "bg-zus-green"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile stepper */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Krok {currentStep} z {steps.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {Math.round((currentStep / steps.length) * 100)}% ukończone
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-zus-green to-zus-blue transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>

          {/* Current step info */}
          <div className="mt-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-zus-blue text-white rounded-full flex items-center justify-center text-lg">
              {steps.find((s) => s.id === currentStep)?.icon}
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {steps.find((s) => s.id === currentStep)?.title}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {steps.find((s) => s.id === currentStep)?.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
