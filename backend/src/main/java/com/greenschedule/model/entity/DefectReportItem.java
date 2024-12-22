package com.greenschedule.model.entity;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "defect_report_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DefectReportItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "defect_report_id")
    private DefectReport defectReport;

    @ManyToOne
    @JoinColumn(name = "defect_option_id")
    private DefectOption defectOption;

    private boolean isPartiallyWorking;
    private boolean isNotWorking;
    private String comments;
}