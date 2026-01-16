// VehicleRequestDTO.java
package com.example.drive_deal.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class VehicleRequestDTO {
    private String factoryType; // "ELECTRIC" or "GASOLINE"
    private String vehicleType; // "CAR" or "SCOOTER"
    private String model;
    private BigDecimal price;
    private String color;
    private Integer year;
}