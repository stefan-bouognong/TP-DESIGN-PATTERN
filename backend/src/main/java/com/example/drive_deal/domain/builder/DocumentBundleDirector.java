// DocumentBundleDirector.java (Directeur)
package com.example.drive_deal.domain.builder;

import com.example.drive_deal.entity.OrderEntity;
import com.example.drive_deal.entity.VehicleEntity;
import com.example.drive_deal.entity.CarEntity;
import com.example.drive_deal.entity.ScooterEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DocumentBundleDirector {
    
    private final CarDocumentBundleBuilder carBuilder;
    private final ScooterDocumentBundleBuilder scooterBuilder;
    
    public DocumentBundle constructCompleteBundle(OrderEntity order) {
        // Détecter le type de véhicule principal
        DocumentBundleBuilder builder = selectBuilder(order);
        
        // Processus de construction étape par étape
        builder.createNewBundle(order);
        builder.buildRegistrationRequest();
        builder.buildTransferCertificate();
        builder.buildOrderForm();
        builder.buildInvoice();
        
        DocumentBundle bundle = builder.getBundle();
        bundle.setCompleted(true);
        bundle.setDownloadPath("/downloads/bundle_order_" + order.getId() + ".zip");
        
        return bundle;
    }
    
    public DocumentBundle constructMinimalBundle(OrderEntity order) {
        DocumentBundleBuilder builder = selectBuilder(order);
        
        builder.createNewBundle(order);
        builder.buildOrderForm(); // Seulement le bon de commande
        
        DocumentBundle bundle = builder.getBundle();
        bundle.setBundleName("Bundle Minimal - Order #" + order.getId());
        
        return bundle;
    }
    
    public DocumentBundle constructRegistrationBundle(OrderEntity order) {
        DocumentBundleBuilder builder = selectBuilder(order);
        
        builder.createNewBundle(order);
        builder.buildRegistrationRequest();
        builder.buildTransferCertificate();
        
        DocumentBundle bundle = builder.getBundle();
        bundle.setBundleName("Registration Bundle - Order #" + order.getId());
        
        return bundle;
    }
    
    private DocumentBundleBuilder selectBuilder(OrderEntity order) {
        if (order.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order has no items");
        }
        
        // Vérifier le type du premier véhicule
        VehicleEntity firstVehicle = order.getItems().get(0).getVehicle();
        
        if (firstVehicle instanceof CarEntity) {
            return carBuilder;
        } else if (firstVehicle instanceof ScooterEntity) {
            return scooterBuilder;
        } else {
            // Par défaut, utiliser le builder voiture
            return carBuilder;
        }
    }
}