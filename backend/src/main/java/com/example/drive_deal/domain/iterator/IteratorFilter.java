package com.example.drive_deal.domain.iterator;

import lombok.Data;
import java.util.List;

@Data
public class IteratorFilter {
    private List<String> vehicleTypes;      // ["CAR", "ELECTRIC_CAR", "SCOOTER"]
    private Double minPrice;
    private Double maxPrice;
    private List<String> brands;           // ["Tesla", "BMW", "Yamaha"]
    private Boolean inStock;               // true = seulement disponibles
    private Boolean onSale;                // true = seulement en promotion
    private String searchKeyword;          // Recherche texte
    private Integer minYear;
    private Integer maxYear;
    
    // Vérifie si un filtre est actif
    public boolean hasTypeFilter() {
        return vehicleTypes != null && !vehicleTypes.isEmpty();
    }
    
    public boolean hasPriceFilter() {
        return minPrice != null || maxPrice != null;
    }
    
    public boolean hasBrandFilter() {
        return brands != null && !brands.isEmpty();
    }
    
    public boolean hasKeywordFilter() {
        return searchKeyword != null && !searchKeyword.trim().isEmpty();
    }
    
    // Vérifie si un véhicule correspond aux filtres
    public boolean matchesVehicle(String vehicleType, Double price, String brand, 
                                 Boolean available, Boolean onSale, Integer year, 
                                 String name, String description) {
        
        // Filtre par type
        if (hasTypeFilter() && !vehicleTypes.contains(vehicleType)) {
            return false;
        }
        
        // Filtre par prix
        if (minPrice != null && price < minPrice) {
            return false;
        }
        if (maxPrice != null && price > maxPrice) {
            return false;
        }
        
        // Filtre par marque
        if (hasBrandFilter() && !brands.contains(brand)) {
            return false;
        }
        
        // Filtre stock
        if (inStock != null && inStock && !available) {
            return false;
        }
        
        // Filtre promotion
        if (onSale != null && this.onSale && !onSale) {
            return false;
        }
        
        // Filtre année
        if (minYear != null && year < minYear) {
            return false;
        }
        if (maxYear != null && year > maxYear) {
            return false;
        }
        
        // Filtre recherche texte
        if (hasKeywordFilter()) {
            String keyword = searchKeyword.toLowerCase();
            boolean nameMatch = name != null && name.toLowerCase().contains(keyword);
            boolean descMatch = description != null && description.toLowerCase().contains(keyword);
            if (!nameMatch && !descMatch) {
                return false;
            }
        }
        
        return true;
    }
}