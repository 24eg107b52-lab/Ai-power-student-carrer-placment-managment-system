import React from 'react';
import { UserCheck, Sparkles, BrainCircuit, MessageSquareCode, Award, ArrowRight } from 'lucide-react';

export default function SystemWorkflowBanner({ activeStage, onStageClick }) {
  const stages = [
    { id: 'profile', label: 'Student Profile', icon: UserCheck, desc: 'Academic & Verified Skills' },
    { id: 'skills', label: 'Skill Analysis', icon: Sparkles, desc: 'Employability & Gap Analytics' },
    { id: 'matching', label: 'AI Matching', icon: BrainCircuit, desc: 'NLP Ranking & Fit Engine' },
    { id: 'prep', label: 'Interview Prep', icon: MessageSquareCode, desc: 'Mock Tests & Verbal Feedback' },
    { id: 'placement', label: 'Placement', icon: Award, desc: 'Offers & Campus Analytics' },
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 mb-8 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400 text-slate-950 uppercase tracking-wider">
              System Pipeline
            </span>
            <span className="text-xs text-indigo-200">
              Department of Computer Science & Engineering
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            End-to-End AI Placement Lifecycle Pipeline
          </h2>
        </div>
        <p className="text-xs text-slate-300 max-w-md">
          Continuous loop from student onboarding and predictive employability scoring to automated NLP job matching and final offer acceptance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative z-10">
        {stages.map((stg, idx) => {
          const Icon = stg.icon;
          const isActive = activeStage === stg.id;
          return (
            <button
              key={stg.id}
              onClick={() => onStageClick && onStageClick(stg.id)}
              className={`text-left p-3.5 rounded-xl border transition-all duration-200 group relative flex flex-col justify-between ${
                isActive
                  ? 'bg-gradient-to-br from-indigo-600 to-blue-700 border-indigo-400 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/50'
                  : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-slate-700/70 text-indigo-300 group-hover:text-white'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono font-medium opacity-60">
                  Step 0{idx + 1}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-0.5 group-hover:text-amber-300 transition-colors">
                  {stg.label}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {stg.desc}
                </p>
              </div>

              {idx < stages.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                  <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400">
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
