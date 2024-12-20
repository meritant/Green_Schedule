package com.greenschedule.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class ScheduleTypeResponse {
    private UUID id;
    private String name;
    private String description;
}