import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function Section({ title, subtitle, children }: SectionProps) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-base font-semibold text-brand-800">{title}</h2>
        {subtitle && <p className="text-xs text-brand-400">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

interface StateRowProps {
  label: string;
  children: ReactNode;
}

export function StateRow({ label, children }: StateRowProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-xs font-medium text-brand-400">{label}</span>
      <div className="flex flex-1 items-center gap-3">{children}</div>
    </div>
  );
}
