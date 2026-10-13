package com.placement.ai.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "upskilling_resources")
public class UpskillingResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String skillName; // e.g. "Docker", "Spring Boot", "React", "AWS", "Python", "DSA"
    private String title;     // e.g. "Complete Docker & Kubernetes Masterclass"

    @Lob
    @Column(columnDefinition = "CLOB")
    private String description;

    private String resourceType; // COURSE, TUTORIAL, DOCUMENTATION, PROJECT
    private String provider;     // Coursera, Udemy, Official Docs, LeetCode, freeCodeCamp
    private String url;
    private String estimatedHours;
    private String difficultyLevel; // BEGINNER, INTERMEDIATE, ADVANCED

    public UpskillingResource() {}

    public UpskillingResource(String skillName, String title, String description, String resourceType, String provider, String url, String estimatedHours, String difficultyLevel) {
        this.skillName = skillName;
        this.title = title;
        this.description = description;
        this.resourceType = resourceType;
        this.provider = provider;
        this.url = url;
        this.estimatedHours = estimatedHours;
        this.difficultyLevel = difficultyLevel;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(String estimatedHours) { this.estimatedHours = estimatedHours; }

    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }
}
