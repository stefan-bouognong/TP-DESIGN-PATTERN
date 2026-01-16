package com.example.drive_deal.domain.iterator;

import com.example.drive_deal.entity.VehicleEntity;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@Slf4j
public class VehicleIterator implements CatalogIterator {
    
    private final List<VehicleEntity> vehicles;
    private int currentPosition;
    private final IteratorType iteratorType;
    
    public VehicleIterator(List<VehicleEntity> vehicles) {
        this(vehicles, IteratorType.SEQUENTIAL);
    }
    
    public VehicleIterator(List<VehicleEntity> vehicles, IteratorType iteratorType) {
        this.vehicles = vehicles;
        this.currentPosition = 0;
        this.iteratorType = iteratorType;
        log.debug("Iterator créé: type={}, éléments={}", iteratorType, vehicles.size());
    }
    
    @Override
    public boolean hasNext() {
        return currentPosition < vehicles.size();
    }
    
    @Override
    public VehicleEntity next() {
        if (!hasNext()) {
            log.warn("Tentative de next() au-delà des limites");
            return null;
        }
        
        VehicleEntity vehicle = vehicles.get(currentPosition);
        currentPosition++;
        log.debug("Iterator next(): position={}/{}, véhicule={}", 
                 currentPosition, vehicles.size(), vehicle.getName());
        return vehicle;
    }
    
    @Override
    public VehicleEntity current() {
        if (currentPosition == 0 || currentPosition > vehicles.size()) {
            return null;
        }
        return vehicles.get(currentPosition - 1);
    }
    
    @Override
    public void reset() {
        currentPosition = 0;
        log.debug("Iterator réinitialisé");
    }
    
    @Override
    public int getPosition() {
        return currentPosition;
    }
    
    @Override
    public int getTotal() {
        return vehicles.size();
    }
    
    @Override
    public List<VehicleEntity> getBatch(int batchSize) {
        int start = currentPosition;
        int end = Math.min(currentPosition + batchSize, vehicles.size());
        
        if (start >= vehicles.size()) {
            return List.of();
        }
        
        List<VehicleEntity> batch = vehicles.subList(start, end);
        currentPosition = end;
        
        log.debug("Batch récupéré: {}-{}/{}", start, end, vehicles.size());
        return batch;
    }
    
    @Override
    public List<VehicleEntity> getAllRemaining() {
        List<VehicleEntity> remaining = vehicles.subList(currentPosition, vehicles.size());
        currentPosition = vehicles.size();
        return remaining;
    }
    
    public IteratorType getIteratorType() {
        return iteratorType;
    }
}