// CreditOrder.java (corrigé)
package com.example.drive_deal.domain.factorymethod;

import com.example.drive_deal.entity.CreditOrderEntity;
import com.example.drive_deal.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.math.BigDecimal;
import java.util.List;

@AllArgsConstructor
@Getter
public class CreditOrder implements Order {
    private final CreditOrderEntity entity;
    private final List<OrderItem> items;
    
    @Override
    public Long getId() {
        return entity.getId();
    }
    
    @Override
    public String getOrderType() {
        return "CREDIT";
    }
    
    @Override
    public OrderStatus getStatus() {
        return entity.getStatus();
    }
    
    @Override
    public BigDecimal getTotalAmount() {
        return entity.getTotalAmount();
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
        // À implémenter
    }
    
    @Override
    public void calculateTotal() {
        entity.calculateSubtotal();
    }
    
    @Override
    public void setStatus(OrderStatus status) {
        entity.setStatus(status);
    }
    
    public CreditOrderEntity getEntity() {
        return entity;
    }
}