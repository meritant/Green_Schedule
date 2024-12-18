package com.greenschedule.model.entity;

import lombok.Getter;

@Getter
public enum VehicleStatus {
    NORMAL("No issues reported - vehicle is good to operate"),
    WARNING("Minor defects present - can be operated but requires attention at end of day"),
    DEFECTIVE("Major defects present - vehicle cannot be operated until fixed");

    private final String description;

    VehicleStatus(String description) {
        this.description = description;
    }
}
