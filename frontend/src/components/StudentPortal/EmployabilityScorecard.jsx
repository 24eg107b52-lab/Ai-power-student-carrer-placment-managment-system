import React from 'react';
import { Target, Award, BookOpen, AlertCircle, CheckCircle, ExternalLink, RefreshCw, Zap } from 'lucide-react';

export default function EmployabilityScorecard({ scorecard, student, onRefreshScore, isRefreshing }) {
  if (!scorecard) return null;

  const { score, tier, badgeColor, readinessStatement, breakdown, missingCoreSkills, recommendedResources, targetRole } = scorecard;

  // Color classes mapping
  const getScoreColor = (val) => {
    if (val >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (val >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (val >= 55) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getBarColor = (val) => {
    if (val >= 85) return 'bg-emerald-500';
    if (val >= 70) return 'bg-blue-600';
    if (val >= 55) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
      {/* Header with Title and Recalculate */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Target className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Dynamic Employability Scorecard
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-800">
              Predictive ML Model
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Synthesized across academic consistency, verified technical competencies, mock assessments, and verbal readiness.
          </p>
        </div>

        <button
          onClick={onRefreshScore}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Re-evaluating...' : 'Recalculate AI Score'}</span>
        </button>
      </div>

      {/* Main Grid: Score Radial & Factor Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
        
        {/* Left: Overall Score Radial Card */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-indigo-50/30 border border-slate-200/80 text-center">
          <div className="relative w-36 h-36 flex items-center justify-center mb-3">
            {/* SVG circular progress ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-200"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-indigo-600 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * score) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {score}
              </span>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-bold border mb-2 ${getScoreColor(score)}`}>
            {tier}
          </div>

          <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
            {readinessStatement}
          </p>
        </div>

        {/* Right: 4-Pillar Score Breakdown */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Academic Score */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-600">
                  Academic Performance (30%)
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {breakdown.academicScore} / 100
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getBarColor(breakdown.academicScore)}`}
                  style={{ width: `${breakdown.academicScore}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500">
                CGPA: {student?.cgpa || '8.5'} | Backlogs: {student?.backlogs || 0}
              </span>
            </div>

            {/* Technical Skills Score */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-600">
                  Technical Depth & Certs (30%)
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {breakdown.technicalScore} / 100
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getBarColor(breakdown.technicalScore)}`}
                  style={{ width: `${breakdown.technicalScore}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500">
                {(student?.skills || []).length} Verified Skills | {(student?.certifications || []).length} Certifications
              </span>
            </div>

            {/* Assessment Score */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-600">
                  Aptitude & Coding Tests (25%)
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {breakdown.assessmentScore} / 100
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getBarColor(breakdown.assessmentScore)}`}
                  style={{ width: `${breakdown.assessmentScore}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500">
                Based on continuous campus aptitude rounds
              </span>
            </div>

            {/* Mock Interview Score */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-600">
                  Interview Readiness & Verbal (15%)
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {breakdown.interviewScore} / 100
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getBarColor(breakdown.interviewScore)}`}
                  style={{ width: `${breakdown.interviewScore}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500">
                Evaluated via AI simulated mock interview module
              </span>
            </div>

          </div>

          {/* Target Role & Skill Gap Summary Bar */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-slate-800">
                Targeted Role Benchmark: <strong className="text-indigo-600">{targetRole}</strong>
              </span>
            </div>
            {missingCoreSkills && missingCoreSkills.length > 0 ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Gaps:
                </span>
                {missingCoreSkills.map(sk => (
                  <span key={sk} className="text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md">
                    +{sk}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> All baseline benchmark skills met!
              </span>
            )}
          </div>

        </div>
      </div>

      {/* Upskilling Recommendations Section */}
      {recommendedResources && recommendedResources.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Personalized Upskilling Curriculum & Roadmaps
              </h4>
            </div>
            <span className="text-xs text-slate-500">
              Curated by AI to elevate candidate tier
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recommendedResources.map((res, i) => (
              <a
                key={i}
                href={res.link}
                target="_blank"
                rel="noreferrer"
                className="group p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {res.type || 'Course'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {res.duration || '2-4 wks'}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {res.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Provider: {res.provider}
                  </p>
                </div>
                
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-indigo-600 group-hover:text-indigo-700">
                  <span>Start Upskilling</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
