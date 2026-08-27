import { useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { ChevronDown, Check, CircleAlert as AlertCircle, Search } from 'lucide-react';

/* ---------- shared styles ---------- */

const fieldBase =
  'no-tap-highlight w-full rounded-xl border bg-white px-4 py-3 text-sm text-brand-800 placeholder:text-brand-300 transition-all duration-150 focus:outline-none';

const fieldStates = {
  default: 'border-brand-200 focus:border-brand-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-brand-500/25',
  error: 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-red-500/25',
  disabled: 'border-brand-100 bg-brand-50 text-brand-300 cursor-not-allowed placeholder:text-brand-200',
};

/* ---------- text input ---------- */

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorText?: string;
  leftIcon?: ReactNode;
}

export function Input({ label, helperText, error, errorText, leftIcon, disabled, className = '', ...rest }: InputProps) {
  const stateClasses = disabled ? fieldStates.disabled : error ? fieldStates.error : fieldStates.default;

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-brand-600">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400">
            {leftIcon}
          </span>
        )}
        <input
          disabled={disabled}
          className={`${fieldBase} ${stateClasses} ${leftIcon ? 'pl-11' : ''} ${className}`}
          {...rest}
        />
      </div>
      {error && errorText ? (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={12} />
          {errorText}
        </p>
      ) : helperText ? (
        <p className="text-xs text-brand-400">{helperText}</p>
      ) : null}
    </div>
  );
}

/* ---------- select ---------- */

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function Select({ label, options, value, onChange, disabled, placeholder = 'Select…' }: SelectProps) {
  const [open, setOpen] = useState(false);
  const stateClasses = disabled ? fieldStates.disabled : open ? 'border-brand-500 ring-2 ring-offset-2 ring-offset-white ring-brand-500/25' : fieldStates.default;
  const selected = options.find((o) => o.value === value);

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-brand-600">{label}</label>
      )}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((v) => !v)}
          className={`${fieldBase} ${stateClasses} flex items-center justify-between text-left`}
        >
          <span className={selected ? 'text-brand-800' : 'text-brand-300'}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            size={18}
            className={`shrink-0 text-brand-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && !disabled && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-brand-200 bg-white shadow-lg">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-brand-50 ${
                    opt.value === value ? 'text-brand-700 font-medium' : 'text-brand-600'
                  }`}
                >
                  {opt.label}
                  {opt.value === value && <Check size={16} className="text-brand-700" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- textarea ---------- */

interface TextareaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorText?: string;
  helperText?: string;
  maxLength?: number;
  rows?: number;
}

export function Textarea({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  error,
  errorText,
  helperText,
  maxLength,
  rows = 4,
}: TextareaProps) {
  const stateClasses = disabled ? fieldStates.disabled : error ? fieldStates.error : fieldStates.default;

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-brand-600">{label}</label>
      )}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          className={`${fieldBase} ${stateClasses} resize-none leading-relaxed`}
        />
        {maxLength && (
          <span className="absolute bottom-2.5 right-3 text-xs text-brand-300">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {error && errorText ? (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={12} />
          {errorText}
        </p>
      ) : helperText ? (
        <p className="text-xs text-brand-400">{helperText}</p>
      ) : null}
    </div>
  );
}

/* ---------- checkbox ---------- */

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({ label, checked, onChange, disabled }: CheckboxProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`no-tap-highlight flex w-full items-center gap-3 rounded-xl border bg-white px-4 py-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-brand-500/25 ${
        disabled
          ? 'border-brand-100 opacity-60 cursor-not-allowed'
          : checked
            ? 'border-brand-500 bg-brand-50'
            : 'border-brand-200 hover:border-brand-300'
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
          checked ? 'border-brand-700 bg-brand-700' : 'border-brand-300 bg-white'
        }`}
      >
        {checked && <Check size={12} strokeWidth={3} className="text-white" />}
      </span>
      <span className={`text-sm ${checked ? 'text-brand-800 font-medium' : 'text-brand-600'}`}>{label}</span>
    </button>
  );
}

/* ---------- switch ---------- */

interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ label, checked, onChange, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`no-tap-highlight flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-brand-500/25 ${
        disabled
          ? 'border-brand-100 opacity-60 cursor-not-allowed'
          : 'border-brand-200 hover:border-brand-300'
      }`}
    >
      <span className="text-sm text-brand-700">{label}</span>
      <span
        className={`relative flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
          checked ? 'bg-brand-700' : 'bg-brand-200'
        }`}
      >
        <span
          className={`absolute h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
          }`}
        />
      </span>
    </button>
  );
}

/* ---------- search input ---------- */

export function SearchInput({
  placeholder = 'Search…',
  disabled,
  className = '',
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { disabled?: boolean }) {
  const stateClasses = disabled ? fieldStates.disabled : fieldStates.default;
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400">
        <Search size={18} />
      </span>
      <input
        disabled={disabled}
        placeholder={placeholder}
        className={`${fieldBase} ${stateClasses} pl-11 ${className}`}
        {...rest}
      />
    </div>
  );
}
