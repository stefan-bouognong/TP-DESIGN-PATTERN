// UpdateOrderStatusDTO.java
package com.example.drive_deal.dto;

import com.example.drive_deal.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusDTO {
    @NotNull(message = "Status is required")
    private OrderStatus status;
}