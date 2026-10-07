import type { Institution } from '@/types';

// Real Namibian institutions (publicly known entities — retirement/pension funds and
// insurers operating in Namibia). Every metric below is a PROTOTYPE-GENERATED
// DEMONSTRATION FIGURE, not data from the institution itself.
export interface InstitutionRegistryEntry {
  id: string;
  name: string;
  short: string;
  type: 'Pension Fund' | 'Insurer';
  region: string;
  metrics: { matches: number; claims: number; pendingReview: number; resolved: number; avgResolutionDays: number };
}

export const institutionRegistry: InstitutionRegistryEntry[] = [
  { id: 'gipf', name: 'Government Institutions Pension Fund (GIPF)', short: 'GIPF', type: 'Pension Fund', region: 'Windhoek', metrics: { matches: 1842, claims: 428, pendingReview: 96, resolved: 312, avgResolutionDays: 18.4 } },
  { id: 'namcor-pension', name: 'Namcor Pension Fund', short: 'Namcor', type: 'Pension Fund', region: 'Windhoek', metrics: { matches: 286, claims: 74, pendingReview: 18, resolved: 52, avgResolutionDays: 16.8 } },
  { id: 'nampower-provident', name: 'Nampower Provident Fund', short: 'Nampower', type: 'Pension Fund', region: 'Windhoek', metrics: { matches: 391, claims: 96, pendingReview: 24, resolved: 61, avgResolutionDays: 20.1 } },
  { id: 'namwater-retirement', name: 'Namwater Retirement Fund', short: 'Namwater', type: 'Pension Fund', region: 'Windhoek', metrics: { matches: 214, claims: 51, pendingReview: 12, resolved: 34, avgResolutionDays: 19.2 } },
  { id: 'nbc-retirement', name: 'NBC Retirement Fund', short: 'NBC', type: 'Pension Fund', region: 'Windhoek', metrics: { matches: 168, claims: 42, pendingReview: 9, resolved: 26, avgResolutionDays: 14.6 } },
  { id: 'rossing-pension', name: 'Rossing Pension Fund', short: 'Rossing', type: 'Pension Fund', region: 'Arandis', metrics: { matches: 152, claims: 38, pendingReview: 8, resolved: 24, avgResolutionDays: 12.9 } },
  { id: 'namport-retirement', name: 'Namport Retirement Fund', short: 'Namport', type: 'Pension Fund', region: 'Walvis Bay', metrics: { matches: 134, claims: 33, pendingReview: 7, resolved: 21, avgResolutionDays: 15.7 } },
  { id: 'bon-provident', name: 'Bank of Namibia Provident Fund', short: 'BoN', type: 'Pension Fund', region: 'Windhoek', metrics: { matches: 98, claims: 26, pendingReview: 5, resolved: 16, avgResolutionDays: 11.3 } },
  { id: 'mtc-pension', name: 'MTC Pension Fund', short: 'MTC', type: 'Pension Fund', region: 'Windhoek', metrics: { matches: 187, claims: 47, pendingReview: 11, resolved: 29, avgResolutionDays: 13.8 } },
  { id: 'standard-bank-pension', name: 'Standard Bank Namibia Pension Fund', short: 'Std Bank', type: 'Pension Fund', region: 'Windhoek', metrics: { matches: 176, claims: 44, pendingReview: 10, resolved: 27, avgResolutionDays: 12.2 } },
  { id: 'namib-mills-pension', name: 'Namib Mills Pension Fund', short: 'Nam Mills', type: 'Pension Fund', region: 'Windhoek', metrics: { matches: 76, claims: 19, pendingReview: 4, resolved: 11, avgResolutionDays: 17.5 } },
  { id: 'transnamib-retirement', name: 'TransNamib Retirement Fund', short: 'TransNamib', type: 'Pension Fund', region: 'Windhoek', metrics: { matches: 163, claims: 41, pendingReview: 9, resolved: 25, avgResolutionDays: 16.1 } },
  { id: 'capricorn-retirement', name: 'Capricorn Group Retirement Fund', short: 'Capricorn', type: 'Pension Fund', region: 'Windhoek', metrics: { matches: 158, claims: 39, pendingReview: 9, resolved: 24, avgResolutionDays: 13.4 } },
  { id: 'pupkewitz-pension', name: 'Pupkewitz Group Pension Fund', short: 'Pupkewitz', type: 'Pension Fund', region: 'Windhoek', metrics: { matches: 112, claims: 28, pendingReview: 6, resolved: 17, avgResolutionDays: 15.2 } },
  { id: 'nbw-pension', name: "Namibia Building Workers' Pension Fund", short: 'NBW', type: 'Pension Fund', region: 'Windhoek', metrics: { matches: 87, claims: 22, pendingReview: 4, resolved: 13, avgResolutionDays: 18.9 } },
  { id: 'universities-retirement', name: 'Universities Retirement Fund', short: 'Universities', type: 'Pension Fund', region: 'Windhoek', metrics: { matches: 141, claims: 35, pendingReview: 8, resolved: 22, avgResolutionDays: 14.8 } },
  { id: 'nhe-retirement', name: 'NHE Retirement Fund', short: 'NHE', type: 'Pension Fund', region: 'Windhoek', metrics: { matches: 129, claims: 34, pendingReview: 7, resolved: 19, avgResolutionDays: 17.2 } },
  { id: 'sanlam-namibia', name: 'Sanlam Namibia', short: 'Sanlam', type: 'Insurer', region: 'Windhoek', metrics: { matches: 298, claims: 72, pendingReview: 19, resolved: 41, avgResolutionDays: 10.2 } },
  { id: 'old-mutual-namibia', name: 'Old Mutual Namibia', short: 'Old Mutual', type: 'Insurer', region: 'Windhoek', metrics: { matches: 284, claims: 68, pendingReview: 17, resolved: 39, avgResolutionDays: 10.9 } },
];

