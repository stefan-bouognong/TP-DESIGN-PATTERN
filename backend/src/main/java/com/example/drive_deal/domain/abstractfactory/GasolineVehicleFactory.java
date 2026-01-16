// GasolineVehicleFactory.java
package com.example.drive_deal.domain.abstractfactory;

import com.example.drive_deal.entity.GasolineCarEntity;
import com.example.drive_deal.entity.ScooterEntity;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class GasolineVehicleFactory implements VehicleFactory {

    @Override
    public Vehicle createCar(String model, BigDecimal price) {
        GasolineCarEntity car = new GasolineCarEntity();
        car.setModel(model);
        car.setPrice(price);
        car.setFuelTankCapacity(60);
        car.setFuelType("Gasoline");
        car.setDoors(5);
        car.setHasSunroof(false);
        return new VehicleAdapter(car);
    }

    @Override
    public Vehicle createScooter(String model, BigDecimal price) {
        ScooterEntity scooter = new ScooterEntity();
        scooter.setModel(model);
        scooter.setPrice(price);
        scooter.setHasTopCase(false);
        scooter.setMaxSpeed(100);
        return new VehicleAdapter(scooter);
    }
}