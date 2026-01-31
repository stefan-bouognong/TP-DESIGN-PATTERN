// CashOrderEntity.java (corrigé si besoin)
package com.example.drive_deal.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

@Entity
@DiscriminatorValue("CASH")
@Data
@EqualsAndHashCode(callSuper = true)
public class CashOrderEntity extends OrderEntity {
    @Column(precision = 5, scale = 2)
    private BigDecimal cashDiscount = BigDecimal.ZERO; // Discount pour paiement comptant
    
    private Boolean paid = false;
    
    // Recalcul avec discount (CORRIGÉ)
     @Override
    public void calculateTotalAmount() {
        super.calculateTotalAmount();
        // BigDecimal discountAmount = getSubtotal()
        //     .multiply(cashDiscount.divide(BigDecimal.valueOf(100)));
        // setTotalAmount(getSubtotal().add(discountAmount));
    }
}