// CatalogDisplayService.java
package com.example.drive_deal.service;

import com.example.drive_deal.domain.decorator.*;
import com.example.drive_deal.dto.*;
import com.example.drive_deal.entity.VehicleEntity;
import com.example.drive_deal.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogDisplayService {
    
    private final VehicleDisplayFactory displayFactory;
    private final VehicleRepository vehicleRepository;
    
    @Transactional(readOnly = true)
    public DecoratedVehicleDTO getDecoratedVehicle(Long vehicleId, DecorationOptionsDTO options) {
        VehicleEntity vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new IllegalArgumentException("Vehicle not found: " + vehicleId));
        
        VehicleDisplay display;
        
        if (options != null && options.getDecorators() != null && !options.getDecorators().isEmpty()) {
            display = displayFactory.createEnhancedDisplay(vehicle, options.getDecorators());
        } else {
            // Configuration par défaut basée sur les options booléennes
            List<String> decorators = new ArrayList<>();
            if (Boolean.TRUE.equals(options.getIncludeAnimations())) decorators.add("ANIMATION");
            if (Boolean.TRUE.equals(options.getIncludeSaleBadge())) decorators.add("SALE");
            if (Boolean.TRUE.equals(options.getShowOptions())) decorators.add("OPTIONS");
            if (Boolean.TRUE.equals(options.getShowRecommendations())) decorators.add("RECOMMENDATION");
            
            display = displayFactory.createEnhancedDisplay(vehicle, decorators);
        }
        
        return buildDecoratedVehicleDTO(display);
    }
    
    @Transactional(readOnly = true)
    public CatalogViewDTO getCatalogView(String viewType) {
        List<VehicleEntity> vehicles = vehicleRepository.findAll();
        List<DecoratedVehicleDTO> decoratedVehicles = new ArrayList<>();
        
        for (VehicleEntity vehicle : vehicles) {
            VehicleDisplay display = createDisplayForViewType(vehicle, viewType);
            decoratedVehicles.add(buildDecoratedVehicleDTO(display));
        }
        
        CatalogViewDTO catalogView = new CatalogViewDTO();
        catalogView.setVehicles(decoratedVehicles);
        catalogView.setViewType(viewType);
        catalogView.setTotalVehicles(decoratedVehicles.size());
        catalogView.setHasAnimations(decoratedVehicles.stream()
            .anyMatch(v -> Boolean.TRUE.equals(v.getAttributes().get("hasAnimations"))));
        catalogView.setHasSaleItems(decoratedVehicles.stream()
            .anyMatch(v -> Boolean.TRUE.equals(v.getAttributes().get("hasSaleBadge"))));
        
        return catalogView;
    }
    
    @Transactional(readOnly = true)
    public List<DecoratedVehicleDTO> getSaleVehicles() {
        List<VehicleEntity> vehicles = vehicleRepository.findAll();
        List<DecoratedVehicleDTO> saleVehicles = new ArrayList<>();
        
        // Simuler des véhicules en solde (dans une vraie app, on aurait un champ sale)
        List<VehicleEntity> vehiclesOnSale = vehicles.stream()
            .filter(v -> v.getId() % 3 == 0) // 1/3 des véhicues en solde
            .toList();
        
        for (VehicleEntity vehicle : vehiclesOnSale) {
            VehicleDisplay display = displayFactory.createSaleDisplay(vehicle);
            saleVehicles.add(buildDecoratedVehicleDTO(display));
        }
        
        return saleVehicles;
    }
    
    @Transactional(readOnly = true)
    public DecoratedVehicleDTO getVehicleWithAllDecorations(Long vehicleId) {
        VehicleEntity vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new IllegalArgumentException("Vehicle not found: " + vehicleId));
        
        VehicleDisplay display = displayFactory.createFullFeaturedDisplay(vehicle);
        return buildDecoratedVehicleDTO(display);
    }
    
    private VehicleDisplay createDisplayForViewType(VehicleEntity vehicle, String viewType) {
        return switch (viewType.toUpperCase()) {
            case "ENHANCED" -> displayFactory.createEnhancedDisplay(vehicle, 
                List.of("ANIMATION", "OPTIONS"));
            case "FULL" -> displayFactory.createFullFeaturedDisplay(vehicle);
            case "SALE" -> displayFactory.createSaleDisplay(vehicle);
            case "CATALOG" -> displayFactory.createCatalogDisplay(vehicle);
            default -> displayFactory.createBasicDisplay(vehicle);
        };
    }
    
    private DecoratedVehicleDTO buildDecoratedVehicleDTO(VehicleDisplay display) {
        DecoratedVehicleDTO dto = new DecoratedVehicleDTO();
        dto.setVehicleId(display.getVehicle().getId());
        dto.setModel(display.getVehicle().getModel());
        dto.setDisplayHtml(display.display());
        dto.setAttributes(display.getDisplayAttributes());
        dto.setDisplayType(display.getDisplayType());
        
        // Compter les décorateurs
        String displayType = display.getDisplayType();
        int decoratorCount = displayType.split("\\+").length - 1;
        dto.setDecoratorCount(decoratorCount);
        
        return dto;
    }
}