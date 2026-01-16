// OrderCreator.java (classe abstraite Factory Method)
package com.example.drive_deal.domain.factorymethod;

import com.example.drive_deal.entity.ClientEntity;
import com.example.drive_deal.entity.VehicleEntity;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Map;

@Component
public abstract class OrderCreator {
    
    public abstract Order createOrder(ClientEntity client, 
                                      List<Map<String, Object>> vehicleRequests);
    
    public abstract String getOrderType();
}