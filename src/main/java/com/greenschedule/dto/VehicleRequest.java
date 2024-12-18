package com.greenschedule.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import com.greenschedule.model.entity.VehicleType;
import lombok.Data;
import java.util.UUID;

@Data
public class VehicleRequest {
    @NotBlank(message = "Vehicle number is required")
    @Size(min = 2, max = 20, message = "Vehicle number must be between 2 and 20 characters")
    private String vehicleNumber;

    @NotBlank(message = "License plate is required")
    @Size(min = 2, max = 20, message = "License plate must be between 2 and 20 characters")
    private String licensePlate;

    @NotBlank(message = "Make is required")
    @Size(min = 2, max = 50, message = "Make must be between 2 and 50 characters")
    private String make;

    @Size(max = 50, message = "Model cannot exceed 50 characters")
    private String model;

    @Pattern(regexp = "^\\d{4}$", message = "Year must be a 4-digit number")
    private String year;

    @NotNull(message = "Vehicle type is required")
    private VehicleType type;

    private UUID scheduleTypeId;
}