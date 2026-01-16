package com.example.drive_deal.domain.observer;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j
@Component
public class CatalogSubject implements Subject {
    
    private final List<Observer> observers = new CopyOnWriteArrayList<>();
    
    @Override
    public void registerObserver(Observer observer) {
        if (observer == null) {
            log.warn("Tentative d'enregistrement d'un observer null");
            return;
        }
        
        if (!observers.contains(observer)) {
            observers.add(observer);
            log.info("Observer enregistré: {} (total: {})", 
                    observer.getObserverName(), observers.size());
        }
    }
    
    @Override
    public void removeObserver(Observer observer) {
        if (observer != null && observers.remove(observer)) {
            log.info("Observer retiré: {}", observer.getObserverName());
        }
    }
    
    @Override
    public void notifyObservers(CatalogEvent event) {
        if (event == null) {
            log.warn("Tentative de notification avec un événement null");
            return;
        }
        
        if (observers.isEmpty()) {
            log.debug("Aucun observer à notifier pour l'événement: {}", event.getType());
            return;
        }
        
        log.debug("Notification de {} observers pour l'événement: {}", 
                 observers.size(), event.getType());
        
        // Notification synchrone mais avec gestion d'erreurs par observer
        for (Observer observer : observers) {
            if (observer != null && observer.isActive()) {
                try {
                    observer.update(event);
                } catch (Exception e) {
                    log.error("Erreur lors de la notification de l'observateur {}: {}", 
                             observer.getObserverName(), e.getMessage(), e);
                }
            }
        }
    }
    
    @Override
    public List<Observer> getObservers() {
        return new ArrayList<>(observers);
    }
    
    @Override
    public void clearObservers() {
        int count = observers.size();
        observers.clear();
        log.info("Tous les observers ont été effacés ({} observers)", count);
    }
    
    @Override
    public int getObserverCount() {
        return observers.size();
    }
    
    // Méthodes utilitaires
    public void notifyVehicleEvent(EventType eventType, Long vehicleId, String vehicleName, 
                                  Double price, String details) {
        CatalogEvent event = new CatalogEvent(eventType, 
            "Événement véhicule: " + vehicleName);
        
        event.addData("vehicleId", vehicleId);
        event.addData("vehicleName", vehicleName);
        event.addData("price", price);
        event.addData("details", details);
        event.addData("timestamp", System.currentTimeMillis());
        
        notifyObservers(event);
    }
    
    public void notifyOrderEvent(EventType eventType, Long orderId, String customerEmail, 
                                Double amount, String status) {
        CatalogEvent event = new CatalogEvent(eventType,
            "Événement commande: " + orderId);
        
        event.addData("orderId", orderId);
        event.addData("customerEmail", customerEmail);
        event.addData("amount", amount);
        event.addData("status", status);
        event.addData("timestamp", System.currentTimeMillis());
        
        notifyObservers(event);
    }
}