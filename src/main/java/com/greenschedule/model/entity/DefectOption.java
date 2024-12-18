package com.greenschedule.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "defect_options")
public class DefectOption {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 500)
    private String description;  // e.g., "audible air leak"

    @Column(nullable = false)
    private boolean isMajorDefect;  // true for major, false for minor

    @ManyToOne
    @JoinColumn(name = "part_id", nullable = false)
    private Part part;
}