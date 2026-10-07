import { delay } from '@/utils/format';
import {
  seedMatches,
  seedClaims,
  seedBenefitRecords,
  seedInstitutions,
  seedNotifications,
  seedProfile,
  seedRiskAlerts,
  seedAuditEvents,
  seedFAQs,
  seedSupportTickets,
} from '@/data/seed';
import { institutionRegistry, getMatchQueueFor, getClaimsQueueFor } from '@/data/institutions';
import type {
  MatchRecord,
  Claim,
  Notification,
  BeneficiaryProfile,
  Institution,
  RiskAlert,
  AuditEvent,
  FAQ,
  SupportTicket,
  UploadedDocument,
  ClaimState,
} from '@/types';

const apiDelay = 600;

export const benefitService = {
  async loadBenefits() {
    await delay(apiDelay);
    return [...seedBenefitRecords];
  },
  async searchBenefits(profile: BeneficiaryProfile) {
    await delay(2800);
    return seedMatches.filter((m) => m.beneficiaryId === 'ben1');
  },
};

export const matchService = {
  async getMatches(): Promise<MatchRecord[]> {
    await delay(apiDelay);
    return [...seedMatches];
  },
  async getMatch(id: string): Promise<MatchRecord | undefined> {
    await delay(400);
    return seedMatches.find((m) => m.id === id);
  },
  async getInstitutionMatches(instId: string = 'gipf') {
    await delay(apiDelay);
    return getMatchQueueFor(instId);
  },
};

