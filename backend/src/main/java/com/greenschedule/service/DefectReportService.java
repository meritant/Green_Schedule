package com.greenschedule.service;

import com.greenschedule.dto.DefectReportItemRequest;
import com.greenschedule.dto.DefectReportRequest;
import com.greenschedule.exception.ResourceNotFoundException;
import com.greenschedule.model.entity.*;
import com.greenschedule.repository.DefectReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
        Vehicle vehicle = vehicleService.getVehicleById(request.getVehicleId());
        User reporter = userService.getUserByUsername(username);
        String reportNumber = generateReportNumber(reporter.getEmployeeNumber());

        // Create main report
        DefectReport report = DefectReport.builder()
                .reportNumber(reportNumber)
                .vehicle(vehicle)
                .reportedBy(reporter)
                .reportedAt(LocalDateTime.now())
                .mileage(request.getMileage())
                .status(DefectStatus.REPORTED)
                .build();

        // Process items and check for major defects
        boolean hasMajorDefect = false;
        report.setItems(new ArrayList<>());
        
        for (DefectReportItemRequest itemRequest : request.getItems()) {
            DefectOption defectOption = defectOptionService.getDefectOptionById(itemRequest.getDefectOptionId());
            
            DefectReportItem item = DefectReportItem.builder()
                    .defectReport(report)
                    .defectOption(defectOption)
                    .isPartiallyWorking(itemRequest.isPartiallyWorking())
                    .isNotWorking(itemRequest.isNotWorking())
                    .comments(itemRequest.getComments())
                    .build();
            
            report.getItems().add(item);
            
            if (defectOption.isMajorDefect()) {
                hasMajorDefect = true;
            }
        }

        // Save report and update vehicle status
        report = defectReportRepository.save(report);
        
        // Update vehicle status based on defect severity
        if (hasMajorDefect) {
            vehicleService.updateVehicleStatus(vehicle.getId(), VehicleStatus.DEFECTIVE);
        } else {
            vehicleService.updateVehicleStatus(vehicle.getId(), VehicleStatus.WARNING);
        }

        return report;
    }
    
    @Transactional
    public void deleteReport(UUID reportId) {
        DefectReport report = defectReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        
        // If vehicle status was affected by this report, check other reports
        if (report.getVehicle().getStatus() != VehicleStatus.NORMAL) {
            boolean hasOtherActiveReports = defectReportRepository
                    .existsByVehicleAndIdNot(report.getVehicle(), reportId);
            
            if (!hasOtherActiveReports) {
                vehicleService.updateVehicleStatus(report.getVehicle().getId(), VehicleStatus.NORMAL);
            }
        }
        
        defectReportRepository.delete(report);
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
    
    public DefectReport getReportById(UUID reportId) {
        return defectReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));
    }
}