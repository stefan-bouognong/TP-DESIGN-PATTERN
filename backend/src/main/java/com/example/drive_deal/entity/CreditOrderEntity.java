// CreditOrderEntity.java (corrigé)
package com.example.drive_deal.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

@Entity
@DiscriminatorValue("CREDIT")
@Data
@EqualsAndHashCode(callSuper = true)
public class CreditOrderEntity extends OrderEntity {
    private Integer months = 12; // Durée du crédit en mois
    private Double interestRate = 5.0; // Taux d'intérêt annuel
    
    @Enumerated(EnumType.STRING)
    private CreditStatus creditStatus = CreditStatus.PENDING;
    
    private Boolean approved = false;
    
    public enum CreditStatus {
        PENDING, APPROVED, REJECTED
    }
    
    // Calcul avec intérêts (CORRIGÉ)
    @Override
    public void calculateSubtotal() {
        super.calculateSubtotal(); // Calcule le total de base
        
        if (Boolean.TRUE.equals(approved)) {
            BigDecimal monthlyRate = BigDecimal.valueOf(interestRate / 12 / 100);
            BigDecimal interest = getSubtotal().multiply(monthlyRate)
                .multiply(BigDecimal.valueOf(months));
            setTotalAmount(getSubtotal().add(interest));
        }
    }
}