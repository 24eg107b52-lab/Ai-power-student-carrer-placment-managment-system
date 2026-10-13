package com.placement.ai.repository;

import com.placement.ai.entity.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    List<JobPosting> findByStatus(String status);
    List<JobPosting> findByCompanyIgnoreCase(String company);
    List<JobPosting> findAllByOrderByDriveDateAsc();
}
