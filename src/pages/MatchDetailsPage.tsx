import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Calendar, MapPin, ArrowRight, Info, Brain } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { MatchStatusBadge, ConfidenceScore, SignalBadge } from '@/components/shared/MatchVisuals';
import { matchService } from '@/services';
import { formatCurrency, formatDate } from '@/utils/format';
import type { MatchRecord } from '@/types';

export function MatchDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<MatchRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    matchService.getMatch(id!).then((m) => {
      setMatch(m || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="animate-shimmer h-96 rounded-xl" />;
  }

  if (!match) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Match not found.</p>
        <Link to="/app/matches" className="text-primary-600 mt-2 inline-block">Back to matches</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/app/matches" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" />
        Back to matches
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <MatchStatusBadge status={match.status} />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-3">{match.benefitType}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-2">
            <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {match.institutionName}</span>
            {match.employmentPeriod && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {match.employmentPeriod}</span>}
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {match.region}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Potential value</p>
          <p className="text-3xl font-bold font-display text-slate-900">{formatCurrency(match.potentialValue)}</p>
        </div>
      </div>

      <Alert tone="warning" title="Matching confidence — not legal entitlement">
        This match was identified based on your identity information. A potential match does not establish
        legal entitlement. Final verification, approval, and payment remain with the institution holding the benefit.
      </Alert>

      <Alert tone="info" title="Simulated match — demonstration data">
        This is a simulated potential match for demonstration purposes. OwaFind does not have access to the
        institution's private member records. All matching signals, values and references shown here are
        demonstration data. Final verification, entitlement and payment remain the responsibility of the
        relevant institution.
      </Alert>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Why this match was identified" subtitle="Breakdown of matching signals" />
            <CardBody>
              <div className="space-y-3">
                {match.signals.map((signal, i) => (
                  <motion.div
                    key={signal.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                  >
                    <span className="text-sm font-medium text-slate-700">{signal.label}</span>
                    <SignalBadge strength={signal.strength} />
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Benefit record details" />
            <CardBody>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Benefit type</p>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">{match.benefitType}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Institution reference</p>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">{match.institutionReference}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Approximate value</p>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">{formatCurrency(match.potentialValue)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Employment period</p>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">{match.employmentPeriod || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Date identified</p>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">{formatDate(match.dateIdentified)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Region</p>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">{match.region}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardBody>
              <p className="text-xs text-slate-400 mb-2">Match confidence</p>
              <ConfidenceScore score={match.confidence} />
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400">Match status</p>
                <div className="mt-1">
                  <MatchStatusBadge status={match.status} />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-primary-50/50 border-primary-100">
            <CardBody>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">AI-Assisted Observation</p>
                  <p className="text-xs text-slate-500 mt-0.5">OwaAssist Demo v1 • 92% confidence</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                "This match shows strong identity alignment across multiple signals. The national ID and date of birth
                match exactly, suggesting a high likelihood of legitimate entitlement."
              </p>
              <Alert tone="info" className="mt-3 text-xs">
                AI output is advisory and does not determine entitlement or approve claims.
              </Alert>
            </CardBody>
          </Card>

          <Button className="w-full" size="lg" onClick={() => navigate(`/app/claims/new?matchId=${match.id}`)}>
            Start Claim
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate('/app/matches')}>
            Back to Matches
          </Button>
        </div>
      </div>
    </div>
  );
}
