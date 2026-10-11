import express from 'express';
import { store } from '../data/store.js';
import { calculateEmployabilityScore } from '../services/employabilityEngine.js';

const router = express.Router();

// GET all students (with optional department or status filter)
router.get('/', (req, res) => {
  try {
    let list = store.getStudents();
    const { department, status, search } = req.query;

    if (department && department !== 'All') {
      list = list.filter(s => s.department === department);
    }
    if (status && status !== 'All') {
      list = list.filter(s => s.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.email.toLowerCase().includes(q) ||
        (s.skills || []).some(sk => sk.toLowerCase().includes(q))
      );
    }

    // Attach dynamic employability score summary to each student
    const enhanced = list.map(s => {
      const scorecard = calculateEmployabilityScore(s);
      return {
        ...s,
        employabilityScore: scorecard.score,
        tier: scorecard.tier
      };
    });

    res.json({ success: true, count: enhanced.length, data: enhanced });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single student
router.get('/:id', (req, res) => {
  try {
    const student = store.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    const scorecard = calculateEmployabilityScore(student);
    res.json({
      success: true,
      data: {
        ...student,
        scorecard
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST add new student
router.post('/', (req, res) => {
  try {
    const { name, email, department, cgpa, skills } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }
    const newStudent = store.addStudent(req.body);
    res.status(201).json({ success: true, data: newStudent });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update student profile
router.put('/:id', (req, res) => {
  try {
    const updated = store.updateStudent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    const scorecard = calculateEmployabilityScore(updated);
    res.json({ success: true, data: { ...updated, scorecard } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
