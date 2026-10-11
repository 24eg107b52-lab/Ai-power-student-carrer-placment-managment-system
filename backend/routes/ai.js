import express from 'express';
import { store } from '../data/store.js';
import { parseResume, calculateJobMatch } from '../services/nlpEngine.js';
import { calculateEmployabilityScore, ROLE_BENCHMARKS } from '../services/employabilityEngine.js';
import { INTERVIEW_QUESTIONS, APTITUDE_QUESTIONS, evaluateInterviewResponse } from '../services/interviewEngine.js';

const router = express.Router();

// 1. Calculate dynamic employability score for student
router.get('/employability/:studentId', (req, res) => {
  try {
    const student = store.getStudentById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const scorecard = calculateEmployabilityScore(student);
    res.json({ success: true, data: scorecard });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Parse raw resume text using NLP
router.post('/parse-resume', (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ success: false, error: 'resumeText is required' });
    }

    const parsed = parseResume(resumeText);
    res.json({ success: true, data: parsed });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. AI Rank candidates for a given job (Recruiter view)
router.get('/rank-candidates/:jobId', (req, res) => {
  try {
    const job = store.getJobById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    const students = store.getStudents();
    const ranked = students.map(student => {
      const match = calculateJobMatch(student, job);
      const employability = calculateEmployabilityScore(student);
      return {
        student: {
          id: student.id,
          name: student.name,
          email: student.email,
          department: student.department,
          cgpa: student.cgpa,
          skills: student.skills,
          status: student.status
        },
        matchPercentage: match.matchPercentage,
        isEligible: match.isEligible,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        employabilityScore: employability.score,
        tier: employability.tier,
        verdict: match.verdict
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({ success: true, count: ranked.length, data: ranked });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Mock Interview: Get Questions
router.get('/interview-questions', (req, res) => {
  try {
    const { role } = req.query;
    const availableRoles = Object.keys(INTERVIEW_QUESTIONS);

    if (role && INTERVIEW_QUESTIONS[role]) {
      return res.json({ 
        success: true, 
        role, 
        questions: INTERVIEW_QUESTIONS[role] 
      });
    }

    // Return all questions grouped or first role
    res.json({
      success: true,
      availableRoles,
      questions: INTERVIEW_QUESTIONS['Software Development Engineer (SDE)']
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Mock Interview: AI Evaluation of Student Answer
router.post('/evaluate-interview', (req, res) => {
  try {
    const { questionId, responseText, role, studentId } = req.body;
    if (!responseText) {
      return res.status(400).json({ success: false, error: 'Response text is required' });
    }

    const evaluation = evaluateInterviewResponse(questionId, responseText, role);

    // If studentId passed, record the interview score in their profile
    if (studentId) {
      const student = store.getStudentById(studentId);
      if (student) {
        const updatedScores = [...(student.mockInterviewScores || []), evaluation.score];
        store.updateStudent(studentId, { mockInterviewScores: updatedScores });
      }
    }

    res.json({ success: true, data: evaluation });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Aptitude Test: Get questions
router.get('/aptitude-test', (req, res) => {
  try {
    // Return questions without the correctIndex to prevent client cheats
    const safeQuestions = APTITUDE_QUESTIONS.map(({ correctIndex, explanation, ...rest }) => rest);
    res.json({ success: true, count: safeQuestions.length, data: safeQuestions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Aptitude Test: Submit and Grade
router.post('/submit-aptitude', (req, res) => {
  try {
    const { answers, studentId } = req.body; // { 'apt-1': 1, 'apt-2': 0, ... }
    if (!answers) {
      return res.status(400).json({ success: false, error: 'Answers object is required' });
    }

    let correctCount = 0;
    const detailedResults = APTITUDE_QUESTIONS.map(q => {
      const selectedIndex = answers[q.id];
      const isCorrect = selectedIndex === q.correctIndex;
      if (isCorrect) correctCount++;
      return {
        id: q.id,
        question: q.question,
        category: q.category,
        selectedIndex,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation
      };
    });

    const scorePercent = Math.round((correctCount / APTITUDE_QUESTIONS.length) * 100);

    // Save in student's assessment scores if studentId provided
    if (studentId) {
      const student = store.getStudentById(studentId);
      if (student) {
        const updatedAssessments = [...(student.assessmentScores || []), scorePercent];
        store.updateStudent(studentId, { assessmentScores: updatedAssessments });
      }
    }

    res.json({
      success: true,
      scorePercent,
      correctCount,
      totalQuestions: APTITUDE_QUESTIONS.length,
      detailedResults
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Role Benchmarks list
router.get('/benchmarks', (req, res) => {
  res.json({ success: true, data: ROLE_BENCHMARKS });
});

export default router;
