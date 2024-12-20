package com.greenschedule.repository;

import com.greenschedule.model.entity.Part;
import com.greenschedule.model.entity.ScheduleType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
import java.util.UUID;

public interface PartRepository extends JpaRepository<Part, UUID> {
    Optional<Part> findByNameAndScheduleType(String name, ScheduleType scheduleType);
    List<Part> findByScheduleType(ScheduleType scheduleType);
    boolean existsByNameAndScheduleType(String name, ScheduleType scheduleType);
}