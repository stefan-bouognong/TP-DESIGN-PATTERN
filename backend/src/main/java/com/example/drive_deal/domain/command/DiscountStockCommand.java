package com.example.drive_deal.domain.command;

import com.example.drive_deal.entity.VehicleEntity;
import com.example.drive_deal.repository.VehicleRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class DiscountStockCommand implements Command {

    private final VehicleRepository repository;
    private final int daysThreshold; // ex: 90 jours
    private final double discountPercentage; // ex: 0.20 pour 20%

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
            // Calcul du nouveau prix : prix * (1 - remise)
            BigDecimal currentPrice = vehicle.getPrice();
            BigDecimal discountAmount = currentPrice.multiply(BigDecimal.valueOf(discountPercentage));
            BigDecimal newPrice = currentPrice.subtract(discountAmount);

            vehicle.setPrice(newPrice);
            vehicle.setOnSale(true); // On marque le véhicule comme étant en solde
            repository.save(vehicle);
        }
    }
}