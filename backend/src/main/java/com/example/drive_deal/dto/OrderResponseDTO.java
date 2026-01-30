// OrderResponseDTO.java
package com.example.drive_deal.dto;

import com.example.drive_deal.entity.OrderStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponseDTO {
    private Long id;
    private Long clientId;
    private String clientName;

    private String clientFullName;
    private String clientEmail;
    private String clientPhone;
    private String clientAddress;

    private ClientResponseDTO client;
    private String orderType; // "CASH" or "CREDIT"
    private String status;
    private BigDecimal totalAmount;
    private BigDecimal subtotal;
    private BigDecimal totalTax;
    private LocalDateTime orderDate;
    private String shippingAddress;
    private String billingAddress;
    private List<OrderItemResponseDTO> items;
    
    // Pour les commandes cash
    private BigDecimal cashDiscount;
    private Boolean paid;
    
    // Pour les commandes crédit
    private Integer months;
    private Double interestRate;
    private String creditStatus;
    private Boolean approved;
    private BigDecimal monthlyPayment;


}