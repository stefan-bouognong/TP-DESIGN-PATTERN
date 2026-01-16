package com.example.drive_deal.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "notification_preferences")
public class NotificationPreferenceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false, unique = true)
    private ClientEntity client;
    
    @Column(name = "receive_catalog_updates")
    private boolean receiveCatalogUpdates = true;
    
    @Column(name = "receive_promotions")
    private boolean receivePromotions = true;
    
    @Column(name = "receive_new_vehicles")
    private boolean receiveNewVehicles = true;
    
    @Column(name = "receive_price_drops")
    private boolean receivePriceDrops = true;
    
    @Column(name = "receive_order_updates")
    private boolean receiveOrderUpdates = true;
    
    @Column(name = "email_frequency")
    private String emailFrequency = "IMMEDIATE"; // IMMEDIATE, DAILY, WEEKLY
    
    @Column(name = "preferred_format")
    private String preferredFormat = "HTML"; // HTML, TEXT
    
    @Column(name = "vehicle_types")
    private String vehicleTypes; // "CAR,ELECTRIC_CAR,SCOOTER"
    
    @Column(name = "price_range_min")
    private Double priceRangeMin;
    
    @Column(name = "price_range_max")
    private Double priceRangeMax;
}