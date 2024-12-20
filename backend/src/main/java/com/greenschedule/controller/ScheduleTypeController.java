package com.greenschedule.controller;

import com.greenschedule.dto.ScheduleTypeRequest;
import com.greenschedule.dto.ScheduleTypeResponse;
import com.greenschedule.model.entity.ScheduleType;
import com.greenschedule.service.ScheduleTypeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/schedule-types")
@RequiredArgsConstructor
public class ScheduleTypeController {

    private final ScheduleTypeService scheduleTypeService;

    @GetMapping
    public ResponseEntity<List<ScheduleTypeResponse>> getAllScheduleTypes() {
        List<ScheduleTypeResponse> scheduleTypes = scheduleTypeService.getAllScheduleTypes().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(scheduleTypes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleTypeResponse> getScheduleTypeById(@PathVariable UUID id) {
        ScheduleType scheduleType = scheduleTypeService.getScheduleTypeById(id);
        return ResponseEntity.ok(convertToResponse(scheduleType));
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<ScheduleTypeResponse> createScheduleType(
            @Valid @RequestBody ScheduleTypeRequest request) {
        ScheduleType scheduleType = convertToEntity(request);
        ScheduleType savedScheduleType = scheduleTypeService.createScheduleType(scheduleType);
        return ResponseEntity.ok(convertToResponse(savedScheduleType));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<ScheduleTypeResponse> updateScheduleType(
            @PathVariable UUID id,
            @Valid @RequestBody ScheduleTypeRequest request) {
        ScheduleType scheduleType = convertToEntity(request);
        ScheduleType updatedScheduleType = scheduleTypeService.updateScheduleType(id, scheduleType);
        return ResponseEntity.ok(convertToResponse(updatedScheduleType));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<Void> deleteScheduleType(@PathVariable UUID id) {
        scheduleTypeService.deleteScheduleType(id);
        return ResponseEntity.noContent().build();
    }

    private ScheduleTypeResponse convertToResponse(ScheduleType scheduleType) {
        ScheduleTypeResponse response = new ScheduleTypeResponse();
        response.setId(scheduleType.getId());
        response.setName(scheduleType.getName());
        response.setDescription(scheduleType.getDescription());
        return response;
    }

    private ScheduleType convertToEntity(ScheduleTypeRequest request) {
        return ScheduleType.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
    }
}