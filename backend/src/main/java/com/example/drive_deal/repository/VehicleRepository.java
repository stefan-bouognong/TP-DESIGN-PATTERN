package com.example.drive_deal.repository;

import com.example.drive_deal.entity.VehicleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<VehicleEntity, Long> {

    // Méthodes existantes - GARDE-LES
    List<VehicleEntity> findByBrandIgnoreCase(String brand);

    List<VehicleEntity> findByAvailableTrue();

    List<VehicleEntity> findByPriceLessThanEqual(BigDecimal price);

    // ✅ NOUVELLE MÉTHODE - AJOUTE CETTE MÉTHODE À LA FIN
    @Query("SELECT v FROM VehicleEntity v WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(v.brand) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.model) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:available IS NULL OR v.available = :available) AND " +
           "(:onSale IS NULL OR v.onSale = :onSale) AND " +
           "(:type IS NULL OR v.type = :type) AND " +
           "(:minPrice IS NULL OR v.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR v.price <= :maxPrice)")
    List<VehicleEntity> findWithAllFilters(
            @Param("search") String search,
            @Param("available") Boolean available,
            @Param("onSale") Boolean onSale,
            @Param("type") String type,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice);
}