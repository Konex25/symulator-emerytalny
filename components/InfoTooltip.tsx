'use client';

import { useState, useRef, useEffect } from 'react';

interface InfoTooltipProps {
  title: string;
  description: string;
  link?: {
    url: string;
    text: string;
  };
}

export default function InfoTooltip({ title, description, link }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLButtonElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVisible && iconRef.current) {
      const iconRect = iconRef.current.getBoundingClientRect();
      const spaceAbove = iconRect.top;
      const spaceBelow = window.innerHeight - iconRect.bottom;
      
      // Jeśli mało miejsca u góry, pokaż tooltip na dole
      setPosition(spaceAbove < 300 && spaceBelow > 200 ? 'bottom' : 'top');
    }

    // Cleanup timeout on unmount
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [isVisible]);

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  return (
    <div className="relative inline-block ml-2">
      <button
        ref={iconRef}
        type="button"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zus-blue/10 dark:bg-zus-gold/10 text-zus-blue dark:text-zus-gold hover:bg-zus-blue/20 dark:hover:bg-zus-gold/20 transition-colors cursor-help"
        aria-label={`Informacja o: ${title}`}
      >
        <svg
          className="w-3 h-3"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isVisible && (
        <div
          ref={tooltipRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`absolute z-50 w-72 bg-white dark:bg-gray-800 border-2 border-zus-blue dark:border-zus-gold rounded-lg shadow-xl p-4 ${
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          } left-1/2 transform -translate-x-1/2`}
          role="tooltip"
        >
          {/* Strzałka */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-800 border-zus-blue dark:border-zus-gold rotate-45 ${
              position === 'top'
                ? 'bottom-[-7px] border-b-2 border-r-2'
                : 'top-[-7px] border-t-2 border-l-2'
            }`}
          />

          <div className="relative">
            <h4 className="font-bold text-sm text-zus-darkblue dark:text-white mb-2">
              {title}
            </h4>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              {description}
            </p>
            {link && (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zus-blue dark:text-zus-gold hover:underline font-semibold flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {link.text}
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
