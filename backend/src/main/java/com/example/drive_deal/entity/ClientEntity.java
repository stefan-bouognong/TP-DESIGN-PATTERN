package com.example.drive_deal.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

import com.example.drive_deal.domain.subscription.SubscriptionType;

@Entity
@Table(name = "clients")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "client_type", discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
public abstract class ClientEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private String address;

    
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<SubscriptionEntity> subscriptions = new HashSet<>();

    @OneToOne(mappedBy = "client", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private NotificationPreferenceEntity notificationPreferences;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_company_id")
    private CompanyClientEntity parentCompany;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; 

    /* =====================
       MÉTHODE MÉTIER
    ====================== */
    public boolean isSubscribedToCatalog() {
        return subscriptions.stream()
                .anyMatch(sub ->
                        sub.getSubscriptionType() == SubscriptionType.CATALOG_UPDATES
                                && sub.isActive()
                );
    }
}
