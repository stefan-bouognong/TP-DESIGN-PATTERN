// ElectricVehicleFactory.java
package com.example.drive_deal.domain.abstractfactory;

import com.example.drive_deal.entity.ElectricCarEntity;
import com.example.drive_deal.entity.ScooterEntity;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class ElectricVehicleFactory implements VehicleFactory {

    @Override
    public Vehicle createCar(String model, BigDecimal price) {
        ElectricCarEntity car = new ElectricCarEntity();
        car.setModel(model);
        car.setPrice(price);
        car.setBatteryCapacity(75);
        car.setRange(500);
        car.setDoors(4);
        car.setHasSunroof(true);
        return new VehicleAdapter(car);
    }

    @Override
    public Vehicle createScooter(String model, BigDecimal price) {
        ScooterEntity scooter = new ScooterEntity();
        scooter.setModel(model);
        scooter.setPrice(price);
        scooter.setHasTopCase(true);
        scooter.setMaxSpeed(120);
        return new VehicleAdapter(scooter);
    }
}