package com.greenschedule.dto;

import com.greenschedule.model.entity.VehicleType;
import com.greenschedule.model.entity.VehicleStatus;
import lombok.Data;
import java.util.UUID;

@Data
public class VehicleResponse {
    private UUID id;
    private String vehicleNumber;
    private String licensePlate;
    private String make;
    private String model;
    private String year;
    private VehicleType type;
    private VehicleStatus status;
    private String scheduleTypeName;
}