export const DEFAULT_INSTITUTION_ID = 'gipf';

export function getInstitutionById(id: string): InstitutionRegistryEntry | undefined {
  return institutionRegistry.find((i) => i.id === id);
}

export function getActiveInstitution(id: string): InstitutionRegistryEntry {
  return getInstitutionById(id) || institutionRegistry[0];
}

export const SIMULATED_MATCH_DISCLAIMER =
  'This is a simulated potential match for demonstration purposes. OwaFind does not have access to ' +
  "the institution's private member records. Final verification, entitlement and payment remain the " +
  'responsibility of the relevant institution.';

// ---- Deterministic per-institution demo data generators ----
// Figures are simulated demonstration data, stable per institution, and change
// immediately when the presenter selects a different institution.

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fictional people — no real personal data.
const FICTIONAL_BENEFICIARIES = [
  'Josua Uuyuni', 'Pendukeni Hamukwaya', 'Gideon Nepembe', 'Linea Shilongo',
  'Kornelius Shipepe', 'Victoria Amukwaya', 'Fanuel Tjirera', 'Selma Amutenya',
  'Barney Haufiku', 'Ndeshi Andreas', 'Mateus Sheya', 'Frieda Namwandi',
  'Kauna Shikwambi', 'Ester Nangolo', 'Johannes Gawanas', 'Rosalia Muvangua',
  'Petrus Ndjarakana', 'Magrieta Hoveka', 'Immanuel Tjipuka', 'Lukas Mutinga',
];

const BENEFIT_TYPES = ['Pension', 'Retirement Fund', 'Life Insurance', 'Funeral Benefit', 'Employee Benefit', 'Death Benefit'];
const MATCH_STATUSES = ['Pending Review', 'Pending Review', 'Verified', 'Information Requested', 'Pending Review', 'Unmatched', 'Verified', 'Pending Review'];
const CLAIM_STATUSES = ['SUBMITTED', 'IDENTITY_REVIEW', 'EVIDENCE_REVIEW', 'INSTITUTION_REVIEW', 'APPROVED', 'MORE_INFORMATION_REQUIRED', 'APPEAL', 'CLOSED'];

export interface InstitutionMatchQueueRow {
  id: string;
  beneficiary: string;
  benefitType: string;
  confidence: number;
  signals: number;
  status: string;
  date: string;
}

