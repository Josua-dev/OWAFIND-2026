import type {
  MatchRecord,
  Claim,
  Institution,
  BenefitRecord,
  Notification,
  BeneficiaryProfile,
  RiskAlert,
  AuditEvent,
  FAQ,
  SupportTicket,
} from '@/types';
import { toInstitutionRecords } from './institutions';

// All personal data below is FICTIONAL (demo user only). Institution names are real
// Namibian institutions, but every record, reference, value and claim is simulated
// demonstration data — OwaFind is not integrated with any institution.

export const seedProfile: BeneficiaryProfile = {
  firstName: 'Josua',
  lastName: 'Uuyuni',
  dateOfBirth: '1975-03-14',
  nationalId: '75031402048',
  previousName: '',
  phone: '+264 81 234 5678',
  email: 'josua.uuyuni@example.com',
  region: 'Windhoek',
  employmentHistory: [
    { id: 'emp1', employer: 'NamPower', employeeNumber: 'NP-8842', startDate: '1998-06', endDate: '2012-11' },
    { id: 'emp2', employer: 'TransNamib', employeeNumber: 'TN-2105', startDate: '2013-03', endDate: '2019-08' },
  ],
  consentGiven: false,
  consentDate: null,
  profileCompletion: 65,
  verificationStatus: 'verified',
};

// Derived from the real-Namibian-institution registry. All metrics are simulated
// demonstration figures, not actual statistics from these institutions.
export const seedInstitutions: Institution[] = toInstitutionRecords();

export const seedBenefitRecords: BenefitRecord[] = [
  { id: 'br1', type: 'Retirement Fund', institutionId: 'gipf', institutionName: 'Government Institutions Pension Fund (GIPF)', reference: 'GIPF-2012-8842', approximateValue: 48750, region: 'Windhoek', status: 'dormant' },
  { id: 'br2', type: 'Pension', institutionId: 'namcor-pension', institutionName: 'Namcor Pension Fund', reference: 'NPF-98-2105', approximateValue: 125000, region: 'Windhoek', status: 'unclaimed' },
  { id: 'br3', type: 'Life Insurance', institutionId: 'sanlam-namibia', institutionName: 'Sanlam Namibia', reference: 'SAN-POL-44821', approximateValue: 85000, region: 'Windhoek', status: 'active' },
  { id: 'br4', type: 'Funeral Benefit', institutionId: 'old-mutual-namibia', institutionName: 'Old Mutual Namibia', reference: 'OM-2009-1142', approximateValue: 15000, region: 'Windhoek', status: 'dormant' },
  { id: 'br5', type: 'Employee Benefit', institutionId: 'transnamib-retirement', institutionName: 'TransNamib Retirement Fund', reference: 'TNR-2018-3392', approximateValue: 22000, region: 'Windhoek', status: 'unclaimed' },
  { id: 'br6', type: 'Death Benefit', institutionId: 'sanlam-namibia', institutionName: 'Sanlam Namibia', reference: 'SN-DB-77021', approximateValue: 65000, region: 'Windhoek', status: 'dormant' },
  { id: 'br7', type: 'Pension', institutionId: 'nampower-provident', institutionName: 'Nampower Provident Fund', reference: 'NPOW-2007-4412', approximateValue: 39000, region: 'Windhoek', status: 'unclaimed' },
  { id: 'br8', type: 'Retirement Fund', institutionId: 'rossing-pension', institutionName: 'Rossing Pension Fund', reference: 'RP-2014-8821', approximateValue: 54000, region: 'Arandis', status: 'dormant' },
];

export const seedMatches: MatchRecord[] = [
  {
    id: 'match1',
    beneficiaryId: 'ben1',
    beneficiaryName: 'Josua Uuyuni',
    benefitType: 'Retirement Fund',
    institutionId: 'gipf',
    institutionName: 'Government Institutions Pension Fund (GIPF)',
    institutionReference: 'GIPF-2012-8842',
    potentialValue: 48750,
    confidence: 94,
    status: 'green',
    signals: [
      { label: 'Name', strength: 'strong' },
      { label: 'Date of Birth', strength: 'exact' },
      { label: 'National ID', strength: 'exact' },
      { label: 'Employment History', strength: 'strong' },
      { label: 'Previous Name', strength: 'partial' },
    ],
    employmentPeriod: '1998–2012',
    dateIdentified: '2026-09-28T10:15:00Z',
    region: 'Windhoek',
  },
  {
    id: 'match2',
    beneficiaryId: 'ben1',
    beneficiaryName: 'Josua Uuyuni',
    benefitType: 'Pension',
    institutionId: 'namcor-pension',
    institutionName: 'Namcor Pension Fund',
    institutionReference: 'NPF-98-2105',
    potentialValue: 125000,
    confidence: 78,
    status: 'amber',
    signals: [
      { label: 'Name', strength: 'strong' },
      { label: 'Date of Birth', strength: 'exact' },
      { label: 'National ID', strength: 'partial' },
      { label: 'Employment History', strength: 'strong' },
    ],
    employmentPeriod: '2013–2019',
    dateIdentified: '2026-09-28T10:16:00Z',
    region: 'Windhoek',
  },
  {
    id: 'match3',
    beneficiaryId: 'ben1',
    beneficiaryName: 'Josua Uuyuni',
    benefitType: 'Funeral Benefit',
    institutionId: 'old-mutual-namibia',
    institutionName: 'Old Mutual Namibia',
    institutionReference: 'OM-2009-1142',
    potentialValue: 15000,
    confidence: 42,
    status: 'red',
    signals: [
      { label: 'Name', strength: 'partial' },
      { label: 'Date of Birth', strength: 'strong' },
      { label: 'National ID', strength: 'none' },
      { label: 'Employment History', strength: 'weak' },
    ],
    employmentPeriod: '2005–2008',
    dateIdentified: '2026-09-28T10:17:00Z',
    region: 'Windhoek',
  },
];

