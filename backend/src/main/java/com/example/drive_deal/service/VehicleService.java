package com.example.drive_deal.service;

import com.example.drive_deal.domain.abstractfactory.*;
import com.example.drive_deal.dto.VehicleRequestDTO;
import com.example.drive_deal.dto.VehicleResponseDTO;
import com.example.drive_deal.entity.*;
import com.example.drive_deal.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class VehicleService {

    private final ElectricVehicleFactory electricFactory;
    private final GasolineVehicleFactory gasolineFactory;
    private final VehicleRepository vehicleRepository;

    // ───────────────────────────────────────────────
    // CREATE (Abstract Factory + Adapter)
    // ───────────────────────────────────────────────
    public VehicleResponseDTO createVehicle(VehicleRequestDTO request) {

        VehicleFactory factory = getFactory(request.getFactoryType());
        Vehicle vehicle = createVehicleWithFactory(factory, request);

        VehicleAdapter adapter = (VehicleAdapter) vehicle;
        VehicleEntity entity = adapter.getEntity();

        // Champs communs définis après création
        entity.setName(request.getName());
        entity.setBrand(request.getBrand());
        entity.setColor(request.getColor());
        entity.setYear(request.getYear());
        entity.setAvailable(true);
        entity.setOnSale(false);
        entity.setDescription(vehicle.getDescription());

        VehicleEntity saved = vehicleRepository.save(entity);
        return mapToResponse(saved);
    }

    // ───────────────────────────────────────────────
    // READ - ONE (retourne TOUS les champs)
    // ───────────────────────────────────────────────
    @Transactional(readOnly = true)
    public VehicleResponseDTO getVehicleById(Long id) {

        VehicleEntity entity = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Vehicle not found with id " + id));

        return mapToResponse(entity);
    }

    // ───────────────────────────────────────────────
    // READ - ALL AVEC FILTRES (MÉTHODE MODIFIÉE)
    // ───────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<VehicleResponseDTO> getAllVehicles(
            String search,
            Boolean available,
            Boolean onSale,
            String type,
            BigDecimal minPrice,
            BigDecimal maxPrice) {
        
        // Si aucun filtre n'est spécifié, retourne tous les véhicules
        if (search == null && available == null && onSale == null && 
            type == null && minPrice == null && maxPrice == null) {
            return vehicleRepository.findAll()
                    .stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }
        
        // Sinon, utilise la nouvelle méthode avec filtres
        List<VehicleEntity> entities = vehicleRepository.findWithAllFilters(
                search, available, onSale, type, minPrice, maxPrice);
        
        return entities.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ───────────────────────────────────────────────
    // UPDATE (champs communs uniquement)
    // ───────────────────────────────────────────────
    public VehicleResponseDTO updateVehicle(Long id, VehicleRequestDTO request) {

        VehicleEntity entity = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Vehicle not found with id " + id));

        entity.setName(request.getName());
        entity.setModel(request.getModel());
        entity.setBrand(request.getBrand());
        entity.setPrice(request.getPrice());
        entity.setColor(request.getColor());
        entity.setYear(request.getYear());
        // entity.setAvailable(request.isAvailable());
        // entity.setOnSale(request.isOnSale());

        VehicleEntity updated = vehicleRepository.save(entity);
        return mapToResponse(updated);
    }

    // ───────────────────────────────────────────────
    // DELETE
    // ───────────────────────────────────────────────
    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new RuntimeException("Vehicle not found with id " + id);
        }
        vehicleRepository.deleteById(id);
    }

    // ───────────────────────────────────────────────
    // SEARCH (méthodes existantes - compatibilité)
    // ───────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<VehicleResponseDTO> findByBrand(String brand) {
        // Utilise la nouvelle méthode avec seulement le filtre brand
        return getAllVehicles(brand, null, null, null, null, null);
    }

    @Transactional(readOnly = true)
    public List<VehicleResponseDTO> findAvailableVehicles() {
        // Utilise la nouvelle méthode avec seulement available=true
        return getAllVehicles(null, true, null, null, null, null);
    }

    @Transactional(readOnly = true)
    public List<VehicleResponseDTO> findByPriceLessThanEqual(BigDecimal maxPrice) {
        // Utilise la nouvelle méthode avec seulement maxPrice
        return getAllVehicles(null, null, null, null, null, maxPrice);
    }

    // ───────────────────────────────────────────────
    // FACTORIES
    // ───────────────────────────────────────────────
    private VehicleFactory getFactory(String factoryType) {
        return switch (factoryType.toUpperCase()) {
            case "ELECTRIC" -> electricFactory;
            case "GASOLINE" -> gasolineFactory;
            default -> throw new IllegalArgumentException("Invalid factory type: " + factoryType);
        };
    }

    private Vehicle createVehicleWithFactory(VehicleFactory factory, VehicleRequestDTO request) {
        return switch (request.getVehicleType().toUpperCase()) {
            case "CAR" -> factory.createCar(request.getModel(), request.getPrice());
            case "SCOOTER" -> factory.createScooter(request.getModel(), request.getPrice());
            default -> throw new IllegalArgumentException("Invalid vehicle type: " + request.getVehicleType());
        };
    }

    // ───────────────────────────────────────────────
    // MAPPING POLYMORPHIQUE (POINT CLÉ)
    // ───────────────────────────────────────────────
    private VehicleResponseDTO mapToResponse(VehicleEntity entity) {

        VehicleResponseDTO dto = new VehicleResponseDTO();

        // Champs communs
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setModel(entity.getModel());
        dto.setBrand(entity.getBrand());
        dto.setPrice(entity.getPrice());
        dto.setColor(entity.getColor());
        dto.setYear(entity.getYear());
        dto.setAvailable(entity.isAvailable());
        dto.setOnSale(entity.isOnSale());
        dto.setDescription(entity.getDescription());
        dto.setType(entity.getType());
        dto.setCreatedAt(entity.getCreatedAt());

        // ===== CAR =====
        if (entity instanceof GasolineCarEntity car) {
            dto.setDoors(car.getDoors());
            dto.setHasSunroof(car.getHasSunroof());

            dto.setFuelTankCapacity(car.getFuelTankCapacity());
            dto.setFuelType(car.getFuelType());
        }

        if (entity instanceof ElectricCarEntity car) {
            dto.setDoors(car.getDoors());
            dto.setHasSunroof(car.getHasSunroof());

            dto.setBatteryCapacity(car.getBatteryCapacity());
            dto.setRange(car.getRange());
        }

        // ===== SCOOTER =====
        if (entity instanceof ScooterEntity scooter) {
            dto.setMaxSpeed(scooter.getMaxSpeed());
            dto.setHasTopCase(scooter.getHasTopCase());
        }

        return dto;
    }
}