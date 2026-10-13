package com.placement.ai.ml;

import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class ResumeParserEngine {

    private static final List<String> KNOWN_SKILLS = Arrays.asList(
            "Java", "Spring Boot", "Hibernate", "Microservices", "Python", "Django", "Flask",
            "JavaScript", "TypeScript", "React", "Angular", "Vue.js", "Node.js", "Express.js",
            "HTML5", "CSS3", "Tailwind CSS", "Bootstrap",
            "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Oracle",
            "Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "Jenkins", "Git", "GitHub", "Linux",
            "Data Structures", "Algorithms", "System Design", "OOP", "REST APIs", "GraphQL",
            "Machine Learning", "Deep Learning", "NLP", "Pandas", "NumPy", "Scikit-Learn", "TensorFlow", "PyTorch"
    );

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}"
    );

    private static final Pattern PHONE_PATTERN = Pattern.compile(
            "(?:\\+?\\d{1,3}[- ]?)?\\b\\d{10}\\b"
    );

    private static final Pattern CGPA_PATTERN = Pattern.compile(
            "(?i)(?:cgpa|gpa)\\s*[:=-]?\\s*([0-9]\\.?[0-9]*)", Pattern.CASE_INSENSITIVE
    );

    public static class ParsedResume {
        public String candidateName;
        public String email;
        public String phone;
        public Double detectedCgpa;
        public List<String> extractedSkills = new ArrayList<>();
        public List<String> extractedCertifications = new ArrayList<>();
        public List<String> extractedProjects = new ArrayList<>();
        public String detectedEducation;
        public int totalWords;
    }

    public ParsedResume parseResumeText(String resumeContent) {
        ParsedResume result = new ParsedResume();
        if (resumeContent == null || resumeContent.trim().isEmpty()) {
            return result;
        }

        result.totalWords = resumeContent.trim().split("\\s+").length;

        // 1. Email Extraction
        Matcher emailMatcher = EMAIL_PATTERN.matcher(resumeContent);
        if (emailMatcher.find()) {
            result.email = emailMatcher.group();
        }

        // 2. Phone Extraction
        Matcher phoneMatcher = PHONE_PATTERN.matcher(resumeContent);
        if (phoneMatcher.find()) {
            result.phone = phoneMatcher.group();
        }

        // 3. CGPA Extraction
        Matcher cgpaMatcher = CGPA_PATTERN.matcher(resumeContent);
        if (cgpaMatcher.find()) {
            try {
                double val = Double.parseDouble(cgpaMatcher.group(1));
                if (val <= 10.0) {
                    result.detectedCgpa = val;
                }
            } catch (Exception ignored) {}
        }

        // 4. Skills Extraction (Entity Recognition)
        String lowerContent = resumeContent.toLowerCase();
        for (String skill : KNOWN_SKILLS) {
            String regex = "\\b" + Pattern.quote(skill.toLowerCase()) + "\\b";
            if (Pattern.compile(regex).matcher(lowerContent).find()) {
                if (!result.extractedSkills.contains(skill)) {
                    result.extractedSkills.add(skill);
                }
            }
        }

        // 5. Sections Extraction (Projects, Certifications, Education)
        String[] lines = resumeContent.split("[\\r\\n]+");
        String currentSection = "HEADER";
        for (String line : lines) {
            String trimmed = line.trim();
            String upper = trimmed.toUpperCase();

            if (upper.contains("PROJECT")) {
                currentSection = "PROJECTS";
                continue;
            } else if (upper.contains("CERTIFICATION") || upper.contains("ACHIEVEMENT")) {
                currentSection = "CERTIFICATIONS";
                continue;
            } else if (upper.contains("EDUCATION") || upper.contains("ACADEMIC")) {
                currentSection = "EDUCATION";
                continue;
            } else if (upper.contains("EXPERIENCE") || upper.contains("WORK")) {
                currentSection = "EXPERIENCE";
                continue;
            }

            if (trimmed.length() > 5) {
                if ("PROJECTS".equals(currentSection) && result.extractedProjects.size() < 4) {
                    if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
                        result.extractedProjects.add(trimmed.replaceFirst("^[•\\-*]\\s*", ""));
                    } else if (trimmed.matches(".*[:\\-].*") && trimmed.length() < 120) {
                        result.extractedProjects.add(trimmed);
                    }
                } else if ("CERTIFICATIONS".equals(currentSection) && result.extractedCertifications.size() < 4) {
                    if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
                        result.extractedCertifications.add(trimmed.replaceFirst("^[•\\-*]\\s*", ""));
                    } else if (trimmed.length() < 100) {
                        result.extractedCertifications.add(trimmed);
                    }
                } else if ("EDUCATION".equals(currentSection) && result.detectedEducation == null) {
                    if (upper.contains("B.TECH") || upper.contains("BE") || upper.contains("COMPUTER SCIENCE") || upper.contains("ENGINEERING")) {
                        result.detectedEducation = trimmed;
                    }
                }
            }
        }

        // If candidate name not explicit, take first non-empty line
        for (String line : lines) {
            String trimmed = line.trim();
            if (!trimmed.isEmpty() && trimmed.length() < 40 && !trimmed.contains("@") && !trimmed.contains("http")) {
                result.candidateName = trimmed;
                break;
            }
        }

        return result;
    }
}
