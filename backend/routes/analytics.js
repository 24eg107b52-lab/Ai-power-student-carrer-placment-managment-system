import express from 'express';
import { store } from '../data/store.js';
import { calculateEmployabilityScore } from '../services/employabilityEngine.js';

const router = express.Router();

// GET Institutional Analytics Dashboard data
router.get('/dashboard', (req, res) => {
  try {
    const rawAnalytics = store.getAnalytics();
    const students = store.getStudents();
    const jobs = store.getJobs();
    const applications = store.getApplications();

    // Dynamically calculate tier distribution across student body
    const tierCounts = {
      'Tier 1 (Elite)': 0,
      'Tier 2 (Job Ready)': 0,
      'Tier 3 (Developing)': 0,
      'Tier 4 (Foundational)': 0
    };

    let totalScoreSum = 0;
    students.forEach(s => {
      const scorecard = calculateEmployabilityScore(s);
      totalScoreSum += scorecard.score;
      if (scorecard.score >= 85) tierCounts['Tier 1 (Elite)']++;
      else if (scorecard.score >= 70) tierCounts['Tier 2 (Job Ready)']++;
      else if (scorecard.score >= 55) tierCounts['Tier 3 (Developing)']++;
      else tierCounts['Tier 4 (Foundational)']++;
    });

    const averageEmployability = students.length > 0 
      ? Math.round(totalScoreSum / students.length) 
      : 75;

    // Status distribution
    const statusCounts = {};
    students.forEach(s => {
      statusCounts[s.status] = (statusCounts[s.status] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        ...rawAnalytics,
        liveMetrics: {
          totalStudentsCount: students.length,
          totalJobsOpen: jobs.length,
          totalApplicationsProcessed: applications.length,
          averageEmployabilityScore: averageEmployability,
          tierDistribution: tierCounts,
          studentStatusDistribution: statusCounts
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
