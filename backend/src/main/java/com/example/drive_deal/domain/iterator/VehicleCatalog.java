package com.example.drive_deal.domain.iterator;

import com.example.drive_deal.entity.VehicleEntity;
import com.example.drive_deal.repository.VehicleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.math.BigDecimal;

@Slf4j
@Component
public class VehicleCatalog implements CatalogCollection {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Override
    public CatalogIterator createSequentialIterator() {
        List<VehicleEntity> vehicles = vehicleRepository.findAll();
        log.info("Itérateur séquentiel créé avec {} véhicules", vehicles.size());
        return new VehicleIterator(vehicles, IteratorType.SEQUENTIAL);
    }

    @Override
    public CatalogIterator createFilteredIterator(IteratorFilter filter) {
        List<VehicleEntity> vehicles = vehicleRepository.findAll();
        log.info("Itérateur filtré créé avec {} véhicules, filtres: {}", vehicles.size(), filter);
        return new FilteredIterator(vehicles, filter);
    }

    @Override
    public CatalogIterator createPaginatedIterator(int pageSize) {
        List<VehicleEntity> vehicles = vehicleRepository.findAll();
        log.info("Itérateur paginé créé avec {} véhicules, pageSize={}", vehicles.size(), pageSize);
        return new PaginatedIterator(vehicles, pageSize);
    }

    @Override
    public CatalogIterator createSortedIterator(IteratorType sortType) {
        List<VehicleEntity> vehicles = vehicleRepository.findAll();
        List<VehicleEntity> sortedVehicles = sortVehicles(vehicles, sortType);
        log.info("Itérateur trié créé: type={}, véhicules={}", sortType, sortedVehicles.size());
        return new VehicleIterator(sortedVehicles, sortType);
    }

    @Override
    public List<VehicleEntity> getAllItems() {
        return vehicleRepository.findAll();
    }

    @Override
    public int getTotalItems() {
        return (int) vehicleRepository.count();
    }

    private List<VehicleEntity> sortVehicles(List<VehicleEntity> vehicles, IteratorType sortType) {
        switch (sortType) {
            case PRICE_ASC:
                return vehicles.stream()
                        .sorted(Comparator.comparing(VehicleEntity::getPrice))
                        .collect(Collectors.toList());
            case PRICE_DESC:
                return vehicles.stream()
                        .sorted(Comparator.comparing(VehicleEntity::getPrice).reversed())
                        .collect(Collectors.toList());
            case DATE_NEWEST:
                return vehicles.stream()
                        .sorted(Comparator.comparing(VehicleEntity::getCreatedAt).reversed())
                        .collect(Collectors.toList());
            case DATE_OLDEST:
                return vehicles.stream()
                        .sorted(Comparator.comparing(VehicleEntity::getCreatedAt))
                        .collect(Collectors.toList());
            case REVERSE:
                List<VehicleEntity> reversed = new ArrayList<>(vehicles);
                java.util.Collections.reverse(reversed);
                return reversed;
            default:
                return vehicles;
        }
    }

    public CatalogIterator createIterator(IteratorType type, IteratorFilter filter, Integer pageSize) {
        switch (type) {
            case FILTERED:
                return createFilteredIterator(filter);
            case PAGINATED:
                return createPaginatedIterator(pageSize != null ? pageSize : 10);
            case PRICE_ASC:
            case PRICE_DESC:
            case DATE_NEWEST:
            case DATE_OLDEST:
            case REVERSE:
                return createSortedIterator(type);
            case SEQUENTIAL:
            default:
                return createSequentialIterator();
        }
    }

    public int countByFilter(IteratorFilter filter) {
        if (filter == null) {
            return getTotalItems();
        }

        List<VehicleEntity> allVehicles = getAllItems();
        return (int) allVehicles.stream()
                .filter(vehicle -> filter.matchesVehicle(
                        vehicle.getType(),
                        vehicle.getPrice().doubleValue(),          // BigDecimal -> double
                        vehicle.getBrand(),
                        Boolean.valueOf(vehicle.isAvailable()),   // boolean -> Boolean
                        Boolean.valueOf(vehicle.isOnSale()),      // boolean -> Boolean
                        vehicle.getYear(),
                        vehicle.getName(),
                        vehicle.getDescription()
                ))
                .count();
    }
}
