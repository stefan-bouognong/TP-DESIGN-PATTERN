package com.example.drive_deal.service;

import com.example.drive_deal.domain.abstractfactory.ElectricVehicleFactory;
import com.example.drive_deal.domain.abstractfactory.GasolineVehicleFactory;
import com.example.drive_deal.domain.abstractfactory.Vehicle;
import com.example.drive_deal.domain.abstractfactory.VehicleAdapter;
import com.example.drive_deal.domain.abstractfactory.VehicleFactory;
import com.example.drive_deal.dto.VehicleRequestDTO;
import com.example.drive_deal.dto.VehicleResponseDTO;
import com.example.drive_deal.entity.VehicleEntity;
import com.example.drive_deal.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final ElectricVehicleFactory electricFactory;
    private final GasolineVehicleFactory gasolineFactory;
    private final VehicleRepository vehicleRepository;

    @Transactional
    public VehicleResponseDTO createVehicle(VehicleRequestDTO request) {
        // 1. Choisir la factory
        VehicleFactory factory = switch (request.getFactoryType().toUpperCase()) {
            case "ELECTRIC" -> electricFactory;
            case "GASOLINE" -> gasolineFactory;
            default -> throw new IllegalArgumentException("Invalid factory type: " + request.getFactoryType());
        };

        // 2. Créer le véhicule via Abstract Factory
        Vehicle vehicle = switch (request.getVehicleType().toUpperCase()) {
            case "CAR" -> factory.createCar(request.getModel(), request.getPrice());
            case "SCOOTER" -> factory.createScooter(request.getModel(), request.getPrice());
            default -> throw new IllegalArgumentException("Invalid vehicle type: " + request.getVehicleType());
        };

        // 3. Récupérer l'entité et sauvegarder
        VehicleAdapter adapter = (VehicleAdapter) vehicle;
        VehicleEntity entity = adapter.getEntity();
        entity.setColor(request.getColor());
        entity.setYear(request.getYear());
        
        VehicleEntity savedEntity = vehicleRepository.save(entity);

        // 4. Retourner le DTO
        VehicleResponseDTO response = new VehicleResponseDTO();
        response.setId(savedEntity.getId());
        response.setType(vehicle.getType());
        response.setEnergyType(vehicle.getEnergyType());
        response.setModel(savedEntity.getModel());
        response.setPrice(savedEntity.getPrice());
        response.setColor(savedEntity.getColor());
        response.setYear(savedEntity.getYear());
        response.setDescription(vehicle.getDescription());

        return response;
    }
}