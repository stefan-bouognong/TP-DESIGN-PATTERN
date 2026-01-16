// OrderRequestDTO.java (supprime la classe interne si présente)
package com.example.drive_deal.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequestDTO {
    @NotNull(message = "Client ID is required")
    private Long clientId;
    
    @NotNull(message = "Order type is required")
    private String orderType; // "CASH" or "CREDIT"
    
    @NotEmpty(message = "At least one vehicle is required")
    private List<OrderItemRequestDTO> items; // Utilise la classe externe
    
    private CreditDetailsDTO creditDetails;
    private String shippingAddress;
    private String billingAddress;
}