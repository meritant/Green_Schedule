package com.greenschedule.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class DefectOptionRequest {
    private String description;
    private boolean isMajorDefect;
    private UUID partId;
}
