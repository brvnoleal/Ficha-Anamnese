import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FormCheckboxProps {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  id,
  name,
  label,
  checked,
  onChange,
  required = false,
  disabled = false,
  error,
  className = ""
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start space-x-3">
        <Checkbox
          id={id}
          name={name}
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
          required={required}
          className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <Label 
          htmlFor={id}
          className="text-sm leading-relaxed cursor-pointer flex-1"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      </div>
      
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive ml-6" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};