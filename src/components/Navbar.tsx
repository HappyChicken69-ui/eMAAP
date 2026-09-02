import { Building2, ChevronDown, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import type { Role } from '@/types';

interface NavbarProps {
  role: Role;
  onRoleChange: (role: Role) => void;
}

const roles: { value: Role; label: string; description: string }[] = [
  { value: 'public', label: 'Public', description: 'Verify a certificate' },
  { value: 'shop', label: 'Shop Owner', description: 'Manage instruments' },
  { value: 'lmo', label: 'LMO Officer', description: 'Conduct inspections' },
  { value: 'admin', label: 'Admin (Regulator)', description: 'Compliance overview' },
];

export function Navbar({ role, onRoleChange }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const activeRole = roles.find((item) => item.value === role) ?? roles[0];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-gov-950 text-white shadow-lg">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button className="flex items-center gap-3 text-left" onClick={() => onRoleChange('public')}>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500 shadow-lg shadow-accent-500/20">
            <ShieldCheck size={24} strokeWidth={2.5} />
          </span>
          <span className="hidden sm:block">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-gov-200">Government of West Bengal</span>
            <span className="block text-base font-bold tracking-tight">Legal Metrology <span className="text-accent-300">Verify</span></span>
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 text-xs text-gov-200 md:flex">
            <Building2 size={14} />
            <span>Digital Verification Portal</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setOpen((value) => !value)}
              className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-left transition-colors hover:bg-white/15"
              aria-haspopup="listbox"
              aria-expanded={open}
            >
              <span className="hidden text-[10px] font-medium uppercase tracking-wider text-gov-200 sm:block">Role Simulator</span>
              <span className="text-sm font-semibold">{activeRole.label}</span>
              <ChevronDown size={16} className={`text-gov-200 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
              <>
                <button className="fixed inset-0 cursor-default" aria-label="Close menu" onClick={() => setOpen(false)} />
                <div className="absolute right-0 top-[calc(100%+8px)] w-64 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 text-slate-900 shadow-cardHover">
                  <div className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Switch view</div>
                  {roles.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => { onRoleChange(item.value); setOpen(false); }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors ${role === item.value ? 'bg-gov-50 text-gov-800' : 'hover:bg-slate-50'}`}
                    >
                      <span>
                        <span className="block text-sm font-semibold">{item.label}</span>
                        <span className="block text-xs text-slate-500">{item.description}</span>
                      </span>
                      {role === item.value && <span className="h-2 w-2 rounded-full bg-success-500" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
