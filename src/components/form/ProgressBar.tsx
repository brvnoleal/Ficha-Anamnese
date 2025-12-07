import React from 'react';
import { useTranslation } from 'react-i18next';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const { t } = useTranslation();
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>{t('progress.step', { current: currentStep, total: totalSteps })}</span>
      </div>
      
      <div className="medical-progress" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
        <div 
          className="medical-progress-bar"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};