package com.greenschedule.controller;

import com.greenschedule.service.Schedule1InitializationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/init")
@RequiredArgsConstructor
public class InitializationController {

    private final Schedule1InitializationService schedule1InitializationService;

    @PostMapping("/schedule1")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<String> initializeSchedule1() {
        schedule1InitializationService.initializeSchedule1();
        return ResponseEntity.ok("Schedule 1 initialized successfully");
    }
}