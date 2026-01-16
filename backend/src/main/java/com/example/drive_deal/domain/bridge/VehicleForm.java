// VehicleForm.java (RefinedAbstraction - Formulaire véhicule)
package com.example.drive_deal.domain.bridge;

import com.example.drive_deal.entity.VehicleEntity;
import lombok.Getter;

@Getter
public class VehicleForm extends Form {
    
    private VehicleEntity vehicle;
    private boolean includeTechnicalDetails = true;
    private boolean includePricing = true;
    
    public VehicleForm(FormRenderer renderer, VehicleEntity vehicle) {
        super(renderer);
        this.vehicle = vehicle;
    }
    
    public VehicleForm(FormRenderer renderer) {
        super(renderer);
    }
    
    @Override
    public String render() {
        StringBuilder builder = new StringBuilder();
        
        // Champs de base
        builder.append(renderer.renderField("model", "Modèle", vehicle.getModel()));
        builder.append(renderer.renderField("price", "Prix", vehicle.getPrice().toString() + " FCFA"));
        builder.append(renderer.renderField("color", "Couleur", vehicle.getColor()));
        builder.append(renderer.renderField("year", "Année", vehicle.getYear().toString()));
        
        // Détails techniques si demandés
        if (includeTechnicalDetails && vehicle instanceof com.example.drive_deal.entity.CarEntity) {
            com.example.drive_deal.entity.CarEntity car = (com.example.drive_deal.entity.CarEntity) vehicle;
            builder.append(renderer.renderField("doors", "Nombre de portes", car.getDoors().toString()));
            
            if (car.getHasSunroof() != null) {
                builder.append(renderer.renderField("sunroof", "Toit ouvrant", 
                    car.getHasSunroof() ? "Oui" : "Non"));
            }
        }
        
        // Type de véhicule
        String vehicleType = getVehicleType();
        builder.append(renderer.renderField("type", "Type de véhicule", vehicleType));
        
        return builder.toString();
    }
    
    @Override
    public String getTitle() {
        return vehicle != null ? 
            "Formulaire Véhicule - " + vehicle.getModel() : 
            "Nouveau Véhicule";
    }
    
    @Override
    public String getFormType() {
        return "VEHICLE";
    }
    
    private String getVehicleType() {
        if (vehicle instanceof com.example.drive_deal.entity.ElectricCarEntity) {
            return "Voiture Électrique";
        } else if (vehicle instanceof com.example.drive_deal.entity.GasolineCarEntity) {
            return "Voiture Essence";
        } else if (vehicle instanceof com.example.drive_deal.entity.ScooterEntity) {
            return "Scooter";
        } else if (vehicle instanceof com.example.drive_deal.entity.CarEntity) {
            return "Voiture";
        }
        return "Véhicule";
    }
    
    // Setters pour configuration
    public void setVehicle(VehicleEntity vehicle) {
        this.vehicle = vehicle;
    }
    
    public void setIncludeTechnicalDetails(boolean include) {
        this.includeTechnicalDetails = include;
    }
    
    public void setIncludePricing(boolean include) {
        this.includePricing = include;
    }
}