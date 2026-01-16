package com.example.drive_deal.domain.subscription;

import com.example.drive_deal.domain.observer.EventType;
import com.example.drive_deal.service.SubscriptionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Component
public class SubscriptionManager {
    
    @Autowired
    private SubscriptionService subscriptionService;
    
    // Mapping entre EventType et SubscriptionType
    private static final Map<EventType, SubscriptionType> EVENT_TO_SUBSCRIPTION_MAP = 
        new EnumMap<>(EventType.class);
    
    static {
        EVENT_TO_SUBSCRIPTION_MAP.put(EventType.VEHICLE_ADDED, SubscriptionType.NEW_VEHICLES);
        EVENT_TO_SUBSCRIPTION_MAP.put(EventType.VEHICLE_ON_SALE, SubscriptionType.PROMOTIONS);
        EVENT_TO_SUBSCRIPTION_MAP.put(EventType.VEHICLE_PRICE_CHANGED, SubscriptionType.PRICE_DROPS);
        EVENT_TO_SUBSCRIPTION_MAP.put(EventType.CATALOG_UPDATED, SubscriptionType.CATALOG_UPDATES);
        EVENT_TO_SUBSCRIPTION_MAP.put(EventType.SPECIAL_OFFER_ADDED, SubscriptionType.PROMOTIONS);
    }
    
    /**
     * Récupère les abonnés pour un type d'événement donné
     */
    public List<SubscriptionPreference> getSubscribersForEvent(EventType eventType) {
        SubscriptionType subscriptionType = EVENT_TO_SUBSCRIPTION_MAP.get(eventType);
        if (subscriptionType == null) {
            log.debug("Aucun mapping pour l'événement: {}", eventType);
            return new ArrayList<>();
        }
        
        return subscriptionService.getActiveSubscribers(subscriptionType)
            .stream()
            .filter(pref -> pref.isEmailEnabled())
            .collect(Collectors.toList());
    }
    
    /**
     * Vérifie si un client est abonné à un type d'événement
     */
    public boolean isClientSubscribed(Long clientId, EventType eventType) {
        SubscriptionType subscriptionType = EVENT_TO_SUBSCRIPTION_MAP.get(eventType);
        if (subscriptionType == null) return false;
        
        return subscriptionService.hasSubscription(clientId, subscriptionType);
    }
    
    /**
     * Abonne un client à un type de notification
     */
    public boolean subscribeClient(Long clientId, SubscriptionType subscriptionType, 
                                  Map<String, Object> preferences) {
        return subscriptionService.createOrUpdateSubscription(clientId, subscriptionType, preferences);
    }
    
    /**
     * Désabonne un client
     */
    public boolean unsubscribeClient(Long clientId, SubscriptionType subscriptionType) {
        return subscriptionService.deactivateSubscription(clientId, subscriptionType);
    }
    
    /**
     * Met à jour les préférences d'un abonnement
     */
    public boolean updatePreferences(Long clientId, SubscriptionType subscriptionType,
                                    Map<String, Object> newPreferences) {
        return subscriptionService.updateSubscriptionPreferences(clientId, subscriptionType, newPreferences);
    }
    
    /**
     * Récupère toutes les préférences d'un client
     */
    public SubscriptionPreference getClientPreferences(Long clientId) {
        return subscriptionService.getClientSubscriptionPreference(clientId);
    }
}