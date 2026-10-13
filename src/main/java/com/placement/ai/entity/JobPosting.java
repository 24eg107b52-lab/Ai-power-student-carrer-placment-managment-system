package com.placement.ai.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "job_postings")
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String company;
    private String companyLogo;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String description;

    private String departmentEligibility; // e.g. "CSE,IT,ECE" or "ALL"
    private Double minCgpa = 6.0;
    private Integer maxBacklogs = 0;

    @Column(length = 2000)
    private String requiredSkills; // e.g. "Java, Spring Boot, SQL, REST APIs"

    @Column(length = 2000)
    private String niceToHaveSkills; // e.g. "Docker, Kubernetes, AWS"

    private String location; // e.g. "Bangalore / Remote"
    private Double ctcLpa; // e.g. 14.5
    private String jobType = "Full-Time"; // Full-Time, Internship

    private LocalDate driveDate;
    private LocalDate applicationDeadline;

    private String status = "OPEN"; // OPEN, CLOSED, COMPLETED

    private String postedBy; // Recruiter name or email

    public JobPosting() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getCompanyLogo() { return companyLogo; }
    public void setCompanyLogo(String companyLogo) { this.companyLogo = companyLogo; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDepartmentEligibility() { return departmentEligibility; }
    public void setDepartmentEligibility(String departmentEligibility) { this.departmentEligibility = departmentEligibility; }

    public Double getMinCgpa() { return minCgpa; }
    public void setMinCgpa(Double minCgpa) { this.minCgpa = minCgpa; }

    public Integer getMaxBacklogs() { return maxBacklogs; }
    public void setMaxBacklogs(Integer maxBacklogs) { this.maxBacklogs = maxBacklogs; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public String getNiceToHaveSkills() { return niceToHaveSkills; }
    public void setNiceToHaveSkills(String niceToHaveSkills) { this.niceToHaveSkills = niceToHaveSkills; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getCtcLpa() { return ctcLpa; }
    public void setCtcLpa(Double ctcLpa) { this.ctcLpa = ctcLpa; }

    public String getJobType() { return jobType; }
    public void setJobType(String jobType) { this.jobType = jobType; }

    public LocalDate getDriveDate() { return driveDate; }
    public void setDriveDate(LocalDate driveDate) { this.driveDate = driveDate; }

    public LocalDate getApplicationDeadline() { return applicationDeadline; }
    public void setApplicationDeadline(LocalDate applicationDeadline) { this.applicationDeadline = applicationDeadline; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPostedBy() { return postedBy; }
    public void setPostedBy(String postedBy) { this.postedBy = postedBy; }
}
