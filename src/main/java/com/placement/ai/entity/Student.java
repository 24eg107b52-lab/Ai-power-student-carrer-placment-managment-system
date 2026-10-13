package com.placement.ai.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(unique = true, nullable = false)
    private String rollNumber;

    private String name;
    private String email;
    private String department; // CSE, IT, ECE, MECH, CIVIL
    private Integer semester;

    private Double cgpa;
    private Double tenthPercentage;
    private Double twelfthPercentage;
    private Integer backlogsCount = 0;

    @Column(length = 2000)
    private String skills; // Comma separated: Java, Spring Boot, React, SQL, etc.

    @Column(length = 2000)
    private String certifications;

    @Column(length = 3000)
    private String projects;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String resumeText;

    private String targetRole; // e.g., "Full Stack Developer", "Data Scientist", "Cloud Engineer"

    // AI-Computed Metrics
    private Double employabilityScore = 0.0;
    private Double academicScore = 0.0;
    private Double technicalScore = 0.0;
    private Double aptitudeScore = 0.0;
    private Double interviewScore = 0.0;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String skillGapAnalysis; // JSON string with missing skills & advice

    private String placementStatus = "UNPLACED"; // UNPLACED, IN_PROCESS, PLACED
    private String placedCompany;
    private Double offeredCtcLpa;

    private Boolean verifiedByFaculty = true;

    public Student() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }

    public Double getTenthPercentage() { return tenthPercentage; }
    public void setTenthPercentage(Double tenthPercentage) { this.tenthPercentage = tenthPercentage; }

    public Double getTwelfthPercentage() { return twelfthPercentage; }
    public void setTwelfthPercentage(Double twelfthPercentage) { this.twelfthPercentage = twelfthPercentage; }

    public Integer getBacklogsCount() { return backlogsCount; }
    public void setBacklogsCount(Integer backlogsCount) { this.backlogsCount = backlogsCount; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getCertifications() { return certifications; }
    public void setCertifications(String certifications) { this.certifications = certifications; }

    public String getProjects() { return projects; }
    public void setProjects(String projects) { this.projects = projects; }

    public String getResumeText() { return resumeText; }
    public void setResumeText(String resumeText) { this.resumeText = resumeText; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    public Double getEmployabilityScore() { return employabilityScore; }
    public void setEmployabilityScore(Double employabilityScore) { this.employabilityScore = employabilityScore; }

    public Double getAcademicScore() { return academicScore; }
    public void setAcademicScore(Double academicScore) { this.academicScore = academicScore; }

    public Double getTechnicalScore() { return technicalScore; }
    public void setTechnicalScore(Double technicalScore) { this.technicalScore = technicalScore; }

    public Double getAptitudeScore() { return aptitudeScore; }
    public void setAptitudeScore(Double aptitudeScore) { this.aptitudeScore = aptitudeScore; }

    public Double getInterviewScore() { return interviewScore; }
    public void setInterviewScore(Double interviewScore) { this.interviewScore = interviewScore; }

    public String getSkillGapAnalysis() { return skillGapAnalysis; }
    public void setSkillGapAnalysis(String skillGapAnalysis) { this.skillGapAnalysis = skillGapAnalysis; }

    public String getPlacementStatus() { return placementStatus; }
    public void setPlacementStatus(String placementStatus) { this.placementStatus = placementStatus; }

    public String getPlacedCompany() { return placedCompany; }
    public void setPlacedCompany(String placedCompany) { this.placedCompany = placedCompany; }

    public Double getOfferedCtcLpa() { return offeredCtcLpa; }
    public void setOfferedCtcLpa(Double offeredCtcLpa) { this.offeredCtcLpa = offeredCtcLpa; }

    public Boolean getVerifiedByFaculty() { return verifiedByFaculty; }
    public void setVerifiedByFaculty(Boolean verifiedByFaculty) { this.verifiedByFaculty = verifiedByFaculty; }
}
