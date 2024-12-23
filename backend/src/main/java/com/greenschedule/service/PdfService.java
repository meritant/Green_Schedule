package com.greenschedule.service;

import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.greenschedule.model.entity.DefectReport;
import com.greenschedule.model.entity.DefectReportItem;
import com.itextpdf.io.source.ByteArrayOutputStream;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

import lombok.RequiredArgsConstructor;

//PDF related imports

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;


@Service
@RequiredArgsConstructor
public class PdfService {
	// In PdfService.java
	public byte[] generateReportPdf(DefectReport report) {
	    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
	    PdfWriter writer = new PdfWriter(outputStream);
	    PdfDocument pdf = new PdfDocument(writer);
	    Document document = new Document(pdf);

	    try {
	        // Set page margins
	        document.setMargins(36, 36, 36, 36); // 0.5 inch margins

	        // Header
	        Paragraph header = new Paragraph("Defect Report #" + report.getReportNumber())
	                .setFontSize(24)
	                .setBold()
	                .setTextAlignment(TextAlignment.CENTER)
	                .setMarginBottom(7);
	        document.add(header);
	        
	     // Add severity warning
	        boolean hasMajorDefect = report.getItems().stream()
	                .anyMatch(item -> item.getDefectOption().isMajorDefect());

	        Paragraph warning = new Paragraph()
	                .setTextAlignment(TextAlignment.CENTER)
	                .setFontSize(16)
	                .setMarginBottom(15);

	        if (hasMajorDefect) {
	            warning.add("MAJOR DEFECT - Vehicle cannot be operated")
	                    .setFontColor(ColorConstants.RED)
	                    .setBold();
	        } else {
	            warning.add("MINOR DEFECT - Proceed to yard when possible")
	                    .setFontColor(ColorConstants.ORANGE)
	                    .setBold();
	            }
	        document.add(warning);

	        // Add horizontal line
	        document.add(new LineSeparator(new SolidLine(1f))
	                .setMarginBottom(20));

	        // Vehicle Information Section
	        Paragraph vehicleHeader = new Paragraph("Vehicle Information")
	                .setFontSize(18)
	                .setBold()
//	                .setFontColor(ColorConstants.BLUE)
	                .setMarginBottom(10);
	        document.add(vehicleHeader);

	        // Vehicle details in a table
	        Table vehicleTable = new Table(new float[]{150, 350})
	                .setWidth(UnitValue.createPercentValue(100));
	        
	        addTableRow(vehicleTable, "Vehicle Number:", report.getVehicle().getVehicleNumber());
	        addTableRow(vehicleTable, "Make/Model:", report.getVehicle().getMake() + " " + report.getVehicle().getModel());
	        addTableRow(vehicleTable, "License Plate:", report.getVehicle().getLicensePlate());
	        addTableRow(vehicleTable, "Mileage:", String.valueOf(report.getMileage()));
	        
	        document.add(vehicleTable);
	        document.add(new Paragraph().setMarginBottom(20));

	        // Defects Section
	        document.add(new Paragraph("Reported Defects")
	                .setFontSize(18)
	                .setBold()
//	                .setFontColor(ColorConstants.BLUE)
	                .setMarginBottom(10));

	        // Defects details
	        for (DefectReportItem item : report.getItems()) {
	            Table defectTable = new Table(new float[]{150, 350})
	                    .setWidth(UnitValue.createPercentValue(100))
	                    .setBackgroundColor(ColorConstants.LIGHT_GRAY, 0.3f);

	            addTableRow(defectTable, "Part:", item.getDefectOption().getPart().getName());
	            addTableRow(defectTable, "Defect:", item.getDefectOption().getDescription());
	            
	            // Severity with color coding
	            Cell severityLabel = new Cell().add(new Paragraph("Severity:")).setBorder(Border.NO_BORDER);
	            Cell severityValue = new Cell().add(new Paragraph(item.getDefectOption().isMajorDefect() ? "Major" : "Minor")
	                    .setFontColor(item.getDefectOption().isMajorDefect() ? ColorConstants.RED : ColorConstants.ORANGE))
	                    .setBorder(Border.NO_BORDER)
        				.setFontSize(14)
    	                .setBold();

	            defectTable.addCell(severityLabel);
	            defectTable.addCell(severityValue);

	            if (item.isPartiallyWorking() || item.isNotWorking()) {
	                addTableRow(defectTable, "Status:", 
	                    item.isNotWorking() ? "Not Working" : "Partially Working");
	            }
	            
	            if (item.getComments() != null && !item.getComments().isEmpty()) {
	                addTableRow(defectTable, "Comments:", item.getComments());
	            }

	            document.add(defectTable);
	            document.add(new Paragraph().setMarginBottom(10));
	        }

	        // Report Information Section
	        document.add(new LineSeparator(new SolidLine(1f))
	                .setMarginBottom(20));
	        
	        Paragraph reportInfoHeader = new Paragraph("Report Information")
	                .setFontSize(18)
	                .setBold()
//	                .setFontColor(ColorConstants.BLUE)
	                .setMarginBottom(10);
	        document.add(reportInfoHeader);

	        Table reportInfoTable = new Table(new float[]{150, 350})
	                .setWidth(UnitValue.createPercentValue(100));
	        
	        addTableRow(reportInfoTable, "Reported By:", report.getReportedBy().getUsername());
	        addTableRow(reportInfoTable, "Date:", 
	            report.getReportedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
	        addTableRow(reportInfoTable, "Status:", report.getStatus().toString());
	        
	        document.add(reportInfoTable);

	        document.close();
	        return outputStream.toByteArray();
	    } catch (Exception e) {
	        throw new RuntimeException("Failed to generate PDF", e);
	    }
	}

	private void addTableRow(Table table, String label, String value) {
	    table.addCell(new Cell().add(new Paragraph(label))
	            .setBold()
	            .setBorder(Border.NO_BORDER));
	    table.addCell(new Cell().add(new Paragraph(value))
	            .setBorder(Border.NO_BORDER));
	}
}