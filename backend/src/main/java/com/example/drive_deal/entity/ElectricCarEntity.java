// ElectricCarEntity.java
package com.example.drive_deal.entity;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("ELECTRIC_CAR")
public class ElectricCarEntity extends CarEntity {
    private Integer batteryCapacity; // kWh
    @Column(name = "vehicle_range")
    private Integer range; // km

    public Integer getBatteryCapacity() { return batteryCapacity; }
    public void setBatteryCapacity(Integer batteryCapacity) { this.batteryCapacity = batteryCapacity; }
    public Integer getRange() { return range; }
    public void setRange(Integer range) { this.range = range; }
}