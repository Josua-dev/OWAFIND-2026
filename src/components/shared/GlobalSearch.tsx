import { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Search as SearchIcon, FileText, Target, Building2, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { seedMatches, seedClaims, seedInstitutions, seedBenefitRecords } from '@/data/seed';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/format';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'beneficiary' | 'claim' | 'match' | 'institution' | 'benefit';
  link: string;
  icon: typeof FileText;
}

// Non-beneficiary roles can only open their own workspace, so institution
// results point at the dashboard where that role sees institutions.
const ROLE_INSTITUTION_LINK: Record<string, string> = {
  institution: '/app/institution',
  regulator: '/app/regulator',
  executive: '/app/executive',
  admin: '/app/admin',
};

export function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const { role } = useApp();

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    // Data consistency: beneficiary-identifying results (the demo
    // beneficiary's name, matches, claims and benefits) only appear for the
    // beneficiary role. Other roles search institutions only, linking to a
    // page they can actually open.
    if (role === 'beneficiary') {
      seedMatches.forEach((m) => {
        if (m.beneficiaryName.toLowerCase().includes(q) || m.benefitType.toLowerCase().includes(q) || m.institutionName.toLowerCase().includes(q)) {
          results.push({ id: m.id, title: m.beneficiaryName, subtitle: `${m.benefitType} — ${m.institutionName}`, type: 'match', link: `/app/matches/${m.id}`, icon: Target });
        }
      });

      seedClaims.forEach((c) => {
        if (c.id.toLowerCase().includes(q) || c.beneficiaryName.toLowerCase().includes(q) || c.benefitType.toLowerCase().includes(q)) {
          results.push({ id: c.id, title: c.id, subtitle: `${c.beneficiaryName} — ${c.benefitType}`, type: 'claim', link: `/app/claims/${c.id}`, icon: FileText });
        }
      });

      seedBenefitRecords.forEach((b) => {
        if (b.type.toLowerCase().includes(q) || b.institutionName.toLowerCase().includes(q)) {
          results.push({ id: b.id, title: b.type, subtitle: `${b.institutionName} — ${formatCurrency(b.approximateValue)}`, type: 'benefit', link: '/app/matches', icon: FileText });
        }
      });

      results.push({ id: 'ben-demo', title: 'Josua Uuyuni', subtitle: 'Beneficiary — Windhoek', type: 'beneficiary', link: '/app/profile', icon: User });
    } else if (ROLE_INSTITUTION_LINK[role]) {
      const link = ROLE_INSTITUTION_LINK[role];
      seedInstitutions.forEach((i) => {
        if (i.name.toLowerCase().includes(q) || i.type.toLowerCase().includes(q) || i.region.toLowerCase().includes(q)) {
          results.push({ id: i.id, title: i.name, subtitle: `${i.type} — ${i.region}`, type: 'institution', link, icon: Building2 });
        }
      });
    }

    return results.filter((r) => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q)).slice(0, 12);
  }, [query, role]);

  return (
    <Modal open={open} onClose={onClose} size="md">
      <Input
        autoFocus
        placeholder={role === 'beneficiary' ? 'Search beneficiaries, claims, matches, institutions...' : 'Search institutions...'}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        icon={<SearchIcon className="w-4 h-4" />}
      />
      <div className="mt-4 max-h-96 overflow-y-auto scrollbar-thin">
        {query.trim() === '' ? (
          <p className="text-center text-sm text-slate-400 py-8">Start typing to search across the demo dataset</p>
        ) : results.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-8">No results found for "{query}"</p>
        ) : (
          <div className="space-y-1">
            {results.map((r) => {
              const Icon = r.icon;
              return (
                <Link
                  key={`${r.type}-${r.id}`}
                  to={r.link}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{r.title}</p>
                    <p className="text-xs text-slate-400 truncate">{r.subtitle}</p>
                  </div>
                  <span className="text-xs text-slate-300 capitalize">{r.type}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
