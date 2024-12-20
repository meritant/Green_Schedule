package com.greenschedule.controller;

import com.greenschedule.model.entity.DefectOption;
import com.greenschedule.model.entity.Part;
import com.greenschedule.service.DefectOptionService;
import com.greenschedule.service.PartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/defect-options")
@RequiredArgsConstructor
public class DefectOptionController {

    private final DefectOptionService defectOptionService;
    private final PartService partService;

    @GetMapping
    public ResponseEntity<List<DefectOption>> getAllDefectOptions() {
        return ResponseEntity.ok(defectOptionService.getAllDefectOptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DefectOption> getDefectOptionById(@PathVariable UUID id) {
        return ResponseEntity.ok(defectOptionService.getDefectOptionById(id));
    }

    @GetMapping("/part/{partId}")
    public ResponseEntity<List<DefectOption>> getDefectOptionsByPart(@PathVariable UUID partId) {
        Part part = partService.getPartById(partId);
        return ResponseEntity.ok(defectOptionService.getDefectOptionsByPart(part));
    }

    @GetMapping("/part/{partId}/severity/{isMajor}")
    public ResponseEntity<List<DefectOption>> getDefectOptionsByPartAndSeverity(
            @PathVariable UUID partId,
            @PathVariable boolean isMajor) {
        Part part = partService.getPartById(partId);
        return ResponseEntity.ok(defectOptionService.getDefectOptionsByPartAndSeverity(part, isMajor));
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<DefectOption> createDefectOption(@RequestBody DefectOption defectOption) {
        return ResponseEntity.ok(defectOptionService.createDefectOption(defectOption));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<DefectOption> updateDefectOption(
            @PathVariable UUID id,
            @RequestBody DefectOption defectOption) {
        return ResponseEntity.ok(defectOptionService.updateDefectOption(id, defectOption));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<Void> deleteDefectOption(@PathVariable UUID id) {
        defectOptionService.deleteDefectOption(id);
        return ResponseEntity.noContent().build();
    }
}