// VehicleDisplayDecorator.java (Decorator Abstract Class)
package com.example.drive_deal.domain.decorator;

import com.example.drive_deal.entity.VehicleEntity;
import lombok.Getter;
import java.util.Map;

@Getter
public abstract class VehicleDisplayDecorator implements VehicleDisplay {
    
    protected final VehicleDisplay decoratedDisplay;
    
    protected VehicleDisplayDecorator(VehicleDisplay decoratedDisplay) {
        this.decoratedDisplay = decoratedDisplay;
    }
    
    @Override
    public VehicleEntity getVehicle() {
        return decoratedDisplay.getVehicle();
    }
    
    @Override
    public Map<String, Object> getDisplayAttributes() {
        Map<String, Object> attributes = decoratedDisplay.getDisplayAttributes();
        attributes.putAll(getAdditionalAttributes());
        return attributes;
    }
    
    @Override
    public String display() {
        return decorate(decoratedDisplay.display());
    }
    
    @Override
    public String getDisplayType() {
        return decoratedDisplay.getDisplayType() + "+" + getDecoratorType();
    }
    
    // Méthodes abstraites à implémenter par les décorateurs concrets
    protected abstract String decorate(String originalDisplay);
    protected abstract Map<String, Object> getAdditionalAttributes();
    protected abstract String getDecoratorType();
}