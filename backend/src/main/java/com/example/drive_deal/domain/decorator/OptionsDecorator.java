// OptionsDecorator.java (ConcreteDecorator - Ajoute les options disponibles)
package com.example.drive_deal.domain.decorator;

import com.example.drive_deal.entity.CarEntity;
import com.example.drive_deal.entity.ScooterEntity;
import java.util.*;


public class OptionsDecorator extends VehicleDisplayDecorator {
    
    private final List<String> availableOptions;
    private final boolean showPrices;
    
    public OptionsDecorator(VehicleDisplay decoratedDisplay) {
        super(decoratedDisplay);
        this.availableOptions = determineAvailableOptions();
        this.showPrices = true;
    }
    
    public OptionsDecorator(VehicleDisplay decoratedDisplay, List<String> options, boolean showPrices) {
        super(decoratedDisplay);
        this.availableOptions = options != null ? options : determineAvailableOptions();
        this.showPrices = showPrices;
    }
    
    private List<String> determineAvailableOptions() {
        List<String> options = new ArrayList<>();
        
        if (getVehicle() instanceof CarEntity) {
            CarEntity car = (CarEntity) getVehicle();
            options.add("Sièges en cuir");
            options.add("Système audio premium");
            options.add("Toit panoramique");
            options.add("Capteurs de stationnement");
            
            if (car.getHasSunroof() != null && !car.getHasSunroof()) {
                options.add("Toit ouvrant électrique (+1,200€)");
            }
            
            if (car.getDoors() != null && car.getDoors() == 3) {
                options.add("5 portes (+800€)");
            }
        } 
        else if (getVehicle() instanceof ScooterEntity) {
            ScooterEntity scooter = (ScooterEntity) getVehicle();
            options.add("Top-case de rangement");
            options.add("Support smartphone");
            options.add("Antivol intégré");
            
            if (scooter.getHasTopCase() != null && !scooter.getHasTopCase()) {
                options.add("Top-case (+150€)");
            }
        }
        
        // Options génériques
        options.add("Garantie extension 3 ans");
        options.add("Assurance tous risques");
        options.add("Service de maintenance inclus");
        
        return options;
    }
    
    @Override
    protected String decorate(String originalDisplay) {
        StringBuilder optionsHtml = new StringBuilder();
        
        if (!availableOptions.isEmpty()) {
            optionsHtml.append("\n<div class=\"vehicle-options\">\n");
            optionsHtml.append("  <h4>Options disponibles:</h4>\n");
            optionsHtml.append("  <ul class=\"options-list\">\n");
            
            for (String option : availableOptions) {
                optionsHtml.append("    <li>").append(option).append("</li>\n");
            }
            
            optionsHtml.append("  </ul>\n");
            
            if (showPrices) {
                optionsHtml.append("  <p class=\"options-note\">Les prix des options sont ajoutés au prix de base.</p>\n");
            }
            
            optionsHtml.append("</div>\n");
        }
        
        // Insérer les options avant la fermeture de la carte
        return originalDisplay.replace("</div>", optionsHtml.toString() + "</div>");
    }
    
    @Override
    protected Map<String, Object> getAdditionalAttributes() {
        Map<String, Object> additional = new HashMap<>();
        additional.put("hasOptions", true);
        additional.put("availableOptions", new ArrayList<>(availableOptions));
        additional.put("optionsCount", availableOptions.size());
        additional.put("showOptionPrices", showPrices);
        
        // Options compatibles/incompatibles (exemple)
        Map<String, List<String>> compatibility = new HashMap<>();
        compatibility.put("compatible", Arrays.asList("Sièges en cuir", "Système audio premium"));
        compatibility.put("incompatible", Arrays.asList("Sièges sportifs")); // Exemple
        additional.put("compatibility", compatibility);
        
        return additional;
    }
    
    @Override
    protected String getDecoratorType() {
        return "OPTIONS";
    }
}