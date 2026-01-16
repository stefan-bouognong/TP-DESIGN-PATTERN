package com.example.drive_deal.domain.subscription;

import lombok.Data;
import java.util.HashSet;
import java.util.Set;

@Data
public class SubscriptionPreference {
    private Long clientId;
    private String clientEmail;
    private Set<SubscriptionType> activeSubscriptions = new HashSet<>();
    
    // Préférences de notification
    private boolean emailEnabled = true;
    private boolean smsEnabled = false;
    private boolean pushEnabled = false;
    
    // Filtres
    private Set<String> preferredVehicleTypes = new HashSet<>();
    private Double minPrice;
    private Double maxPrice;
    private Set<String> brands = new HashSet<>();
    
    // Fréquence
    private String emailFrequency = "IMMEDIATE"; // IMMEDIATE, DAILY_DIGEST, WEEKLY_DIGEST
    
    public boolean isSubscribedTo(SubscriptionType type) {
        return activeSubscriptions.contains(type);
    }
    
    public boolean matchesVehicleFilter(String vehicleType, Double price, String brand) {
        // Vérifie si le véhicue correspond aux filtres
        boolean typeMatches = preferredVehicleTypes.isEmpty() || 
                             preferredVehicleTypes.contains(vehicleType);
        
        boolean priceMatches = (minPrice == null || price == null || price >= minPrice) &&
                              (maxPrice == null || price == null || price <= maxPrice);
        
        boolean brandMatches = brands.isEmpty() || 
                              (brand != null && brands.contains(brand));
        
        return typeMatches && priceMatches && brandMatches;
    }
}