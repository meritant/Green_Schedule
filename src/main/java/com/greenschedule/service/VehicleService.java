package com.greenschedule.service;

import com.greenschedule.model.entity.ScheduleType;
import com.greenschedule.model.entity.Vehicle;
import com.greenschedule.model.entity.VehicleStatus;
import com.greenschedule.repository.VehicleRepository;
import com.greenschedule.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VehicleService {
    
    private final VehicleRepository vehicleRepository;
    private final ScheduleTypeService scheduleTypeService; 


    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(UUID id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
    }

    public Vehicle getVehicleByNumber(String vehicleNumber) {
        return vehicleRepository.findByVehicleNumber(vehicleNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
    }

    @Transactional
    public Vehicle createVehicle(Vehicle vehicle, UUID scheduleTypeId) {
        if (vehicleRepository.existsByVehicleNumber(vehicle.getVehicleNumber())) {
            throw new RuntimeException("Vehicle number already exists");
        }
        if (vehicleRepository.existsByLicensePlate(vehicle.getLicensePlate())) {
            throw new RuntimeException("License plate already exists");
        }
        
        
     // Set default status
        if (vehicle.getStatus() == null) {
            vehicle.setStatus(VehicleStatus.NORMAL);
        }

        // Set schedule type if provided
        if (scheduleTypeId != null) {
            ScheduleType scheduleType = scheduleTypeService.getScheduleTypeById(scheduleTypeId);
            vehicle.setScheduleType(scheduleType);
        }
        
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public Vehicle updateVehicle(UUID id, Vehicle vehicleDetails) {
        Vehicle vehicle = getVehicleById(id);
        
        if (!vehicle.getVehicleNumber().equals(vehicleDetails.getVehicleNumber()) &&
            vehicleRepository.existsByVehicleNumber(vehicleDetails.getVehicleNumber())) {
            throw new RuntimeException("Vehicle number already exists");
        }
        
        if (!vehicle.getLicensePlate().equals(vehicleDetails.getLicensePlate()) &&
            vehicleRepository.existsByLicensePlate(vehicleDetails.getLicensePlate())) {
            throw new RuntimeException("License plate already exists");
        }
        
        if (vehicle.getStatus() == null) {
            vehicle.setStatus(VehicleStatus.NORMAL);
        }

        vehicle.setVehicleNumber(vehicleDetails.getVehicleNumber());
        vehicle.setLicensePlate(vehicleDetails.getLicensePlate());
        vehicle.setMake(vehicleDetails.getMake());
        vehicle.setModel(vehicleDetails.getModel());
        vehicle.setYear(vehicleDetails.getYear());
        vehicle.setType(vehicleDetails.getType());
        vehicle.setScheduleType(vehicleDetails.getScheduleType());
        
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public Vehicle updateVehicleStatus(UUID id, VehicleStatus status) {
        Vehicle vehicle = getVehicleById(id);
        vehicle.setStatus(status);
        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(UUID id) {
        Vehicle vehicle = getVehicleById(id);
        vehicleRepository.delete(vehicle);
    }

    public List<Vehicle> getVehiclesByStatus(VehicleStatus status) {
        return vehicleRepository.findByStatus(status);
    }
}