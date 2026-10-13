package com.placement.ai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_sessions")
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "question_id")
    private InterviewQuestion question;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String studentAnswer;

    private Double overallScore;
    private Double clarityScore;
    private Double technicalAccuracyScore;
    private Double keywordCoverageScore;

    @Column(length = 2000)
    private String coveredKeywords;

    @Column(length = 2000)
    private String missingKeywords;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String aiFeedback;

    private LocalDateTime createdAt = LocalDateTime.now();

    public InterviewSession() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public InterviewQuestion getQuestion() { return question; }
    public void setQuestion(InterviewQuestion question) { this.question = question; }

    public String getStudentAnswer() { return studentAnswer; }
    public void setStudentAnswer(String studentAnswer) { this.studentAnswer = studentAnswer; }

    public Double getOverallScore() { return overallScore; }
    public void setOverallScore(Double overallScore) { this.overallScore = overallScore; }

    public Double getClarityScore() { return clarityScore; }
    public void setClarityScore(Double clarityScore) { this.clarityScore = clarityScore; }

    public Double getTechnicalAccuracyScore() { return technicalAccuracyScore; }
    public void setTechnicalAccuracyScore(Double technicalAccuracyScore) { this.technicalAccuracyScore = technicalAccuracyScore; }

    public Double getKeywordCoverageScore() { return keywordCoverageScore; }
    public void setKeywordCoverageScore(Double keywordCoverageScore) { this.keywordCoverageScore = keywordCoverageScore; }

    public String getCoveredKeywords() { return coveredKeywords; }
    public void setCoveredKeywords(String coveredKeywords) { this.coveredKeywords = coveredKeywords; }

    public String getMissingKeywords() { return missingKeywords; }
    public void setMissingKeywords(String missingKeywords) { this.missingKeywords = missingKeywords; }

    public String getAiFeedback() { return aiFeedback; }
    public void setAiFeedback(String aiFeedback) { this.aiFeedback = aiFeedback; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
