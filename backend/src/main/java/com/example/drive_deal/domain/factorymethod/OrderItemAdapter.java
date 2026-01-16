// OrderItemAdapter.java
package com.example.drive_deal.domain.factorymethod;

import com.example.drive_deal.entity.OrderItemEntity;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@AllArgsConstructor
public class OrderItemAdapter implements OrderItem {
    private final OrderItemEntity entity;
    
    @Override
    public Long getId() {
        return entity.getId();
    }
    
    @Override
    public Long getVehicleId() {
        return entity.getVehicle().getId();
    }
    
    @Override
    public String getVehicleModel() {
        return entity.getVehicle().getModel();
    }
    
    @Override
    public Integer getQuantity() {
        return entity.getQuantity();
    }
    
    @Override
    public BigDecimal getUnitPrice() {
        return entity.getUnitPrice();
    }
    
    @Override
    public BigDecimal getSubTotal() {
        return entity.getUnitPrice().multiply(BigDecimal.valueOf(entity.getQuantity()));
    }
}