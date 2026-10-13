package com.placement.ai.repository;

import com.placement.ai.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNumber(String rollNumber);
    Optional<Student> findByEmail(String email);
    Optional<Student> findByUserId(Long userId);
    List<Student> findByDepartment(String department);
    List<Student> findByPlacementStatus(String status);

    @Query("SELECT s FROM Student s ORDER BY s.employabilityScore DESC")
    List<Student> findAllOrderByEmployabilityScoreDesc();

    @Query("SELECT AVG(s.employabilityScore) FROM Student s")
    Double getAverageEmployabilityScore();

    @Query("SELECT COUNT(s) FROM Student s WHERE s.placementStatus = 'PLACED'")
    Long countPlacedStudents();
}
