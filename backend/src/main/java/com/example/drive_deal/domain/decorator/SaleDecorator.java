// SaleDecorator.java (ConcreteDecorator - Ajoute un badge de solde)
package com.example.drive_deal.domain.decorator;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;


public class SaleDecorator extends VehicleDisplayDecorator {
    
    private final BigDecimal discountPercentage;
    private final String saleType; // "CLEARANCE", "PROMOTION", "SEASONAL"
    private final String badgeText;
    
    public SaleDecorator(VehicleDisplay decoratedDisplay) {
        super(decoratedDisplay);
        this.discountPercentage = new BigDecimal("15.00");
        this.saleType = "PROMOTION";
        this.badgeText = "PROMO";
    }
    
    public SaleDecorator(VehicleDisplay decoratedDisplay, BigDecimal discountPercentage, 
                        String saleType, String badgeText) {
        super(decoratedDisplay);
        this.discountPercentage = discountPercentage;
        this.saleType = saleType;
        this.badgeText = badgeText;
    }
    
    @Override
    protected String decorate(String originalDisplay) {
        // Calculer le nouveau prix
        BigDecimal originalPrice = getVehicle().getPrice();
        BigDecimal discountAmount = originalPrice.multiply(discountPercentage)
            .divide(new BigDecimal("100"));
        BigDecimal salePrice = originalPrice.subtract(discountAmount);
        
        // Ajouter le badge de solde
        String saleHtml = originalDisplay.replace(
            "<h3>",
            String.format(
                "<div class=\"sale-badge %s\">\n" +
                "  <span class=\"badge-text\">%s</span>\n" +
                "  <span class=\"discount\">-%s%%</span>\n" +
                "</div>\n<h3>",
                saleType.toLowerCase(),
                badgeText,
                discountPercentage
            )
        );
        
        // Remplacer le prix par le prix soldé
        saleHtml = saleHtml.replace(
            String.format("<strong>Prix:</strong> %s FCFA", originalPrice),
            String.format(
                "<strong>Prix:</strong> <span class=\"original-price\">%s FCFA</span>\n" +
                "  <span class=\"sale-price\">%s FCFA</span>\n" +
                "  <span class=\"discount-info\">(Économisez %s FCFA)</span>",
                originalPrice,
                salePrice.setScale(2, BigDecimal.ROUND_HALF_UP),
                discountAmount.setScale(2, BigDecimal.ROUND_HALF_UP)
            )
        );
        
        return saleHtml;
    }
    
    @Override
    protected Map<String, Object> getAdditionalAttributes() {
        Map<String, Object> additional = new HashMap<>();
        additional.put("hasSaleBadge", true);
        additional.put("discountPercentage", discountPercentage);
        additional.put("saleType", saleType);
        additional.put("badgeText", badgeText);
        
        // Calculer les prix
        BigDecimal originalPrice = getVehicle().getPrice();
        BigDecimal discountAmount = originalPrice.multiply(discountPercentage)
            .divide(new BigDecimal("100"));
        BigDecimal salePrice = originalPrice.subtract(discountAmount);
        
        additional.put("originalPrice", originalPrice);
        additional.put("salePrice", salePrice);
        additional.put("discountAmount", discountAmount);
        
        return additional;
    }
    
    @Override
    protected String getDecoratorType() {
        return "SALE";
    }
}