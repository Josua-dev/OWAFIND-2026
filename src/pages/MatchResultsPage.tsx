import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, ArrowRight, Building2, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { MatchStatusBadge, ConfidenceScore, SignalBadge } from '@/components/shared/MatchVisuals';
import { matchService } from '@/services';
import { formatCurrency, formatDate } from '@/utils/format';
import type { MatchRecord } from '@/types';
import { useApp } from '@/context/AppContext';

export function MatchResultsPage() {
  const navigate = useNavigate();
  const { profile } = useApp();
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    matchService.getMatches().then((m) => {
      setMatches(m);
      setLoading(false);
    });
  }, []);

  const totalValue = matches.reduce((sum, m) => sum + m.potentialValue, 0);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-shimmer h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">Potential Matches</h1>
        <p className="text-slate-500 mt-1">
          {profile.firstName}, we found {matches.length} potential {matches.length === 1 ? 'benefit' : 'benefits'} that may belong to you.
        </p>
      </div>

      <Alert tone="warning" title="Important">
        A potential match does not mean that you are legally entitled to the benefit. Final verification and payment
        remain the responsibility of the institution holding the benefit.
      </Alert>

      <Alert tone="info" title="Simulated results">
        These are simulated potential matches for demonstration purposes. OwaFind does not have access to any
        institution's private member records, and the institutions named here are not integrated with OwaFind.
      </Alert>

      <Card className="p-5 bg-gradient-to-br from-primary-50 to-white border-primary-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Total potential value identified</p>
            <p className="text-3xl font-bold font-display text-primary-700 mt-1">{formatCurrency(totalValue)}</p>
            <p className="text-xs text-slate-400 mt-1">Across {matches.length} potential {matches.length === 1 ? 'match' : 'matches'} • Demo data</p>
          </div>
          <div className="flex gap-3">
            {matches.filter((m) => m.status === 'green').length > 0 && (
              <div className="text-center">
                <p className="text-2xl font-bold text-success-600">{matches.filter((m) => m.status === 'green').length}</p>
                <p className="text-xs text-slate-500">Strong</p>
              </div>
            )}
            {matches.filter((m) => m.status === 'amber').length > 0 && (
              <div className="text-center">
                <p className="text-2xl font-bold text-warning-600">{matches.filter((m) => m.status === 'amber').length}</p>
                <p className="text-xs text-slate-500">Review</p>
              </div>
            )}
            {matches.filter((m) => m.status === 'red').length > 0 && (
              <div className="text-center">
                <p className="text-2xl font-bold text-error-600">{matches.filter((m) => m.status === 'red').length}</p>
                <p className="text-xs text-slate-500">Low</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {matches.map((match, i) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            <Card hover className="overflow-hidden">
              <div className={`h-1 ${match.status === 'green' ? 'bg-success-500' : match.status === 'amber' ? 'bg-warning-500' : 'bg-error-500'}`} />
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <MatchStatusBadge status={match.status} />
                    <h3 className="font-display text-xl font-bold text-slate-900 mt-2">{match.benefitType}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                      <Building2 className="w-4 h-4" />
                      {match.institutionName}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Potential value</p>
                    <p className="text-2xl font-bold font-display text-slate-900">{formatCurrency(match.potentialValue)}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Match confidence</p>
                    <ConfidenceScore score={match.confidence} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Matching signals</p>
                    <div className="flex flex-wrap gap-1.5">
                      {match.signals.slice(0, 4).map((s) => (
                        <span key={s.label} className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                          {s.label}: {s.strength}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400">Identified on {formatDate(match.dateIdentified)}</p>
                  <div className="flex gap-2">
                    <Link to={`/app/matches/${match.id}`}>
                      <Button variant="outline" size="sm">
                        View Match Details
                      </Button>
                    </Link>
                    <Button size="sm" onClick={() => navigate(`/app/claims/new?matchId=${match.id}`)}>
                      Start Claim
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Button variant="outline" onClick={() => navigate('/app/discovery')}>
          Search Again
        </Button>
        <Button onClick={() => navigate('/app/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
