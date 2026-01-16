// CarEntity.java
package com.example.drive_deal.entity;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("CAR")
public class CarEntity extends VehicleEntity {
    private Integer doors;
    private Boolean hasSunroof;

    public Integer getDoors() { return doors; }
    public void setDoors(Integer doors) { this.doors = doors; }
    public Boolean getHasSunroof() { return hasSunroof; }
    public void setHasSunroof(Boolean hasSunroof) { this.hasSunroof = hasSunroof; }
}