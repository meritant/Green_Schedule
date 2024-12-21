package com.greenschedule.repository;

import com.greenschedule.model.entity.Vehicle;
import com.greenschedule.model.entity.VehicleStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {
    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);
    boolean existsByVehicleNumber(String vehicleNumber);
    boolean existsByLicensePlate(String licensePlate);
    List<Vehicle> findByStatus(VehicleStatus status);
    long countByStatus(VehicleStatus status);

}