import { useEffect, useState } from 'react';
import { Search, Eye, MessageSquare, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { getActiveInstitution, getMatchQueueFor, type InstitutionMatchQueueRow } from '@/data/institutions';
import { cn } from '@/utils/format';

export function InstitutionMatchQueue() {
  const { activeInstitutionId } = useApp();
  const inst = getActiveInstitution(activeInstitutionId);
  const [items, setItems] = useState<InstitutionMatchQueueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reviewItem, setReviewItem] = useState<InstitutionMatchQueueRow | null>(null);
  const [action, setAction] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const t = window.setTimeout(() => {
      setItems(getMatchQueueFor(activeInstitutionId));
      setLoading(false);
    }, 400);
    return () => window.clearTimeout(t);
  }, [activeInstitutionId]);

  const filtered = items.filter((i) => {
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    if (query && !i.beneficiary.toLowerCase().includes(query.toLowerCase()) && !i.id.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'info'> = {
    'Pending Review': 'warning', 'Verified': 'success', 'Information Requested': 'info', 'Unmatched': 'default',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Match Queue</h1>
          <p className="text-slate-500 mt-1">Review and process potential benefit matches — {inst.name}</p>
        </div>
        <span className="text-xs font-medium text-accent-600 bg-accent-50 px-3 py-1 rounded-full">DEMO DATA</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Search by name or ID..." value={query} onChange={(e) => setQuery(e.target.value)} icon={<Search className="w-4 h-4" />} className="flex-1" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm bg-white">
          <option value="all">All Statuses</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Information Requested">Info Requested</option>
          <option value="Verified">Verified</option>
          <option value="Unmatched">Unmatched</option>
        </select>
      </div>

      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="space-y-2 p-4">
              {[1, 2, 3, 4, 5].map((i) => <div key={i} className="animate-shimmer h-14 rounded-lg" />)}
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="px-4 py-3 font-medium">Match ID</th>
                  <th className="px-4 py-3 font-medium">Beneficiary</th>
                  <th className="px-4 py-3 font-medium">Benefit Type</th>
                  <th className="px-4 py-3 font-medium">Confidence</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Signals</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr></thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-700">{item.id}</td>
                      <td className="px-4 py-3 text-slate-600">{item.beneficiary}</td>
                      <td className="px-4 py-3 text-slate-600">{item.benefitType}</td>
                      <td className="px-4 py-3"><span className={cn('font-medium', item.confidence >= 80 ? 'text-success-600' : item.confidence >= 50 ? 'text-warning-600' : 'text-error-600')}>{item.confidence}%</span></td>
                      <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{item.signals}/5</td>
                      <td className="px-4 py-3"><Badge variant={statusVariant[item.status] || 'default'} dot>{item.status}</Badge></td>
                      <td className="px-4 py-3 text-slate-400 hidden lg:table-cell">{item.date}</td>
                      <td className="px-4 py-3 text-right"><Button variant="outline" size="sm" onClick={() => setReviewItem(item)}><Eye className="w-3.5 h-3.5" /> Review</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="text-center text-sm text-slate-400 py-8">No matches found</p>}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal open={!!reviewItem} onClose={() => { setReviewItem(null); setAction(null); }} title={`Match Review — ${reviewItem?.id}`} size="lg">
        {reviewItem && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-400">Beneficiary</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">{reviewItem.beneficiary}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-400">Benefit Type</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">{reviewItem.benefitType}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-400">Confidence Score</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">{reviewItem.confidence}%</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-400">Matching Signals</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">{reviewItem.signals} out of 5 signals matched</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">Matching Evidence</p>
              <div className="space-y-2">
                {['National ID — Exact', 'DOB — Exact', 'Name — Strong', 'Employer — Strong'].map((s) => (
                  <div key={s} className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-600">{s}</span>
                    <span className="text-xs text-success-600 bg-success-50 px-2 py-0.5 rounded">Match</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">Decision</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="success" size="sm" onClick={() => setAction('confirmed')}><CheckCircle2 className="w-4 h-4" /> Confirm Match</Button>
                <Button variant="outline" size="sm" onClick={() => setAction('info')}><MessageSquare className="w-4 h-4" /> Request Info</Button>
                <Button variant="danger" size="sm" onClick={() => setAction('unmatched')}><XCircle className="w-4 h-4" /> Mark Unmatched</Button>
              </div>
            </div>

            {action && (
              <div className="bg-success-50 border border-success-200 rounded-lg p-4 text-sm text-success-700">
                Match <strong>{reviewItem.id}</strong> has been <strong>{action === 'confirmed' ? 'confirmed' : action === 'info' ? 'flagged for more information' : 'marked as unmatched'}</strong>. This is a demo action.
              </div>
            )}

            <div className="border-t border-slate-100 pt-4">
              <p className="text-sm font-semibold text-slate-700 mb-2">Audit Activity</p>
              <div className="space-y-1 text-xs text-slate-500">
                <p>10:42 — Claims Officer reviewed match {reviewItem.id}</p>
                <p>09:15 — System identified match with {reviewItem.confidence}% confidence</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
