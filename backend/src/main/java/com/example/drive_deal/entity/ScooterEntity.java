// ScooterEntity.java
package com.example.drive_deal.entity;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("SCOOTER")
public class ScooterEntity extends VehicleEntity {
    private Boolean hasTopCase;
    private Integer maxSpeed;

    public Boolean getHasTopCase() { return hasTopCase; }
    public void setHasTopCase(Boolean hasTopCase) { this.hasTopCase = hasTopCase; }
    public Integer getMaxSpeed() { return maxSpeed; }
    public void setMaxSpeed(Integer maxSpeed) { this.maxSpeed = maxSpeed; }
}