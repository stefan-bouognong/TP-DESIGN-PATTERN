// FormFactory.java (Factory pour créer les forms)
package com.example.drive_deal.domain.bridge;

import com.example.drive_deal.entity.*;
import org.springframework.stereotype.Component;

@Component
public class FormFactory {
    
    private final HtmlFormRenderer htmlRenderer;
    private final WidgetFormRenderer widgetRenderer;
    
    public FormFactory(HtmlFormRenderer htmlRenderer, WidgetFormRenderer widgetRenderer) {
        this.htmlRenderer = htmlRenderer;
        this.widgetRenderer = widgetRenderer;
    }
    
    public Form createVehicleForm(VehicleEntity vehicle, String rendererType) {
        FormRenderer renderer = getRenderer(rendererType);
        return new VehicleForm(renderer, vehicle);
    }
    
    public Form createClientForm(ClientEntity client, String rendererType) {
        FormRenderer renderer = getRenderer(rendererType);
        return new ClientForm(renderer, client);
    }
    
    public Form createOrderForm(OrderEntity order, String rendererType) {
        FormRenderer renderer = getRenderer(rendererType);
        return new OrderForm(renderer, order);
    }
    
    public FormRenderer getRenderer(String rendererType) {
        return switch (rendererType.toUpperCase()) {
            case "HTML" -> htmlRenderer;
            case "WIDGET" -> widgetRenderer;
            default -> htmlRenderer; // Par défaut
        };
    }
    
    public String[] getAvailableRenderers() {
        return new String[]{"HTML", "WIDGET"};
    }
}