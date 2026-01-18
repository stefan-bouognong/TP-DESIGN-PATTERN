// CashOrder.java (correction de getSubtotal())
package com.example.drive_deal.domain.factorymethod;

import com.example.drive_deal.entity.CashOrderEntity;
import com.example.drive_deal.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.math.BigDecimal;
import java.util.List;

@AllArgsConstructor
@Getter
public class CashOrder implements Order {
    private final CashOrderEntity entity;
    private final List<OrderItem> items;
    
    @Override
    public Long getId() {
        return entity.getId();
    }
    
    @Override
    public String getOrderType() {
        return "CASH";
    }
    
    @Override
    public OrderStatus getStatus() {
        return entity.getStatus();
    }
    
    @Override
    public BigDecimal getSubtotal() {
        return entity.getSubtotal(); // Utilise le getter généré par Lombok
    }
    
    @Override
    public int getItemCount() {
        return items.size();
    }
    
    @Override
    public List<OrderItem> getItems() {
        return items;
    }
    
    @Override
    public void addItem(OrderItem item) {
        // À implémenter selon besoin
    }
    
    @Override
    public void calculateTotal() {
        entity.calculateSubtotal();
    }
    
    @Override
    public void setStatus(OrderStatus status) {
        entity.setStatus(status);
    }
    
    public CashOrderEntity getEntity() {
        return entity;
    }
}