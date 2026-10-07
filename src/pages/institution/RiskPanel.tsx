import { useEffect, useState } from 'react';
import { AlertTriangle, ShieldAlert, Copy, FileWarning, Users, Bug } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { riskService } from '@/services';
import { timeAgo } from '@/utils/format';
import type { RiskAlert } from '@/types';

const typeConfig: Record<RiskAlert['type'], { icon: typeof Copy; label: string }> = {
  duplicate_identity: { icon: Copy, label: 'Possible Duplicate Identity' },
  reused_document: { icon: FileWarning, label: 'Reused Document' },
  multiple_beneficiary: { icon: Users, label: 'Multiple Beneficiary Relationship' },
  suspicious_pattern: { icon: Bug, label: 'Suspicious Pattern' },
};

const severityConfig: Record<RiskAlert['severity'], 'default' | 'success' | 'warning' | 'error'> = {
  low: 'default', medium: 'warning', high: 'error',
};

export function RiskPanel() {
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    riskService.getRiskAlerts().then((a) => { setAlerts(a); setLoading(false); });
  }, []);

  if (loading) return <div className="animate-shimmer h-96 rounded-xl" />;

  const high = alerts.filter((a) => a.severity === 'high').length;
  const medium = alerts.filter((a) => a.severity === 'medium').length;
  const low = alerts.filter((a) => a.severity === 'low').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Risk Alerts</h1>
        <p className="text-slate-500 mt-1">Monitor and review potential risk signals</p>
      </div>

      <Alert tone="warning" title="Risk signals require human review">
        These alerts are risk indicators only. They do not automatically reject claims or determine entitlement.
        Each alert requires review by an authorised officer.
      </Alert>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-error-50 text-error-600 flex items-center justify-center"><ShieldAlert className="w-4 h-4" /></div><div><p className="text-2xl font-bold font-display text-slate-900">{high}</p><p className="text-xs text-slate-500">High Risk</p></div></div></Card>
        <Card className="p-5"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-warning-50 text-warning-600 flex items-center justify-center"><AlertTriangle className="w-4 h-4" /></div><div><p className="text-2xl font-bold font-display text-slate-900">{medium}</p><p className="text-xs text-slate-500">Medium Risk</p></div></div></Card>
        <Card className="p-5"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center"><ShieldAlert className="w-4 h-4" /></div><div><p className="text-2xl font-bold font-display text-slate-900">{low}</p><p className="text-xs text-slate-500">Low Risk</p></div></div></Card>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const config = typeConfig[alert.type];
          const Icon = config.icon;
          return (
            <Card key={alert.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  alert.severity === 'high' ? 'bg-error-50 text-error-600' :
                  alert.severity === 'medium' ? 'bg-warning-50 text-warning-600' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-semibold text-slate-900 text-sm">{config.label}</h3>
                    <Badge variant={severityConfig[alert.severity]} dot>{alert.severity} risk</Badge>
                    <Badge variant="info">{alert.status}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    {alert.claimId && <span>Claim: {alert.claimId}</span>}
                    {alert.matchId && <span>Match: {alert.matchId}</span>}
                    <span>{timeAgo(alert.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
