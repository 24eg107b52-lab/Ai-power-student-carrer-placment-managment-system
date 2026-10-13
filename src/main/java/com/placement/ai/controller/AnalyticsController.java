package com.placement.ai.controller;

import com.placement.ai.entity.Student;
import com.placement.ai.service.AnalyticsService;
import com.placement.ai.service.StudentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final StudentService studentService;

    public AnalyticsController(AnalyticsService analyticsService, StudentService studentService) {
        this.analyticsService = analyticsService;
        this.studentService = studentService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AnalyticsService.AnalyticsDashboardDTO> getDashboard() {
        return ResponseEntity.ok(analyticsService.getDashboardMetrics());
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportPlacementReport() {
        List<Student> students = studentService.getAllStudents();
        StringBuilder csv = new StringBuilder();
        csv.append("Roll Number,Name,Department,CGPA,Employability Score,Placement Status,Placed Company,Offered CTC (LPA)\n");

        for (Student s : students) {
            csv.append(escape(s.getRollNumber())).append(",")
               .append(escape(s.getName())).append(",")
               .append(escape(s.getDepartment())).append(",")
               .append(s.getCgpa()).append(",")
               .append(s.getEmployabilityScore()).append(",")
               .append(escape(s.getPlacementStatus())).append(",")
               .append(escape(s.getPlacedCompany() != null ? s.getPlacedCompany() : "N/A")).append(",")
               .append(s.getOfferedCtcLpa() != null ? s.getOfferedCtcLpa() : 0.0)
               .append("\n");
        }

        byte[] bytes = csv.toString().getBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=placement_analytics_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    private String escape(String val) {
        if (val == null) return "";
        return "\"" + val.replace("\"", "\"\"") + "\"";
    }
}
