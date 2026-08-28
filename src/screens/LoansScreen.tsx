import { useState, useMemo, type ReactNode } from 'react';
import { User, Mail, Phone, Calendar, Briefcase, Building2, DollarSign, GraduationCap, Chrome as HomeIcon, Car, ArrowRight, ArrowLeft, Check, Clock, ShieldCheck, FileText, Sparkles, Landmark } from 'lucide-react';
import { Button, RadioOptionButton, type RadioOption } from '@/components/buttons';
import { Input, Select, Textarea, Checkbox, type SelectOption } from '@/components/inputs';
import { Section, StateRow } from '@/components/Section';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatCurrencyPrecise } from '@/lib/format';

const STEPS = ['Loan Type', 'Loan Details', 'Personal Info', 'Employment', 'Review'] as const;
type StepIndex = 0 | 1 | 2 | 3 | 4;

const loanTypeOptions: RadioOption[] = [
  { value: 'personal', label: 'Personal Loan', description: 'Flexible funds for any need', icon: <User size={20} /> },
  { value: 'auto', label: 'Auto Loan', description: 'Finance a new or used vehicle', icon: <Car size={20} /> },
  { value: 'home', label: 'Home Loan', description: 'Buy or refinance a home', icon: <HomeIcon size={20} /> },
  { value: 'business', label: 'Business Loan', description: 'Grow your business', icon: <Building2 size={20} /> },
  { value: 'education', label: 'Education Loan', description: 'Fund your studies', icon: <GraduationCap size={20} /> },
];

const termOptions: SelectOption[] = [
  { value: '6', label: '6 months' },
  { value: '12', label: '12 months' },
  { value: '24', label: '24 months' },
  { value: '36', label: '36 months' },
  { value: '48', label: '48 months' },
  { value: '60', label: '60 months' },
  { value: '84', label: '84 months' },
  { value: '120', label: '120 months' },
  { value: '180', label: '180 months' },
  { value: '360', label: '360 months' },
];

const employmentOptions: RadioOption[] = [
  { value: 'employed', label: 'Employed', description: 'Working for an employer', icon: <Briefcase size={20} /> },
  { value: 'self-employed', label: 'Self-Employed', description: 'Running your own business', icon: <Building2 size={20} /> },
  { value: 'unemployed', label: 'Unemployed', description: 'Currently seeking work', icon: <User size={20} /> },
  { value: 'retired', label: 'Retired', description: 'No longer working', icon: <Clock size={20} /> },
];

interface FormState {
  loanType: string;
  loanAmount: string;
  loanTerm: string;
  loanPurpose: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  employmentStatus: string;
  monthlyIncome: string;
  employerName: string;
  consentCredit: boolean;
  consentTerms: boolean;
}

const initialState: FormState = {
  loanType: '',
  loanAmount: '',
  loanTerm: '',
  loanPurpose: '',
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  address: '',
  employmentStatus: '',
  monthlyIncome: '',
  employerName: '',
  consentCredit: false,
  consentTerms: false,
};

const APR_BY_TYPE: Record<string, number> = {
  personal: 0.1199,
  auto: 0.0649,
  home: 0.0499,
  business: 0.0899,
  education: 0.0599,
};

function LoanHeader({ step }: { step: StepIndex }) {
  return (
    <div className="-mx-6 -mt-6 bg-brand-700 px-6 pb-5 pt-4">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
          <Landmark size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">Apply for a Loan</h1>
          <p className="text-xs text-white/60">
            Step {step + 1} of {STEPS.length} — {STEPS[step]}
          </p>
        </div>
      </div>
      <div className="mt-4 flex gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= step ? 'bg-white' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function LoanNavFooter({
  step,
  submitting,
  onBack,
  onNext,
  onSubmit,
}: {
  step: StepIndex;
  submitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="-mx-6 -mb-6 flex gap-3 bg-brand-50 px-6 pb-6 pt-2">
      {step > 0 && (
        <Button variant="outline" onClick={onBack} disabled={submitting}>
          <ArrowLeft size={16} />
          Back
        </Button>
      )}
      {step < 4 ? (
        <Button variant="primary" fullWidth={step === 0} onClick={onNext}>
          Continue
          <ArrowRight size={16} />
        </Button>
      ) : (
        <Button variant="primary" fullWidth onClick={onSubmit} disabled={submitting}>
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Submitting…
            </>
          ) : (
            <>
              <Check size={16} />
              Submit Application
            </>
          )}
        </Button>
      )}
    </div>
  );
}

