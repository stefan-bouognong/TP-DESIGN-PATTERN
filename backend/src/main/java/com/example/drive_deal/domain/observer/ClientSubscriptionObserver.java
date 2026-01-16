package com.example.drive_deal.domain.observer;

import com.example.drive_deal.domain.subscription.SubscriptionManager;
import com.example.drive_deal.domain.subscription.SubscriptionPreference;
import com.example.drive_deal.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class ClientSubscriptionObserver implements Observer {
    
    private final SubscriptionManager subscriptionManager;
    private final NotificationService notificationService;
    private final CatalogSubject catalogSubject;
    
    private boolean active = true;
    
    @Autowired
    public ClientSubscriptionObserver(SubscriptionManager subscriptionManager,
                                    NotificationService notificationService,
                                    CatalogSubject catalogSubject) {
        this.subscriptionManager = subscriptionManager;
        this.notificationService = notificationService;
        this.catalogSubject = catalogSubject;
    }
    
    @PostConstruct
    public void init() {
        catalogSubject.registerObserver(this);
        log.info("ClientSubscriptionObserver initialisé");
    }
    
    @Override
    public void update(CatalogEvent event) {
        if (!active) return;
        
        try {
            switch (event.getType()) {
                case VEHICLE_ADDED:
                    handleNewVehicle(event);
                    break;
                    
                case VEHICLE_ON_SALE:
                    handleVehicleOnSale(event);
                    break;
                    
                case VEHICLE_PRICE_CHANGED:
                    handlePriceChange(event);
                    break;
                    
                case SPECIAL_OFFER_ADDED:
                    handleSpecialOffer(event);
                    break;
                    
                default:
                    // Ignorer les autres événements
                    break;
            }
        } catch (Exception e) {
            log.error("Erreur dans ClientSubscriptionObserver: {}", e.getMessage(), e);
        }
    }
    
    private void handleNewVehicle(CatalogEvent event) {
        Map<String, Object> data = event.getData();
        Long vehicleId = (Long) data.get("vehicleId");
        String vehicleName = (String) data.get("vehicleName");
        String vehicleType = (String) data.get("vehicleType");
        Double price = (Double) data.get("price");
        String brand = (String) data.get("brand");
        
        // Récupérer les clients abonnés aux nouveaux véhicules
        List<SubscriptionPreference> subscribers = 
            subscriptionManager.getSubscribersForEvent(EventType.VEHICLE_ADDED);
        
        for (SubscriptionPreference pref : subscribers) {
            // Vérifier si le véhicule correspond aux préférences du client
            if (pref.matchesVehicleFilter(vehicleType, price, brand)) {
                sendVehicleNotification(
                    pref.getClientEmail(),
                    "Nouveau véhicule disponible !",
                    buildNewVehicleEmail(vehicleName, vehicleType, price, brand),
                    event
                );
            }
        }
        
        log.info("Notification nouveau véhicule envoyée à {} clients", subscribers.size());
    }
    
    private void handleVehicleOnSale(CatalogEvent event) {
        Map<String, Object> data = event.getData();
        Long vehicleId = (Long) data.get("vehicleId");
        String vehicleName = (String) data.get("vehicleName");
        Double oldPrice = (Double) data.get("oldPrice");
        Double newPrice = (Double) data.get("newPrice");
        Double discount = (Double) data.get("discount");
        String vehicleType = (String) data.get("vehicleType");
        String brand = (String) data.get("brand");
        
        List<SubscriptionPreference> subscribers = 
            subscriptionManager.getSubscribersForEvent(EventType.VEHICLE_ON_SALE);
        
        for (SubscriptionPreference pref : subscribers) {
            if (pref.matchesVehicleFilter(vehicleType, newPrice, brand)) {
                sendVehicleNotification(
                    pref.getClientEmail(),
                    "🚨 Promotion exceptionnelle !",
                    buildPromotionEmail(vehicleName, oldPrice, newPrice, discount),
                    event
                );
            }
        }
        
        log.info("Notification promotion envoyée à {} clients", subscribers.size());
    }
    
    private void handlePriceChange(CatalogEvent event) {
        Map<String, Object> data = event.getData();
        Double oldPrice = (Double) data.get("oldPrice");
        Double newPrice = (Double) data.get("newPrice");
        
        // Vérifier si c'est une baisse de prix significative (> 5%)
        if (oldPrice != null && newPrice != null && newPrice < oldPrice) {
            double dropPercentage = ((oldPrice - newPrice) / oldPrice) * 100;
            
            if (dropPercentage >= 5) { // Seuil de 5%
                handleVehicleOnSale(event); // Traiter comme une promotion
            }
        }
    }
    
    private void handleSpecialOffer(CatalogEvent event) {
        // Logique similaire pour les offres spéciales
    }
    
    private void sendVehicleNotification(String to, String subject, String body, CatalogEvent event) {
        try {
            notificationService.sendEmail(to, subject, body, true);
            
            // Journaliser l'envoi
            log.debug("Notification catalogue envoyée à {} pour événement {}", 
                     to, event.getType());
        } catch (Exception e) {
            log.error("Échec d'envoi de notification à {}: {}", to, e.getMessage());
        }
    }
    
    private String buildNewVehicleEmail(String vehicleName, String vehicleType, 
                                       Double price, String brand) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f9f9f9; }
                    .vehicle-card { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
                    .cta-button { display: inline-block; background: #3498db; color: white; 
                                 padding: 10px 20px; text-decoration: none; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>🚗 Nouveau véhicule disponible !</h2>
                    </div>
                    <div class="content">
                        <h3>%s</h3>
                        <div class="vehicle-card">
                            <p><strong>Type:</strong> %s</p>
                            <p><strong>Marque:</strong> %s</p>
                            <p><strong>Prix:</strong> %s FCFA</p>
                        </div>
                        <p>Ce véhicule correspond à vos préférences d'abonnement.</p>
                        <a href="https://votre-site.com/vehicles" class="cta-button">
                            Voir le véhicule
                        </a>
                        <p><small>Pour modifier vos préférences, visitez votre compte.</small></p>
                    </div>
                </div>
            </body>
            </html>
            """, vehicleName, vehicleType, brand, price);
    }
    
    private String buildPromotionEmail(String vehicleName, Double oldPrice, 
                                      Double newPrice, Double discount) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #e74c3c; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f9f9f9; }
                    .promo-badge { background: #e74c3c; color: white; padding: 5px 10px; 
                                  border-radius: 3px; display: inline-block; }
                    .old-price { text-decoration: line-through; color: #777; }
                    .new-price { color: #e74c3c; font-size: 1.5em; font-weight: bold; }
                    .cta-button { display: inline-block; background: #3498db; color: white; 
                                 padding: 10px 20px; text-decoration: none; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>🔥 PROMOTION EXCEPTIONNELLE !</h2>
                    </div>
                    <div class="content">
                        <span class="promo-badge">-%s%%</span>
                        <h3>%s</h3>
                        <p class="old-price">Ancien prix: %s FCFA</p>
                        <p class="new-price">Nouveau prix: %s FCFA</p>
                        <p>Économisez %s FCFA !</p>
                        <a href="https://votre-site.com/promotions" class="cta-button">
                            Profiter de l'offre
                        </a>
                        <p><small>Cette offre est réservée aux abonnés du catalogue.</small></p>
                    </div>
                </div>
            </body>
            </html>
            """, discount, vehicleName, oldPrice, newPrice, (oldPrice - newPrice));
    }
    
    @Override
    public String getObserverName() {
        return "ClientSubscriptionObserver";
    }
    
    @Override
    public boolean isActive() {
        return active;
    }
    
    @Override
    public void setActive(boolean active) {
        this.active = active;
        log.info("ClientSubscriptionObserver {}", active ? "activé" : "désactivé");
    }
}