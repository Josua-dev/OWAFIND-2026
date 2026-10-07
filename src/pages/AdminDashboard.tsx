import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target, FileText, CheckCircle2, TrendingUp, Building2,
  ShieldAlert, LifeBuoy, ClipboardCheck,
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { StateBadge } from '@/components/shared/Timeline';
import { RecentActivityCard } from '@/components/shared/RecentActivity';
import {
  analyticsService, auditService, riskService, supportService,
  claimService, institutionService,
} from '@/services';
import { formatCurrencyShort, timeAgo } from '@/utils/format';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';
import type { AuditEvent, RiskAlert, SupportTicket, Claim, Institution } from '@/types';

const PIE_COLORS = ['#3d8378', '#54988e', '#84bcb3', '#fd7e14', '#f59e0b', '#ef4444'];

const severityVariant: Record<string, 'error' | 'warning' | 'info'> = {
  high: 'error', medium: 'warning', low: 'info',
};

// System Control Center — full platform oversight. Every figure shown here is
// simulated demonstration data for the prototype.
export function AdminDashboard() {
  const [regStats, setRegStats] = useState({ totalBenefits: 0, potentialMatches: 0, verifiedMatches: 0, claims: 0, resolved: 0, avgResolutionDays: 0 });
  const [execStats, setExecStats] = useState<{ openClaims: number; resolvedClaims: number; potentialRecoveryValue: number; activeInstitutions: number } | null>(null);
  const [categoryData, setCategoryData] = useState<{ label: string; value: number; claims: number }[]>([]);
  const [volumeData, setVolumeData] = useState<{ label: string; value: number }[]>([]);
  const [trendData, setTrendData] = useState<{ label: string; matches: number; verified: number; claims: number }[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsService.getRegulatorStats(),
      analyticsService.getExecutiveStats(),
      analyticsService.getBenefitCategoryData(),
      analyticsService.getClaimVolumeData(),
      analyticsService.getExecutiveTrendData(),
      auditService.getAuditEvents(),
      riskService.getRiskAlerts(),
      supportService.getTickets(),
      claimService.getClaims(),
      institutionService.getInstitutions(),
    ]).then(([reg, ex, cat, vol, trd, audit, risk, tix, cl, inst]) => {
      setRegStats(reg);
      setExecStats({ openClaims: ex.openClaims, resolvedClaims: ex.resolvedClaims, potentialRecoveryValue: ex.potentialRecoveryValue, activeInstitutions: ex.activeInstitutions });
      setCategoryData(cat);
      setVolumeData(vol);
      setTrendData(trd);
      setAuditEvents(audit);
      setRiskAlerts(risk);
      setTickets(tix);
      setClaims(cl);
      setInstitutions(inst);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-shimmer h-96 rounded-xl" />;

  const openRisk = riskAlerts.filter((r) => r.status === 'open').length;
  const openTickets = tickets.filter((t) => t.status === 'open').length;

  const statCards = [
    { label: 'Total Potential Benefits', value: formatCurrencyShort(regStats.totalBenefits), icon: TrendingUp, color: 'bg-primary-50 text-primary-600' },
    { label: 'Potential Matches', value: regStats.potentialMatches.toLocaleString(), icon: Target, color: 'bg-blue-50 text-blue-600' },
    { label: 'Verified Matches', value: regStats.verifiedMatches.toLocaleString(), icon: CheckCircle2, color: 'bg-success-50 text-success-600' },
    { label: 'Open Claims', value: (execStats?.openClaims ?? 0).toLocaleString(), icon: FileText, color: 'bg-accent-50 text-accent-600' },
    { label: 'Resolved Claims', value: (execStats?.resolvedClaims ?? regStats.resolved).toLocaleString(), icon: ClipboardCheck, color: 'bg-success-50 text-success-600' },
    { label: 'Institutions', value: institutions.length.toString(), icon: Building2, color: 'bg-slate-100 text-slate-600' },
    { label: 'Open Risk Alerts', value: openRisk.toString(), icon: ShieldAlert, color: 'bg-error-50 text-error-600' },
    { label: 'Open Support Tickets', value: openTickets.toString(), icon: LifeBuoy, color: 'bg-warning-50 text-warning-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">System Control Center — full oversight of platform data and activity</p>
        </div>
        <span className="text-xs font-medium text-accent-600 bg-accent-50 px-3 py-1 rounded-full">DEMONSTRATION DATA</span>
      </div>

      <Alert tone="info" title="System oversight view">
        Everything below is simulated demonstration data generated for this prototype. No real member records,
        claims or institutional data are shown anywhere in the OwaFind demo.
      </Alert>

      {/* Platform-wide stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}><Icon className="w-5 h-5" /></div>
                <p className="text-2xl font-bold font-display text-slate-900">{s.value}</p>
                <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* What's happening */}
      <div className="grid lg:grid-cols-3 gap-6">
        <RecentActivityCard
          subtitle="Live system and user activity (simulated)"
          events={auditEvents}
          max={6}
        />

        <Card>
          <CardHeader
            title="Risk Alerts"
            subtitle={`${openRisk} open — simulated`}
          />
          <CardBody className="pt-1">
            <div className="space-y-3">
              {riskAlerts.map((r) => (
                <div key={r.id} className="py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={severityVariant[r.severity] || 'default'} dot>{r.severity}</Badge>
                    <span className="text-xs text-slate-400">{timeAgo(r.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{r.description}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Claim Volumes" subtitle="Monthly claim submissions across the platform" />
          <CardBody>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3d8378" radius={[4, 4, 0, 0]} name="Claims" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Benefit Categories" subtitle="Distribution of potential matches by type" />
          <CardBody>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={90} label={true}>
                  {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Recent claims */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Recent Claims" subtitle="Claims moving through the pipeline (simulated)" />
          <CardBody className="p-0">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="px-4 py-3 font-medium">Claim ID</th>
                  <th className="px-4 py-3 font-medium">Beneficiary</th>
                  <th className="px-4 py-3 font-medium">State</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Updated</th>
                </tr></thead>
                <tbody>
                  {claims.map((c) => (
                    <tr key={c.id} className="border-b border-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-700">{c.id}</td>
                      <td className="px-4 py-3 text-slate-600">{c.beneficiaryName}</td>
                      <td className="px-4 py-3"><StateBadge state={c.state} /></td>
                      <td className="px-4 py-3 text-slate-400 hidden md:table-cell">{timeAgo(c.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {claims.length === 0 && <p className="text-center text-sm text-slate-400 py-8">No claims yet</p>}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Support Tickets" subtitle={`${openTickets} open of ${tickets.length} — simulated`} />
          <CardBody className="p-0">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="px-4 py-3 font-medium">Ticket</th>
                  <th className="px-4 py-3 font-medium">Subject</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Created</th>
                </tr></thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id} className="border-b border-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-700">{t.id}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate">{t.subject}</td>
                      <td className="px-4 py-3">
                        <Badge variant={t.status === 'open' ? 'warning' : 'success'} dot>{t.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-400 hidden md:table-cell">{timeAgo(t.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {tickets.length === 0 && <p className="text-center text-sm text-slate-400 py-8">No tickets</p>}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quarterly platform trend */}
      <Card>
        <CardHeader title="Quarterly Platform Trend" subtitle="Matches, verifications and claims by quarter" />
        <CardBody>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="matches" stroke="#3d8378" fill="#3d837833" strokeWidth={2} name="Matches" />
              <Area type="monotone" dataKey="verified" stroke="#fd7e14" fill="#fd7e1422" strokeWidth={2} name="Verified" />
              <Area type="monotone" dataKey="claims" stroke="#54988e" fill="#54988e22" strokeWidth={2} name="Claims" />
            </AreaChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* All institutions */}
      <Card>
        <CardHeader title="All Institutions" subtitle={`${institutions.length} real Namibian institutions — simulated metrics`} />
        <CardBody className="p-0">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="px-4 py-3 font-medium">Institution</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Region</th>
                <th className="px-4 py-3 font-medium">Matches</th>
                <th className="px-4 py-3 font-medium">Claims</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Pending</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Avg Days</th>
              </tr></thead>
              <tbody>
                {institutions.map((inst) => (
                  <tr key={inst.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-700">{inst.name}</td>
                    <td className="px-4 py-3 text-slate-600">{inst.type}</td>
                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{inst.region}</td>
                    <td className="px-4 py-3 text-slate-600">{inst.matches.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-600">{inst.claims}</td>
                    <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">{inst.pendingReview}</td>
                    <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">{inst.avgResolutionDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <div className="text-xs text-slate-400 text-center">DEMONSTRATION DATA — all figures on this page are simulated for prototype purposes</div>
    </div>
  );
}
