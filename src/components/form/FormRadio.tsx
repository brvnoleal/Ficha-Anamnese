import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FormRadioProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export const FormRadio: React.FC<FormRadioProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      
      <RadioGroup
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        className="grid grid-cols-1 gap-3"
        aria-describedby={error ? `${id}-error` : undefined}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-3">
            <RadioGroupItem 
              value={option.value} 
              id={`${id}-${option.value}`}
              className="text-primary"
            />
            <Label 
              htmlFor={`${id}-${option.value}`}
              className="text-sm font-normal cursor-pointer flex-1"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};