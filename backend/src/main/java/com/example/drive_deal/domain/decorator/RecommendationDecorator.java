// RecommendationDecorator.java (ConcreteDecorator - Ajoute des recommandations)
package com.example.drive_deal.domain.decorator;


import java.math.BigDecimal;
import java.util.*;


public class RecommendationDecorator extends VehicleDisplayDecorator {
    
    private final List<Map<String, Object>> recommendations;
    private final String recommendationType; // "SIMILAR", "POPULAR", "UPSELL"
    
    public RecommendationDecorator(VehicleDisplay decoratedDisplay) {
        super(decoratedDisplay);
        this.recommendationType = "SIMILAR";
        this.recommendations = generateRecommendations();
    }
    
    public RecommendationDecorator(VehicleDisplay decoratedDisplay, String recommendationType) {
        super(decoratedDisplay);
        this.recommendationType = recommendationType;
        this.recommendations = generateRecommendations();
    }
    
    private List<Map<String, Object>> generateRecommendations() {
        List<Map<String, Object>> recs = new ArrayList<>();
        
        // Recommandations simulées
        Map<String, Object> rec1 = new HashMap<>();
        rec1.put("id", 9991L);
        rec1.put("model", "Modèle similaire");
        rec1.put("reason", "Même catégorie");
        rec1.put("price", getVehicle().getPrice().add(new BigDecimal("5000")));
        recs.add(rec1);
        
        Map<String, Object> rec2 = new HashMap<>();
        rec2.put("id", 9992L);
        rec2.put("model", "Alternative économique");
        rec2.put("reason", "15% moins cher");
        rec2.put("price", getVehicle().getPrice().multiply(new BigDecimal("0.85")));
        recs.add(rec2);
        
        return recs;
    }
    
    @Override
    protected String decorate(String originalDisplay) {
        if (recommendations.isEmpty()) {
            return originalDisplay;
        }
        
        StringBuilder recHtml = new StringBuilder();
        recHtml.append("\n<div class=\"vehicle-recommendations\">\n");
        recHtml.append("  <h4>Recommandations (").append(recommendationType).append("):</h4>\n");
        recHtml.append("  <div class=\"recommendations-grid\">\n");
        
        for (Map<String, Object> rec : recommendations) {
            recHtml.append("    <div class=\"recommendation-item\">\n");
            recHtml.append("      <h5>").append(rec.get("model")).append("</h5>\n");
            recHtml.append("      <p>").append(rec.get("reason")).append("</p>\n");
            recHtml.append("      <p><strong>").append(rec.get("price")).append(" FCFA</strong></p>\n");
            recHtml.append("    </div>\n");
        }
        
        recHtml.append("  </div>\n");
        recHtml.append("  <p class=\"recommendation-note\">Ces véhicules pourraient aussi vous intéresser.</p>\n");
        recHtml.append("</div>\n");
        
        // Ajouter les recommandations après la carte
        return originalDisplay + recHtml.toString();
    }
    
    @Override
    protected Map<String, Object> getAdditionalAttributes() {
        Map<String, Object> additional = new HashMap<>();
        additional.put("hasRecommendations", true);
        additional.put("recommendationType", recommendationType);
        additional.put("recommendations", new ArrayList<>(recommendations));
        additional.put("recommendationCount", recommendations.size());
        return additional;
    }
    
    @Override
    protected String getDecoratorType() {
        return "RECOMMENDATION";
    }
}