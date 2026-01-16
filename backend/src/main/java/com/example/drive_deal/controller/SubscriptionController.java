package com.example.drive_deal.controller;

import com.example.drive_deal.domain.subscription.SubscriptionType;
import com.example.drive_deal.dto.SubscriptionRequestDTO;
import com.example.drive_deal.dto.SubscriptionResponseDTO;
import com.example.drive_deal.service.SubscriptionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {
    
    @Autowired
    private SubscriptionService subscriptionService;
    
    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody SubscriptionRequestDTO request) {
        try {
            // Convertir DTO en Map de préférences
            Map<String, Object> preferences = new HashMap<>();
            if (request.getVehicleTypes() != null) {
                preferences.put("vehicleTypes", request.getVehicleTypes());
            }
            if (request.getMinPrice() != null) {
                preferences.put("minPrice", request.getMinPrice());
            }
            if (request.getMaxPrice() != null) {
                preferences.put("maxPrice", request.getMaxPrice());
            }
            if (request.getBrands() != null) {
                preferences.put("brands", request.getBrands());
            }
            preferences.put("emailFrequency", request.getEmailFrequency());
            
            boolean success = subscriptionService.createOrUpdateSubscription(
                request.getClientId(),
                request.getSubscriptionType(),
                preferences
            );
            
            if (success) {
                SubscriptionResponseDTO response = new SubscriptionResponseDTO();
                response.setClientId(request.getClientId());
                response.setSubscriptionType(request.getSubscriptionType().name());
                response.setActive(true);
                response.setMessage("Abonnement créé avec succès");
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(
                    Map.of("error", "Échec de l'abonnement")
                );
            }
        } catch (Exception e) {
            log.error("Erreur abonnement: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(
                Map.of("error", "Erreur serveur: " + e.getMessage())
            );
        }
    }
    
    @PostMapping("/unsubscribe")
    public ResponseEntity<?> unsubscribe(@RequestBody SubscriptionRequestDTO request) {
        try {
            boolean success = subscriptionService.deactivateSubscription(
                request.getClientId(),
                request.getSubscriptionType()
            );
            
            if (success) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Désabonnement réussi"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Échec du désabonnement"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Erreur serveur: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/client/{clientId}/preferences")
    public ResponseEntity<?> getClientPreferences(@PathVariable Long clientId) {
        try {
            var preference = subscriptionService.getClientSubscriptionPreference(clientId);
            return ResponseEntity.ok(preference);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Erreur serveur: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/stats/{type}")
    public ResponseEntity<?> getSubscriptionStats(@PathVariable String type) {
        try {
            SubscriptionType subscriptionType = SubscriptionType.valueOf(type.toUpperCase());
            long count = subscriptionService.countSubscribers(subscriptionType);
            
            return ResponseEntity.ok(Map.of(
                "subscriptionType", type,
                "activeSubscribers", count
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Type d'abonnement invalide: " + type
            ));
        }
    }
    
    @GetMapping("/types")
    public ResponseEntity<?> getSubscriptionTypes() {
        SubscriptionType[] types = SubscriptionType.values();
        return ResponseEntity.ok(types);
    }
}