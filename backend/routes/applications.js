import express from 'express';
import { store } from '../data/store.js';
import { calculateJobMatch } from '../services/nlpEngine.js';

const router = express.Router();

// GET all applications
router.get('/', (req, res) => {
  try {
    let apps = store.getApplications();
    const { studentId, jobId, status } = req.query;

    if (studentId) {
      apps = apps.filter(a => a.studentId === studentId);
    }
    if (jobId) {
      apps = apps.filter(a => a.jobId === jobId);
    }
    if (status) {
      apps = apps.filter(a => a.status === status);
    }

    // Populate student and job details
    const populated = apps.map(app => {
      const student = store.getStudentById(app.studentId);
      const job = store.getJobById(app.jobId);
      return {
        ...app,
        studentName: student ? student.name : 'Unknown Student',
        studentDepartment: student ? student.department : '',
        studentCgpa: student ? student.cgpa : '',
        studentSkills: student ? student.skills : [],
        jobTitle: job ? job.title : 'Unknown Job',
        company: job ? job.company : '',
        packageLpa: job ? job.packageLpa : 0
      };
    });

    res.json({ success: true, count: populated.length, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST submit an application
router.post('/', (req, res) => {
  try {
    const { studentId, jobId } = req.body;
    if (!studentId || !jobId) {
      return res.status(400).json({ success: false, error: 'studentId and jobId are required' });
    }

    const student = store.getStudentById(studentId);
    const job = store.getJobById(jobId);

    if (!student || !job) {
      return res.status(404).json({ success: false, error: 'Student or Job not found' });
    }

    const matchResult = calculateJobMatch(student, job);

    const newApp = store.addApplication({
      studentId,
      jobId,
      matchScore: matchResult.matchPercentage,
      status: 'Applied',
      stage: 'Application Submitted'
    });

    res.status(201).json({ success: true, data: newApp, matchResult });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH update application status
router.patch('/:id/status', (req, res) => {
  try {
    const { status, stage, notes } = req.body;
    const updated = store.updateApplication(req.params.id, {
      status,
      stage: stage || status,
      notes: notes || undefined
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // If offered, update student status as well
    if (status === 'Offered') {
      const job = store.getJobById(updated.jobId);
      store.updateStudent(updated.studentId, {
        status: 'Placed',
        placedCompany: job ? job.company : 'Campus Recruiter',
        placedPackageLpa: job ? job.packageLpa : 12.0
      });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
