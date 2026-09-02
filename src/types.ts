export type Role = 'public' | 'shop' | 'lmo' | 'admin';

export type InstrumentStatus = 'Active' | 'Expired' | 'Scheduled' | 'Expiring Soon';

export type InspectionStatus = 'Pending' | 'Passed' | 'Failed';

export interface Instrument {
  id: string;
  type: string;
  capacity: string;
  owner: string;
  shopName: string;
  lastVerified: string | null;
  expiryDate: string | null;
  scheduledDate: string | null;
  status: InstrumentStatus;
}

export interface Certificate {
  id: string;
  instrumentType: string;
  capacity: string;
  ownerName: string;
  shopName: string;
  issuingDept: string;
  verificationDate: string;
  expiryDate: string;
  status: 'VALID' | 'EXPIRED';
}

export interface Inspection {
  id: string;
  shopName: string;
  ownerName: string;
  instrumentType: string;
  capacity: string;
  district: string;
  scheduledDate: string;
  status: InspectionStatus;
  remarks: string;
  certificateId?: string;
  standardWeight?: number;
  testReading?: number;
}

export interface DistrictStat {
  district: string;
  total: number;
  completed: number;
  pending: number;
  expired: number;
}
