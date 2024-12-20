package com.greenschedule.repository;

import com.greenschedule.model.entity.DefectOption;
import com.greenschedule.model.entity.Part;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface DefectOptionRepository extends JpaRepository<DefectOption, UUID> {
    List<DefectOption> findByPart(Part part);
    List<DefectOption> findByPartAndIsMajorDefect(Part part, boolean isMajorDefect);
    boolean existsByDescriptionAndPart(String description, Part part);
}