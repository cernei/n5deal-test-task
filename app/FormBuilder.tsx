'use client';

import { FormEvent, useState } from 'react';

export type FormOption = string | { label: string; value: string };

export type FormField = {
  component: 'text' | 'select' | 'textarea' | 'number' | string;
  label: string;
  type?: string;
  placeholder?: string;
  validation?: {
    required?: boolean;
    min?: string | number;
    max?: string | number;
    pattern?: string;
  };
  options?: FormOption[];
};

export type FormConfiguration = {
  layout: string[][];
  config: Record<string, FormField>;
};

export type FormBuilderProps = {
  configuration: FormConfiguration;
  onSubmit?: (values: Record<string, string>) => void;
  action?: (formData: FormData) => void | Promise<void>;
  initialValues?: Record<string, string>;
  submitLabel?: string;
  className?: string;
};

function optionParts(option: FormOption) {
  if (!option) {
    return { label: '', value: '' };
  }
  return typeof option === 'string'
    ? { label: option, value: option }
    : option;
}

export default function FormBuilder({
  configuration,
  onSubmit,
  action,
  initialValues = {},
  submitLabel = 'Submit',
  className = '',
}: FormBuilderProps) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);

  function updateValue(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (action) return;
    event.preventDefault();
    onSubmit?.(values);
  }

  if (!configuration || !configuration.layout || !configuration.config) {
    return null;
  }

  return (
    <form action={action} onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {configuration.layout.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
          }}
        >
          {row.map((name) => {
            const field = configuration.config[name];
            if (!field) return null;
            const validation = field.validation;
            const inputType = field.type || (field.component === 'number' ? 'number' : 'text');

            return (
              <div key={name} className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {validation?.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.component === 'select' ? (
                  <select
                    name={name}
                    value={values[name] ?? ''}
                    required={validation?.required}
                    onChange={(event) => updateValue(name, event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {field.options?.filter(Boolean).map((option) => {
                      const parsed = optionParts(option);
                      return (
                        <option key={parsed.value} value={parsed.value}>
                          {parsed.label}
                        </option>
                      );
                    })}
                  </select>
                ) : field.component === 'textarea' ? (
                  <textarea
                    name={name}
                    value={values[name] ?? ''}
                    required={validation?.required}
                    placeholder={field.placeholder}
                    onChange={(event) => updateValue(name, event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    rows={3}
                  />
                ) : (
                  <input
                    type={inputType}
                    name={name}
                    value={values[name] ?? ''}
                    placeholder={field.placeholder}
                    required={validation?.required}
                    min={validation?.min !== undefined && inputType === 'number' ? Number(validation.min) : undefined}
                    max={validation?.max !== undefined && inputType === 'number' ? Number(validation.max) : undefined}
                    minLength={validation?.min !== undefined && inputType !== 'number' ? Number(validation.min) : undefined}
                    maxLength={validation?.max !== undefined && inputType !== 'number' ? Number(validation.max) : undefined}
                    pattern={validation?.pattern}
                    onChange={(event) => updateValue(name, event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
      <div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
