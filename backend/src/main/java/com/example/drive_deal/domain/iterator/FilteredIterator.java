package com.example.drive_deal.domain.iterator;

import com.example.drive_deal.entity.VehicleEntity;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
public class FilteredIterator implements CatalogIterator {

    private final List<VehicleEntity> filteredVehicles;
    private int currentPosition;
    private final IteratorFilter filter;

    public FilteredIterator(List<VehicleEntity> allVehicles, IteratorFilter filter) {
        this.filter = filter;
        this.filteredVehicles = applyFilters(allVehicles, filter);
        this.currentPosition = 0;
        log.info("FilteredIterator créé: filtres={}, résultats={}/{}",
                filter, filteredVehicles.size(), allVehicles.size());
    }

    private List<VehicleEntity> applyFilters(List<VehicleEntity> vehicles, IteratorFilter filter) {
        if (filter == null) {
            return new ArrayList<>(vehicles);
        }

        return vehicles.stream()
                .filter(vehicle -> filter.matchesVehicle(
                        vehicle.getType(),
                        vehicle.getPrice() != null ? vehicle.getPrice().doubleValue() : null, // BigDecimal -> Double
                        vehicle.getBrand(),
                        Boolean.valueOf(vehicle.isAvailable()), // boolean -> Boolean
                        Boolean.valueOf(vehicle.isOnSale()),    // boolean -> Boolean
                        vehicle.getYear(),
                        vehicle.getName(),
                        vehicle.getDescription()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public boolean hasNext() {
        return currentPosition < filteredVehicles.size();
    }

    @Override
    public VehicleEntity next() {
        if (!hasNext()) {
            return null;
        }

        VehicleEntity vehicle = filteredVehicles.get(currentPosition);
        currentPosition++;
        log.debug("FilteredIterator next(): position={}/{}, véhicule={}",
                currentPosition, filteredVehicles.size(), vehicle.getName());
        return vehicle;
    }

    @Override
    public VehicleEntity current() {
        if (currentPosition == 0 || currentPosition > filteredVehicles.size()) {
            return null;
        }
        return filteredVehicles.get(currentPosition - 1);
    }

    @Override
    public void reset() {
        currentPosition = 0;
        log.debug("FilteredIterator réinitialisé");
    }

    @Override
    public int getPosition() {
        return currentPosition;
    }

    @Override
    public int getTotal() {
        return filteredVehicles.size();
    }

    @Override
    public List<VehicleEntity> getBatch(int batchSize) {
        int start = currentPosition;
        int end = Math.min(currentPosition + batchSize, filteredVehicles.size());

        if (start >= filteredVehicles.size()) {
            return List.of();
        }

        List<VehicleEntity> batch = filteredVehicles.subList(start, end);
        currentPosition = end;

        log.debug("FilteredIterator batch: {}-{}/{}", start, end, filteredVehicles.size());
        return batch;
    }

    @Override
    public List<VehicleEntity> getAllRemaining() {
        List<VehicleEntity> remaining = filteredVehicles.subList(currentPosition, filteredVehicles.size());
        currentPosition = filteredVehicles.size();
        return remaining;
    }

    public IteratorFilter getFilter() {
        return filter;
    }

    public int getOriginalTotal() {
        // Pour information seulement
        return -1; // Non disponible dans cette implémentation
    }
}
