package com.placement.ai.controller;

import com.placement.ai.entity.JobPosting;
import com.placement.ai.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<List<JobPosting>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/open")
    public ResponseEntity<List<JobPosting>> getOpenJobs() {
        return ResponseEntity.ok(jobService.getOpenJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobPosting> getJobById(@PathVariable Long id) {
        return jobService.getJobById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<JobPosting> createJob(@RequestBody JobPosting job) {
        return ResponseEntity.ok(jobService.createJob(job));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobPosting> updateJob(@PathVariable Long id, @RequestBody JobPosting job) {
        return ResponseEntity.ok(jobService.updateJob(id, job));
    }
}
