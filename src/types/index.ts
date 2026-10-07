export type Role = 'beneficiary' | 'institution' | 'regulator' | 'executive' | 'admin';

export type MatchStatus = 'green' | 'amber' | 'red';
export type ClaimState =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'IDENTITY_REVIEW'
  | 'EVIDENCE_REVIEW'
  | 'INSTITUTION_REVIEW'
  | 'MORE_INFORMATION_REQUIRED'
  | 'RESUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'APPEAL'
  | 'CLOSED';

export type BenefitType =
  | 'Pension'
  | 'Retirement Fund'
  | 'Life Insurance'
  | 'Funeral Benefit'
  | 'Employee Benefit'
  | 'Death Benefit';

export type SignalStrength = 'exact' | 'strong' | 'partial' | 'weak' | 'none';

export interface Signal {
  label: string;
  strength: SignalStrength;
}

export interface MatchRecord {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  benefitType: BenefitType;
  institutionId: string;
  institutionName: string;
  institutionReference: string;
  potentialValue: number;
  confidence: number;
  status: MatchStatus;
  signals: Signal[];
  employmentPeriod?: string;
  dateIdentified: string;
  region: string;
}

export interface Claim {
  id: string;
  matchId: string;
  beneficiaryId: string;
  beneficiaryName: string;
  benefitType: BenefitType;
  institutionName: string;
  state: ClaimState;
  potentialValue: number;
  submittedAt: string;
  updatedAt: string;
  documents: UploadedDocument[];
  timeline: ClaimTimelineEvent[];
  notes?: string;
}

export interface ClaimTimelineEvent {
  id: string;
  timestamp: string;
  label: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface UploadedDocument {
  id: string;
  claimId?: string;
  name: string;
  type: DocumentType;
  size: number;
  uploadStatus: 'uploading' | 'scanning' | 'verified' | 'needs_review' | 'error';
  uploadedAt: string;
  verificationStatus: 'pending' | 'verified' | 'needs_review';
}

export type DocumentType =
  | 'ID Document'
  | 'Proof of Employment'
  | 'Marriage Certificate'
  | 'Death Certificate'
  | 'Beneficiary Documentation'
  | 'Other Supporting Evidence';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'match' | 'document' | 'claim' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Institution {
  id: string;
  name: string;
  type: 'Pension Fund' | 'Insurer' | 'Employer' | 'Administrator';
  region: string;
  matches: number;
  claims: number;
  pendingReview: number;
  resolved: number;
  avgResolutionDays: number;
  demo: boolean;
}

export interface BenefitRecord {
  id: string;
  type: BenefitType;
  institutionId: string;
  institutionName: string;
  reference: string;
  approximateValue: number;
  region: string;
  status: 'active' | 'dormant' | 'unclaimed';
}

export interface EmploymentEntry {
  id: string;
  employer: string;
  employeeNumber: string;
  startDate: string;
  endDate: string;
}

export interface BeneficiaryProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationalId: string;
  previousName: string;
  phone: string;
  email: string;
  region: string;
  employmentHistory: EmploymentEntry[];
  consentGiven: boolean;
  consentDate: string | null;
  profileCompletion: number;
  verificationStatus: 'unverified' | 'pending' | 'verified';
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages: { author: string; message: string; timestamp: string }[];
}

export interface RiskAlert {
  id: string;
  type: 'duplicate_identity' | 'reused_document' | 'multiple_beneficiary' | 'suspicious_pattern';
  severity: 'low' | 'medium' | 'high';
  description: string;
  claimId?: string;
  matchId?: string;
  createdAt: string;
  status: 'open' | 'reviewing' | 'resolved';
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  details: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  [key: string]: string | number;
}
