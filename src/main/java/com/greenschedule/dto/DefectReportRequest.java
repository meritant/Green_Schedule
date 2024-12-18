package com.greenschedule.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class DefectReportRequest {
    private UUID vehicleId;
    private UUID defectOptionId;
    private boolean isPartiallyWorking;
    private boolean isNotWorking;
    private String comments;
    private Long mileage;
}
