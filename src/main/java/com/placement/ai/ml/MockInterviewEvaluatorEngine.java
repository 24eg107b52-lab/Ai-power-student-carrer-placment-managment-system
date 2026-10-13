package com.placement.ai.ml;

import com.placement.ai.entity.InterviewQuestion;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class MockInterviewEvaluatorEngine {

    private static final Set<String> FILLER_WORDS = new HashSet<>(Arrays.asList(
            "um", "uh", "like", "basically", "actually", "you know", "sort of", "kind of", "i mean", "literally"
    ));

    public static class EvaluationResult {
        public double overallScore; // 0 to 100
        public double technicalAccuracyScore;
        public double clarityScore;
        public double keywordCoverageScore;
        public List<String> coveredKeywords = new ArrayList<>();
        public List<String> missingKeywords = new ArrayList<>();
        public List<String> detectedFillerWords = new ArrayList<>();
        public String aiFeedback;
        public List<String> improvementTips = new ArrayList<>();
        public String performanceRating; // "Outstanding", "Proficient", "Developing", "Needs Remediation"
    }

    public EvaluationResult evaluateResponse(InterviewQuestion question, String studentAnswer) {
        EvaluationResult result = new EvaluationResult();

        if (studentAnswer == null || studentAnswer.trim().isEmpty()) {
            result.overallScore = 15.0;
            result.technicalAccuracyScore = 10.0;
            result.clarityScore = 20.0;
            result.keywordCoverageScore = 0.0;
            result.performanceRating = "Incomplete";
            result.aiFeedback = "No response was recorded. Please attempt the question with a structured explanation.";
            result.improvementTips.add("Speak clearly into your microphone or type a detailed response.");
            return result;
        }

        String answerLower = studentAnswer.toLowerCase().trim();
        String[] words = answerLower.split("\\s+");
        int wordCount = words.length;

        // 1. Keyword Coverage Analysis
        List<String> expectedKeywords = new ArrayList<>();
        if (question.getExpectedKeywords() != null && !question.getExpectedKeywords().isBlank()) {
            for (String kw : question.getExpectedKeywords().split("[,]")) {
                String clean = kw.trim().toLowerCase();
                if (!clean.isEmpty()) expectedKeywords.add(clean);
            }
        }

        int matchedCount = 0;
        for (String kw : expectedKeywords) {
            if (answerLower.contains(kw)) {
                matchedCount++;
                result.coveredKeywords.add(kw);
            } else {
                result.missingKeywords.add(kw);
            }
        }

        double keywordRatio = expectedKeywords.isEmpty() ? 0.8 : (double) matchedCount / expectedKeywords.size();
        result.keywordCoverageScore = Math.round(keywordRatio * 100.0 * 10.0) / 10.0;

        // 2. Clarity & Articulation Analysis
        int fillerCount = 0;
        for (String w : words) {
            if (FILLER_WORDS.contains(w)) {
                fillerCount++;
                if (!result.detectedFillerWords.contains(w)) {
                    result.detectedFillerWords.add(w);
                }
            }
        }

        // Vocabulary diversity (unique words / total words)
        Set<String> uniqueWords = new HashSet<>(Arrays.asList(words));
        double lexicalDiversity = wordCount > 0 ? (double) uniqueWords.size() / wordCount : 0.0;

        // Ideal answer length: between 50 and 250 words
        double lengthPenalty = 0.0;
        if (wordCount < 30) {
            lengthPenalty = 25.0; // too brief
        } else if (wordCount < 50) {
            lengthPenalty = 10.0;
        }

        double baseClarity = 85.0 - (fillerCount * 4.0) + (lexicalDiversity * 15.0) - lengthPenalty;
        result.clarityScore = Math.max(20.0, Math.min(100.0, Math.round(baseClarity * 10.0) / 10.0));

        // 3. Technical Accuracy
        // If keyword coverage is good and answer length is substantive, technical accuracy is high
        double baseTech = (result.keywordCoverageScore * 0.70) + (wordCount >= 40 ? 30.0 : wordCount * 0.75);
        result.technicalAccuracyScore = Math.max(15.0, Math.min(100.0, Math.round(baseTech * 10.0) / 10.0));

        // 4. Overall Weighted Score
        double overall = (result.technicalAccuracyScore * 0.50)
                + (result.keywordCoverageScore * 0.30)
                + (result.clarityScore * 0.20);
        result.overallScore = Math.round(overall * 10.0) / 10.0;

        // 5. Performance Tier & Feedback
        if (result.overallScore >= 85.0) {
            result.performanceRating = "Outstanding / Industry Ready";
        } else if (result.overallScore >= 70.0) {
            result.performanceRating = "Proficient / Competitive";
        } else if (result.overallScore >= 50.0) {
            result.performanceRating = "Developing / Good Foundation";
        } else {
            result.performanceRating = "Needs Remediation";
        }

        StringBuilder feedback = new StringBuilder();
        feedback.append("Candidate answered with ").append(wordCount).append(" words. ");
        if (!result.coveredKeywords.isEmpty()) {
            feedback.append("Successfully touched on key industry concepts: ").append(String.join(", ", result.coveredKeywords)).append(". ");
        }
        if (!result.missingKeywords.isEmpty()) {
            feedback.append("Could be significantly enhanced by explicitly mentioning: ").append(String.join(", ", result.missingKeywords)).append(". ");
        }
        if (fillerCount > 2) {
            feedback.append("Detected occasional filler words (").append(String.join(", ", result.detectedFillerWords)).append("); focus on deliberate pauses instead. ");
        }
        result.aiFeedback = feedback.toString();

        // 6. Actionable Tips
        if (!result.missingKeywords.isEmpty()) {
            result.improvementTips.add("Incorporate core architectural terms like: " + String.join(", ", result.missingKeywords));
        }
        if (wordCount < 40) {
            result.improvementTips.add("Expand your answer with real-world examples, implementation tradeoffs, or complexity analysis (Big-O).");
        }
        if (fillerCount > 1) {
            result.improvementTips.add("Practice pausing for 1-2 seconds rather than using filler words when formulating thoughts.");
        }
        result.improvementTips.add("Structure technical answers: 1) Definition, 2) Key Mechanism, 3) Real-world Application, 4) Tradeoffs/Edge Cases.");

        return result;
    }
}
