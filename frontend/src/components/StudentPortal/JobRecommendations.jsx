import React, { useState } from 'react';
import { Briefcase, Building, MapPin, DollarSign, Sparkles, CheckCircle2, Clock, AlertTriangle, Send, Check } from 'lucide-react';
import { fireConfetti } from '../../utils/confetti';

export default function JobRecommendations({ jobs, student, onApply, appliedJobIds = new Set() }) {
  const [filterEligibleOnly, setFilterEligibleOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [applyingId, setApplyingId] = useState(null);

  const filteredJobs = (jobs || []).filter(job => {
    const match = job.matchResult || {};
    if (filterEligibleOnly && !match.isEligible) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const titleMatch = job.title.toLowerCase().includes(q);
      const companyMatch = job.company.toLowerCase().includes(q);
      const skillMatch = (job.requiredSkills || []).some(s => s.toLowerCase().includes(q));
      return titleMatch || companyMatch || skillMatch;
    }
    return true;
  });

  const handleApplyClick = async (jobId) => {
    setApplyingId(jobId);
    try {
      await onApply(jobId);
      // Trigger celebration confetti
      fireConfetti();
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Briefcase className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              AI Job Recommendations & Fit Engine
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800">
              NLP Ranked
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Openings ranked using TF-IDF and Cosine similarity between your verified skill vector and live job requirements.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search role, company or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 w-52"
          />

          <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 select-none">
            <input
              type="checkbox"
              checked={filterEligibleOnly}
              onChange={(e) => setFilterEligibleOnly(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span>Eligible Only</span>
          </label>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
        {filteredJobs.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400 text-sm">
            No matching job openings found matching current criteria.
          </div>
        ) : (
          filteredJobs.map(job => {
            const match = job.matchResult || { matchPercentage: 75, isEligible: true, matchedSkills: [], missingSkills: [] };
            const isApplied = appliedJobIds.has(job.id);
            const isApplying = applyingId === job.id;

            return (
              <div
                key={job.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all bg-white flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Company, Location, Match Score */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-0.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.company}</span>
                        <span>•</span>
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.location}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h4>
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex flex-col items-end">
                      <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-xs ${
                        match.matchPercentage >= 85
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : match.matchPercentage >= 65
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <Sparkles className="w-3 h-3" />
                        <span>{match.matchPercentage}% Match</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {match.verdict || 'Good Fit'}
                      </span>
                    </div>
                  </div>

                  {/* Compensation & Criteria */}
                  <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                    <span className="flex items-center gap-1 font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      {job.packageLpa} LPA
                    </span>
                    <span className="text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                      Min CGPA: <strong>{job.minCgpa}</strong>
                    </span>
                    <span className="text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                      Openings: <strong>{job.openings}</strong>
                    </span>
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3.5 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Matched vs Missing Skills */}
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[11px] font-semibold text-slate-500">Skill Alignment:</div>
                    <div className="flex flex-wrap gap-1">
                      {(match.matchedSkills || []).map(sk => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1"
                        >
                          <Check className="w-2.5 h-2.5" />
                          {sk}
                        </span>
                      ))}
                      {(match.missingSkills || []).map(sk => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200"
                        >
                          +{sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Footer: Eligibility Status & 1-Click Apply */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px]">
                    {match.isEligible ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Criteria Met
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Min CGPA {job.minCgpa} Required
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleApplyClick(job.id)}
                    disabled={isApplied || isApplying}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                      isApplied
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Applied</span>
                      </>
                    ) : isApplying ? (
                      <span>Applying...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>1-Click Apply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
