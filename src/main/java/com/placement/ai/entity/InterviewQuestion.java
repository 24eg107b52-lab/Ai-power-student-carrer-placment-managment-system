package com.placement.ai.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "interview_questions")
public class InterviewQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category; // TECHNICAL, BEHAVIORAL, SYSTEM_DESIGN, HR
    private String topic;    // Java, Spring Boot, DSA, SQL, Architecture, Behavioral

    @Lob
    @Column(columnDefinition = "CLOB")
    private String questionText;

    @Column(length = 2000)
    private String expectedKeywords; // comma separated keywords essential for answer

    @Lob
    @Column(columnDefinition = "CLOB")
    private String sampleIdealAnswer;

    private String difficulty; // EASY, MEDIUM, HARD

    public InterviewQuestion() {}

    public InterviewQuestion(String category, String topic, String questionText, String expectedKeywords, String sampleIdealAnswer, String difficulty) {
        this.category = category;
        this.topic = topic;
        this.questionText = questionText;
        this.expectedKeywords = expectedKeywords;
        this.sampleIdealAnswer = sampleIdealAnswer;
        this.difficulty = difficulty;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getExpectedKeywords() { return expectedKeywords; }
    public void setExpectedKeywords(String expectedKeywords) { this.expectedKeywords = expectedKeywords; }

    public String getSampleIdealAnswer() { return sampleIdealAnswer; }
    public void setSampleIdealAnswer(String sampleIdealAnswer) { this.sampleIdealAnswer = sampleIdealAnswer; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
}
