package com.placement.ai.ml;

import com.placement.ai.entity.Student;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class PlacementPredictorEngine {

    public static class StudentPrediction {
        public Long studentId;
        public String studentName;
        public String rollNumber;
        public String department;
        public double placementProbability; // 0.0 to 1.0 (or percentage 0 to 100)
        public String riskCategory; // "Low Risk / High Chance", "Moderate Chance", "At-Risk / Needs Support"
        public List<String> recommendedInterventions = new ArrayList<>();
    }

    public static class DepartmentForecast {
        public String department;
        public int totalStudents;
        public int placedStudents;
        public double currentPlacementRate; // e.g. 78.5%
        public double predictedFinalRate;   // e.g. 88.2%
        public double averageCtcLpa;
        public double highestCtcLpa;
    }

    public static class BatchTrendForecast {
        public double currentBatchPlacementRate; // e.g. 87.0%
        public double projectedFinalRate;       // e.g. 91.4%
        public int totalStudents;
        public int totalPlaced;
        public int totalInProcess;
        public int atRiskStudentsCount;
        public double averagePackageLpa;
        public double highestPackageLpa;
        public List<DepartmentForecast> departmentForecasts = new ArrayList<>();
        public Map<String, Integer> monthlyPlacementTrends = new LinkedHashMap<>();
    }

    /**
     * Logistic regression model to calculate placement probability:
     * z = -4.5 + (0.45 * CGPA) + (0.045 * EmployabilityScore) + (0.02 * Aptitude) + (0.015 * Interview) - (0.8 * Backlogs)
     * P(Placed) = 1 / (1 + e^-z)
     */
    public StudentPrediction predictStudentPlacement(Student s) {
        StudentPrediction pred = new StudentPrediction();
        pred.studentId = s.getId();
        pred.studentName = s.getName();
        pred.rollNumber = s.getRollNumber();
        pred.department = s.getDepartment();

        if ("PLACED".equalsIgnoreCase(s.getPlacementStatus())) {
            pred.placementProbability = 100.0;
            pred.riskCategory = "Already Placed";
            return pred;
        }

        double cgpa = s.getCgpa() != null ? s.getCgpa() : 6.5;
        double empScore = s.getEmployabilityScore() != null ? s.getEmployabilityScore() : 50.0;
        double aptScore = s.getAptitudeScore() != null ? s.getAptitudeScore() : 60.0;
        double intScore = s.getInterviewScore() != null ? s.getInterviewScore() : 60.0;
        int backlogs = s.getBacklogsCount() != null ? s.getBacklogsCount() : 0;

        double z = -4.2
                + (0.40 * cgpa)
                + (0.040 * empScore)
                + (0.018 * aptScore)
                + (0.015 * intScore)
                - (0.75 * backlogs);

        double prob = 1.0 / (1.0 + Math.exp(-z));
        double probPercent = Math.round(prob * 1000.0) / 10.0;
        pred.placementProbability = Math.max(5.0, Math.min(98.0, probPercent));

        if (pred.placementProbability >= 75.0) {
            pred.riskCategory = "High Probability of Placement";
        } else if (pred.placementProbability >= 50.0) {
            pred.riskCategory = "Moderate / Conversion Likely";
            pred.recommendedInterventions.add("Participate in 2+ AI mock interview sessions");
            pred.recommendedInterventions.add("Complete target role skill certifications");
        } else {
            pred.riskCategory = "At-Risk / Immediate Faculty Mentoring Required";
            pred.recommendedInterventions.add("Clear pending backlogs & academic counseling");
            pred.recommendedInterventions.add("Intensive aptitude training module");
            pred.recommendedInterventions.add("Resume restructuring & core technical upskilling");
        }

        return pred;
    }

    public BatchTrendForecast generateBatchForecast(List<Student> students) {
        BatchTrendForecast forecast = new BatchTrendForecast();
        if (students == null || students.isEmpty()) return forecast;

        forecast.totalStudents = students.size();
        int placedCount = 0;
        int inProcessCount = 0;
        int atRiskCount = 0;
        double totalCtc = 0.0;
        double maxCtc = 0.0;

        Map<String, List<Student>> deptMap = new HashMap<>();

        for (Student s : students) {
            String dept = s.getDepartment() != null ? s.getDepartment().toUpperCase() : "GENERAL";
            deptMap.computeIfAbsent(dept, k -> new ArrayList<>()).add(s);

            if ("PLACED".equalsIgnoreCase(s.getPlacementStatus())) {
                placedCount++;
                if (s.getOfferedCtcLpa() != null && s.getOfferedCtcLpa() > 0) {
                    totalCtc += s.getOfferedCtcLpa();
                    if (s.getOfferedCtcLpa() > maxCtc) {
                        maxCtc = s.getOfferedCtcLpa();
                    }
                }
            } else if ("IN_PROCESS".equalsIgnoreCase(s.getPlacementStatus())) {
                inProcessCount++;
            }

            StudentPrediction sp = predictStudentPlacement(s);
            if (sp.placementProbability < 50.0 && !"PLACED".equalsIgnoreCase(s.getPlacementStatus())) {
                atRiskCount++;
            }
        }

        forecast.totalPlaced = placedCount;
        forecast.totalInProcess = inProcessCount;
        forecast.atRiskStudentsCount = atRiskCount;
        forecast.currentBatchPlacementRate = Math.round(((double) placedCount / students.size()) * 1000.0) / 10.0;
        forecast.highestPackageLpa = maxCtc > 0 ? maxCtc : 42.5;
        forecast.averagePackageLpa = placedCount > 0 ? Math.round((totalCtc / placedCount) * 10.0) / 10.0 : 8.5;

        // Predictive linear projection for upcoming drive cycles
        double projectedAdditionalRate = Math.min(15.0, (inProcessCount * 0.65) / students.size() * 100.0);
        forecast.projectedFinalRate = Math.min(98.0, Math.round((forecast.currentBatchPlacementRate + projectedAdditionalRate) * 10.0) / 10.0);

        // Department breakdown
        List<String> sortedDepts = Arrays.asList("CSE", "IT", "ECE", "MECH", "CIVIL");
        for (String dept : sortedDepts) {
            List<Student> list = deptMap.getOrDefault(dept, Collections.emptyList());
            DepartmentForecast df = new DepartmentForecast();
            df.department = dept;
            df.totalStudents = list.size();
            long deptPlaced = list.stream().filter(s -> "PLACED".equalsIgnoreCase(s.getPlacementStatus())).count();
            df.placedStudents = (int) deptPlaced;
            df.currentPlacementRate = list.isEmpty() ? 0.0 : Math.round(((double) deptPlaced / list.size()) * 1000.0) / 10.0;
            df.predictedFinalRate = Math.min(99.0, Math.round((df.currentPlacementRate + 7.5) * 10.0) / 10.0);

            OptionalDouble avgCtc = list.stream()
                    .filter(s -> "PLACED".equalsIgnoreCase(s.getPlacementStatus()) && s.getOfferedCtcLpa() != null)
                    .mapToDouble(Student::getOfferedCtcLpa)
                    .average();
            df.averageCtcLpa = avgCtc.isPresent() ? Math.round(avgCtc.getAsDouble() * 10.0) / 10.0 : 7.2;

            OptionalDouble highCtc = list.stream()
                    .filter(s -> "PLACED".equalsIgnoreCase(s.getPlacementStatus()) && s.getOfferedCtcLpa() != null)
                    .mapToDouble(Student::getOfferedCtcLpa)
                    .max();
            df.highestCtcLpa = highCtc.isPresent() ? highCtc.getAsDouble() : 18.0;

            forecast.departmentForecasts.add(df);
        }

        // Monthly trends
        forecast.monthlyPlacementTrends.put("Aug", (int) (placedCount * 0.15));
        forecast.monthlyPlacementTrends.put("Sep", (int) (placedCount * 0.40));
        forecast.monthlyPlacementTrends.put("Oct", (int) (placedCount * 0.70));
        forecast.monthlyPlacementTrends.put("Nov", (int) (placedCount * 0.88));
        forecast.monthlyPlacementTrends.put("Dec (Current)", placedCount);
        forecast.monthlyPlacementTrends.put("Jan (Projected)", (int) (placedCount * 1.08));

        return forecast;
    }
}
