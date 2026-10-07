import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, User, FileCheck, Upload, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { DocumentUploader } from '@/components/shared/DocumentUploader';
import { matchService, claimService } from '@/services';
import { useApp } from '@/context/AppContext';
import { cn, formatCurrency } from '@/utils/format';
import type { MatchRecord, Claim } from '@/types';

const claimSteps = [
  { number: 1, label: 'Review', icon: User },
  { number: 2, label: 'Verify Identity', icon: FileCheck },
  { number: 3, label: 'Upload Evidence', icon: Upload },
  { number: 4, label: 'Submit', icon: Send },
];

export function NewClaimPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { profile, addClaim, documents } = useApp();
  const matchId = searchParams.get('matchId');
  const [match, setMatch] = useState<MatchRecord | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [draftClaim, setDraftClaim] = useState<Claim | null>(null);
  const [identityVerified, setIdentityVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    matchService.getMatch(matchId!).then((m) => {
      setMatch(m || null);
      if (m) {
        claimService.createClaim(m).then((c) => setDraftClaim(c));
      }
      setLoading(false);
    });
  }, [matchId]);

  const claimDocs = documents.filter((d) => d.claimId === draftClaim?.id);

  const handleVerifyIdentity = async () => {
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIdentityVerified(true);
    setVerifying(false);
  };

  const handleSubmit = async () => {
    if (!draftClaim) return;
    setSubmitting(true);
    const submitted = await claimService.submitClaim(draftClaim);
    addClaim(submitted);
    setSubmitting(false);
    navigate(`/app/claims/${submitted.id}`);
  };

  if (loading) {
    return <div className="animate-shimmer h-96 rounded-xl max-w-3xl mx-auto" />;
  }

  if (!match || !draftClaim) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Match not found.</p>
        <Link to="/app/matches" className="text-primary-600 mt-2 inline-block">Back to matches</Link>
      </div>
    );
  }

  const canProceed = step === 1 || (step === 2 && identityVerified) || (step === 3 && claimDocs.length > 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to={`/app/matches/${match.id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" />
        Back to match
      </Link>

      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Start Your Claim</h1>
        <p className="text-slate-500 mt-1">Claim for {match.benefitType} — {match.institutionName}</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-thin pb-2">
        {claimSteps.map((s, i) => {
          const Icon = s.icon;
          const isComplete = step > s.number;
          const isCurrent = step === s.number;
          return (
            <div key={s.number} className="flex items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0',
                  isComplete ? 'bg-success-500 text-white' : isCurrent ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'
                )}>
                  {isComplete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={cn(
                  'text-sm font-medium hidden sm:block',
                  isCurrent ? 'text-slate-900' : isComplete ? 'text-success-600' : 'text-slate-400'
                )}>
                  {s.label}
                </span>
              </div>
              {i < claimSteps.length - 1 && (
                <div className={cn('w-6 sm:w-12 h-0.5 mx-1', isComplete ? 'bg-success-300' : 'bg-slate-200')} />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === 1 && (
            <Card>
              <CardHeader title="Review Your Information" subtitle="Please confirm your details are correct before proceeding." />
              <CardBody className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><p className="text-xs text-slate-400">Full name</p><p className="text-sm font-medium text-slate-700 mt-0.5">{profile.firstName} {profile.lastName}</p></div>
                  <div><p className="text-xs text-slate-400">Date of birth</p><p className="text-sm font-medium text-slate-700 mt-0.5">{profile.dateOfBirth}</p></div>
                  <div><p className="text-xs text-slate-400">National ID</p><p className="text-sm font-medium text-slate-700 mt-0.5">•••••••{profile.nationalId.slice(-4)}</p></div>
                  <div><p className="text-xs text-slate-400">Phone</p><p className="text-sm font-medium text-slate-700 mt-0.5">{profile.phone}</p></div>
                  <div><p className="text-xs text-slate-400">Email</p><p className="text-sm font-medium text-slate-700 mt-0.5">{profile.email}</p></div>
                  <div><p className="text-xs text-slate-400">Region</p><p className="text-sm font-medium text-slate-700 mt-0.5">{profile.region}</p></div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-2">Employment history</p>
                  {profile.employmentHistory.map((emp) => (
                    <div key={emp.id} className="text-sm text-slate-700 py-1">
                      <span className="font-medium">{emp.employer}</span>
                      <span className="text-slate-400"> — {emp.startDate} to {emp.endDate || 'present'}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400">Benefit being claimed</p>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">{match.benefitType} — {formatCurrency(match.potentialValue)}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{match.institutionName}</p>
                </div>
              </CardBody>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader title="Verify Your Identity" subtitle="We need to confirm your identity before submitting the claim." />
              <CardBody className="space-y-4">
                {!identityVerified ? (
                  <>
                    <Alert tone="info" title="Identity verification">
                      We'll verify your identity using your national ID and personal information. This is a simulated
                      verification for demonstration purposes.
                    </Alert>
                    <div className="bg-slate-50 rounded-xl p-5 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                          <FileCheck className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">National ID: •••••••{profile.nationalId.slice(-4)}</p>
                          <p className="text-xs text-slate-400">Will be verified against records</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{profile.firstName} {profile.lastName}</p>
                          <p className="text-xs text-slate-400">Name will be cross-referenced</p>
                        </div>
                      </div>
                    </div>
                    <Button onClick={handleVerifyIdentity} disabled={verifying} className="w-full" size="lg">
                      {verifying ? 'Verifying...' : 'Verify My Identity'}
                    </Button>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Alert tone="success" title="Identity verified successfully">
                      Your identity has been confirmed. You can proceed to upload supporting evidence.
                    </Alert>
                  </motion.div>
                )}
              </CardBody>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader title="Upload Supporting Evidence" subtitle="Upload documents to support your claim." />
              <CardBody>
                <Alert tone="info" className="mb-4">
                  The following documents may be required: ID document, proof of employment, and any relevant certificates.
                </Alert>
                <DocumentUploader claimId={draftClaim.id} />
                {claimDocs.length > 0 && (
                  <p className="text-sm text-success-600 mt-3 flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    {claimDocs.length} document{claimDocs.length === 1 ? '' : 's'} uploaded
                  </p>
                )}
              </CardBody>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <CardHeader title="Review & Submit" subtitle="Please review your claim before submitting." />
              <CardBody className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between"><span className="text-sm text-slate-500">Claim ID</span><span className="text-sm font-medium text-slate-700">{draftClaim.id}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-slate-500">Beneficiary</span><span className="text-sm font-medium text-slate-700">{profile.firstName} {profile.lastName}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-slate-500">Benefit type</span><span className="text-sm font-medium text-slate-700">{match.benefitType}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-slate-500">Institution</span><span className="text-sm font-medium text-slate-700">{match.institutionName}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-slate-500">Potential value</span><span className="text-sm font-medium text-slate-700">{formatCurrency(match.potentialValue)}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-slate-500">Identity verified</span><span className="text-sm font-medium text-success-600">Yes</span></div>
                  <div className="flex justify-between"><span className="text-sm text-slate-500">Documents</span><span className="text-sm font-medium text-slate-700">{claimDocs.length} uploaded</span></div>
                </div>
                <Alert tone="warning" title="Before you submit">
                  By submitting this claim, you confirm that the information provided is accurate. The institution
                  will review your claim and make the final decision. This process may take several weeks.
                </Alert>
              </CardBody>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between pt-4">
        <Button variant="ghost" onClick={() => step > 1 ? setStep(step - 1) : navigate(`/app/matches/${match.id}`)}>
          <ArrowLeft className="w-4 h-4" />
          {step > 1 ? 'Back' : 'Cancel'}
        </Button>
        {step < 4 ? (
          <Button onClick={() => canProceed && setStep(step + 1)} disabled={!canProceed}>
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting} size="lg">
            {submitting ? 'Submitting...' : 'Submit Claim'}
            <Send className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
