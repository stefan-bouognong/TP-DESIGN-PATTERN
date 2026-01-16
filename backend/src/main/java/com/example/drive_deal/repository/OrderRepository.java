// OrderRepository.java
package com.example.drive_deal.repository;

import com.example.drive_deal.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    
    List<OrderEntity> findByClientId(Long clientId);
    
    List<OrderEntity> findByStatus(com.example.drive_deal.entity.OrderStatus status);
    
    @Query("SELECT o FROM OrderEntity o WHERE TYPE(o) = CashOrderEntity")
    List<OrderEntity> findAllCashOrders();
    
    @Query("SELECT o FROM OrderEntity o WHERE TYPE(o) = CreditOrderEntity")
    List<OrderEntity> findAllCreditOrders();
    
    @Query("SELECT COUNT(o) FROM OrderEntity o WHERE o.client.id = :clientId")
    Long countByClientId(@Param("clientId") Long clientId);
}