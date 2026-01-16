// CatalogController.java
package com.example.drive_deal.controller;

import com.example.drive_deal.dto.*;
import com.example.drive_deal.service.CatalogDisplayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/catalog")
@RequiredArgsConstructor
public class CatalogController {
    
    private final CatalogDisplayService catalogDisplayService;
    
    @GetMapping("/vehicles")
    public ResponseEntity<CatalogViewDTO> getBasicCatalog() {
        CatalogViewDTO catalog = catalogDisplayService.getCatalogView("BASIC");
        return ResponseEntity.ok(catalog);
    }
    
    @GetMapping("/vehicles/enhanced")
    public ResponseEntity<CatalogViewDTO> getEnhancedCatalog() {
        CatalogViewDTO catalog = catalogDisplayService.getCatalogView("ENHANCED");
        return ResponseEntity.ok(catalog);
    }
    
    @GetMapping("/vehicles/full")
    public ResponseEntity<CatalogViewDTO> getFullCatalog() {
        CatalogViewDTO catalog = catalogDisplayService.getCatalogView("FULL");
        return ResponseEntity.ok(catalog);
    }
    
    @GetMapping("/vehicles/sale")
    public ResponseEntity<List<DecoratedVehicleDTO>> getSaleVehicles() {
        List<DecoratedVehicleDTO> saleVehicles = catalogDisplayService.getSaleVehicles();
        return ResponseEntity.ok(saleVehicles);
    }
    
    @GetMapping("/vehicle/{id}")
    public ResponseEntity<DecoratedVehicleDTO> getVehicle(@PathVariable Long id) {
        DecorationOptionsDTO options = new DecorationOptionsDTO();
        options.setIncludeAnimations(true);
        options.setShowOptions(true);
        
        DecoratedVehicleDTO vehicle = catalogDisplayService.getDecoratedVehicle(id, options);
        return ResponseEntity.ok(vehicle);
    }
    
    @GetMapping("/vehicle/{id}/decorated")
    public ResponseEntity<DecoratedVehicleDTO> getFullyDecoratedVehicle(@PathVariable Long id) {
        DecoratedVehicleDTO vehicle = catalogDisplayService.getVehicleWithAllDecorations(id);
        return ResponseEntity.ok(vehicle);
    }
    
    @PostMapping("/vehicle/{id}/decorate")
    public ResponseEntity<DecoratedVehicleDTO> decorateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody DecorationOptionsDTO options) {
        DecoratedVehicleDTO vehicle = catalogDisplayService.getDecoratedVehicle(id, options);
        return ResponseEntity.ok(vehicle);
    }
        
    // Dans CatalogController.java
    @PostMapping("/decorate/batch")
    public ResponseEntity<List<DecoratedVehicleDTO>> decorateVehiclesBatch(
            @Valid @RequestBody BatchDecorationRequestDTO request) {
        
        List<DecoratedVehicleDTO> decoratedVehicles = new ArrayList<>();
        
        for (Long vehicleId : request.getVehicleIds()) {
            try {
                DecoratedVehicleDTO vehicle = catalogDisplayService.getDecoratedVehicle(
                    vehicleId, 
                    request.getOptions()
                );
                decoratedVehicles.add(vehicle);
            } catch (Exception e) {
                // Ignorer les erreurs individuelles
            }
        }
        
        return ResponseEntity.ok(decoratedVehicles);
    }
}