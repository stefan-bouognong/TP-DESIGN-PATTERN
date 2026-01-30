package com.example.drive_deal.controller;

import com.example.drive_deal.domain.command.DiscountStockCommand;
import com.example.drive_deal.repository.VehicleRepository;
import com.example.drive_deal.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final VehicleRepository vehicleRepository;
    private final PromotionService promotionService;

    @PostMapping("/clearance")
    public String applyClearance(@RequestParam int days, @RequestParam double discount) {
        DiscountStockCommand command = new DiscountStockCommand(vehicleRepository, days, discount);
        
        promotionService.runCommand(command);
        
        return "Solde appliquée avec succès pour les véhicules de plus de " + days + " jours.";
    }
}