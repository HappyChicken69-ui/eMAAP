import { useMemo } from 'react';
import { AlertTriangle, BarChart3, CheckCircle2, Clock3, ShieldAlert, TrendingUp } from 'lucide-react';
import { districtStats, initialInspections, initialInstruments } from '@/data';

export function AdminView() {
  const totalActive = useMemo(() => initialInstruments.filter((item) => item.status === 'Active' || item.status === 'Expiring Soon').length, []);
  const pendingInspections = useMemo(() => initialInspections.filter((item) => item.status === 'Pending').length, []);
  const lapsedCount = useMemo(() => initialInstruments.filter((item) => item.status === 'Expired').length, []);
  const fraudAlerts = 0;

  const totalInstruments = districtStats.reduce((sum, item) => sum + item.total, 0);
  const totalCompleted = districtStats.reduce((sum, item) => sum + item.completed, 0);
  const overallRate = Math.round((totalCompleted / totalInstruments) * 100);

  return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
    <div className="mb-8">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gov-600"><BarChart3 size={15} /> Regulator dashboard</div>
      <h1 className="font-serif text-3xl font-bold tracking-tight text-gov-950 sm:text-4xl">Compliance overview</h1>
      <p className="mt-2 text-sm text-slate-500">State-wide verification metrics and district-wise pendency tracking.</p>
    </div>

    <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      <MetricCard icon={<CheckCircle2 />} label="Total active instruments" value={String(totalActive)} sub="Verified & valid" color="success" />
      <MetricCard icon={<Clock3 />} label="Pending inspections" value={String(pendingInspections)} sub="Awaiting officer visit" color="warning" />
      <MetricCard icon={<AlertTriangle />} label="Lapsed / expired" value={String(lapsedCount)} sub="Require immediate renewal" color="danger" />
      <MetricCard icon={<ShieldAlert />} label="Fraud risk alerts" value={String(fraudAlerts)} sub="No anomalies detected" color="gov" />
    </div>

    <div className="mb-8 grid gap-4 lg:grid-cols-3">
      <div className="card p-5 lg:col-span-2">
        <div className="mb-5 flex items-center justify-between">
          <div><h2 className="font-semibold text-slate-900">District-wise pendency</h2><p className="mt-1 text-xs text-slate-500">Inspection completion rates across districts</p></div>
          <span className="rounded-full bg-gov-50 px-3 py-1 text-xs font-semibold text-gov-700">{districtStats.length} districts</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500">
              <tr><th className="py-3 pr-4">District</th><th className="py-3 pr-4">Total</th><th className="py-3 pr-4">Completed</th><th className="py-3 pr-4">Pending</th><th className="py-3 pr-4">Expired</th><th className="py-3">Completion rate</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {districtStats.map((item) => {
                const rate = Math.round((item.completed / item.total) * 100);
                return <tr key={item.district} className="transition-colors hover:bg-slate-50/70">
                  <td className="py-3.5 pr-4 font-semibold text-slate-800">{item.district}</td>
                  <td className="py-3.5 pr-4 text-slate-600">{item.total.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 pr-4 text-slate-600">{item.completed.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 pr-4"><span className="font-medium text-warning-700">{item.pending}</span></td>
                  <td className="py-3.5 pr-4"><span className="font-medium text-danger-700">{item.expired}</span></td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${rate >= 85 ? 'bg-success-500' : rate >= 70 ? 'bg-warning-500' : 'bg-danger-500'}`} style={{ width: `${rate}%` }} /></div>
                      <span className="text-xs font-bold text-slate-700">{rate}%</span>
                    </div>
                  </td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card flex flex-col p-5">
        <div className="mb-1 flex items-center gap-2"><TrendingUp size={16} className="text-gov-600" /><h2 className="font-semibold text-slate-900">State average</h2></div>
        <p className="mb-5 text-xs text-slate-500">Overall inspection completion rate</p>
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="relative flex h-36 w-36 items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 144 144">
              <circle cx="72" cy="72" r="60" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-100" />
              <circle cx="72" cy="72" r="60" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" className="text-gov-600 transition-all" strokeDasharray={`${(overallRate / 100) * 377} 377`} />
            </svg>
            <div className="text-center"><p className="text-3xl font-bold text-gov-950">{overallRate}%</p><p className="text-[10px] uppercase tracking-wider text-slate-400">completed</p></div>
          </div>
          <div className="mt-5 grid w-full grid-cols-2 gap-3 text-center">
            <div className="rounded-lg bg-slate-50 p-3"><p className="text-lg font-bold text-slate-800">{totalInstruments.toLocaleString('en-IN')}</p><p className="text-[10px] uppercase tracking-wider text-slate-400">Total instruments</p></div>
            <div className="rounded-lg bg-slate-50 p-3"><p className="text-lg font-bold text-slate-800">{totalCompleted.toLocaleString('en-IN')}</p><p className="text-[10px] uppercase tracking-wider text-slate-400">Verified</p></div>
          </div>
        </div>
      </div>
    </div>
  </div>;
}

function MetricCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: 'gov' | 'success' | 'warning' | 'danger' }) {
  const styles = { gov: 'bg-gov-50 text-gov-700', success: 'bg-success-50 text-success-700', warning: 'bg-warning-50 text-warning-700', danger: 'bg-danger-50 text-danger-700' };
  return <div className="card p-4 sm:p-5">
    <div className="mb-3 flex items-center justify-between">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${styles[color]}`}>{icon}</div>
    </div>
    <p className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{value}</p>
    <p className="mt-1 text-xs font-semibold text-slate-700">{label}</p>
    <p className="text-[11px] text-slate-400">{sub}</p>
  </div>;
}
