package com.example.drive_deal.domain.command;

import com.example.drive_deal.entity.VehicleEntity;
import com.example.drive_deal.repository.VehicleRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class DiscountStockCommand implements Command {

    private final VehicleRepository repository;
    private final int daysThreshold; 
    private final double discountPercentage; 

    public DiscountStockCommand(VehicleRepository repository, int daysThreshold, double discountPercentage) {
        this.repository = repository;
        this.daysThreshold = daysThreshold;
        this.discountPercentage = discountPercentage;
    }

    @Override
    public void execute() {
        LocalDateTime thresholdDate = LocalDateTime.now().minusDays(daysThreshold);
        List<VehicleEntity> oldVehicles = repository.findByCreatedAtBeforeAndAvailableTrue(thresholdDate);

        for (VehicleEntity vehicle : oldVehicles) {
            BigDecimal currentPrice = vehicle.getPrice();
            BigDecimal discountAmount = currentPrice.multiply(BigDecimal.valueOf(discountPercentage));
            BigDecimal newPrice = currentPrice.subtract(discountAmount);

            vehicle.setPrice(newPrice);
            vehicle.setOnSale(true); 
            repository.save(vehicle);
        }
    }
}