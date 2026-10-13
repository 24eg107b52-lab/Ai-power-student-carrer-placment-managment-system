package com.placement.ai.controller;

import com.placement.ai.entity.Student;
import com.placement.ai.ml.EmployabilityScoreEngine;
import com.placement.ai.ml.ResumeParserEngine;
import com.placement.ai.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;
    private final EmployabilityScoreEngine employabilityScoreEngine;

    public StudentController(StudentService studentService, EmployabilityScoreEngine employabilityScoreEngine) {
        this.studentService = studentService;
        this.employabilityScoreEngine = employabilityScoreEngine;
    }

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/roll/{rollNumber}")
    public ResponseEntity<Student> getStudentByRoll(@PathVariable String rollNumber) {
        return studentService.getStudentByRollNumber(rollNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        return ResponseEntity.ok(studentService.saveStudent(student));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student updated) {
        return studentService.getStudentById(id).map(s -> {
            s.setName(updated.getName());
            s.setEmail(updated.getEmail());
            s.setDepartment(updated.getDepartment());
            s.setSemester(updated.getSemester());
            s.setCgpa(updated.getCgpa());
            s.setTenthPercentage(updated.getTenthPercentage());
            s.setTwelfthPercentage(updated.getTwelfthPercentage());
            s.setBacklogsCount(updated.getBacklogsCount());
            s.setSkills(updated.getSkills());
            s.setCertifications(updated.getCertifications());
            s.setProjects(updated.getProjects());
            s.setTargetRole(updated.getTargetRole());
            if (updated.getPlacementStatus() != null) {
                s.setPlacementStatus(updated.getPlacementStatus());
            }
            if (updated.getPlacedCompany() != null) {
                s.setPlacedCompany(updated.getPlacedCompany());
            }
            if (updated.getOfferedCtcLpa() != null) {
                s.setOfferedCtcLpa(updated.getOfferedCtcLpa());
            }
            return ResponseEntity.ok(studentService.saveStudent(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/resume")
    public ResponseEntity<ResumeParserEngine.ParsedResume> uploadResume(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String resumeText = payload.get("resumeText");
        ResumeParserEngine.ParsedResume parsed = studentService.parseAndUploadResume(id, resumeText);
        return ResponseEntity.ok(parsed);
    }

    @GetMapping("/{id}/score-breakdown")
    public ResponseEntity<EmployabilityScoreEngine.ScoreBreakdown> getScoreBreakdown(@PathVariable Long id) {
        return studentService.getStudentById(id)
                .map(s -> ResponseEntity.ok(employabilityScoreEngine.calculateEmployability(s)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/recalculate-score")
    public ResponseEntity<Student> recalculateScore(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.refreshEmployabilityScore(id));
    }
}
