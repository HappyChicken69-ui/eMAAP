import type { Certificate, DistrictStat, Inspection, Instrument } from './types';

export const sampleCertificateIds: { id: string; label: string; status: 'VALID' | 'EXPIRED' }[] = [
  { id: 'WB/LM/2026/00417215', label: 'WB/LM/2026/00417215', status: 'VALID' },
  { id: 'WB/LM/2024/00298104', label: 'WB/LM/2024/00298104', status: 'EXPIRED' },
  { id: 'WB/LM/2026/00417890', label: 'WB/LM/2026/00417890', status: 'VALID' },
];

export const certificates: Certificate[] = [
  {
    id: 'WB/LM/2026/00417215',
    instrumentType: 'Electronic Weighing Scale',
    capacity: '30 kg',
    ownerName: 'Ramesh Kumar Sharma',
    shopName: 'Sharma General Store',
    issuingDept: 'Legal Metrology Dept, Kolkata South',
    verificationDate: '2026-01-15',
    expiryDate: '2027-01-14',
    status: 'VALID',
  },
  {
    id: 'WB/LM/2024/00298104',
    instrumentType: 'Mechanical Beam Scale',
    capacity: '15 kg',
    ownerName: 'Priya Das',
    shopName: 'Das Provision Mart',
    issuingDept: 'Legal Metrology Dept, Kolkata North',
    verificationDate: '2024-08-10',
    expiryDate: '2025-08-09',
    status: 'EXPIRED',
  },
  {
    id: 'WB/LM/2026/00417890',
    instrumentType: 'Platform Scale',
    capacity: '500 kg',
    ownerName: 'Mohammad Iqbal',
    shopName: 'Iqbal Traders',
    issuingDept: 'Legal Metrology Dept, Howrah',
    verificationDate: '2026-03-22',
    expiryDate: '2027-03-21',
    status: 'VALID',
  },
];

export const initialInstruments: Instrument[] = [
  {
    id: 'INST-001',
    type: 'Electronic Weighing Scale',
    capacity: '30 kg',
    owner: 'Ramesh Kumar Sharma',
    shopName: 'Sharma General Store',
    lastVerified: '2026-01-15',
    expiryDate: '2027-01-14',
    scheduledDate: null,
    status: 'Active',
  },
  {
    id: 'INST-002',
    type: 'Mechanical Beam Scale',
    capacity: '15 kg',
    owner: 'Ramesh Kumar Sharma',
    shopName: 'Sharma General Store',
    lastVerified: '2024-08-10',
    expiryDate: '2025-08-09',
    scheduledDate: null,
    status: 'Expired',
  },
  {
    id: 'INST-003',
    type: 'Jewellery Balance',
    capacity: '2 kg',
    owner: 'Ramesh Kumar Sharma',
    shopName: 'Sharma General Store',
    lastVerified: '2025-11-05',
    expiryDate: '2026-11-04',
    scheduledDate: null,
    status: 'Expiring Soon',
  },
];

export const initialInspections: Inspection[] = [
  {
    id: 'INSP-001',
    shopName: 'Das Provision Mart',
    ownerName: 'Priya Das',
    instrumentType: 'Mechanical Beam Scale',
    capacity: '15 kg',
    district: 'Kolkata North',
    scheduledDate: '2026-09-03',
    status: 'Pending',
    remarks: '',
    standardWeight: 10,
  },
  {
    id: 'INSP-002',
    shopName: 'Iqbal Traders',
    ownerName: 'Mohammad Iqbal',
    instrumentType: 'Platform Scale',
    capacity: '500 kg',
    district: 'Howrah',
    scheduledDate: '2026-09-04',
    status: 'Pending',
    remarks: '',
    standardWeight: 500,
  },
  {
    id: 'INSP-003',
    shopName: 'Sengupta Sweet House',
    ownerName: 'Anita Sengupta',
    instrumentType: 'Electronic Weighing Scale',
    capacity: '30 kg',
    district: 'Kolkata South',
    scheduledDate: '2026-09-05',
    status: 'Pending',
    remarks: '',
    standardWeight: 20,
  },
];

export const instrumentTypes = ['Weighing Scale', 'Weighbridge', 'Petrol Pump'];
export const capacities = ['2 kg', '15 kg', '30 kg', '100 kg', '500 kg', '1000 kg', '5000 kg'];

export const timeSlots = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
];

export const slotCapacities: Record<string, number> = {
  '09:00 AM - 10:00 AM': 5,
  '10:00 AM - 11:00 AM': 5,
  '11:00 AM - 12:00 PM': 5,
  '02:00 PM - 03:00 PM': 5,
  '03:00 PM - 04:00 PM': 5,
};

export const districtStats: DistrictStat[] = [
  { district: 'Kolkata North', total: 1240, completed: 1098, pending: 142, expired: 87 },
  { district: 'Kolkata South', total: 1580, completed: 1320, pending: 260, expired: 134 },
  { district: 'Howrah', total: 980, completed: 870, pending: 110, expired: 56 },
  { district: 'Bardhaman', total: 760, completed: 620, pending: 140, expired: 72 },
  { district: 'Siliguri', total: 540, completed: 485, pending: 55, expired: 28 },
];

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getVerificationUrl(certificateId: string): string {
  return `https://lmverify.wb.gov.in/c/${certificateId}`;
}
