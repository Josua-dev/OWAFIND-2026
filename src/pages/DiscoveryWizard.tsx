import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Briefcase,
  ListChecks,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  X,
  Lock,
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/Button';
import { Input, Select, Checkbox } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { useApp } from '@/context/AppContext';
import { benefitService } from '@/services';
import { cn } from '@/utils/format';
import type { BenefitType, EmploymentEntry } from '@/types';

const steps = [
  { number: 1, label: 'About You', icon: User },
  { number: 2, label: 'Employment History', icon: Briefcase },
  { number: 3, label: 'Benefit Types', icon: ListChecks },
  { number: 4, label: 'Consent', icon: ShieldCheck },
];

const benefitTypes: { value: BenefitType; description: string }[] = [
  { value: 'Pension', description: 'Pension fund benefits' },
  { value: 'Retirement Fund', description: 'Retirement savings and provident funds' },
  { value: 'Life Insurance', description: 'Life insurance policies' },
  { value: 'Funeral Benefit', description: 'Funeral cover benefits' },
  { value: 'Employee Benefit', description: 'Employee benefit schemes' },
  { value: 'Death Benefit', description: 'Death and beneficiary benefits' },
];

export function DiscoveryWizard() {
  const navigate = useNavigate();
  const { profile, setProfile, setConsentGiven } = useApp();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    dateOfBirth: profile.dateOfBirth,
    nationalId: profile.nationalId,
    previousName: profile.previousName,
    phone: profile.phone,
    email: profile.email,
  });

  const [employers, setEmployers] = useState<EmploymentEntry[]>(
    profile.employmentHistory.length > 0
      ? profile.employmentHistory
      : [{ id: 'emp-new-1', employer: '', employeeNumber: '', startDate: '', endDate: '' }]
  );

  const [selectedBenefits, setSelectedBenefits] = useState<BenefitType[]>([
    'Pension',
    'Retirement Fund',
    'Life Insurance',
  ]);

  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!formData.firstName.trim()) e.firstName = 'First name is required';
      if (!formData.lastName.trim()) e.lastName = 'Last name is required';
      if (!formData.dateOfBirth) e.dateOfBirth = 'Date of birth is required';
      if (!formData.nationalId.trim()) e.nationalId = 'National ID is required';
      else if (!/^\d{11,13}$/.test(formData.nationalId.replace(/\s/g, '')))
        e.nationalId = 'National ID should be 11–13 digits';
      if (!formData.phone.trim()) e.phone = 'Phone number is required';
      if (!formData.email.trim()) e.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Please enter a valid email';
    }
    if (s === 2) {
      const validEmployers = employers.filter((emp) => emp.employer.trim());
      if (validEmployers.length === 0) e.employers = 'Add at least one employer';
    }
    if (s === 3) {
      if (selectedBenefits.length === 0) e.benefits = 'Select at least one benefit type';
    }
    if (s === 4) {
      if (!consent) e.consent = 'You must consent to proceed';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    if (step < 4) {
      setDirection(1);
      setStep(step + 1);
    } else {
      handleSearch();
    }
  };

  const back = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const handleSearch = async () => {
    setProfile({
      ...profile,
      ...formData,
      employmentHistory: employers.filter((e) => e.employer.trim()),
      consentGiven: true,
      consentDate: new Date().toISOString(),
    });
    setConsentGiven(true);
    navigate('/app/searching');
  };

  const addEmployer = () => {
    setEmployers([...employers, { id: `emp-new-${Date.now()}`, employer: '', employeeNumber: '', startDate: '', endDate: '' }]);
  };

  const removeEmployer = (id: string) => {
    setEmployers(employers.filter((e) => e.id !== id));
  };

  const updateEmployer = (id: string, field: keyof EmploymentEntry, value: string) => {
    setEmployers(employers.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const toggleBenefit = (b: BenefitType) => {
    setSelectedBenefits((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6">
        <Logo size="sm" />
        <div className="ml-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate('/app/dashboard')}>
            Cancel
          </Button>
        </div>
      </header>

      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">Find Your Benefits</h1>
          <p className="text-slate-500 mt-1">Complete the steps below to search for potential benefits.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center mb-8 overflow-x-auto scrollbar-thin pb-2">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isComplete = step > s.number;
            const isCurrent = step === s.number;
            return (
              <div key={s.number} className="flex items-center shrink-0">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0',
                      isComplete ? 'bg-success-500 text-white' : isCurrent ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'
                    )}
                  >
                    {isComplete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={cn(
                    'text-sm font-medium hidden sm:block',
                    isCurrent ? 'text-slate-900' : isComplete ? 'text-success-600' : 'text-slate-400'
                  )}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={cn('w-8 sm:w-16 h-0.5 mx-1 sm:mx-2', isComplete ? 'bg-success-300' : 'bg-slate-200')} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8"
          >
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-display text-lg font-semibold text-slate-900">About You</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Tell us about yourself so we can search for your benefits.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="First name" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} error={errors.firstName} />
                  <Input label="Last name" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} error={errors.lastName} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Date of birth" type="date" required value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} error={errors.dateOfBirth} />
                  <Input label="National ID" required value={formData.nationalId} onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })} error={errors.nationalId} hint="11–13 digits" />
                </div>
                <Input label="Previous / maiden name" value={formData.previousName} onChange={(e) => setFormData({ ...formData, previousName: e.target.value })} hint="If applicable" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Phone" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} error={errors.phone} placeholder="+264 81 234 5678" />
                  <Input label="Email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={errors.email} />
                </div>
                <Alert tone="info" className="mt-4">
                  <div className="flex items-start gap-2">
                    <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>Your information is encrypted and used only for matching. We never share your data without consent.</span>
                  </div>
                </Alert>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-display text-lg font-semibold text-slate-900">Employment History</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Add employers you've worked for. This helps us match benefit records.</p>
                </div>
                {errors.employers && <Alert tone="error">{errors.employers}</Alert>}
                <div className="space-y-4">
                  {employers.map((emp, i) => (
                    <div key={emp.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Employer {i + 1}</span>
                        {employers.length > 1 && (
                          <button onClick={() => removeEmployer(emp.id)} className="text-slate-400 hover:text-error-500 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <Input label="Employer name" value={emp.employer} onChange={(e) => updateEmployer(emp.id, 'employer', e.target.value)} placeholder="e.g. NamPower" />
                      <Input label="Employee number" value={emp.employeeNumber} onChange={(e) => updateEmployer(emp.id, 'employeeNumber', e.target.value)} hint="If known" />
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Input label="Start date" type="month" value={emp.startDate} onChange={(e) => updateEmployer(emp.id, 'startDate', e.target.value)} />
                        <Input label="End date" type="month" value={emp.endDate} onChange={(e) => updateEmployer(emp.id, 'endDate', e.target.value)} hint="Leave blank if current" />
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" onClick={addEmployer} className="w-full">
                  <Plus className="w-4 h-4" />
                  Add another employer
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-display text-lg font-semibold text-slate-900">Benefit Types</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Select the types of benefits you'd like to search for.</p>
                </div>
                {errors.benefits && <Alert tone="error">{errors.benefits}</Alert>}
                <div className="grid sm:grid-cols-2 gap-3">
                  {benefitTypes.map((b) => {
                    const selected = selectedBenefits.includes(b.value);
                    return (
                      <button
                        key={b.value}
                        onClick={() => toggleBenefit(b.value)}
                        className={cn(
                          'text-left p-4 rounded-xl border transition-all',
                          selected
                            ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-800 text-sm">{b.value}</span>
                          <div className={cn(
                            'w-5 h-5 rounded-md border flex items-center justify-center transition-all',
                            selected ? 'bg-primary-600 border-primary-600' : 'border-slate-300'
                          )}>
                            {selected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{b.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-display text-lg font-semibold text-slate-900">Consent</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Please review and consent to the search.</p>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
                  <h3 className="font-semibold text-sm text-slate-800">What information will be searched?</h3>
                  <ul className="text-sm text-slate-600 space-y-1.5">
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success-500 mt-0.5 shrink-0" /> Your name, date of birth, and national ID</li>
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success-500 mt-0.5 shrink-0" /> Your employment history</li>
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success-500 mt-0.5 shrink-0" /> Previous or maiden names</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
                  <h3 className="font-semibold text-sm text-slate-800">Why is this required?</h3>
                  <p className="text-sm text-slate-600">We need this information to search benefit records held by institutions and identify potential matches that may belong to you.</p>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
                  <h3 className="font-semibold text-sm text-slate-800">What OwaFind does</h3>
                  <ul className="text-sm text-slate-600 space-y-1.5">
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success-500 mt-0.5 shrink-0" /> Identifies potential benefit matches</li>
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success-500 mt-0.5 shrink-0" /> Guides you through the claims process</li>
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success-500 mt-0.5 shrink-0" /> Connects you with the holding institution</li>
                  </ul>
                </div>
                <div className="bg-error-50 rounded-xl border border-error-200 p-5 space-y-3">
                  <h3 className="font-semibold text-sm text-error-800">What OwaFind does NOT do</h3>
                  <ul className="text-sm text-error-700 space-y-1.5">
                    <li className="flex items-start gap-2"><X className="w-4 h-4 mt-0.5 shrink-0" /> Does not hold or control customer funds</li>
                    <li className="flex items-start gap-2"><X className="w-4 h-4 mt-0.5 shrink-0" /> Does not determine legal entitlement</li>
                    <li className="flex items-start gap-2"><X className="w-4 h-4 mt-0.5 shrink-0" /> Does not approve or release payments</li>
                  </ul>
                </div>
                {errors.consent && <Alert tone="error">{errors.consent}</Alert>}
                <div className="bg-white rounded-xl border-2 border-slate-200 p-4">
                  <Checkbox
                    checked={consent}
                    onChange={setConsent}
                    label="I understand and consent to OwaFind searching for potential benefits that may belong to me."
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
              <Button variant="ghost" onClick={back} disabled={step === 1}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button onClick={next}>
                {step === 4 ? 'Search for Benefits' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
