// DocumentRepository.java
package com.example.drive_deal.repository;

import com.example.drive_deal.entity.DocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity, Long> {
    
    List<DocumentEntity> findByOrderId(Long orderId);
    
    List<DocumentEntity> findByClientId(Long clientId);
    
    List<DocumentEntity> findByType(String type);
}