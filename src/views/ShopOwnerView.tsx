import { useMemo, useState } from 'react';
import { CalendarDays, Check, ClipboardList, Clock3, Plus, RefreshCw, Store, Users, X } from 'lucide-react';
import { capacities, formatDate, initialInstruments, instrumentTypes, slotCapacities, timeSlots } from '@/data';
import type { Instrument, InstrumentStatus } from '@/types';

export function ShopOwnerView() {
  const [instruments, setInstruments] = useState<Instrument[]>(initialInstruments);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState(instrumentTypes[0]);
  const [capacity, setCapacity] = useState(capacities[2]);
  const [date, setDate] = useState('2026-09-10');
  const [slot, setSlot] = useState(timeSlots[0]);
  const [bookedSlots, setBookedSlots] = useState<Record<string, number>>({ '09:00 AM - 10:00 AM': 3, '10:00 AM - 11:00 AM': 2 });

  const activeCount = useMemo(() => instruments.filter((item) => item.status === 'Active').length, [instruments]);
  const scheduledCount = useMemo(() => instruments.filter((item) => item.status === 'Scheduled').length, [instruments]);
  const expiringCount = useMemo(() => instruments.filter((item) => item.status === 'Expiring Soon').length, [instruments]);

  const submitApplication = (event: React.FormEvent) => {
    event.preventDefault();
    setInstruments((current) => [...current, { id: `INST-${String(current.length + 1).padStart(3, '0')}`, type, capacity, owner: 'Ramesh Kumar Sharma', shopName: 'Sharma General Store', lastVerified: null, expiryDate: null, scheduledDate: date, status: 'Scheduled' }]);
    setBookedSlots((current) => ({ ...current, [slot]: (current[slot] ?? 0) + 1 }));
    setSubmitted(true);
  };

  const closeModal = () => { setModalOpen(false); setSubmitted(false); };

  const bookReverification = (instrument: Instrument) => {
    setInstruments((current) => current.map((item) => item.id === instrument.id ? { ...item, status: 'Scheduled', scheduledDate: '2026-09-12' } : item));
  };

  const slotsRemaining = (slotKey: string) => {
    const total = slotCapacities[slotKey] ?? 5;
    const booked = bookedSlots[slotKey] ?? 0;
    return Math.max(0, total - booked);
  };

  return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gov-600"><Store size={15} /> Shop owner portal</div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-gov-950 sm:text-4xl">Good morning, Ramesh.</h1>
        <p className="mt-2 text-sm text-slate-500">Keep your instruments verified and your business compliant.</p>
      </div>
      <button className="btn-primary" onClick={() => setModalOpen(true)}><Plus size={18} /> Apply for verification</button>
    </div>

    <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      <Stat icon={<ClipboardList />} label="Total instruments" value={String(instruments.length)} />
      <Stat icon={<Check />} label="Active" value={String(activeCount)} color="success" />
      <Stat icon={<Clock3 />} label="Pending inspection" value={String(scheduledCount)} color="warning" />
      <Stat icon={<CalendarDays />} label="Expiring soon" value={String(expiringCount)} color="danger" />
    </div>

    <div className="card overflow-hidden">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
        <div><h2 className="font-semibold text-slate-900">My instruments</h2><p className="mt-1 text-xs text-slate-500">All weighing instruments registered to your business</p></div>
        <span className="rounded-full bg-gov-50 px-3 py-1 text-xs font-semibold text-gov-700">{instruments.length} records</span>
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500">
            <tr><th className="px-6 py-3.5">Instrument type</th><th className="px-6 py-3.5">Last verified</th><th className="px-6 py-3.5">Expiry date</th><th className="px-6 py-3.5">Status</th><th className="px-6 py-3.5">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {instruments.map((item) => <tr key={item.id} className="transition-colors hover:bg-slate-50/70">
              <td className="px-6 py-4"><p className="text-sm font-semibold text-slate-800">{item.type}</p><p className="mt-0.5 text-xs text-slate-400">{item.id} · {item.capacity}</p></td>
              <td className="px-6 py-4 text-sm text-slate-600">{formatDate(item.lastVerified)}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{item.status === 'Scheduled' ? formatDate(item.scheduledDate) : formatDate(item.expiryDate)}</td>
              <td className="px-6 py-4"><StatusPill status={item.status} /></td>
              <td className="px-6 py-4">{item.status === 'Scheduled' ? <span className="text-xs text-slate-400">Awaiting inspection</span> : <button onClick={() => bookReverification(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-gov-700 transition-colors hover:border-gov-300 hover:bg-gov-50"><RefreshCw size={13} /> Book re-verification</button>}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-slate-100 md:hidden">
        {instruments.map((item) => <div key={item.id} className="p-5">
          <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-800">{item.type}</p><p className="mt-1 text-xs text-slate-400">{item.id} · {item.capacity}</p></div><StatusPill status={item.status} /></div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs"><div><span className="block text-slate-400">Last verified</span><span className="mt-1 block font-medium text-slate-700">{formatDate(item.lastVerified)}</span></div><div><span className="block text-slate-400">{item.status === 'Scheduled' ? 'Appointment' : 'Expiry date'}</span><span className="mt-1 block font-medium text-slate-700">{formatDate(item.status === 'Scheduled' ? item.scheduledDate : item.expiryDate)}</span></div></div>
          {item.status !== 'Scheduled' && <button onClick={() => bookReverification(item)} className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-gov-700 transition-colors hover:border-gov-300 hover:bg-gov-50"><RefreshCw size={13} /> Book re-verification</button>}
        </div>)}
      </div>
    </div>

    {modalOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-gov-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="animate-fade-in w-full max-w-lg rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div><h2 className="text-lg font-bold text-gov-950">Apply for verification</h2><p className="mt-1 text-sm text-slate-500">Book an inspection for a new or due instrument.</p></div>
          <button onClick={closeModal} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={19} /></button>
        </div>
        {submitted ? <div className="py-6 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-100 text-success-700"><Check size={28} /></div><h3 className="mt-4 font-semibold text-slate-900">Application scheduled</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">Your instrument has been added to the list. An officer will visit on {formatDate(date)} at {slot}.</p><button className="btn-primary mt-6" onClick={closeModal}>Back to instruments</button></div> : <form onSubmit={submitApplication} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-700">Instrument type</span><select className="input-field" value={type} onChange={(event) => setType(event.target.value)}>{instrumentTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-700">Capacity</span><select className="input-field" value={capacity} onChange={(event) => setCapacity(event.target.value)}>{capacities.map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
          <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-700">Preferred date</span><input required type="date" min="2026-09-03" className="input-field" value={date} onChange={(event) => setDate(event.target.value)} /></label>
          <div><span className="mb-2 block text-xs font-semibold text-slate-700">Preferred time slot</span><div className="space-y-2">{timeSlots.map((item) => { const remaining = slotsRemaining(item); const full = remaining === 0; return <button type="button" key={item} disabled={full} onClick={() => setSlot(item)} className={`flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm transition-all ${slot === item ? 'border-gov-500 bg-gov-50 text-gov-800 ring-1 ring-gov-500/20' : full ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400' : 'border-slate-200 bg-white text-slate-700 hover:border-gov-300'}`}><span className="font-medium">{item}</span><span className={`flex items-center gap-1 text-xs font-semibold ${full ? 'text-danger-500' : remaining <= 2 ? 'text-warning-600' : 'text-success-600'}`}><Users size={13} />{full ? 'Full' : `${remaining}/${slotCapacities[item]} slots`}</span></button>; })}</div></div>
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button><button type="submit" className="btn-primary"><CalendarDays size={17} /> Submit application</button></div>
        </form>}
      </div>
    </div>}
  </div>;
}

function Stat({ icon, label, value, color = 'gov' }: { icon: React.ReactNode; label: string; value: string; color?: 'gov' | 'success' | 'warning' | 'danger' }) {
  const styles = { gov: 'bg-gov-50 text-gov-700', success: 'bg-success-50 text-success-700', warning: 'bg-warning-50 text-warning-700', danger: 'bg-danger-50 text-danger-700' };
  return <div className="card p-4 sm:p-5"><div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${styles[color]}`}>{icon}</div><p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>;
}

function StatusPill({ status }: { status: InstrumentStatus }) {
  const styles: Record<InstrumentStatus, string> = {
    Active: 'bg-success-50 text-success-700 ring-success-600/20',
    Expired: 'bg-danger-50 text-danger-700 ring-danger-600/20',
    Scheduled: 'bg-warning-50 text-warning-700 ring-warning-600/20',
    'Expiring Soon': 'bg-accent-50 text-accent-700 ring-accent-600/20',
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${styles[status]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}
