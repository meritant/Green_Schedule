package com.greenschedule.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "defect_reports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DefectReport {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String reportNumber;
    private Long mileage;
    private LocalDateTime reportedAt;
    @Enumerated(EnumType.STRING)
    private DefectStatus status;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "reported_by")
    private User reportedBy;

    @OneToMany(mappedBy = "defectReport", cascade = CascadeType.ALL)
    private List<DefectReportItem> items;
    

    
}