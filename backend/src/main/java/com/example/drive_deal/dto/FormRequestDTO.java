// FormRequestDTO.java
package com.example.drive_deal.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FormRequestDTO {
    @NotNull(message = "Form type is required")
    private String formType; // VEHICLE, CLIENT, ORDER
    
    @NotNull(message = "Entity ID is required")
    private Long entityId;
    
    private String rendererType = "HTML"; // HTML or WIDGET
    private Boolean includeDetails = true;
}