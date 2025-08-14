import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface FormTextareaProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  rows?: number;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  rows = 4
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id} 
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      
      <Textarea
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`min-h-[96px] px-4 py-3 text-base bg-input border-border/60 rounded-xl transition-[var(--transition-smooth)] focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none ${error ? 'border-destructive focus:border-destructive' : ''}`}
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