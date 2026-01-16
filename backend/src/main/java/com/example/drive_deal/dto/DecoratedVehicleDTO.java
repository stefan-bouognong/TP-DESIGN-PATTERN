// DecoratedVehicleDTO.java
package com.example.drive_deal.dto;

import lombok.Data;
import java.util.Map;

@Data
public class DecoratedVehicleDTO {
    private Long vehicleId;
    private String model;
    private String displayHtml;
    private Map<String, Object> attributes;
    private String displayType;
    private Integer decoratorCount;
}