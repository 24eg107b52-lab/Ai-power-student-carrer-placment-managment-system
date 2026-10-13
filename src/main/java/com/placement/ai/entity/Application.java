package com.placement.ai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = false)
    private JobPosting jobPosting;

    private LocalDateTime appliedAt = LocalDateTime.now();

    private Double matchScore = 0.0;

    @Column(length = 1000)
    private String matchingSkills;

    @Column(length = 1000)
    private String missingSkills;

    private String status = "APPLIED"; // APPLIED, SHORTLISTED, INTERVIEW_SCHEDULED, REJECTED, OFFERED, PLACED

    private LocalDateTime interviewScheduledAt;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String recruiterFeedback;

    public Application() {}

    public Application(Student student, JobPosting jobPosting, Double matchScore, String matchingSkills, String missingSkills) {
        this.student = student;
        this.jobPosting = jobPosting;
        this.matchScore = matchScore;
        this.matchingSkills = matchingSkills;
        this.missingSkills = missingSkills;
        this.appliedAt = LocalDateTime.now();
        this.status = "APPLIED";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public JobPosting getJobPosting() { return jobPosting; }
    public void setJobPosting(JobPosting jobPosting) { this.jobPosting = jobPosting; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }

    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }

    public String getMatchingSkills() { return matchingSkills; }
    public void setMatchingSkills(String matchingSkills) { this.matchingSkills = matchingSkills; }

    public String getMissingSkills() { return missingSkills; }
    public void setMissingSkills(String missingSkills) { this.missingSkills = missingSkills; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getInterviewScheduledAt() { return interviewScheduledAt; }
    public void setInterviewScheduledAt(LocalDateTime interviewScheduledAt) { this.interviewScheduledAt = interviewScheduledAt; }

    public String getRecruiterFeedback() { return recruiterFeedback; }
    public void setRecruiterFeedback(String recruiterFeedback) { this.recruiterFeedback = recruiterFeedback; }
}
