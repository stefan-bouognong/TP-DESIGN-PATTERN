// AnimationDecorator.java (ConcreteDecorator - Ajoute des animations)
package com.example.drive_deal.domain.decorator;


import java.util.HashMap;
import java.util.Map;


public class AnimationDecorator extends VehicleDisplayDecorator {
    
    private final String animationType;
    private final boolean autoPlay;
    
    public AnimationDecorator(VehicleDisplay decoratedDisplay) {
        super(decoratedDisplay);
        this.animationType = "fade-slide";
        this.autoPlay = true;
    }
    
    public AnimationDecorator(VehicleDisplay decoratedDisplay, String animationType, boolean autoPlay) {
        super(decoratedDisplay);
        this.animationType = animationType;
        this.autoPlay = autoPlay;
    }
    
    @Override
    protected String decorate(String originalDisplay) {
        // Ajoute les classes CSS pour les animations
        String animatedHtml = originalDisplay.replace(
            "class=\"vehicle-card",
            String.format("class=\"vehicle-card animated %s %s\" data-animation=\"%s\"",
                animationType, 
                autoPlay ? "autoplay" : "",
                animationType
            )
        );
        
        // Ajoute le script d'animation si nécessaire
        if (autoPlay) {
            animatedHtml += String.format(
                "\n<script>\n" +
                "  document.addEventListener('DOMContentLoaded', function() {\n" +
                "    const card = document.querySelector('[data-vehicle-id=\"%d\"]');\n" +
                "    if (card) {\n" +
                "      card.classList.add('animate-in');\n" +
                "    }\n" +
                "  });\n" +
                "</script>",
                getVehicle().getId()
            );
        }
        
        return animatedHtml;
    }
    
    @Override
    protected Map<String, Object> getAdditionalAttributes() {
        Map<String, Object> additional = new HashMap<>();
        additional.put("hasAnimations", true);
        additional.put("animationType", animationType);
        additional.put("autoPlay", autoPlay);
        additional.put("animationClass", "animated-" + animationType);
        return additional;
    }
    
    @Override
    protected String getDecoratorType() {
        return "ANIMATION";
    }
}