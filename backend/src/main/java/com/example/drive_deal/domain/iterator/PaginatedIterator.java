package com.example.drive_deal.domain.iterator;

import com.example.drive_deal.entity.VehicleEntity;
import lombok.extern.slf4j.Slf4j;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public class PaginatedIterator implements CatalogIterator {
    
    private final List<VehicleEntity> allVehicles;
    private final int pageSize;
    private int currentPage;
    private int currentPosition;
    
    public PaginatedIterator(List<VehicleEntity> vehicles, int pageSize) {
        this.allVehicles = new ArrayList<>(vehicles);
        this.pageSize = pageSize > 0 ? pageSize : 10;
        this.currentPage = 0;
        this.currentPosition = 0;
        log.info("PaginatedIterator créé: pageSize={}, total={}", pageSize, vehicles.size());
    }
    
    @Override
    public boolean hasNext() {
        return currentPosition < allVehicles.size();
    }
    
    @Override
    public VehicleEntity next() {
        if (!hasNext()) {
            return null;
        }
        
        VehicleEntity vehicle = allVehicles.get(currentPosition);
        currentPosition++;
        
        // Mettre à jour la page si nécessaire
        if (currentPosition % pageSize == 0) {
            currentPage = (currentPosition / pageSize) - 1;
        } else {
            currentPage = currentPosition / pageSize;
        }
        
        log.debug("PaginatedIterator next(): page={}, position={}/{}, véhicule={}", 
                 currentPage + 1, currentPosition, allVehicles.size(), vehicle.getName());
        return vehicle;
    }
    
    @Override
    public VehicleEntity current() {
        if (currentPosition == 0 || currentPosition > allVehicles.size()) {
            return null;
        }
        return allVehicles.get(currentPosition - 1);
    }
    
    @Override
    public void reset() {
        currentPosition = 0;
        currentPage = 0;
        log.debug("PaginatedIterator réinitialisé");
    }
    
    @Override
    public int getPosition() {
        return currentPosition;
    }
    
    @Override
    public int getTotal() {
        return allVehicles.size();
    }
    
    @Override
    public List<VehicleEntity> getBatch(int batchSize) {
        // Pour PaginatedIterator, on utilise pageSize comme batchSize
        return getPage(currentPage + 1);
    }
    
    @Override
    public List<VehicleEntity> getAllRemaining() {
        List<VehicleEntity> remaining = allVehicles.subList(currentPosition, allVehicles.size());
        currentPosition = allVehicles.size();
        currentPage = getTotalPages() - 1;
        return remaining;
    }
    
    // Méthodes spécifiques à la pagination
    public List<VehicleEntity> getPage(int pageNumber) {
        if (pageNumber < 1 || pageNumber > getTotalPages()) {
            return List.of();
        }
        
        int start = (pageNumber - 1) * pageSize;
        int end = Math.min(start + pageSize, allVehicles.size());
        
        // Mettre à jour la position courante
        currentPosition = end;
        currentPage = pageNumber - 1;
        
        log.debug("Page {} récupérée: {}-{}/{}", pageNumber, start, end, allVehicles.size());
        return new ArrayList<>(allVehicles.subList(start, end));
    }
    
    public int getCurrentPage() {
        return currentPage + 1;
    }
    
    public int getPageSize() {
        return pageSize;
    }
    
    public int getTotalPages() {
        return (int) Math.ceil((double) allVehicles.size() / pageSize);
    }
    
    public boolean hasNextPage() {
        return (currentPage + 1) < getTotalPages();
    }
    
    public boolean hasPreviousPage() {
        return currentPage > 0;
    }
    
    public List<VehicleEntity> nextPage() {
        if (!hasNextPage()) {
            return List.of();
        }
        return getPage(currentPage + 2);
    }
    
    public List<VehicleEntity> previousPage() {
        if (!hasPreviousPage()) {
            return List.of();
        }
        return getPage(currentPage);
    }
}