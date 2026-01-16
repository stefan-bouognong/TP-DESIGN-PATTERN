package com.example.drive_deal.dto;

import com.example.drive_deal.domain.subscription.SubscriptionType;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class SubscriptionRequestDTO {
    private Long clientId;
    private SubscriptionType subscriptionType;
    private Map<String, Object> preferences;
    
    // Filtres optionnels
    private List<String> vehicleTypes;
    private Double minPrice;
    private Double maxPrice;
    private List<String> brands;
    
    // Préférences de notification
    private String emailFrequency = "IMMEDIATE";
    private boolean emailEnabled = true;
    private boolean smsEnabled = false;
}