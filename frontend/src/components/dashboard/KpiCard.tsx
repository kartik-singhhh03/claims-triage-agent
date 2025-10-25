import { useEffect, useState } from 'react';
import './KpiCard.css';

interface KpiCardProps {
  title: string;
  value: number | string;
  delta?: string;
  icon: string;
  colorTheme?: 'purple' | 'pink' | 'blue' | 'green';
  onClick?: () => void;
  isLoading?: boolean;
}

export default function KpiCard({
  title,
  value,
  delta,
  icon,
  colorTheme = 'purple',
  onClick,
  isLoading = false,
}: KpiCardProps) {
  const [displayValue, setDisplayValue] = useState<number | string>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (typeof value === 'number' && typeof displayValue === 'number') {
      setIsAnimating(true);
      let currentValue = typeof displayValue === 'number' ? displayValue : 0;
      const targetValue = value;
      const difference = targetValue - currentValue;
      const steps = 30;
      let stepCount = 0;

      const interval = setInterval(() => {
        stepCount++;
        currentValue = Math.floor(currentValue + difference / (steps - stepCount));
        setDisplayValue(currentValue);

        if (stepCount >= steps) {
          setDisplayValue(targetValue);
          setIsAnimating(false);
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  const themeClass = `theme-${colorTheme}`;

  return (
    <button
      className={`kpi-card glass-effect ${themeClass} ${isLoading ? 'loading' : ''}`}
      onClick={onClick}
      aria-label={`${title}: ${value}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="kpi-skeleton">
          <div className="skeleton-icon"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-value"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="kpi-icon">{icon}</div>
          <div className="kpi-content">
            <h3 className="kpi-title">{title}</h3>
            <div className={`kpi-value ${isAnimating ? 'animating' : ''}`}>
              {displayValue}
            </div>
            {delta && <div className="kpi-delta">{delta}</div>}
          </div>
        </>
      )}
    </button>
  );
}
