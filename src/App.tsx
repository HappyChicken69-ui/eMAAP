import { useState } from 'react';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AdminView } from '@/views/AdminView';
import { LMOView } from '@/views/LMOView';
import { PublicView } from '@/views/PublicView';
import { ShopOwnerView } from '@/views/ShopOwnerView';
import type { Role } from '@/types';

function App() {
  const [role, setRole] = useState<Role>('public');

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role={role} onRoleChange={setRole} />
      <main className="min-h-[calc(100vh-72px)] pt-[72px]">
        {role === 'public' && <PublicView />}
        {role === 'shop' && <ShopOwnerView />}
        {role === 'lmo' && <LMOView />}
        {role === 'admin' && <AdminView />}
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-gov-600" /><span>Legal Metrology Verification Portal</span></div>
          <div className="flex items-center gap-1.5">A transparent service for every citizen <ArrowUpRight size={13} /></div>
        </div>
      </footer>
    </div>
  );
}

export default App;
