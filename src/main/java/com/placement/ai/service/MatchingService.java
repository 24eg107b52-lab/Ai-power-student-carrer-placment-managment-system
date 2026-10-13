package com.placement.ai.service;

import com.placement.ai.entity.Application;
import com.placement.ai.entity.JobPosting;
import com.placement.ai.entity.Student;
import com.placement.ai.ml.NlpMatchingEngine;
import com.placement.ai.repository.ApplicationRepository;
import com.placement.ai.repository.JobPostingRepository;
import com.placement.ai.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    private final StudentRepository studentRepository;
    private final JobPostingRepository jobPostingRepository;
    private final ApplicationRepository applicationRepository;
    private final NlpMatchingEngine nlpMatchingEngine;

    public MatchingService(StudentRepository studentRepository,
                           JobPostingRepository jobPostingRepository,
                           ApplicationRepository applicationRepository,
                           NlpMatchingEngine nlpMatchingEngine) {
        this.studentRepository = studentRepository;
        this.jobPostingRepository = jobPostingRepository;
        this.applicationRepository = applicationRepository;
        this.nlpMatchingEngine = nlpMatchingEngine;
    }

    public static class JobRecommendationDTO {
        public Long jobId;
        public String jobTitle;
        public String company;
        public String location;
        public Double ctcLpa;
        public String departmentEligibility;
        public Double matchScore;
        public Double skillMatchPercentage;
        public Double tfidfSimilarity;
        public List<String> matchingSkills;
        public List<String> missingSkills;
        public boolean eligible;
        public String eligibilityStatus;
        public String recommendationTier;
        public boolean alreadyApplied;
        public String applicationStatus;
    }

    public static class CandidateMatchDTO {
        public Long studentId;
        public String rollNumber;
        public String name;
        public String department;
        public Double cgpa;
        public Double employabilityScore;
        public Double matchScore;
        public Double skillMatchPercentage;
        public List<String> matchingSkills;
        public List<String> missingSkills;
        public boolean eligible;
        public String eligibilityStatus;
        public String recommendationTier;
        public Long applicationId;
        public String applicationStatus;
    }

    public List<JobRecommendationDTO> getRecommendedJobsForStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

        List<JobPosting> jobs = jobPostingRepository.findByStatus("OPEN");
        Map<Long, Application> appliedMap = applicationRepository.findByStudentId(studentId).stream()
                .collect(Collectors.toMap(a -> a.getJobPosting().getId(), a -> a, (k1, k2) -> k1));

        List<JobRecommendationDTO> recommendations = new ArrayList<>();

        for (JobPosting job : jobs) {
            NlpMatchingEngine.MatchResult match = nlpMatchingEngine.matchStudentToJob(student, job);
            JobRecommendationDTO dto = new JobRecommendationDTO();
            dto.jobId = job.getId();
            dto.jobTitle = job.getTitle();
            dto.company = job.getCompany();
            dto.location = job.getLocation();
            dto.ctcLpa = job.getCtcLpa();
            dto.departmentEligibility = job.getDepartmentEligibility();
            dto.matchScore = match.overallMatchScore;
            dto.skillMatchPercentage = match.skillMatchPercentage;
            dto.tfidfSimilarity = match.tfidfCosineSimilarity;
            dto.matchingSkills = match.matchingSkills;
            dto.missingSkills = match.missingSkills;
            dto.eligible = match.meetsAcademicEligibility;
            dto.eligibilityStatus = match.eligibilityStatus;
            dto.recommendationTier = match.recommendationTier;

            Application app = appliedMap.get(job.getId());
            if (app != null) {
                dto.alreadyApplied = true;
                dto.applicationStatus = app.getStatus();
            } else {
                dto.alreadyApplied = false;
                dto.applicationStatus = "NOT_APPLIED";
            }

            recommendations.add(dto);
        }

        // Sort by match score descending
        recommendations.sort((a, b) -> Double.compare(b.matchScore, a.matchScore));
        return recommendations;
    }

    public List<CandidateMatchDTO> getRankedCandidatesForJob(Long jobId) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        List<Student> students = studentRepository.findAll();
        Map<Long, Application> appliedMap = applicationRepository.findByJobPostingId(jobId).stream()
                .collect(Collectors.toMap(a -> a.getStudent().getId(), a -> a, (k1, k2) -> k1));

        List<CandidateMatchDTO> ranked = new ArrayList<>();

        for (Student s : students) {
            NlpMatchingEngine.MatchResult match = nlpMatchingEngine.matchStudentToJob(s, job);
            CandidateMatchDTO dto = new CandidateMatchDTO();
            dto.studentId = s.getId();
            dto.rollNumber = s.getRollNumber();
            dto.name = s.getName();
            dto.department = s.getDepartment();
            dto.cgpa = s.getCgpa();
            dto.employabilityScore = s.getEmployabilityScore();
            dto.matchScore = match.overallMatchScore;
            dto.skillMatchPercentage = match.skillMatchPercentage;
            dto.matchingSkills = match.matchingSkills;
            dto.missingSkills = match.missingSkills;
            dto.eligible = match.meetsAcademicEligibility;
            dto.eligibilityStatus = match.eligibilityStatus;
            dto.recommendationTier = match.recommendationTier;

            Application app = appliedMap.get(s.getId());
            if (app != null) {
                dto.applicationId = app.getId();
                dto.applicationStatus = app.getStatus();
            } else {
                dto.applicationStatus = "NOT_APPLIED";
            }

            ranked.add(dto);
        }

        // Sort by match score descending
        ranked.sort((a, b) -> Double.compare(b.matchScore, a.matchScore));
        return ranked;
    }

    @Transactional
    public Application applyToJob(Long studentId, Long jobId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        Optional<Application> existing = applicationRepository.findByStudentIdAndJobPostingId(studentId, jobId);
        if (existing.isPresent()) {
            return existing.get();
        }

        NlpMatchingEngine.MatchResult match = nlpMatchingEngine.matchStudentToJob(student, job);

        Application application = new Application(
                student,
                job,
                match.overallMatchScore,
                String.join(", ", match.matchingSkills),
                String.join(", ", match.missingSkills)
        );

        if (!"PLACED".equalsIgnoreCase(student.getPlacementStatus())) {
            student.setPlacementStatus("IN_PROCESS");
            studentRepository.save(student);
        }

        return applicationRepository.save(application);
    }

    @Transactional
    public List<Application> autoShortlistCandidates(Long jobId, Double minScoreThreshold) {
        double threshold = (minScoreThreshold != null) ? minScoreThreshold : 70.0;
        List<Application> apps = applicationRepository.findByJobPostingId(jobId);
        List<Application> shortlisted = new ArrayList<>();

        for (Application a : apps) {
            if (a.getMatchScore() != null && a.getMatchScore() >= threshold) {
                if ("APPLIED".equalsIgnoreCase(a.getStatus())) {
                    a.setStatus("SHORTLISTED");
                    a.setRecruiterFeedback("Auto-shortlisted via NLP Match Threshold (>=" + threshold + "%)");
                    shortlisted.add(applicationRepository.save(a));
                }
            }
        }
        return shortlisted;
    }

    @Transactional
    public Application updateApplicationStatus(Long applicationId, String status, String feedback) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found: " + applicationId));
        app.setStatus(status);
        if (feedback != null && !feedback.isBlank()) {
            app.setRecruiterFeedback(feedback);
        }

        // If status is PLACED, update student placement record
        if ("PLACED".equalsIgnoreCase(status) || "OFFERED".equalsIgnoreCase(status)) {
            Student student = app.getStudent();
            student.setPlacementStatus("PLACED");
            student.setPlacedCompany(app.getJobPosting().getCompany());
            student.setOfferedCtcLpa(app.getJobPosting().getCtcLpa());
            studentRepository.save(student);
        }

        return applicationRepository.save(app);
    }

    public List<Application> getApplicationsForStudent(Long studentId) {
        return applicationRepository.findByStudentId(studentId);
    }

    public List<Application> getApplicationsForJob(Long jobId) {
        return applicationRepository.findByJobPostingIdOrderByMatchScoreDesc(jobId);
    }
}
