package com.example.drive_deal.service;

import com.example.drive_deal.domain.observer.CatalogEvent;
import com.example.drive_deal.domain.observer.CatalogSubject;
import com.example.drive_deal.domain.observer.EventType;
import com.example.drive_deal.domain.subscription.SubscriptionManager;
import com.example.drive_deal.domain.subscription.SubscriptionType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class CatalogEventService {

    @Autowired
    private CatalogSubject catalogSubject;
    
    @Autowired
    private SubscriptionManager subscriptionManager;
    
    @Value("${app.notification.email.enabled:true}")
    private boolean emailNotificationsEnabled;
    
    @Value("${app.notification.threshold.price-drop:5.0}")
    private double priceDropThreshold;
    
    // Cache pour les événements récents (optionnel)
    private final Map<String, CatalogEvent> recentEvents = new ConcurrentHashMap<>();
    private final List<CatalogEvent> eventHistory = Collections.synchronizedList(new ArrayList<>());
    
    /**
     * Événement: Nouveau véhicule ajouté au catalogue
     */
    public void publishVehicleAdded(Long vehicleId, String vehicleName, 
                                   String vehicleType, Double price) {
        publishVehicleAdded(vehicleId, vehicleName, vehicleType, price, null, null);
    }
    
    public void publishVehicleAdded(Long vehicleId, String vehicleName, 
                                   String vehicleType, Double price, 
                                   String brand, String description) {
        Map<String, Object> data = new HashMap<>();
        data.put("vehicleId", vehicleId);
        data.put("vehicleName", vehicleName);
        data.put("vehicleType", vehicleType);
        data.put("price", price);
        data.put("brand", brand != null ? brand : "Non spécifié");
        data.put("description", description != null ? description : "");
        data.put("addedAt", LocalDateTime.now());
        data.put("eventId", generateEventId("VEHICLE", vehicleId));
        
        CatalogEvent event = new CatalogEvent(
            EventType.VEHICLE_ADDED,
            "Nouveau véhicule ajouté: " + vehicleName,
            data
        );
        
        // Vérifier si des clients sont abonnés
        checkSubscribersAndNotify(event);
        
        // Notifier tous les observateurs
        catalogSubject.notifyObservers(event);
        
        // Enregistrer l'événement
        recordEvent(event);
        
        log.info("🚗 Événement publié: VEHICLE_ADDED - {} (ID: {}, Prix: {}€)", 
                vehicleName, vehicleId, price);
    }
    
    /**
     * Événement: Véhicule mis en promotion
     */
    public void publishVehicleOnSale(Long vehicleId, String vehicleName, 
                                    Double oldPrice, Double newPrice, Double discount) {
        publishVehicleOnSale(vehicleId, vehicleName, oldPrice, newPrice, discount, null, null, null);
    }
    
    public void publishVehicleOnSale(Long vehicleId, String vehicleName, 
                                    Double oldPrice, Double newPrice, Double discount,
                                    String vehicleType, String brand, String promotionName) {
        
        Map<String, Object> data = new HashMap<>();
        data.put("vehicleId", vehicleId);
        data.put("vehicleName", vehicleName);
        data.put("oldPrice", oldPrice);
        data.put("newPrice", newPrice);
        data.put("discount", discount);
        data.put("savings", oldPrice - newPrice);
        data.put("discountPercentage", String.format("%.1f%%", discount));
        data.put("vehicleType", vehicleType != null ? vehicleType : "Non spécifié");
        data.put("brand", brand != null ? brand : "Non spécifié");
        data.put("promotionName", promotionName != null ? promotionName : "Promotion");
        data.put("saleStart", LocalDateTime.now());
        data.put("eventId", generateEventId("PROMO", vehicleId));
        
        CatalogEvent event = new CatalogEvent(
            EventType.VEHICLE_ON_SALE,
            "Véhicule en promotion: " + vehicleName + " (-" + String.format("%.1f", discount) + "%)",
            data
        );
        
        // Vérifier si des clients sont abonnés
        checkSubscribersAndNotify(event);
        
        // Notifier tous les observateurs
        catalogSubject.notifyObservers(event);
        
        // Enregistrer l'événement
        recordEvent(event);
        
        log.info("🔥 Événement publié: VEHICLE_ON_SALE - {} (ID: {}, Ancien: {}€, Nouveau: {}€, Réduction: {}%)", 
                vehicleName, vehicleId, oldPrice, newPrice, discount);
    }
    
    /**
     * Événement: Changement de prix d'un véhicule
     */
    public void publishVehiclePriceChanged(Long vehicleId, String vehicleName, 
                                          Double oldPrice, Double newPrice, 
                                          String vehicleType, String brand) {
        
        Map<String, Object> data = new HashMap<>();
        data.put("vehicleId", vehicleId);
        data.put("vehicleName", vehicleName);
        data.put("oldPrice", oldPrice);
        data.put("newPrice", newPrice);
        data.put("priceDifference", newPrice - oldPrice);
        data.put("priceChangePercentage", ((newPrice - oldPrice) / oldPrice) * 100);
        data.put("vehicleType", vehicleType != null ? vehicleType : "Non spécifié");
        data.put("brand", brand != null ? brand : "Non spécifié");
        data.put("changeDate", LocalDateTime.now());
        data.put("eventId", generateEventId("PRICE", vehicleId));
        
        CatalogEvent event = new CatalogEvent(
            EventType.VEHICLE_PRICE_CHANGED,
            "Prix modifié: " + vehicleName + " (" + oldPrice + "€ → " + newPrice + "€)",
            data
        );
        
        // Vérifier si c'est une baisse de prix significative
        if (oldPrice > newPrice) {
            double dropPercentage = ((oldPrice - newPrice) / oldPrice) * 100;
            if (dropPercentage >= priceDropThreshold) {
                // C'est aussi une promotion
                publishVehicleOnSale(vehicleId, vehicleName, oldPrice, newPrice, 
                                   dropPercentage, vehicleType, brand, "Baisse de prix");
            }
        }
        
        // Notifier tous les observateurs
        catalogSubject.notifyObservers(event);
        
        // Enregistrer l'événement
        recordEvent(event);
        
        log.info("💰 Événement publié: VEHICLE_PRICE_CHANGED - {} (ID: {}, {}€ → {}€)", 
                vehicleName, vehicleId, oldPrice, newPrice);
    }
    
    /**
     * Événement: Mise à jour du stock
     */
    public void publishStockUpdated(Long vehicleId, String vehicleName, 
                                   Integer oldStock, Integer newStock, 
                                   String vehicleType, Double price) {
        
        Map<String, Object> data = new HashMap<>();
        data.put("vehicleId", vehicleId);
        data.put("vehicleName", vehicleName);
        data.put("oldStock", oldStock);
        data.put("newStock", newStock);
        data.put("stockChange", newStock - oldStock);
        data.put("vehicleType", vehicleType != null ? vehicleType : "Non spécifié");
        data.put("price", price);
        data.put("updateDate", LocalDateTime.now());
        data.put("eventId", generateEventId("STOCK", vehicleId));
        
        CatalogEvent event = new CatalogEvent(
            EventType.VEHICLE_STOCK_UPDATED,
            "Stock mis à jour: " + vehicleName + " (" + oldStock + " → " + newStock + " unités)",
            data
        );
        
        // Notifier tous les observateurs
        catalogSubject.notifyObservers(event);
        
        // Enregistrer l'événement
        recordEvent(event);
        
        log.info("📦 Événement publié: VEHICLE_STOCK_UPDATED - {} (ID: {}, Stock: {} → {})", 
                vehicleName, vehicleId, oldStock, newStock);
    }
    
    /**
     * Événement: Nouvelle commande créée
     */
    public void publishOrderCreated(Long orderId, String customerEmail, 
                                   Double totalAmount, String vehicleName) {
        publishOrderCreated(orderId, customerEmail, totalAmount, vehicleName, null);
    }
    
    public void publishOrderCreated(Long orderId, String customerEmail, 
                                   Double totalAmount, String vehicleName, 
                                   Map<String, Object> additionalData) {
        
        Map<String, Object> data = new HashMap<>();
        data.put("orderId", orderId);
        data.put("orderNumber", "CMD-" + orderId);
        data.put("customerEmail", customerEmail);
        data.put("totalAmount", totalAmount);
        data.put("vehicleName", vehicleName);
        data.put("orderDate", LocalDateTime.now());
        data.put("status", "CREATED");
        data.put("eventId", generateEventId("ORDER", orderId));
        
        if (additionalData != null) {
            data.putAll(additionalData);
        }
        
        CatalogEvent event = new CatalogEvent(
            EventType.ORDER_CREATED,
            "Nouvelle commande créée: #" + orderId,
            data
        );
        
        // Notifier tous les observateurs
        catalogSubject.notifyObservers(event);
        
        // Enregistrer l'événement
        recordEvent(event);
        
        log.info("✅ Événement publié: ORDER_CREATED - #{} (Client: {}, Montant: {}€)", 
                orderId, customerEmail, totalAmount);
    }
    
    /**
     * Événement: Statut de commande changé
     */
    public void publishOrderStatusChanged(Long orderId, String oldStatus, 
                                         String newStatus, String customerEmail) {
        
        Map<String, Object> data = new HashMap<>();
        data.put("orderId", orderId);
        data.put("orderNumber", "CMD-" + orderId);
        data.put("oldStatus", oldStatus);
        data.put("newStatus", newStatus);
        data.put("customerEmail", customerEmail);
        data.put("changeDate", LocalDateTime.now());
        data.put("eventId", generateEventId("ORDER_STATUS", orderId));
        
        CatalogEvent event = new CatalogEvent(
            EventType.ORDER_STATUS_CHANGED,
            "Statut de commande modifié: #" + orderId + " (" + oldStatus + " → " + newStatus + ")",
            data
        );
        
        // Notifier tous les observateurs
        catalogSubject.notifyObservers(event);
        
        // Enregistrer l'événement
        recordEvent(event);
        
        log.info("🔄 Événement publié: ORDER_STATUS_CHANGED - #{} ({} → {})", 
                orderId, oldStatus, newStatus);
    }
    
    /**
     * Événement: Commande livrée
     */
    public void publishOrderDelivered(Long orderId, String customerName, 
                                     String deliveryAddress) {
        publishOrderDelivered(orderId, customerName, deliveryAddress, null);
    }
    
    public void publishOrderDelivered(Long orderId, String customerName, 
                                     String deliveryAddress, Map<String, Object> additionalData) {
        
        Map<String, Object> data = new HashMap<>();
        data.put("orderId", orderId);
        data.put("orderNumber", "CMD-" + orderId);
        data.put("customerName", customerName);
        data.put("deliveryAddress", deliveryAddress);
        data.put("deliveryDate", LocalDateTime.now());
        data.put("status", "DELIVERED");
        data.put("eventId", generateEventId("DELIVERY", orderId));
        
        if (additionalData != null) {
            data.putAll(additionalData);
        }
        
        CatalogEvent event = new CatalogEvent(
            EventType.ORDER_DELIVERED,
            "Commande livrée: #" + orderId,
            data
        );
        
        // Notifier tous les observateurs
        catalogSubject.notifyObservers(event);
        
        // Enregistrer l'événement
        recordEvent(event);
        
        log.info("📦 Événement publié: ORDER_DELIVERED - #{} (Client: {})", 
                orderId, customerName);
    }
    
    /**
     * Événement: Nouveau client inscrit
     */
    public void publishClientRegistered(Long clientId, String clientName, 
                                       String clientEmail, String clientType) {
        
        Map<String, Object> data = new HashMap<>();
        data.put("clientId", clientId);
        data.put("clientName", clientName);
        data.put("clientEmail", clientEmail);
        data.put("clientType", clientType);
        data.put("registrationDate", LocalDateTime.now());
        data.put("eventId", generateEventId("CLIENT", clientId));
        
        CatalogEvent event = new CatalogEvent(
            EventType.CLIENT_REGISTERED,
            "Nouveau client: " + clientName,
            data
        );
        
        // Notifier tous les observateurs
        catalogSubject.notifyObservers(event);
        
        // Enregistrer l'événement
        recordEvent(event);
        
        log.info("👤 Événement publié: CLIENT_REGISTERED - {} (ID: {}, Email: {})", 
                clientName, clientId, clientEmail);
    }
    
    /**
     * Événement: Mise à jour du catalogue
     */
    public void publishCatalogUpdated(String updateType, String description, 
                                     int vehicleCount, String updatedBy) {
        
        Map<String, Object> data = new HashMap<>();
        data.put("updateType", updateType);
        data.put("description", description);
        data.put("vehicleCount", vehicleCount);
        data.put("updatedBy", updatedBy);
        data.put("updateDate", LocalDateTime.now());
        data.put("eventId", generateEventId("CATALOG", System.currentTimeMillis()));
        
        CatalogEvent event = new CatalogEvent(
            EventType.CATALOG_UPDATED,
            "Catalogue mis à jour: " + description,
            data
        );
        
        // Vérifier si des clients sont abonnés
        checkSubscribersAndNotify(event);
        
        // Notifier tous les observateurs
        catalogSubject.notifyObservers(event);
        
        // Enregistrer l'événement
        recordEvent(event);
        
        log.info("📚 Événement publié: CATALOG_UPDATED - {} ({} véhicules)", 
                updateType, vehicleCount);
    }
    
    /**
     * Événement: Offre spéciale ajoutée
     */
    public void publishSpecialOfferAdded(String offerName, String description, 
                                        Double discount, LocalDateTime validUntil) {
        
        Map<String, Object> data = new HashMap<>();
        data.put("offerName", offerName);
        data.put("description", description);
        data.put("discount", discount);
        data.put("validUntil", validUntil);
        data.put("addedDate", LocalDateTime.now());
        data.put("eventId", generateEventId("OFFER", System.currentTimeMillis()));
        
        CatalogEvent event = new CatalogEvent(
            EventType.SPECIAL_OFFER_ADDED,
            "Nouvelle offre spéciale: " + offerName,
            data
        );
        
        // Vérifier si des clients sont abonnés
        checkSubscribersAndNotify(event);
        
        // Notifier tous les observateurs
        catalogSubject.notifyObservers(event);
        
        // Enregistrer l'événement
        recordEvent(event);
        
        log.info("🎁 Événement publié: SPECIAL_OFFER_ADDED - {} (Réduction: {}%)", 
                offerName, discount);
    }
    
    /**
     * Événement: Erreur système
     */
    public void publishSystemError(String errorCode, String errorMessage, 
                                  String component) {
        
        Map<String, Object> data = new HashMap<>();
        data.put("errorCode", errorCode);
        data.put("errorMessage", errorMessage);
        data.put("component", component);
        data.put("errorTime", LocalDateTime.now());
        data.put("severity", "ERROR");
        data.put("eventId", generateEventId("ERROR", System.currentTimeMillis()));
        
        CatalogEvent event = new CatalogEvent(
            EventType.SYSTEM_ERROR,
            "Erreur système: " + errorCode,
            data
        );
        
        // Notifier tous les observateurs
        catalogSubject.notifyObservers(event);
        
        // Enregistrer l'événement
        recordEvent(event);
        
        log.error("❌ Événement publié: SYSTEM_ERROR - {}: {} (Composant: {})", 
                errorCode, errorMessage, component);
    }
    
    /**
     * Événement générique
     */
    public void publishEvent(EventType eventType, String message, Map<String, Object> data) {
        if (data == null) {
            data = new HashMap<>();
        }
        
        data.put("eventTime", LocalDateTime.now());
        data.put("eventId", generateEventId("CUSTOM", System.currentTimeMillis()));
        
        CatalogEvent event = new CatalogEvent(eventType, message, data);
        
        // Pour certains types d'événements, vérifier les abonnements
        if (shouldCheckSubscribers(eventType)) {
            checkSubscribersAndNotify(event);
        }
        
        // Notifier tous les observateurs
        catalogSubject.notifyObservers(event);
        
        // Enregistrer l'événement
        recordEvent(event);
        
        log.info("📝 Événement publié: {} - {}", eventType, message);
    }
    
    /**
     * Publier plusieurs événements de véhicule
     */
    public void publishBatchVehicleEvents(List<Map<String, Object>> vehicles) {
        if (vehicles == null || vehicles.isEmpty()) {
            log.warn("Aucun véhicule à publier en batch");
            return;
        }
        
        log.info("Début publication batch de {} véhicules", vehicles.size());
        
        for (Map<String, Object> vehicle : vehicles) {
            try {
                Long vehicleId = (Long) vehicle.get("id");
                String vehicleName = (String) vehicle.get("name");
                String vehicleType = (String) vehicle.get("type");
                Double price = (Double) vehicle.get("price");
                String brand = (String) vehicle.get("brand");
                
                publishVehicleAdded(vehicleId, vehicleName, vehicleType, price, brand, null);
                
            } catch (Exception e) {
                log.error("Erreur publication véhicule batch: {}", e.getMessage(), e);
            }
        }
        
        log.info("✅ Publication batch terminée: {} véhicules publiés", vehicles.size());
    }
    
    /**
     * Vérifier les abonnés et notifier (pour ClientSubscriptionObserver)
     */
    private void checkSubscribersAndNotify(CatalogEvent event) {
        if (!emailNotificationsEnabled) {
            return;
        }
        
        try {
            // Cette méthode est appelée par les observateurs, pas besoin de dupliquer
            // La logique de notification aux abonnés est gérée par ClientSubscriptionObserver
            log.debug("Vérification abonnés pour événement: {}", event.getType());
            
        } catch (Exception e) {
            log.error("Erreur vérification abonnés: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Obtenir les statistiques des observateurs
     */
    public Map<String, Object> getObserverStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Nombre total d'observateurs
        stats.put("totalObservers", catalogSubject.getObserverCount());
        
        // Liste des observateurs avec leur statut
        List<Map<String, Object>> observers = new ArrayList<>();
        catalogSubject.getObservers().forEach(observer -> {
            Map<String, Object> obsInfo = new HashMap<>();
            obsInfo.put("name", observer.getObserverName());
            obsInfo.put("active", observer.isActive());
            obsInfo.put("type", observer.getClass().getSimpleName());
            observers.add(obsInfo);
        });
        
        stats.put("observers", observers);
        
        // Statistiques des événements
        stats.put("totalEventsPublished", eventHistory.size());
        stats.put("recentEventsCount", recentEvents.size());
        
        // Comptage par type d'événement
        Map<String, Long> eventsByType = new HashMap<>();
        eventHistory.forEach(event -> {
            String type = event.getType().name();
            eventsByType.put(type, eventsByType.getOrDefault(type, 0L) + 1);
        });
        
        stats.put("eventsByType", eventsByType);
        
        // Dernier événement
        if (!eventHistory.isEmpty()) {
            CatalogEvent lastEvent = eventHistory.get(eventHistory.size() - 1);
            stats.put("lastEvent", Map.of(
                "type", lastEvent.getType().name(),
                "message", lastEvent.getMessage(),
                "timestamp", lastEvent.getTimestamp()
            ));
        }
        
        return stats;
    }
    
    /**
     * Obtenir l'historique des événements
     */
    public List<CatalogEvent> getEventHistory(int limit) {
        synchronized (eventHistory) {
            int start = Math.max(0, eventHistory.size() - limit);
            return new ArrayList<>(eventHistory.subList(start, eventHistory.size()));
        }
    }
    
    /**
     * Obtenir les événements récents
     */
    public Collection<CatalogEvent> getRecentEvents() {
        return recentEvents.values();
    }
    
    /**
     * Effacer le cache des événements récents
     */
    public void clearRecentEvents() {
        recentEvents.clear();
        log.info("Cache des événements récents effacé");
    }
    
    /**
     * Vérifier si un observateur spécifique est actif
     */
    public boolean isObserverActive(String observerName) {
        return catalogSubject.getObservers().stream()
            .anyMatch(observer -> observer.getObserverName().equals(observerName));
    }
    
    /**
     * Activer/désactiver un observateur par nom
     */
    public boolean toggleObserver(String observerName, boolean active) {
        return catalogSubject.getObservers().stream()
            .filter(observer -> observer.getObserverName().equals(observerName))
            .findFirst()
            .map(observer -> {
                observer.setActive(active);
                log.info("Observateur {} {}", observerName, active ? "activé" : "désactivé");
                return true;
            })
            .orElse(false);
    }
    
    /**
     * Générer un ID d'événement unique
     */
    private String generateEventId(String prefix, Object identifier) {
        return prefix + "_" + identifier + "_" + System.currentTimeMillis();
    }
    
    /**
     * Enregistrer un événement dans l'historique
     */
    private void recordEvent(CatalogEvent event) {
        // Ajouter à l'historique
        eventHistory.add(event);
        
        // Garder l'historique à une taille raisonnable
        if (eventHistory.size() > 1000) {
            synchronized (eventHistory) {
                if (eventHistory.size() > 1000) {
                    eventHistory.subList(0, 100).clear(); // Supprimer les 100 plus anciens
                }
            }
        }
        
        // Mettre en cache comme événement récent
        String eventKey = event.getType().name() + "_" + event.getTimestamp();
        recentEvents.put(eventKey, event);
        
        // Nettoyer les événements trop anciens du cache (plus de 24h)
        cleanupOldEvents();
    }
    
    /**
     * Nettoyer les événements anciens du cache
     */
    private void cleanupOldEvents() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(24);
        recentEvents.entrySet().removeIf(entry -> 
            entry.getValue().getTimestamp().isBefore(cutoff)
        );
    }
    
    /**
     * Déterminer si un type d'événement doit vérifier les abonnés
     */
    private boolean shouldCheckSubscribers(EventType eventType) {
        return eventType == EventType.VEHICLE_ADDED ||
               eventType == EventType.VEHICLE_ON_SALE ||
               eventType == EventType.SPECIAL_OFFER_ADDED ||
               eventType == EventType.CATALOG_UPDATED;
    }
    
    /**
     * Récupérer les abonnés pour un type d'événement (pour tests)
     */
    public int getSubscriberCountForEvent(EventType eventType) {
        try {
            // Utiliser le SubscriptionManager pour récupérer le nombre d'abonnés
            // Cette méthode nécessite que SubscriptionManager ait une méthode pour cela
            // Pour l'instant, retourner une valeur par défaut
            switch (eventType) {
                case VEHICLE_ADDED:
                    return subscriptionManager.getSubscribersForEvent(eventType).size();
                case VEHICLE_ON_SALE:
                    return subscriptionManager.getSubscribersForEvent(eventType).size();
                default:
                    return 0;
            }
        } catch (Exception e) {
            log.error("Erreur récupération abonnés: {}", e.getMessage());
            return 0;
        }
    }
    
    /**
     * Tester le système d'événements
     */
    public Map<String, Object> runSystemTest() {
        Map<String, Object> testResults = new HashMap<>();
        List<Map<String, Object>> tests = new ArrayList<>();
        
        try {
            // Test 1: Vérifier que le sujet est configuré
            tests.add(Map.of(
                "test", "CatalogSubject Initialization",
                "status", catalogSubject != null ? "PASS" : "FAIL",
                "observerCount", catalogSubject != null ? catalogSubject.getObserverCount() : 0
            ));
            
            // Test 2: Publier un événement test
            try {
                publishTestEvent();
                tests.add(Map.of(
                    "test", "Event Publishing",
                    "status", "PASS",
                    "message", "Événement test publié avec succès"
                ));
            } catch (Exception e) {
                tests.add(Map.of(
                    "test", "Event Publishing",
                    "status", "FAIL",
                    "error", e.getMessage()
                ));
            }
            
            // Test 3: Vérifier l'historique
            tests.add(Map.of(
                "test", "Event History",
                "status", !eventHistory.isEmpty() ? "PASS" : "WARNING",
                "eventCount", eventHistory.size()
            ));
            
            // Test 4: Vérifier les observateurs
            List<String> activeObservers = catalogSubject.getObservers().stream()
                .filter(observer -> observer.isActive())
                .map(observer -> observer.getObserverName())
                .toList();
            
            tests.add(Map.of(
                "test", "Active Observers",
                "status", !activeObservers.isEmpty() ? "PASS" : "WARNING",
                "count", activeObservers.size(),
                "observers", activeObservers
            ));
            
            testResults.put("success", true);
            testResults.put("tests", tests);
            testResults.put("totalTests", tests.size());
            testResults.put("passedTests", tests.stream().filter(t -> "PASS".equals(t.get("status"))).count());
            testResults.put("timestamp", LocalDateTime.now());
            
        } catch (Exception e) {
            testResults.put("success", false);
            testResults.put("error", e.getMessage());
            testResults.put("tests", tests);
        }
        
        return testResults;
    }
    
    /**
     * Publier un événement de test
     */
    private void publishTestEvent() {
        Map<String, Object> testData = new HashMap<>();
        testData.put("test", true);
        testData.put("purpose", "System validation");
        testData.put("version", "1.0");
        
        CatalogEvent testEvent = new CatalogEvent(
            EventType.CATALOG_UPDATED,
            "Test système du pattern Observer",
            testData
        );
        
        catalogSubject.notifyObservers(testEvent);
    }
}