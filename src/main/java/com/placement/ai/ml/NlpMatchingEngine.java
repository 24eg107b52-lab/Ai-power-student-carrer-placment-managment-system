package com.placement.ai.ml;

import com.placement.ai.entity.JobPosting;
import com.placement.ai.entity.Student;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Pattern;

@Component
public class NlpMatchingEngine {

    private static final Set<String> STOPWORDS = new HashSet<>(Arrays.asList(
            "a", "an", "the", "and", "or", "but", "if", "then", "else", "when", "at", "by", "for", "with",
            "about", "against", "between", "into", "through", "during", "before", "after", "above", "below",
            "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then",
            "once", "here", "there", "all", "any", "both", "each", "few", "more", "most", "other", "some",
            "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can",
            "will", "just", "don", "should", "now", "we", "you", "our", "are", "is", "was", "were", "be",
            "been", "being", "have", "has", "had", "do", "does", "did", "doing", "i", "me", "my", "myself"
    ));

    private static final Map<String, String> SKILL_SYNONYMS = new HashMap<>();
    static {
        SKILL_SYNONYMS.put("reactjs", "react");
        SKILL_SYNONYMS.put("react.js", "react");
        SKILL_SYNONYMS.put("nodejs", "node");
        SKILL_SYNONYMS.put("node.js", "node");
        SKILL_SYNONYMS.put("spring-boot", "spring boot");
        SKILL_SYNONYMS.put("k8s", "kubernetes");
        SKILL_SYNONYMS.put("amazon web services", "aws");
        SKILL_SYNONYMS.put("gcp", "google cloud");
        SKILL_SYNONYMS.put("postgresql", "sql");
        SKILL_SYNONYMS.put("mysql", "sql");
        SKILL_SYNONYMS.put("relational database", "sql");
        SKILL_SYNONYMS.put("dsa", "data structures");
        SKILL_SYNONYMS.put("data structures and algorithms", "data structures");
        SKILL_SYNONYMS.put("ai", "artificial intelligence");
        SKILL_SYNONYMS.put("ml", "machine learning");
        SKILL_SYNONYMS.put("restful apis", "rest apis");
        SKILL_SYNONYMS.put("rest", "rest apis");
        SKILL_SYNONYMS.put("ci-cd", "ci/cd");
        SKILL_SYNONYMS.put("continuous integration", "ci/cd");
    }

    public static class MatchResult {
        public double overallMatchScore; // 0 to 100
        public double tfidfCosineSimilarity; // 0 to 1
        public double skillMatchPercentage; // 0 to 100
        public List<String> matchingSkills = new ArrayList<>();
        public List<String> missingSkills = new ArrayList<>();
        public boolean meetsAcademicEligibility;
        public String eligibilityStatus; // "Eligible", "CGPA Shortfall", "Backlog Disqualified"
        public String recommendationTier; // "Strong Match (90%+)", "Good Match (75-89%)", "Moderate Fit (60-74%)", "Low Match"
    }

    public MatchResult matchStudentToJob(Student student, JobPosting job) {
        MatchResult result = new MatchResult();

        // 1. Eligibility Check
        boolean cgpaOk = student.getCgpa() != null && (job.getMinCgpa() == null || student.getCgpa() >= job.getMinCgpa());
        boolean backlogOk = student.getBacklogsCount() != null && (job.getMaxBacklogs() == null || student.getBacklogsCount() <= job.getMaxBacklogs());
        boolean deptOk = true;
        if (job.getDepartmentEligibility() != null && !job.getDepartmentEligibility().equalsIgnoreCase("ALL")) {
            String studentDept = student.getDepartment() != null ? student.getDepartment().toUpperCase() : "";
            deptOk = Arrays.stream(job.getDepartmentEligibility().toUpperCase().split("[,]"))
                    .anyMatch(d -> d.trim().equals(studentDept));
        }

        result.meetsAcademicEligibility = cgpaOk && backlogOk && deptOk;
        if (!deptOk) {
            result.eligibilityStatus = "Department Not Eligible";
        } else if (!cgpaOk) {
            result.eligibilityStatus = "CGPA below minimum requirement (" + job.getMinCgpa() + ")";
        } else if (!backlogOk) {
            result.eligibilityStatus = "Exceeds allowed active backlogs (" + job.getMaxBacklogs() + ")";
        } else {
            result.eligibilityStatus = "Fully Eligible";
        }

        // 2. Extract Candidate Profile & Skills Text
        Set<String> candidateSkills = extractStandardizedSkills(student.getSkills() + " " + student.getProjects() + " " + student.getCertifications());
        if (student.getResumeText() != null) {
            candidateSkills.addAll(extractStandardizedSkills(student.getResumeText()));
        }

        // 3. Extract Job Required & Nice-to-have Skills
        Set<String> requiredSkills = extractStandardizedSkills(job.getRequiredSkills());
        Set<String> niceToHaveSkills = extractStandardizedSkills(job.getNiceToHaveSkills());

        // 4. Compute Skill Match
        int matchedReqCount = 0;
        for (String req : requiredSkills) {
            if (isSkillMatched(req, candidateSkills)) {
                matchedReqCount++;
                result.matchingSkills.add(req);
            } else {
                result.missingSkills.add(req);
            }
        }

        int matchedNiceCount = 0;
        for (String nice : niceToHaveSkills) {
            if (isSkillMatched(nice, candidateSkills)) {
                matchedNiceCount++;
                if (!result.matchingSkills.contains(nice)) {
                    result.matchingSkills.add(nice + " (Bonus)");
                }
            }
        }

        double reqRatio = requiredSkills.isEmpty() ? 1.0 : (double) matchedReqCount / requiredSkills.size();
        double niceRatio = niceToHaveSkills.isEmpty() ? 0.5 : (double) matchedNiceCount / niceToHaveSkills.size();
        result.skillMatchPercentage = Math.round((reqRatio * 80.0 + niceRatio * 20.0) * 10.0) / 10.0;

        // 5. Compute NLP TF-IDF Cosine Similarity
        String candidateDoc = buildStudentTextDocument(student);
        String jobDoc = (job.getTitle() != null ? job.getTitle() : "") + " "
                + (job.getDescription() != null ? job.getDescription() : "") + " "
                + (job.getRequiredSkills() != null ? job.getRequiredSkills() : "") + " "
                + (job.getNiceToHaveSkills() != null ? job.getNiceToHaveSkills() : "");

        double cosineSim = computeCosineSimilarity(candidateDoc, jobDoc);
        result.tfidfCosineSimilarity = Math.round(cosineSim * 1000.0) / 1000.0;

        // 6. Overall Weighted Score (0-100)
        double rawScore = (result.skillMatchPercentage * 0.60) + (cosineSim * 100.0 * 0.30) + (result.meetsAcademicEligibility ? 10.0 : 0.0);
        result.overallMatchScore = Math.min(100.0, Math.max(10.0, Math.round(rawScore * 10.0) / 10.0));

        // 7. Recommendation Tier
        if (result.overallMatchScore >= 85.0 && result.meetsAcademicEligibility) {
            result.recommendationTier = "Strong Fit (Top Recommended)";
        } else if (result.overallMatchScore >= 70.0 && result.meetsAcademicEligibility) {
            result.recommendationTier = "Good Fit (Qualified)";
        } else if (result.overallMatchScore >= 55.0) {
            result.recommendationTier = "Moderate Fit (Skill Upskilling Recommended)";
        } else {
            result.recommendationTier = "Low Fit";
        }

        return result;
    }

