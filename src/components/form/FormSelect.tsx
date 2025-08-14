import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';

interface FormSelectProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  error?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  placeholder = "Selecione...",
  required = false,
  disabled = false,
  icon: Icon,
  error
}) => {
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
      
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        name={name}
      >
        <SelectTrigger 
          id={id}
          className={`medical-input ${error ? 'border-destructive focus:border-destructive' : ''}`}
          aria-describedby={error ? `${id}-error` : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};