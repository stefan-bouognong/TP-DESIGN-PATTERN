// ClientRepository.java
package com.example.drive_deal.repository;

import com.example.drive_deal.entity.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<ClientEntity, Long> {
    Optional<ClientEntity> findById(Long id);

    @Query("SELECT c FROM ClientEntity c WHERE TYPE(c) = IndividualClientEntity")
    List<ClientEntity> findAllIndividuals();
    
    @Query("SELECT c FROM ClientEntity c WHERE TYPE(c) = CompanyClientEntity")
    List<ClientEntity> findAllCompanies();
    
    @Query("SELECT c FROM CompanyClientEntity c WHERE c.parentCompany.id = :parentId")
    List<ClientEntity> findSubsidiariesByParentId(@Param("parentId") Long parentId);
}