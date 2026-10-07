import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  FileCheck,
  ArrowRight,
  Building2,
  Users,
  Scale,
  TrendingUp,
  Briefcase,
  HeartHandshake,
  Plane,
  Lock,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/Button';
import { formatCurrencyShort } from '@/utils/format';

const benefitCategories = [
  { name: 'Pension', icon: Briefcase, description: 'Pension fund benefits from current or former employers', color: 'bg-primary-50 text-primary-600' },
  { name: 'Retirement Fund', icon: TrendingUp, description: 'Retirement savings and provident fund entitlements', color: 'bg-blue-50 text-blue-600' },
  { name: 'Life Insurance', icon: ShieldCheck, description: 'Life insurance policies and related benefits', color: 'bg-success-50 text-success-600' },
  { name: 'Funeral Benefit', icon: HeartHandshake, description: 'Funeral cover and associated benefits', color: 'bg-accent-50 text-accent-600' },
  { name: 'Employee Benefit', icon: Users, description: 'Employee benefit schemes and entitlements', color: 'bg-indigo-50 text-indigo-600' },
  { name: 'Death Benefit', icon: Plane, description: 'Death benefits and beneficiary entitlements', color: 'bg-slate-100 text-slate-600' },
];

const steps = [
  { title: 'Tell us about yourself', description: 'Provide your identity information securely.' },
  { title: 'Search for potential benefits', description: 'We scan benefit records across institutions.' },
  { title: 'Review potential matches', description: 'See benefits that may belong to you.' },
  { title: 'Verify your information', description: 'Confirm your identity and upload evidence.' },
  { title: 'Start your claim', description: 'Begin the claims process with the holding institution.' },
];

const trustItems = [
  { icon: Lock, title: 'Does not hold customer funds', description: 'OwaFind never holds or controls your money.' },
  { icon: Scale, title: 'Does not decide legal entitlement', description: 'The institution holding the benefit makes all final decisions.' },
  { icon: Building2, title: 'Connects people with institutions', description: 'We bridge the gap between you and the benefit holder.' },
  { icon: Eye, title: 'Protects sensitive information', description: 'Your data is encrypted and used only for matching.' },
];

const ecosystem = ['Pension Funds', 'Insurers', 'Employers', 'Administrators', 'Regulators'];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo size="md" />
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">How it Works</a>
            <a href="#benefits" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Benefits</a>
            <a href="#trust" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Trust</a>
            <a href="#ecosystem" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Ecosystem</a>
          </div>
          <Link to="/app/dashboard">
            <Button size="sm" variant="primary">
              Sign In
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl" />
        <div className="absolute top-40 left-10 w-96 h-96 bg-accent-200/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight text-balance">
                Find What May<br />Belong to You
              </h1>
              <p className="text-lg text-slate-600 mt-6 max-w-lg leading-relaxed">
                You may have financial benefits you've lost track of — pensions, retirement funds,
                insurance payouts, or employee benefits. OwaFind helps you discover them and guides
                you through claiming what's yours.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link to="/app/discovery">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Search className="w-4 h-4" />
                    Find My Benefits
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    How OwaFind Works
                  </Button>
                </a>
              </div>
              <p className="text-sm text-slate-400 mt-4">
                Free to search • No obligation • Your data stays private
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-w-md ml-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-success-600 bg-success-50 px-2.5 py-1 rounded-full">Potential Match Found</span>
                  <span className="text-xs text-slate-400">Simulated</span>
                </div>
                <h3 className="font-display font-semibold text-slate-900 text-lg">Retirement Fund Benefit</h3>
                <p className="text-sm text-slate-500 mt-1">Government Institutions Pension Fund (GIPF)</p>
                <div className="mt-4">
                  <p className="text-xs text-slate-400">Potential value</p>
                  <p className="text-3xl font-bold font-display text-primary-700">{formatCurrencyShort(48750)}</p>
                </div>
                <div className="mt-4 space-y-2">
                  {['Name match', 'Date of birth match', 'National ID match', 'Employment history match'].map((s) => (
                    <div key={s} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-success-500" />
                      {s}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Match confidence</span>
                    <span className="text-lg font-bold text-success-600">94%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '94%' }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="h-full bg-success-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg border border-slate-200 p-4 hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Protected by</p>
                    <p className="text-sm font-semibold text-slate-700">OwaFind Trust</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="trust" className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">Built on trust and transparency</h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
              OwaFind is designed to protect you while helping you discover potential benefits.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-display font-semibold text-slate-900 text-base">{item.title}</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">How OwaFind works</h2>
            <p className="text-slate-600 mt-3">Five simple steps from discovery to claim</p>
          </div>
          <div className="space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-6"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-primary-600 text-white font-display font-bold flex items-center justify-center text-lg shrink-0">
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && <div className="w-0.5 h-16 bg-slate-200 my-2" />}
                </div>
                <div className="pt-2 pb-8">
                  <h3 className="font-display font-semibold text-slate-900 text-lg">{step.title}</h3>
                  <p className="text-slate-600 mt-1">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/app/discovery">
              <Button size="lg">
                Start Your Search
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefit Categories */}
      <section id="benefits" className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">Benefits you may have</h2>
            <p className="text-slate-600 mt-3">Explore the types of financial benefits OwaFind can help you discover</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefitCategories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm transition-all hover:shadow-md cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-slate-900 text-lg">{cat.name}</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{cat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section id="ecosystem" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">Built for an ecosystem of</h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            The proposed OwaFind ecosystem — institutions OwaFind would connect with under regulatory oversight.
            No such connections exist today; this is a concept for demonstration.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {ecosystem.map((e, i) => (
              <motion.div
                key={e}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="px-6 py-3 bg-white rounded-xl border border-slate-200 shadow-sm font-display font-medium text-slate-700"
              >
                {e}
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-6 max-w-md mx-auto">
            Proposed ecosystem shown for demonstration purposes only. OwaFind does not have integrations,
            partnerships or data-sharing agreements with any institution shown, unless explicitly verified.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 bg-primary-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Ready to find what may belong to you?</h2>
          <p className="text-primary-200 mt-4 max-w-xl mx-auto">
            Start your free search today. No obligation, no cost. Your information stays private.
          </p>
          <Link to="/app/discovery" className="inline-block mt-8">
            <Button size="lg" variant="secondary" className="bg-white text-primary-700 hover:bg-primary-50">
              <Search className="w-4 h-4" />
              Find My Benefits
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Logo size="md" light />
              <p className="text-slate-400 text-sm mt-4 max-w-xs">
                OwaFind identifies potential benefits and facilitates the verification and claims process.
                A potential match does not establish legal entitlement.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/app/discovery" className="text-slate-400 text-sm hover:text-white transition-colors">Find Benefits</Link></li>
                <li><Link to="/app/dashboard" className="text-slate-400 text-sm hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/app/support" className="text-slate-400 text-sm hover:text-white transition-colors">Help & Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Important</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                This is a demonstration environment. All data is simulated. OwaFind does not hold customer
                funds, determine legal entitlement, or release payments. Final verification and payment
                remain with the institution holding the benefit.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs">© 2026 OwaFind. Demonstration prototype. All data is fictional.</p>
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <span className="w-2 h-2 rounded-full bg-accent-500" />
              Demo Environment
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
