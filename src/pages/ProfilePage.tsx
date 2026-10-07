import { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, ShieldCheck, Lock, CheckCircle2, Plus, X } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import type { EmploymentEntry } from '@/types';

export function ProfilePage() {
  const { profile, setProfile } = useApp();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [employers, setEmployers] = useState<EmploymentEntry[]>(profile.employmentHistory);

  const handleSave = () => {
    const completion = Math.min(100, Math.round(
      ((formData.firstName ? 10 : 0) +
      (formData.lastName ? 10 : 0) +
      (formData.dateOfBirth ? 10 : 0) +
      (formData.nationalId ? 10 : 0) +
      (formData.phone ? 10 : 0) +
      (formData.email ? 10 : 0) +
      (formData.region ? 5 : 0) +
      (employers.length > 0 ? 15 : 0) +
      (formData.consentGiven ? 10 : 0) +
      (formData.previousName ? 10 : 0))
    ));
    setProfile({ ...formData, employmentHistory: employers, profileCompletion: completion });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Profile</h1>
          <p className="text-slate-500 mt-1">Manage your personal information</p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { setEditing(false); setFormData(profile); setEmployers(profile.employmentHistory); }}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save Changes</Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit Profile</Button>
        )}
      </div>

      {saved && <Alert tone="success" title="Profile updated">Your changes have been saved.</Alert>}

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardBody className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl mx-auto">
              {profile.firstName[0]}{profile.lastName[0]}
            </div>
            <h3 className="font-display font-semibold text-slate-900 text-lg mt-4">{profile.firstName} {profile.lastName}</h3>
            <p className="text-sm text-slate-400">{profile.region}, Namibia</p>
            <div className="mt-3">
              <Badge variant={profile.verificationStatus === 'verified' ? 'success' : 'warning'} dot>
                {profile.verificationStatus === 'verified' ? 'Verified' : 'Pending Verification'}
              </Badge>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 mb-1">Profile Completion</p>
              <p className="text-2xl font-bold font-display text-primary-700">{profile.profileCompletion}%</p>
            </div>
          </CardBody>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Personal Information" />
            <CardBody className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="First name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} disabled={!editing} />
                <Input label="Last name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} disabled={!editing} />
                <Input label="Date of birth" type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} disabled={!editing} />
                <Input label="National ID" value={formData.nationalId} onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })} disabled={!editing} hint="Sensitive field — not editable" />
                <Input label="Previous / maiden name" value={formData.previousName} onChange={(e) => setFormData({ ...formData, previousName: e.target.value })} disabled={!editing} />
                <Input label="Region" value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} disabled={!editing} />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Contact Information" />
            <CardBody className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={!editing} icon={<Phone className="w-4 h-4" />} />
                <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={!editing} icon={<Mail className="w-4 h-4" />} />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Employment History" action={editing && <Button variant="outline" size="sm" onClick={() => setEmployers([...employers, { id: `emp-${Date.now()}`, employer: '', employeeNumber: '', startDate: '', endDate: '' }])}><Plus className="w-3.5 h-3.5" /> Add</Button>} />
            <CardBody className="space-y-3">
              {employers.map((emp, i) => (
                <div key={emp.id} className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  {editing ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Employer {i + 1}</span>
                        {employers.length > 1 && <button onClick={() => setEmployers(employers.filter((e) => e.id !== emp.id))} className="text-slate-400 hover:text-error-500"><X className="w-4 h-4" /></button>}
                      </div>
                      <Input label="Employer" value={emp.employer} onChange={(e) => setEmployers(employers.map((x) => x.id === emp.id ? { ...x, employer: e.target.value } : x))} />
                      <Input label="Employee number" value={emp.employeeNumber} onChange={(e) => setEmployers(employers.map((x) => x.id === emp.id ? { ...x, employeeNumber: e.target.value } : x))} />
                      <div className="grid grid-cols-2 gap-3">
                        <Input label="Start" type="month" value={emp.startDate} onChange={(e) => setEmployers(employers.map((x) => x.id === emp.id ? { ...x, startDate: e.target.value } : x))} />
                        <Input label="End" type="month" value={emp.endDate} onChange={(e) => setEmployers(employers.map((x) => x.id === emp.id ? { ...x, endDate: e.target.value } : x))} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center"><Briefcase className="w-5 h-5 text-slate-400" /></div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{emp.employer}</p>
                        <p className="text-xs text-slate-400">{emp.startDate} — {emp.endDate || 'present'}</p>
                        {emp.employeeNumber && <p className="text-xs text-slate-400">Employee #: {emp.employeeNumber}</p>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Verification & Consent" />
            <CardBody className="space-y-3">
              <div className="flex items-center gap-3 py-2">
                <CheckCircle2 className="w-5 h-5 text-success-500" />
                <div><p className="text-sm font-medium text-slate-700">Identity Verified</p><p className="text-xs text-slate-400">Your identity has been confirmed</p></div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <ShieldCheck className={`w-5 h-5 ${profile.consentGiven ? 'text-success-500' : 'text-slate-300'}`} />
                <div><p className="text-sm font-medium text-slate-700">Consent {profile.consentGiven ? 'Given' : 'Not Given'}</p><p className="text-xs text-slate-400">{profile.consentDate ? `Granted on ${new Date(profile.consentDate).toLocaleDateString()}` : 'Required to search for benefits'}</p></div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
