package com.greenschedule.repository;

import com.greenschedule.model.entity.DefectReport;
import com.greenschedule.model.entity.DefectStatus;
import com.greenschedule.model.entity.Vehicle;
import com.greenschedule.model.entity.User;

//import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import java.awt.print.Pageable;
import java.util.List;
import java.util.UUID;

public interface DefectReportRepository extends JpaRepository<DefectReport, UUID> {
    List<DefectReport> findByVehicle(Vehicle vehicle);
    List<DefectReport> findByReportedBy(User user);
    boolean existsByReportNumber(String reportNumber);
    long countByStatus(DefectStatus status);
    List<DefectReport> findAllByOrderByReportedAtDesc();
    boolean existsByVehicleAndIdNot(Vehicle vehicle, UUID reportId);
}