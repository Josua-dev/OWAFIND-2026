import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, FileText, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StateBadge } from '@/components/shared/Timeline';
import { RecentActivityCard } from '@/components/shared/RecentActivity';
import { useApp } from '@/context/AppContext';
import {
  getActiveInstitution,
  getCategoryDataFor,
  getVolumeDataFor,
  getMatchQueueFor,
  getClaimsQueueFor,
} from '@/data/institutions';
import { seedAuditEvents } from '@/data/seed';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const PIE_COLORS = ['#3d8378', '#54988e', '#84bcb3', '#fd7e14', '#f59e0b', '#ef4444'];

// All figures on this dashboard are simulated demonstration data, generated
// per selected institution from the real-Namibian-institution registry.
export function InstitutionDashboard() {
  const { activeInstitutionId, profile } = useApp();
  const inst = getActiveInstitution(activeInstitutionId);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<{ label: string; value: number; claims: number }[]>([]);
  const [volumeData, setVolumeData] = useState<{ label: string; value: number }[]>([]);

  const stats = inst.metrics;
  const matchQueue = useMemo(() => getMatchQueueFor(activeInstitutionId), [activeInstitutionId]);
  const claimsQueue = useMemo(() => getClaimsQueueFor(activeInstitutionId), [activeInstitutionId]);

  useEffect(() => {
    setLoading(true);
    const t = window.setTimeout(() => {
      setCategoryData(getCategoryDataFor(activeInstitutionId));
      setVolumeData(getVolumeDataFor(activeInstitutionId));
      setLoading(false);
    }, 300);
    return () => window.clearTimeout(t);
  }, [activeInstitutionId]);

  if (loading) return <div className="animate-shimmer h-96 rounded-xl" />;

  // Split the platform feed: institution/system activity vs the demo
  // beneficiary's account activity, shown in separate cards.
  const systemEvents = seedAuditEvents.filter(
    (e) => e.actor === 'System' || e.actor.includes('Officer')
  );
  const beneficiaryName = `${profile.firstName} ${profile.lastName}`;
  const beneficiaryEvents = seedAuditEvents.filter((e) => e.actor === beneficiaryName);

  const statCards = [
    { label: 'Potential Matches', value: stats.matches.toLocaleString(), icon: Target, color: 'bg-primary-50 text-primary-600' },
    { label: 'Claims', value: stats.claims.toLocaleString(), icon: FileText, color: 'bg-blue-50 text-blue-600' },
    { label: 'Pending Review', value: stats.pendingReview.toLocaleString(), icon: Clock, color: 'bg-warning-50 text-warning-600' },
    { label: 'Resolved', value: stats.resolved.toLocaleString(), icon: CheckCircle2, color: 'bg-success-50 text-success-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Institution Dashboard</h1>
          <p className="text-slate-500 mt-1">{inst.name} — simulated institution record</p>
        </div>
        <span className="text-xs font-medium text-accent-600 bg-accent-50 px-3 py-1 rounded-full">DEMO DATA</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={`${inst.id}-${s.label}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="p-5">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}><Icon className="w-5 h-5" /></div>
                <p className="text-2xl font-bold font-display text-slate-900">{s.value}</p>
                <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-4">
        <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary-600" /><span className="text-sm text-slate-600">Avg Resolution Time</span></div>
        <p className="text-2xl font-bold font-display text-primary-700">{stats.avgResolutionDays} days</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Benefit Categories" subtitle={`Matches by benefit type — ${inst.short}`} />
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

        <Card>
          <CardHeader title="Claim Volumes" subtitle={`Monthly claim submissions — ${inst.short}`} />
          <CardBody>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3d8378" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Recent Match Queue" action={<Link to="/app/institution/matches"><Button variant="ghost" size="sm">View all</Button></Link>} />
          <CardBody>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="pb-2 font-medium">ID</th><th className="pb-2 font-medium">Beneficiary</th><th className="pb-2 font-medium">Confidence</th><th className="pb-2 font-medium">Status</th>
                </tr></thead>
                <tbody>
                  {matchQueue.slice(0, 5).map((m) => (
                    <tr key={m.id} className="border-b border-slate-50">
                      <td className="py-2.5 font-medium text-slate-700">{m.id}</td>
                      <td className="py-2.5 text-slate-600">{m.beneficiary}</td>
                      <td className="py-2.5"><span className={`font-medium ${m.confidence >= 80 ? 'text-success-600' : m.confidence >= 50 ? 'text-warning-600' : 'text-error-600'}`}>{m.confidence}%</span></td>
                      <td className="py-2.5"><span className="text-xs text-slate-500">{m.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Recent Claims" action={<Link to="/app/institution/claims"><Button variant="ghost" size="sm">View all</Button></Link>} />
          <CardBody>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="pb-2 font-medium">Claim ID</th><th className="pb-2 font-medium">Beneficiary</th><th className="pb-2 font-medium">Status</th>
                </tr></thead>
                <tbody>
                  {claimsQueue.slice(0, 5).map((c) => (
                    <tr key={c.id} className="border-b border-slate-50">
                      <td className="py-2.5 font-medium text-slate-700">{c.id}</td>
                      <td className="py-2.5 text-slate-600">{c.beneficiary}</td>
                      <td className="py-2.5"><StateBadge state={c.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <RecentActivityCard
          subtitle="Institution and system activity (simulated)"
          events={systemEvents}
          max={5}
        />

        <Card className="border-warning-200 bg-warning-50/30 h-fit">
          <CardBody>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-warning-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">3 risk alerts require attention</p>
                <p className="text-xs text-slate-500">Review potential duplicate identities and reused documents</p>
              </div>
              <Link to="/app/institution/risk"><Button variant="outline" size="sm">Review <ArrowRight className="w-3.5 h-3.5" /></Button></Link>
            </div>
          </CardBody>
        </Card>
      </div>

      <RecentActivityCard
        title="Beneficiary Activity"
        subtitle="Demo beneficiary account events — simulated"
        events={beneficiaryEvents}
        max={5}
      />
    </div>
  );
}