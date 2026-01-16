// CreateBundleRequestDTO.java
package com.example.drive_deal.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateBundleRequestDTO {
    @NotNull(message = "Order ID is required")
    private Long orderId;
    
    private String bundleType = "COMPLETE"; // COMPLETE, MINIMAL, REGISTRATION
}