package com.placement.ai.controller;

import com.placement.ai.entity.UpskillingResource;
import com.placement.ai.service.UpskillingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/upskilling")
@CrossOrigin(origins = "*")
public class UpskillingController {

    private final UpskillingService upskillingService;

    public UpskillingController(UpskillingService upskillingService) {
        this.upskillingService = upskillingService;
    }

    @GetMapping("/recommendations/{studentId}")
    public ResponseEntity<List<UpskillingResource>> getRecommendations(@PathVariable Long studentId) {
        return ResponseEntity.ok(upskillingService.getRecommendedResourcesForStudent(studentId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<UpskillingResource>> getAllResources() {
        return ResponseEntity.ok(upskillingService.getAllResources());
    }

    @PostMapping
    public ResponseEntity<UpskillingResource> createResource(@RequestBody UpskillingResource resource) {
        return ResponseEntity.ok(upskillingService.addResource(resource));
    }
}
