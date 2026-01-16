package com.example.drive_deal.domain.iterator;

import com.example.drive_deal.entity.VehicleEntity;
import java.util.List;

public interface CatalogIterator {
    // Vérifie s'il y a un élément suivant
    boolean hasNext();
    
    // Récupère l'élément suivant
    VehicleEntity next();
    
    // Récupère l'élément courant
    VehicleEntity current();
    
    // Réinitialise l'itérateur
    void reset();
    
    // Récupère la position courante
    int getPosition();
    
    // Récupère le nombre total d'éléments
    int getTotal();
    
    // Récupère un batch d'éléments
    List<VehicleEntity> getBatch(int batchSize);
    
    // Récupère tous les éléments restants
    List<VehicleEntity> getAllRemaining();
}