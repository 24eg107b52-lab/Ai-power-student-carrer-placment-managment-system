package com.placement.ai.service;

import com.placement.ai.entity.AptitudeQuestion;
import com.placement.ai.entity.InterviewQuestion;
import com.placement.ai.entity.InterviewSession;
import com.placement.ai.entity.Student;
import com.placement.ai.ml.MockInterviewEvaluatorEngine;
import com.placement.ai.repository.AptitudeQuestionRepository;
import com.placement.ai.repository.InterviewQuestionRepository;
import com.placement.ai.repository.InterviewSessionRepository;
import com.placement.ai.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class InterviewService {

    private final InterviewQuestionRepository questionRepository;
    private final InterviewSessionRepository sessionRepository;
    private final AptitudeQuestionRepository aptitudeRepository;
    private final StudentRepository studentRepository;
    private final MockInterviewEvaluatorEngine evaluatorEngine;
    private final StudentService studentService;

    public InterviewService(InterviewQuestionRepository questionRepository,
                            InterviewSessionRepository sessionRepository,
                            AptitudeQuestionRepository aptitudeRepository,
                            StudentRepository studentRepository,
                            MockInterviewEvaluatorEngine evaluatorEngine,
                            StudentService studentService) {
        this.questionRepository = questionRepository;
        this.sessionRepository = sessionRepository;
        this.aptitudeRepository = aptitudeRepository;
        this.studentRepository = studentRepository;
        this.evaluatorEngine = evaluatorEngine;
        this.studentService = studentService;
    }

    public List<InterviewQuestion> getAllQuestions() {
        return questionRepository.findAll();
    }

    public List<InterviewQuestion> getQuestionsByCategory(String category) {
        return questionRepository.findByCategory(category);
    }

    public List<AptitudeQuestion> getAptitudeQuestions() {
        return aptitudeRepository.findAll();
    }

    @Transactional
    public MockInterviewEvaluatorEngine.EvaluationResult evaluateAndSaveResponse(Long studentId, Long questionId, String studentAnswer) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));
        InterviewQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found: " + questionId));

        MockInterviewEvaluatorEngine.EvaluationResult evaluation = evaluatorEngine.evaluateResponse(question, studentAnswer);

        InterviewSession session = new InterviewSession();
        session.setStudent(student);
        session.setQuestion(question);
        session.setStudentAnswer(studentAnswer);
        session.setOverallScore(evaluation.overallScore);
        session.setClarityScore(evaluation.clarityScore);
        session.setTechnicalAccuracyScore(evaluation.technicalAccuracyScore);
        session.setKeywordCoverageScore(evaluation.keywordCoverageScore);
        session.setCoveredKeywords(String.join(", ", evaluation.coveredKeywords));
        session.setMissingKeywords(String.join(", ", evaluation.missingKeywords));
        session.setAiFeedback(evaluation.aiFeedback);

        sessionRepository.save(session);

        // Update student average interview score
        List<InterviewSession> allSessions = sessionRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
        double avgScore = allSessions.stream().mapToDouble(InterviewSession::getOverallScore).average().orElse(evaluation.overallScore);
        student.setInterviewScore(Math.round(avgScore * 10.0) / 10.0);

        studentService.saveStudent(student);

        return evaluation;
    }

    @Transactional
    public Map<String, Object> evaluateAptitudeTest(Long studentId, Map<Long, String> answers) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

        List<AptitudeQuestion> allQuestions = aptitudeRepository.findAll();
        int total = allQuestions.size();
        int correct = 0;

        List<Map<String, Object>> reviewList = new ArrayList<>();

        for (AptitudeQuestion q : allQuestions) {
            String selected = answers.get(q.getId());
            boolean isCorrect = selected != null && selected.trim().equalsIgnoreCase(q.getCorrectOption().trim());
            if (isCorrect) correct++;

            Map<String, Object> item = new HashMap<>();
            item.put("questionId", q.getId());
            item.put("questionText", q.getQuestionText());
            item.put("selectedOption", selected);
            item.put("correctOption", q.getCorrectOption());
            item.put("isCorrect", isCorrect);
            item.put("explanation", q.getExplanation());
            reviewList.add(item);
        }

        double scorePercentage = total > 0 ? Math.round(((double) correct / total) * 100.0 * 10.0) / 10.0 : 0.0;
        student.setAptitudeScore(scorePercentage);
        studentService.saveStudent(student);

        Map<String, Object> result = new HashMap<>();
        result.put("totalQuestions", total);
        result.put("correctAnswers", correct);
        result.put("scorePercentage", scorePercentage);
        result.put("review", reviewList);

        return result;
    }

    public List<InterviewSession> getStudentSessions(Long studentId) {
        return sessionRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }
}
