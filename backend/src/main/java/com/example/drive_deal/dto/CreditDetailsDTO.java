// CreditDetailsDTO.java
package com.example.drive_deal.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class CreditDetailsDTO {
    @Min(value = 1, message = "Months must be at least 1")
    @Max(value = 84, message = "Months cannot exceed 84")
    private Integer months = 24;
    
    @Min(value = 0, message = "Interest rate cannot be negative")
    @Max(value = 20, message = "Interest rate cannot exceed 20%")
    private Double interestRate = 5.0;
}