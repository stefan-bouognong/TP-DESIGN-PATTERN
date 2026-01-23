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
     * Test 1: Vérifier la connexion SMTP (inchangé, pas de données statiques)
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
     * Test 2: Envoyer un email de test - dynamique
     */
    @PostMapping("/test-email")
    public ResponseEntity<?> sendTestEmail(@RequestBody Map<String, String> request) {
        try {
            String to = request.getOrDefault("to", "sandjonyves@gmail.com");
            String subject = request.getOrDefault("subject", "Test Email - Observer Pattern");
            String body = request.getOrDefault("body", """
                    <h1>Test du Pattern Observer</h1>
                    <p>Cet email prouve que le système d'observateurs fonctionne correctement.</p>
                    <ul>
                        <li>✅ Observateur Email: Opérationnel</li>
                        <li>✅ Observateur Logging: Opérationnel</li>
                        <li>✅ Observateur Abonnements: Opérationnel</li>
                    </ul>
                    <p><strong>DriveDeal - Système de vente de véhicules</strong></p>
                    """);

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
     * Test 3: Déclencher événement Nouveau Véhicule - dynamique
     */
    @PostMapping("/trigger/vehicle-added")
    public ResponseEntity<?> triggerVehicleAdded(@RequestBody Map<String, Object> payload) {
        try {
            Long vehicleId = getLong(payload, "vehicleId", 1001L);
            String name = (String) payload.getOrDefault("name", "Tesla Model 3 Performance");
            String type = (String) payload.getOrDefault("type", "ELECTRIC_CAR");
            Double price = getDouble(payload, "price", 59990.0);

            catalogEventService.publishVehicleAdded(vehicleId, name, type, price);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "event", "VEHICLE_ADDED",
                    "vehicleId", vehicleId,
                    "vehicle", name,
                    "type", type,
                    "price", price + " FCFA",
                    "message", "Événement VEHICLE_ADDED déclenché avec succès",
                    "timestamp", LocalDateTime.now()
            ));
        } catch (Exception e) {
            return handleError(e);
        }
    }

    /**
     * Test 4: Déclencher événement Promotion - dynamique
     */
    @PostMapping("/trigger/vehicle-promotion")
    public ResponseEntity<?> triggerVehiclePromotion(@RequestBody Map<String, Object> payload) {
        try {
            Long vehicleId = getLong(payload, "vehicleId", 1002L);
            String name = (String) payload.getOrDefault("name", "BMW X5 xDrive40i");
            Double oldPrice = getDouble(payload, "oldPrice", 78900.0);
            Double newPrice = getDouble(payload, "newPrice", 69990.0);
            Double discountPercent = getDouble(payload, "discountPercent", 11.3);

            catalogEventService.publishVehicleOnSale(vehicleId, name, oldPrice, newPrice, discountPercent);

            double savings = oldPrice - newPrice;

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "event", "VEHICLE_ON_SALE",
                    "vehicle", name,
                    "oldPrice", oldPrice + " FCFA",
                    "newPrice", newPrice + " FCFA",
                    "discount", discountPercent + "%",
                    "savings", savings + " FCFA",
                    "message", "Événement VEHICLE_ON_SALE déclenché avec succès",
                    "timestamp", LocalDateTime.now()
            ));
        } catch (Exception e) {
            return handleError(e);
        }
    }

    /**
     * Test 5: Déclencher événement Nouvelle Commande - dynamique
     */
    @PostMapping("/trigger/order-created")
    public ResponseEntity<?> triggerOrderCreated(@RequestBody Map<String, Object> payload) {
        try {
            Long orderId = getLong(payload, "orderId", 5001L);
            String customerEmail = (String) payload.getOrDefault("customerEmail", "client.fidele@email.com");
            Double amount = getDouble(payload, "amount", 59990.0);
            String vehicleName = (String) payload.getOrDefault("vehicleName", "Tesla Model 3 Performance");

            catalogEventService.publishOrderCreated(orderId, customerEmail, amount, vehicleName);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "event", "ORDER_CREATED",
                    "orderId", orderId,
                    "customer", customerEmail,
                    "amount", amount + " FCFA",
                    "vehicle", vehicleName,
                    "message", "Événement ORDER_CREATED déclenché avec succès",
                    "timestamp", LocalDateTime.now()
            ));
        } catch (Exception e) {
            return handleError(e);
        }
    }

    /**
     * Test 6: Déclencher événement Client Inscrit - dynamique
     */
    @PostMapping("/trigger/client-registered")
    public ResponseEntity<?> triggerClientRegistered(@RequestBody Map<String, Object> payload) {
        try {
            Long clientId = getLong(payload, "clientId", 100L);
            String name = (String) payload.getOrDefault("name", "Nouveau Client Test");
            String email = (String) payload.getOrDefault("email", "nouveau.client@test.com");
            String type = (String) payload.getOrDefault("type", "INDIVIDUAL");

            catalogEventService.publishClientRegistered(clientId, name, email, type);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "event", "CLIENT_REGISTERED",
                    "clientId", clientId,
                    "clientName", name,
                    "clientEmail", email,
                    "clientType", type,
                    "message", "Événement CLIENT_REGISTERED déclenché avec succès",
                    "timestamp", LocalDateTime.now()
            ));
        } catch (Exception e) {
            return handleError(e);
        }
    }

    /**
     * Test 7: Événement personnalisé (déjà dynamique, conservé)
     */
    @PostMapping("/trigger/custom-event")
    public ResponseEntity<?> triggerCustomEvent(@RequestBody Map<String, Object> request) {
        // ... (inchangé, déjà parfaitement dynamique)
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
            return handleError(e);
        }
    }

    /**
     * Test 8: Simuler une erreur système - rendu dynamique
     */
    @PostMapping("/trigger/system-error")
    public ResponseEntity<?> triggerSystemError(@RequestBody(required = false) Map<String, String> request) {
        try {
            Map<String, String> req = request != null ? request : new HashMap<>();
            String errorCode = req.getOrDefault("errorCode", "ERR-500");
            String errorMessage = req.getOrDefault("errorMessage", "Erreur système simulée pour test du pattern Observer");
            String component = req.getOrDefault("component", "ObserverTestController");

            catalogEventService.publishSystemError(errorCode, errorMessage, component);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "event", "SYSTEM_ERROR",
                    "errorCode", errorCode,
                    "errorMessage", errorMessage,
                    "component", component,
                    "message", "Événement SYSTEM_ERROR déclenché avec succès",
                    "timestamp", LocalDateTime.now()
            ));
        } catch (Exception e) {
            return handleError(e);
        }
    }

    
    // Méthodes utilitaires pour éviter la duplication
    private ResponseEntity<?> handleError(Exception e) {
        return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Erreur lors du déclenchement: " + e.getMessage(),
                "timestamp", LocalDateTime.now()
        ));
    }

    private Long getLong(Map<String, Object> payload, String key, Long defaultValue) {
        Object value = payload.get(key);
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        return defaultValue;
    }

    private Double getDouble(Map<String, Object> payload, String key, Double defaultValue) {
        Object value = payload.get(key);
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        return defaultValue;
    }
}