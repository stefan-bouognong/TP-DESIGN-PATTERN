package com.example.drive_deal.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;

@Data
public class DecoratedVehicleDTO {

    // =====================
    // IDENTITÉ
    // =====================
    private Long vehicleId;
    private String type;

    // =====================
    // INFOS VÉHICULE
    // =====================
    private String name;
    private String model;
    private String brand;
    private BigDecimal price;
    private Integer year;
    private String color;
    private String description;
    private boolean available;
    private boolean onSale;

    // =====================
    // MÉDIAS
    // =====================
    private String imageUrl;
    private String videoUrl;

    // =====================
    // CAR
    // =====================
    private Integer doors;
    private Boolean hasSunroof;

    // =====================
    // ELECTRIC
    // =====================
    private Integer batteryCapacity;
    private Integer range;

    // =====================
    // GASOLINE
    // =====================
    private Integer fuelTankCapacity;

    // =====================
    // SCOOTER
    // =====================
    private Integer maxSpeed;
    private Boolean hasTopCase;

    // =====================
    // DÉCORATION
    // =====================
    private String displayHtml;
    private Map<String, Object> attributes;
    private String displayType;
    private Integer decoratorCount;
}
