package com.example.drive_deal.domain.iterator;

import java.util.List;

public interface CatalogCollection {
    CatalogIterator createSequentialIterator();
    
    CatalogIterator createFilteredIterator(IteratorFilter filter);
    
    CatalogIterator createPaginatedIterator(int pageSize);
    
    CatalogIterator createSortedIterator(IteratorType sortType);
    
    List<?> getAllItems();
    
    int getTotalItems();
}