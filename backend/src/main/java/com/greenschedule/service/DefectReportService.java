package com.greenschedule.service;

import com.greenschedule.dto.DefectReportRequest;
import com.greenschedule.exception.ResourceNotFoundException;
import com.greenschedule.model.entity.*;
import com.greenschedule.repository.DefectReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DefectReportService {
    private final DefectReportRepository defectReportRepository;
    private final VehicleService vehicleService;
    private final UserService userService;
    private final DefectOptionService defectOptionService;

    @Transactional
    public DefectReport createReport(DefectReportRequest request, String username) {
        // Get related entities
        Vehicle vehicle = vehicleService.getVehicleById(request.getVehicleId());
        User reporter = userService.getUserByUsername(username);
        DefectOption defectOption = defectOptionService.getDefectOptionById(request.getDefectOptionId());

        // Generate report number
        String reportNumber = generateReportNumber(reporter.getEmployeeNumber());

        // Create report
        DefectReport report = DefectReport.builder()
                .reportNumber(reportNumber)
                .vehicle(vehicle)
                .reportedBy(reporter)
                .reportedAt(LocalDateTime.now())
                .defectOption(defectOption)
                .isPartiallyWorking(request.isPartiallyWorking())
                .isNotWorking(request.isNotWorking())
                .comments(request.getComments())
                .mileage(request.getMileage())
                .status(DefectStatus.REPORTED)
                .build();

        // Save report
        report = defectReportRepository.save(report);

        // Update vehicle status if major defect
        if (defectOption.isMajorDefect()) {
            vehicleService.updateVehicleStatus(vehicle.getId(), VehicleStatus.DEFECTIVE);
        } else {
            vehicleService.updateVehicleStatus(vehicle.getId(), VehicleStatus.WARNING);
        }

        return report;
    }
    
    public List<DefectReport> getAllReports() {
        return defectReportRepository.findAll();
    }

    private String generateReportNumber(String employeeNumber) {
        String timestamp = String.valueOf(System.currentTimeMillis()).substring(8);
        return "R" + employeeNumber + timestamp;
    }

    public List<DefectReport> getVehicleReports(UUID vehicleId) {
        Vehicle vehicle = vehicleService.getVehicleById(vehicleId);
        return defectReportRepository.findByVehicle(vehicle);
    }

    public List<DefectReport> getUserReports(String username) {
        User user = userService.getUserByUsername(username);
        return defectReportRepository.findByReportedBy(user);
    }
    

    @Transactional
    public DefectReport updateReportStatus(UUID reportId, DefectStatus newStatus, String username) {
        DefectReport report = defectReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        
        User user = userService.getUserByUsername(username);
        if (user.getRole() != UserRole.SUPERVISOR) {
            throw new RuntimeException("Only supervisors can update report status");
        }

        report.setStatus(newStatus);
        
        // If status is FIXED or VERIFIED, update vehicle status
        if (newStatus == DefectStatus.VERIFIED) {
            vehicleService.updateVehicleStatus(report.getVehicle().getId(), VehicleStatus.NORMAL);
        }

        return defectReportRepository.save(report);
    }
    
    
}