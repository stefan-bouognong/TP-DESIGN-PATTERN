// OrderAdapter.java
package com.example.drive_deal.domain.factorymethod;

import com.example.drive_deal.entity.OrderEntity;
import org.springframework.stereotype.Component;

@Component
public class OrderAdapter {
    
    public Order adapt(OrderEntity entity) {
        // Cette méthode serait utilisée pour charger depuis la base
        // Implémentation simplifiée
        return null;
    }
}