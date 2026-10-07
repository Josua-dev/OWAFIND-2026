import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, CheckCircle2, FileText, Building2, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { RecentActivityCard } from '@/components/shared/RecentActivity';
import { analyticsService } from '@/services';
import { seedAuditEvents } from '@/data/seed';
import { formatCurrencyShort } from '@/utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, LineChart, Line } from 'recharts';

export function ExecutiveDashboard() {
  const [stats, setStats] = useState({ totalBenefits: 0, potentialMatches: 0, verifiedMatches: 0, openClaims: 0, resolvedClaims: 0, potentialRecoveryValue: 0, avgResolutionTime: 0, activeInstitutions: 0 });
  const [trendData, setTrendData] = useState<{ label: string; matches: number; verified: number; claims: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ label: string; value: number; claims: number }[]>([]);
  const [volumeData, setVolumeData] = useState<{ label: string; value: number }[]>([]);
  const [resolutionData, setResolutionData] = useState<{ label: string; resolved: number; avgDays: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsService.getExecutiveStats(),
      analyticsService.getExecutiveTrendData(),
      analyticsService.getBenefitCategoryData(),
      analyticsService.getClaimVolumeData(),
      analyticsService.getResolutionTrendData(),
    ]).then(([s, t, c, v, r]) => {
      setStats(s); setTrendData(t); setCategoryData(c); setVolumeData(v); setResolutionData(r);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-shimmer h-96 rounded-xl" />;

  const kpis = [
    { label: 'Total Benefits', value: formatCurrencyShort(stats.totalBenefits), icon: TrendingUp, color: 'bg-primary-50 text-primary-600', trend: '+12.4%', up: true },
    { label: 'Potential Matches', value: stats.potentialMatches.toLocaleString(), icon: Target, color: 'bg-blue-50 text-blue-600', trend: '+8.7%', up: true },
    { label: 'Verified Matches', value: stats.verifiedMatches.toLocaleString(), icon: CheckCircle2, color: 'bg-success-50 text-success-600', trend: '+15.2%', up: true },
    { label: 'Open Claims', value: stats.openClaims.toLocaleString(), icon: FileText, color: 'bg-accent-50 text-accent-600', trend: '+3.1%', up: true },
    { label: 'Resolved Claims', value: stats.resolvedClaims.toLocaleString(), icon: CheckCircle2, color: 'bg-success-50 text-success-600', trend: '+22.8%', up: true },
    { label: 'Recovery Value', value: formatCurrencyShort(stats.potentialRecoveryValue), icon: TrendingUp, color: 'bg-primary-50 text-primary-600', trend: '+18.3%', up: true },
    { label: 'Avg Resolution', value: `${stats.avgResolutionTime} days`, icon: Clock, color: 'bg-warning-50 text-warning-600', trend: '-12.5%', up: false },
    { label: 'Active Institutions', value: stats.activeInstitutions.toString(), icon: Building2, color: 'bg-slate-100 text-slate-600', trend: '0%', up: null },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Executive Overview</h1>
          <p className="text-slate-500 mt-1">Strategic KPIs and platform performance</p>
        </div>
        <span className="text-xs font-medium text-accent-600 bg-accent-50 px-3 py-1 rounded-full">DEMONSTRATION DATA</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${kpi.color} flex items-center justify-center`}><Icon className="w-5 h-5" /></div>
                  {kpi.up !== null && (
                    <span className={`text-xs font-medium flex items-center gap-0.5 ${kpi.up ? 'text-success-600' : 'text-error-600'}`}>
                      {kpi.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {kpi.trend}
                    </span>
                  )}
                </div>
                <p className="text-xl font-bold font-display text-slate-900">{kpi.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{kpi.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Platform Growth" subtitle="Quarterly trends across key metrics" />
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="cMatches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3d8378" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3d8378" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cVerified" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="matches" stroke="#3d8378" fill="url(#cMatches)" strokeWidth={2} name="Potential Matches" />
                <Area type="monotone" dataKey="verified" stroke="#22c55e" fill="url(#cVerified)" strokeWidth={2} name="Verified Matches" />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Resolution Performance" subtitle="Claims resolved and processing time" />
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={resolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="resolved" stroke="#3d8378" strokeWidth={2} name="Resolved" />
                <Line yAxisId="right" type="monotone" dataKey="avgDays" stroke="#fd7e14" strokeWidth={2} name="Avg Days" />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Claim Volumes" subtitle="Monthly submissions" />
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

        <Card>
          <CardHeader title="Benefit Category Distribution" subtitle="Matches by benefit type" />
          <CardBody>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="label" type="category" tick={{ fontSize: 11 }} width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#54988e" radius={[0, 4, 4, 0]} name="Matches" />
                <Bar dataKey="claims" fill="#fd7e14" radius={[0, 4, 4, 0]} name="Claims" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <RecentActivityCard
        title="Recent Activity"
        subtitle="Platform-wide system and user activity (simulated)"
        events={seedAuditEvents}
        max={5}
      />

      <Alert tone="info" title="About this dashboard">
        All data shown is simulated for demonstration purposes. In production, this dashboard would reflect
        real-time platform metrics.
      </Alert>
    </div>
  );
}
