import QRCode from 'react-qr-code';
import { CheckCircle2, Download, FileCheck2, ShieldCheck } from 'lucide-react';
import type { Certificate } from '@/types';
import { formatDate, getVerificationUrl } from '@/data';

interface CertificateCardProps {
  certificate: Certificate;
  showActions?: boolean;
}

export function CertificateCard({ certificate, showActions = false }: CertificateCardProps) {
  const handlePrint = () => window.print();

  return (
    <div className="animate-fade-in overflow-hidden rounded-xl border border-slate-300 bg-white shadow-card print:shadow-none">
      <div className="border-b-4 border-accent-500 bg-gov-950 px-5 py-4 text-white sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent-300/60 bg-accent-500 text-white">
              <ShieldCheck size={26} />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gov-200">Legal Metrology Department — Government Issued</p>
              <h3 className="font-serif text-lg font-bold leading-tight sm:text-xl">Department of Consumer Affairs</h3>
              <p className="text-xs text-gov-200">Government of West Bengal</p>
            </div>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-[10px] uppercase tracking-widest text-gov-300">Certificate of</p>
            <p className="text-sm font-bold text-accent-300">VERIFICATION</p>
          </div>
        </div>
      </div>

      <div className="relative p-5 sm:p-8">
        <div className="absolute right-5 top-5 opacity-[0.035] sm:right-8 sm:top-8"><FileCheck2 size={150} /></div>
        <div className="relative grid gap-7 sm:grid-cols-[1fr_150px]">
          <div>
            <div className="mb-6 flex items-center gap-2 text-success-700">
              <CheckCircle2 size={19} strokeWidth={2.5} />
              <span className="text-xs font-bold uppercase tracking-[0.14em]">{certificate.status === 'VALID' ? 'Valid & Verified' : 'Certificate Expired'}</span>
            </div>
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <Detail label="Certificate No." value={certificate.id} wide />
              <Detail label="Instrument Type" value={`${certificate.instrumentType} (${certificate.capacity})`} wide />
              <Detail label="Owner Name" value={certificate.ownerName} />
              <Detail label="Place of Business" value={certificate.shopName} />
              <Detail label="Issuing Department" value={certificate.issuingDept} />
              <Detail label="Verification Date" value={formatDate(certificate.verificationDate)} />
              <Detail label="Expiry Date" value={formatDate(certificate.expiryDate)} valueClass={certificate.status === 'EXPIRED' ? 'text-danger-600' : 'text-success-700'} />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center border-t border-slate-100 pt-6 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
            <div className="rounded-lg border border-slate-200 bg-white p-3"><QRCode value={getVerificationUrl(certificate.id)} size={112} /></div>
            <p className="mt-2 text-center text-[10px] font-medium uppercase tracking-wider text-slate-500">Scan to verify</p>
          </div>
        </div>
        <div className="mt-7 flex flex-col justify-between gap-3 border-t border-dashed border-slate-200 pt-4 text-[11px] text-slate-500 sm:flex-row sm:items-center">
          <p>This is a digitally issued certificate. No physical signature is required.</p>
          {showActions && <button onClick={handlePrint} className="btn-secondary !px-3 !py-2 !text-xs print:hidden"><Download size={14} /> Print / Download Certificate</button>}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, wide = false, valueClass = 'text-slate-800' }: { label: string; value: string; wide?: boolean; valueClass?: string }) {
  return <div className={wide ? 'sm:col-span-2' : ''}><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p><p className={`text-sm font-semibold ${valueClass}`}>{value}</p></div>;
}
