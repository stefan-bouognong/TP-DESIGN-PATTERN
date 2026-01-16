package com.example.drive_deal.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import com.example.drive_deal.domain.subscription.SubscriptionType;

@Data
@Entity
@Table(name = "subscriptions")
public class SubscriptionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private ClientEntity client;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_type", nullable = false)
    private SubscriptionType subscriptionType;
    
    @Column(name = "is_active")
    private boolean active = true;
    
    private LocalDateTime subscribedAt;
    private LocalDateTime unsubscribedAt;
    
    @Column(name = "preferences_json")
    private String preferencesJson; // Stocke les préférences en JSON
    
    @PrePersist
    protected void onCreate() {
        subscribedAt = LocalDateTime.now();
    }
}