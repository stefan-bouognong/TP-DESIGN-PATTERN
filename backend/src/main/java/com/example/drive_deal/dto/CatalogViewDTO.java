// CatalogViewDTO.java
package com.example.drive_deal.dto;

import lombok.Data;
import java.util.List;

@Data
public class CatalogViewDTO {
    private List<DecoratedVehicleDTO> vehicles;
    private String viewType; // "BASIC", "ENHANCED", "FULL", "SALE"
    private Integer totalVehicles;
    private Boolean hasAnimations;
    private Boolean hasSaleItems;
}