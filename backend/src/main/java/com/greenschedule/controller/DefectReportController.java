package com.greenschedule.controller;

import com.greenschedule.dto.DefectReportRequest;
import com.greenschedule.dto.DefectReportResponse;
import com.greenschedule.model.entity.DefectReport;
import com.greenschedule.model.entity.DefectStatus;
import com.greenschedule.service.DefectReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/defect-reports")
@RequiredArgsConstructor
public class DefectReportController {
    private final DefectReportService defectReportService;

    @PostMapping
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<DefectReportResponse> createReport(
            @RequestBody DefectReportRequest request,
            Authentication authentication) {
        DefectReport report = defectReportService.createReport(request, authentication.getName());
        return ResponseEntity.ok(convertToResponse(report));
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<DefectReportResponse>> getVehicleReports(@PathVariable UUID vehicleId) {
        List<DefectReportResponse> reports = defectReportService.getVehicleReports(vehicleId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reports);
    }

    @PatchMapping("/{reportId}/status")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<DefectReportResponse> updateStatus(
            @PathVariable UUID reportId,
            @RequestParam DefectStatus status,
            Authentication authentication) {
        DefectReport report = defectReportService.updateReportStatus(reportId, status, authentication.getName());
        return ResponseEntity.ok(convertToResponse(report));
    }

    private DefectReportResponse convertToResponse(DefectReport report) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        
        DefectReportResponse response = new DefectReportResponse();
        response.setId(report.getId());
        response.setReportNumber(report.getReportNumber());
        response.setVehicleNumber(report.getVehicle().getVehicleNumber());
        response.setPartName(report.getDefectOption().getPart().getName());
        response.setDefectDescription(report.getDefectOption().getDescription());
        response.setMajorDefect(report.getDefectOption().isMajorDefect());
        response.setPartiallyWorking(report.isPartiallyWorking());
        response.setNotWorking(report.isNotWorking());
        response.setComments(report.getComments());
        response.setMileage(report.getMileage());
        response.setReportedBy(report.getReportedBy().getUsername());
        response.setReportedAt(report.getReportedAt().format(formatter));
        response.setStatus(report.getStatus().name());
        
        return response;
    }
}