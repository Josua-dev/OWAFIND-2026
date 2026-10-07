import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Building2, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { ClaimTimeline, StateBadge } from '@/components/shared/Timeline';
import { DocumentUploader } from '@/components/shared/DocumentUploader';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatFileSize, formatDate, formatDateTime } from '@/utils/format';
import type { Claim } from '@/types';

export function ClaimTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const { claims } = useApp();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = claims.find((c) => c.id === id);
    setClaim(found || null);
    setLoading(false);
  }, [id, claims]);

  if (loading) return <div className="animate-shimmer h-96 rounded-xl max-w-4xl mx-auto" />;

  if (!claim) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Claim not found.</p>
        <Link to="/app/claims" className="text-primary-600 mt-2 inline-block">Back to claims</Link>
      </div>
    );
  }

  const allDocs = claim.documents;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/app/claims" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" />
        Back to claims
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-slate-900">{claim.id}</h1>
            <StateBadge state={claim.state} />
          </div>
          <p className="text-slate-500 mt-1">{claim.benefitType} — {claim.institutionName}</p>
          <p className="text-xs text-slate-400 mt-1">Submitted {formatDate(claim.submittedAt)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Potential value</p>
          <p className="text-2xl font-bold font-display text-slate-900">{formatCurrency(claim.potentialValue)}</p>
        </div>
      </div>

      <Alert tone="info" title="Current status: Evidence Review">
        Your submitted documents are currently being reviewed by {claim.institutionName}. You will be notified when
        there is an update.
      </Alert>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Claim Timeline" subtitle="Track the progress of your claim" />
            <CardBody>
              <ClaimTimeline events={claim.timeline} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Documents" subtitle="Evidence submitted with this claim" action={
              <Button variant="outline" size="sm">Add Document</Button>
            } />
            <CardBody>
              {allDocs.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-4">No documents uploaded yet</p>
              ) : (
                <div className="space-y-2">
                  {allDocs.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{doc.type}</span>
                          <span>•</span>
                          <span>{formatFileSize(doc.size)}</span>
                          <span>•</span>
                          <span>{formatDate(doc.uploadedAt)}</span>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        doc.uploadStatus === 'verified' ? 'text-success-600 bg-success-50' :
                        doc.uploadStatus === 'needs_review' ? 'text-warning-600 bg-warning-50' :
                        'text-slate-500 bg-slate-100'
                      }`}>
                        {doc.uploadStatus === 'verified' ? 'Verified' : doc.uploadStatus === 'needs_review' ? 'Needs review' : doc.uploadStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Claim Details" />
            <CardBody className="space-y-3">
              <div><p className="text-xs text-slate-400">Claim ID</p><p className="text-sm font-medium text-slate-700 mt-0.5">{claim.id}</p></div>
              <div><p className="text-xs text-slate-400">Beneficiary</p><p className="text-sm font-medium text-slate-700 mt-0.5">{claim.beneficiaryName}</p></div>
              <div><p className="text-xs text-slate-400">Benefit type</p><p className="text-sm font-medium text-slate-700 mt-0.5">{claim.benefitType}</p></div>
              <div><p className="text-xs text-slate-400">Institution</p><p className="text-sm font-medium text-slate-700 mt-0.5 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {claim.institutionName}</p></div>
              <div><p className="text-xs text-slate-400">Potential value</p><p className="text-sm font-medium text-slate-700 mt-0.5">{formatCurrency(claim.potentialValue)}</p></div>
              <div><p className="text-xs text-slate-400">Last updated</p><p className="text-sm font-medium text-slate-700 mt-0.5">{formatDateTime(claim.updatedAt)}</p></div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-xs text-slate-400 mb-3">Need help?</p>
              <Link to="/app/support">
                <Button variant="outline" size="sm" className="w-full">Contact Support</Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
