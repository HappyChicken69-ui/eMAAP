import { useState } from 'react';
import QRCode from 'react-qr-code';
import { ArrowRight, CheckCircle2, Copy, Download, EyeOff, LockKeyhole, QrCode, ScanLine, Search, ShieldCheck, Sparkles, X, XCircle } from 'lucide-react';
import { certificates, getVerificationUrl, sampleCertificateIds } from '@/data';
import type { Certificate } from '@/types';

export function PublicView() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Certificate | null>(null);
  const [searched, setSearched] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [qrCertificate, setQrCertificate] = useState<Certificate | null>(null);
  const [qrError, setQrError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateQr = () => {
    const normalized = qrInput.trim().toUpperCase();
    if (!normalized) { setQrError('Please enter a certificate number.'); return; }
    const found = certificates.find((certificate) => certificate.id === normalized) ?? null;
    if (!found) { setQrCertificate(null); setQrError('Certificate not found. Please check the ID and try again.'); return; }
    if (found.status !== 'VALID') { setQrCertificate(null); setQrError('This certificate has expired. QR codes can only be generated for valid certificates.'); return; }
    setQrCertificate(found);
    setQrError('');
  };

  const copyUrl = () => {
    if (!qrCertificate) return;
    navigator.clipboard?.writeText(getVerificationUrl(qrCertificate.id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQr = () => {
    if (!qrCertificate) return;
    const svg = document.querySelector('#qr-svg svg');
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificate-${qrCertificate.id}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const closeQrModal = () => { setQrModalOpen(false); setQrInput(''); setQrCertificate(null); setQrError(''); setCopied(false); };

  const searchCertificate = (value: string = query) => {
    const normalized = value.trim().toUpperCase();
    setQuery(value);
    setResult(certificates.find((certificate) => certificate.id === normalized) ?? null);
    setSearched(true);
  };

  const simulateScan = () => {
    setScanning(true);
    setSearched(false);
    setTimeout(() => {
      setScanning(false);
      searchCertificate(sampleCertificateIds[0].id);
    }, 1800);
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-gov-950 text-white">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border-[40px] border-gov-800/40" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full border-[60px] border-gov-900/60" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-24 lg:pt-20">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gov-700 bg-gov-900/70 px-3 py-1.5 text-xs font-medium text-gov-200"><Sparkles size={13} className="text-accent-300" /> A trusted digital public service</div>
            <h1 className="font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">Verify before you <span className="text-accent-300">weigh.</span></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-gov-200 sm:text-lg">Instantly confirm the authenticity and validity of weighing instruments verified by the Legal Metrology Organisation, West Bengal.</p>
            <div className="mt-9 flex flex-wrap gap-6 text-xs text-gov-200"><span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-success-400" /> Government verified</span><span className="flex items-center gap-2"><LockKeyhole size={14} className="text-success-400" /> Secure & transparent</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:ml-auto">
            <div className="absolute -inset-4 rounded-3xl bg-gov-700/20 blur-2xl" />
            <div className="relative rounded-2xl border border-white/15 bg-white p-6 text-slate-900 shadow-2xl sm:p-7">
              <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gov-100 text-gov-700"><Search size={20} /></span><div><h2 className="font-semibold">Check a certificate</h2><p className="text-xs text-slate-500">Enter the certificate number below</p></div></div>
              <div className="flex gap-2">
                <div className="flex flex-1 rounded-lg border border-slate-300 p-1 focus-within:border-gov-500 focus-within:ring-2 focus-within:ring-gov-500/20"><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') searchCertificate(); }} placeholder="Enter Certificate ID" className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400" /><button onClick={() => searchCertificate()} className="btn-primary !px-3 !py-2"><Search size={17} /></button></div>
                <button onClick={simulateScan} disabled={scanning} className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-gov-300 hover:bg-gov-50 hover:text-gov-700 disabled:opacity-60"><ScanLine size={16} className={scanning ? 'animate-pulse' : ''} /><span className="hidden sm:inline">{scanning ? 'Scanning…' : 'Scan QR'}</span></button>
              </div>
              {scanning && <div className="mt-4 flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gov-300 bg-gov-50 py-6"><ScanLine size={32} className="animate-pulse text-gov-500" /><p className="text-xs font-medium text-gov-600">Simulating QR scan…</p></div>}
              <div className="mt-5"><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Try a sample ID</p><div className="space-y-1">{sampleCertificateIds.map((sample) => <button key={sample.id} onClick={() => searchCertificate(sample.id)} className="group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-slate-600 transition-colors hover:bg-gov-50 hover:text-gov-700"><span className="font-mono">{sample.label}</span><span className={`text-[10px] font-bold ${sample.status === 'VALID' ? 'text-success-600' : 'text-danger-600'}`}>{sample.status}<ArrowRight size={12} className="ml-1 inline transition-transform group-hover:translate-x-0.5" /></span></button>)}</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {searched && result && <div className="mx-auto max-w-3xl"><div className={`mb-5 flex items-center gap-3 rounded-lg border px-4 py-3 ${result.status === 'VALID' ? 'border-success-200 bg-success-50 text-success-800' : 'border-danger-200 bg-danger-50 text-danger-800'}`}>{result.status === 'VALID' ? <CheckCircle2 size={19} /> : <XCircle size={19} />}<span className="text-sm font-semibold">Certificate found — {result.status === 'VALID' ? 'this instrument is currently valid.' : 'this certificate has expired.'}</span></div><PublicCertificateDetails certificate={result} /></div>}
        {searched && !result && <div className="mx-auto max-w-2xl rounded-xl border border-warning-200 bg-warning-50 p-8 text-center"><QrCode className="mx-auto mb-3 text-warning-600" size={32} /><h3 className="font-semibold text-warning-900">Certificate not found</h3><p className="mt-1 text-sm text-warning-800">Please check the ID and try again. Certificate IDs are case-insensitive.</p></div>}
        {!searched && !scanning && <div className="grid gap-5 sm:grid-cols-3"><InfoCard icon={<ShieldCheck />} title="Official verification" text="Check certificates issued by authorised Legal Metrology Officers." /><InfoCard icon={<QrCode />} title="Scan & confirm" text="Use the QR code on a certificate for quick access to its details." /><InfoCard icon={<LockKeyhole />} title="Public transparency" text="Reliable information that helps every customer shop with confidence." /></div>}
      </section>

      {/* Floating bottom-center Generate QR button */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center px-4">
        <button onClick={() => setQrModalOpen(true)} className="pointer-events-auto flex items-center gap-2 rounded-full bg-gov-800 px-5 py-3 text-sm font-semibold text-white shadow-cardHover transition-all hover:bg-gov-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gov-500 focus:ring-offset-2">
          <QrCode size={18} /> Generate QR for a Certificate
        </button>
      </div>

      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-gov-950/50 backdrop-blur-sm sm:items-center sm:p-4" onClick={closeQrModal}>
          <div className="animate-fade-in w-full max-w-md rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gov-50 text-gov-700"><QrCode size={20} /></span>
                <div><h2 className="font-bold text-gov-950">Generate certificate QR</h2><p className="text-xs text-slate-500">Enter a valid certificate number</p></div>
              </div>
              <button onClick={closeQrModal} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={19} /></button>
            </div>

            {!qrCertificate ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input value={qrInput} onChange={(event) => setQrInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') generateQr(); }} placeholder="e.g. WB/LM/2026/00417215" className="input-field flex-1" />
                  <button onClick={generateQr} className="btn-primary shrink-0">Generate</button>
                </div>
                {qrError && <div className="flex items-center gap-2 rounded-lg border border-danger-200 bg-danger-50 px-3 py-2.5 text-xs font-medium text-danger-700"><XCircle size={15} /> {qrError}</div>}
                <div className="flex flex-wrap gap-2">
                  {sampleCertificateIds.filter((item) => item.status === 'VALID').map((sample) => (
                    <button key={sample.id} onClick={() => { setQrInput(sample.id); }} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-mono text-slate-600 transition-colors hover:border-gov-300 hover:bg-gov-50 hover:text-gov-700">{sample.label}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div id="qr-svg" className="rounded-xl border border-slate-200 bg-white p-4"><QRCode value={getVerificationUrl(qrCertificate.id)} size={176} /></div>
                  <div>
                    <p className="text-xs text-slate-400">Certificate No.</p>
                    <p className="font-mono text-sm font-bold text-gov-950">{qrCertificate.id}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
                  <span className="truncate font-mono text-xs text-slate-500">{getVerificationUrl(qrCertificate.id)}</span>
                  <button onClick={copyUrl} className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-gov-700 transition-colors hover:bg-gov-100">{copied ? <CheckCircle2 size={13} className="text-success-600" /> : <Copy size={13} />}{copied ? 'Copied' : 'Copy'}</button>
                </div>
                <div className="flex gap-2">
                  <button onClick={downloadQr} className="btn-secondary flex-1"><Download size={15} /> Download QR</button>
                  <button onClick={() => { setQrCertificate(null); setQrInput(''); }} className="btn-primary flex-1">Generate another</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PublicCertificateDetails({ certificate }: { certificate: Certificate }) {
  return (
    <div className="card animate-fade-in overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">Certificate ID</p>
            <p className="font-mono text-lg font-bold text-gov-950">{certificate.id}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ${certificate.status === 'VALID' ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'}`}>
            <span className="h-2 w-2 rounded-full bg-current" />{certificate.status}
          </span>
        </div>
      </div>
      <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-8">
        <Detail label="Instrument Type" value={`${certificate.instrumentType} (${certificate.capacity})`} wide />
        <Detail label="Issuing Department" value={certificate.issuingDept} />
        <Detail label="Verification Date" value={new Date(certificate.verificationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} />
        <Detail label="Expiry Date" value={new Date(certificate.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} valueClass={certificate.status === 'EXPIRED' ? 'text-danger-600' : 'text-success-700'} />
      </div>
      <div className="flex items-center gap-2 border-t border-dashed border-slate-200 bg-slate-50/60 px-5 py-3.5 sm:px-8">
        <EyeOff size={15} className="text-slate-400" />
        <p className="text-xs text-slate-500">Owner contact and address details are private and not shown in public verification.</p>
      </div>
    </div>
  );
}

function Detail({ label, value, wide = false, valueClass = 'text-slate-800' }: { label: string; value: string; wide?: boolean; valueClass?: string }) {
  return <div className={wide ? 'sm:col-span-2' : ''}><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p><p className={`text-sm font-semibold ${valueClass}`}>{value}</p></div>;
}

function InfoCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <div className="card p-5 transition-shadow hover:shadow-cardHover"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gov-50 text-gov-700">{icon}</div><h3 className="font-semibold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>; }
