const API_BASE = '/api';

export const api = {
  // Students
  async getStudents(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/students${query ? '?' + query : ''}`);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },

  async getStudent(id) {
    const res = await fetch(`${API_BASE}/students/${id}`);
    if (!res.ok) throw new Error('Failed to fetch student profile');
    return res.json();
  },

  async updateStudent(id, data) {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update student profile');
    return res.json();
  },

  async addStudent(data) {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add student');
    return res.json();
  },

  // Jobs
  async getJobs(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/jobs${query ? '?' + query : ''}`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async getJob(id, studentId) {
    const query = studentId ? `?studentId=${studentId}` : '';
    const res = await fetch(`${API_BASE}/jobs/${id}${query}`);
    if (!res.ok) throw new Error('Failed to fetch job details');
    return res.json();
  },

  async createJob(jobData) {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });
    if (!res.ok) throw new Error('Failed to create job');
    return res.json();
  },

  // Applications
  async getApplications(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/applications${query ? '?' + query : ''}`);
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  },

  async applyJob(studentId, jobId) {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, jobId })
    });
    if (!res.ok) throw new Error('Failed to submit application');
    return res.json();
  },

  async updateApplicationStatus(id, status, stage, notes) {
    const res = await fetch(`${API_BASE}/applications/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, stage, notes })
    });
    if (!res.ok) throw new Error('Failed to update application');
    return res.json();
  },

  // AI Services
  async getEmployability(studentId) {
    const res = await fetch(`${API_BASE}/ai/employability/${studentId}`);
    if (!res.ok) throw new Error('Failed to compute employability score');
    return res.json();
  },

  async parseResume(resumeText) {
    const res = await fetch(`${API_BASE}/ai/parse-resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText })
    });
    if (!res.ok) throw new Error('Failed to parse resume');
    return res.json();
  },

  async rankCandidates(jobId) {
    const res = await fetch(`${API_BASE}/ai/rank-candidates/${jobId}`);
    if (!res.ok) throw new Error('Failed to rank candidates');
    return res.json();
  },

  async getInterviewQuestions(role) {
    const query = role ? `?role=${encodeURIComponent(role)}` : '';
    const res = await fetch(`${API_BASE}/ai/interview-questions${query}`);
    if (!res.ok) throw new Error('Failed to fetch interview questions');
    return res.json();
  },

  async evaluateInterview(payload) {
    const res = await fetch(`${API_BASE}/ai/evaluate-interview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to evaluate interview response');
    return res.json();
  },

  async getAptitudeTest() {
    const res = await fetch(`${API_BASE}/ai/aptitude-test`);
    if (!res.ok) throw new Error('Failed to load aptitude questions');
    return res.json();
  },

  async submitAptitude(payload) {
    const res = await fetch(`${API_BASE}/ai/submit-aptitude`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to grade aptitude test');
    return res.json();
  },

  // Analytics
  async getAnalyticsDashboard() {
    const res = await fetch(`${API_BASE}/analytics/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  }
};
