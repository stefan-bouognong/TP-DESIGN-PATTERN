package com.example.drive_deal.domain.iterator;

import com.example.drive_deal.entity.VehicleEntity;
import java.util.List;

public interface CatalogIterator {
    boolean hasNext();
    
    VehicleEntity next();
    
    VehicleEntity current();
    
    void reset();
    
    int getPosition();
    
    int getTotal();
    
    List<VehicleEntity> getBatch(int batchSize);
    
    List<VehicleEntity> getAllRemaining();
}