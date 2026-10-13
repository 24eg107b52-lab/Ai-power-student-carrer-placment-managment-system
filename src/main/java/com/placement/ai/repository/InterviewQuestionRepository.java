package com.placement.ai.repository;

import com.placement.ai.entity.InterviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long> {
    List<InterviewQuestion> findByCategory(String category);
    List<InterviewQuestion> findByTopicIgnoreCase(String topic);
    List<InterviewQuestion> findByDifficulty(String difficulty);
}
