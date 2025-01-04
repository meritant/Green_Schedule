package com.greenschedule.service;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InitializationService {
    private final Schedule1InitializationService schedule1InitializationService;

    @Transactional
    public void initializeAll() {
        schedule1InitializationService.initializeSchedule1();
    }
}
