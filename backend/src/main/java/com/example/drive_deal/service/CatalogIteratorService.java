package com.example.drive_deal.service;

import com.example.drive_deal.domain.iterator.*;
import com.example.drive_deal.dto.CatalogPageDTO;
import com.example.drive_deal.dto.IteratorFilterDTO;
import com.example.drive_deal.dto.VehicleBatchDTO;
import com.example.drive_deal.entity.VehicleEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class CatalogIteratorService {
    
    @Autowired
    private VehicleCatalog vehicleCatalog;
    
    // Cache pour les itérateurs actifs (par session/utilisateur)
    private final Map<String, CatalogIterator> activeIterators = new ConcurrentHashMap<>();
    
    /**
     * Crée un nouvel itérateur pour une session
     */
    public String createIterator(IteratorType type, IteratorFilter filter, Integer pageSize) {
        String iteratorId = UUID.randomUUID().toString();
        
        CatalogIterator iterator = vehicleCatalog.createIterator(type, filter, pageSize);
        activeIterators.put(iteratorId, iterator);
        
        log.info("Itérateur créé: id={}, type={}, total={}", iteratorId, type, iterator.getTotal());
        return iteratorId;
    }
    
    /**
     * Récupère le prochain élément d'un itérateur
     */
    public VehicleEntity getNext(String iteratorId) {
        CatalogIterator iterator = activeIterators.get(iteratorId);
        if (iterator == null) {
            log.warn("Itérateur non trouvé: {}", iteratorId);
            return null;
        }
        
        VehicleEntity vehicle = iterator.next();
        if (vehicle == null) {
            log.debug("Itérateur {}: fin atteinte", iteratorId);
        }
        
        return vehicle;
    }
    
    /**
     * Récupère un batch d'éléments
     */
    public List<VehicleEntity> getBatch(String iteratorId, int batchSize) {
        CatalogIterator iterator = activeIterators.get(iteratorId);
        if (iterator == null) {
            return List.of();
        }
        
        return iterator.getBatch(batchSize);
    }
    
    /**
     * Récupère une page spécifique (pour pagination)
     */
    public CatalogPageDTO getPage(IteratorFilterDTO filterDTO, int pageNumber, int pageSize) {
        // Convertir DTO en filter
        IteratorFilter filter = convertToFilter(filterDTO);
        
        // Créer un itérateur paginé
        PaginatedIterator iterator = (PaginatedIterator) vehicleCatalog.createPaginatedIterator(pageSize);
        
        // Récupérer la page demandée
        List<VehicleEntity> pageContent = iterator.getPage(pageNumber);
        
        // Compter le total avec filtres
        long totalElements = vehicleCatalog.countByFilter(filter);
        
        log.info("Page récupérée: page={}, size={}, total={}, éléments={}", 
                pageNumber, pageSize, totalElements, pageContent.size());
        
        return CatalogPageDTO.of(pageNumber, pageSize, totalElements, pageContent);
    }
    
    /**
     * Parcourt séquentiellement avec filtres
     */
    public List<VehicleEntity> iterateWithFilters(IteratorFilterDTO filterDTO, int limit) {
        IteratorFilter filter = convertToFilter(filterDTO);
        
        // Créer itérateur filtré
        FilteredIterator iterator = (FilteredIterator) vehicleCatalog.createFilteredIterator(filter);
        
        // Récupérer les éléments (avec limite)
        List<VehicleEntity> result;
        if (limit > 0) {
            result = iterator.getBatch(limit);
        } else {
            result = iterator.getAllRemaining();
        }
        
        log.info("Itération filtrée: filtres={}, limit={}, résultats={}", 
                filterDTO, limit, result.size());
        
        return result;
    }
    
    /**
     * Réinitialise un itérateur
     */
    public void resetIterator(String iteratorId) {
        CatalogIterator iterator = activeIterators.get(iteratorId);
        if (iterator != null) {
            iterator.reset();
            log.debug("Itérateur réinitialisé: {}", iteratorId);
        }
    }
    
    /**
     * Supprime un itérateur
     */
    public void removeIterator(String iteratorId) {
        activeIterators.remove(iteratorId);
        log.debug("Itérateur supprimé: {}", iteratorId);
    }
    
    /**
     * Récupère les informations d'un itérateur
     */
    public Map<String, Object> getIteratorInfo(String iteratorId) {
        CatalogIterator iterator = activeIterators.get(iteratorId);
        if (iterator == null) {
            return Map.of("error", "Itérateur non trouvé");
        }
        
        Map<String, Object> info = new HashMap<>();
        info.put("iteratorId", iteratorId);
        info.put("position", iterator.getPosition());
        info.put("total", iterator.getTotal());
        info.put("hasNext", iterator.hasNext());
        
        if (iterator instanceof VehicleIterator) {
            info.put("type", ((VehicleIterator) iterator).getIteratorType());
        } else if (iterator instanceof FilteredIterator) {
            info.put("type", "FILTERED");
            info.put("filter", ((FilteredIterator) iterator).getFilter());
        } else if (iterator instanceof PaginatedIterator) {
            PaginatedIterator paginated = (PaginatedIterator) iterator;
            info.put("type", "PAGINATED");
            info.put("pageSize", paginated.getPageSize());
            info.put("currentPage", paginated.getCurrentPage());
            info.put("totalPages", paginated.getTotalPages());
            info.put("hasNextPage", paginated.hasNextPage());
            info.put("hasPreviousPage", paginated.hasPreviousPage());
        }
        
        return info;
    }
    
    /**
     * Liste tous les itérateurs actifs
     */
    public Map<String, Map<String, Object>> listActiveIterators() {
        Map<String, Map<String, Object>> result = new HashMap<>();
        
        activeIterators.forEach((id, iterator) -> {
            Map<String, Object> info = new HashMap<>();
            info.put("position", iterator.getPosition());
            info.put("total", iterator.getTotal());
            info.put("className", iterator.getClass().getSimpleName());
            result.put(id, info);
        });
        
        return result;
    }
    
    /**
     * Récupère des statistiques d'itération
     */
    public Map<String, Object> getIterationStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("activeIterators", activeIterators.size());
        stats.put("totalVehicles", vehicleCatalog.getTotalItems());
        
        Map<String, Long> iteratorTypes = new HashMap<>();
        activeIterators.values().forEach(iterator -> {
            String type = iterator.getClass().getSimpleName();
            iteratorTypes.put(type, iteratorTypes.getOrDefault(type, 0L) + 1);
        });
        
        stats.put("iteratorTypes", iteratorTypes);
        return stats;
    }
    
    /**
     * Convertit IteratorFilterDTO en IteratorFilter
     */
    private IteratorFilter convertToFilter(IteratorFilterDTO dto) {
        if (dto == null) {
            return null;
        }
        
        IteratorFilter filter = new IteratorFilter();
        filter.setVehicleTypes(dto.getVehicleTypes());
        filter.setMinPrice(dto.getMinPrice());
        filter.setMaxPrice(dto.getMaxPrice());
        filter.setBrands(dto.getBrands());
        filter.setInStock(dto.getInStock());
        filter.setOnSale(dto.getOnSale());
        filter.setSearchKeyword(dto.getSearchKeyword());
        filter.setMinYear(dto.getMinYear());
        filter.setMaxYear(dto.getMaxYear());
        
        return filter;
    }
}