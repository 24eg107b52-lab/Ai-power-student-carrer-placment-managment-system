package com.placement.ai.service;

import com.placement.ai.entity.Student;
import com.placement.ai.entity.UpskillingResource;
import com.placement.ai.ml.EmployabilityScoreEngine;
import com.placement.ai.repository.StudentRepository;
import com.placement.ai.repository.UpskillingResourceRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UpskillingService {

    private final UpskillingResourceRepository resourceRepository;
    private final StudentRepository studentRepository;
    private final EmployabilityScoreEngine employabilityScoreEngine;

    public UpskillingService(UpskillingResourceRepository resourceRepository,
                             StudentRepository studentRepository,
                             EmployabilityScoreEngine employabilityScoreEngine) {
        this.resourceRepository = resourceRepository;
        this.studentRepository = studentRepository;
        this.employabilityScoreEngine = employabilityScoreEngine;
    }

    public List<UpskillingResource> getAllResources() {
        return resourceRepository.findAll();
    }

    public List<UpskillingResource> getRecommendedResourcesForStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

        EmployabilityScoreEngine.ScoreBreakdown breakdown = employabilityScoreEngine.calculateEmployability(student);
        List<String> gaps = breakdown.identifiedSkillGaps;

        List<UpskillingResource> all = resourceRepository.findAll();
        List<UpskillingResource> matched = new ArrayList<>();

        for (UpskillingResource r : all) {
            String skill = r.getSkillName().toLowerCase();
            for (String gap : gaps) {
                if (skill.contains(gap.toLowerCase()) || gap.toLowerCase().contains(skill)) {
                    if (!matched.contains(r)) {
                        matched.add(r);
                    }
                    break;
                }
            }
        }

        // If gaps matched fewer than 3, add general high-demand resources
        if (matched.size() < 3) {
            for (UpskillingResource r : all) {
                if (!matched.contains(r)) {
                    matched.add(r);
                    if (matched.size() >= 6) break;
                }
            }
        }

        return matched;
    }

    public UpskillingResource addResource(UpskillingResource resource) {
        return resourceRepository.save(resource);
    }
}
