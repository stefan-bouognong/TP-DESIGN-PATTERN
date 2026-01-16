package com.example.drive_deal.dto;

import lombok.Data;

import java.util.List;

@Data
public class NotificationPreferenceDTO {
    private Long clientId;
    
    // Types d'abonnement
    private boolean receiveCatalogUpdates = true;
    private boolean receiveNewVehicles = true;
    private boolean receivePromotions = true;
    private boolean receivePriceDrops = true;
    private boolean receiveOrderUpdates = true;
    
    // Filtres
    private List<String> vehicleTypes;
    private Double minPrice;
    private Double maxPrice;
    private List<String> brands;
    
    // Fréquence et format
    private String emailFrequency = "IMMEDIATE";
    private String preferredFormat = "HTML";
    
    // Canaux
    private boolean emailEnabled = true;
    private boolean smsEnabled = false;
    private boolean pushEnabled = false;
}