package com.example.drive_deal.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@ToString(exclude = {"order", "vehicle"})
public class OrderItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderEntity order;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private VehicleEntity vehicle;
    
    @Column(nullable = false)
    private Integer quantity = 1;
    
    @Column(precision = 19, scale = 2, nullable = false)
    private BigDecimal unitPrice;
    
    // NOUVEAUX CHAMPS POUR TEMPLATE METHOD
    @Column(name = "vehicle_type", length = 50)
    private String vehicleType; // "CAR", "ELECTRIC_CAR", "SCOOTER", etc.
    
    @Column(name = "vehicle_brand", length = 100)
    private String vehicleBrand;
    
    @Column(name = "vehicle_name", length = 200)
    private String vehicleName;
    
    @Column(name = "vehicle_year")
    private Integer vehicleYear;
    
    @Column(name = "is_on_sale")
    private boolean onSale = false;
    
    @Column(name = "original_price", precision = 19, scale = 2)
    private BigDecimal originalPrice;
    
    @Column(name = "discount_percentage")
    private Double discountPercentage;
    
    @Column(name = "item_subtotal", precision = 19, scale = 2)
    private BigDecimal itemSubtotal;
    
    @Column(name = "item_tax", precision = 19, scale = 2)
    private BigDecimal itemTax;
    
    @Column(name = "notes", length = 500)
    private String notes;
    
    // Callbacks pour synchronisation
    @PrePersist
    @PreUpdate
    private void synchronizeWithVehicle() {
        if (this.vehicle != null) {
            // Synchroniser les informations du véhicule
            if (this.vehicleType == null) {
                this.vehicleType = this.vehicle.getType();
            }
            if (this.vehicleBrand == null) {
                this.vehicleBrand = this.vehicle.getBrand();
            }
            if (this.vehicleName == null) {
                this.vehicleName = this.vehicle.getName();
            }
            if (this.vehicleYear == null) {
                this.vehicleYear = this.vehicle.getYear();
            }
            if (this.unitPrice == null) {
                this.unitPrice = this.vehicle.getPrice();
            }
            if (this.onSale == false && this.vehicle.isOnSale()) {
                this.onSale = true;
            }
            
            // Calculer le sous-total de l'item
            calculateItemSubtotal();
            
            // Calculer le prix d'origine si en promotion
            if (this.onSale && this.originalPrice == null) {
                this.originalPrice = this.vehicle.getPrice();
                if (this.unitPrice != null && this.originalPrice != null 
                    && this.originalPrice.compareTo(BigDecimal.ZERO) > 0) {
                    double discount = (1 - this.unitPrice.divide(this.originalPrice, 4, BigDecimal.ROUND_HALF_UP).doubleValue()) * 100;
                    this.discountPercentage = Math.round(discount * 100.0) / 100.0;
                }
            }
        }
    }
    
    // Méthodes utilitaires
    public void calculateItemSubtotal() {
        if (this.unitPrice != null && this.quantity != null) {
            this.itemSubtotal = this.unitPrice.multiply(BigDecimal.valueOf(this.quantity));
        }
    }
    
    public BigDecimal getTotalPrice() {
        if (this.unitPrice != null && this.quantity != null) {
            return this.unitPrice.multiply(BigDecimal.valueOf(this.quantity));
        }
        return BigDecimal.ZERO;
    }
    
    public void applyDiscount(double percentage) {
        if (this.unitPrice != null && percentage > 0 && percentage <= 100) {
            this.originalPrice = this.unitPrice;
            BigDecimal discountAmount = this.unitPrice.multiply(
                BigDecimal.valueOf(percentage / 100.0)
            );
            this.unitPrice = this.unitPrice.subtract(discountAmount);
            this.discountPercentage = percentage;
            this.onSale = true;
            calculateItemSubtotal();
        }
    }
    
    public void removeDiscount() {
        if (this.originalPrice != null) {
            this.unitPrice = this.originalPrice;
            this.originalPrice = null;
            this.discountPercentage = null;
            this.onSale = false;
            calculateItemSubtotal();
        }
    }
    
    // Méthodes pour le Template Method
    public String getVehicleTypeForTax() {
        return this.vehicleType != null ? this.vehicleType : "UNKNOWN";
    }
    
    public boolean isElectricVehicle() {
        return this.vehicleType != null && 
               (this.vehicleType.contains("ELECTRIC") || 
                this.vehicleType.equals("ELECTRIC_CAR") ||
                this.vehicleType.equals("ELECTRIC_SCOOTER"));
    }
    
    public boolean isEcologicalVehicle() {
        return isElectricVehicle() || 
               (this.vehicleType != null && 
                (this.vehicleType.equals("HYBRID") || 
                 this.vehicleType.equals("PLUGIN_HYBRID")));
    }
    
    // Getters pour compatibilité
    public double getUnitPriceDouble() {
        return this.unitPrice != null ? this.unitPrice.doubleValue() : 0.0;
    }
    
    public double getItemSubtotalDouble() {
        return this.itemSubtotal != null ? this.itemSubtotal.doubleValue() : 0.0;
    }
    
    public String getDisplayName() {
        if (this.vehicleName != null && this.vehicleBrand != null) {
            return this.vehicleBrand + " " + this.vehicleName;
        } else if (this.vehicle != null) {
            return this.vehicle.getName();
        }
        return "Article " + this.id;
    }
}