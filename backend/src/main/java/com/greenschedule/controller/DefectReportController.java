package com.greenschedule.controller;

import com.greenschedule.dto.DefectReportItemResponse;
import com.greenschedule.dto.DefectReportRequest;
import com.greenschedule.dto.DefectReportResponse;
import com.greenschedule.model.entity.DefectReport;
import com.greenschedule.model.entity.DefectStatus;
import com.greenschedule.repository.DefectReportRepository;
import com.greenschedule.service.DefectReportService;
import com.greenschedule.service.PdfService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

//import java.net.http.HttpHeaders;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/v1/defect-reports")
@RequiredArgsConstructor
public class DefectReportController {
   private final DefectReportService defectReportService;
   private final PdfService pdfService;


   @PostMapping
   @PreAuthorize("hasRole('DRIVER')")
   public ResponseEntity<DefectReportResponse> createReport(
           @RequestBody DefectReportRequest request,
           Authentication authentication) {
       DefectReport report = defectReportService.createReport(request, authentication.getName());
       return ResponseEntity.ok(convertToResponse(report));
   }
   
   @DeleteMapping("/{reportId}")
   @PreAuthorize("hasRole('SUPERVISOR')")
   public ResponseEntity<Void> deleteReport(@PathVariable UUID reportId) {
      defectReportService.deleteReport(reportId);
      return ResponseEntity.noContent().build();
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

       List<DefectReportItemResponse> itemResponses = report.getItems().stream()
               .map(item -> {
                   DefectReportItemResponse itemResponse = new DefectReportItemResponse();
                   itemResponse.setId(item.getId());
                   itemResponse.setPartName(item.getDefectOption().getPart().getName());
                   itemResponse.setDefectDescription(item.getDefectOption().getDescription());
                   itemResponse.setMajorDefect(item.getDefectOption().isMajorDefect());
                   itemResponse.setPartiallyWorking(item.isPartiallyWorking());
                   itemResponse.setNotWorking(item.isNotWorking());
                   itemResponse.setComments(item.getComments());
                   return itemResponse;
               })
               .collect(Collectors.toList());

       DefectReportResponse response = new DefectReportResponse();
       response.setId(report.getId());
       response.setReportNumber(report.getReportNumber());
       response.setVehicleNumber(report.getVehicle().getVehicleNumber());
       response.setMileage(report.getMileage());
       response.setReportedBy(report.getReportedBy().getUsername());
       response.setReportedAt(report.getReportedAt().format(formatter));
       response.setStatus(report.getStatus().name());
       response.setItems(itemResponses);

       return response;
   }

   @GetMapping
   public ResponseEntity<List<DefectReportResponse>> getAllReports() {
       List<DefectReport> reports = defectReportService.getAllReports();
       List<DefectReportResponse> responseList = reports.stream()
               .map(this::convertToResponse)
               .collect(Collectors.toList());
       return ResponseEntity.ok(responseList);
   }
   
   @GetMapping("/{reportId}/pdf")
   public ResponseEntity<byte[]> downloadReportPdf(@PathVariable UUID reportId) {
       DefectReport report = defectReportService.getReportById(reportId);
       byte[] pdfBytes = pdfService.generateReportPdf(report);
       
       return ResponseEntity.ok()
               .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE)
               .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"report-" + report.getReportNumber() + ".pdf\"")
               .body(pdfBytes);
   }
}