package com.greenschedule.controller;

import com.greenschedule.model.entity.DefectReport;
import com.greenschedule.model.entity.VehicleStatus;
import com.greenschedule.repository.DefectReportRepository;
import com.greenschedule.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final VehicleService vehicleService;
    private final DefectReportRepository defectReportRepository; // Add this


    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalVehicles", vehicleService.countAll());
        stats.put("normalVehicles", vehicleService.countByStatus(VehicleStatus.NORMAL));
        stats.put("warningVehicles", vehicleService.countByStatus(VehicleStatus.WARNING));
        stats.put("defectiveVehicles", vehicleService.countByStatus(VehicleStatus.DEFECTIVE));
        stats.put("totalReports", defectReportRepository.count());
        return ResponseEntity.ok(stats);
    }
}