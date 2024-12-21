package com.greenschedule.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenschedule.model.entity.Part;
import com.greenschedule.service.PartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/parts")
@RequiredArgsConstructor
public class PartController {
    private final PartService partService;

    @GetMapping("/schedule/{scheduleTypeId}")
    public ResponseEntity<Map<String, Object>> getPartsWithDefectOptions(@PathVariable UUID scheduleTypeId) {
        List<Part> parts = partService.getPartsByScheduleType(scheduleTypeId);
        Map<String, Object> response = new HashMap<>();
        
        // Convert to response format
        List<Map<String, Object>> partsResponse = parts.stream()
            .map(part -> {
                Map<String, Object> partMap = new HashMap<>();
                partMap.put("id", part.getId());
                partMap.put("name", part.getName());
                
                // Get defect options for this part
                List<Map<String, Object>> defectOptions = part.getDefectOptions().stream()
                    .map(option -> {
                        Map<String, Object> optionMap = new HashMap<>();
                        optionMap.put("id", option.getId());
                        optionMap.put("description", option.getDescription());
                        optionMap.put("isMajorDefect", option.isMajorDefect());
                        return optionMap;
                    })
                    .collect(Collectors.toList());
                
                partMap.put("defectOptions", defectOptions);
                return partMap;
            })
            .collect(Collectors.toList());

        response.put("parts", partsResponse);
        return ResponseEntity.ok(response);
    }
    
    
}