export function LoansScreen() {
  const [step, setStep] = useState<StepIndex>(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  };

  const monthlyPayment = useMemo(() => {
    const principal = parseFloat(form.loanAmount);
    const term = parseInt(form.loanTerm);
    const apr = APR_BY_TYPE[form.loanType];
    if (!principal || !term || !apr) return null;
    const monthlyRate = apr / 12;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    return payment;
  }, [form.loanAmount, form.loanTerm, form.loanType]);

  const totalInterest = useMemo(() => {
    if (!monthlyPayment) return null;
    const principal = parseFloat(form.loanAmount);
    const term = parseInt(form.loanTerm);
    if (!principal || !term) return null;
    return monthlyPayment * term - principal;
  }, [monthlyPayment, form.loanAmount, form.loanTerm]);

  const validateStep = (currentStep: StepIndex): string | null => {
    switch (currentStep) {
      case 0:
        if (!form.loanType) return 'Please select a loan type to continue';
        return null;
      case 1:
        if (!form.loanAmount || parseFloat(form.loanAmount) <= 0) return 'Please enter a loan amount';
        if (parseFloat(form.loanAmount) < 500) return 'Minimum loan amount is KES 500';
        if (parseFloat(form.loanAmount) > 5000000) return 'Maximum loan amount is KES 5,000,000';
        if (!form.loanTerm) return 'Please select a repayment term';
        if (form.loanPurpose.trim().length < 10) return 'Please describe your loan purpose (at least 10 characters)';
        return null;
      case 2:
        if (!form.fullName.trim()) return 'Please enter your full name';
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address';
        if (!form.phone.trim()) return 'Please enter your phone number';
        if (!form.dateOfBirth) return 'Please enter your date of birth';
        if (!form.address.trim()) return 'Please enter your home address';
        return null;
      case 3:
        if (!form.employmentStatus) return 'Please select your employment status';
        if (!form.monthlyIncome || parseFloat(form.monthlyIncome) <= 0) return 'Please enter your monthly income';
        if ((form.employmentStatus === 'employed' || form.employmentStatus === 'self-employed') && !form.employerName.trim())
          return 'Please enter your employer or business name';
        return null;
      case 4:
        if (!form.consentCredit) return 'Please consent to the credit check to continue';
        if (!form.consentTerms) return 'Please accept the terms and conditions to continue';
        return null;
      default:
        return null;
    }
  };

  const handleNext = () => {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    if (step < 4) setStep((step + 1) as StepIndex);
  };

  const handleBack = () => {
    setError('');
    if (step > 0) setStep((step - 1) as StepIndex);
  };

  const handleSubmit = async () => {
    const err = validateStep(4);
    if (err) {
      setError(err);
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const { data, error: insertError } = await supabase
        .from('loan_applications')
        .insert({
          full_name: form.fullName,
          email: form.email,
          phone: form.phone,
          date_of_birth: form.dateOfBirth,
          address: form.address,
          loan_type: form.loanType,
          loan_amount: parseFloat(form.loanAmount),
          loan_term_months: parseInt(form.loanTerm),
          loan_purpose: form.loanPurpose,
          employment_status: form.employmentStatus,
          monthly_income: parseFloat(form.monthlyIncome),
          employer_name: form.employerName || null,
          consent_credit_check: form.consentCredit,
          consent_terms: form.consentTerms,
        })
        .select('id')
        .single();

      if (insertError) throw new Error(insertError.message);

      setReferenceId(data.id);
      setSubmitted(true);
    } catch {
      setError('We could not submit your application. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(initialState);
    setStep(0);
    setSubmitted(false);
    setReferenceId('');
    setError('');
  };

  if (submitted) {
    return (
      <div className="animate-fade-in space-y-5">
        <div className="py-6 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500">
              <Check size={32} strokeWidth={3} className="text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-brand-800">Application Submitted!</h2>
          <p className="mt-2 text-sm text-brand-500">
            Your loan application has been received and is now under review. We'll contact you within 2-3 business days.
          </p>
        </div>

        <div className="rounded-2xl border border-brand-200 bg-white p-5 text-left">
          <div className="flex items-center justify-between border-b border-brand-100 pb-3">
            <span className="text-xs font-medium text-brand-400">Reference ID</span>
            <span className="font-mono text-xs font-semibold text-brand-700">
              {referenceId.slice(0, 8).toUpperCase()}
            </span>
          </div>
          <div className="space-y-2 pt-3">
            <StateRow label="Type">
              <span className="text-xs font-medium text-brand-600">
                {loanTypeOptions.find((o) => o.value === form.loanType)?.label || ''}
              </span>
            </StateRow>
            <StateRow label="Amount">
              <span className="text-xs font-medium text-brand-600">
                {formatCurrency(parseFloat(form.loanAmount))}
              </span>
            </StateRow>
            <StateRow label="Term">
              <span className="text-xs font-medium text-brand-600">
                {termOptions.find((o) => o.value === form.loanTerm)?.label || ''}
              </span>
            </StateRow>
            <StateRow label="Status">
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                Pending Review
              </span>
            </StateRow>
          </div>
        </div>

        <Button variant="primary" fullWidth onClick={handleReset}>
          <Sparkles size={16} />
          Apply for Another Loan
        </Button>
      </div>
    );
  }

  const stepContent: ReactNode = (
    <div className="animate-fade-in space-y-5">
      {step === 0 && (
        <Section title="What type of loan do you need?" subtitle="Choose the option that best fits your goals">
          <div className="space-y-3">
            {loanTypeOptions.map((opt) => (
              <RadioOptionButton
                key={opt.value}
                option={opt}
                selected={form.loanType === opt.value}
                onSelect={(v) => update('loanType', v)}
              />
            ))}
          </div>
        </Section>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <Section title="Loan details" subtitle="Tell us how much you need and what for">
            <div className="space-y-4">
              <Input
                label="Loan Amount (KES)"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 150000"
                value={form.loanAmount}
                onChange={(e) => update('loanAmount', e.target.value)}
                leftIcon={<DollarSign size={18} />}
                helperText="Min KES 500 — Max KES 5,000,000"
              />
              <Select
                label="Repayment Term"
                options={termOptions}
                value={form.loanTerm}
                onChange={(v) => update('loanTerm', v)}
                placeholder="Choose a term…"
              />
              <Textarea
                label="Purpose of Loan"
                value={form.loanPurpose}
                onChange={(v) => update('loanPurpose', v)}
                placeholder="Describe what the loan will be used for…"
                maxLength={300}
                helperText="Up to 300 characters"
                rows={3}
              />
            </div>
          </Section>

          {monthlyPayment && (
            <div className="rounded-2xl border border-brand-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-brand-500" />
                <span className="text-xs font-semibold text-brand-600">Estimated Repayment</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-brand-800">{formatCurrencyPrecise(monthlyPayment)}</p>
                  <p className="text-xs text-brand-400">per month</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-brand-600">
                    {(APR_BY_TYPE[form.loanType] * 100).toFixed(2)}%
                  </p>
                  <p className="text-xs text-brand-400">est. APR</p>
                </div>
              </div>
              {totalInterest !== null && (
                <div className="mt-3 border-t border-brand-100 pt-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-brand-400">Total Interest</span>
                    <span className="font-medium text-brand-600">{formatCurrencyPrecise(totalInterest)}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs">
                    <span className="text-brand-400">Total Repayment</span>
                    <span className="font-medium text-brand-600">
                      {formatCurrencyPrecise(monthlyPayment * parseInt(form.loanTerm))}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <Section title="Personal information" subtitle="We need these to verify your identity">
          <div className="space-y-4">
            <Input label="Full Name" placeholder="Jane Doe" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} leftIcon={<User size={18} />} />
            <Input label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} leftIcon={<Mail size={18} />} />
            <Input label="Phone Number" type="tel" placeholder="(555) 123-4567" value={form.phone} onChange={(e) => update('phone', e.target.value)} leftIcon={<Phone size={18} />} />
            <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} leftIcon={<Calendar size={18} />} />
            <Textarea label="Home Address" value={form.address} onChange={(v) => update('address', v)} placeholder="Street, City, State, ZIP" rows={2} />
          </div>
        </Section>
      )}

      {step === 3 && (
        <Section title="Employment & income" subtitle="This helps us assess your repayment ability">
          <div className="space-y-4">
            <div className="space-y-3">
              {employmentOptions.map((opt) => (
                <RadioOptionButton key={opt.value} option={opt} selected={form.employmentStatus === opt.value} onSelect={(v) => update('employmentStatus', v)} />
              ))}
            </div>
            <Input label="Monthly Income (KES)" type="number" inputMode="numeric" placeholder="e.g. 45000" value={form.monthlyIncome} onChange={(e) => update('monthlyIncome', e.target.value)} leftIcon={<DollarSign size={18} />} helperText="Gross monthly income before taxes" />
            {(form.employmentStatus === 'employed' || form.employmentStatus === 'self-employed') && (
              <Input label={form.employmentStatus === 'self-employed' ? 'Business Name' : 'Employer Name'} placeholder={form.employmentStatus === 'self-employed' ? 'Your business name' : 'Company name'} value={form.employerName} onChange={(e) => update('employerName', e.target.value)} leftIcon={<Building2 size={18} />} />
            )}
          </div>
        </Section>
      )}

      {step === 4 && (
        <div className="space-y-5">
          <Section title="Loan Summary">
            <div className="rounded-2xl border border-brand-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <FileText size={16} className="text-brand-500" />
                <span className="text-xs font-semibold text-brand-600">Loan Details</span>
              </div>
              <div className="space-y-2">
                <StateRow label="Type"><span className="text-xs font-medium text-brand-600">{loanTypeOptions.find((o) => o.value === form.loanType)?.label || ''}</span></StateRow>
                <StateRow label="Amount"><span className="text-xs font-medium text-brand-600">{formatCurrency(parseFloat(form.loanAmount))}</span></StateRow>
                <StateRow label="Term"><span className="text-xs font-medium text-brand-600">{termOptions.find((o) => o.value === form.loanTerm)?.label || ''}</span></StateRow>
                {monthlyPayment && <StateRow label="Monthly"><span className="text-xs font-semibold text-brand-700">{formatCurrencyPrecise(monthlyPayment)}</span></StateRow>}
              </div>
            </div>
          </Section>

          <Section title="Personal Info">
            <div className="rounded-2xl border border-brand-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <User size={16} className="text-brand-500" />
                <span className="text-xs font-semibold text-brand-600">Applicant</span>
              </div>
              <div className="space-y-2">
                <StateRow label="Name"><span className="text-xs font-medium text-brand-600">{form.fullName}</span></StateRow>
                <StateRow label="Email"><span className="text-xs font-medium text-brand-600">{form.email}</span></StateRow>
                <StateRow label="Phone"><span className="text-xs font-medium text-brand-600">{form.phone}</span></StateRow>
                <StateRow label="DOB"><span className="text-xs font-medium text-brand-600">{form.dateOfBirth}</span></StateRow>
                <StateRow label="Address"><span className="text-xs font-medium text-brand-600">{form.address}</span></StateRow>
              </div>
            </div>
          </Section>

          <Section title="Employment">
            <div className="rounded-2xl border border-brand-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <Briefcase size={16} className="text-brand-500" />
                <span className="text-xs font-semibold text-brand-600">Income</span>
              </div>
              <div className="space-y-2">
                <StateRow label="Status"><span className="text-xs font-medium text-brand-600">{employmentOptions.find((o) => o.value === form.employmentStatus)?.label || ''}</span></StateRow>
                <StateRow label="Income"><span className="text-xs font-medium text-brand-600">{formatCurrency(parseFloat(form.monthlyIncome))}</span></StateRow>
                {form.employerName && <StateRow label="Employer"><span className="text-xs font-medium text-brand-600">{form.employerName}</span></StateRow>}
              </div>
            </div>
          </Section>

          <Section title="Consent">
            <div className="space-y-3">
              <Checkbox label="I consent to a credit check as part of this application" checked={form.consentCredit} onChange={(v) => update('consentCredit', v)} />
              <Checkbox label="I have read and agree to the terms and conditions" checked={form.consentTerms} onChange={(v) => update('consentTerms', v)} />
            </div>
            <div className="flex items-start gap-2 rounded-xl bg-brand-100 p-3">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand-500" />
              <p className="text-xs text-brand-500">Your information is encrypted and securely stored. Submitting this application does not guarantee approval.</p>
            </div>
          </Section>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <span className="text-xs font-medium text-red-600">{error}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-0">
      <LoanHeader step={step} />
      <div className="mt-5">{stepContent}</div>
      <div className="mt-5">
        <LoanNavFooter step={step} submitting={submitting} onBack={handleBack} onNext={handleNext} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
