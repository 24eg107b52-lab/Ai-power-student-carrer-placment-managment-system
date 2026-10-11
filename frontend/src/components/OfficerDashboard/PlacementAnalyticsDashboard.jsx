import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Award, Building, DollarSign, Download, Filter, Search, CheckCircle, ExternalLink } from 'lucide-react';

export default function PlacementAnalyticsDashboard({ analytics, students }) {
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  if (!analytics) return null;

  const {
    overallPlacementRate = 87.0,
    totalRegisteredStudents = 1240,
    totalPlacedStudents = 1079,
    highestPackageLpa = 44.5,
    averagePackageLpa = 9.8,
    activeRecruiters = 156,
    departmentPlacementRates = [],
    placementTrends = []
  } = analytics;

  const filteredStudents = (students || []).filter(s => {
    if (departmentFilter !== 'All' && s.department !== departmentFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || (s.skills || []).some(sk => sk.includes(q));
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ["ID", "Name", "Department", "CGPA", "Employability Score", "Status", "Company", "Package (LPA)"];
    const rows = filteredStudents.map(s => [
      s.id,
      `"${s.name}"`,
      s.department,
      s.cgpa,
      s.employabilityScore || 80,
      s.status,
      `"${s.placedCompany || 'N/A'}"`,
      s.placedPackageLpa || 'N/A'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Placement_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner matching Department of Computer Science & Engineering Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400 text-slate-950 uppercase tracking-wider">
              Institutional Intelligence
            </span>
            <span className="text-xs text-indigo-200">
              Department of Computer Science & Engineering
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Placement Analytics & Predictive Trend Dashboard
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Centralized institutional monitoring of department-wise placement metrics, employability distributions, and forecasting trends (Abstract Fig 3).
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-md transition self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-indigo-600" />
          <span>Export Official Placement Report</span>
        </button>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Placement Rate</span>
          <span className="text-2xl font-extrabold text-indigo-600 tracking-tight">{overallPlacementRate}%</span>
          <span className="text-[10px] text-emerald-600 block mt-0.5 font-semibold">↑ +3.0% YoY Growth</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Students Placed</span>
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{totalPlacedStudents}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">of {totalRegisteredStudents} registered</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Highest CTC</span>
          <span className="text-2xl font-extrabold text-emerald-600 tracking-tight">{highestPackageLpa} LPA</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Google Cloud Tier-1</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Average CTC</span>
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{averagePackageLpa} LPA</span>
          <span className="text-[10px] text-emerald-600 block mt-0.5 font-semibold">↑ +11.4% vs 2024</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Active Recruiters</span>
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{activeRecruiters}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Product & Service firms</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Total Job Offers</span>
          <span className="text-2xl font-extrabold text-blue-600 tracking-tight">{analytics.totalJobOffers || 1380}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Multiple offers secured</span>
        </div>
      </div>

      {/* Primary Section: Replication of Abstract Figure 3 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <BarChart3 className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Placement Analytics Dashboard (Abstract Fig 3)
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Department-wise performance breakdown and institutional placement rate indicator.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Batch of 2026
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Department-wise Bar Chart (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Placement Rate by Department
            </h4>

            <div className="space-y-4">
              {departmentPlacementRates.map(dept => {
                const isTop = dept.rate >= 90;

                return (
                  <div key={dept.department} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-14 font-extrabold text-slate-900">{dept.department}</span>
                        <span className="text-slate-400">
                          ({dept.placed}/{dept.total} placed)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 text-[11px]">Avg: {dept.avgCtc} LPA</span>
                        <span className="font-extrabold text-slate-900 w-12 text-right">{dept.rate}%</span>
                      </div>
                    </div>

                    {/* Bar visualization */}
                    <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          isTop 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                        }`}
                        style={{ width: `${dept.rate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Benchmark target: 85% institutional minimum</span>
              <span>CSE & IT leading overall product conversions</span>
            </div>
          </div>

          {/* 87% Placed Circular Gauge (Right 4 cols) - Matches Fig 3 Exactly */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-amber-50/20 border border-slate-200/80 text-center">
            <div className="relative w-44 h-44 flex items-center justify-center mb-3">
              {/* Radial donut ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-slate-200"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-amber-500 transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray="238.76"
                  strokeDashoffset={238.76 - (238.76 * overallPlacementRate) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  {overallPlacementRate}%
                </span>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Placed
                </span>
              </div>
            </div>

            <h5 className="font-bold text-slate-900 text-sm mb-1">
              Campus Placement Success
            </h5>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Consolidated across 5 academic engineering departments with 1,079 accepted corporate offers.
            </p>
          </div>

        </div>
      </div>

      {/* Multi-Year Trend Forecast & Predictive Analytics */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Historical Placement & CTC Trajectory (2022 - 2026 Projected)
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-400">
            Predictive ML Forecasting Model
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          {placementTrends.map(t => (
            <div
              key={t.year}
              className={`p-4 rounded-xl border ${t.projected ? 'border-indigo-300 bg-indigo-50/40' : 'border-slate-200 bg-slate-50/50'}`}
            >
              <span className="text-xs font-extrabold text-slate-500 block mb-1">
                {t.year} {t.projected && <span className="text-[10px] text-indigo-600 font-bold">(Current)</span>}
              </span>
              <span className="text-xl font-black text-slate-900 block">
                {t.placementRate}%
              </span>
              <span className="text-xs font-semibold text-emerald-600 block mt-1">
                Avg: {t.avgPackage} LPA
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Student Directory Table with Dynamic Employability Scores */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Student Employability & Placement Directory
            </h3>
            <p className="text-xs text-slate-500">
              Filter by department and track live student readiness and hiring status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-44"
              />
            </div>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50"
            >
              <option value="All">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Dept</th>
                <th className="py-3 px-3">CGPA</th>
                <th className="py-3 px-3">Employability Score</th>
                <th className="py-3 px-3">Target Track</th>
                <th className="py-3 px-3">Placement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 block">{s.name}</span>
                    <span className="text-[11px] text-slate-400">{s.email}</span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-800">{s.department}</td>
                  <td className="py-3.5 px-3 font-bold text-slate-900">{s.cgpa}</td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${s.employabilityScore || 80}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-900">{s.employabilityScore || 80}/100</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-medium text-slate-600">{s.targetRole}</td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      s.status === 'Placed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : s.status === 'Shortlisted'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : s.status === 'Interview Scheduled'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {s.status} {s.placedCompany ? `• ${s.placedCompany}` : ''}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
