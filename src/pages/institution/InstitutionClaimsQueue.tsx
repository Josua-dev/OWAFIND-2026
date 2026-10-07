import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { StateBadge } from '@/components/shared/Timeline';
import { useApp } from '@/context/AppContext';
import { getActiveInstitution, getClaimsQueueFor } from '@/data/institutions';
import { formatCurrency } from '@/utils/format';

export function InstitutionClaimsQueue() {
  const { activeInstitutionId } = useApp();
  const inst = getActiveInstitution(activeInstitutionId);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statuses = ['all', 'SUBMITTED', 'IDENTITY_REVIEW', 'EVIDENCE_REVIEW', 'INSTITUTION_REVIEW', 'MORE_INFORMATION_REQUIRED', 'APPROVED', 'REJECTED', 'CLOSED', 'APPEAL'];

  const queue = useMemo(() => getClaimsQueueFor(activeInstitutionId), [activeInstitutionId]);

  const filtered = queue.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (query && !c.id.toLowerCase().includes(query.toLowerCase()) && !c.beneficiary.toLowerCase().includes(query.toLowerCase()) && !c.benefitType.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Claims Queue</h1>
          <p className="text-slate-500 mt-1">Manage and process beneficiary claims — {inst.name}</p>
        </div>
        <span className="text-xs font-medium text-accent-600 bg-accent-50 px-3 py-1 rounded-full">DEMO DATA</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Search by claim ID, name, or benefit type..." value={query} onChange={(e) => setQuery(e.target.value)} icon={<Search className="w-4 h-4" />} className="flex-1" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm bg-white">
          {statuses.map((s) => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="px-4 py-3 font-medium">Claim ID</th>
                <th className="px-4 py-3 font-medium">Beneficiary</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Benefit Type</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Institution</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Value</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Date</th>
              </tr></thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-700">{c.id}</td>
                    <td className="px-4 py-3 text-slate-600">{c.beneficiary}</td>
                    <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{c.benefitType}</td>
                    <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">{c.institution}</td>
                    <td className="px-4 py-3"><StateBadge state={c.status} /></td>
                    <td className="px-4 py-3 text-slate-700 hidden sm:table-cell">{formatCurrency(c.value)}</td>
                    <td className="px-4 py-3 text-slate-400 hidden lg:table-cell">{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-center text-sm text-slate-400 py-8">No claims found</p>}
          </div>
        </CardBody>
      </Card>

      <div className="text-xs text-slate-400 text-center">DEMO DATA — {filtered.length} simulated claims shown for {inst.name}</div>
    </div>
  );
}
