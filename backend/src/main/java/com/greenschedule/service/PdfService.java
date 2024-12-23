package com.greenschedule.service;

import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.greenschedule.model.entity.DefectReport;
import com.greenschedule.model.entity.DefectReportItem;
import com.itextpdf.io.source.ByteArrayOutputStream;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PdfService {
    public byte[] generateReportPdf(DefectReport report) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        try {
            // Header
            document.add(new Paragraph("Defect Report #" + report.getReportNumber())
                    .setFontSize(20)
                    .setBold());

            // Vehicle Information
            document.add(new Paragraph("Vehicle Information")
                    .setFontSize(16)
                    .setBold());
            document.add(new Paragraph("Vehicle Number: " + report.getVehicle().getVehicleNumber()));
            document.add(new Paragraph("Make/Model: " + report.getVehicle().getMake() + " " + report.getVehicle().getModel()));
            document.add(new Paragraph("License Plate: " + report.getVehicle().getLicensePlate()));
            document.add(new Paragraph("Mileage: " + report.getMileage()));

            // Defects
            document.add(new Paragraph("Reported Defects")
                    .setFontSize(16)
                    .setBold());

            for (DefectReportItem item : report.getItems()) {
                document.add(new Paragraph("\nDefect Details:")
                        .setBold());
                document.add(new Paragraph("Part: " + item.getDefectOption().getPart().getName()));
                document.add(new Paragraph("Defect: " + item.getDefectOption().getDescription()));
                document.add(new Paragraph("Severity: " + (item.getDefectOption().isMajorDefect() ? "Major" : "Minor")));
                if (item.isPartiallyWorking() || item.isNotWorking()) {
                    document.add(new Paragraph("Status: " + 
                        (item.isNotWorking() ? "Not Working" : "Partially Working")));
                }
                if (item.getComments() != null && !item.getComments().isEmpty()) {
                    document.add(new Paragraph("Comments: " + item.getComments()));
                }
            }

            // Report Information
            document.add(new Paragraph("\nReport Information")
                    .setFontSize(16)
                    .setBold());
            document.add(new Paragraph("Reported By: " + report.getReportedBy().getUsername()));
            document.add(new Paragraph("Date: " + report.getReportedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))));
            document.add(new Paragraph("Status: " + report.getStatus()));

            document.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }
}