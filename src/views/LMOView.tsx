import { useState } from 'react';
import { AlertCircle, CalendarDays, Check, ChevronDown, ClipboardCheck, FileCheck2, Gauge, MapPin, X } from 'lucide-react';
import { formatDate, initialInspections } from '@/data';
import { CertificateCard } from '@/components/CertificateCard';
import type { Inspection, InspectionStatus } from '@/types';

const TOLERANCE_PERCENT = 0.1;

export function LMOView() {
  const [inspections, setInspections] = useState<Inspection[]>(initialInspections);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [issued, setIssued] = useState<string | null>(null);

  const updateInspection = (id: string, patch: Partial<Inspection>) => setInspections((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));

  const issueCertificate = (inspection: Inspection) => {
    const certificateId = `WB/LM/2026/${String(41800 + Number(inspection.id.slice(-3))).padStart(8, '0')}`;
    updateInspection(inspection.id, { certificateId, status: 'Passed' });
    setIssued(inspection.id);
  };

  const selectedIssued = inspections.find((item) => item.id === issued);

  return <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gov-600"><ClipboardCheck size={15} /> Officer workspace</div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-gov-950 sm:text-4xl">Assigned inspections</h1>
        <p className="mt-2 text-sm text-slate-500">Review field visits and record results within the ±{TOLERANCE_PERCENT}% tolerance.</p>
      </div>
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500"><span className="h-2 w-2 rounded-full bg-success-500" /> {inspections.filter((item) => item.status === 'Passed').length} completed <span className="ml-2 h-2 w-2 rounded-full bg-warning-500" /> {inspections.filter((item) => item.status === 'Pending').length} pending</div>
    </div>

    <div className="space-y-3">
      {inspections.map((inspection, index) => {
        const isOpen = expanded === inspection.id;
        return <div key={inspection.id} className={`card overflow-hidden transition-shadow ${isOpen ? 'ring-2 ring-gov-500/20' : ''}`}>
          <button onClick={() => setExpanded(isOpen ? null : inspection.id)} className="flex w-full items-center gap-4 p-4 text-left sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gov-50 text-sm font-bold text-gov-700">0{index + 1}</div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2"><h2 className="truncate text-sm font-bold text-slate-900 sm:text-base">{inspection.shopName}</h2><InspectionPill status={inspection.status} /></div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500"><span>{inspection.instrumentType} ({inspection.capacity})</span><span className="flex items-center gap-1"><MapPin size={12} /> {inspection.district}</span><span className="flex items-center gap-1"><CalendarDays size={13} /> {formatDate(inspection.scheduledDate)}</span></div>
            </div>
            <ChevronDown size={19} className={`shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          {isOpen && <InspectionPanel inspection={inspection} onUpdate={(patch) => updateInspection(inspection.id, patch)} onIssue={() => issueCertificate(inspection)} />}
        </div>;
      })}
    </div>

    {selectedIssued && <div className="mt-8">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold text-success-700"><FileCheck2 size={18} /> Digital certificate issued</div>
      <CertificateCard certificate={{ id: selectedIssued.certificateId ?? '', instrumentType: selectedIssued.instrumentType, capacity: selectedIssued.capacity, ownerName: selectedIssued.ownerName, shopName: selectedIssued.shopName, issuingDept: `Legal Metrology Dept, ${selectedIssued.district}`, verificationDate: '2026-09-02', expiryDate: '2027-09-01', status: 'VALID' }} showActions />
    </div>}
  </div>;
}

function InspectionPanel({ inspection, onUpdate, onIssue }: { inspection: Inspection; onUpdate: (patch: Partial<Inspection>) => void; onIssue: () => void }) {
  const [remarks, setRemarks] = useState(inspection.remarks);
  const [reading, setReading] = useState('');

  const standard = inspection.standardWeight ?? 0;
  const entered = parseFloat(reading);
  const hasReading = !isNaN(entered) && reading !== '';
  const deviation = hasReading ? Math.abs(entered - standard) : 0;
  const maxDeviation = standard * (TOLERANCE_PERCENT / 100);
  const withinTolerance = hasReading && deviation <= maxDeviation;
  const recommendation: 'Pass' | 'Fail' | null = hasReading ? (withinTolerance ? 'Pass' : 'Fail') : null;

  const handleReadingChange = (value: string) => {
    setReading(value);
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && value !== '') {
      const dev = Math.abs(parsed - standard);
      const maxDev = standard * (TOLERANCE_PERCENT / 100);
      const passed = dev <= maxDev;
      onUpdate({ testReading: parsed, status: passed ? 'Passed' : 'Failed' });
    }
  };

  return <div className="animate-slide-down border-t border-slate-200 bg-slate-50/80 p-4 sm:p-6">
    <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
      <div>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gov-700 shadow-sm"><MapPin size={17} /></div>
          <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Inspection details</p><p className="text-sm font-semibold text-slate-800">{inspection.ownerName}</p></div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-slate-200 pb-3"><span className="text-slate-500">Location</span><span className="text-right font-medium text-slate-700">{inspection.shopName}</span></div>
          <div className="flex justify-between gap-4 border-b border-slate-200 pb-3"><span className="text-slate-500">District</span><span className="text-right font-medium text-slate-700">{inspection.district}</span></div>
          <div className="flex justify-between gap-4 border-b border-slate-200 pb-3"><span className="text-slate-500">Instrument</span><span className="text-right font-medium text-slate-700">{inspection.instrumentType}</span></div>
          <div className="flex justify-between gap-4 border-b border-slate-200 pb-3"><span className="text-slate-500">Capacity</span><span className="text-right font-medium text-slate-700">{inspection.capacity}</span></div>
          <div className="flex justify-between gap-4"><span className="text-slate-500">Tolerance limit</span><span className="font-bold text-gov-700">±{TOLERANCE_PERCENT}%</span></div>
        </div>
      </div>

      <div>
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800"><Gauge size={16} className="text-gov-600" /> Test reading input</p>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-slate-600">Standard test weight: <span className="font-bold text-gov-700">{standard} kg</span></span>
          <input type="number" step="0.001" value={reading} onChange={(event) => handleReadingChange(event.target.value)} placeholder={`Enter scale reading (e.g. ${standard.toFixed(1)})`} className="input-field" />
        </label>

        {hasReading && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 bg-white p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Deviation</p><p className="mt-1 text-sm font-bold text-slate-800">{deviation.toFixed(3)} kg</p></div>
              <div className="rounded-lg border border-slate-200 bg-white p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Max allowed</p><p className="mt-1 text-sm font-bold text-slate-800">±{maxDeviation.toFixed(3)} kg</p></div>
            </div>
            <div className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${recommendation === 'Pass' ? 'border-success-200 bg-success-50 text-success-800' : 'border-danger-200 bg-danger-50 text-danger-800'}`}>
              {recommendation === 'Pass' ? <Check size={18} /> : <X size={18} />}
              <div>
                <p className="text-sm font-bold">{recommendation === 'Pass' ? 'Within tolerance — Pass recommended' : 'Outside tolerance — Fail recommended'}</p>
                <p className="text-xs">{recommendation === 'Pass' ? `Reading is within the ±${TOLERANCE_PERCENT}% legal limit.` : `Reading exceeds the ±${TOLERANCE_PERCENT}% legal limit.`}</p>
              </div>
            </div>
          </div>
        )}

        <label className="mt-4 block">
          <span className="mb-2 block text-xs font-semibold text-slate-600">Officer remarks <span className="font-normal text-slate-400">(optional)</span></span>
          <textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} rows={2} placeholder="Add notes from the field visit..." className="input-field resize-none" />
        </label>

        {recommendation === 'Pass' && <button onClick={onIssue} className="btn-primary mt-4 w-full"><FileCheck2 size={17} /> Issue digital certificate</button>}
        {recommendation === 'Fail' && <div className="mt-4 flex gap-2 rounded-lg border border-danger-200 bg-danger-50 p-3 text-xs leading-5 text-danger-800"><AlertCircle size={16} className="mt-0.5 shrink-0" /> Marked as failed. Add remarks explaining what needs correction.</div>}
        {inspection.status === 'Passed' && !recommendation && <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-success-700"><Check size={15} /> Inspection complete</div>}
      </div>
    </div>
  </div>;
}

function InspectionPill({ status }: { status: InspectionStatus }) {
  const config: Record<InspectionStatus, { styles: string; icon: React.ReactNode }> = {
    Pending: { styles: 'bg-warning-50 text-warning-700', icon: <ClockIcon /> },
    Passed: { styles: 'bg-success-50 text-success-700', icon: <Check size={12} /> },
    Failed: { styles: 'bg-danger-50 text-danger-700', icon: <X size={12} /> },
  };
  const { styles, icon } = config[status];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${styles}`}>{icon}{status}</span>;
}

function ClockIcon() { return <RefreshIcon />; }
function RefreshIcon() { return <span className="h-2 w-2 rounded-full bg-current" />; }
