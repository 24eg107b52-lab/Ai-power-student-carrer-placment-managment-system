package com.placement.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.placement.ai.entity.Student;
import com.placement.ai.ml.EmployabilityScoreEngine;
import com.placement.ai.ml.ResumeParserEngine;
import com.placement.ai.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final EmployabilityScoreEngine employabilityScoreEngine;
    private final ResumeParserEngine resumeParserEngine;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public StudentService(StudentRepository studentRepository,
                          EmployabilityScoreEngine employabilityScoreEngine,
                          ResumeParserEngine resumeParserEngine) {
        this.studentRepository = studentRepository;
        this.employabilityScoreEngine = employabilityScoreEngine;
        this.resumeParserEngine = resumeParserEngine;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAllOrderByEmployabilityScoreDesc();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Optional<Student> getStudentByRollNumber(String roll) {
        return studentRepository.findByRollNumber(roll);
    }

    public Optional<Student> getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId);
    }

    @Transactional
    public Student saveStudent(Student student) {
        // Calculate initial or updated employability score
        EmployabilityScoreEngine.ScoreBreakdown breakdown = employabilityScoreEngine.calculateEmployability(student);
        student.setEmployabilityScore(breakdown.overallEmployabilityScore);
        student.setAcademicScore(breakdown.academicScore);
        student.setTechnicalScore(breakdown.technicalScore);
        student.setAptitudeScore(breakdown.aptitudeScore);
        student.setInterviewScore(breakdown.interviewScore);

        try {
            student.setSkillGapAnalysis(objectMapper.writeValueAsString(breakdown));
        } catch (Exception e) {
            student.setSkillGapAnalysis("{}");
        }

        return studentRepository.save(student);
    }

    @Transactional
    public Student refreshEmployabilityScore(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));

        EmployabilityScoreEngine.ScoreBreakdown breakdown = employabilityScoreEngine.calculateEmployability(student);
        student.setEmployabilityScore(breakdown.overallEmployabilityScore);
        student.setAcademicScore(breakdown.academicScore);
        student.setTechnicalScore(breakdown.technicalScore);
        student.setAptitudeScore(breakdown.aptitudeScore);
        student.setInterviewScore(breakdown.interviewScore);

        try {
            student.setSkillGapAnalysis(objectMapper.writeValueAsString(breakdown));
        } catch (Exception e) {
            student.setSkillGapAnalysis("{}");
        }

        return studentRepository.save(student);
    }

    @Transactional
    public ResumeParserEngine.ParsedResume parseAndUploadResume(Long studentId, String resumeText) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));

        ResumeParserEngine.ParsedResume parsed = resumeParserEngine.parseResumeText(resumeText);
        student.setResumeText(resumeText);

        if (!parsed.extractedSkills.isEmpty()) {
            String existingSkills = student.getSkills() != null ? student.getSkills() : "";
            for (String s : parsed.extractedSkills) {
                if (!existingSkills.toLowerCase().contains(s.toLowerCase())) {
                    existingSkills = existingSkills.isEmpty() ? s : existingSkills + ", " + s;
                }
            }
            student.setSkills(existingSkills);
        }

        if (!parsed.extractedProjects.isEmpty() && (student.getProjects() == null || student.getProjects().isBlank())) {
            student.setProjects(String.join("\n• ", parsed.extractedProjects));
        }

        if (!parsed.extractedCertifications.isEmpty() && (student.getCertifications() == null || student.getCertifications().isBlank())) {
            student.setCertifications(String.join(", ", parsed.extractedCertifications));
        }

        if (parsed.detectedCgpa != null && (student.getCgpa() == null || student.getCgpa() == 0.0)) {
            student.setCgpa(parsed.detectedCgpa);
        }

        saveStudent(student);
        return parsed;
    }

    @Transactional
    public Student updatePlacementStatus(Long studentId, String status, String company, Double ctc) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));
        student.setPlacementStatus(status);
        if (company != null && !company.isBlank()) {
            student.setPlacedCompany(company);
        }
        if (ctc != null && ctc > 0) {
            student.setOfferedCtcLpa(ctc);
        }
        return studentRepository.save(student);
    }
}
