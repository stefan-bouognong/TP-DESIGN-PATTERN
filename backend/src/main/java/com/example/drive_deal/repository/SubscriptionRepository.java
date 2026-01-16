package com.example.drive_deal.repository;

import com.example.drive_deal.domain.subscription.SubscriptionType;
import com.example.drive_deal.entity.ClientEntity;
import com.example.drive_deal.entity.SubscriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<SubscriptionEntity, Long> {
    
    Optional<SubscriptionEntity> findByClientAndSubscriptionType(ClientEntity client, 
                                                                SubscriptionType subscriptionType);
    
    Optional<SubscriptionEntity> findByClientAndSubscriptionTypeAndActive(ClientEntity client, 
                                                                         SubscriptionType subscriptionType, 
                                                                         boolean active);
    
    List<SubscriptionEntity> findBySubscriptionTypeAndActive(SubscriptionType subscriptionType, 
                                                            boolean active);
    
    long countBySubscriptionTypeAndActive(SubscriptionType subscriptionType, boolean active);
    
    List<SubscriptionEntity> findByClientAndActive(ClientEntity client, boolean active);
    
    List<SubscriptionEntity> findByActive(boolean active);
}