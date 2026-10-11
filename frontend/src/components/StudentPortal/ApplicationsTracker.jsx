import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Building, DollarSign, Calendar, ChevronRight } from 'lucide-react';

export default function ApplicationsTracker({ applications }) {
  const stagesOrder = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Offered'];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Offered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Interview Scheduled':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Shortlisted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Clock className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Application Tracker & Hiring Pipeline
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800">
              {(applications || []).length} Active Applications
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time status updates as placement cell and recruiting teams progress candidates through hiring stages.
          </p>
        </div>
      </div>

      {/* Applications List */}
      <div className="divide-y divide-slate-100 pt-2">
        {(!applications || applications.length === 0) ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            No active job applications yet. Browse the AI Job Recommendations tab to apply.
          </div>
        ) : (
          applications.map(app => {
            const currentStageIndex = stagesOrder.indexOf(app.status);

            return (
              <div key={app.id} className="py-5 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{app.company}</span>
                      <span>•</span>
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{app.packageLpa} LPA</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">
                      {app.jobTitle}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                      AI Match: <strong className="text-blue-600">{app.matchScore}%</strong>
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Pipeline Step Progress Bar */}
                {app.status !== 'Rejected' && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {stagesOrder.map((stg, sIdx) => {
                        const isDone = sIdx <= currentStageIndex;
                        const isCurrent = sIdx === currentStageIndex;

                        return (
                          <div key={stg} className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 transition-all ${
                              isCurrent
                                ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                                : isDone
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-200 text-slate-500'
                            }`}>
                              {isDone ? '✓' : sIdx + 1}
                            </div>
                            <span className={`text-[10px] font-semibold ${
                              isCurrent ? 'text-blue-600 font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'
                            }`}>
                              {stg}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {app.notes && (
                  <p className="text-xs text-slate-500 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                    <strong className="text-slate-700">Recruiter Feedback: </strong> {app.notes}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
