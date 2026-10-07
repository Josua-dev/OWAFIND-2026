import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, User, Building, Briefcase, Users, LogIn, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { useApp } from '@/context/AppContext';
import type { Role } from '@/types';

const roles: { id: Role; label: string; icon: typeof User; description: string }[] = [
  { id: 'beneficiary', label: 'Beneficiary', icon: User, description: 'I am looking for my benefits' },
  { id: 'institution', label: 'Institution', icon: Building, description: 'I represent an institution' },
  { id: 'regulator', label: 'Regulator', icon: Briefcase, description: 'I am a regulator' },
  { id: 'executive', label: 'Executive', icon: Users, description: 'I am an executive' },
  { id: 'admin', label: 'Admin', icon: ShieldCheck, description: 'I am an administrator' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { switchRole } = useApp();
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    nationalId: '',
    dateOfBirth: '',
    institutionRef: '',
    password: '',
  });
  const [error, setError] = useState('');

  const roleLabels: Record<Role, string> = {
    beneficiary: 'National ID',
    institution: 'Institution Reference',
    regulator: 'Email',
    executive: 'Email',
    admin: 'Email',
  };

  const rolePlaceholders: Record<Role, string> = {
    beneficiary: '75031402048',
    institution: 'GIPF-2026-PROD',
    regulator: 'regulator@namfisa.gov.na',
    executive: 'executive@owafind.com',
    admin: 'admin@owafind.com',
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Demo validation - in production this would be a real API call
    if (!selectedRole) {
      setError('Please select your role');
      return;
    }

    // Demo roles with preset credentials
    const demoCredentials: Record<Role, { [key: string]: string }> = {
      beneficiary: {
        nationalId: '75031402048',
        dateOfBirth: '1975-03-14',
      },
      institution: {
        institutionRef: 'GIPF-2026-PROD',
        password: 'demo123',
      },
      regulator: {
        email: 'regulator@namfisa.gov.na',
        password: 'demo123',
      },
      executive: {
        email: 'executive@owafind.com',
        password: 'demo123',
      },
      admin: {
        email: 'admin@owafind.com',
        password: 'demo123',
      },
    };

    const creds = demoCredentials[selectedRole];

    // Check if the entered values match demo values
    if (selectedRole === 'beneficiary') {
      if (
        formData.nationalId !== creds.nationalId ||
        formData.dateOfBirth !== creds.dateOfBirth
      ) {
        setError('Invalid credentials');
        return;
      }
    } else if (selectedRole === 'institution') {
      if (
        formData.institutionRef !== creds.institutionRef ||
        formData.password !== creds.password
      ) {
        setError('Invalid credentials');
        return;
      }
    } else {
      if (
        formData.password !== creds.password
      ) {
        setError('Invalid credentials');
        return;
      }
    }

    // Switch to the selected role and navigate to dashboard
    switchRole(selectedRole);
    navigate('/app/dashboard');
  };

  if (showRoleSelect) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Logo size="md" />
            <h1 className="font-display text-2xl font-bold text-slate-900 mt-3">
              Select your role
            </h1>
            <p className="text-slate-500 mt-1">Choose how you'll use OwaFind</p>
          </div>

          <form onSubmit={handleLogin}>
            <Card>
              <div className="p-5">
                {roles.filter(r => r.id !== selectedRole).map((role, idx) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedRole(role.id)}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-50 mb-2 last:mb-0"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <role.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{role.label}</p>
                      <p className="text-xs text-slate-400">{role.description}</p>
                    </div>
                    <AnimatePresence>
                      {selectedRole === role.id && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="ml-auto text-primary-600"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}

                <Button type="submit" className="w-full mt-4" disabled={!selectedRole}>
                  Continue as {selectedRole && roles.find(r => r.id === selectedRole)?.label}
                </Button>
              </div>
            </Card>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setShowRoleSelect(false)}
                className="text-sm text-slate-400 hover:text-slate-600"
              >
                ← Back to role selection
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Logo size="md" />
          <h1 className="font-display text-2xl font-bold text-slate-900 mt-3">
            Welcome to OwaFind
          </h1>
          <p className="text-slate-500 mt-1">
            Find what may belong to you
          </p>
        </div>

        <Card>
          <div className="p-5">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
                  <p className="text-sm text-error-600">{error}</p>
                </div>
              )}

              {!showRoleSelect && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowRoleSelect(true)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Choose Role
                  <ShieldCheck className="w-4 h-4 ml-2 hidden sm:block" />
                </Button>
              )}

              <form onSubmit={handleLogin}>
                {selectedRole && (
                  <>
                    <Input
                      type={selectedRole === 'beneficiary' ? 'text' : 'email'}
                      label={roleLabels[selectedRole]}
                      placeholder={rolePlaceholders[selectedRole]}
                      value={formData.nationalId}
                      onChange={(e) => setFormData({ ...formData, [selectedRole === 'beneficiary' ? 'nationalId' : 'institutionRef']: e.target.value })}
                      required
                    />

                    {selectedRole === 'beneficiary' ? (
                      <Input
                        type="date"
                        label="Date of Birth"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        required
                      />
                    ) : selectedRole === 'institution' ? (
                      <Input
                        type="password"
                        label="Password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    ) : null}

                    <Input
                      type="password"
                      label="Password"
                      placeholder="••••••••"
                      value={selectedRole === 'institution' ? formData.password : formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className={selectedRole === 'beneficiary' ? 'sr-only' : ''}
                    />

                    <Button type="submit" className="w-full">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In as {roles.find(r => r.id === selectedRole)?.label}
                    </Button>
                  </>
                )}
              </form>

              {selectedRole && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowRoleSelect(false)}
                >
                  ← Choose Different Role
                </Button>
              )}
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Demo environment • Sign in below
              </p>
              <div className="mt-2 text-xs space-y-1">
                <p><strong>Beneficiary:</strong> ID: 75031402048, DOB: 1975-03-14, Password: demo123</p>
                <p><strong>Institution:</strong> Ref: GIPF-2026-PROD, Password: demo123</p>
                <p><strong>Others:</strong> Email: (any), Password: demo123</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}