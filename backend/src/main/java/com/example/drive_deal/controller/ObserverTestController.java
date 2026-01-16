package com.example.drive_deal.controller;

import com.example.drive_deal.domain.observer.EventType;
import com.example.drive_deal.service.CatalogEventService;
import com.example.drive_deal.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/observer")
public class ObserverTestController {

    @Autowired
    private CatalogEventService catalogEventService;
    
    @Autowired
    private NotificationService notificationService;
    
    /**
     * Test 1: Vérifier la connexion SMTP
     */
    @GetMapping("/smtp-test")
    public ResponseEntity<?> testSmtpConnection() {
        try {
            boolean connected = notificationService.testSmtpConnection();
            String info = notificationService.getSmtpInfo();
            
            return ResponseEntity.ok(Map.of(
                "success", connected,
                "connected", connected,
                "smtpInfo", info,
                "message", connected ? "Connexion SMTP OK" : "Échec de connexion SMTP",
                "timestamp", LocalDateTime.now()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Erreur lors du test SMTP: " + e.getMessage(),
                "timestamp", LocalDateTime.now()
            ));
        }
    }
    
    /**
     * Test 2: Envoyer un email de test
     */
    @PostMapping("/test-email")
    public ResponseEntity<?> sendTestEmail(@RequestBody Map<String, String> request) {
        try {
            String to = request.getOrDefault("to", "admin@drive-deal.com");
            String subject = request.getOrDefault("subject", "Test Email - Observer Pattern");
            String body = request.getOrDefault("body", 
                """
                <h1>Test du Pattern Observer</h1>
                <p>Cet email prouve que le système d'observateurs fonctionne correctement.</p>
                <ul>
                    <li>✅ Observateur Email: Opérationnel</li>
                    <li>✅ Observateur Logging: Opérationnel</li>
                    <li>✅ Observateur Abonnements: Opérationnel</li>
                </ul>
                <p><strong>DriveDeal - Système de vente de véhicules</strong></p>
                """
            );
            
            boolean sent = notificationService.sendEmail(to, subject, body, true);
            
            return ResponseEntity.ok(Map.of(
                "success", sent,
                "message", sent ? "Email de test envoyé avec succès à " + to : "Échec d'envoi d'email",
                "recipient", to,
                "subject", subject,
                "timestamp", LocalDateTime.now()
            ));
        } catch (Exception e) {
            log.error("Erreur envoi email test: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Erreur serveur: " + e.getMessage(),
                "timestamp", LocalDateTime.now()
            ));
        }
    }
    
    /**
     * Test 3: Déclencher événement Nouveau Véhicule
     */
    @PostMapping("/trigger/vehicle-added")
    public ResponseEntity<?> triggerVehicleAdded() {
        try {
            // Données de test pour un nouveau véhicule
            catalogEventService.publishVehicleAdded(
                1001L,
                "Tesla Model 3 Performance",
                "ELECTRIC_CAR",
                59990.0
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "event", "VEHICLE_ADDED",
                "vehicle", "Tesla Model 3 Performance",
                "price", "59990 €",
                "message", "Événement VEHICLE_ADDED déclenché avec succès",
                "timestamp", LocalDateTime.now(),
                "expectedResult", "Les observateurs Email, Logging et Abonnements seront notifiés"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Erreur lors du déclenchement: " + e.getMessage(),
                "timestamp", LocalDateTime.now()
            ));
        }
    }
    
    /**
     * Test 4: Déclencher événement Promotion
     */
    @PostMapping("/trigger/vehicle-promotion")
    public ResponseEntity<?> triggerVehiclePromotion() {
        try {
            // Données de test pour une promotion
            catalogEventService.publishVehicleOnSale(
                1002L,
                "BMW X5 xDrive40i",
                78900.0,
                69990.0,
                11.3
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "event", "VEHICLE_ON_SALE",
                "vehicle", "BMW X5 xDrive40i",
                "oldPrice", "78900 €",
                "newPrice", "69990 €",
                "discount", "11.3%",
                "savings", "8910 €",
                "message", "Événement VEHICLE_ON_SALE déclenché avec succès",
                "timestamp", LocalDateTime.now(),
                "expectedResult", "Les clients abonnés aux PROMOTIONS recevront un email"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Erreur lors du déclenchement: " + e.getMessage(),
                "timestamp", LocalDateTime.now()
            ));
        }
    }
    
    /**
     * Test 5: Déclencher événement Nouvelle Commande
     */
    @PostMapping("/trigger/order-created")
    public ResponseEntity<?> triggerOrderCreated() {
        try {
            // Données de test pour une nouvelle commande
            catalogEventService.publishOrderCreated(
                5001L,
                "client.fidele@email.com",
                59990.0,
                "Tesla Model 3 Performance"
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "event", "ORDER_CREATED",
                "orderId", 5001,
                "customer", "client.fidele@email.com",
                "amount", "59990 €",
                "vehicle", "Tesla Model 3 Performance",
                "message", "Événement ORDER_CREATED déclenché avec succès",
                "timestamp", LocalDateTime.now(),
                "expectedResult", "Les observateurs Email et Logging seront notifiés"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Erreur lors du déclenchement: " + e.getMessage(),
                "timestamp", LocalDateTime.now()
            ));
        }
    }
    
    /**
     * Test 6: Déclencher événement Client Inscrit
     */
    @PostMapping("/trigger/client-registered")
    public ResponseEntity<?> triggerClientRegistered() {
        try {
            // Données de test pour un nouveau client
            catalogEventService.publishClientRegistered(
                100L,
                "Nouveau Client Test",
                "nouveau.client@test.com",
                "INDIVIDUAL"
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "event", "CLIENT_REGISTERED",
                "clientId", 100,
                "clientName", "Nouveau Client Test",
                "clientEmail", "nouveau.client@test.com",
                "clientType", "INDIVIDUAL",
                "message", "Événement CLIENT_REGISTERED déclenché avec succès",
                "timestamp", LocalDateTime.now(),
                "expectedResult", "Les administrateurs recevront une notification email"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Erreur lors du déclenchement: " + e.getMessage(),
                "timestamp", LocalDateTime.now()
            ));
        }
    }
    
    /**
     * Test 7: Événement personnalisé
     */
    @PostMapping("/trigger/custom-event")
    public ResponseEntity<?> triggerCustomEvent(@RequestBody Map<String, Object> request) {
        try {
            String eventTypeStr = (String) request.get("eventType");
            String message = (String) request.get("message");
            Map<String, Object> data = (Map<String, Object>) request.getOrDefault("data", new HashMap<>());
            
            EventType eventType = EventType.valueOf(eventTypeStr.toUpperCase());
            catalogEventService.publishEvent(eventType, message, data);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "event", eventType.name(),
                "message", message,
                "data", data,
                "timestamp", LocalDateTime.now(),
                "observerCount", catalogEventService.getObserverStats().get("totalObservers")
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "Type d'événement invalide. Types disponibles: " + String.join(", ", 
                    java.util.Arrays.stream(EventType.values()).map(Enum::name).toArray(String[]::new)),
                "timestamp", LocalDateTime.now()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Erreur serveur: " + e.getMessage(),
                "timestamp", LocalDateTime.now()
            ));
        }
    }
    
    /**
     * Test 8: Simuler une erreur système
     */
    @PostMapping("/trigger/system-error")
    public ResponseEntity<?> triggerSystemError(@RequestBody(required = false) Map<String, String> request) {
        try {
            String errorCode = request != null ? request.getOrDefault("errorCode", "ERR-500") : "ERR-500";
            String errorMessage = request != null ? request.getOrDefault("errorMessage", 
                "Erreur système simulée pour test du pattern Observer") : 
                "Erreur système simulée pour test du pattern Observer";
            String component = request != null ? request.getOrDefault("component", "ObserverTestController") : 
                "ObserverTestController";
            
            catalogEventService.publishSystemError(errorCode, errorMessage, component);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "event", "SYSTEM_ERROR",
                "errorCode", errorCode,
                "errorMessage", errorMessage,
                "component", component,
                "message", "Événement SYSTEM_ERROR déclenché avec succès",
                "timestamp", LocalDateTime.now(),
                "expectedResult", "Les observateurs Logging et Email (administrateurs) seront notifiés"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Erreur lors du déclenchement: " + e.getMessage(),
                "timestamp", LocalDateTime.now()
            ));
        }
    }
    
    /**
     * Test 9: Obtenir les statistiques des observateurs
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getObserverStats() {
        try {
            Map<String, Object> stats = catalogEventService.getObserverStats();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "stats", stats,
                "timestamp", LocalDateTime.now(),
                "message", "Statistiques des observateurs récupérées avec succès"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Erreur serveur: " + e.getMessage(),
                "timestamp", LocalDateTime.now()
            ));
        }
    }
    
    /**
     * Test 10: Tester tous les observateurs en une seule requête
     */
    @PostMapping("/test-all")
    public ResponseEntity<?> testAllObservers() {
        Map<String, Object> results = new HashMap<>();
        results.put("timestamp", LocalDateTime.now());
        results.put("tests", new HashMap<>());
        
        try {
            // Test 1: SMTP Connection
            boolean smtpConnected = notificationService.testSmtpConnection();
            ((Map<String, Object>) results.get("tests")).put("smtpConnection", Map.of(
                "success", smtpConnected,
                "message", smtpConnected ? "SMTP connecté" : "SMTP non connecté"
            ));
            
            // Test 2: Trigger VEHICLE_ADDED
            catalogEventService.publishVehicleAdded(
                9999L,
                "Vehicle Test All",
                "TEST_VEHICLE",
                99999.0
            );
            ((Map<String, Object>) results.get("tests")).put("vehicleAdded", Map.of(
                "success", true,
                "message", "Événement VEHICLE_ADDED déclenché"
            ));
            
            // Test 3: Trigger VEHICLE_ON_SALE
            catalogEventService.publishVehicleOnSale(
                9998L,
                "Promotion Test",
                100000.0,
                85000.0,
                15.0
            );
            ((Map<String, Object>) results.get("tests")).put("vehicleOnSale", Map.of(
                "success", true,
                "message", "Événement VEHICLE_ON_SALE déclenché"
            ));
            
            // Test 4: Trigger ORDER_CREATED
            catalogEventService.publishOrderCreated(
                9999L,
                "test.all@email.com",
                85000.0,
                "Promotion Test"
            );
            ((Map<String, Object>) results.get("tests")).put("orderCreated", Map.of(
                "success", true,
                "message", "Événement ORDER_CREATED déclenché"
            ));
            
            // Test 5: Get Stats
            Map<String, Object> stats = catalogEventService.getObserverStats();
            ((Map<String, Object>) results.get("tests")).put("observerStats", Map.of(
                "success", true,
                "totalObservers", stats.get("totalObservers"),
                "message", "Statistiques récupérées"
            ));
            
            results.put("success", true);
            results.put("message", "Tous les tests du pattern Observer ont été exécutés");
            results.put("totalTests", 5);
            
            return ResponseEntity.ok(results);
            
        } catch (Exception e) {
            results.put("success", false);
            results.put("error", "Erreur lors des tests: " + e.getMessage());
            return ResponseEntity.internalServerError().body(results);
        }
    }
    
    /**
     * Test 11: Liste de tous les types d'événements
     */
    @GetMapping("/event-types")
    public ResponseEntity<?> getAllEventTypes() {
        EventType[] types = EventType.values();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("eventTypes", java.util.Arrays.stream(types)
            .map(type -> Map.of(
                "name", type.name(),
                "description", getEventTypeDescription(type)
            ))
            .toArray());
        response.put("count", types.length);
        response.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }
    
    private String getEventTypeDescription(EventType type) {
        switch (type) {
            case VEHICLE_ADDED:
                return "Nouveau véhicule ajouté au catalogue";
            case VEHICLE_ON_SALE:
                return "Véhicule mis en promotion";
            case ORDER_CREATED:
                return "Nouvelle commande créée";
            case CLIENT_REGISTERED:
                return "Nouveau client inscrit";
            case SYSTEM_ERROR:
                return "Erreur système détectée";
            case VEHICLE_PRICE_CHANGED:
                return "Changement de prix d'un véhicule";
            case ORDER_DELIVERED:
                return "Commande livrée";
            case CATALOG_UPDATED:
                return "Catalogue mis à jour";
            default:
                return "Événement système";
        }
    }
    
    /**
     * Test 12: Vérifier la santé du système Observer
     */
    @GetMapping("/health")
    public ResponseEntity<?> getObserverHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("timestamp", LocalDateTime.now());
        
        try {
            // Test SMTP
            boolean smtpOk = notificationService.testSmtpConnection();
            
            // Récupérer les stats
            Map<String, Object> stats = catalogEventService.getObserverStats();
            int observerCount = (int) stats.get("totalObservers");
            
            health.put("status", "HEALTHY");
            health.put("smtp", smtpOk ? "CONNECTED" : "DISCONNECTED");
            health.put("observers", observerCount);
            health.put("observersActive", stats.get("observers"));
            health.put("message", "Système Observer opérationnel");
            health.put("success", true);
            
            return ResponseEntity.ok(health);
            
        } catch (Exception e) {
            health.put("status", "UNHEALTHY");
            health.put("error", e.getMessage());
            health.put("success", false);
            return ResponseEntity.internalServerError().body(health);
        }
    }
    
    /**
     * Test 13: Workflow complet d'abonnement + notification
     */
    @PostMapping("/workflow/test")
    public ResponseEntity<?> testSubscriptionWorkflow(@RequestBody Map<String, Object> request) {
        Map<String, Object> results = new HashMap<>();
        results.put("timestamp", LocalDateTime.now());
        results.put("steps", new java.util.ArrayList<Map<String, Object>>());
        
        try {
            String clientEmail = (String) request.getOrDefault("clientEmail", "test.workflow@email.com");
            String subscriptionType = (String) request.getOrDefault("subscriptionType", "NEW_VEHICLES");
            
            // Étape 1: Créer un événement client (simulé)
            ((java.util.List<Map<String, Object>>) results.get("steps")).add(Map.of(
                "step", "SIMULATE_CLIENT_REGISTRATION",
                "clientEmail", clientEmail,
                "status", "COMPLETED"
            ));
            
            // Étape 2: Déclencher événement nouveau véhicule
            catalogEventService.publishVehicleAdded(
                8888L,
                "Renault Zoe",
                "ELECTRIC_CAR",
                32000.0
            );
            
            ((java.util.List<Map<String, Object>>) results.get("steps")).add(Map.of(
                "step", "TRIGGER_VEHICLE_ADDED",
                "vehicle", "Renault Zoe",
                "type", "ELECTRIC_CAR",
                "status", "COMPLETED",
                "observersNotified", catalogEventService.getObserverStats().get("totalObservers")
            ));
            
            // Étape 3: Déclencher événement promotion
            catalogEventService.publishVehicleOnSale(
                8889L,
                "Peugeot 208",
                25000.0,
                22000.0,
                12.0
            );
            
            ((java.util.List<Map<String, Object>>) results.get("steps")).add(Map.of(
                "step", "TRIGGER_VEHICLE_PROMOTION",
                "vehicle", "Peugeot 208",
                "discount", "12%",
                "status", "COMPLETED"
            ));
            
            // Étape 4: Récupérer les statistiques finales
            Map<String, Object> finalStats = catalogEventService.getObserverStats();
            
            results.put("success", true);
            results.put("workflow", "SUBSCRIBER_NOTIFICATION");
            results.put("totalSteps", 3);
            results.put("finalStats", finalStats);
            results.put("message", "Workflow de test d'abonnement et notification complété avec succès");
            
            return ResponseEntity.ok(results);
            
        } catch (Exception e) {
            results.put("success", false);
            results.put("error", "Erreur dans le workflow: " + e.getMessage());
            return ResponseEntity.internalServerError().body(results);
        }
    }
}