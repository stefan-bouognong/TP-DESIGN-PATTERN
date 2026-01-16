// VehicleResponseDTO.java
package com.example.drive_deal.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class VehicleResponseDTO {
    private Long id;
    private String type;
    private String energyType;
    private String model;
    private BigDecimal price;
    private String color;
    private Integer year;
    private String description;
}