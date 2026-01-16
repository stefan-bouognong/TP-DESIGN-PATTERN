package com.example.drive_deal.controller;

import com.example.drive_deal.dto.VehicleRequestDTO;
import com.example.drive_deal.dto.VehicleResponseDTO;
import com.example.drive_deal.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<VehicleResponseDTO> createVehicle(@RequestBody VehicleRequestDTO request) {
        VehicleResponseDTO response = vehicleService.createVehicle(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}