export const seedClaims: Claim[] = [
  {
    id: 'OWF-2026-00482',
    matchId: 'match1',
    beneficiaryId: 'ben1',
    beneficiaryName: 'Josua Uuyuni',
    benefitType: 'Retirement Fund',
    institutionName: 'Government Institutions Pension Fund (GIPF)',
    state: 'EVIDENCE_REVIEW',
    potentialValue: 48750,
    submittedAt: '2026-09-29T08:30:00Z',
    updatedAt: '2026-10-02T14:22:00Z',
    documents: [
      { id: 'doc1', name: 'National_ID_Front.pdf', type: 'ID Document', size: 245000, uploadStatus: 'verified', uploadedAt: '2026-09-29T08:35:00Z', verificationStatus: 'verified' },
      { id: 'doc2', name: 'NamPower_Employment_Letter.pdf', type: 'Proof of Employment', size: 189000, uploadStatus: 'verified', uploadedAt: '2026-09-29T08:36:00Z', verificationStatus: 'verified' },
      { id: 'doc3', name: 'Bank_Statement.pdf', type: 'Other Supporting Evidence', size: 512000, uploadStatus: 'needs_review', uploadedAt: '2026-10-01T11:00:00Z', verificationStatus: 'needs_review' },
    ],
    timeline: [
      { id: 't1', timestamp: '2026-09-29T08:30:00Z', label: 'Claim Submitted', description: 'Your claim was submitted to Government Institutions Pension Fund (GIPF).', completed: true, current: false },
      { id: 't2', timestamp: '2026-09-29T12:15:00Z', label: 'Identity Verification', description: 'Your identity was verified successfully.', completed: true, current: false },
      { id: 't3', timestamp: '2026-10-02T14:22:00Z', label: 'Evidence Review', description: 'Your submitted documents are currently being reviewed.', completed: false, current: true },
      { id: 't4', timestamp: '', label: 'Institution Review', description: 'Government Institutions Pension Fund (GIPF) will review your claim.', completed: false, current: false },
      { id: 't5', timestamp: '', label: 'Resolution', description: 'The institution will communicate the final decision.', completed: false, current: false },
    ],
  },
];

export const seedNotifications: Notification[] = [
  { id: 'n1', title: 'Potential benefit identified', message: 'A potential retirement fund benefit of N$ 48,750 was found with Government Institutions Pension Fund (GIPF).', type: 'match', read: false, createdAt: '2026-09-28T10:17:00Z', link: '/app/matches' },
  { id: 'n2', title: 'Document required', message: 'Additional evidence is required for your claim OWF-2026-00482.', type: 'document', read: false, createdAt: '2026-10-02T14:22:00Z', link: '/app/claims/OWF-2026-00482' },
  { id: 'n3', title: 'Claim update', message: 'Your claim has moved to Evidence Review stage.', type: 'claim', read: true, createdAt: '2026-10-02T14:25:00Z', link: '/app/claims/OWF-2026-00482' },
  { id: 'n4', title: 'Welcome to OwaFind', message: 'Your account has been set up. Complete your profile to improve match accuracy.', type: 'system', read: true, createdAt: '2026-09-27T09:00:00Z' },
];

export const seedRiskAlerts: RiskAlert[] = [
  { id: 'ra1', type: 'duplicate_identity', severity: 'medium', description: 'Two claims reference the same national ID but different names. Requires human review.', claimId: 'OWF-2026-00482', createdAt: '2026-10-01T15:30:00Z', status: 'open' },
  { id: 'ra2', type: 'reused_document', severity: 'high', description: 'Document uploaded for claim OWF-2026-00517 was previously used in a different claim.', claimId: 'OWF-2026-00517', createdAt: '2026-10-02T09:14:00Z', status: 'reviewing' },
  { id: 'ra3', type: 'multiple_beneficiary', severity: 'low', description: 'Beneficiary linked to three different benefit records across institutions.', matchId: 'match2', createdAt: '2026-09-30T11:20:00Z', status: 'open' },
  { id: 'ra4', type: 'suspicious_pattern', severity: 'medium', description: 'Rapid sequential claims from same device fingerprint within 24 hours.', createdAt: '2026-10-03T16:45:00Z', status: 'open' },
];

