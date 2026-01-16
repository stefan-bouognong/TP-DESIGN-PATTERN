package com.example.drive_deal.service;

import com.example.drive_deal.domain.subscription.SubscriptionPreference;
import com.example.drive_deal.domain.subscription.SubscriptionType;
import com.example.drive_deal.entity.ClientEntity;
import com.example.drive_deal.entity.SubscriptionEntity;
import com.example.drive_deal.repository.ClientRepository;
import com.example.drive_deal.repository.SubscriptionRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class SubscriptionService {
    
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    /**
     * Crée ou met à jour un abonnement
     */
    public boolean createOrUpdateSubscription(Long clientId, SubscriptionType subscriptionType,
                                            Map<String, Object> preferences) {
        try {
            ClientEntity client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client non trouvé: " + clientId));
            
            // Vérifier si l'abonnement existe déjà
            Optional<SubscriptionEntity> existingSubscription = 
                subscriptionRepository.findByClientAndSubscriptionType(client, subscriptionType);
            
            SubscriptionEntity subscription;
            if (existingSubscription.isPresent()) {
                subscription = existingSubscription.get();
                subscription.setActive(true);
                subscription.setUnsubscribedAt(null);
            } else {
                subscription = new SubscriptionEntity();
                subscription.setClient(client);
                subscription.setSubscriptionType(subscriptionType);
                subscription.setActive(true);
            }
            
            // Sauvegarder les préférences en JSON
            if (preferences != null && !preferences.isEmpty()) {
                String preferencesJson = objectMapper.writeValueAsString(preferences);
                subscription.setPreferencesJson(preferencesJson);
            }
            
            subscriptionRepository.save(subscription);
            log.info("Abonnement créé/mis à jour: client={}, type={}", clientId, subscriptionType);
            return true;
            
        } catch (Exception e) {
            log.error("Erreur création abonnement: {}", e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * Désactive un abonnement
     */
    public boolean deactivateSubscription(Long clientId, SubscriptionType subscriptionType) {
        try {
            ClientEntity client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client non trouvé: " + clientId));
            
            subscriptionRepository.findByClientAndSubscriptionType(client, subscriptionType)
                .ifPresent(subscription -> {
                    subscription.setActive(false);
                    subscription.setUnsubscribedAt(LocalDateTime.now());
                    subscriptionRepository.save(subscription);
                    log.info("Abonnement désactivé: client={}, type={}", clientId, subscriptionType);
                });
            
            return true;
        } catch (Exception e) {
            log.error("Erreur désactivation abonnement: {}", e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * Récupère les abonnés actifs pour un type donné
     */
    public List<SubscriptionPreference> getActiveSubscribers(SubscriptionType subscriptionType) {
        List<SubscriptionEntity> subscriptions = 
            subscriptionRepository.findBySubscriptionTypeAndActive(subscriptionType, true);
        
        return subscriptions.stream()
            .map(this::convertToPreference)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }
    
    /**
     * Vérifie si un client a un abonnement actif
     */
    public boolean hasSubscription(Long clientId, SubscriptionType subscriptionType) {
        return clientRepository.findById(clientId)
            .flatMap(client -> subscriptionRepository
                .findByClientAndSubscriptionTypeAndActive(client, subscriptionType, true))
            .isPresent();
    }
    
    /**
     * Met à jour les préférences d'un abonnement
     */
    public boolean updateSubscriptionPreferences(Long clientId, SubscriptionType subscriptionType,
                                                Map<String, Object> newPreferences) {
        try {
            ClientEntity client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client non trouvé: " + clientId));
            
            Optional<SubscriptionEntity> subscriptionOpt = 
                subscriptionRepository.findByClientAndSubscriptionType(client, subscriptionType);
            
            if (subscriptionOpt.isPresent()) {
                SubscriptionEntity subscription = subscriptionOpt.get();
                String preferencesJson = objectMapper.writeValueAsString(newPreferences);
                subscription.setPreferencesJson(preferencesJson);
                subscriptionRepository.save(subscription);
                return true;
            }
            
            return false;
        } catch (Exception e) {
            log.error("Erreur mise à jour préférences: {}", e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * Récupère toutes les préférences d'abonnement d'un client
     */
    public SubscriptionPreference getClientSubscriptionPreference(Long clientId) {
        ClientEntity client = clientRepository.findById(clientId)
            .orElseThrow(() -> new RuntimeException("Client non trouvé: " + clientId));
        
        SubscriptionPreference preference = new SubscriptionPreference();
        preference.setClientId(clientId);
        preference.setClientEmail(client.getEmail());
        
        // Récupérer tous les abonnements actifs
        Set<SubscriptionEntity> activeSubscriptions = client.getSubscriptions().stream()
            .filter(SubscriptionEntity::isActive)
            .collect(Collectors.toSet());
        
        // Convertir en SubscriptionType
        Set<SubscriptionType> subscriptionTypes = activeSubscriptions.stream()
            .map(SubscriptionEntity::getSubscriptionType)
            .collect(Collectors.toSet());
        
        preference.setActiveSubscriptions(subscriptionTypes);
        
        // Charger les préférences depuis le premier abonnement (simplifié)
        activeSubscriptions.stream()
            .findFirst()
            .ifPresent(sub -> {
                try {
                    if (sub.getPreferencesJson() != null) {
                        Map<String, Object> prefs = objectMapper.readValue(
                            sub.getPreferencesJson(), 
                            new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {}
                        );
                        
                        // Extraire les filtres
                        if (prefs.containsKey("vehicleTypes")) {
                            preference.setPreferredVehicleTypes(
                                new HashSet<>((List<String>) prefs.get("vehicleTypes"))
                            );
                        }
                        if (prefs.containsKey("minPrice")) {
                            preference.setMinPrice(Double.valueOf(prefs.get("minPrice").toString()));
                        }
                        if (prefs.containsKey("maxPrice")) {
                            preference.setMaxPrice(Double.valueOf(prefs.get("maxPrice").toString()));
                        }
                    }
                } catch (JsonProcessingException e) {
                    log.warn("Erreur parsing JSON préférences: {}", e.getMessage());
                }
            });
        
        return preference;
    }
    
    /**
     * Nombre d'abonnés pour un type donné
     */
    public long countSubscribers(SubscriptionType subscriptionType) {
        return subscriptionRepository.countBySubscriptionTypeAndActive(subscriptionType, true);
    }
    
    private SubscriptionPreference convertToPreference(SubscriptionEntity subscription) {
        try {
            SubscriptionPreference preference = new SubscriptionPreference();
            preference.setClientId(subscription.getClient().getId());
            preference.setClientEmail(subscription.getClient().getEmail());
            preference.setActiveSubscriptions(Set.of(subscription.getSubscriptionType()));
            
            // Charger les préférences JSON
            if (subscription.getPreferencesJson() != null) {
                Map<String, Object> prefs = objectMapper.readValue(
                    subscription.getPreferencesJson(),
                    new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {}
                );
                
                if (prefs.containsKey("vehicleTypes")) {
                    preference.setPreferredVehicleTypes(
                        new HashSet<>((List<String>) prefs.get("vehicleTypes"))
                    );
                }
                if (prefs.containsKey("minPrice")) {
                    preference.setMinPrice(Double.valueOf(prefs.get("minPrice").toString()));
                }
                if (prefs.containsKey("maxPrice")) {
                    preference.setMaxPrice(Double.valueOf(prefs.get("maxPrice").toString()));
                }
            }
            
            return preference;
        } catch (Exception e) {
            log.error("Erreur conversion subscription: {}", e.getMessage());
            return null;
        }
    }
}