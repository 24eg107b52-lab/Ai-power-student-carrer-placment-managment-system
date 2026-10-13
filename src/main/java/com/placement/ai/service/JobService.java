package com.placement.ai.service;

import com.placement.ai.entity.JobPosting;
import com.placement.ai.repository.JobPostingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    private final JobPostingRepository jobPostingRepository;

    public JobService(JobPostingRepository jobPostingRepository) {
        this.jobPostingRepository = jobPostingRepository;
    }

    public List<JobPosting> getAllJobs() {
        return jobPostingRepository.findAllByOrderByDriveDateAsc();
    }

    public List<JobPosting> getOpenJobs() {
        return jobPostingRepository.findByStatus("OPEN");
    }

    public Optional<JobPosting> getJobById(Long id) {
        return jobPostingRepository.findById(id);
    }

    public JobPosting createJob(JobPosting job) {
        if (job.getStatus() == null) {
            job.setStatus("OPEN");
        }
        return jobPostingRepository.save(job);
    }

    public JobPosting updateJob(Long id, JobPosting updated) {
        return jobPostingRepository.findById(id).map(j -> {
            j.setTitle(updated.getTitle());
            j.setCompany(updated.getCompany());
            j.setDescription(updated.getDescription());
            j.setRequiredSkills(updated.getRequiredSkills());
            j.setNiceToHaveSkills(updated.getNiceToHaveSkills());
            j.setCtcLpa(updated.getCtcLpa());
            j.setMinCgpa(updated.getMinCgpa());
            j.setMaxBacklogs(updated.getMaxBacklogs());
            j.setDepartmentEligibility(updated.getDepartmentEligibility());
            j.setLocation(updated.getLocation());
            j.setDriveDate(updated.getDriveDate());
            j.setApplicationDeadline(updated.getApplicationDeadline());
            j.setStatus(updated.getStatus());
            return jobPostingRepository.save(j);
        }).orElseThrow(() -> new RuntimeException("Job not found: " + id));
    }
}
