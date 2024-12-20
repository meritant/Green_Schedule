package com.greenschedule.service;

import com.greenschedule.model.entity.DefectOption;
import com.greenschedule.model.entity.Part;
import com.greenschedule.model.entity.ScheduleType;
import com.greenschedule.repository.PartRepository;
import com.greenschedule.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PartService {
    private final PartRepository partRepository;
    private final ScheduleTypeService scheduleTypeService;

    public List<Part> getAllParts() {
        return partRepository.findAll();
    }

    public Part getPartById(UUID id) {
        return partRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found"));
    }

    public List<Part> getPartsByScheduleType(UUID scheduleTypeId) {
        ScheduleType scheduleType = scheduleTypeService.getScheduleTypeById(scheduleTypeId);
        return partRepository.findByScheduleType(scheduleType);
    }

    @Transactional
    public Part createPart(Part part) {
        if (partRepository.existsByNameAndScheduleType(part.getName(), part.getScheduleType())) {
            throw new RuntimeException("Part already exists in this schedule");
        }
        return partRepository.save(part);
    }

    @Transactional
    public Part createIfNotExists(Part part) {
        return partRepository.findByNameAndScheduleType(part.getName(), part.getScheduleType())
                .orElseGet(() -> partRepository.save(part));
    }
    
    @Transactional
    public void initializeSchedule1(UUID scheduleTypeId) {
        ScheduleType scheduleType = scheduleTypeService.getScheduleTypeById(scheduleTypeId);
        
        // Example of initializing one part with its defects
        Part airBrakeSystem = Part.builder()
                .name("Air Brake System")
                .scheduleType(scheduleType)
                .build();
        airBrakeSystem = createPart(airBrakeSystem);

        // Add minor defects
        DefectOption minorDefect1 = DefectOption.builder()
                .description("audible air leak")
                .isMajorDefect(false)
                .part(airBrakeSystem)
                .build();

        DefectOption minorDefect2 = DefectOption.builder()
                .description("slow air pressure build-up rate")
                .isMajorDefect(false)
                .part(airBrakeSystem)
                .build();

        // Add major defects
        DefectOption majorDefect1 = DefectOption.builder()
                .description("pushrod stroke of any brake exceeds the adjustment limit")
                .isMajorDefect(true)
                .part(airBrakeSystem)
                .build();

        // ... continue with all parts and their defects
    }
}