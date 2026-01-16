// CashOrderCreator.java
package com.example.drive_deal.domain.factorymethod;

import com.example.drive_deal.entity.*;
import com.example.drive_deal.repository.VehicleRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CashOrderCreator extends OrderCreator {
    
    private final VehicleRepository vehicleRepository;
    
    @Override
    public Order createOrder(ClientEntity client, List<Map<String, Object>> vehicleRequests) {
        CashOrderEntity order = new CashOrderEntity();
        order.setClient(client);
        order.setCashDiscount(BigDecimal.valueOf(5.0)); // 5% de réduction pour cash
        
        // Créer les items
        List<OrderItem> orderItems = new ArrayList<>();
        
        for (Map<String, Object> request : vehicleRequests) {
            Long vehicleId = Long.valueOf(request.get("vehicleId").toString());
            Integer quantity = Integer.valueOf(request.get("quantity").toString());
            
            VehicleEntity vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found: " + vehicleId));
            
            OrderItemEntity item = new OrderItemEntity();
            item.setVehicle(vehicle);
            item.setQuantity(quantity);
            item.setUnitPrice(vehicle.getPrice());
            
            order.addItem(item);
            
            // Créer l'item du domaine
            orderItems.add(new OrderItemAdapter(item));
        }
        
        order.calculateSubtotal();
        return new CashOrder(order, orderItems);
    }
    
    @Override
    public String getOrderType() {
        return "CASH";
    }
}