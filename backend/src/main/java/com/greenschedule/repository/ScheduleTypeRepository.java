package com.greenschedule.repository;

import com.greenschedule.model.entity.ScheduleType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface ScheduleTypeRepository extends JpaRepository<ScheduleType, UUID> {
    Optional<ScheduleType> findByName(String name);
    boolean existsByName(String name);
}