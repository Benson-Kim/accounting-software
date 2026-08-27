import { useState } from 'react';
import { User, Building2, Users, Car, Plus, Heart, ArrowRight, Check, Mail, Calendar } from 'lucide-react';
import { Button, IconButton, RadioOptionButton, type RadioOption } from '@/components/buttons';
import { Input, Select, Textarea, Checkbox, Switch, SearchInput, type SelectOption } from '@/components/inputs';
import { Section, StateRow } from '@/components/Section';

const accountOptions: RadioOption[] = [
  { value: 'individual', label: 'Individual', description: 'Personal account, just for you', icon: <User size={20} /> },
  { value: 'company', label: 'Company', description: 'Business or organization', icon: <Building2 size={20} /> },
  { value: 'group', label: 'Group', description: 'Team or shared account', icon: <Users size={20} /> },
  { value: 'vehicle', label: 'Vehicle', description: 'Car, truck, or fleet asset', icon: <Car size={20} /> },
];

const countryOptions: SelectOption[] = [
  { value: 'uk', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
];

const checkboxOptions = ['Email', 'SMS', 'In-app messages'];

function App() {
  const [selectedAccount, setSelectedAccount] = useState<string>('individual');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [bio, setBio] = useState<string>('Designer and developer based in London.');
  const [checkedBoxes, setCheckedBoxes] = useState<string[]>(['Email']);
  const [switches, setSwitches] = useState<{ email: boolean; push: boolean }>({ email: true, push: false });

  const toggleCheckbox = (opt: string) => {
    setCheckedBoxes((prev) => (prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]));
  };
  const toggleSwitch = (key: 'email' | 'push', value: boolean) =>
    setSwitches((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen bg-brand-100 py-10 px-4">
      <div className="mx-auto w-full max-w-[390px]">
        {/* phone frame */}
        <div className="rounded-[2.5rem] bg-brand-50 shadow-phone overflow-hidden">
          {/* status bar */}
          <div className="flex items-center justify-between bg-brand-700 px-7 py-3 text-xs font-medium text-white/90">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span className="h-2 w-3 rounded-sm bg-white/80" />
              <span className="h-2 w-4 rounded-sm bg-white/80" />
              <span className="h-2 w-5 rounded-sm bg-white/80" />
            </div>
          </div>

          {/* header */}
          <div className="bg-brand-700 px-6 pb-6 pt-4">
            <h1 className="text-xl font-semibold text-white">UI Components</h1>
            <p className="text-sm text-white/70">Interactive design system showcase</p>
          </div>

          {/* scrollable content */}
          <div className="space-y-8 bg-brand-50 px-6 py-6">
            {/* Radio option buttons - shown first */}
            <Section title="Option Buttons" subtitle="Used as radio selectors — tap to choose">
              <div className="space-y-3">
                {accountOptions.map((opt) => (
                  <RadioOptionButton
                    key={opt.value}
                    option={opt}
                    selected={selectedAccount === opt.value}
                    onSelect={setSelectedAccount}
                  />
                ))}
                {/* disabled example */}
                <RadioOptionButton
                  option={{ ...accountOptions[1], label: 'Company (locked)', description: 'Unavailable for this plan' }}
                  selected={false}
                  disabled
                  onSelect={() => {}}
                />
              </div>
              <p className="pt-1 text-xs text-brand-400">
                Selected: <span className="font-semibold text-brand-600">{selectedAccount}</span>
              </p>
            </Section>

            <Divider />

            {/* Icon button */}
            <Section title="Icon Button" subtitle="Compact, icon-only action">
              <StateRow label="Default">
                <IconButton aria-label="add">
                  <Plus size={20} />
                </IconButton>
              </StateRow>
              <StateRow label="Pressed">
                <IconButton aria-label="favorite">
                  <Heart size={20} />
                </IconButton>
              </StateRow>
              <StateRow label="Disabled">
                <IconButton aria-label="add" disabled>
                  <Plus size={20} />
                </IconButton>
              </StateRow>
            </Section>

            <Divider />

            {/* Default button */}
            <Section title="Default Button" subtitle="Standard text button">
              <StateRow label="Default">
                <Button variant="default">Continue</Button>
              </StateRow>
              <StateRow label="Pressed">
                <Button variant="default">Continue</Button>
              </StateRow>
              <StateRow label="Disabled">
                <Button variant="default" disabled>
                  Continue
                </Button>
              </StateRow>
            </Section>

            <Divider />

            {/* Primary button */}
            <Section title="Primary Button" subtitle="Main call to action">
              <StateRow label="Default">
                <Button variant="primary">
                  Get started
                  <ArrowRight size={16} />
                </Button>
              </StateRow>
              <StateRow label="Pressed">
                <Button variant="primary">
                  Get started
                  <ArrowRight size={16} />
                </Button>
              </StateRow>
              <StateRow label="Disabled">
                <Button variant="primary" disabled>
                  Get started
                </Button>
              </StateRow>
            </Section>

            <Divider />

            {/* Secondary button */}
            <Section title="Secondary Button" subtitle="Supporting action">
              <StateRow label="Default">
                <Button variant="secondary">Learn more</Button>
              </StateRow>
              <StateRow label="Pressed">
                <Button variant="secondary">Learn more</Button>
              </StateRow>
              <StateRow label="Disabled">
                <Button variant="secondary" disabled>
                  Learn more
                </Button>
              </StateRow>
            </Section>

            <Divider />

            {/* Outline button */}
            <Section title="Outline Button" subtitle="Subtle, bordered action">
              <StateRow label="Default">
                <Button variant="outline">Skip for now</Button>
              </StateRow>
              <StateRow label="Pressed">
                <Button variant="outline">Skip for now</Button>
              </StateRow>
              <StateRow label="Disabled">
                <Button variant="outline" disabled>
                  Skip for now
                </Button>
              </StateRow>
            </Section>

            <Divider />

            {/* adjacent button pairs */}
            <Section title="Adjacent Buttons" subtitle="Two actions side by side">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button variant="outline" fullWidth>
                    Cancel
                  </Button>
                  <Button variant="primary" fullWidth>
                    Save
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" fullWidth>
                    Back
                  </Button>
                  <Button variant="default" fullWidth>
                    Next
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" fullWidth disabled>
                    No
                  </Button>
                  <Button variant="primary" fullWidth>
                    Yes
                  </Button>
                </div>
                <div className="flex gap-3">
                  <IconButton aria-label="previous">
                    <ArrowRight size={20} className="rotate-180" />
                  </IconButton>
                  <Button variant="primary" fullWidth>
                    Continue
                  </Button>
                  <IconButton aria-label="next">
                    <ArrowRight size={20} />
                  </IconButton>
                </div>
              </div>
            </Section>

            <Divider />

            {/* full-width demo */}
            <Section title="Full Width" subtitle="Stacked actions in a flow">
              <div className="space-y-3">
                <Button variant="primary" fullWidth>
                  <Check size={16} />
                  Confirm selection
                </Button>
                <Button variant="outline" fullWidth>
                  Cancel
                </Button>
              </div>
            </Section>

            <Divider />

            {/* text input */}
            <Section title="Text Input" subtitle="Single-line text fields">
              <div className="space-y-4">
                <Input label="Default" placeholder="Enter your name" />
                <Input label="With icon" placeholder="you@example.com" leftIcon={<Mail size={18} />} />
                <Input label="Filled" defaultValue="Jane Doe" />
                <Input label="Error" placeholder="Enter email" error errorText="Please enter a valid email address" />
                <Input label="Disabled" placeholder="Cannot edit" disabled helperText="This field is locked" />
              </div>
            </Section>

            <Divider />

            {/* search input */}
            <Section title="Search Input" subtitle="With leading search icon">
              <SearchInput placeholder="Search accounts…" />
            </Section>

            <Divider />

            {/* select */}
            <Section title="Select" subtitle="Dropdown selector — tap to open">
              <Select
                label="Country"
                options={countryOptions}
                value={selectedCountry}
                onChange={setSelectedCountry}
              />
              <Select label="Disabled" options={countryOptions} value="" onChange={() => {}} disabled />
            </Section>

            <Divider />

            {/* textarea */}
            <Section title="Textarea" subtitle="Multi-line text with character counter">
              <Textarea
                label="Bio"
                value={bio}
                onChange={setBio}
                placeholder="Tell us about yourself…"
                maxLength={200}
                helperText="Up to 200 characters"
              />
              <Textarea
                label="Error"
                value="Too short!"
                onChange={() => {}}
                error
                errorText="Please write at least 20 characters"
              />
              <Textarea label="Disabled" value="" onChange={() => {}} placeholder="Cannot edit" disabled />
            </Section>

            <Divider />

            {/* checkboxes */}
            <Section title="Checkbox" subtitle="Multi-select options">
              <div className="space-y-3">
                {checkboxOptions.map((opt) => (
                  <Checkbox
                    key={opt}
                    label={opt}
                    checked={checkedBoxes.includes(opt)}
                    onChange={() => toggleCheckbox(opt)}
                  />
                ))}
                <Checkbox label="Unavailable option" checked={false} onChange={() => {}} disabled />
              </div>
            </Section>

            <Divider />

            {/* switches */}
            <Section title="Switch" subtitle="Toggle settings on or off">
              <div className="space-y-3">
                <Switch label="Email notifications" checked={switches.email} onChange={(v) => toggleSwitch('email', v)} />
                <Switch label="Push notifications" checked={switches.push} onChange={(v) => toggleSwitch('push', v)} />
                <Switch label="SMS alerts" checked={false} onChange={() => {}} disabled />
              </div>
            </Section>
          </div>

          {/* home indicator */}
          <div className="flex justify-center bg-brand-50 pb-2 pt-1">
            <span className="h-1 w-32 rounded-full bg-brand-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-brand-200" />;
}

export default App;
