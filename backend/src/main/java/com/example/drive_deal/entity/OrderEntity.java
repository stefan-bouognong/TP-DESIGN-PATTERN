// OrderEntity.java - Ajouter ces champs
package com.example.drive_deal.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "order_type", discriminatorType = DiscriminatorType.STRING)
@Data
public abstract class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private ClientEntity client;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItemEntity> items = new ArrayList<>();
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;
    
    @Column(precision = 19, scale = 2)
    private BigDecimal subtotal = BigDecimal.ZERO;
    
    @Column(precision = 19, scale = 2)
    private BigDecimal totalTax = BigDecimal.ZERO;
    
    @Column(precision = 19, scale = 2)
    private BigDecimal shippingCost = BigDecimal.ZERO;
    
    @Column(precision = 19, scale = 2)
    private BigDecimal additionalFees = BigDecimal.ZERO;
    
    @Column(precision = 19, scale = 2, nullable = false)
    private BigDecimal totalAmount = BigDecimal.ZERO;
    
    @Column(nullable = false)
    private LocalDateTime orderDate = LocalDateTime.now();
    
    private LocalDateTime calculationDate;
    
    private String shippingAddress;
    private String billingAddress;
    
    // NOUVEAUX CHAMPS POUR TEMPLATE METHOD
    @Column(name = "delivery_country")
    private String deliveryCountry = "FR"; // Par défaut France
    
    @Column(name = "delivery_state")
    private String deliveryState;
    
    @Column(name = "currency")
    private String currency = "EUR"; // Par défaut Euros
    
    @Column(name = "commercial_discount", precision = 19, scale = 2)
    private BigDecimal commercialDiscount = BigDecimal.ZERO;
    
    @Column(name = "promotion_discount", precision = 19, scale = 2)
    private BigDecimal promotionDiscount = BigDecimal.ZERO;
    
    @Column(name = "is_urgent")
    private boolean urgent = false;
    
    @Column(name = "is_credit_order")
    private boolean creditOrder = false;
    
    @Column(name = "credit_insurance")
    private boolean creditInsurance = false;
    
    @Column(name = "payment_method")
    private String paymentMethod;
    
    // Méthodes utilitaires
    public void addItem(OrderItemEntity item) {
        item.setOrder(this);
        this.items.add(item);
        calculateSubtotal();
    }
    
    public void removeItem(OrderItemEntity item) {
        this.items.remove(item);
        item.setOrder(null);
        calculateSubtotal();
    }
    
    public void calculateSubtotal() {
        this.subtotal = items.stream()
            .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    // Getters pour la compatibilité avec Template Method
    public double getCommercialDiscountDouble() {
        return commercialDiscount != null ? commercialDiscount.doubleValue() : 0.0;
    }
    
    public double getPromotionDiscountDouble() {
        return promotionDiscount != null ? promotionDiscount.doubleValue() : 0.0;
    }
    
    public double getSubtotalDouble() {
        return subtotal != null ? subtotal.doubleValue() : 0.0;
    }
    
    // Méthode pour déterminer si c'est une commande crédit
    public boolean isCreditOrder() {
        return creditOrder || 
               (paymentMethod != null && 
                (paymentMethod.contains("CREDIT") || 
                 paymentMethod.contains("LOAN") || 
                 paymentMethod.contains("FINANCING")));
    }
}