// CreditOrderCreator.java
package com.example.drive_deal.domain.factorymethod;

import com.example.drive_deal.entity.*;
import com.example.drive_deal.repository.VehicleRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CreditOrderCreator extends OrderCreator {
    
    private final VehicleRepository vehicleRepository;
    
    @Override
    public Order createOrder(ClientEntity client, List<Map<String, Object>> vehicleRequests) {
        CreditOrderEntity order = new CreditOrderEntity();
        order.setClient(client);
        order.setMonths(24); // Par défaut 24 mois
        order.setInterestRate(3.5); // 3.5% par an
        
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
            
            orderItems.add(new OrderItemAdapter(item));
        }
        
        // Appliquer le discount flotte pour les sociétés
        if (client instanceof CompanyClientEntity) {
            // Logique de discount composite
            order.calculateSubtotal();
        }
        
        return new CreditOrder(order, orderItems);
    }
    
    @Override
    public String getOrderType() {
        return "CREDIT";
    }
}