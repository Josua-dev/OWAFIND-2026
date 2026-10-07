import { Building2, MapPin, Globe, ShieldCheck, BarChart3, Info } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getActiveInstitution } from '@/data/institutions';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-sm font-medium text-slate-800 text-right max-w-[60%]">{value}</span>
    </div>
  );
}

function SimStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-lg font-display font-semibold text-slate-800 mt-0.5">{value}</p>
    </div>
  );
}

// Institution Profile — separates publicly verifiable institutional information
// from the simulated data this prototype generates.
export function InstitutionProfilePage() {
  const { activeInstitutionId } = useApp();
  const inst = getActiveInstitution(activeInstitutionId);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm shrink-0">
            {inst.short.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-slate-900">{inst.name}</h1>
            <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{inst.region}, Namibia</span>
              <span className="inline-flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{inst.type}</span>
            </p>
          </div>
        </div>
        <Badge variant="warning" className="shrink-0">Simulated institution record</Badge>
      </div>

      <Alert tone="info" title="Prototype / demonstration view">
        OwaFind is <strong>not integrated</strong> with this institution. Using its real name here does not
        imply any API integration, data-sharing agreement, partnership or endorsement, and OwaFind has no
        access to this institution's member or financial records.
      </Alert>

      {/* Public institutional information */}
      <Card>
        <CardHeader
          title="Public Institutional Information"
          subtitle="Publicly verifiable facts about this institution"
          action={<Globe className="w-5 h-5 text-slate-300" />}
        />
        <CardBody className="pt-1">
          <Field label="Institution name" value={inst.name} />
          <Field label="Institution type" value={inst.type} icon={<Building2 className="w-4 h-4" />} />
          <Field label="Country" value="Namibia" icon={<Globe className="w-4 h-4" />} />
          <Field label="Head office" value={inst.region} icon={<MapPin className="w-4 h-4" />} />
          <Field label="Status" value="Registered" icon={<ShieldCheck className="w-4 h-4" />} />
        </CardBody>
      </Card>

      {/* Simulated OwaFind data */}
      <Card>
        <CardHeader
          title="Simulated OwaFind Data"
          subtitle="Prototype-generated figures — not actual statistics from this institution"
          action={<BarChart3 className="w-5 h-5 text-slate-300" />}
        />
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <SimStat label="Simulated matches" value={inst.metrics.matches.toLocaleString()} />
            <SimStat label="Simulated claims" value={inst.metrics.claims.toLocaleString()} />
            <SimStat label="Pending review" value={inst.metrics.pendingReview.toLocaleString()} />
            <SimStat label="Resolved" value={inst.metrics.resolved.toLocaleString()} />
            <SimStat label="Avg. resolution (days)" value={`${inst.metrics.avgResolutionDays}`} />
          </div>
          <p className="mt-4 text-xs text-slate-400 flex items-start gap-1.5 leading-relaxed">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            All figures on this page are demonstration data generated for this prototype. They are not
            actual statistics from this institution, and no claim shown anywhere in OwaFind relates to a
            real member of this fund.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
