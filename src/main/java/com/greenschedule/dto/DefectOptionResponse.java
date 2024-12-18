package com.greenschedule.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class DefectOptionResponse {
    private UUID id;
    private String description;
    private boolean isMajorDefect;
    private String partName;
}
