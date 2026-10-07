import { useState } from 'react';
import { User, Bell, Shield, Lock, HelpCircle, Trash2, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/format';
import { Link } from 'react-router-dom';

type SettingsTab = 'account' | 'privacy' | 'security' | 'support';

const tabs: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'support', label: 'Support', icon: HelpCircle },
];

export function SettingsPage() {
  const { consentGiven, setConsentGiven, resetDemo, profile } = useApp();
  const [tab, setTab] = useState<SettingsTab>('account');
  const [showReset, setShowReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({ match: true, document: true, claim: true, system: false });

  const handleReset = () => {
    resetDemo();
    setShowReset(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account, privacy, and security</p>
      </div>

      {resetDone && <Alert tone="success" title="Demo reset">The prototype has been reset to its initial state.</Alert>}

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto scrollbar-thin border-b border-slate-200">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors shrink-0',
                tab === t.id ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'
              )}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'account' && (
        <div className="space-y-6">
          <Card>
            <CardHeader title="Profile" subtitle="Manage your personal information" />
            <CardBody>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{profile.firstName} {profile.lastName}</p>
                  <p className="text-sm text-slate-400">{profile.email}</p>
                </div>
              </div>
              <Link to="/app/profile"><Button variant="outline" size="sm">Edit Profile</Button></Link>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Notification Preferences" subtitle="Choose what you want to be notified about" />
            <CardBody className="space-y-3">
              {(Object.keys(notifPrefs) as (keyof typeof notifPrefs)[]).map((key) => (
                <label key={key} className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-700 capitalize">{key === 'match' ? 'Potential matches' : key === 'document' ? 'Document updates' : key === 'claim' ? 'Claim updates' : 'System messages'}</span>
                  <button
                    onClick={() => setNotifPrefs({ ...notifPrefs, [key]: !notifPrefs[key] })}
                    className={cn('w-11 h-6 rounded-full transition-colors relative', notifPrefs[key] ? 'bg-primary-600' : 'bg-slate-200')}
                  >
                    <span className={cn('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform', notifPrefs[key] ? 'translate-x-5' : 'translate-x-0.5')} />
                  </button>
                </label>
              ))}
            </CardBody>
          </Card>
        </div>
      )}

      {tab === 'privacy' && (
        <div className="space-y-6">
          <Card>
            <CardHeader title="Consent Management" subtitle="Control how your data is used" />
            <CardBody className="space-y-4">
              <Alert tone={consentGiven ? 'success' : 'warning'} title={consentGiven ? 'Consent active' : 'Consent not given'}>
                {consentGiven
                  ? 'You have consented to OwaFind searching for potential benefits on your behalf.'
                  : 'You need to provide consent before OwaFind can search for benefits.'}
              </Alert>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-700">Search consent</p>
                  <p className="text-xs text-slate-400 mt-0.5">Allow OwaFind to search for benefits</p>
                </div>
                <button
                  onClick={() => setConsentGiven(!consentGiven)}
                  className={cn('w-11 h-6 rounded-full transition-colors relative', consentGiven ? 'bg-primary-600' : 'bg-slate-200')}
                >
                  <span className={cn('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform', consentGiven ? 'translate-x-5' : 'translate-x-0.5')} />
                </button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Data Permissions" />
            <CardBody className="space-y-3">
              {['Allow identity matching', 'Allow employment history search', 'Allow institution contact'].map((perm, i) => (
                <div key={perm} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-sm text-slate-700">{perm}</span>
                  <CheckCircle2 className="w-4 h-4 text-success-500" />
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      )}

      {tab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader title="Password" subtitle="Demo only — no real password is stored" />
            <CardBody>
              <Button variant="outline" size="sm">Change Password</Button>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Two-Factor Authentication" subtitle="Add an extra layer of security" />
            <CardBody>
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-slate-700">MFA is not enabled</p><p className="text-xs text-slate-400 mt-0.5">Recommended for additional security</p></div>
                <Button variant="outline" size="sm">Enable MFA</Button>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Active Sessions" />
            <CardBody className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <div><p className="text-sm text-slate-700">Current session</p><p className="text-xs text-slate-400">Demo Browser — Windhoek</p></div>
                <span className="text-xs text-success-600 bg-success-50 px-2 py-0.5 rounded">Active</span>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {tab === 'support' && (
        <div className="space-y-6">
          <Card>
            <CardHeader title="Help Centre" />
            <CardBody>
              <Link to="/app/support"><Button variant="outline" size="sm">Visit Help Centre</Button></Link>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Contact Support" />
            <CardBody>
              <Link to="/app/support"><Button variant="outline" size="sm">Create Support Request</Button></Link>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Danger Zone */}
      <Card className="border-error-200">
        <CardHeader title="Demo Administration" subtitle="Reset the prototype state" />
        <CardBody>
          <Alert tone="error" title="Reset Demo">
            This will clear all local data (profile, claims, notifications, documents) and restore the prototype to its initial state.
          </Alert>
          <Button variant="danger" size="sm" className="mt-4" onClick={() => setShowReset(true)}>
            <RotateCcw className="w-4 h-4" />
            Reset Demo
          </Button>
        </CardBody>
      </Card>

      <Modal open={showReset} onClose={() => setShowReset(false)} title="Reset Demo?" size="sm">
        <p className="text-sm text-slate-600">Are you sure you want to reset the demo? This will erase all your local data and restore the initial demo state. This action cannot be undone.</p>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={() => setShowReset(false)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={handleReset}><Trash2 className="w-4 h-4" /> Reset</Button>
        </div>
      </Modal>
    </div>
  );
}
