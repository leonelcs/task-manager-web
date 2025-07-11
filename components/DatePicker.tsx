'use client';

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { formatForDateInput, parseFromDateInput, formatDateEuropean } from '@/lib/dateUtils';

interface DatePickerProps {
  /** Current date value (can be ISO string, Date object, or empty) */
  value?: string | Date | null;
  /** Called when date changes - receives ISO string or null */
  onChange: (isoDate: string | null) => void;
  /** HTML input name attribute */
  name?: string;
  /** HTML input id attribute */
  id?: string;
  /** Input label */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Show European format preview */
  showPreview?: boolean;
  /** Error message to display */
  error?: string;
}

export default function DatePicker({
  value,
  onChange,
  name,
  id,
  label,
  placeholder = 'Select date...',
  required = false,
  disabled = false,
  className = '',
  showPreview = true,
  error
}: DatePickerProps) {
  // Internal state for the HTML input (always in YYYY-MM-DD format)
  const [inputValue, setInputValue] = useState('');

  // Update internal state when external value changes
  useEffect(() => {
    if (value) {
      const dateObj = typeof value === 'string' ? new Date(value) : value;
      setInputValue(formatForDateInput(dateObj));
    } else {
      setInputValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);

    if (newInputValue) {
      // Convert HTML date input to ISO string for the parent component
      const dateObj = parseFromDateInput(newInputValue);
      onChange(dateObj ? dateObj.toISOString() : null);
    } else {
      onChange(null);
    }
  };

  // Format preview in European format
  const europeanPreview = inputValue ? (() => {
    const dateObj = parseFromDateInput(inputValue);
    return dateObj ? formatDateEuropean(dateObj) : '';
  })() : '';

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="date"
          id={id}
          name={name}
          value={inputValue}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          className={`
            w-full border rounded-md px-3 py-2 pr-10
            focus:outline-none focus:ring-2 focus:ring-adhd-primary-500
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${disabled ? 'bg-gray-50 text-gray-500' : 'bg-white'}
          `}
          placeholder={placeholder}
        />
        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      {/* European format preview */}
      {showPreview && europeanPreview && (
        <p className="text-xs text-gray-500">
          European format: <span className="font-medium">{europeanPreview}</span>
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      {/* Helper text */}
      {!error && !showPreview && (
        <p className="text-xs text-gray-500">
          Date will be formatted as dd-MM-yyyy for display
        </p>
      )}
    </div>
  );
}
