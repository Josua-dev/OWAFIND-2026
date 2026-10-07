import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, FileText, CheckCircle2, Clock, TrendingUp, Building2, MapPin } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { RecentActivityCard } from '@/components/shared/RecentActivity';
import { analyticsService, institutionService } from '@/services';
import { useApp } from '@/context/AppContext';
import { seedAuditEvents } from '@/data/seed';
import { formatCurrencyShort } from '@/utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, AreaChart, Area, Cell } from 'recharts';

const PIE_COLORS = ['#3d8378', '#54988e', '#84bcb3', '#fd7e14', '#f59e0b', '#ef4444'];

export function RegulatorDashboard() {
  const { profile } = useApp();
  const [stats, setStats] = useState({ totalBenefits: 0, potentialMatches: 0, verifiedMatches: 0, claims: 0, resolved: 0, avgResolutionDays: 0 });
  const [categoryData, setCategoryData] = useState<{ label: string; value: number; claims: number }[]>([]);
  const [institutionData, setInstitutionData] = useState<{ label: string; matches: number; claims: number; resolved: number }[]>([]);
  const [resolutionData, setResolutionData] = useState<{ label: string; resolved: number; avgDays: number }[]>([]);
  const [regionalData, setRegionalData] = useState<{ label: string; value: number }[]>([]);
  const [institutions, setInstitutions] = useState<{ id: string; name: string; type: string; region: string; matches: number; claims: number; pendingReview: number; resolved: number; avgResolutionDays: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsService.getRegulatorStats(),
      analyticsService.getBenefitCategoryData(),
      analyticsService.getInstitutionActivityData(),
      analyticsService.getResolutionTrendData(),
      analyticsService.getRegionalData(),
      institutionService.getInstitutions(),
    ]).then(([s, c, i, r, reg, inst]) => {
      setStats(s); setCategoryData(c); setInstitutionData(i); setResolutionData(r); setRegionalData(reg); setInstitutions(inst);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-shimmer h-96 rounded-xl" />;

  // Main feed stays aggregated (system + officer actors); the demo
  // beneficiary's account activity is shown separately, clearly labelled.
  const systemAuditEvents = seedAuditEvents.filter(
    (e) => e.actor === 'System' || e.actor.includes('Officer')
  );
  const beneficiaryName = `${profile.firstName} ${profile.lastName}`;
  const beneficiaryAuditEvents = seedAuditEvents.filter((e) => e.actor === beneficiaryName);

  const statCards = [
    { label: 'Total Potential Benefits', value: formatCurrencyShort(stats.totalBenefits), icon: TrendingUp, color: 'bg-primary-50 text-primary-600' },
    { label: 'Potential Matches', value: stats.potentialMatches.toLocaleString(), icon: Target, color: 'bg-blue-50 text-blue-600' },
    { label: 'Verified Matches', value: stats.verifiedMatches.toLocaleString(), icon: CheckCircle2, color: 'bg-success-50 text-success-600' },
    { label: 'Claims', value: stats.claims.toLocaleString(), icon: FileText, color: 'bg-accent-50 text-accent-600' },
    { label: 'Resolved', value: stats.resolved.toLocaleString(), icon: CheckCircle2, color: 'bg-success-50 text-success-600' },
    { label: 'Avg Resolution', value: `${stats.avgResolutionDays} days`, icon: Clock, color: 'bg-warning-50 text-warning-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Regulator Overview</h1>
          <p className="text-slate-500 mt-1">Aggregated monitoring across the OwaFind ecosystem</p>
        </div>
        <span className="text-xs font-medium text-accent-600 bg-accent-50 px-3 py-1 rounded-full">DEMONSTRATION DATA</span>
      </div>

      <Alert tone="info" title="Aggregated view">
        The regulator portal shows aggregated, anonymised statistics. The activity feeds below show
        simulated platform and beneficiary account events for demonstration — no private member
        records are displayed.
      </Alert>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className="p-5">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}><Icon className="w-5 h-5" /></div>
                <p className="text-2xl font-bold font-display text-slate-900">{s.value}</p>
                <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Benefit Categories" subtitle="Distribution of potential matches by type" />
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={100} label={true}>
                  {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Resolution Trends" subtitle="Claims resolved and average resolution time" />
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={resolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="resolved" stroke="#3d8378" strokeWidth={2} name="Claims Resolved" />
                <Line yAxisId="right" type="monotone" dataKey="avgDays" stroke="#fd7e14" strokeWidth={2} name="Avg Days" />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Institution Activity" subtitle="Matches and claims by institution" />
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={institutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="matches" fill="#3d8378" radius={[4, 4, 0, 0]} name="Matches" />
                <Bar dataKey="claims" fill="#54988e" radius={[4, 4, 0, 0]} name="Claims" />
                <Bar dataKey="resolved" fill="#84bcb3" radius={[4, 4, 0, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Regional Distribution" subtitle="Potential matches by region" />
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={regionalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3d8378" fill="#3d837833" strokeWidth={2} name="Matches" />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <RecentActivityCard
          title="Recent Activity"
          subtitle="System and officer activity — aggregated view"
          events={systemAuditEvents}
          max={5}
          span={false}
        />

        <RecentActivityCard
          title="Beneficiary Activity"
          subtitle="Demo beneficiary account events — simulated"
          events={beneficiaryAuditEvents}
          max={5}
          span={false}
        />
      </div>

      <Card>
        <CardHeader title="Registered Institutions" subtitle={`Simulated metrics across ${institutions.length} real Namibian institutions`} />
        <CardBody className="p-0">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="px-4 py-3 font-medium">Institution</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 text-slate-500 hidden md:table-cell">Region</th>
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
                    <td className="px-4 py-3 text-slate-600">{inst.matches}</td>
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
    </div>
  );
}