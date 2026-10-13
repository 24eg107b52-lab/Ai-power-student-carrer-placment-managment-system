package com.placement.ai.repository;

import com.placement.ai.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentId(Long studentId);
    List<Application> findByJobPostingId(Long jobId);
    List<Application> findByJobPostingIdOrderByMatchScoreDesc(Long jobId);
    Optional<Application> findByStudentIdAndJobPostingId(Long studentId, Long jobId);
    List<Application> findByStatus(String status);
}
