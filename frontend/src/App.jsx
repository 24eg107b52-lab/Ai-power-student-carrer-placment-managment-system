import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SystemWorkflowBanner from './components/SystemWorkflowBanner';
import EmployabilityScorecard from './components/StudentPortal/EmployabilityScorecard';
import JobRecommendations from './components/StudentPortal/JobRecommendations';
import MockInterviewModule from './components/StudentPortal/MockInterviewModule';
import AptitudeAssessment from './components/StudentPortal/AptitudeAssessment';
import ApplicationsTracker from './components/StudentPortal/ApplicationsTracker';
import ProfileManager from './components/StudentPortal/ProfileManager';
import ResumeParserModal from './components/StudentPortal/ResumeParserModal';
import RecruiterDashboard from './components/RecruiterPortal/RecruiterDashboard';
import PlacementAnalyticsDashboard from './components/OfficerDashboard/PlacementAnalyticsDashboard';
import { api } from './services/api';
import { Sparkles, GraduationCap, Briefcase, MessageSquareCode, Award, Clock, User, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeRole, setActiveRole] = useState('student'); // 'student' | 'recruiter' | 'officer'
  const [activeStudentTab, setActiveStudentTab] = useState('scorecard'); // 'scorecard' | 'jobs' | 'interview' | 'aptitude' | 'applications' | 'profile'
  
  // Data states
  const [students, setStudents] = useState([]);
  const [currentStudentId, setCurrentStudentId] = useState('std-101');
  const [currentStudent, setCurrentStudent] = useState(null);
  const [scorecard, setScorecard] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [isRefreshingScore, setIsRefreshingScore] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Load initial global data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [studentsRes, jobsRes, analyticsRes] = await Promise.all([
        api.getStudents(),
        api.getJobs(),
        api.getAnalyticsDashboard()
      ]);

      if (studentsRes.success) setStudents(studentsRes.data);
      if (jobsRes.success) setJobs(jobsRes.data);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);

      const activeId = currentStudentId || studentsRes.data[0]?.id;
      if (activeId) {
        await loadStudentDetails(activeId);
      }
    } catch (err) {
      console.warn("Backend API not reachable directly, using resilient fallbacks:", err);
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentDetails = async (id) => {
    try {
      const [studentRes, appsRes, matchedJobsRes] = await Promise.all([
        api.getStudent(id),
        api.getApplications({ studentId: id }),
        api.getJobs({ studentId: id })
      ]);

      if (studentRes.success) {
        setCurrentStudent(studentRes.data);
        setScorecard(studentRes.data.scorecard);
      }
      if (appsRes.success) {
        setApplications(appsRes.data);
      }
      if (matchedJobsRes.success) {
        setJobs(matchedJobsRes.data);
      }
    } catch (err) {
      console.error("Failed to load student details:", err);
    }
  };

  const handleSelectStudent = async (studentId) => {
    setCurrentStudentId(studentId);
    await loadStudentDetails(studentId);
  };

  const handleRefreshScore = async () => {
    if (!currentStudentId) return;
    setIsRefreshingScore(true);
    try {
      const res = await api.getEmployability(currentStudentId);
      if (res.success) {
        setScorecard(res.data);
      }
    } catch (err) {
      console.error("Score refresh error:", err);
    } finally {
      setIsRefreshingScore(false);
    }
  };

  const handleUpdateProfile = async (id, updatedData) => {
    const res = await api.updateStudent(id, updatedData);
    if (res.success) {
      setCurrentStudent(res.data);
      setScorecard(res.data.scorecard);
      // Reload matched jobs with new skills
      const matched = await api.getJobs({ studentId: id });
      if (matched.success) setJobs(matched.data);
    }
  };

  const handleSkillsExtracted = async (extractedSkills, parseResult) => {
    if (!currentStudent) return;
    const combinedSkills = Array.from(new Set([...(currentStudent.skills || []), ...extractedSkills]));
    const updates = {
      skills: combinedSkills
    };
    if (parseResult.cgpa) updates.cgpa = parseResult.cgpa;
    if (parseResult.email && !currentStudent.email) updates.email = parseResult.email;

    await handleUpdateProfile(currentStudent.id, updates);
  };

  const handleApplyJob = async (jobId) => {
    if (!currentStudent) return;
    const res = await api.applyJob(currentStudent.id, jobId);
    if (res.success) {
      // Refresh applications
      const appsRes = await api.getApplications({ studentId: currentStudent.id });
      if (appsRes.success) setApplications(appsRes.data);
    }
  };

  const handleUpdateAppStatus = async (studentId, jobId, status, stage, notes) => {
    const existing = applications.find(a => a.studentId === studentId && a.jobId === jobId);
    if (existing) {
      await api.updateApplicationStatus(existing.id, status, stage, notes);
    } else {
      // create and update
      const created = await api.applyJob(studentId, jobId);
      if (created.success) {
        await api.updateApplicationStatus(created.data.id, status, stage, notes);
      }
    }
    // refresh
    const appsRes = await api.getApplications();
    if (appsRes.success) setApplications(appsRes.data);
  };

  const handleJobCreated = (newJob) => {
    setJobs(prev => [newJob, ...prev]);
  };

  const handleStageClick = (stageId) => {
    setActiveRole('student');
    switch (stageId) {
      case 'profile':
        setActiveStudentTab('profile');
        break;
      case 'skills':
        setActiveStudentTab('scorecard');
        break;
      case 'matching':
        setActiveStudentTab('jobs');
        break;
      case 'prep':
        setActiveStudentTab('interview');
        break;
      case 'placement':
        setActiveRole('officer');
        break;
      default:
        break;
    }
  };

  const appliedJobIds = new Set(applications.map(a => a.jobId));

  // Determine active workflow stage
  const getActiveStageId = () => {
    if (activeRole === 'officer') return 'placement';
    if (activeRole === 'recruiter') return 'matching';
    if (activeStudentTab === 'profile') return 'profile';
    if (activeStudentTab === 'scorecard') return 'skills';
    if (activeStudentTab === 'jobs') return 'matching';
    if (activeStudentTab === 'interview' || activeStudentTab === 'aptitude') return 'prep';
    return 'placement';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        currentStudent={currentStudent}
        students={students}
        onSelectStudent={handleSelectStudent}
        isOnline={isOnline}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* End-to-End System Workflow Banner (from Fig 2 in PDF) */}
        <SystemWorkflowBanner
          activeStage={getActiveStageId()}
          onStageClick={handleStageClick}
        />

        {/* ===================== STUDENT PORTAL ===================== */}
        {activeRole === 'student' && (
          <div>
            {/* Student Sub-navigation tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 border-b border-slate-200">
              <button
                onClick={() => setActiveStudentTab('scorecard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeStudentTab === 'scorecard'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Employability Scorecard</span>
              </button>

              <button
                onClick={() => setActiveStudentTab('jobs')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeStudentTab === 'jobs'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>AI Job Recommendations ({jobs.length})</span>
              </button>

              <button
                onClick={() => setActiveStudentTab('interview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeStudentTab === 'interview'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <MessageSquareCode className="w-3.5 h-3.5" />
                <span>AI Mock Interview Simulator</span>
              </button>

              <button
                onClick={() => setActiveStudentTab('aptitude')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeStudentTab === 'aptitude'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Campus Aptitude Test</span>
              </button>

              <button
                onClick={() => setActiveStudentTab('applications')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeStudentTab === 'applications'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>My Applications ({applications.length})</span>
              </button>

              <button
                onClick={() => setActiveStudentTab('profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeStudentTab === 'profile'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Academic Profile & Skills</span>
              </button>
            </div>

            {/* Tab Views */}
            {activeStudentTab === 'scorecard' && (
              <EmployabilityScorecard
                scorecard={scorecard}
                student={currentStudent}
                onRefreshScore={handleRefreshScore}
                isRefreshing={isRefreshingScore}
              />
            )}

            {activeStudentTab === 'jobs' && (
              <JobRecommendations
                jobs={jobs}
                student={currentStudent}
                onApply={handleApplyJob}
                appliedJobIds={appliedJobIds}
              />
            )}

            {activeStudentTab === 'interview' && (
              <MockInterviewModule
                student={currentStudent}
                onInterviewCompleted={handleRefreshScore}
              />
            )}

            {activeStudentTab === 'aptitude' && (
              <AptitudeAssessment
                student={currentStudent}
                onTestCompleted={handleRefreshScore}
              />
            )}

            {activeStudentTab === 'applications' && (
              <ApplicationsTracker
                applications={applications}
              />
            )}

            {activeStudentTab === 'profile' && (
              <ProfileManager
                student={currentStudent}
                onUpdateProfile={handleUpdateProfile}
                onOpenResumeParser={() => setShowResumeModal(true)}
              />
            )}
          </div>
        )}

        {/* ===================== RECRUITER PORTAL ===================== */}
        {activeRole === 'recruiter' && (
          <RecruiterDashboard
            jobs={jobs}
            onJobCreated={handleJobCreated}
            onUpdateApplicationStatus={handleUpdateAppStatus}
          />
        )}

        {/* ===================== PLACEMENT OFFICER PORTAL ===================== */}
        {activeRole === 'officer' && (
          <PlacementAnalyticsDashboard
            analytics={analytics}
            students={students}
          />
        )}

      </main>

      {/* NLP Resume Parser Modal */}
      <ResumeParserModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
        onSkillsExtracted={handleSkillsExtracted}
        currentStudent={currentStudent}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>
            © 2026 Department of Computer Science & Engineering. AI-Powered Student Career & Placement Management System.
          </p>
          <div className="flex items-center gap-4">
            <span>Natural Language Processing</span>
            <span>•</span>
            <span>Employability Analytics</span>
            <span>•</span>
            <span>Automated Shortlisting</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
