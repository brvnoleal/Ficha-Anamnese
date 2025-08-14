import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'tel' | 'email' | 'date';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  error?: string;
  mask?: (value: string) => string;
  inputMode?: 'text' | 'tel' | 'email' | 'numeric';
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  icon: Icon,
  error,
  mask,
  inputMode
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const maskedValue = mask ? mask(inputValue) : inputValue;
    onChange(maskedValue);
  };

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id} 
        className="text-sm font-medium text-foreground flex items-center gap-2"
      >
        {Icon && <Icon size={16} className="text-primary" />}
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        inputMode={inputMode}
        className={`medical-input ${error ? 'border-destructive focus:border-destructive' : ''}`}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};