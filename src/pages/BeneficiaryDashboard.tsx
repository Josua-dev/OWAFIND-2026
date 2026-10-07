import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target,
  FileText,
  FolderOpen,
  Bell,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Search,
  User,
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Feedback';
import { StateBadge } from '@/components/shared/Timeline';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatCurrencyShort, timeAgo } from '@/utils/format';
import { seedMatches } from '@/data/seed';

export function BeneficiaryDashboard() {
  const { profile, claims, notifications } = useApp();
  const activeClaims = claims.filter((c) => !['CLOSED', 'APPROVED', 'REJECTED'].includes(c.state));
  const unreadNotifications = notifications.filter((n) => !n.read);
  const totalDocs = claims.reduce((sum, c) => sum + c.documents.length, 0);
  const potentialBenefits = seedMatches.length;
  const totalValue = seedMatches.reduce((sum, m) => sum + m.potentialValue, 0);

  const stats = [
    { label: 'Potential Benefits', value: potentialBenefits.toString(), icon: Target, color: 'bg-primary-50 text-primary-600', link: '/app/matches' },
    { label: 'Active Claims', value: activeClaims.length.toString(), icon: FileText, color: 'bg-blue-50 text-blue-600', link: '/app/claims' },
    { label: 'Documents', value: totalDocs.toString(), icon: FolderOpen, color: 'bg-accent-50 text-accent-600', link: '/app/claims' },
    { label: 'Notifications', value: unreadNotifications.length.toString(), icon: Bell, color: 'bg-success-50 text-success-600', link: '/app/notifications' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Welcome back, {profile.firstName}
          </h1>
          <p className="text-slate-500 mt-1">Here's an overview of your benefits and claims</p>
        </div>
        <Link to="/app/discovery">
          <Button>
            <Search className="w-4 h-4" />
            Find My Benefits
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={stat.link}>
                <Card hover className="p-5">
                  <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold font-display text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Potential Value Card */}
        <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white border-0 lg:col-span-1">
          <CardBody>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5" />
              <p className="text-sm text-primary-100">Total Potential Value</p>
            </div>
            <p className="text-3xl font-bold font-display">{formatCurrencyShort(totalValue)}</p>
            <p className="text-xs text-primary-200 mt-2">Across {potentialBenefits} potential matches</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <Link to="/app/matches" className="flex items-center gap-1 text-sm text-white hover:text-primary-100">
                View all matches <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardBody>
        </Card>

        {/* Active Claims */}
        <Card className="lg:col-span-2">
          <CardHeader title="Active Claims" subtitle="Track your ongoing claims" action={
            <Link to="/app/claims"><Button variant="ghost" size="sm">View all</Button></Link>
          } />
          <CardBody>
            {activeClaims.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No active claims</p>
                <Link to="/app/discovery" className="text-primary-600 text-sm mt-2 inline-block">Start a search →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeClaims.slice(0, 3).map((claim) => (
                  <Link key={claim.id} to={`/app/claims/${claim.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{claim.id}</p>
                          <p className="text-xs text-slate-400">{claim.benefitType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StateBadge state={claim.state} />
                        <span className="text-sm font-medium text-slate-700">{formatCurrency(claim.potentialValue)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Notifications */}
        <Card className="lg:col-span-2">
          <CardHeader title="Recent Activity" subtitle="Latest updates on your account" action={
            <Link to="/app/notifications"><Button variant="ghost" size="sm">View all</Button></Link>
          } />
          <CardBody>
            <div className="space-y-3">
              {notifications.slice(0, 4).map((n) => (
                <div key={n.id} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-slate-200' : 'bg-primary-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Profile Completion & Next Action */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Profile Completion" />
            <CardBody>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{profile.firstName} {profile.lastName}</p>
                  <p className="text-xs text-slate-400">{profile.region}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-500">Completeness</span>
                <span className="font-medium text-slate-700">{profile.profileCompletion}%</span>
              </div>
              <Progress value={profile.profileCompletion} color="primary" />
              <Link to="/app/profile" className="block mt-3">
                <Button variant="outline" size="sm" className="w-full">
                  <User className="w-3.5 h-3.5" />
                  Complete Profile
                </Button>
              </Link>
            </CardBody>
          </Card>

          <Card className="bg-accent-50/50 border-accent-100">
            <CardBody>
              <div className="flex items-start gap-2 mb-2">
                <Clock className="w-5 h-5 text-accent-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Next Action</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeClaims.length > 0
                      ? `Check the status of your claim ${activeClaims[0].id}`
                      : 'Search for potential benefits to get started'}
                  </p>
                </div>
              </div>
              <Link to={activeClaims.length > 0 ? `/app/claims/${activeClaims[0].id}` : '/app/discovery'}>
                <Button size="sm" className="w-full mt-2">
                  Take Action <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="text-center pt-2">
        <span className="text-xs text-slate-400 inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
          Demonstration Data — All values are simulated for prototype purposes
        </span>
      </div>
    </div>
  );
}
