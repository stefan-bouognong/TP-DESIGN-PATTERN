// BasicVehicleDisplay.java (ConcreteComponent)
package com.example.drive_deal.domain.decorator;

import com.example.drive_deal.entity.VehicleEntity;
import lombok.Getter;
import java.util.HashMap;
import java.util.Map;

@Getter
public class BasicVehicleDisplay implements VehicleDisplay {
    
    protected final VehicleEntity vehicle;
    protected final Map<String, Object> attributes;
    
    public BasicVehicleDisplay(VehicleEntity vehicle) {
        this.vehicle = vehicle;
        this.attributes = new HashMap<>();
        initializeBasicAttributes();
    }
    
    private void initializeBasicAttributes() {
        attributes.put("vehicleId", vehicle.getId());
        attributes.put("model", vehicle.getModel());
        attributes.put("price", vehicle.getPrice());
        attributes.put("color", vehicle.getColor());
        attributes.put("year", vehicle.getYear());
        attributes.put("displayType", "BASIC");
        attributes.put("hasAnimations", false);
        attributes.put("hasSaleBadge", false);
        attributes.put("hasOptions", false);
        attributes.put("hasRecommendations", false);
    }
    
    @Override
    public String display() {
        return generateBasicHtml();
    }
    
    @Override
    public Map<String, Object> getDisplayAttributes() {
        return new HashMap<>(attributes);
    }
    
    @Override
    public String getDisplayType() {
        return "BASIC";
    }
    
    protected String generateBasicHtml() {
        return String.format(
            "<div class=\"vehicle-card basic\" data-vehicle-id=\"%d\">\n" +
            "  <h3>%s</h3>\n" +
            "  <div class=\"vehicle-info\">\n" +
            "    <p><strong>Prix:</strong> %s FCFA</p>\n" +
            "    <p><strong>Couleur:</strong> %s</p>\n" +
            "    <p><strong>Année:</strong> %s</p>\n" +
            "  </div>\n" +
            "</div>",
            vehicle.getId(),
            escapeHtml(vehicle.getModel()),
            vehicle.getPrice(),
            escapeHtml(vehicle.getColor()),
            vehicle.getYear()
        );
    }
    
    protected String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;");
    }
}