export interface InstitutionClaimQueueRow {
  id: string;
  beneficiary: string;
  benefitType: string;
  institution: string;
  status: string;
  value: number;
  date: string;
}

function dateNDaysAgo(days: number): string {
  const d = new Date('2026-09-30T12:00:00Z');
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

export function getMatchQueueFor(instId: string): InstitutionMatchQueueRow[] {
  const rng = mulberry32(hashString(instId + ':match-queue'));
  const count = 8 + Math.floor(rng() * 5);
  const base = 12 + Math.floor(rng() * 40);
  return Array.from({ length: count }, (_, idx) => ({
    id: `MQ-2026-${String(base - idx).padStart(4, '0')}`,
    beneficiary: FICTIONAL_BENEFICIARIES[Math.floor(rng() * FICTIONAL_BENEFICIARIES.length)],
    benefitType: BENEFIT_TYPES[Math.floor(rng() * BENEFIT_TYPES.length)],
    confidence: 35 + Math.floor(rng() * 61),
    signals: 2 + Math.floor(rng() * 4),
    status: MATCH_STATUSES[Math.floor(rng() * MATCH_STATUSES.length)],
    date: dateNDaysAgo(idx + Math.floor(rng() * 3)),
  }));
}

export function getClaimsQueueFor(instId: string): InstitutionClaimQueueRow[] {
  const inst = getActiveInstitution(instId);
  const rng = mulberry32(hashString(instId + ':claims-queue'));
  const count = 7 + Math.floor(rng() * 5);
  const base = 480 + Math.floor(rng() * 60);
  return Array.from({ length: count }, (_, idx) => ({
    id: `OWF-2026-${String(base - idx).padStart(5, '0')}`,
    beneficiary: FICTIONAL_BENEFICIARIES[Math.floor(rng() * FICTIONAL_BENEFICIARIES.length)],
    benefitType: BENEFIT_TYPES[Math.floor(rng() * BENEFIT_TYPES.length)],
    institution: inst.name,
    status: CLAIM_STATUSES[Math.floor(rng() * CLAIM_STATUSES.length)],
    value: Math.round((15000 + rng() * 90000) / 500) * 500,
    date: dateNDaysAgo(idx + Math.floor(rng() * 3)),
  }));
}

const CATEGORY_BASE = [
  { label: 'Pension', value: 2840 },
  { label: 'Retirement Fund', value: 3120 },
  { label: 'Life Insurance', value: 1980 },
  { label: 'Funeral Benefit', value: 720 },
  { label: 'Employee Benefit', value: 1240 },
  { label: 'Death Benefit', value: 1520 },
];

export function getCategoryDataFor(instId: string) {
  const inst = getActiveInstitution(instId);
  const total = institutionRegistry.reduce((sum, i) => sum + i.metrics.matches, 0);
  const share = inst.metrics.matches / total;
  const rng = mulberry32(hashString(instId + ':categories'));
  return CATEGORY_BASE.map((c) => {
    const value = Math.max(10, Math.round((c.value * share * (0.85 + rng() * 0.3)) / 10) * 10);
    return { label: c.label, value, claims: Math.round(value * 0.22) };
  });
}

const MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const VOLUME_BASE = [284, 312, 389, 421, 532, 612];

export function getVolumeDataFor(instId: string) {
  const inst = getActiveInstitution(instId);
  const total = institutionRegistry.reduce((sum, i) => sum + i.metrics.matches, 0);
  const share = inst.metrics.matches / total;
  const rng = mulberry32(hashString(instId + ':volume'));
  return MONTHS.map((label, i) => ({
    label,
    value: Math.max(4, Math.round(VOLUME_BASE[i] * share * (0.85 + rng() * 0.3) * 2)),
  }));
}

// Derive the plain Institution records used by the rest of the app (regulator
// tables, global search) from the registry.
export function toInstitutionRecords(): Institution[] {
  return institutionRegistry.map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    region: r.region,
    matches: r.metrics.matches,
    claims: r.metrics.claims,
    pendingReview: r.metrics.pendingReview,
    resolved: r.metrics.resolved,
    avgResolutionDays: r.metrics.avgResolutionDays,
    demo: true,
  }));
}
