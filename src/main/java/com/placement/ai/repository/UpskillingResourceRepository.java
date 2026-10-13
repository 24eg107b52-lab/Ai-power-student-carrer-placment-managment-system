package com.placement.ai.repository;

import com.placement.ai.entity.UpskillingResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UpskillingResourceRepository extends JpaRepository<UpskillingResource, Long> {
    List<UpskillingResource> findBySkillNameIgnoreCase(String skillName);
    List<UpskillingResource> findByResourceType(String resourceType);
}
