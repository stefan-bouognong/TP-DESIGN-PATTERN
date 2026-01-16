package com.example.drive_deal.domain.iterator;

import java.util.List;

public interface CatalogCollection {
    // Crée un itérateur séquentiel
    CatalogIterator createSequentialIterator();
    
    // Crée un itérateur avec filtres
    CatalogIterator createFilteredIterator(IteratorFilter filter);
    
    // Crée un itérateur paginé
    CatalogIterator createPaginatedIterator(int pageSize);
    
    // Crée un itérateur avec tri
    CatalogIterator createSortedIterator(IteratorType sortType);
    
    // Récupère tous les éléments
    List<?> getAllItems();
    
    // Récupère le nombre total d'éléments
    int getTotalItems();
}