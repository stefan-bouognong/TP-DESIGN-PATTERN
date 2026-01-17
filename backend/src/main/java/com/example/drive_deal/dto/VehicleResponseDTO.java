package com.example.drive_deal.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class VehicleResponseDTO {

    // =====================
    // Champs communs
    // =====================
    private Long id;
    private String name;
    private String model;
    private String brand;
    private BigDecimal price;
    private String color;
    private Integer year;
    private boolean available;
    private boolean onSale;
    private String description;
    private String type;
    private LocalDateTime createdAt;
    private String imageUrl;
    private String videoUrl;
    // =====================
    // Champs CAR
    // =====================
    private Integer doors;
    private Boolean hasSunroof;

    // =====================
    // Champs ELECTRIC
    // =====================
    private Integer batteryCapacity;
    private Integer range;

    // =====================
    // Champs GASOLINE
    // =====================
    private Integer fuelTankCapacity;
    private String fuelType;

    // =====================
    // Champs SCOOTER
    // =====================
    private Integer maxSpeed;
    private Boolean hasTopCase;
}
