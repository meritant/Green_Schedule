package com.greenschedule.service;

import com.greenschedule.model.entity.DefectOption;
import com.greenschedule.model.entity.Part;
import com.greenschedule.repository.DefectOptionRepository;
import com.greenschedule.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DefectOptionService {

    private final DefectOptionRepository defectOptionRepository;

    public List<DefectOption> getAllDefectOptions() {
        return defectOptionRepository.findAll();
    }

    public DefectOption getDefectOptionById(UUID id) {
        return defectOptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Defect option not found"));
    }

    public List<DefectOption> getDefectOptionsByPart(Part part) {
        return defectOptionRepository.findByPart(part);
    }

    public List<DefectOption> getDefectOptionsByPartAndSeverity(Part part, boolean isMajorDefect) {
        return defectOptionRepository.findByPartAndIsMajorDefect(part, isMajorDefect);
    }

    @Transactional
    public DefectOption createDefectOption(DefectOption defectOption) {
        return defectOptionRepository.save(defectOption);
    }

    @Transactional
    public DefectOption createIfNotExists(DefectOption defectOption) {
        if (defectOptionRepository.existsByDescriptionAndPart(
                defectOption.getDescription(), 
                defectOption.getPart())) {
            return defectOption;
        }
        return createDefectOption(defectOption);
    }

    @Transactional
    public DefectOption updateDefectOption(UUID id, DefectOption defectOptionDetails) {
        DefectOption defectOption = getDefectOptionById(id);
        
        defectOption.setDescription(defectOptionDetails.getDescription());
        defectOption.setMajorDefect(defectOptionDetails.isMajorDefect());
        defectOption.setPart(defectOptionDetails.getPart());

        return defectOptionRepository.save(defectOption);
    }

    @Transactional
    public void deleteDefectOption(UUID id) {
        DefectOption defectOption = getDefectOptionById(id);
        defectOptionRepository.delete(defectOption);
    }

    public boolean isDefectOptionExists(String description, Part part) {
        // You might want to add this method to repository
        return false; // Placeholder
    }
}