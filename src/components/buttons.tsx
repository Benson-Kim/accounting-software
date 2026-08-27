import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Check } from 'lucide-react';

/* ---------- shared types ---------- */

type Variant = 'primary' | 'secondary' | 'outline' | 'default';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  children: ReactNode;
}

/* ---------- variant styles ---------- */

const base =
  'no-tap-highlight inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2';

const sizes = {
  md: 'px-5 py-3 text-sm',
  icon: 'h-11 w-11',
};

const variants: Record<Variant, { normal: string; pressed: string; disabled: string }> = {
  primary: {
    normal: 'bg-brand-700 text-white shadow-btn hover:bg-brand-800',
    pressed: 'bg-brand-800 text-white shadow-btn-pressed',
    disabled: 'bg-brand-300 text-white/70 cursor-not-allowed shadow-none',
  },
  secondary: {
    normal: 'bg-brand-100 text-brand-700 shadow-btn hover:bg-brand-200',
    pressed: 'bg-brand-200 text-brand-800 shadow-btn-pressed',
    disabled: 'bg-brand-50 text-brand-300 cursor-not-allowed shadow-none',
  },
  outline: {
    normal: 'bg-transparent text-brand-700 border border-brand-300 hover:bg-brand-50 hover:border-brand-400',
    pressed: 'bg-brand-100 text-brand-800 border-brand-400 shadow-btn-pressed',
    disabled: 'bg-transparent text-brand-300 border-brand-200 cursor-not-allowed',
  },
  default: {
    normal: 'bg-white text-brand-700 border border-brand-200 shadow-btn hover:bg-brand-50',
    pressed: 'bg-brand-100 text-brand-800 border-brand-200 shadow-btn-pressed',
    disabled: 'bg-white text-brand-300 border-brand-100 cursor-not-allowed shadow-none',
  },
};

/* ---------- interactive button ---------- */

export function Button({ variant = 'default', fullWidth, children, disabled, className = '', ...rest }: ButtonProps) {
  const [pressed, setPressed] = useState(false);
  const v = variants[variant];

  const state = disabled ? 'disabled' : pressed ? 'pressed' : 'normal';
  const stateClasses = v[state];

  return (
    <button
      disabled={disabled}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className={`${base} ${sizes.md} ${stateClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ---------- icon button ---------- */

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function IconButton({ children, disabled, className = '', ...rest }: IconButtonProps) {
  const [pressed, setPressed] = useState(false);
  const state = disabled ? 'disabled' : pressed ? 'pressed' : 'normal';
  const stateClasses = variants.default[state];

  return (
    <button
      disabled={disabled}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className={`${base} ${sizes.icon} ${stateClasses} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ---------- radio option button ---------- */

export interface RadioOption {
  value: string;
  label: string;
  description: string;
  icon: ReactNode;
}

interface RadioOptionButtonProps {
  option: RadioOption;
  selected: boolean;
  disabled?: boolean;
  onSelect: (value: string) => void;
}

export function RadioOptionButton({ option, selected, disabled, onSelect }: RadioOptionButtonProps) {
  const [pressed, setPressed] = useState(false);

  const containerClasses = disabled
    ? 'bg-brand-50 border-brand-100 opacity-60 cursor-not-allowed'
    : selected
      ? pressed
        ? 'bg-brand-100 border-brand-500 shadow-btn-pressed'
        : 'bg-brand-50 border-brand-500 shadow-btn'
      : pressed
        ? 'bg-brand-50 border-brand-300 shadow-btn-pressed'
        : 'bg-white border-brand-200 shadow-btn hover:border-brand-300 hover:bg-brand-50';

  return (
    <button
      disabled={disabled}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onClick={() => !disabled && onSelect(option.value)}
      className={`no-tap-highlight flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 ${containerClasses}`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
          selected ? 'bg-brand-700 text-white' : 'bg-brand-100 text-brand-600'
        }`}
      >
        {option.icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className={`block text-sm font-semibold ${selected ? 'text-brand-800' : 'text-brand-700'}`}>
          {option.label}
        </span>
        <span className="block truncate text-xs text-brand-400">{option.description}</span>
      </span>

      <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
        {selected && (
          <span className="absolute inset-0 rounded-full bg-brand-400/40 blur-[6px]" />
        )}
        <span
          className={`relative flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-200 ${
            selected ? 'border-brand-700 bg-brand-700' : 'border-brand-300 bg-white'
          }`}
        >
          {selected && <Check size={14} strokeWidth={3} className="text-white" />}
        </span>
      </span>
    </button>
  );
}
