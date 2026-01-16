// OrderItemRepository.java
package com.example.drive_deal.repository;

import com.example.drive_deal.entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItemEntity, Long> {
    
    List<OrderItemEntity> findByOrderId(Long orderId);
    
    @Query("SELECT oi FROM OrderItemEntity oi WHERE oi.order.client.id = :clientId")
    List<OrderItemEntity> findByClientId(@Param("clientId") Long clientId);
    
    @Query("SELECT SUM(oi.quantity) FROM OrderItemEntity oi WHERE oi.vehicle.id = :vehicleId")
    Integer sumQuantityByVehicleId(@Param("vehicleId") Long vehicleId);
}