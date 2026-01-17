package com.example.drive_deal.controller;

import com.example.drive_deal.dto.VehicleRequestDTO;
import com.example.drive_deal.dto.VehicleResponseDTO;
import com.example.drive_deal.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    // ───────────────────────────────────────────────
    //              CREATE
    // ───────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<VehicleResponseDTO> createVehicle(
            @RequestBody VehicleRequestDTO request) {
        
        VehicleResponseDTO response = vehicleService.createVehicle(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ───────────────────────────────────────────────
    //              READ - One vehicle
    // ───────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponseDTO> getVehicleById(@PathVariable Long id) {
        VehicleResponseDTO response = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(response);
    }

    // ───────────────────────────────────────────────
    //              READ - All vehicles AVEC FILTRES
    // ───────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<VehicleResponseDTO>> getAllVehicles(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) Boolean onSale,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        
        List<VehicleResponseDTO> vehicles = vehicleService.getAllVehicles(
                search, available, onSale, type, minPrice, maxPrice);
        
        return ResponseEntity.ok(vehicles);
    }

    // ───────────────────────────────────────────────
    //              UPDATE
    // ───────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponseDTO> updateVehicle(
            @PathVariable Long id,
            @RequestBody VehicleRequestDTO request) {
        
        VehicleResponseDTO updatedVehicle = vehicleService.updateVehicle(id, request);
        return ResponseEntity.ok(updatedVehicle);
    }

    // ───────────────────────────────────────────────
    //              DELETE
    // ───────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }

    // ───────────────────────────────────────────────
    //     Endpoints spécifiques (rétrocompatibilité)
    // ───────────────────────────────────────────────

    // Recherche par marque
    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<VehicleResponseDTO>> getVehiclesByBrand(
            @PathVariable String brand) {
        // Utilise le nouvel endpoint avec seulement le filtre brand
        return getAllVehicles(brand, null, null, null, null, null);
    }

    // Recherche par disponibilité
    @GetMapping("/available")
    public ResponseEntity<List<VehicleResponseDTO>> getAvailableVehicles() {
        // Utilise le nouvel endpoint avec seulement available=true
        return getAllVehicles(null, true, null, null, null, null);
    }

    // Recherche par prix maximum
    @GetMapping("/price")
    public ResponseEntity<List<VehicleResponseDTO>> getVehiclesByMaxPrice(
            @RequestParam("max") BigDecimal maxPrice) {
        // Utilise le nouvel endpoint avec seulement maxPrice
        return getAllVehicles(null, null, null, null, null, maxPrice);
    }
}