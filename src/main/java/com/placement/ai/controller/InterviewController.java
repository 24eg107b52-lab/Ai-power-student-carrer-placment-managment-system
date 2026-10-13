package com.placement.ai.controller;

import com.placement.ai.entity.AptitudeQuestion;
import com.placement.ai.entity.InterviewQuestion;
import com.placement.ai.entity.InterviewSession;
import com.placement.ai.ml.MockInterviewEvaluatorEngine;
import com.placement.ai.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = "*")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping("/questions")
    public ResponseEntity<List<InterviewQuestion>> getAllQuestions() {
        return ResponseEntity.ok(interviewService.getAllQuestions());
    }

    @GetMapping("/questions/category/{category}")
    public ResponseEntity<List<InterviewQuestion>> getQuestionsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(interviewService.getQuestionsByCategory(category));
    }

    @PostMapping("/evaluate")
    public ResponseEntity<MockInterviewEvaluatorEngine.EvaluationResult> evaluateAnswer(@RequestBody Map<String, Object> payload) {
        Long studentId = Long.valueOf(payload.get("studentId").toString());
        Long questionId = Long.valueOf(payload.get("questionId").toString());
        String answer = payload.get("answer") != null ? payload.get("answer").toString() : "";
        MockInterviewEvaluatorEngine.EvaluationResult result = interviewService.evaluateAndSaveResponse(studentId, questionId, answer);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/sessions/{studentId}")
    public ResponseEntity<List<InterviewSession>> getSessions(@PathVariable Long studentId) {
        return ResponseEntity.ok(interviewService.getStudentSessions(studentId));
    }

    @GetMapping("/aptitude/questions")
    public ResponseEntity<List<AptitudeQuestion>> getAptitudeQuestions() {
        return ResponseEntity.ok(interviewService.getAptitudeQuestions());
    }

    @PostMapping("/aptitude/submit")
    public ResponseEntity<Map<String, Object>> submitAptitude(@RequestBody Map<String, Object> payload) {
        Long studentId = Long.valueOf(payload.get("studentId").toString());
        @SuppressWarnings("unchecked")
        Map<String, String> rawAnswers = (Map<String, String>) payload.get("answers");
        Map<Long, String> parsedAnswers = new HashMap<>();
        if (rawAnswers != null) {
            rawAnswers.forEach((k, v) -> parsedAnswers.put(Long.valueOf(k), v));
        }
        return ResponseEntity.ok(interviewService.evaluateAptitudeTest(studentId, parsedAnswers));
    }
}
