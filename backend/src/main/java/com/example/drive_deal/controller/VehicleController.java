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
    //              READ - All vehicles
    // ───────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<VehicleResponseDTO>> getAllVehicles() {
        List<VehicleResponseDTO> vehicles = vehicleService.getAllVehicles();
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
    //     Bonus très utiles (souvent ajoutées)
    // ───────────────────────────────────────────────

    // Recherche par marque (exemple)
    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<VehicleResponseDTO>> getVehiclesByBrand(
            @PathVariable String brand) {
        List<VehicleResponseDTO> vehicles = vehicleService.findByBrand(brand);
        return ResponseEntity.ok(vehicles);
    }

    // Recherche par disponibilité
    @GetMapping("/available")
    public ResponseEntity<List<VehicleResponseDTO>> getAvailableVehicles() {
        List<VehicleResponseDTO> vehicles = vehicleService.findAvailableVehicles();
        return ResponseEntity.ok(vehicles);
    }

    // Ou par prix max (exemple)
    @GetMapping("/price")
    public ResponseEntity<List<VehicleResponseDTO>> getVehiclesByMaxPrice(
            @RequestParam("max") BigDecimal maxPrice) {
        List<VehicleResponseDTO> vehicles = vehicleService.findByPriceLessThanEqual(maxPrice);
        return ResponseEntity.ok(vehicles);
    }
}