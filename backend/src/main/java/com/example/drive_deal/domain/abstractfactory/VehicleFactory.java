// VehicleFactory.java
package com.example.drive_deal.domain.abstractfactory;

import java.math.BigDecimal;

public interface VehicleFactory {
    Vehicle createCar(String model, BigDecimal price);
    Vehicle createScooter(String model, BigDecimal price);
}