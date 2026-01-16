// OrderItemResponseDTO.java
package com.example.drive_deal.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemResponseDTO {
    private Long id;
    private Long vehicleId;
    private String vehicleModel;
    private String vehicleType;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subTotal;
}