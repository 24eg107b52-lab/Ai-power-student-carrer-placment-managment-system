import React from 'react';
import { Sparkles, GraduationCap, Building2, BarChart3, Users, CheckCircle2 } from 'lucide-react';

export default function Navbar({ activeRole, setActiveRole, currentStudent, students, onSelectStudent, isOnline }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  CareerPulse <span className="text-blue-600">AI</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                  v2.0 NLP Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                AI-Powered Student Career & Placement Management System
              </p>
            </div>
          </div>

          {/* Role Navigation Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveRole('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeRole === 'student'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Portal</span>
            </button>

            <button
              onClick={() => setActiveRole('recruiter')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeRole === 'recruiter'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Recruiter Portal</span>
            </button>

            <button
              onClick={() => setActiveRole('officer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeRole === 'officer'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Placement Officer</span>
            </button>
          </div>

          {/* Right Controls: Student switcher if in student mode */}
          <div className="hidden lg:flex items-center gap-3">
            {activeRole === 'student' && students && students.length > 0 && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs text-slate-500 font-medium">Active:</span>
                <select
                  value={currentStudent?.id || ''}
                  onChange={(e) => onSelectStudent(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.department} - {st.cgpa} CGPA)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>AI Engine Live</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
