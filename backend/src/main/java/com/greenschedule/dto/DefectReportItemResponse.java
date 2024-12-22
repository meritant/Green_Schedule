package com.greenschedule.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class DefectReportItemResponse {
   private UUID id;
   private String partName;
   private String defectDescription;
   private boolean isMajorDefect;
   private boolean isPartiallyWorking;
   private boolean isNotWorking;
   private String comments;
}
