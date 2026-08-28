import { useEffect, useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Bell, Shield, Globe } from 'lucide-react';
import { Section, StateRow } from '@/components/Section';
import { Switch } from '@/components/inputs';
import { supabase } from '@/lib/supabase';
import type { SaccoMember } from '@/lib/types';
import { formatDate } from '@/lib/format';

export function ProfileScreen() {
  const [member, setMember] = useState<SaccoMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifSms, setNotifSms] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: m } = await supabase.from('sacco_members').select('*').limit(1).maybeSingle();
      setMember(m as SaccoMember | null);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-brand-500">Unable to load your profile. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-5">
      {/* profile header */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-700 text-2xl font-bold text-white">
          {member.full_name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <h2 className="mt-3 text-lg font-bold text-brand-800">{member.full_name}</h2>
        <p className="text-xs text-brand-400">{member.membership_number}</p>
        <span className="mt-2 rounded-full bg-green-50 px-3 py-0.5 text-xs font-medium text-green-600">
          Active Member
        </span>
      </div>

      {/* personal information */}
      <Section title="Personal Information">
        <div className="rounded-2xl border border-brand-200 bg-white p-4">
          <div className="space-y-3">
            <StateRow label="Name">
              <span className="flex items-center gap-2 text-xs font-medium text-brand-600">
                <User size={14} className="text-brand-400" />
                {member.full_name}
              </span>
            </StateRow>
            <StateRow label="Email">
              <span className="flex items-center gap-2 text-xs font-medium text-brand-600">
                <Mail size={14} className="text-brand-400" />
                {member.email}
              </span>
            </StateRow>
            <StateRow label="Phone">
              <span className="flex items-center gap-2 text-xs font-medium text-brand-600">
                <Phone size={14} className="text-brand-400" />
                {member.phone}
              </span>
            </StateRow>
            <StateRow label="Joined">
              <span className="flex items-center gap-2 text-xs font-medium text-brand-600">
                <Calendar size={14} className="text-brand-400" />
                {formatDate(member.join_date)}
              </span>
            </StateRow>
            <StateRow label="Region">
              <span className="flex items-center gap-2 text-xs font-medium text-brand-600">
                <MapPin size={14} className="text-brand-400" />
                Nairobi, Kenya
              </span>
            </StateRow>
          </div>
        </div>
      </Section>

      {/* notification preferences */}
      <Section title="Notifications" subtitle="Choose how you want to be reached">
        <div className="space-y-3">
          <Switch label="Push notifications" checked={notifPush} onChange={setNotifPush} />
          <Switch label="Email alerts" checked={notifEmail} onChange={setNotifEmail} />
          <Switch label="SMS reminders" checked={notifSms} onChange={setNotifSms} />
        </div>
      </Section>

      {/* app settings */}
      <Section title="Settings">
        <div className="rounded-2xl border border-brand-200 bg-white p-4">
          <div className="space-y-3">
            <button className="flex w-full items-center gap-3 text-left">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                <Shield size={16} />
              </span>
              <span className="flex-1 text-sm font-medium text-brand-700">Security & Privacy</span>
              <span className="text-xs text-brand-400">›</span>
            </button>
            <button className="flex w-full items-center gap-3 text-left">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                <Globe size={16} />
              </span>
              <span className="flex-1 text-sm font-medium text-brand-700">Language</span>
              <span className="text-xs text-brand-400">English ›</span>
            </button>
            <button className="flex w-full items-center gap-3 text-left">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                <Bell size={16} />
              </span>
              <span className="flex-1 text-sm font-medium text-brand-700">Notification Settings</span>
              <span className="text-xs text-brand-400">›</span>
            </button>
          </div>
        </div>
      </Section>

      {/* about */}
      <div className="pt-2 text-center">
        <p className="text-[10px] text-brand-300">SACCO Member App v1.0.0</p>
      </div>
    </div>
  );
}
