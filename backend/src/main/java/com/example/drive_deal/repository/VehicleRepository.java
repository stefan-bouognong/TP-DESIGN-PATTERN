package com.example.drive_deal.repository;

import com.example.drive_deal.entity.VehicleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;

public interface VehicleRepository extends JpaRepository<VehicleEntity, Long> {

    List<VehicleEntity> findByBrandIgnoreCase(String brand);

    List<VehicleEntity> findByAvailableTrue();

    List<VehicleEntity> findByPriceLessThanEqual(BigDecimal price);
}
