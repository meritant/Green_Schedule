package com.greenschedule.controller;

import com.greenschedule.dto.VehicleRequest;
import com.greenschedule.dto.VehicleResponse;
import com.greenschedule.model.entity.Vehicle;
import com.greenschedule.model.entity.VehicleStatus;
import com.greenschedule.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getAllVehicles() {
        List<VehicleResponse> vehicles = vehicleService.getAllVehicles().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getVehicleById(@PathVariable UUID id) {
        Vehicle vehicle = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(convertToResponse(vehicle));
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<VehicleResponse> createVehicle(@RequestBody VehicleRequest request) {
        Vehicle vehicle = convertToEntity(request);
        Vehicle savedVehicle = vehicleService.createVehicle(vehicle, request.getScheduleTypeId());
        return ResponseEntity.ok(convertToResponse(savedVehicle));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<VehicleResponse> updateVehicle(
            @PathVariable UUID id,
            @RequestBody VehicleRequest request) {
        Vehicle vehicle = convertToEntity(request);
        Vehicle updatedVehicle = vehicleService.updateVehicle(id, vehicle);
        return ResponseEntity.ok(convertToResponse(updatedVehicle));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<VehicleResponse> updateVehicleStatus(
            @PathVariable UUID id,
            @RequestParam VehicleStatus status) {
        Vehicle updatedVehicle = vehicleService.updateVehicleStatus(id, status);
        return ResponseEntity.ok(convertToResponse(updatedVehicle));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<Void> deleteVehicle(@PathVariable UUID id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }

    private VehicleResponse convertToResponse(Vehicle vehicle) {
    	   VehicleResponse response = new VehicleResponse();
    	   response.setId(vehicle.getId());
    	   response.setVehicleNumber(vehicle.getVehicleNumber());
    	   response.setLicensePlate(vehicle.getLicensePlate());
    	   response.setMake(vehicle.getMake());
    	   response.setModel(vehicle.getModel());
    	   response.setYear(vehicle.getYear());
    	   response.setType(vehicle.getType());
    	   response.setStatus(vehicle.getStatus());
    	   if (vehicle.getScheduleType() != null) {
    	       response.setScheduleTypeName(vehicle.getScheduleType().getName());
    	       response.setScheduleTypeId(vehicle.getScheduleType().getId());
    	   }
    	   return response;
    	}

    private Vehicle convertToEntity(VehicleRequest request) {
        return Vehicle.builder()
                .vehicleNumber(request.getVehicleNumber())
                .licensePlate(request.getLicensePlate())
                .make(request.getMake())
                .model(request.getModel())
                .year(request.getYear())
                .type(request.getType())
                .status(VehicleStatus.NORMAL)  // Set default status
                .build();
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<VehicleResponse>> getVehiclesByStatus(
            @PathVariable VehicleStatus status) {
        List<VehicleResponse> vehicles = vehicleService.getVehiclesByStatus(status)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(vehicles);
    }
    
}