export const claimService = {
  async getClaims(): Promise<Claim[]> {
    await delay(apiDelay);
    return [...seedClaims];
  },
  async getClaim(id: string): Promise<Claim | undefined> {
    await delay(400);
    return seedClaims.find((c) => c.id === id);
  },
  async createClaim(match: MatchRecord): Promise<Claim> {
    await delay(apiDelay);
    const claim: Claim = {
      id: `OWF-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      matchId: match.id,
      beneficiaryId: match.beneficiaryId,
      beneficiaryName: match.beneficiaryName,
      benefitType: match.benefitType,
      institutionName: match.institutionName,
      state: 'DRAFT',
      potentialValue: match.potentialValue,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: [],
      timeline: [
        { id: 't1', timestamp: '', label: 'Claim Drafted', description: 'Claim has been created but not yet submitted.', completed: false, current: true },
        { id: 't2', timestamp: '', label: 'Claim Submitted', description: 'Claim will be submitted to the institution.', completed: false, current: false },
        { id: 't3', timestamp: '', label: 'Identity Verification', description: 'Your identity will be verified.', completed: false, current: false },
        { id: 't4', timestamp: '', label: 'Evidence Review', description: 'Your documents will be reviewed.', completed: false, current: false },
        { id: 't5', timestamp: '', label: 'Institution Review', description: 'The institution will review your claim.', completed: false, current: false },
        { id: 't6', timestamp: '', label: 'Resolution', description: 'Final decision will be communicated.', completed: false, current: false },
      ],
    };
    return claim;
  },
  async submitClaim(claim: Claim): Promise<Claim> {
    await delay(apiDelay);
    return {
      ...claim,
      state: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: claim.timeline.map((t) =>
        t.label === 'Claim Drafted'
          ? { ...t, completed: true, current: false, timestamp: new Date().toISOString() }
          : t.label === 'Claim Submitted'
          ? { ...t, completed: true, current: true, timestamp: new Date().toISOString() }
          : t
      ),
    };
  },
  async updateClaimStatus(claimId: string, newState: ClaimState): Promise<void> {
    await delay(400);
  },
  async getInstitutionClaims(instId: string = 'gipf') {
    await delay(apiDelay);
    return getClaimsQueueFor(instId);
  },
  getValidTransitions(current: ClaimState): ClaimState[] {
    const transitions: Record<ClaimState, ClaimState[]> = {
      DRAFT: ['SUBMITTED'],
      SUBMITTED: ['IDENTITY_REVIEW'],
      IDENTITY_REVIEW: ['EVIDENCE_REVIEW', 'MORE_INFORMATION_REQUIRED', 'REJECTED'],
      EVIDENCE_REVIEW: ['INSTITUTION_REVIEW', 'MORE_INFORMATION_REQUIRED', 'REJECTED'],
      INSTITUTION_REVIEW: ['APPROVED', 'REJECTED', 'MORE_INFORMATION_REQUIRED'],
      MORE_INFORMATION_REQUIRED: ['RESUBMITTED', 'REJECTED'],
      RESUBMITTED: ['EVIDENCE_REVIEW'],
      APPROVED: ['CLOSED'],
      REJECTED: ['APPEAL', 'CLOSED'],
      APPEAL: ['INSTITUTION_REVIEW', 'CLOSED'],
      CLOSED: [],
    };
    return transitions[current] || [];
  },
};

export const documentService = {
  async uploadDocument(file: File, type: UploadedDocument['type']): Promise<UploadedDocument> {
    await delay(1200);
    const doc: UploadedDocument = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type,
      size: file.size,
      uploadStatus: 'scanning',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'pending',
    };
    return doc;
  },
  async verifyDocument(doc: UploadedDocument): Promise<UploadedDocument> {
    await delay(800);
    const passed = Math.random() > 0.25;
    return {
      ...doc,
      uploadStatus: passed ? 'verified' : 'needs_review',
      verificationStatus: passed ? 'verified' : 'needs_review',
    };
  },
  async removeDocument(docId: string): Promise<void> {
    await delay(200);
  },
};

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    await delay(apiDelay);
    return [...seedNotifications];
  },
  async markAsRead(id: string): Promise<void> {
    await delay(200);
  },
  async markAllAsRead(): Promise<void> {
    await delay(200);
  },
};

export const institutionService = {
  async getInstitutions(): Promise<Institution[]> {
    await delay(apiDelay);
    return [...seedInstitutions];
  },
};

export const analyticsService = {
  async getInstitutionStats() {
    await delay(apiDelay);
    return {
      potentialMatches: 1248,
      claims: 326,
      pendingReview: 84,
      resolved: 193,
      avgResolutionDays: 14.2,
    };
  },
  async getRegulatorStats() {
    await delay(apiDelay);
    return {
      totalBenefits: 48_600_000,
      potentialMatches: 8421,
      verifiedMatches: 3284,
      claims: 1942,
      resolved: 1205,
      avgResolutionDays: 21,
    };
  },
  async getExecutiveStats() {
    await delay(apiDelay);
    return {
      totalBenefits: 127_500_000,
      potentialMatches: 18420,
      verifiedMatches: 7280,
      openClaims: 3421,
      resolvedClaims: 5890,
      potentialRecoveryValue: 89_200_000,
      avgResolutionTime: 16.8,
      activeInstitutions: institutionRegistry.length,
    };
  },
  async getBenefitCategoryData() {
    await delay(400);
    return [
      { label: 'Pension', value: 2840, claims: 612 },
      { label: 'Retirement Fund', value: 3120, claims: 748 },
      { label: 'Life Insurance', value: 1980, claims: 384 },
      { label: 'Funeral Benefit', value: 720, claims: 168 },
      { label: 'Employee Benefit', value: 1240, claims: 286 },
      { label: 'Death Benefit', value: 1520, claims: 342 },
    ];
  },
  async getInstitutionActivityData() {
    await delay(400);
    return institutionRegistry.map((i) => ({
      label: i.short,
      matches: i.metrics.matches,
      claims: i.metrics.claims,
      resolved: i.metrics.resolved,
    }));
  },
  async getClaimVolumeData() {
    await delay(400);
    return [
      { label: 'May', value: 284 },
      { label: 'Jun', value: 312 },
      { label: 'Jul', value: 389 },
      { label: 'Aug', value: 421 },
      { label: 'Sep', value: 532 },
      { label: 'Oct', value: 612 },
    ];
  },
  async getResolutionTrendData() {
    await delay(400);
    return [
      { label: 'May', resolved: 180, avgDays: 24 },
      { label: 'Jun', resolved: 210, avgDays: 22 },
      { label: 'Jul', resolved: 268, avgDays: 19 },
      { label: 'Aug', resolved: 310, avgDays: 18 },
      { label: 'Sep', resolved: 420, avgDays: 16 },
      { label: 'Oct', resolved: 502, avgDays: 14 },
    ];
  },
  async getRegionalData() {
    await delay(400);
    return [
      { label: 'Windhoek', value: 3840 },
      { label: 'Swakopmund', value: 1280 },
      { label: 'Walvis Bay', value: 1120 },
      { label: 'Oshakati', value: 890 },
      { label: 'Rundu', value: 670 },
      { label: 'Keetmanshoop', value: 420 },
      { label: 'Otjiwarongo', value: 380 },
    ];
  },
  async getExecutiveTrendData() {
    await delay(400);
    return [
      { label: 'Q1', matches: 3200, verified: 1180, claims: 820 },
      { label: 'Q2', matches: 4100, verified: 1620, claims: 1080 },
      { label: 'Q3', matches: 5200, verified: 2180, claims: 1420 },
      { label: 'Q4', matches: 5920, verified: 2300, claims: 1602 },
    ];
  },
};

export const profileService = {
  async getProfile(): Promise<BeneficiaryProfile> {
    await delay(apiDelay);
    return { ...seedProfile };
  },
  async updateProfile(profile: BeneficiaryProfile): Promise<BeneficiaryProfile> {
    await delay(apiDelay);
    return { ...profile };
  },
};

export const riskService = {
  async getRiskAlerts(): Promise<RiskAlert[]> {
    await delay(apiDelay);
    return [...seedRiskAlerts];
  },
};

export const auditService = {
  async getAuditEvents(): Promise<AuditEvent[]> {
    await delay(apiDelay);
    return [...seedAuditEvents];
  },
};

export const supportService = {
  async getFAQs(): Promise<FAQ[]> {
    await delay(400);
    return [...seedFAQs];
  },
  async getTickets(): Promise<SupportTicket[]> {
    await delay(apiDelay);
    return [...seedSupportTickets];
  },
  async createTicket(subject: string, category: string, message: string): Promise<SupportTicket> {
    await delay(apiDelay);
    const ticket: SupportTicket = {
      id: `OWF-${Math.floor(Math.random() * 9000) + 1000}`,
      subject,
      category,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        { author: 'You', message, timestamp: new Date().toISOString() },
      ],
    };
    return ticket;
  },
};
