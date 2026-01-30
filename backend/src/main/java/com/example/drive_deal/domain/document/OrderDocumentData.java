package com.example.drive_deal.domain.document;

import com.example.drive_deal.dto.OrderItemResponseDTO;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDocumentData {

    private Long orderId;
    private LocalDateTime orderDate;
    private String documentTitle;

    // Client
    private String clientName;
        private String clientFullName;
    private String clientEmail;
    private String clientPhone;
    private String clientAddress;

    private String billingAddress;
    private String shippingAddress;

    // Commande
    private String orderType;
    private BigDecimal subtotal;
    private BigDecimal totalAmount;
    private List<OrderItemResponseDTO> items;

    // Cash
    private Boolean paid;
    private BigDecimal cashDiscount;

    // Crédit
    private Integer months;
    private Double interestRate;
    private BigDecimal monthlyPayment;
    private Boolean approved;

    // Meta
    private LocalDateTime generatedAt;
}
