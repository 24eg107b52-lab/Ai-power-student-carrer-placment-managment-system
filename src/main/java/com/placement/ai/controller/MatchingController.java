package com.placement.ai.controller;

import com.placement.ai.entity.Application;
import com.placement.ai.service.MatchingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matching")
@CrossOrigin(origins = "*")
public class MatchingController {

    private final MatchingService matchingService;

    public MatchingController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @GetMapping("/recommendations/{studentId}")
    public ResponseEntity<List<MatchingService.JobRecommendationDTO>> getRecommendations(@PathVariable Long studentId) {
        return ResponseEntity.ok(matchingService.getRecommendedJobsForStudent(studentId));
    }

    @GetMapping("/candidates/{jobId}")
    public ResponseEntity<List<MatchingService.CandidateMatchDTO>> getCandidateRankings(@PathVariable Long jobId) {
        return ResponseEntity.ok(matchingService.getRankedCandidatesForJob(jobId));
    }

    @PostMapping("/apply")
    public ResponseEntity<Application> apply(@RequestBody Map<String, Long> payload) {
        Long studentId = payload.get("studentId");
        Long jobId = payload.get("jobId");
        return ResponseEntity.ok(matchingService.applyToJob(studentId, jobId));
    }

    @PostMapping("/auto-shortlist")
    public ResponseEntity<List<Application>> autoShortlist(@RequestBody Map<String, Object> payload) {
        Long jobId = Long.valueOf(payload.get("jobId").toString());
        Double minScore = payload.get("minScore") != null ? Double.valueOf(payload.get("minScore").toString()) : 70.0;
        return ResponseEntity.ok(matchingService.autoShortlistCandidates(jobId, minScore));
    }

    @PutMapping("/application/{applicationId}/status")
    public ResponseEntity<Application> updateStatus(
            @PathVariable Long applicationId,
            @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        String feedback = payload.get("feedback");
        return ResponseEntity.ok(matchingService.updateApplicationStatus(applicationId, status, feedback));
    }

    @GetMapping("/applications/student/{studentId}")
    public ResponseEntity<List<Application>> getStudentApplications(@PathVariable Long studentId) {
        return ResponseEntity.ok(matchingService.getApplicationsForStudent(studentId));
    }

    @GetMapping("/applications/job/{jobId}")
    public ResponseEntity<List<Application>> getJobApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(matchingService.getApplicationsForJob(jobId));
    }
}
