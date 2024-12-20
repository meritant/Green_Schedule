package com.greenschedule.model.entity;

import lombok.Getter;

@Getter
public enum VehicleType {
    TRUCK("Truck"),
    TRAILER("Trailer"),
    BUS("Bus"),
    VAN("Van");

    private final String displayName;

    VehicleType(String displayName) {
        this.displayName = displayName;
    }
}
