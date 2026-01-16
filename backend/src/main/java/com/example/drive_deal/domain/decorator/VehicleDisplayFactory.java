// VehicleDisplayFactory.java (CORRIGÉ)
package com.example.drive_deal.domain.decorator;

import com.example.drive_deal.entity.VehicleEntity;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class VehicleDisplayFactory {
    
    // SUPPRIMER les injections de décorateurs
    // private final AnimationDecorator animationDecorator; <-- SUPPRIMER
    
    public VehicleDisplayFactory() {
        // Constructeur vide
    }
    
    public VehicleDisplay createBasicDisplay(VehicleEntity vehicle) {
        return new BasicVehicleDisplay(vehicle);
    }
    
    public VehicleDisplay createEnhancedDisplay(VehicleEntity vehicle, List<String> decorators) {
        VehicleDisplay display = new BasicVehicleDisplay(vehicle);
        
        for (String decorator : decorators) {
            switch (decorator.toUpperCase()) {
                case "ANIMATION":
                    display = new AnimationDecorator(display);
                    break;
                case "SALE":
                    display = new SaleDecorator(display);
                    break;
                case "OPTIONS":
                    display = new OptionsDecorator(display);
                    break;
                case "RECOMMENDATION":
                    display = new RecommendationDecorator(display);
                    break;
            }
        }
        
        return display;
    }
    
    public VehicleDisplay createFullFeaturedDisplay(VehicleEntity vehicle) {
        VehicleDisplay display = new BasicVehicleDisplay(vehicle);
        display = new AnimationDecorator(display);
        display = new SaleDecorator(display);
        display = new OptionsDecorator(display);
        display = new RecommendationDecorator(display);
        return display;
    }
    
    public VehicleDisplay createCatalogDisplay(VehicleEntity vehicle) {
        VehicleDisplay display = new BasicVehicleDisplay(vehicle);
        display = new AnimationDecorator(display);
        display = new OptionsDecorator(display);
        return display;
    }
    
    public VehicleDisplay createSaleDisplay(VehicleEntity vehicle) {
        VehicleDisplay display = new BasicVehicleDisplay(vehicle);
        display = new SaleDecorator(display, new java.math.BigDecimal("20.00"), "CLEARANCE", "SOLDE");
        display = new AnimationDecorator(display);
        return display;
    }
}