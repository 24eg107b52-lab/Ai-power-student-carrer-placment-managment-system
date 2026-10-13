package com.placement.ai.repository;

import com.placement.ai.entity.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
    List<InterviewSession> findByStudentIdOrderByCreatedAtDesc(Long studentId);
}
