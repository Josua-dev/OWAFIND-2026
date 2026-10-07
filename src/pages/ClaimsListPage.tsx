import { Link } from 'react-router-dom';
import { FileText, Search, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StateBadge } from '@/components/shared/Timeline';
import { EmptyState, Spinner } from '@/components/ui/Feedback';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate } from '@/utils/format';

export function ClaimsListPage() {
  const { claims } = useApp();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">My Claims</h1>
          <p className="text-slate-500 mt-1">Track and manage your benefit claims</p>
        </div>
        <Link to="/app/discovery">
          <Button size="sm">
            <Plus className="w-4 h-4" />
            New Search
          </Button>
        </Link>
      </div>

      {claims.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FileText className="w-12 h-12" />}
            title="No claims yet"
            description="Start a search to discover potential benefits and begin the claims process."
            action={
              <Link to="/app/discovery">
                <Button>
                  <Search className="w-4 h-4" />
                  Find My Benefits
                </Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {claims.map((claim) => (
            <Link key={claim.id} to={`/app/claims/${claim.id}`}>
              <Card hover className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-semibold text-slate-900">{claim.id}</h3>
                        <StateBadge state={claim.state} />
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{claim.benefitType} — {claim.institutionName}</p>
                      <p className="text-xs text-slate-400 mt-1">Submitted {formatDate(claim.submittedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Potential value</p>
                      <p className="text-lg font-bold font-display text-slate-900">{formatCurrency(claim.potentialValue)}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
