import express from 'express';
import { store } from '../data/store.js';
import { calculateJobMatch } from '../services/nlpEngine.js';

const router = express.Router();

// GET all jobs
router.get('/', (req, res) => {
  try {
    let jobs = store.getJobs();
    const { department, search, studentId } = req.query;

    if (department && department !== 'All') {
      jobs = jobs.filter(j => j.departmentEligible.includes(department));
    }

    if (search) {
      const q = search.toLowerCase();
      jobs = jobs.filter(j => 
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        (j.requiredSkills || []).some(s => s.toLowerCase().includes(q))
      );
    }

    // If studentId provided, calculate matching score for each job
    if (studentId) {
      const student = store.getStudentById(studentId);
      if (student) {
        jobs = jobs.map(job => {
          const matchResult = calculateJobMatch(student, job);
          return {
            ...job,
            matchResult
          };
        }).sort((a, b) => b.matchResult.matchPercentage - a.matchResult.matchPercentage);
      }
    }

    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single job
router.get('/:id', (req, res) => {
  try {
    const job = store.getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    const { studentId } = req.query;
    let matchResult = null;
    if (studentId) {
      const student = store.getStudentById(studentId);
      if (student) {
        matchResult = calculateJobMatch(student, job);
      }
    }

    res.json({ success: true, data: { ...job, matchResult } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST add job opening (Recruiter / Placement Officer)
router.post('/', (req, res) => {
  try {
    const { title, company, requiredSkills, packageLpa } = req.body;
    if (!title || !company) {
      return res.status(400).json({ success: false, error: 'Title and company are required' });
    }

    const newJob = store.addJob({
      ...req.body,
      departmentEligible: req.body.departmentEligible || ["CSE", "IT", "ECE"],
      requiredSkills: Array.isArray(requiredSkills) 
        ? requiredSkills 
        : (requiredSkills || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
    });

    res.status(201).json({ success: true, data: newJob });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
