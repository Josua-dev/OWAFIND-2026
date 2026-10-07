import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileCheck, UserCheck, Target, FileText, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { benefitService } from '@/services';
import { useApp } from '@/context/AppContext';

const stages = [
  { icon: Search, label: 'Preparing your search', description: 'Setting up your secure search request' },
  { icon: FileCheck, label: 'Checking available benefit records', description: 'Scanning records across institutions' },
  { icon: UserCheck, label: 'Comparing identity information', description: 'Matching your details against records' },
  { icon: Target, label: 'Analysing potential matches', description: 'Calculating match confidence scores' },
  { icon: FileText, label: 'Preparing your results', description: 'Compiling your potential benefits' },
];

export function SearchingPage() {
  const navigate = useNavigate();
  const { profile } = useApp();
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const run = async () => {
      await benefitService.searchBenefits(profile);
      const timers: ReturnType<typeof setTimeout>[] = [];
      for (let i = 0; i < stages.length; i++) {
        timers.push(setTimeout(() => setCurrentStage(i), i * 600));
      }
      timers.push(setTimeout(() => navigate('/app/matches'), stages.length * 600 + 400));
      return timers;
    };
    const timers = run();
    return () => { timers.then((ts) => ts.forEach(clearTimeout)); };
  }, [navigate, profile]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6">
        <Logo size="sm" />
      </header>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="relative inline-flex items-center justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 rounded-full border-4 border-slate-200 border-t-primary-600"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center"
              >
                <Search className="w-5 h-5 text-white" />
              </motion.div>
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Searching for your benefits</h1>
            <p className="text-slate-500 mt-2 text-sm">This may take a few moments...</p>
          </div>

          <div className="space-y-3">
            {stages.map((stage, i) => {
              const Icon = stage.icon;
              const isComplete = i < currentStage;
              const isCurrent = i === currentStage;
              return (
                <motion.div
                  key={stage.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isComplete ? 'bg-success-50' : isCurrent ? 'bg-primary-50' : 'bg-white'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    isComplete ? 'bg-success-500 text-white' : isCurrent ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isComplete ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <CheckCircle2 className="w-5 h-5" />
                      </motion.div>
                    ) : isCurrent ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                        <Icon className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isComplete ? 'text-success-700' : isCurrent ? 'text-primary-700' : 'text-slate-400'}`}>
                      {stage.label}
                    </p>
                    {isCurrent && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-slate-500 mt-0.5"
                      >
                        {stage.description}
                      </motion.p>
                    )}
                  </div>
                  {isCurrent && (
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex gap-1"
                    >
                      {[0, 1, 2].map((d) => (
                        <div key={d} className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
