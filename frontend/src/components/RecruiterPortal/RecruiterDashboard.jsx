import React, { useState, useEffect } from 'react';
import { Building2, Plus, Sparkles, Filter, CheckCircle2, UserCheck, XCircle, ArrowUpRight, Search, FileText } from 'lucide-react';
import { api } from '../../services/api';

export default function RecruiterDashboard({ jobs, onJobCreated, onUpdateApplicationStatus }) {
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [rankedCandidates, setRankedCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [minCgpaFilter, setMinCgpaFilter] = useState(0);

  // New Job Form State
  const [newJob, setNewJob] = useState({
    title: '',
    company: 'Tech Enterprise Solutions',
    packageLpa: 16.0,
    minCgpa: 7.5,
    location: 'Bengaluru / Hybrid',
    description: '',
    requiredSkills: 'python, sql, git, data structures',
    departmentEligible: ['CSE', 'IT', 'ECE']
  });

  useEffect(() => {
    if (jobs && jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, selectedJobId]);

  useEffect(() => {
    if (selectedJobId) {
      loadRankedCandidates(selectedJobId);
    }
  }, [selectedJobId]);

  const loadRankedCandidates = async (jobId) => {
    setLoadingCandidates(true);
    try {
      const res = await api.rankCandidates(jobId);
      if (res.success && res.data) {
        setRankedCandidates(res.data);
      }
    } catch (err) {
      console.error("Error loading candidate rankings:", err);
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createJob(newJob);
      if (res.success && res.data) {
        onJobCreated(res.data);
        setShowPostModal(false);
        setSelectedJobId(res.data.id);
      }
    } catch (err) {
      console.error("Failed to post job:", err);
    }
  };

  const activeJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const filteredCandidates = rankedCandidates.filter(c => {
    if (minCgpaFilter > 0 && c.student.cgpa < minCgpaFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-300 border border-blue-400/30 uppercase tracking-wider">
              Recruiter & Talent Portal
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Automated Candidate NLP Ranking & Shortlisting
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Rank student applicant pools objectively based on cosine similarity between resume profiles and job requirement vectors.
          </p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Campus Opening</span>
        </button>
      </div>

      {/* Main Workspace */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Active Campus Drive:</span>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.company} - {j.title} ({j.packageLpa} LPA)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter CGPA ≥</span>
            <select
              value={minCgpaFilter}
              onChange={(e) => setMinCgpaFilter(parseFloat(e.target.value))}
              className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
            >
              <option value="0">All CGPA</option>
              <option value="7.5">7.5+ CGPA</option>
              <option value="8.0">8.0+ CGPA</option>
              <option value="8.5">8.5+ CGPA</option>
            </select>
          </div>
        </div>

        {/* Selected Job Requirements Summary */}
        {activeJob && (
          <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Role & Package</span>
              <span className="font-extrabold text-slate-900 text-sm">{activeJob.title}</span>
              <span className="text-emerald-700 font-bold ml-2">({activeJob.packageLpa} LPA)</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Eligibility Filter</span>
              <span className="font-semibold text-slate-800">Min CGPA: {activeJob.minCgpa} | Dept: {activeJob.departmentEligible.join(', ')}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Required Skills</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {(activeJob.requiredSkills || []).map(s => (
                  <span key={s} className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[10px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Candidate Ranking List */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Ranked Candidates by AI Relevance ({filteredCandidates.length})</span>
            <span>Shortlisting Decision</span>
          </div>

          {loadingCandidates ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Calculating NLP Cosine Similarity across student profiles...
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No candidates meet the selected criteria.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCandidates.map((c, index) => {
                const { student, matchPercentage, isEligible, matchedSkills, missingSkills, employabilityScore, tier } = c;

                return (
                  <div
                    key={student.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left: Rank, Name, Dept, CGPA */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 font-extrabold text-slate-700 flex items-center justify-center text-xs">
                        #{index + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{student.name}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                            {student.department}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {student.cgpa} CGPA
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span>Employability: <strong className="text-indigo-600">{employabilityScore}/100</strong> ({tier.split('-')[0]})</span>
                          <span>•</span>
                          <span>{student.email}</span>
                        </div>

                        {/* Skill overlap tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {matchedSkills.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ✓ {s}
                            </span>
                          ))}
                          {missingSkills.slice(0, 3).map(s => (
                            <span key={s} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-400">
                              miss: {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: AI Match Score & Action Buttons */}
                    <div className="flex items-center gap-4 self-end md:self-auto">
                      <div className="text-right">
                        <div className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                          matchPercentage >= 85
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : matchPercentage >= 65
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          <Sparkles className="w-3 h-3" />
                          <span>{matchPercentage}% Match</span>
                        </div>
                        <span className="text-[10px] block text-slate-400 mt-0.5 font-medium">
                          {isEligible ? 'Criteria Met' : 'CGPA Below Threshold'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onUpdateApplicationStatus(student.id, activeJob.id, 'Shortlisted', 'Shortlisted by Recruiter for Technical Screening')}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => onUpdateApplicationStatus(student.id, activeJob.id, 'Offered', 'Official Offer Extended')}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                        >
                          Offer
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Post Job Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Create New Placement Drive
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Post technical requirements and let the NLP engine auto-match qualified candidates.
            </p>

            <form onSubmit={handlePostJob} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Role Title</label>
                <input
                  type="text"
                  placeholder="e.g. SDE 1, Cloud Systems Engineer"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Package (CTC in LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newJob.packageLpa}
                    onChange={(e) => setNewJob({ ...newJob, packageLpa: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Minimum CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newJob.minCgpa}
                    onChange={(e) => setNewJob({ ...newJob, minCgpa: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Required Skills (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="python, react, docker, sql, algorithms"
                  value={newJob.requiredSkills}
                  onChange={(e) => setNewJob({ ...newJob, requiredSkills: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Description</label>
                <textarea
                  rows={3}
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  placeholder="Describe key responsibilities and expectations..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Post Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
