package com.greenschedule.service;

import com.greenschedule.model.entity.ScheduleType;
import com.greenschedule.repository.ScheduleTypeRepository;
import com.greenschedule.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ScheduleTypeService {

    private final ScheduleTypeRepository scheduleTypeRepository;

    public List<ScheduleType> getAllScheduleTypes() {
        return scheduleTypeRepository.findAll();
    }

    public ScheduleType getScheduleTypeById(UUID id) {
        return scheduleTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule type not found"));
    }

    public ScheduleType getScheduleTypeByName(String name) {
        return scheduleTypeRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule type not found"));
    }

    @Transactional
    public ScheduleType createScheduleType(ScheduleType scheduleType) {
        if (scheduleTypeRepository.existsByName(scheduleType.getName())) {
            throw new RuntimeException("Schedule type with this name already exists");
        }
        return scheduleTypeRepository.save(scheduleType);
    }
    
    @Transactional
    public ScheduleType createIfNotExists(String name, String description) {
        return scheduleTypeRepository.findByName(name)
                .orElseGet(() -> {
                    ScheduleType scheduleType = ScheduleType.builder()
                            .name(name)
                            .description(description)
                            .build();
                    return scheduleTypeRepository.save(scheduleType);
                });
    }

    @Transactional
    public ScheduleType updateScheduleType(UUID id, ScheduleType scheduleTypeDetails) {
        ScheduleType scheduleType = getScheduleTypeById(id);
        
        if (!scheduleType.getName().equals(scheduleTypeDetails.getName()) &&
            scheduleTypeRepository.existsByName(scheduleTypeDetails.getName())) {
            throw new RuntimeException("Schedule type with this name already exists");
        }

        scheduleType.setName(scheduleTypeDetails.getName());
        scheduleType.setDescription(scheduleTypeDetails.getDescription());
        
        return scheduleTypeRepository.save(scheduleType);
    }

    @Transactional
    public void deleteScheduleType(UUID id) {
        ScheduleType scheduleType = getScheduleTypeById(id);
        scheduleTypeRepository.delete(scheduleType);
    }

    // Additional helper methods for vehicle integration
    public boolean existsById(UUID id) {
        return scheduleTypeRepository.existsById(id);
    }
}