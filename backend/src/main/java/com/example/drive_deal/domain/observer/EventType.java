package com.example.drive_deal.domain.observer;

public enum EventType {
    // Événements véhicules
    VEHICLE_ADDED,
    VEHICLE_REMOVED,
    VEHICLE_ON_SALE,
    VEHICLE_PRICE_CHANGED,
    VEHICLE_STOCK_UPDATED,
    
    // Événements commandes
    ORDER_CREATED,
    ORDER_STATUS_CHANGED,
    ORDER_CANCELLED,
    ORDER_DELIVERED,
    
    // Événements clients
    CLIENT_REGISTERED,
    CLIENT_UPDATED,
    CLIENT_PURCHASED,
    
    // Événements catalogue
    CATALOG_UPDATED,
    SPECIAL_OFFER_ADDED,
    CATALOG_SEARCH_PERFORMED,
    
    // Événements système
    SYSTEM_ERROR,
    MAINTENANCE_MODE,
    BACKUP_COMPLETED,
    
    // Événements panier
    CART_ITEM_ADDED,
    CART_ITEM_REMOVED,
    CART_CHECKOUT
}