export const seedAuditEvents: AuditEvent[] = [
  { id: 'ae1', timestamp: '2026-10-03T10:42:00Z', actor: 'Claims Officer (Demo)', action: 'Reviewed claim', target: 'OWF-2026-00482', details: 'Moved claim from Identity Review to Evidence Review' },
  { id: 'ae2', timestamp: '2026-10-03T10:37:00Z', actor: 'Josua Uuyuni', action: 'Uploaded document', target: 'OWF-2026-00482', details: 'Bank_Statement.pdf uploaded' },
  { id: 'ae3', timestamp: '2026-10-03T10:12:00Z', actor: 'System', action: 'Identity verification completed', target: 'OWF-2026-00482', details: 'Automated identity check passed' },
  { id: 'ae4', timestamp: '2026-10-02T14:22:00Z', actor: 'System', action: 'State transition', target: 'OWF-2026-00482', details: 'IDENTITY_REVIEW → EVIDENCE_REVIEW' },
  { id: 'ae5', timestamp: '2026-10-01T11:00:00Z', actor: 'Josua Uuyuni', action: 'Uploaded document', target: 'OWF-2026-00482', details: 'Bank_Statement.pdf needs review' },
  { id: 'ae6', timestamp: '2026-09-29T08:30:00Z', actor: 'Josua Uuyuni', action: 'Submitted claim', target: 'OWF-2026-00482', details: 'Claim created for Retirement Fund benefit' },
];

export const seedFAQs: FAQ[] = [
  { id: 'faq1', question: 'What is OwaFind?', answer: 'OwaFind is a platform that helps you discover financial benefits that may belong to you — such as pension benefits, retirement funds, life insurance, funeral benefits, and more. We identify potential matches and guide you through the claims process.', category: 'General' },
  { id: 'faq2', question: 'Does OwaFind hold my money?', answer: 'No. OwaFind does not hold customer funds. We help you discover potential benefits and connect you with the institution that holds the benefit. The institution remains responsible for verification, approval, and payment.', category: 'General' },
  { id: 'faq3', question: 'What does a potential match mean?', answer: 'A potential match means our system has identified a benefit record that may belong to you based on your identity information. It does NOT mean you are legally entitled to the benefit. Final verification is done by the holding institution.', category: 'Matching' },
  { id: 'faq4', question: 'How accurate is the matching?', answer: 'Our matching system uses multiple signals — name, date of birth, national ID, and employment history — to assess confidence. Higher confidence scores indicate stronger matches, but all matches require institution verification.', category: 'Matching' },
  { id: 'faq5', question: 'What documents do I need to claim?', answer: 'Typically you will need your ID document, proof of employment, and any relevant certificates (marriage, death, beneficiary). The specific documents depend on the benefit type and will be listed during the claim process.', category: 'Claims' },
  { id: 'faq6', question: 'How long does a claim take?', answer: 'Claim resolution times vary by institution and benefit type. On average, institutions resolve claims within 10–21 days. You can track your claim status in real time through your dashboard.', category: 'Claims' },
  { id: 'faq7', question: 'Is my information safe?', answer: 'OwaFind protects sensitive information. Your data is encrypted and used only for matching and claims purposes. We do not share your information with third parties without your consent.', category: 'Privacy' },
  { id: 'faq8', question: 'Can I withdraw consent?', answer: 'Yes. You can withdraw consent at any time from your Settings page under Privacy. Withdrawing consent will pause ongoing searches but will not affect claims already submitted.', category: 'Privacy' },
  { id: 'faq9', question: 'What if my claim is rejected?', answer: 'If your claim is rejected, the institution will provide a reason. You may be able to submit an appeal or provide additional information. Check your claim tracking page for details.', category: 'Claims' },
  { id: 'faq10', question: 'Does OwaFind charge fees?', answer: 'OwaFind is a free service for beneficiaries. There are no charges for searching, matching, or submitting claims.', category: 'General' },
];

export const seedSupportTickets: SupportTicket[] = [
  { id: 'OWF-4821', subject: 'Question about document requirements', category: 'Claims', status: 'open', createdAt: '2026-10-01T09:00:00Z', updatedAt: '2026-10-01T09:30:00Z', messages: [
    { author: 'Josua Uuyuni', message: 'I am not sure which documents I need for my retirement fund claim. Can you help?', timestamp: '2026-10-01T09:00:00Z' },
    { author: 'OwaFind Support', message: 'For a retirement fund claim, you typically need your ID document, proof of employment, and any relevant employment letters. I can see you have already uploaded your ID and employment letter — you are on the right track!', timestamp: '2026-10-01T09:30:00Z' },
  ]},
];