    private boolean isSkillMatched(String required, Set<String> candidateSkills) {
        String cleanReq = normalizeSkill(required);
        for (String c : candidateSkills) {
            String cleanCand = normalizeSkill(c);
            if (cleanCand.equals(cleanReq) || cleanCand.contains(cleanReq) || cleanReq.contains(cleanCand)) {
                return true;
            }
        }
        return false;
    }

    private String normalizeSkill(String skill) {
        String s = skill.toLowerCase().trim();
        return SKILL_SYNONYMS.getOrDefault(s, s);
    }

    public Set<String> extractStandardizedSkills(String text) {
        Set<String> found = new LinkedHashSet<>();
        if (text == null || text.isBlank()) return found;

        String[] parts = text.split("[,;\\n\\r|/•·]");
        for (String p : parts) {
            String token = p.trim().toLowerCase().replaceAll("[^a-zA-Z0-9+#./ -]", "");
            if (token.length() >= 2 && !STOPWORDS.contains(token)) {
                found.add(SKILL_SYNONYMS.getOrDefault(token, token));
            }
        }
        return found;
    }

    private String buildStudentTextDocument(Student s) {
        StringBuilder sb = new StringBuilder();
        if (s.getSkills() != null) sb.append(s.getSkills()).append(" ");
        if (s.getProjects() != null) sb.append(s.getProjects()).append(" ");
        if (s.getCertifications() != null) sb.append(s.getCertifications()).append(" ");
        if (s.getResumeText() != null) sb.append(s.getResumeText()).append(" ");
        if (s.getTargetRole() != null) sb.append(s.getTargetRole()).append(" ");
        if (s.getDepartment() != null) sb.append(s.getDepartment()).append(" ");
        return sb.toString();
    }

    public double computeCosineSimilarity(String text1, String text2) {
        Map<String, Integer> freq1 = getTermFrequencies(text1);
        Map<String, Integer> freq2 = getTermFrequencies(text2);

        Set<String> allTerms = new HashSet<>();
        allTerms.addAll(freq1.keySet());
        allTerms.addAll(freq2.keySet());

        if (allTerms.isEmpty()) return 0.0;

        double dotProduct = 0.0;
        double norm1 = 0.0;
        double norm2 = 0.0;

        for (String term : allTerms) {
            int count1 = freq1.getOrDefault(term, 0);
            int count2 = freq2.getOrDefault(term, 0);

            // Compute pseudo TF (log normalized)
            double tf1 = count1 > 0 ? (1.0 + Math.log(count1)) : 0.0;
            double tf2 = count2 > 0 ? (1.0 + Math.log(count2)) : 0.0;

            dotProduct += (tf1 * tf2);
            norm1 += (tf1 * tf1);
            norm2 += (tf2 * tf2);
        }

        if (norm1 == 0.0 || norm2 == 0.0) return 0.0;
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    private Map<String, Integer> getTermFrequencies(String text) {
        Map<String, Integer> freq = new HashMap<>();
        if (text == null) return freq;

        String clean = text.toLowerCase().replaceAll("[^a-zA-Z0-9+# -]", " ");
        String[] words = clean.split("\\s+");
        for (String w : words) {
            if (w.length() >= 2 && !STOPWORDS.contains(w)) {
                freq.put(w, freq.getOrDefault(w, 0) + 1);
            }
        }
        return freq;
    }
}
