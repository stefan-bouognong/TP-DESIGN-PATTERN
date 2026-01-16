// GasolineCarEntity.java
package com.example.drive_deal.entity;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("GASOLINE_CAR")
public class GasolineCarEntity extends CarEntity {
    private Integer fuelTankCapacity; // Liters
    private String fuelType;

    public Integer getFuelTankCapacity() { return fuelTankCapacity; }
    public void setFuelTankCapacity(Integer fuelTankCapacity) { this.fuelTankCapacity = fuelTankCapacity; }
    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }
}