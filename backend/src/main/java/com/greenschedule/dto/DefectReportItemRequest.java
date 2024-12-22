package com.greenschedule.dto;

import java.util.UUID;

import lombok.Data;

@Data 
public class DefectReportItemRequest {
   private UUID defectOptionId;
   private boolean isPartiallyWorking;
   private boolean isNotWorking;
   private String comments;
}