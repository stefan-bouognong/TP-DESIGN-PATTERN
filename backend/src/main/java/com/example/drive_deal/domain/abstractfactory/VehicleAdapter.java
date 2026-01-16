// VehicleAdapter.java
package com.example.drive_deal.domain.abstractfactory;

import com.example.drive_deal.entity.*;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class VehicleAdapter implements Vehicle {
    private final VehicleEntity entity;

    @Override
    public String getDescription() {
        return String.format("%s %s - $%s", 
            entity.getClass().getSimpleName().replace("Entity", ""),
            entity.getModel(),
            entity.getPrice());
    }

    @Override
    public String getType() {
        if (entity instanceof CarEntity) return "CAR";
        if (entity instanceof ScooterEntity) return "SCOOTER";
        return "UNKNOWN";
    }

    @Override
    public String getEnergyType() {
        if (entity instanceof ElectricCarEntity) return "ELECTRIC";
        if (entity instanceof GasolineCarEntity) return "GASOLINE";
        return "UNKNOWN";
    }
    
    public VehicleEntity getEntity() {
        return entity;
    }
}