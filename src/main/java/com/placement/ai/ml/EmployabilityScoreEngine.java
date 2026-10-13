package com.placement.ai.ml;

import com.placement.ai.entity.Student;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class EmployabilityScoreEngine {

    // Industry benchmark skill profiles
    private static final Map<String, Set<String>> ROLE_SKILL_BENCHMARKS = new HashMap<>();

    static {
        ROLE_SKILL_BENCHMARKS.put("Full Stack Developer", new HashSet<>(Arrays.asList(
                "java", "spring boot", "react", "javascript", "sql", "git", "rest apis", "docker", "html/css"
        )));
        ROLE_SKILL_BENCHMARKS.put("Data Scientist / AI Engineer", new HashSet<>(Arrays.asList(
                "python", "machine learning", "deep learning", "sql", "pandas", "scikit-learn", "nlp", "statistics"
        )));
        ROLE_SKILL_BENCHMARKS.put("Cloud & DevOps Engineer", new HashSet<>(Arrays.asList(
                "linux", "docker", "kubernetes", "aws", "ci/cd", "git", "bash", "python", "networking"
        )));
        ROLE_SKILL_BENCHMARKS.put("Software Development Engineer (SDE)", new HashSet<>(Arrays.asList(
                "data structures", "algorithms", "java", "c++", "system design", "sql", "git", "problem solving"
        )));
    }

    // High-value industry skills and weights
    private static final Map<String, Double> SKILL_WEIGHTS = new HashMap<>();
    static {
        SKILL_WEIGHTS.put("data structures", 9.5);
        SKILL_WEIGHTS.put("algorithms", 9.5);
        SKILL_WEIGHTS.put("system design", 9.0);
        SKILL_WEIGHTS.put("spring boot", 8.8);
        SKILL_WEIGHTS.put("machine learning", 8.8);
        SKILL_WEIGHTS.put("docker", 8.5);
        SKILL_WEIGHTS.put("kubernetes", 8.5);
        SKILL_WEIGHTS.put("aws", 8.5);
        SKILL_WEIGHTS.put("react", 8.2);
        SKILL_WEIGHTS.put("java", 8.0);
        SKILL_WEIGHTS.put("python", 8.0);
        SKILL_WEIGHTS.put("sql", 7.8);
        SKILL_WEIGHTS.put("ci/cd", 7.8);
        SKILL_WEIGHTS.put("rest apis", 7.5);
        SKILL_WEIGHTS.put("git", 7.0);
        SKILL_WEIGHTS.put("linux", 7.0);
    }

    public static class ScoreBreakdown {
        public double overallEmployabilityScore;
        public double academicScore;
        public double technicalScore;
        public double aptitudeScore;
        public double interviewScore;
        public double projectCertificationScore;
        public List<String> identifiedSkillGaps = new ArrayList<>();
        public List<String> masteredSkills = new ArrayList<>();
        public Map<String, Double> roleReadinessPercentages = new HashMap<>();
        public String careerReadinessTier; // "Placement Ready", "High Potential", "Needs Upskilling", "Critical Focus"
    }

    /**
     * Multi-criteria ML evaluation scoring:
     * - Academic Record: 25%
     * - Technical Skill Matrix: 30%
     * - Aptitude & Assessment: 20%
     * - Mock Interview & Verbal Performance: 15%
     * - Projects & Certifications: 10%
     */
    public ScoreBreakdown calculateEmployability(Student student) {
        ScoreBreakdown breakdown = new ScoreBreakdown();

        // 1. Academic Score (0 - 100)
        double cgpa = student.getCgpa() != null ? student.getCgpa() : 7.0;
        double tenth = student.getTenthPercentage() != null ? student.getTenthPercentage() : 75.0;
        double twelfth = student.getTwelfthPercentage() != null ? student.getTwelfthPercentage() : 75.0;
        int backlogs = student.getBacklogsCount() != null ? student.getBacklogsCount() : 0;

        double baseAcademic = (cgpa / 10.0) * 70.0 + ((tenth + twelfth) / 200.0) * 30.0;
        // Penalty for active backlogs (8 points per backlog)
        double academicScore = Math.max(20.0, Math.min(100.0, baseAcademic - (backlogs * 8.0)));
        breakdown.academicScore = round(academicScore);

        // 2. Technical Score (0 - 100)
        Set<String> studentSkillSet = parseSkills(student.getSkills());
        breakdown.masteredSkills = new ArrayList<>(studentSkillSet);

        double totalSkillValue = 0.0;
        double maxExpectedSkillValue = 60.0;
        for (String skill : studentSkillSet) {
            double weight = SKILL_WEIGHTS.getOrDefault(skill.toLowerCase(), 6.0);
            totalSkillValue += weight;
        }
        double technicalScore = Math.min(100.0, (totalSkillValue / maxExpectedSkillValue) * 100.0);
        breakdown.technicalScore = round(technicalScore);

        // 3. Aptitude Score (0 - 100)
        double aptitudeScore = student.getAptitudeScore() != null && student.getAptitudeScore() > 0
                ? student.getAptitudeScore()
                : (cgpa >= 8.0 ? 78.0 : 68.0);
        breakdown.aptitudeScore = round(aptitudeScore);

        // 4. Mock Interview Score (0 - 100)
        double interviewScore = student.getInterviewScore() != null && student.getInterviewScore() > 0
                ? student.getInterviewScore()
                : 70.0;
        breakdown.interviewScore = round(interviewScore);

        // 5. Projects & Certifications (0 - 100)
        int certCount = student.getCertifications() != null && !student.getCertifications().isBlank()
                ? student.getCertifications().split("[,;\n]").length : 0;
        int projCount = student.getProjects() != null && !student.getProjects().isBlank()
                ? student.getProjects().split("[,;\n]").length : 0;
        double projCertScore = Math.min(100.0, (certCount * 20.0) + (projCount * 25.0) + 15.0);
        breakdown.projectCertificationScore = round(projCertScore);

        // Weighted Overall Score
        double overall = (breakdown.academicScore * 0.25)
                + (breakdown.technicalScore * 0.30)
                + (breakdown.aptitudeScore * 0.20)
                + (breakdown.interviewScore * 0.15)
                + (breakdown.projectCertificationScore * 0.10);
        breakdown.overallEmployabilityScore = round(overall);

        // Determine Readiness Tier
        if (breakdown.overallEmployabilityScore >= 80.0) {
            breakdown.careerReadinessTier = "Placement Ready (Tier 1 Fit)";
        } else if (breakdown.overallEmployabilityScore >= 68.0) {
            breakdown.careerReadinessTier = "High Potential (Tier 2 Ready)";
        } else if (breakdown.overallEmployabilityScore >= 50.0) {
            breakdown.careerReadinessTier = "Needs Upskilling";
        } else {
            breakdown.careerReadinessTier = "Critical Focus & Intervention Required";
        }

        // Skill Gap Analysis against target role or benchmark roles
        String targetRole = student.getTargetRole() != null && !student.getTargetRole().isBlank()
                ? student.getTargetRole() : "Full Stack Developer";

        Set<String> benchmark = ROLE_SKILL_BENCHMARKS.getOrDefault(targetRole, ROLE_SKILL_BENCHMARKS.get("Full Stack Developer"));
        for (String req : benchmark) {
            boolean matched = false;
            for (String s : studentSkillSet) {
                if (s.equalsIgnoreCase(req) || s.contains(req) || req.contains(s)) {
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                breakdown.identifiedSkillGaps.add(req);
            }
        }

        // Compute readiness for each role
        for (Map.Entry<String, Set<String>> entry : ROLE_SKILL_BENCHMARKS.entrySet()) {
            Set<String> roleReqs = entry.getValue();
            long matchCount = roleReqs.stream().filter(req ->
                    studentSkillSet.stream().anyMatch(s -> s.equalsIgnoreCase(req) || s.contains(req) || req.contains(s))
            ).count();
            double readiness = Math.min(100.0, ((double) matchCount / roleReqs.size()) * 70.0 + (breakdown.academicScore * 0.3));
            breakdown.roleReadinessPercentages.put(entry.getKey(), round(readiness));
        }

        return breakdown;
    }

    public Set<String> parseSkills(String skillsString) {
        Set<String> set = new LinkedHashSet<>();
        if (skillsString == null || skillsString.isBlank()) return set;
        String[] tokens = skillsString.split("[,;\\n|/]");
        for (String t : tokens) {
            String clean = t.trim().toLowerCase();
            if (!clean.isEmpty()) {
                set.add(clean);
            }
        }
        return set;
    }

    private double round(double val) {
        return Math.round(val * 10.0) / 10.0;
    }
}
