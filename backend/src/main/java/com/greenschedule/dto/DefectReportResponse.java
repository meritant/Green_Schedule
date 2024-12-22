package com.greenschedule.dto;

import lombok.Data;

import java.util.List;
import java.util.UUID;


@Data

public class DefectReportResponse {
    private UUID id;
    private String reportNumber;
    private String vehicleNumber;
    private String partName;
    private String defectDescription;
    private boolean isMajorDefect;
    private boolean isPartiallyWorking;
    private boolean isNotWorking;
    private String comments;
    private Long mileage;
    private String reportedBy;
    private String reportedAt;
    private String status;
    private List<DefectReportItemResponse> items;

}
